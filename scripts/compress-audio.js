#!/usr/bin/env node

/**
 * Convert large WAV files to web-optimized MP3 for deployment
 * This reduces file sizes from ~100MB to ~5-10MB while maintaining quality
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const INPUT_DIR = path.join(__dirname, '..', 'public', 'audio');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'audio-compressed');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const wavFiles = fs.readdirSync(INPUT_DIR)
  .filter(file => file.endsWith('.wav'))
  .filter(file => !file.includes('track-')); // Skip placeholder files

console.log('🎵 Converting large WAV files to web-optimized MP3...');
console.log(`Found ${wavFiles.length} WAV files to convert\n`);

wavFiles.forEach((file, index) => {
  const inputPath = path.join(INPUT_DIR, file);
  const outputFile = file.replace('.wav', '.mp3');
  const outputPath = path.join(OUTPUT_DIR, outputFile);
  
  console.log(`[${index + 1}/${wavFiles.length}] Converting: ${file}`);
  
  try {
    // Check if ffmpeg is available
    try {
      execSync('ffmpeg -version', { stdio: 'ignore' });
    } catch (error) {
      console.log('❌ FFmpeg not found. Installing via Homebrew...');
      execSync('brew install ffmpeg', { stdio: 'inherit' });
    }
    
    // Get original file size
    const stats = fs.statSync(inputPath);
    const originalSizeMB = (stats.size / (1024 * 1024)).toFixed(1);
    
    // Convert with high quality settings
    const command = `ffmpeg -i "${inputPath}" -codec:a libmp3lame -b:a 192k -ar 44100 "${outputPath}" -y`;
    execSync(command, { stdio: 'ignore' });
    
    // Get new file size
    const newStats = fs.statSync(outputPath);
    const newSizeMB = (newStats.size / (1024 * 1024)).toFixed(1);
    const reduction = ((1 - newStats.size / stats.size) * 100).toFixed(1);
    
    console.log(`✅ ${originalSizeMB}MB → ${newSizeMB}MB (${reduction}% reduction)`);
    
  } catch (error) {
    console.error(`❌ Error converting ${file}:`, error.message);
  }
});

console.log('\n🎉 Conversion complete!');
console.log(`📁 Compressed files are in: ${OUTPUT_DIR}`);
console.log('\n📝 Next steps:');
console.log('1. Update music-data.ts to use .mp3 files');
console.log('2. Update .gitattributes to track *.mp3 with LFS');
console.log('3. Commit and redeploy to Vercel');

// Create updated music data template
const musicDataPath = path.join(__dirname, '..', 'src', 'lib', 'music-data-mp3.ts');
const originalMusicData = fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'music-data.ts'), 'utf8');
const updatedMusicData = originalMusicData.replace(/\.wav/g, '.mp3').replace('/audio/', '/audio-compressed/');

fs.writeFileSync(musicDataPath, updatedMusicData);
console.log('4. music-data-mp3.ts template created with MP3 paths');
