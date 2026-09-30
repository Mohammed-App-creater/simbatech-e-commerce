/* Payment brand logos (files in public/images/pay/). Heights are tuned per logo so they read the same size. */
const LOGOS = {
  telebirr: { src: "/images/pay/telebirr.png", alt: "telebirr", height: 22 },
  visa: { src: "/images/pay/visa.svg", alt: "Visa", height: 12 },
  mastercard: { src: "/images/pay/mastercard.svg", alt: "Mastercard", height: 18 },
};

export default function PayLogo({ brand, scale = 1 }) {
  const logo = LOGOS[String(brand || "").toLowerCase()];
  if (!logo) return null;
  return <img src={logo.src} alt={logo.alt} style={{ display: "block", height: logo.height * scale + "px", width: "auto" }} />;
}

export const hasPayLogo = (brand) => !!LOGOS[String(brand || "").toLowerCase()];

const BADGE = {
  height: "30px",
  padding: "0 12px",
  display: "flex",
  alignItems: "center",
  borderRadius: "8px",
  border: "1px solid #EFEDE8",
  background: "#FFFFFF",
};

/* The "We accept" row: Telebirr, Visa, Mastercard. */
export function PayBadges({ style }) {
  return (
    <div style={{ display: "flex", gap: "8px", ...style }} aria-label="Accepted payment methods">
      {["telebirr", "visa", "mastercard"].map((b) => (
        <span key={b} style={BADGE}>
          <PayLogo brand={b} />
        </span>
      ))}
    </div>
  );
}
