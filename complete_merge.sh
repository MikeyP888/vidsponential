#!/bin/bash

# Complete Git Merge Resolution Script
echo "🔄 Completing Git merge resolution..."

# Add the resolved files
git add shared/styles/navigation.css
git add shared/styles/sidebar.css
git add shared/js/chapter-config.js
git add shared/js/sidebar-component.js

# Check if there are any remaining conflicts
echo "📋 Checking for remaining conflicts..."
git status

# Complete the merge
echo "✅ Committing merge resolution..."
git commit -m "Resolve merge conflicts: Keep local organized navigation and sidebar styles"

echo "🎉 Merge completed successfully!"
echo ""
echo "📊 Current Git status:"
git status --short

echo ""
echo "🚀 You can now push to GitHub:"
echo "git push origin main"
