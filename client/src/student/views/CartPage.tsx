import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getIntlLocale } from "../../i18n/locale";
import Icon from "../components/Icon";
import { getCart, removeCartItem } from "../services/studentCartApi";
import type { StudentCart } from "../types/cart.types";

const fallbackImage =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80";

function formatCurrency(value: number, language: string | undefined) {
  return new Intl.NumberFormat(getIntlLocale(language), {
    currency: "VND",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function formatDate(value: string, language: string | undefined) {
  return new Intl.DateTimeFormat(getIntlLocale(language)).format(new Date(value));
}

function getCourseImage(thumbnailUrl: string | null) {
  return thumbnailUrl?.startsWith("http") ? thumbnailUrl : fallbackImage;
}

function CartPage() {
  const { t, i18n } = useTranslation("student");
  const language = i18n.resolvedLanguage;
  const [cart, setCart] = useState<StudentCart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState<number | null>(null);

  const loadCart = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const nextCart = await getCart();
      setCart(nextCart);
    } catch {
      setError(t("cart.loadError"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadCart();
  }, [loadCart]);

  async function handleRemoveItem(cartItemId: number) {
    setRemovingId(cartItemId);
    setError("");

    try {
      await removeCartItem(cartItemId);
      await loadCart();
    } catch {
      setError(t("cart.removeError"));
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
        <h1>{t("cart.title")}</h1>
        <p>{t("cart.description", { count: summary.itemCount })}</p>

        {isLoading ? <p className="sp-state-line">{t("cart.loading")}</p> : null}
        {error ? <p className="sp-state-line error">{error}</p> : null}

        {!isLoading && !error && items.length === 0 ? (
          <div className="sp-empty-cart">
            <Icon name="shopping_cart" />
            <h2>{t("cart.emptyTitle")}</h2>
            <p>{t("cart.emptyDescription")}</p>
          </div>
        ) : null}

        {items.map((item) => (
          <article className="sp-cart-item" key={item.id}>
            <img src={getCourseImage(item.course.thumbnailUrl)} alt={item.course.name} />
            <div>
              <span>{item.category.name}</span>
              <h2>{item.course.name}</h2>
              <p>
                {t("cart.teacher")}: {item.teacher.fullName} • {t("cart.class")}:{" "}
                {item.batch.name} • {formatDate(item.batch.startDate, language)} -{" "}
                {formatDate(item.batch.endDate, language)}
              </p>
              <div>
                <button
                  disabled={removingId === item.id}
                  onClick={() => void handleRemoveItem(item.id)}
                  type="button"
                >
                  <Icon name="delete" />{" "}
                  {removingId === item.id ? t("cart.removing") : t("cart.remove")}
                </button>
              </div>
            </div>
            <strong>{formatCurrency(item.priceSnapshot, language)}</strong>
          </article>
        ))}
      </section>

      <aside className="sp-order-card">
        <h2>{t("cart.summaryTitle")}</h2>
        <p>
          <span>{t("cart.subtotal")}</span>
          <strong>{formatCurrency(summary.subtotal, language)}</strong>
        </p>
        <p className="discount">
          <span>{t("cart.discount")}</span>
          <strong>-{formatCurrency(summary.discount, language)}</strong>
        </p>
        <p>
          <span>{t("cart.tax")}</span>
          <strong>{formatCurrency(summary.tax, language)}</strong>
        </p>
        <hr />
        <p className="total">
          <span>{t("cart.total")}</span>
          <strong>{formatCurrency(summary.total, language)}</strong>
        </p>
        <button className="sp-checkout" disabled={items.length === 0} type="button">
          {t("cart.checkout")}
        </button>
        <small>{t("cart.accountNote")}</small>
      </aside>
    </main>
  );
}

export default CartPage;
