#!/bin/bash

echo "🎨 FIXING CSS PATHS IN EDITING-PAGES"
echo "===================================="

# Fix CSS paths in all HTML files in pages/editing-pages/
echo "📝 Updating CSS paths from ../ to ../../"

cd "/Users/michael/My Drive/Claude Projects/HTML Pages/pages/editing-pages"

# Replace all CSS paths in HTML files
for file in *.html; do
    if [ -f "$file" ]; then
        echo "Fixing: $file"
        # Replace ../shared/ with ../../shared/
        sed -i '' 's|../shared/|../../shared/|g' "$file"
        # Replace ../js/ with ../../js/ if any exist
        sed -i '' 's|../js/|../../js/|g' "$file"
    fi
done

echo ""
echo "✅ CSS paths fixed!"
echo "🌐 Your pages should now load with proper styling"
echo ""
echo "📋 Test with: http://localhost:8000/pages/editing-pages/script_outline_editor.html"
