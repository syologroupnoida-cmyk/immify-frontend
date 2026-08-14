const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const outDir = path.join(__dirname, '..', 'public', 'images');
fs.mkdirSync(outDir, { recursive: true });

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) {
      if ((crc & 1) === 1) {
        crc = (crc >>> 1) ^ 0xedb88320;
      } else {
        crc >>>= 1;
      }
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type), data])), 0);
  return Buffer.concat([len, Buffer.from(type), data, crc]);
}

function createPng(fileName, width, height, fillColor) {
  const pixels = [];
  for (let y = 0; y < height; y += 1) {
    pixels.push(0);
    for (let x = 0; x < width; x += 1) {
      pixels.push(fillColor[0], fillColor[1], fillColor[2], 255);
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(Buffer.from(pixels))),
    chunk('IEND', Buffer.alloc(0))
  ]);

  fs.writeFileSync(path.join(outDir, fileName), png);
}

createPng('hero-slider-img1.png', 1600, 900, [18, 88, 166]);
createPng('hero-slider-img2.png', 1600, 900, [22, 109, 84]);
createPng('hero-slider-img3.png', 1600, 900, [127, 74, 0]);
console.log('Created hero slider images');
