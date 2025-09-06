#!/bin/bash

echo "🗂️  ORGANIZING PROJECT INTO PROPER FOLDERS"
echo "==========================================="

# Create the organized structure on GitHub
echo "📁 Moving files into organized folders..."

# Create directories if they don't exist
mkdir -p editing-pages
mkdir -p shared/styles
mkdir -p shared/js
mkdir -p shared/assets
mkdir -p portfolio
mkdir -p backups

# Move script editor files to editing-pages folder
echo "📝 Moving script editors to editing-pages/"
mv script_*.html editing-pages/ 2>/dev/null
mv add_*.html editing-pages/ 2>/dev/null
mv manage_*.html editing-pages/ 2>/dev/null
mv *_editor.html editing-pages/ 2>/dev/null
mv admin_settings.html editing-pages/ 2>/dev/null
mv user_settings.html editing-pages/ 2>/dev/null
mv press_releases.html editing-pages/ 2>/dev/null
mv social_posts_editor.html editing-pages/ 2>/dev/null
mv tweet_editor.html editing-pages/ 2>/dev/null
mv upwork_proposals_editor.html editing-pages/ 2>/dev/null

# Keep these in root for main website
echo "🏠 Keeping main site files in root:"
echo "   - index.html (home page)"
echo "   - blog.html"
echo "   - Any other main pages"

# Stage all changes
echo "📦 Staging organized structure..."
git add .

echo ""
echo "✅ ORGANIZATION COMPLETE!"
echo ""
echo "📋 Current structure:"
find . -name "*.html" -not -path "./.git/*" -not -path "./node_modules/*" | head -20

echo ""
echo "🚀 Ready to commit and push organized structure"
echo "Run: git commit -m 'Organize project into proper folder structure'"
echo "Then: git push origin main"
