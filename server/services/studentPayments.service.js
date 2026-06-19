import crypto from "node:crypto";
import querystring from "node:querystring";
import db from "../db.js";

const VNPAY_VERSION = "2.1.0";
const VNPAY_COMMAND = "pay";
const VNPAY_CURRENCY = "VND";
const VNPAY_LOCALE = "vn";
const VNPAY_ORDER_TYPE = "other";

function getVnpayConfig() {
  return {
    hashSecret: process.env.VNPAY_HASH_SECRET,
    paymentUrl: process.env.VNPAY_PAYMENT_URL,
    returnUrl: process.env.VNPAY_RETURN_URL,
    tmnCode: process.env.VNPAY_TMN_CODE,
  };
}

function formatVnpayDate(date = new Date()) {
  const pad = (value) => String(value).padStart(2, "0");

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join("");
}

function sortObject(source) {
  return Object.keys(source)
    .sort()
    .reduce((result, key) => {
      const value = source[key];

      if (value !== undefined && value !== null && value !== "") {
        result[key] = value;
      }

      return result;
    }, {});
}

function createSecureHash(params, hashSecret) {
  const sortedParams = sortObject(params);
  const signData = querystring.stringify(sortedParams, null, null, {
    encodeURIComponent: querystring.unescape,
  });

  return crypto
    .createHmac("sha512", hashSecret)
    .update(Buffer.from(signData, "utf-8"))
    .digest("hex");
}

function getClientIp(req) {
  const forwardedFor = req.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.socket?.remoteAddress?.replace("::ffff:", "") ?? "127.0.0.1";
}

async function getActiveCartItems(connection, studentId) {
  const [rows] = await connection.execute(
    `SELECT
       cart.cart_id,
       ci.cart_item_id,
       ci.batch_id,
       ci.price_snapshot,
       cb.batch_code,
       cb.batch_name,
       c.course_name
     FROM carts cart
     INNER JOIN cart_items ci ON ci.cart_id = cart.cart_id
     INNER JOIN course_batches cb ON cb.batch_id = ci.batch_id
     INNER JOIN courses c ON c.course_id = cb.course_id
     WHERE cart.student_id = ?
       AND cart.status = 'ACTIVE'
     ORDER BY ci.cart_item_id ASC`,
    [studentId],
  );

  return rows;
}

export async function createStudentVnpayPayment(studentId, req) {
  const config = getVnpayConfig();

  if (!config.tmnCode || !config.hashSecret || !config.paymentUrl || !config.returnUrl) {
    return {
      ok: false,
      status: 500,
      message: "Chưa cấu hình VNPAY trên backend.",
    };
  }

  const connection = await db.getConnection();

  try {
    const cartItems = await getActiveCartItems(connection, studentId);

    if (!cartItems.length) {
      return {
        ok: false,
        status: 400,
        message: "Giỏ hàng đang trống, chưa thể thanh toán.",
      };
    }

    const cartId = cartItems[0].cart_id;
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + Number(item.price_snapshot ?? 0),
      0,
    );

    if (totalAmount <= 0) {
      return {
        ok: false,
        status: 400,
        message: "Tổng thanh toán không hợp lệ.",
      };
    }

    const txnRef = `CART${cartId}U${studentId}T${Date.now()}`;
    const createDate = formatVnpayDate();
    const expireDate = formatVnpayDate(new Date(Date.now() + 15 * 60 * 1000));
    const orderInfo = `Thanh toan gio hang ${cartId}`;
    const vnpParams = {
      vnp_Amount: Math.round(totalAmount) * 100,
      vnp_Command: VNPAY_COMMAND,
      vnp_CreateDate: createDate,
      vnp_CurrCode: VNPAY_CURRENCY,
      vnp_ExpireDate: expireDate,
      vnp_IpAddr: getClientIp(req),
      vnp_Locale: VNPAY_LOCALE,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: VNPAY_ORDER_TYPE,
      vnp_ReturnUrl: config.returnUrl,
      vnp_TmnCode: config.tmnCode,
      vnp_TxnRef: txnRef,
      vnp_Version: VNPAY_VERSION,
    };
    const secureHash = createSecureHash(vnpParams, config.hashSecret);
    const signedParams = sortObject({
      ...vnpParams,
      vnp_SecureHash: secureHash,
    });
    const paymentUrl = `${config.paymentUrl}?${querystring.stringify(signedParams, null, null, {
      encodeURIComponent: querystring.unescape,
    })}`;

    return {
      ok: true,
      data: {
        amount: totalAmount,
        cartId,
        itemCount: cartItems.length,
        paymentUrl,
        txnRef,
      },
    };
  } finally {
    connection.release();
  }
}

function parseCartIdFromTxnRef(txnRef) {
  const match = String(txnRef ?? "").match(/^CART(\d+)U(\d+)T\d+$/);

  if (!match) {
    return null;
  }

  return {
    cartId: Number(match[1]),
    studentId: Number(match[2]),
  };
}

export async function verifyStudentVnpayReturn(studentId, query) {
  const config = getVnpayConfig();

  if (!config.hashSecret) {
    return {
      ok: false,
      status: 500,
      message: "Chưa cấu hình VNPAY trên backend.",
    };
  }

  const receivedHash = query.vnp_SecureHash;
  const verifyParams = { ...query };
  delete verifyParams.vnp_SecureHash;
  delete verifyParams.vnp_SecureHashType;

  const expectedHash = createSecureHash(verifyParams, config.hashSecret);

  if (!receivedHash || String(receivedHash).toLowerCase() !== expectedHash.toLowerCase()) {
    return {
      ok: false,
      status: 400,
      message: "Chữ ký VNPAY không hợp lệ.",
    };
  }

  const txnRef = String(query.vnp_TxnRef ?? "");
  const parsedRef = parseCartIdFromTxnRef(txnRef);

  if (!parsedRef || parsedRef.studentId !== studentId) {
    return {
      ok: false,
      status: 400,
      message: "Mã giao dịch không khớp với học viên hiện tại.",
    };
  }

  const isSuccess =
    query.vnp_ResponseCode === "00" &&
    (query.vnp_TransactionStatus === undefined || query.vnp_TransactionStatus === "00");

  if (!isSuccess) {
    return {
      ok: true,
      data: {
        amount: Number(query.vnp_Amount ?? 0) / 100,
        enrolledCount: 0,
        message: "Thanh toán chưa thành công hoặc đã bị hủy.",
        responseCode: query.vnp_ResponseCode,
        status: "FAILED",
        txnRef,
      },
    };
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [cartRows] = await connection.execute(
      `SELECT cart_id
       FROM carts
       WHERE cart_id = ? AND student_id = ? AND status = 'ACTIVE'
       LIMIT 1`,
      [parsedRef.cartId, studentId],
    );

    if (!cartRows.length) {
      const [existingPayments] = await connection.execute(
        `SELECT COUNT(*) AS paymentCount
         FROM payments
         WHERE student_id = ? AND transaction_code LIKE ?`,
        [studentId, `${txnRef}-%`],
      );

      await connection.commit();

      return {
        ok: true,
        data: {
          amount: Number(query.vnp_Amount ?? 0) / 100,
          enrolledCount: Number(existingPayments[0]?.paymentCount ?? 0),
          message: "Giao dịch đã được xử lý trước đó.",
          responseCode: query.vnp_ResponseCode,
          status: "SUCCESS",
          txnRef,
        },
      };
    }

    const [items] = await connection.execute(
      `SELECT cart_item_id, batch_id, price_snapshot
       FROM cart_items
       WHERE cart_id = ?
       ORDER BY cart_item_id ASC`,
      [parsedRef.cartId],
    );

    if (!items.length) {
      await connection.rollback();

      return {
        ok: false,
        status: 400,
        message: "Giỏ hàng không còn khóa học để ghi danh.",
      };
    }

    for (const item of items) {
      const transactionCode = `${txnRef}-${item.cart_item_id}`;

      await connection.execute(
        `INSERT INTO payments
          (student_id, batch_id, amount, payment_method, payment_status, transaction_code, paid_at)
         VALUES (?, ?, ?, 'VNPAY', 'SUCCESS', ?, NOW())
         ON DUPLICATE KEY UPDATE
          payment_status = 'SUCCESS',
          paid_at = VALUES(paid_at)`,
        [studentId, item.batch_id, item.price_snapshot, transactionCode],
      );

      await connection.execute(
        `INSERT INTO enrollments
          (student_id, batch_id, enrolled_at, status, progress_percent)
         VALUES (?, ?, NOW(), 'ACTIVE', 0)
         ON DUPLICATE KEY UPDATE
          status = IF(status = 'COMPLETED', status, 'ACTIVE')`,
        [studentId, item.batch_id],
      );
    }

    await connection.execute(`DELETE FROM cart_items WHERE cart_id = ?`, [
      parsedRef.cartId,
    ]);

    await connection.commit();

    return {
      ok: true,
      data: {
        amount: Number(query.vnp_Amount ?? 0) / 100,
        enrolledCount: items.length,
        message: "Thanh toán thành công, khóa học đã được thêm vào tài khoản.",
        responseCode: query.vnp_ResponseCode,
        status: "SUCCESS",
        txnRef,
      },
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
