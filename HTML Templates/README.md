# HTML Component Templates Documentation

This directory contains reusable HTML/CSS templates for creating consistent form layouts across different projects.

## Available Templates

### 1. Rating Field Template (`rating_field_template.html`)
A standalone rating input field with label that perfectly matches the chapter section styling.

**Features:**
- Exactly 59px height to match text fields when they have 0-1 lines
- Perfect center alignment for number input
- Consistent Inter font styling
- Removes browser default number input spinners

**Use Cases:**
- Standalone rating fields
- Adding rating to existing layouts
- Consistent rating input across forms

### 2. Horizontal Text + Rating Template (`horizontal_text_rating_template.html`)
A horizontal layout with text field on the left and rating field on the right.

**Features:**
- Text field automatically resizes but starts at 59px to match rating field
- Rating field is exactly 100px wide + 10px gap
- Both fields maintain consistent height when text is short
- Perfect for headline-style layouts

**Use Cases:**
- Headline options (text + rating)
- Any text/content field that needs a rating
- Horizontal form layouts

### 3. Chapter Section Template (`chapter_section_template.html`)
Complete multi-row container with gradient header and multiple text+rating combinations.

**Features:**
- Gradient header with customizable text
- Gray background container with rounded corners
- Multiple horizontal rows (title+rating, outline+rating)
- Title fields match rating height (59px) for consistency
- Outline fields have larger minimum height (180px)
- Perfect spacing and alignment throughout

**Use Cases:**
- Chapter editing interfaces
- Multi-section forms
- Content with multiple rated fields

## Key Design Principles

### Height Consistency
All templates ensure that when text fields contain 0-1 lines of text, they maintain exactly **59px height** to match rating fields perfectly. This creates visual harmony and professional appearance.

### Rating Field Centering
Rating fields use advanced CSS to achieve perfect center alignment:
- `display: flex !important`
- `align-items: center !important`
- `justify-content: center !important`
- `text-align: center !important`
- Removes all browser defaults and spinners

### Typography
- **Font Family:** Inter (loaded from Penpot)
- **Font Size:** 19px for input text
- **Label Size:** 14px with 600 weight
- **Line Height:** 1.6 for text areas, 1 for rating fields

### Color Scheme
- **Borders:** `#5b5a5aFF` (subtle gray)
- **Background:** `#FFFFFFFF` for fields, `#f9f9f9FF` for containers
- **Gradient:** Cyan to purple (`rgba(11, 230, 255, 1)` to `rgba(175, 11, 255, 1)`)
- **Text:** `rgba(0, 0, 0, 1)` (pure black)

## Implementation Guide

### Step 1: Copy Template Structure
1. Choose the appropriate template for your needs
2. Copy the HTML structure
3. Copy the CSS styles to your stylesheet

### Step 2: Customize Classes
Replace all instances of "template" with your specific identifier:
- `rating-field-template` → `headline-rating-field`
- `text-input-template` → `headline-text-input`
- etc.

### Step 3: Add Data Attributes
Add data attributes for JavaScript functionality:
```html
<input data-headline-id="123" data-field="rating">
<textarea data-chapter-id="456" data-field="title">
```

### Step 4: Set Up Event Listeners
Add JavaScript event listeners for:
- Input change detection
- Auto-resize functionality (for text areas)
- Save/validation logic

### Step 5: Add Auto-Resize (For Text Areas)
Implement auto-resize JavaScript that:
- Keeps title/headline fields at 59px for single lines
- Allows expansion for multiple lines
- Maintains minimum heights for outline fields

## Auto-Resize Implementation

```javascript
function autoResize(textarea) {
    function resize() {
        const isHeadlineField = textarea.classList.contains('headline-input');
        const isTitleField = textarea.classList.contains('chapter-title-input');
        
        if (isHeadlineField || isTitleField) {
            const content = textarea.value;
            const hasLineBreaks = content.includes('\\n');
            
            if (!hasLineBreaks && content.length < 100) {
                // Single line - lock to 59px to match rating field
                textarea.style.height = '59px';
                textarea.style.maxHeight = '59px';
                textarea.style.overflow = 'hidden';
            } else {
                // Multiple lines - allow expansion
                textarea.style.maxHeight = 'none';
                textarea.style.overflow = 'auto';
                textarea.style.height = 'auto';
                const scrollHeight = textarea.scrollHeight;
                textarea.style.height = Math.max(scrollHeight, 59) + 'px';
            }
        }
    }
    
    // Initial resize
    setTimeout(resize, 0);
    
    // Add event listeners
    textarea.addEventListener('input', resize);
    textarea.addEventListener('paste', () => setTimeout(resize, 0));
}
```

## Example Usage

### Simple Rating Field
```html
<div class="my-rating-container">
    <label class="my-rating-label">Rating / 100:</label>
    <div class="my-rating-field">
        <input type="number" class="my-rating-input" min="1" max="100" value="85">
    </div>
</div>
```

### Headline with Rating
```html
<div class="headline-section">
    <div class="headline-header">
        <div class="headline-header-text">Headline 1</div>
    </div>
    <div class="headline-row">
        <div class="headline-text-container">
            <label class="headline-label">Headline_id: 1</label>
            <div class="headline-field">
                <textarea class="headline-input" data-headline-id="1">Sample headline</textarea>
            </div>
        </div>
        <div class="headline-rating-container">
            <label class="headline-rating-label">Rating / 100:</label>
            <div class="headline-rating-field">
                <input type="number" class="headline-rating" data-headline-id="1" min="1" max="100" value="85">
            </div>
        </div>
    </div>
</div>
```

## Browser Compatibility
These templates are tested and work across:
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Notes
- All templates use `box-sizing: border-box` for predictable sizing
- Templates are fully responsive and work on mobile devices
- No external dependencies except Inter font (loaded from Penpot CDN)
- All important styles use `!important` to override browser defaults where necessary
