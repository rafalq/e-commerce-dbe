export function formatPrice(price: number) {
  const formattedPrice = Number((price / 100).toFixed(2));
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
  }).format(formattedPrice);
}
