#!/usr/bin/env node

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function convertAlbumCover() {
  const inputPath = process.argv[2];
  
  if (!inputPath) {
    console.log('Usage: node convert-album-cover.js <path-to-your-tif-file>');
    console.log('Example: node convert-album-cover.js ~/Desktop/my-album-cover.tif');
    return;
  }

  if (!fs.existsSync(inputPath)) {
    console.error('Error: File not found:', inputPath);
    return;
  }

  const outputPath = path.join(__dirname, '../public/album-cover.jpg');
  
  try {
    // Get image metadata
    const metadata = await sharp(inputPath).metadata();
    console.log('Original image:', metadata.width + 'x' + metadata.height, metadata.format);

    // Convert to square format with high quality
    await sharp(inputPath)
      .resize(1000, 1000, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ 
        quality: 95,
        progressive: true 
      })
      .toFile(outputPath);

    console.log('✅ Album cover converted successfully!');
    console.log('📍 Saved to:', outputPath);
    console.log('📐 New dimensions: 1000x1000px');
    console.log('');
    console.log('Next steps:');
    console.log('1. Update your music-data.ts to use "/album-cover.jpg" instead of "/album-cover.svg"');
    console.log('2. The image will automatically appear on your website');

  } catch (error) {
    console.error('Error converting image:', error.message);
  }
}

convertAlbumCover();
