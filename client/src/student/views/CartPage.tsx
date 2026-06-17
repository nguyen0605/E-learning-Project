import { useEffect, useState } from "react";
import Icon from "../components/Icon";
import { getCart, removeCartItem } from "../services/studentCartApi";
import type { StudentCart } from "../types/cart.types";

const fallbackImage =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    currency: "VND",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN").format(new Date(value));
}

function getCourseImage(thumbnailUrl: string | null) {
  return thumbnailUrl?.startsWith("http") ? thumbnailUrl : fallbackImage;
}

function CartPage() {
  const [cart, setCart] = useState<StudentCart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState<number | null>(null);

  async function loadCart() {
    setIsLoading(true);
    setError("");

    try {
      const nextCart = await getCart();
      setCart(nextCart);
    } catch (cartError) {
      setError(
        cartError instanceof Error
          ? cartError.message
          : "Không thể tải giỏ hàng.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadCart();
  }, []);

  async function handleRemoveItem(cartItemId: number) {
    setRemovingId(cartItemId);
    setError("");

    try {
      await removeCartItem(cartItemId);
      await loadCart();
    } catch (removeError) {
      setError(
        removeError instanceof Error
          ? removeError.message
          : "Không thể xóa khóa học khỏi giỏ hàng.",
      );
    } finally {
      setRemovingId(null);
    }
  }

  const items = cart?.items ?? [];
  const summary = cart?.summary ?? {
    discount: 0,
    itemCount: 0,
    subtotal: 0,
    tax: 0,
    total: 0,
  };

  return (
    <main className="sp-cart-page">
      <section>
        <h1>Giỏ hàng</h1>
        <p>
          Bạn đã chọn {summary.itemCount} khóa học để nâng cao kiến thức và kỹ
          năng.
        </p>

        {isLoading ? <p className="sp-state-line">Đang tải giỏ hàng...</p> : null}
        {error ? <p className="sp-state-line error">{error}</p> : null}

        {!isLoading && !error && items.length === 0 ? (
          <div className="sp-empty-cart">
            <Icon name="shopping_cart" />
            <h2>Giỏ hàng đang trống</h2>
            <p>Hãy mở một khóa học và bấm “Thêm vào giỏ hàng”.</p>
          </div>
        ) : null}

        {items.map((item) => (
          <article className="sp-cart-item" key={item.id}>
            <img src={getCourseImage(item.course.thumbnailUrl)} alt={item.course.name} />

            <div>
              <span>{item.category.name}</span>

              <h2>{item.course.name}</h2>

              <p>
                Giảng viên: {item.teacher.fullName} • Lớp: {item.batch.name} •{" "}
                {formatDate(item.batch.startDate)} - {formatDate(item.batch.endDate)}
              </p>

              <div>
                <button
                  disabled={removingId === item.id}
                  onClick={() => void handleRemoveItem(item.id)}
                  type="button"
                >
                  <Icon name="delete" />{" "}
                  {removingId === item.id ? "Đang xóa..." : "Xóa khỏi giỏ hàng"}
                </button>
              </div>
            </div>

            <strong>{formatCurrency(item.priceSnapshot)}</strong>
          </article>
        ))}
      </section>

      <aside className="sp-order-card">
        <h2>Tóm tắt đơn hàng</h2>

        <p>
          <span>Tạm tính</span>
          <strong>{formatCurrency(summary.subtotal)}</strong>
        </p>

        <p className="discount">
          <span>Giảm giá</span>
          <strong>-{formatCurrency(summary.discount)}</strong>
        </p>

        <p>
          <span>Thuế</span>
          <strong>{formatCurrency(summary.tax)}</strong>
        </p>

        <hr />

        <p className="total">
          <span>Tổng thanh toán</span>
          <strong>{formatCurrency(summary.total)}</strong>
        </p>

        <button className="sp-checkout" disabled={items.length === 0} type="button">
          Tiến hành thanh toán
        </button>

        <small>Giỏ hàng được lưu theo tài khoản học viên của bạn.</small>
      </aside>
    </main>
  );
}

export default CartPage;
