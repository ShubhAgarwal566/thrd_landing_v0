#!/bin/bash

# Project Bandwidth Analyzer for Website
# Save this as analyze_bandwidth.sh and run: bash analyze_bandwidth.sh

echo "🌐 COMPLETE PROJECT BANDWIDTH ANALYSIS"
echo "======================================"
echo ""

# Function to convert bytes to human readable
human_readable() {
    local bytes=$1
    if [ $bytes -lt 1024 ]; then
        echo "${bytes}B"
    elif [ $bytes -lt 1048576 ]; then
        echo "$(( bytes / 1024 ))KB"
    elif [ $bytes -lt 1073741824 ]; then
        echo "$(( bytes / 1048576 ))MB"
    else
        echo "$(( bytes / 1073741824 ))GB"
    fi
}

# Check if we're in a project directory
if [ ! -f "index.html" ] && [ ! -f "package.json" ]; then
    echo "⚠️  Run this script in your project root directory"
    exit 1
fi

echo "📁 PROJECT STRUCTURE ANALYSIS"
echo "----------------------------"

# Analyze HTML files
html_files=$(find . -name "*.html" -type f | wc -l)
html_size=$(find . -name "*.html" -type f -exec stat -f%z {} \; 2>/dev/null | awk '{sum+=$1} END {print sum}')
# Fallback for Linux
if [ -z "$html_size" ]; then
    html_size=$(find . -name "*.html" -type f -exec stat -c%s {} \; | awk '{sum+=$1} END {print sum}')
fi

echo "HTML Files: $html_files files, $(human_readable ${html_size:-0})"

# Analyze CSS files
css_files=$(find . -name "*.css" -type f | wc -l)
css_size=$(find . -name "*.css" -type f -exec stat -f%z {} \; 2>/dev/null | awk '{sum+=$1} END {print sum}')
if [ -z "$css_size" ]; then
    css_size=$(find . -name "*.css" -type f -exec stat -c%s {} \; | awk '{sum+=$1} END {print sum}')
fi

echo "CSS Files: $css_files files, $(human_readable ${css_size:-0})"

# Analyze JavaScript files
js_files=$(find . -name "*.js" -type f | wc -l)
js_size=$(find . -name "*.js" -type f -exec stat -f%z {} \; 2>/dev/null | awk '{sum+=$1} END {print sum}')
if [ -z "$js_size" ]; then
    js_size=$(find . -name "*.js" -type f -exec stat -c%s {} \; | awk '{sum+=$1} END {print sum}')
fi

echo "JavaScript Files: $js_files files, $(human_readable ${js_size:-0})"

# Analyze image files
image_files=$(find . \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" -o -name "*.webp" -o -name "*.svg" \) -type f | wc -l)
image_size=$(find . \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" -o -name "*.webp" -o -name "*.svg" \) -type f -exec stat -f%z {} \; 2>/dev/null | awk '{sum+=$1} END {print sum}')
if [ -z "$image_size" ]; then
    image_size=$(find . \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" -o -name "*.webp" -o -name "*.svg" \) -type f -exec stat -c%s {} \; | awk '{sum+=$1} END {print sum}')
fi

echo "Image Files: $image_files files, $(human_readable ${image_size:-0})"

# Calculate total project size
total_size=$((${html_size:-0} + ${css_size:-0} + ${js_size:-0} + ${image_size:-0}))
echo ""
echo "📊 TOTAL PROJECT SIZE: $(human_readable $total_size)"
echo ""

# Find largest files
echo "🔍 LARGEST FILES (Top 10)"
echo "------------------------"
find . -type f \( -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" -o -name "*.webp" \) -exec ls -lh {} \; | sort -k5 -hr | head -10 | awk '{print $5 "\t" $9}'

echo ""
echo "💾 CACHED vs NON-CACHED ASSETS"
echo "------------------------------"
cached_size=$((${css_size:-0} + ${js_size:-0}))
non_cached_size=$((${html_size:-0} + ${image_size:-0}))

echo "Cached Assets (CSS + JS): $(human_readable $cached_size)"
echo "Per-Page Assets (HTML + Images): $(human_readable $non_cached_size)"

echo ""
echo "📈 BANDWIDTH CALCULATION EXAMPLES"
echo "--------------------------------"

# Example calculations for different traffic levels
for visitors in 1000 5000 10000 25000 50000; do
    # Assume 3 pages per visit, 30% return rate
    pages_per_visit=3
    return_rate=30
    
    new_visitors=$((visitors * (100 - return_rate) / 100))
    returning_visitors=$((visitors * return_rate / 100))
    
    # New visitors: cached assets once + pages per visit
    new_visitor_bandwidth=$((new_visitors * cached_size + visitors * pages_per_visit * non_cached_size))
    
    # Monthly bandwidth
    monthly_gb=$((new_visitor_bandwidth / 1024 / 1024 / 1024))
    
    echo "$visitors visitors/month: ~${monthly_gb}GB bandwidth"
done

echo ""
echo "⚠️  OPTIMIZATION OPPORTUNITIES"
echo "-----------------------------"

# Check for large files that could be optimized
large_images=$(find . \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) -size +200k -type f | wc -l)
if [ $large_images -gt 0 ]; then
    echo "• $large_images images over 200KB - consider compression"
    find . \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) -size +200k -type f -exec ls -lh {} \; | awk '{print "  - " $9 " (" $5 ")"}'
fi

large_css=$(find . -name "*.css" -size +50k -type f | wc -l)
if [ $large_css -gt 0 ]; then
    echo "• $large_css CSS files over 50KB - consider minification"
fi

large_js=$(find . -name "*.js" -size +100k -type f | wc -l)
if [ $large_js -gt 0 ]; then
    echo "• $large_js JavaScript files over 100KB - consider code splitting"
fi

# Check for missing compression opportunities
echo ""
echo "📋 QUICK BANDWIDTH CHECKLIST"
echo "---------------------------"
echo "✓ Move inline CSS/JS to external files"
echo "✓ Compress images (aim for <100KB each)"
echo "✓ Minify CSS and JavaScript"
echo "✓ Enable gzip compression (Netlify automatic)"
echo "✓ Set proper cache headers"
echo "✓ Consider lazy loading for images"
echo "✓ Use WebP format for images when possible"

echo ""
echo "🚀 NEXT STEPS"
echo "------------"
echo "1. Use the web calculator above for detailed traffic analysis"
echo "2. Optimize files flagged as 'large' in this analysis"
echo "3. Test your optimized site with browser dev tools"
echo "4. Monitor Netlify analytics after deployment"
echo ""
echo "Analysis complete! 🎉"