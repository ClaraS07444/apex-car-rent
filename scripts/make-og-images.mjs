// Erzeugt die Open-Graph-Bilder (1200 x 630, PRD 13.1) ausschließlich aus
// vorhandenen Assets: Wortmarke und freigestellte Fahrzeuge auf Weiß, ohne
// Text, damit sie für alle Sprachen gelten. Gestaltete Bilder können sie
// später ersetzen (gleiche Dateinamen).
// Quelle: src/assets/logo, src/assets/vehicles   Ziel: public/og/*.jpg
// Aufruf: node scripts/make-og-images.mjs
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 630;
const MARGIN = 64;
const WORDMARK = "src/assets/logo/apex-wordmark-black.svg";

const IMAGES = {
  startseite: "src/assets/vehicles/gt3rs-silver.png",
  fahrzeuge: "src/assets/vehicles/gt3rs-black.png",
  kontakt: "src/assets/vehicles/gt3rs-red.png",
  rechtliches: null,
};

async function wordmark(width) {
  return sharp(WORDMARK, { density: 300 }).resize({ width }).png().toBuffer();
}

await mkdir("public/og", { recursive: true });

for (const [name, vehicle] of Object.entries(IMAGES)) {
  const layers = [];
  if (vehicle) {
    // Wortmarke oben links, Fahrzeug unten rechts (wie im Hero)
    layers.push({ input: await wordmark(560), left: MARGIN, top: MARGIN });
    const car = await sharp(vehicle).resize({ width: 820 }).png().toBuffer();
    const { height } = await sharp(car).metadata();
    layers.push({
      input: car,
      left: WIDTH - 820 - MARGIN / 2,
      top: HEIGHT - (height ?? 0) - MARGIN / 2,
    });
  } else {
    // Rechtsseiten: nur die Wortmarke, mittig
    const mark = await wordmark(720);
    const { height } = await sharp(mark).metadata();
    layers.push({
      input: mark,
      left: (WIDTH - 720) / 2,
      top: Math.round((HEIGHT - (height ?? 0)) / 2),
    });
  }

  const target = `public/og/${name}.jpg`;
  await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 3,
      background: "#ffffff",
    },
  })
    .composite(layers)
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(target);
  console.log(target);
}
