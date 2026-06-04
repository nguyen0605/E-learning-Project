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
        <h1>Your Learning Cart</h1>
        <p>2 courses selected for your intellectual growth.</p>
        {cartItems.map(([title, tag, price, oldPrice, image]) => (
          <article className="sp-cart-item" key={title}>
            <img src={image} alt={title} />
            <div>
              <span>{tag}</span>
              <h2>{title}</h2>
              <p>by Dr. Marcus Thorne â€¢ 12 Weeks</p>
              <div>
                <button type="button">
                  <Icon name="delete" /> Remove
                </button>
                <button type="button">
                  <Icon name="favorite" /> Save for later
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
            From Your Wishlist <button type="button">View All</button>
          </h2>
          <div>
            <WishlistItem
              title="Interface Psychology"
              price="$45.00"
              image={courseImages[1]}
            />
            <WishlistItem
              title="Global Economics 101"
              price="$62.00"
              image={courseImages[2]}
            />
          </div>
        </div>
      </section>
      <aside className="sp-order-card">
        <h2>Order Summary</h2>
        <p>
          <span>Original Price</span>
          <strong>$278.00</strong>
        </p>
        <p className="discount">
          <span>Discounts</span>
          <strong>-$65.00</strong>
        </p>
        <p>
          <span>Tax (5%)</span>
          <strong>$10.65</strong>
        </p>
        <hr />
        <p className="total">
          <span>Total</span>
          <strong>$223.65</strong>
        </p>
        <label>Coupon Code</label>
        <div className="sp-coupon">
          <input value="SCHOLAR20" readOnly />
          <button type="button">Apply</button>
        </div>
        <button className="sp-checkout" type="button">
          Proceed to Checkout
        </button>
        <small>30-Day Money Back Guarantee</small>
      </aside>
    </main>
  );
}

export default CartPage;
