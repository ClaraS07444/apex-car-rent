// Schneidet die freigestellten Fahrzeugbilder auf einen gemeinsamen Rahmen zu.
//
// Alle Originale haben das Format 3:2 und zeigen das Fahrzeug im selben Maßstab
// (PRD 9.6). Der Rahmen ist die Vereinigung der Fahrzeugumrisse aller drei
// Bilder in relativen Koordinaten. So bleiben Maßstab und Bodenlinie identisch,
// und der transparente Rand (rund 52 % der Fläche) entfällt.
//
// Quelle:  assets/images/porsche-*.png   (unverändert)
// Ziel:    src/assets/vehicles/gt3rs-*.png
// Aufruf:  node scripts/crop-vehicles.mjs
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const SOURCES = { silver: "silver", red: "red", black: "black" };
const ALPHA_THRESHOLD = 8;

async function alphaBounds(file) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  let left = width;
  let top = height;
  let right = -1;
  let bottom = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * channels + 3] > ALPHA_THRESHOLD) {
        left = Math.min(left, x);
        right = Math.max(right, x);
        top = Math.min(top, y);
        bottom = Math.max(bottom, y);
      }
    }
  }
  return {
    width,
    height,
    left: left / width,
    top: top / height,
    right: (right + 1) / width,
    bottom: (bottom + 1) / height,
  };
}

const measured = {};
for (const [key, name] of Object.entries(SOURCES)) {
  measured[key] = await alphaBounds(`assets/images/porsche-${name}.png`);
}

const frame = {
  left: Math.min(...Object.values(measured).map((m) => m.left)),
  top: Math.min(...Object.values(measured).map((m) => m.top)),
  right: Math.max(...Object.values(measured).map((m) => m.right)),
  bottom: Math.max(...Object.values(measured).map((m) => m.bottom)),
};

await mkdir("src/assets/vehicles", { recursive: true });

for (const [key, name] of Object.entries(SOURCES)) {
  const { width, height } = measured[key];
  const left = Math.floor(frame.left * width);
  const top = Math.floor(frame.top * height);
  const region = {
    left,
    top,
    width: Math.ceil(frame.right * width) - left,
    height: Math.ceil(frame.bottom * height) - top,
  };
  const target = `src/assets/vehicles/gt3rs-${key}.png`;
  await sharp(`assets/images/porsche-${name}.png`)
    .extract(region)
    .png({ compressionLevel: 9 })
    .toFile(target);
  console.log(
    `${target}: ${region.width} x ${region.height} (Seitenverhältnis ${(region.width / region.height).toFixed(3)})`,
  );
}
