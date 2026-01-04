/**
 * Image Optimization Script
 * Converts all PNG/JPG images to optimized WebP format
 * Resizes to appropriate dimensions for web use
 * 
 * Run: node scripts/optimize-images.js
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const OUTPUT_DIR = path.join(PUBLIC_DIR, 'optimized');

// Configuration
const CONFIG = {
  // Max dimensions for different image types
  sizes: {
    hero: { width: 1600, height: 1200 },
    product: { width: 800, height: 800 },
    thumbnail: { width: 400, height: 400 },
  },
  // Quality settings (0-100)
  quality: {
    webp: 82,
    avif: 75,
  },
  // Target max file size in KB (soft target)
  targetMaxKB: 300,
};

// Image extensions to process
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.PNG', '.JPG', '.JPEG'];

// Folders to skip
const SKIP_FOLDERS = ['optimized', 'node_modules'];

// Track stats
let stats = {
  processed: 0,
  skipped: 0,
  totalOriginalSize: 0,
  totalOptimizedSize: 0,
  errors: [],
};

/**
 * Recursively find all images in a directory
 */
function findImages(dir, images = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!SKIP_FOLDERS.includes(file)) {
        findImages(filePath, images);
      }
    } else if (IMAGE_EXTENSIONS.includes(path.extname(file))) {
      images.push(filePath);
    }
  }
  
  return images;
}

/**
 * Get the output path for an optimized image
 */
function getOutputPath(inputPath) {
  const relativePath = path.relative(PUBLIC_DIR, inputPath);
  const parsed = path.parse(relativePath);
  const newPath = path.join(OUTPUT_DIR, parsed.dir, `${parsed.name}.webp`);
  return newPath;
}

/**
 * Ensure directory exists
 */
function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Optimize a single image
 */
async function optimizeImage(inputPath) {
  const outputPath = getOutputPath(inputPath);
  const relativePath = path.relative(PUBLIC_DIR, inputPath);
  
  try {
    // Get original file size
    const originalSize = fs.statSync(inputPath).size;
    stats.totalOriginalSize += originalSize;
    
    // Read image metadata
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Determine resize dimensions (maintain aspect ratio)
    let resizeOptions = {};
    const maxWidth = 800;  // Good for product images
    const maxHeight = 800;
    
    if (metadata.width > maxWidth || metadata.height > maxHeight) {
      resizeOptions = {
        width: maxWidth,
        height: maxHeight,
        fit: 'inside',
        withoutEnlargement: true,
      };
    }
    
    // Ensure output directory exists
    ensureDir(outputPath);
    
    // Process and save as WebP
    await image
      .resize(resizeOptions.width ? resizeOptions : undefined)
      .webp({ quality: CONFIG.quality.webp })
      .toFile(outputPath);
    
    // Get optimized file size
    const optimizedSize = fs.statSync(outputPath).size;
    stats.totalOptimizedSize += optimizedSize;
    
    const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(1);
    const originalMB = (originalSize / 1024 / 1024).toFixed(2);
    const optimizedKB = (optimizedSize / 1024).toFixed(0);
    
    console.log(`✅ ${relativePath}`);
    console.log(`   ${originalMB} MB → ${optimizedKB} KB (${savings}% smaller)`);
    
    stats.processed++;
    
  } catch (error) {
    console.error(`❌ Error processing ${relativePath}: ${error.message}`);
    stats.errors.push({ file: relativePath, error: error.message });
  }
}

/**
 * Generate image mapping file for easy import
 */
function generateImageMap(images) {
  const mapping = {};
  
  for (const inputPath of images) {
    const relativePath = path.relative(PUBLIC_DIR, inputPath);
    const outputRelative = path.relative(PUBLIC_DIR, getOutputPath(inputPath));
    
    // Use forward slashes for web paths
    const originalPath = '/' + relativePath.replace(/\\/g, '/');
    const optimizedPath = '/' + outputRelative.replace(/\\/g, '/');
    
    mapping[originalPath] = optimizedPath;
  }
  
  const mapContent = `// Auto-generated image map
// Maps original images to optimized WebP versions
// Generated: ${new Date().toISOString()}

export const imageMap = ${JSON.stringify(mapping, null, 2)};

/**
 * Get optimized image path
 * @param {string} originalPath - Original image path (e.g., "/bread/Sourdough.png")
 * @returns {string} - Optimized WebP path (e.g., "/optimized/bread/Sourdough.webp")
 */
export function getOptimizedImage(originalPath) {
  return imageMap[originalPath] || originalPath;
}
`;

  fs.writeFileSync(
    path.join(__dirname, '..', 'src', 'lib', 'imageMap.js'),
    mapContent
  );
  
  console.log('\n📄 Generated src/lib/imageMap.js');
}

/**
 * Main function
 */
async function main() {
  console.log('🖼️  Image Optimization Script\n');
  console.log(`📁 Source: ${PUBLIC_DIR}`);
  console.log(`📁 Output: ${OUTPUT_DIR}\n`);
  
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Find all images
  const images = findImages(PUBLIC_DIR);
  console.log(`Found ${images.length} images to optimize\n`);
  
  if (images.length === 0) {
    console.log('No images found to optimize.');
    return;
  }
  
  // Process images
  for (const imagePath of images) {
    await optimizeImage(imagePath);
  }
  
  // Generate image map
  generateImageMap(images);
  
  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 OPTIMIZATION SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Processed: ${stats.processed} images`);
  console.log(`❌ Errors: ${stats.errors.length}`);
  console.log(`📦 Original total: ${(stats.totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📦 Optimized total: ${(stats.totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`💾 Space saved: ${((stats.totalOriginalSize - stats.totalOptimizedSize) / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📈 Reduction: ${((1 - stats.totalOptimizedSize / stats.totalOriginalSize) * 100).toFixed(1)}%`);
  
  if (stats.errors.length > 0) {
    console.log('\n⚠️  Errors:');
    for (const err of stats.errors) {
      console.log(`   - ${err.file}: ${err.error}`);
    }
  }
}

main().catch(console.error);

