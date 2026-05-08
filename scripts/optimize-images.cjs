// Convert every PNG / JPG in public/images to WebP, and produce a smaller mobile
// variant for the few images that act as page heroes (preload candidates).
// Original PNG/JPG files are kept on disk so existing references to them keep
// working; production should serve the .webp versions.

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const IMG_DIR = path.join(ROOT, "public", "images");

// Heroes get a mobile variant at 800w as well. Add files here as needed.
const HERO_FILES = new Set([
  "fuelcard-1400-1000x500-1.png",
  "How-to-Implement-a-New-Fuel-Card.jpg.optimal.jpg",
  "Fleet-Fueling-Solutions_-Enhancing-Efficiency-and-Reducing-Costs.png",
  "How-Fleet-Cards-Benefit-Different-Industries-and-Fleet-Sizes.png",
]);

(async () => {
  const files = fs
    .readdirSync(IMG_DIR)
    .filter((f) => /\.(png|jpe?g)$/i.test(f));

  let converted = 0;
  let mobile = 0;
  for (const file of files) {
    const src = path.join(IMG_DIR, file);
    const stem = file.replace(/\.[^.]+$/, "").replace(/\.optimal$/, "");
    const webpPath = path.join(IMG_DIR, `${stem}.webp`);

    // Main webp variant — sized for 1600w max, quality 78 (matches typical
    // PageSpeed-friendly settings without visible artifacting).
    await sharp(src)
      .rotate() // honor EXIF orientation
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(webpPath);
    converted++;

    if (HERO_FILES.has(file)) {
      const mobilePath = path.join(IMG_DIR, `${stem}-mobile.webp`);
      await sharp(src)
        .rotate()
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 75 })
        .toFile(mobilePath);
      mobile++;
    }
  }
  console.log(`Converted ${converted} → .webp, ${mobile} mobile variants.`);
})();
