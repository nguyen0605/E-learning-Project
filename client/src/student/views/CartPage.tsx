import Icon from "../components/Icon";
import WishlistItem from "../components/WishlistItem";
import { courseImages } from "../data/courseData";

const cartItems = [
  ["Advanced Cybersecurity Architectures", "Technology", "$124.00", "$189.00", courseImages[0]],
  ["Data Analytics: The Strategic Narrative", "Business", "$89.00", "", courseImages[2]],
] as const;

function CartPage() {
  return (
    <main className="sp-cart-page">
      <section>
        <h1>Giỏ hàng</h1>
        <p>Bạn đã chọn 2 khóa học để nâng cao kiến thức và kỹ năng.</p>

        {cartItems.map(([title, tag, price, oldPrice, image]) => (
          <article className="sp-cart-item" key={title}>
            <img src={image} alt={title} />

            <div>
              <span>{tag}</span>

              <h2>{title}</h2>

              <p>Giảng viên: TS. Marcus Thorne • Thời lượng: 12 tuần</p>

              <div>
                <button type="button">
                  <Icon name="delete" /> Xóa khỏi giỏ hàng
                </button>

                <button type="button">
                  <Icon name="favorite" /> Lưu để học sau
                </button>
              </div>
            </div>

            <strong>
              {price}
              <small>{oldPrice}</small>
            </strong>
          </article>
        ))}

        <div className="sp-wishlist">
          <h2>
            Khóa học yêu thích
            <button type="button">Xem tất cả</button>
          </h2>

          <div>
            <WishlistItem
              title="Tâm lý học trong thiết kế giao diện"
              price="$45.00"
              image={courseImages[1]}
            />

            <WishlistItem
              title="Kinh tế học toàn cầu cơ bản"
              price="$62.00"
              image={courseImages[2]}
            />
          </div>
        </div>
      </section>

      <aside className="sp-order-card">
        <h2>Tóm tắt đơn hàng</h2>

        <p>
          <span>Giá gốc</span>
          <strong>$278.00</strong>
        </p>

        <p className="discount">
          <span>Giảm giá</span>
          <strong>-$65.00</strong>
        </p>

        <p>
          <span>Thuế (5%)</span>
          <strong>$10.65</strong>
        </p>

        <hr />

        <p className="total">
          <span>Tổng thanh toán</span>
          <strong>$223.65</strong>
        </p>

        <label>Mã giảm giá</label>

        <div className="sp-coupon">
          <input value="SCHOLAR20" readOnly />
          <button type="button">Áp dụng</button>
        </div>

        <button className="sp-checkout" type="button">
          Tiến hành thanh toán
        </button>

        <small>Cam kết hoàn tiền trong vòng 30 ngày</small>
      </aside>
    </main>
  );
}

export default CartPage;