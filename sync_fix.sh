#!/bin/bash

# Vidsponential Sync & Fix Script
# Run this to sync everything properly

echo "🔄 Starting Vidsponential sync process..."

# Step 1: Create backup branch
echo "📦 Creating backup branch..."
cd "/Users/michael/My Drive/Claude Projects/HTML Pages"
git checkout -b "backup/$(date +%Y-%m-%d)" 2>/dev/null || git checkout "backup/$(date +%Y-%m-%d)"
git push origin "backup/$(date +%Y-%m-%d)" 2>/dev/null || echo "Backup branch already exists"

# Step 2: Return to main and create working branch  
echo "🌿 Switching to main branch..."
git checkout main
git pull origin main

echo "🆕 Creating feature branch..."
git checkout -b "sync/vercel-local-sync" 2>/dev/null || git checkout "sync/vercel-local-sync"

# Step 3: Replace local index.html with Vercel version
echo "🏠 Updating home page to Vercel version..."
cp "backups/index_vercel_current.html" "index.html"

# Step 4: Keep script_visuals_editor_backup.html safe
echo "💾 Preserving script visuals editor backup..."
cp "editing-pages/script_visuals_editor_backup.html" "backups/script_visuals_editor_backup_$(date +%Y-%m-%d).html"

echo "✅ Manual steps needed:"
echo "1. Check if script_visuals_editor.html loads properly locally"
echo "2. If not, replace with backup version"
echo "3. Run: git add . && git commit -m 'Sync local files with Vercel versions'"
echo "4. Run: git push origin sync/vercel-local-sync"
echo "5. Run: git checkout main && git merge sync/vercel-local-sync"
echo "6. Run: git push origin main"

echo "🎉 Backup and sync preparation complete!"
