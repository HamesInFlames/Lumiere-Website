// src/lib/hanukkah.js
// All content for the Hanukkah pre-order page (/hanukkah) in one place.
// Pure JS (no JSX / DOM): imported by src/pages/Hanukkah.jsx AND by
// scripts/prerender.js under plain Node.

// >>> PASTE THE GOOGLE FORM URL HERE <<<
// Once this is set, every "Pre-order now" button links to the form in a new tab.
// While it is an empty string, buttons show a disabled "Pre-orders open soon" state.
export const HANUKKAH_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdW6JbpyMUD_k6a8jj68ViyUmIPnR57jVafjx6tm9PZ1CdkIA/viewform";

export const HANUKKAH_TITLE = "Hanukkah 2026 sufganiyot pre-order";
export const HANUKKAH_INTRO = "Hanukkah sufganiyot / donuts. Pre-order only, pay at pickup in the shop.";

// Image files live in public/images/hanukkah/<slug>.webp (800px), <slug>-400.webp
// and <slug>.jpg (800px; the Google Form script fetches the .jpg by slug).
export const IMAGE_BASE = "/images/hanukkah";

export const HANUKKAH_TIERS = [
  {
    id: "classic",
    label: "Classic",
    price: 3.95,
    flavours: [
      { slug: "strawberry", name: "Strawberry" },
      { slug: "chocolate", name: "Chocolate" },
      { slug: "dulce-de-leche", name: "Dulce de Leche" },
    ],
  },
  {
    id: "fancy",
    label: "Fancy",
    price: 7.25,
    flavours: [
      { slug: "dubai", name: "Dubai" },
      { slug: "creme-brulee", name: "Crème Brûlée" },
      { slug: "cookies-and-cream", name: "Cookies & Cream" },
      { slug: "blackcurrant", name: "Blackcurrant" },
      { slug: "halva", name: "Halva" },
      { slug: "pistachio", name: "Pistachio" },
      { slug: "black-forest", name: "Black Forest" },
      { slug: "raspberry-cheesecake", name: "Raspberry Cheesecake" },
    ],
  },
];

// Pickup days, 2026. `closed` days are shown but not available.
export const HANUKKAH_DAYS = [
  { label: "Fri Dec 4" },
  { label: "Sat Dec 5" },
  { label: "Sun Dec 6" },
  { label: "Mon Dec 7 closed", closed: true },
  { label: "Tue Dec 8" },
  { label: "Wed Dec 9" },
  { label: "Thu Dec 10" },
  { label: "Fri Dec 11" },
];

export const HANUKKAH_STEPS = [
  { title: "Choose your flavours", text: "Classic $3.95 each, Fancy $7.25 each." },
  { title: "Pick a pickup day", text: "Dec 4–6 and Dec 8–11. Order at least 2 days ahead." },
  { title: "Pay at pickup", text: "Pay in the shop. A confirmation email is sent after you order." },
];

export const HANUKKAH_NOTE = {
  title: "Order at least 2 days before pickup",
  text: "For Friday Dec 4, order by end of day Wednesday Dec 2.",
};

export const HANUKKAH_CLOSING = {
  title: "Pre-order only. Pay at pickup in the shop.",
  text: "Pickup Dec 4 – Dec 11, closed Monday Dec 7. Open 9 am – 7 pm.",
};

export const formatTierPrice = (n) => `$${n.toFixed(2)}`;

/** Flat list of flavours with tier info, in display order. */
export const HANUKKAH_FLAVOURS = HANUKKAH_TIERS.flatMap((t) =>
  t.flavours.map((f) => ({ ...f, tier: t.label, price: t.price }))
);
