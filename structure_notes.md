# Script Outline Editor - Structure Documentation

## Files Created in Task 1:

1. **script_outline_editor_backup.html** - Full backup reference file
2. **script_editor_styles.css** - Clean extracted CSS styles  
3. **script_editor_functions.js** - Clean extracted JavaScript functions
4. **structure_notes.md** - This documentation file

## Key Components Identified:

### HTML Structure Needed:
- Header section with navigation buttons and status indicators
- Script info display grid
- Working headline and primary keyword fields
- Headline options section (4 headline fields)
- Chapter outlines section (dynamic chapter list)
- Navigation controls at bottom

### CSS Components Extracted:
- Inter font imports (400 and 600 weights)
- Base layout and container styles
- Header navigation and status styles
- Form field styling with focus states
- Button styles with hover effects
- Responsive mobile styles

### JavaScript Functions Extracted:
- Supabase configuration and API setup
- Script loading and data management functions
- Notification badge and completion tracking
- Navigation between scripts
- Auto-resize functionality for textareas
- Event listeners and initialization

## HTML Elements That Need to be Created:

### Header Section:
```html
<div class="header">
    <div class="top-bar">
        <img src="vidsponential logo.png" alt="Logo" class="logo">
        <div class="header-buttons">
            <!-- Navigation buttons with notification badges -->
        </div>
    </div>
    <div class="status-bar">
        <div class="status-indicator" id="statusIndicator">Loading</div>
    </div>
    <div class="completed-today-bar">
        <!-- Completion counters -->
    </div>
    <h1 class="page-title">Script Outline Editor</h1>
</div>
```

### Main Content Structure:
```html
<div id="content">
    <div class="script-info" id="scriptInfo">
        <!-- Script metadata grid -->
    </div>
    
    <div class="main-fields">
        <!-- Working headline and primary keyword fields -->
    </div>
    
    <div class="headline-options">
        <!-- 4 headline option fields -->
    </div>
    
    <div class="chapters-section">
        <!-- Dynamic chapter list -->
    </div>
</div>
```

### Control Section:
```html
<div class="controls">
    <div class="controls-row">
        <div class="navigation">
            <button class="btn btn-secondary" id="prevBtn" onclick="navigateScript(-1)">← Previous</button>
            <button class="btn btn-secondary" id="nextBtn" onclick="navigateScript(1)">Next →</button>
        </div>
        <div>
            <div class="auto-save-indicator" id="autoSaveStatus">Auto-save: Ready</div>
        </div>
        <div>
            <button class="btn btn-success" id="saveBtn" onclick="saveScript()">Save & Continue</button>
        </div>
    </div>
</div>
```

## Issues Found in Original File:

1. **Massive Duplication**: Same JavaScript functions repeated 3-4 times
2. **Broken HTML Structure**: HTML elements mixed inside JavaScript code blocks
3. **Corrupted Script Tags**: JavaScript not properly contained within script tags
4. **Mixed Content**: HTML content appearing in wrong locations
5. **File Size**: 103KB due to excessive duplication

## Next Steps for Task 2:

1. Create clean HTML5 skeleton
2. Add semantic structure without complex styling
3. Include basic form elements
4. Keep it under 10KB initially
5. Test that it loads without errors

## Form Fields Required:

### Main Fields:
- Working Headline (textarea)
- Primary Keyword (input text)
- Both with rating fields (number input 1-100)

### Headline Options:
- 4 headline option textareas
- 4 corresponding rating fields

### Chapter Fields (Dynamic):
- Chapter number display
- Chapter title (textarea)
- Chapter title rating (number input)
- Chapter outline (larger textarea)
- Chapter outline rating (number input)

## Database Integration Points:

- Scripts table: script_id, script_headline, primary_keyword, ratings
- Headlines table: headline_id, headline, ratings  
- Chapters table: chapter_id, chapter_headline, chapter_outline, ratings
- Daily_completions table: completion tracking

## Key Functions Still Needed:

1. `loadCurrentScript()` - Load script data and populate form
2. `displayScriptData()` - Populate all form fields
3. `displayHeadlines()` - Create headline option fields
4. `displayChapters()` - Create chapter fields dynamically
5. `saveScript()` - Save all form data to database
6. `saveCurrentData()` - Core save functionality
7. `validateData()` - Form validation
8. `startAutoSave()` - Auto-save timer

## Files Ready for Task 2:

✅ CSS styles extracted and cleaned
✅ JavaScript functions extracted and organized
✅ Structure documented
✅ Original file backed up

**Ready to proceed with Task 2: Create Clean HTML Structure**
