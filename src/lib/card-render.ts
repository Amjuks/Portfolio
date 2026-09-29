import satori from "satori";
import QRCode from "qrcode";
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import {
  card,
  cardContacts,
  CARD_WIDTH,
  CARD_HEIGHT,
  contactLayout,
} from "./card-data";
const require = createRequire(import.meta.url);
type Style = Record<string, string | number>;
const text = (content: string, style: Style) => ({
  type: "div",
  props: {
    style: { position: "absolute", display: "flex", ...style },
    children: content,
  },
});
async function render() {
  const fonts = await Promise.all(
    ([400, 500, 600] as const).map(async (weight) => ({
      name: "Geist",
      weight,
      style: "normal" as const,
      data: await readFile(
        require.resolve(
          `@fontsource/geist/files/geist-latin-${weight}-normal.woff`,
        ),
      ),
    })),
  );
  const qr = await QRCode.toDataURL(card.qr_destination, {
    errorCorrectionLevel: "M",
    margin: 4,
    width: 720,
    color: { dark: "#0c0d13", light: "#ffffff" },
  });
  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          display: "flex",
          position: "relative",
          backgroundColor: "#0c0d13",
          color: "#f2f2f6",
          fontFamily: "Geist",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                left: 0,
                top: 0,
                width: 6,
                height: 600,
                backgroundColor: "#a6a0e8",
              },
            },
          },
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                right: 38,
                top: 38,
                width: 42,
                height: 42,
                borderTop: "1px solid #343340",
                borderRight: "1px solid #343340",
              },
            },
          },
          text(card.name, {
            left: 72,
            top: 65,
            width: 906,
            fontSize: 48,
            fontWeight: 600,
            letterSpacing: -2,
            lineHeight: 1.15,
          }),
          text(card.title, {
            left: 74,
            top: 137,
            width: 900,
            fontSize: 22,
            fontWeight: 500,
            color: "#b5afe9",
            letterSpacing: 0.2,
          }),
          text(card.tagline, {
            left: 74,
            top: 207,
            width: 780,
            fontSize: 23,
            fontWeight: 400,
            lineHeight: 1.55,
            color: "#adb0bd",
          }),
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                left: 74,
                right: 74,
                top: 339,
                height: 1,
                backgroundColor: "#2b2c35",
              },
            },
          },
          ...cardContacts.map((contact, i) =>
            text(contact.text, {
              left: contactLayout.left + 2,
              top: contactLayout.top + i * contactLayout.height,
              width: contactLayout.width,
              fontSize: 19,
              lineHeight: 1.6,
              fontWeight: 400,
              color: i === 0 ? "#f2f2f6" : "#c2c4ce",
            }),
          ),
          {
            type: "img",
            props: {
              src: qr,
              width: 180,
              height: 180,
              style: { position: "absolute", right: 74, top: 367 },
            },
          },
        ],
      },
    },
    { width: CARD_WIDTH, height: CARD_HEIGHT, fonts },
  );
  return svg;
}
let svg: Promise<string> | undefined;
export const cardSvg = () => (svg ??= render());
export async function cardPng() {
  return sharp(Buffer.from(await cardSvg()), { density: 144 })
    .resize(2100, 1200)
    .png()
    .withMetadata({ density: 300 })
    .toBuffer();
}
