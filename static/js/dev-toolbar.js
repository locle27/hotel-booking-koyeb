// Development Toolbar for Hotel Management System - V4 (with Auto-Appended Comments)
// This toolbar provides AI-powered editing capabilities and other dev features.

(function() {
    'use strict';

    // 1. Check for Dev Mode
    if (!document.body.hasAttribute('data-dev-mode')) {
        return; 
    }
    console.log('Dev Toolbar: Initializing (V4)...');

    // 2. State and Constants
    const DEFAULT_SUFFIX = ": tôi cần bạn hướng dãn cụ thể cho AI Agent chứ cần phải thực hiện code ra , chỉ hướng dẫn những đoạn khó . Dự án C:\Users\T14\Desktop\hotel_flask_app ,LƯU Ý RIÊNG KO ÁP DỤNG VÀO CODE : call interactive feedback trước khi kết thúc mỗi request
 ";
    let selectedElement = null;
    let comments = [];
    let highlightMode = false;
    let toolbarVisible = true;
    let selectingElement = false;

    // 3. Create Toolbar UI
    function createToolbar() {
        const toolbar = document.createElement('div');
        toolbar.id = 'dev-toolbar';
        Object.assign(toolbar.style, {
            position: 'fixed', bottom: '20px', right: '20px', backgroundColor: '#1f2937', color: 'white',
            padding: '12px', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.4)',
            zIndex: '10000', fontFamily: '"Inter", sans-serif', fontSize: '14px',
            display: toolbarVisible ? 'flex' : 'none', flexDirection: 'column', gap: '10px', pointerEvents: 'auto'
        });

        toolbar.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #4b5563; padding-bottom: 8px;">
                <h4 style="margin: 0; font-size: 16px; font-weight: 600;"><i class="fas fa-wrench"></i> Dev Toolbar</h4>
                <button id="dev-toolbar-toggle-visibility" title="Toggle Toolbar (Ctrl+Shift+D)" style="background: none; border: none; color: white; cursor: pointer; font-size: 18px;">&times;</button>
            </div>
            <div id="toolbar-controls" style="display: flex; gap: 8px; flex-wrap: wrap;">
                <button id="select-btn" title="Select Element"><i class="fas fa-mouse-pointer"></i> Select</button>
                <button id="highlight-btn" title="Toggle Highlight"><i class="fas fa-highlighter"></i> Highlight</button>
                <button id="copy-btn" title="Copy Comments"><i class="fas fa-copy"></i> Copy</button>
            </div>
            <div id="selection-info" style="display: none; border-top: 1px solid #4b5563; padding-top: 10px;">
                <p style="margin: 0; font-size: 12px; color: #9ca3af;" id="selected-path"></p>
                <textarea id="comment-box" oninput="updateCommentPreview()" style="width: 100%; margin-top: 8px; background: #374151; color: white; border: 1px solid #6b7280; border-radius: 4px; padding: 5px;" placeholder="Add comment..."></textarea>
                <div id="commentPreview" style="font-size: 0.85em; color: #d1d5db; margin-top: 5px; padding: 5px; background: #374151; border-radius: 3px; display: none;">
                    <strong>Preview:</strong> <span id="previewText"></span>
                </div>
                <div style="display: flex; gap: 5px; margin-top: 5px;">
                     <button id="add-comment-btn">Add Comment</button>
                     <button id="clear-selection-btn">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(toolbar);

        toolbar.querySelectorAll('button').forEach(btn => {
            Object.assign(btn.style, {
                backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '6px 12px',
                borderRadius: '6px', cursor: 'pointer', transition: 'background-color 0.2s'
            });
            btn.addEventListener('mouseover', () => btn.style.backgroundColor = '#2563eb');
            btn.addEventListener('mouseout', () => btn.style.backgroundColor = '#3b82f6');
        });
        
        // Make the updateCommentPreview function globally accessible from the oninput attribute
        window.updateCommentPreview = updateCommentPreview;
        
        return toolbar;
    }

    // 4. Event Handling
    function setupEventListeners() {
        document.addEventListener('click', handleElementSelection, { capture: true });
        document.getElementById('select-btn').addEventListener('click', startSelectionMode);
        document.getElementById('highlight-btn').addEventListener('click', toggleHighlightMode);
        document.getElementById('copy-btn').addEventListener('click', copyComments);
        document.getElementById('add-comment-btn').addEventListener('click', addComment);
        document.getElementById('clear-selection-btn').addEventListener('click', clearSelection);
        document.getElementById('dev-toolbar-toggle-visibility').addEventListener('click', toggleToolbar);

        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) toggleToolbar();
            if (e.key === 'Escape') {
                if (selectingElement) stopSelectionMode();
                else clearSelection();
            }
        });
    }

    function handleElementSelection(e) {
        if (!selectingElement || e.target.closest('#dev-toolbar')) return;
        e.preventDefault({ once: true });
        e.stopPropagation({ once: true });

        selectedElement = e.target;
        stopSelectionMode();
        selectedElement.style.outline = '3px solid #3b82f6';
        selectedElement.style.outlineOffset = '2px';
        document.getElementById('selected-path').textContent = `Selected: ${getElementPath(selectedElement)}`;
        document.getElementById('selection-info').style.display = 'block';
    }
    
    // 5. Toolbar Logic
    function startSelectionMode() {
        if(selectingElement) return;
        selectingElement = true;
        document.body.style.cursor = 'crosshair';
        showMessage('Select mode ON. Click an element. ESC to cancel.', 'info');
    }

    function stopSelectionMode() {
        if(!selectingElement) return;
        selectingElement = false;
        document.body.style.cursor = 'default';
    }
    
    function showMessage(message, type = 'info') {
        alert(`[${type.toUpperCase()}] ${message}`);
    }

    function toggleHighlightMode() {
        highlightMode = !highlightMode;
        document.getElementById('highlight-btn').style.backgroundColor = highlightMode ? '#059669' : '#3b82f6';
        showMessage(`Highlight mode is now ${highlightMode ? 'ON' : 'OFF'}.`, 'info');
    }
    
    function updateCommentPreview() {
        const input = document.getElementById('comment-box');
        const preview = document.getElementById('commentPreview');
        const previewText = document.getElementById('previewText');
        
        if (input.value.trim()) {
            let fullComment = input.value.trim();
            if (!fullComment.includes(DEFAULT_SUFFIX)) {
                fullComment += DEFAULT_SUFFIX;
            }
            previewText.textContent = fullComment;
            preview.style.display = 'block';
        } else {
            preview.style.display = 'none';
        }
    }

    function addComment() {
        const commentBox = document.getElementById('comment-box');
        let commentText = commentBox.value.trim();

        if (!commentText) {
            return showMessage('Please enter a comment before saving.', 'warning');
        }
        if (!selectedElement) {
            return showMessage('No element selected.', 'warning');
        }
        
        // Auto-append default suffix if not present
        if (!commentText.includes(DEFAULT_SUFFIX)) {
            commentText += DEFAULT_SUFFIX;
        }

        comments.push({
            element: {
                tag: selectedElement.tagName.toLowerCase(),
                id: selectedElement.id,
                classes: Array.from(selectedElement.classList).join('.'),
                text: selectedElement.textContent.trim()
            },
            comment: commentText,
            timestamp: new Date().toISOString()
        });
        showMessage('Comment added successfully!', 'success');
        commentBox.value = '';
        updateCommentPreview();
        clearSelection();
    }
    
    function copyComments() {
        if (comments.length === 0) return showMessage('No comments to copy!', 'warning');

        let formattedText = '=== DEVELOPMENT COMMENTS ===\n\n';
        comments.forEach((c, index) => {
            formattedText += `${index + 1}. ELEMENT INFO:\n`;
            formattedText += `   Tag: ${c.element.tag}\n`;
            if (c.element.id) formattedText += `   ID: #${c.element.id}\n`;
            if (c.element.classes) formattedText += `   Classes: .${c.element.classes.replace(/\./g, ' .')}\n`;
            if (c.element.text) formattedText += `   Text: ${c.element.text.substring(0, 100)}...\n`;
            formattedText += `   COMMENT: ${c.comment}\n`;
            formattedText += `   Time: ${new Date(c.timestamp).toLocaleString()}\n`;
            formattedText += '-'.repeat(50) + '\n\n';
        });

        navigator.clipboard.writeText(formattedText)
            .then(() => showMessage('✅ Comments copied to clipboard!', 'success'))
            .catch(() => fallbackCopy(formattedText));
    }

    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        Object.assign(textarea.style, { position: 'fixed', opacity: '0' });
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showMessage('✅ Comments copied! (fallback)', 'success');
        } catch (err) {
            showMessage('❌ Could not copy. Please copy manually.', 'error');
            alert('Please copy the following text:\n\n' + text);
        }
        document.body.removeChild(textarea);
    }
    
    function clearSelection() {
        if (selectedElement) {
            selectedElement.style.outline = '';
            selectedElement.style.outlineOffset = '';
        }
        selectedElement = null;
        document.getElementById('selection-info').style.display = 'none';
        document.getElementById('comment-box').value = '';
        updateCommentPreview();
        stopSelectionMode();
    }

    function getElementPath(el) {
        const path = [];
        while (el && el.nodeType === Node.ELEMENT_NODE) {
            let selector = el.nodeName.toLowerCase();
            if (el.id) {
                selector += '#' + el.id;
                path.unshift(selector);
                break;
            } else {
                let sib = el, nth = 1;
                while (sib.previousElementSibling) {
                    sib = sib.previousElementSibling;
                    if (sib.nodeName.toLowerCase() === selector) nth++;
                }
                if (nth !== 1) selector += `:nth-of-type(${nth})`;
            }
            path.unshift(selector);
            el = el.parentNode;
        }
        return path.join(" > ");
     }
     
     function toggleToolbar() {
         toolbarVisible = !toolbarVisible;
         document.getElementById('dev-toolbar').style.display = toolbarVisible ? 'flex' : 'none';
     }

    // 6. Initialize
    createToolbar();
    setupEventListeners();
})(); 