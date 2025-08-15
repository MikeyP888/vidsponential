// UI manipulation and display functions

import { autoResize, markUnsaved } from './utils.js';

// Display script data in the UI
export function displayScriptData(currentScriptData) {
    if (!currentScriptData) return;

    document.getElementById('content').style.display = 'block';
    document.getElementById('noScriptsMessage').style.display = 'none';
    document.getElementById('scriptInfo').style.display = 'grid';

    // Update script info box
    document.getElementById('scriptIdValue').textContent = currentScriptData.script.script_id;
    
    const clientName = currentScriptData.client 
        ? `${currentScriptData.client.client_first_name || ''} ${currentScriptData.client.client_last_name || ''}`.trim()
        : '-';
    document.getElementById('clientValue').textContent = clientName;
    
    document.getElementById('channelValue').textContent = currentScriptData.channel?.youtube_channel_name || '-';
    document.getElementById('typeValue').textContent = currentScriptData.type?.content_type || '-';
    document.getElementById('genreValue').textContent = currentScriptData.genre?.genre || '-';
    document.getElementById('subgenreValue').textContent = currentScriptData.subgenre?.subgenre || '-';
    document.getElementById('wordsValue').textContent = currentScriptData.script.target_word_count || '-';
    document.getElementById('formatValue').textContent = currentScriptData.format?.script_format || '-';
    document.getElementById('structureValue').textContent = currentScriptData.structure?.script_structure || '-';
    document.getElementById('researchValue').textContent = currentScriptData.research?.research_depth || '-';
    document.getElementById('toneValue').textContent = currentScriptData.tone?.emotional_tone || '-';
    document.getElementById('angleValue').textContent = currentScriptData.angle?.content_angle || '-';

    document.getElementById('workingHeadline').value = currentScriptData.script.script_headline || '';
    document.getElementById('primaryKeyword').value = currentScriptData.script.primary_keyword || '';
    document.getElementById('workingHeadlineRating').value = currentScriptData.script.script_headline_mp_rating || '';
    document.getElementById('primaryKeywordRating').value = currentScriptData.script.primary_keyword_mp_rating || '';

    displayHeadlines(currentScriptData);
    displayChapters(currentScriptData);
}

// Display headlines section
export function displayHeadlines(currentScriptData) {
    const container = document.getElementById('headlinesList');
    container.innerHTML = '';

    // Create single section container for all headline options
    const headlineSection = document.createElement('div');
    headlineSection.className = 'chapter-se-7a2807fb2c0d';
    
    let headlineRows = '';
    
    // Create 4 headline option rows using the actual top-rated headlines
    for (let i = 0; i < 4; i++) {
        const headline = currentScriptData.headlines[i] || { headline_id: null, headline: '', headline_mp_rating: '' };
        
        headlineRows += `
            <!-- Headline Option ${i + 1} Row -->
            <div class="ch-title-7a2807fb2c0f">
                <!-- Headline Text + Label -->
                <div class="title-la-7a2807fb2c1a">
                    <label class="label-ch-7a2807fb2c1f">Headline Option ${i + 1}:</label>
                    <div class="title-fiel-7a2807fb2c1e">
                        <textarea class="chapter-ti-7a2807fb2c20" data-headline-id="${headline.headline_id}" data-position="${i + 1}">${headline.headline || ''}</textarea>
                    </div>
                </div>
                
                <!-- Headline Rating + Label -->
                <div class="title-rating-l-7a2807fb2c19">
                    <label class="label-rat-7a2807fb2c1c">Rating / 100:</label>
                    <div class="rating-fie-7a2807fb2c1b">
                        <input type="number" class="rating-7a2807fb2c1d" data-headline-id="${headline.headline_id}" data-field="headline_mp_rating" data-position="${i + 1}" min="1" max="100" value="${headline.headline_mp_rating || ''}">
                    </div>
                </div>
            </div>
        `;
    }
    
    headlineSection.innerHTML = headlineRows;
    container.appendChild(headlineSection);
    
    // Apply auto-resize to all headline text fields with proper timing
    setTimeout(() => {
        container.querySelectorAll('.chapter-ti-7a2807fb2c20').forEach(textarea => {
            autoResize(textarea);
            // Force a second resize after DOM is fully settled
            setTimeout(() => autoResize(textarea), 100);
        });
    }, 50);
}

// Display chapters section
export function displayChapters(currentScriptData) {
    const container = document.getElementById('chaptersList');
    container.innerHTML = '';

    currentScriptData.chapters.forEach(chapter => {
        const chapterDiv = document.createElement('div');
        chapterDiv.className = 'chapter-se-7a2807fb2c0d';
        chapterDiv.innerHTML = `
            <!-- Chapter Number Container -->
            <div class="chapter-nu-7a2807fb2c10">
                <div class="chapter-nu-7a2807fb2c21">Chapter ${chapter.chapter_number}</div>
            </div>
            
            <!-- Ch Title + Rating -->
            <div class="ch-title-7a2807fb2c0f">
                <!-- Title + Label -->
                <div class="title-la-7a2807fb2c1a">
                    <label class="label-ch-7a2807fb2c1f">Chapter Title:</label>
                    <div class="title-fiel-7a2807fb2c1e">
                        <textarea class="chapter-ti-7a2807fb2c20" data-chapter-id="${chapter.chapter_id}">${chapter.chapter_headline || ''}</textarea>
                    </div>
                </div>
                
                <!-- Title Rating + Label -->
                <div class="title-rating-l-7a2807fb2c19">
                    <label class="label-rat-7a2807fb2c1c">Rating / 100:</label>
                    <div class="rating-fie-7a2807fb2c1b">
                        <input type="number" class="rating-7a2807fb2c1d" data-chapter-id="${chapter.chapter_id}" data-field="chapter_headline_mp_rating" min="1" max="100" value="${chapter.chapter_headline_mp_rating || ''}">
                    </div>
                </div>
            </div>
            
            <!-- Ch Outline + Rating -->
            <div class="ch-outline-7a2807fb2c0e">
                <!-- Outline + Label -->
                <div class="outline-7a2807fb2c12">
                    <label class="label-ch-7a2807fb2c17">Chapter Outline:</label>
                    <div class="outline-fi-7a2807fb2c16">
                        <textarea class="chapter-ou-7a2807fb2c18" data-chapter-id="${chapter.chapter_id}">${chapter.chapter_outline || ''}</textarea>
                    </div>
                </div>
                
                <!-- Outline Rating + Label -->
                <div class="outline-rating-l-7a2807fb2c11">
                    <label class="label-rat-7a2807fb2c14">Rating / 100:</label>
                    <div class="rating-fie-7a2807fb2c13">
                        <input type="number" class="rating-7a2807fb2c15" data-chapter-id="${chapter.chapter_id}" data-field="chapter_outline_mp_rating" min="1" max="100" value="${chapter.chapter_outline_mp_rating || ''}">
                    </div>
                </div>
            </div>
        `;
        container.appendChild(chapterDiv);
    });
    
    // Apply auto-resize to all chapter text fields with proper timing
    setTimeout(() => {
        container.querySelectorAll('.chapter-ti-7a2807fb2c20, .chapter-ou-7a2807fb2c18').forEach(textarea => {
            autoResize(textarea);
            // Force a second resize after DOM is fully settled
            setTimeout(() => autoResize(textarea), 100);
        });
    }, 50);
}

// Set up event listeners for form elements
export function setupEventListeners(saveScript) {
    const workingHeadline = document.getElementById('workingHeadline');
    const primaryKeyword = document.getElementById('primaryKeyword');
    const workingHeadlineRating = document.getElementById('workingHeadlineRating');
    const primaryKeywordRating = document.getElementById('primaryKeywordRating');
    
    workingHeadline.addEventListener('input', markUnsaved);
    primaryKeyword.addEventListener('input', markUnsaved);
    workingHeadlineRating.addEventListener('input', markUnsaved);
    primaryKeywordRating.addEventListener('input', markUnsaved);
    autoResize(workingHeadline);

    document.addEventListener('input', function(e) {
        if (e.target.matches('.chapter-ti-7a2807fb2c20, .chapter-ou-7a2807fb2c18, .rating-7a2807fb2c1d, .rating-7a2807fb2c15')) {
            markUnsaved();
            
            if (e.target.matches('.chapter-ti-7a2807fb2c20, .chapter-ou-7a2807fb2c18')) {
                autoResize(e.target);
            }
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveScript();
        }
    });
}

// Update notification badges in header
export function updateNotificationBadges(counts) {
    const outlinesBadge = document.getElementById('outlinesBadge');
    const chaptersBadge = document.getElementById('chaptersBadge');
    const visualsBadge = document.getElementById('visualsBadge');
    
    if (counts.outlines > 0) {
        outlinesBadge.textContent = counts.outlines;
        outlinesBadge.style.display = 'flex';
    } else {
        outlinesBadge.style.display = 'none';
    }
    
    if (counts.chapters > 0) {
        chaptersBadge.textContent = counts.chapters;
        chaptersBadge.style.display = 'flex';
    } else {
        chaptersBadge.style.display = 'none';
    }
    
    if (counts.visuals > 0) {
        visualsBadge.textContent = counts.visuals;
        visualsBadge.style.display = 'flex';
    } else {
        visualsBadge.style.display = 'none';
    }
}

// Update completion count displays
export function updateCompletionCounts(counts) {
    document.getElementById('outlinesCompletedTodayCount').textContent = counts.outlinesCount;
    document.getElementById('scriptsCompletedTodayCount').textContent = counts.scriptsCount;
}