#!/usr/bin/env node

// Simple build script for Vercel deployment
// This ensures all static files are properly served

const fs = require('fs');
const path = require('path');

console.log('Building Vidsponential Portfolio...');

// Ensure index.html exists (it should already)
if (!fs.existsSync('index.html')) {
  console.error('Error: index.html not found in root directory');
  process.exit(1);
}

// Find HTML files in root directory
const rootHtmlFiles = fs.readdirSync('.').filter(file => file.endsWith('.html'));

// Find HTML files in editing-pages directory
let editingPagesFiles = [];
const editingPagesDir = './editing-pages';
if (fs.existsSync(editingPagesDir)) {
  editingPagesFiles = fs.readdirSync(editingPagesDir).filter(file => file.endsWith('.html'));
  console.log(`Found ${editingPagesFiles.length} HTML files in editing-pages directory`);
  
  // Copy editing-pages files to root directory so they're accessible
  editingPagesFiles.forEach(file => {
    const sourcePath = path.join(editingPagesDir, file);
    const destPath = file;
    
    // Only copy if not already in root (avoid overwriting)
    if (!fs.existsSync(destPath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied ${file} from editing-pages to root`);
    } else {
      console.log(`Skipped ${file} (already exists in root)`);
    }
  });
} else {
  console.warn('Warning: editing-pages directory not found');
}

// Create a simple manifest of all HTML files for reference
const allHtmlFiles = [...rootHtmlFiles, ...editingPagesFiles];
console.log('Found HTML files:', allHtmlFiles);

// Ensure all shared assets are accessible
const sharedDir = './shared';
if (fs.existsSync(sharedDir)) {
  console.log('Shared assets directory found');
} else {
  console.warn('Warning: shared assets directory not found');
}

console.log('Build completed successfully!');
console.log('Homepage: Professional YouTube Script Writing');
console.log('Portfolio: Available at /portfolio/');
console.log('Celebrity Scripts: Available at /portfolio/celebrity-scripts/');
console.log(`Total pages deployed: ${allHtmlFiles.length}`);
