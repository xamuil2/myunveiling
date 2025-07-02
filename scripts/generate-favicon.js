#!/usr/bin/env node

/**
 * Generate favicon from album cover
 * This script converts the album cover to various favicon formats
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const INPUT_FILE = path.join(__dirname, '..', 'public', 'album-cover.jpg');
const OUTPUT_DIR = path.join(__dirname, '..', 'public');

const SIZES = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 96, name: 'favicon-96x96.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' }
];

async function generateFavicons() {
  try {
    console.log('🎨 Generating favicons from album cover...');
    
    // Check if input file exists
    try {
      await fs.access(INPUT_FILE);
    } catch (error) {
      console.error('❌ Album cover not found at:', INPUT_FILE);
      console.log('💡 Make sure album-cover.jpg exists in the public folder');
      process.exit(1);
    }

    // Get original image info
    const image = sharp(INPUT_FILE);
    const metadata = await image.metadata();
    console.log(`📸 Original image: ${metadata.width}x${metadata.height}`);

    // Generate different sizes
    for (const { size, name } of SIZES) {
      const outputPath = path.join(OUTPUT_DIR, name);
      
      await image
        .resize(size, size, {
          fit: 'cover',
          position: 'center'
        })
        .png()
        .toFile(outputPath);
        
      console.log(`✅ Generated: ${name} (${size}x${size})`);
    }

    // Generate the main favicon.ico (combining multiple sizes)
    const faviconPath = path.join(OUTPUT_DIR, 'favicon.ico');
    await image
      .resize(32, 32, {
        fit: 'cover',
        position: 'center'
      })
      .png()
      .toFile(faviconPath.replace('.ico', '-temp.png'));

    // Note: Converting PNG to ICO requires additional tools
    // For now, we'll rename the 32x32 PNG as favicon.ico
    await fs.rename(faviconPath.replace('.ico', '-temp.png'), faviconPath.replace('.ico', '.png'));
    
    console.log('✅ Generated: favicon.png (will be used as favicon)');

    // Generate site.webmanifest
    const manifest = {
      name: "My Unveiling",
      short_name: "My Unveiling",
      description: "An album by Max Liu",
      icons: [
        {
          src: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png"
        }
      ],
      theme_color: "#000000",
      background_color: "#000000",
      display: "standalone"
    };

    const manifestPath = path.join(OUTPUT_DIR, 'site.webmanifest');
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('✅ Generated: site.webmanifest');

    console.log('\n🎉 Favicon generation complete!');
    console.log('📁 Generated files:');
    SIZES.forEach(({ name }) => console.log(`   - ${name}`));
    console.log('   - favicon.png');
    console.log('   - site.webmanifest');

  } catch (error) {
    console.error('❌ Error generating favicons:', error.message);
    process.exit(1);
  }
}

// Check if sharp is installed
async function checkDependencies() {
  try {
    require('sharp');
  } catch (error) {
    console.log('📦 Installing sharp for image processing...');
    const { execSync } = require('child_process');
    try {
      execSync('npm install sharp', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
      console.log('✅ Sharp installed successfully');
    } catch (installError) {
      console.error('❌ Failed to install sharp. Please run: npm install sharp');
      process.exit(1);
    }
  }
}

async function main() {
  await checkDependencies();
  await generateFavicons();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { generateFavicons };
