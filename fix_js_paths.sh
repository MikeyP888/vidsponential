#!/bin/bash

echo "🔧 FIXING CORRUPTED JAVASCRIPT PATHS"
echo "===================================="

cd "/Users/michael/My Drive/Claude Projects/HTML Pages/pages/editing-pages"

# Fix the corrupted JavaScript paths
for file in *.html; do
    if [ -f "$file" ]; then
        echo "Fixing JS paths in: $file"
        # Fix the corrupted paths like "../../shar../../js/" back to "../../shared/js/"
        sed -i '' 's|../../shar../../js/|../../shared/js/|g' "$file"
        # Also fix any other variations
        sed -i '' 's|../shar../js/|../../shared/js/|g' "$file"
        sed -i '' 's|shar../js/|../../shared/js/|g' "$file"
    fi
done

echo ""
echo "✅ JavaScript paths fixed!"
echo "🔄 Refresh your browser - sidebar should now load"
