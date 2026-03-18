/**
 * OG画像生成スクリプト
 * 実行: node scripts/generate-og-image.mjs
 * 必要: npm install -D sharp
 */
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgPath = join(__dirname, '../public/og-image.svg');
const outputPath = join(__dirname, '../public/og-image.png');

const svgBuffer = readFileSync(svgPath);

await sharp(svgBuffer)
  .resize(1200, 630)
  .png()
  .toFile(outputPath);

console.log('✅ og-image.png を生成しました:', outputPath);
