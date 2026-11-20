/* eslint-disable @typescript-eslint/no-require-imports -- Standalone Node CommonJS script, matching scripts/*.cjs. */
const fs = require('node:fs/promises');
const assert = require('node:assert/strict');
const path = require('node:path');
const sharp = require('sharp');

// Square face crop of the badge portrait, so the tab icon matches the lanyard card.
const SOURCE = 'public/images/Charcoal Portrait of a Smiling Bearded Man.png';
const FACE = { left: 120, top: 150, width: 880, height: 880 };

async function main() {
  const root = path.resolve(__dirname, '..');
  const face = () => sharp(path.join(root, SOURCE)).extract(FACE);
  await face().resize(192, 192).png().toFile(path.join(root, 'public/images/favicon.png'));

  const png = await face()
    .resize(64, 64)
    .ensureAlpha()
    .png()
    .toBuffer();
  // Next.js's ICO decoder requires the embedded PNG to use RGBA.
  assert.equal(png[25], 6, 'ICO PNG must use RGBA for Next.js');

  const header = Buffer.alloc(22);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header[6] = header[7] = 64;
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(header.length, 18);
  await fs.writeFile(path.join(root, 'src/app/favicon.ico'), Buffer.concat([header, png]));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
