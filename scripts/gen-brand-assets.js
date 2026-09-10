// Derives PWA/OS icon assets from the source mark (logo/logo.jpg).
// The source file is never modified. The logo itself is not shown anywhere
// in the app UI (top bar, splash, etc.) — this script only produces the
// minimal set of icons required by the platform: browser tab favicon and
// PWA home-screen / app-switcher icons.
//
// The source is a flat square (background fill + centered mark, no alpha,
// generous built-in padding) — it's already a finished icon tile, so every
// output is just a resize of the whole canvas. No cropping is applied: the
// background is part of the mark, not page chrome to remove.
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "logo", "logo.jpg");
const ICONS_DIR = path.join(ROOT, "public", "icons");

const CORNER_RADIUS_RATIO = 330 / 1550; // matches the source artwork's own tile rounding

function roundedMaskSvg(size, radius) {
  return Buffer.from(
    `<svg width="${size}" height="${size}"><rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="#fff"/></svg>`
  );
}

async function main() {
  fs.mkdirSync(ICONS_DIR, { recursive: true });

  const meta = await sharp(SRC).metadata();
  if (meta.width !== meta.height) {
    console.warn(`Warning: logo/logo.jpg is ${meta.width}x${meta.height}, not square.`);
  }
  const size = Math.min(meta.width, meta.height);
  const square = sharp(SRC).extract({
    left: Math.round((meta.width - size) / 2),
    top: Math.round((meta.height - size) / 2),
    width: size,
    height: size,
  });
  const squareBuffer = await square.png().toBuffer();

  // "any" purpose PWA icons — rounded-corner sticker style.
  const mask = roundedMaskSvg(size, Math.round(size * CORNER_RADIUS_RATIO));
  const rounded = await sharp(squareBuffer)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
  for (const iconSize of [192, 512]) {
    await sharp(rounded).resize(iconSize, iconSize).toFile(path.join(ICONS_DIR, `icon-${iconSize}.png`));
  }

  // Maskable icons — full-bleed square. The source's own generous padding
  // already keeps the mark inside the OS safe zone, so no extra inset needed.
  for (const iconSize of [192, 512]) {
    await sharp(squareBuffer).resize(iconSize, iconSize).toFile(path.join(ICONS_DIR, `icon-${iconSize}-maskable.png`));
  }

  // Apple touch icon and favicon — full-bleed square (the OS applies its own mask).
  await sharp(squareBuffer).resize(180, 180).toFile(path.join(ICONS_DIR, "apple-touch-icon.png"));
  await sharp(squareBuffer).resize(32, 32).toFile(path.join(ICONS_DIR, "favicon-32.png"));

  console.log("Icons generated from logo/logo.jpg");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
