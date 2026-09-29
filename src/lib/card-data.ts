import data from "../../portfolio_data.json";
export const card = data.networking_card;
export const CARD_WIDTH = 1050;
export const CARD_HEIGHT = 600;
export const displayUrl = (url: string) =>
  url.replace(/^https?:\/\//, "").replace(/\/$/, "");
export const cardContacts = [
  { text: card.email, href: `mailto:${card.email}` },
  { text: displayUrl(card.linkedin), href: card.linkedin },
  { text: displayUrl(card.github), href: card.github },
  { text: displayUrl(card.portfolio), href: card.portfolio },
];
export const contactLayout = { left: 72, top: 374, height: 36, width: 680 };
