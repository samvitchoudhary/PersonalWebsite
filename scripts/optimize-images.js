#!/usr/bin/env node
/**
 * Image optimization script for samvitchoudhary.dev
 * 
 * Strategy:
 * 1. Main backgrounds (PersonalWebsite.png, Skills.png, Contact.png): Keep dimensions, convert to WebP/AVIF
 * 2. About page photos: Resize to display sizes (400px-800px), convert to WebP/AVIF with mobile variants
 * 3. Fridge PNGs: Keep transparency, optimize with WebP
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Track original sizes
let originalTotal = 0;
let optimizedTotal = 0;

async function getFileSize(filePath) {
  try {
    const stats = await fs.promises.stat(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}

async function optimizeBackgroundImage(inputPath, outputBaseName) {
  console.log(`\nOptimizing background: ${inputPath}`);
  const originalSize = await getFileSize(inputPath);
  originalTotal += originalSize;
  
  const img = sharp(inputPath);
  const metadata = await img.metadata();
  
  const outputDir = path.dirname(inputPath);
  const webpPath = path.join(outputDir, `${outputBaseName}.webp`);
  const avifPath = path.join(outputDir, `${outputBaseName}.avif`);
  
  // Generate WebP (quality 85 for backgrounds with detail)
  await img
    .webp({ quality: 85, effort: 6 })
    .toFile(webpPath);
  
  // Generate AVIF (quality 75 for good compression)
  await img
    .avif({ quality: 75, effort: 6 })
    .toFile(avifPath);
  
  const webpSize = await getFileSize(webpPath);
  const avifSize = await getFileSize(avifPath);
  optimizedTotal += Math.min(webpSize, avifSize);
  
  console.log(`  Original: ${(originalSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`  WebP (${metadata.width}×${metadata.height}): ${(webpSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`  AVIF (${metadata.width}×${metadata.height}): ${(avifSize / 1024 / 1024).toFixed(2)}MB`);
}

async function optimizePhoto(inputPath, outputBaseName, maxWidth = 800, mobileWidth = 400) {
  console.log(`\nOptimizing photo: ${inputPath}`);
  const originalSize = await getFileSize(inputPath);
  originalTotal += originalSize;
  
  const img = sharp(inputPath);
  const metadata = await img.metadata();
  
  const outputDir = path.dirname(inputPath);
  
  // Desktop version (800px max width)
  const desktopWidth = Math.min(maxWidth, metadata.width);
  const desktopWebpPath = path.join(outputDir, `${outputBaseName}.webp`);
  const desktopAvifPath = path.join(outputDir, `${outputBaseName}.avif`);
  
  await sharp(inputPath)
    .resize(desktopWidth, null, { withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 })
    .toFile(desktopWebpPath);
  
  await sharp(inputPath)
    .resize(desktopWidth, null, { withoutEnlargement: true })
    .avif({ quality: 72, effort: 6 })
    .toFile(desktopAvifPath);
  
  // Mobile version (400px max width)
  const mobileWebpPath = path.join(outputDir, `${outputBaseName}-mobile.webp`);
  const mobileAvifPath = path.join(outputDir, `${outputBaseName}-mobile.avif`);
  
  await sharp(inputPath)
    .resize(mobileWidth, null, { withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toFile(mobileWebpPath);
  
  await sharp(inputPath)
    .resize(mobileWidth, null, { withoutEnlargement: true })
    .avif({ quality: 70, effort: 6 })
    .toFile(mobileAvifPath);
  
  const desktopWebpSize = await getFileSize(desktopWebpPath);
  const desktopAvifSize = await getFileSize(desktopAvifPath);
  const mobileWebpSize = await getFileSize(mobileWebpPath);
  const mobileAvifSize = await getFileSize(mobileAvifPath);
  
  // Use smallest format for size calculation
  optimizedTotal += Math.min(desktopAvifSize, desktopWebpSize);
  
  console.log(`  Original: ${(originalSize / 1024 / 1024).toFixed(2)}MB (${metadata.width}×${metadata.height})`);
  console.log(`  Desktop WebP: ${(desktopWebpSize / 1024).toFixed(1)}KB`);
  console.log(`  Desktop AVIF: ${(desktopAvifSize / 1024).toFixed(1)}KB`);
  console.log(`  Mobile WebP: ${(mobileWebpSize / 1024).toFixed(1)}KB`);
  console.log(`  Mobile AVIF: ${(mobileAvifSize / 1024).toFixed(1)}KB`);
}

async function optimizeFridgePNG(inputPath, outputBaseName) {
  console.log(`\nOptimizing fridge PNG: ${inputPath}`);
  const originalSize = await getFileSize(inputPath);
  originalTotal += originalSize;
  
  const outputDir = path.dirname(inputPath);
  const webpPath = path.join(outputDir, `${outputBaseName}.webp`);
  
  // Fridge images need transparency, so use WebP with lossless for quality
  await sharp(inputPath)
    .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85, effort: 6 })
    .toFile(webpPath);
  
  const webpSize = await getFileSize(webpPath);
  optimizedTotal += webpSize;
  
  console.log(`  Original: ${(originalSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`  WebP: ${(webpSize / 1024).toFixed(1)}KB`);
}

async function main() {
  console.log('Starting image optimization...\n');
  console.log('='.repeat(60));
  
  // 1. Optimize main background images (keep dimensions for hotspots)
  await optimizeBackgroundImage(
    path.join(PUBLIC_DIR, 'PersonalWebsite.png'),
    'PersonalWebsite'
  );
  await optimizeBackgroundImage(
    path.join(PUBLIC_DIR, 'Skills.png'),
    'Skills'
  );
  await optimizeBackgroundImage(
    path.join(PUBLIC_DIR, 'Contact.png'),
    'Contact'
  );
  
  // 2. Optimize about page photos
  const aboutDir = path.join(PUBLIC_DIR, 'aboutMeImages');
  
  // Large photos that need significant resizing
  const largePhotos = [
    'COYS.jpg',
    'EagleScout.jpg',
    'Cooking.png',
    'Tennis.png',
    'Friends4.jpg'
  ];
  
  for (const photo of largePhotos) {
    const inputPath = path.join(aboutDir, photo);
    const baseName = path.basename(photo, path.extname(photo));
    await optimizePhoto(inputPath, baseName, 800, 400);
  }
  
  // Medium photos
  const mediumPhotos = [
    'Family.png',
    'Family1.png',
    'Friends.jpg',
    'Friends1.jpg',
    'Friends2.jpg',
    'Friends3.jpg',
    'Samvit.png'
  ];
  
  for (const photo of mediumPhotos) {
    const inputPath = path.join(aboutDir, photo);
    const baseName = path.basename(photo, path.extname(photo));
    await optimizePhoto(inputPath, baseName, 600, 350);
  }
  
  // Food photos
  const foodPhotos = ['Food.jpg', 'Food1.jpg', 'Food2.jpg', 'Food3.jpg', 'Food4.jpg'];
  
  for (const photo of foodPhotos) {
    const inputPath = path.join(aboutDir, photo);
    const baseName = path.basename(photo, path.extname(photo));
    await optimizePhoto(inputPath, baseName, 650, 375);
  }
  
  // Small logos/graphics (keep smaller)
  const smallImages = ['UofM.png', 'AboutTime.jpg', 'LetterBoxdLogo.png'];
  
  for (const img of smallImages) {
    const inputPath = path.join(aboutDir, img);
    const baseName = path.basename(img, path.extname(img));
    await optimizePhoto(inputPath, baseName, 400, 300);
  }
  
  // 3. Optimize fridge PNGs (need transparency)
  const fridgeDir = path.join(PUBLIC_DIR, 'fridge');
  const fridgeFiles = await fs.promises.readdir(fridgeDir);
  
  for (const file of fridgeFiles) {
    if (file.endsWith('.png')) {
      const inputPath = path.join(fridgeDir, file);
      const baseName = path.basename(file, '.png');
      await optimizeFridgePNG(inputPath, baseName);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\nOptimization complete!');
  console.log(`Original total: ${(originalTotal / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Optimized total (best format): ${(optimizedTotal / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Reduction: ${(((originalTotal - optimizedTotal) / originalTotal) * 100).toFixed(1)}%`);
  console.log('\nNote: Original images are preserved. Update components to use optimized versions.');
}

main().catch(console.error);
