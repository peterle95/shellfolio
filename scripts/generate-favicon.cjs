const fs = require('node:fs/promises');
const assert = require('node:assert/strict');
const path = require('node:path');
const sharp = require('sharp');

async function main() {
  const root = path.resolve(__dirname, '..');
  const png = await sharp(path.join(root, 'public/images/blonde.png'))
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
