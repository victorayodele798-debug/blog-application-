
/* =========================================================
   ARTICLEHUB — ARTICLE SUBMISSION
   File: js/article-submission.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       1. ELEMENT REFERENCES
       ===================================================== */

    const form = document.getElementById(
        "article-submission-form"
    );

    const titleInput = document.getElementById(
        "article-title"
    );

    const excerptInput = document.getElementById(
        "article-excerpt"
    );

    const editor = document.getElementById(
        "article-editor"
    );

    const categoryInput = document.getElementById(
        "article-category"
    );

    const languageInput = document.getElementById(
        "article-language"
    );

    const tagsInput = document.getElementById(
        "article-tags"
    );

    const coverInput = document.getElementById(
        "article-cover-image"
    );

    const coverPreview = document.getElementById(
        "cover-image-preview"
    );

    const coverPlaceholder = document.getElementById(
        "cover-upload-placeholder"
    );

    const coverPreviewImage = document.getElementById(
        "cover-preview-image"
    );

    const coverFileName = document.getElementById(
        "cover-file-name"
    );

    const coverAltInput = document.getElementById(
        "cover-image-alt"
    );

    const inlineImageInput = document.getElementById(
        "article-inline-image-input"
    );

    const submissionMessage = document.getElementById(
        "submission-message"
    );

    const editorStatus = document.getElementById(
        "editor-status"
    );


    /* =====================================================
       2. BUTTON REFERENCES
       ===================================================== */

    const chooseCoverButton = document.getElementById(
        "choose-cover-image"
    );

    const replaceCoverButton = document.getElementById(
        "replace-cover-image"
    );

    const removeCoverButton = document.getElementById(
        "remove-cover-image"
    );

    const insertImageButton = document.getElementById(
        "insert-article-image"
    );

    const insertLinkButton = document.getElementById(
        "insert-link-button"
    );

    const saveDraftButton = document.getElementById(
        "save-article-draft"
    );

    const previewButton = document.getElementById(
        "preview-article"
    );

    const submitButton = document.getElementById(
        "submit-article"
    );


    /* =====================================================
       3. CONFIGURATION
       ===================================================== */

    const DRAFT_STORAGE_KEY = "articlehub-submission-draft";

    const MAX_COVER_SIZE = 5 * 1024 * 1024;

    const MAX_INLINE_IMAGE_SIZE = 3 * 1024 * 1024;

    const ALLOWED_IMAGE_TYPES = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    let selectedCoverData = "";

    let savedEditorRange = null;


    /* =====================================================
       4. GENERAL HELPER FUNCTIONS
       ===================================================== */

    function showMessage(message, type = "info") {

        if (!submissionMessage) {
            return;
        }

        submissionMessage.textContent = message;

        submissionMessage.className =
            "submission-message " + type;

        submissionMessage.hidden = false;

        submissionMessage.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    }


    function hideMessage() {

        if (!submissionMessage) {
            return;
        }

        submissionMessage.hidden = true;

        submissionMessage.textContent = "";

        submissionMessage.className = "submission-message";

    }


    function updateEditorStatus(message) {

        if (editorStatus) {
            editorStatus.textContent = message;
        }

    }


    function readFileAsDataURL(file) {

        return new Promise(function (resolve, reject) {

            const reader = new FileReader();

            reader.onload = function () {
                resolve(reader.result);
            };

            reader.onerror = function () {
                reject(new Error("Unable to read the selected file."));
            };

            reader.readAsDataURL(file);

        });

    }


    function isAllowedImage(file) {

        return (
            file &&
            ALLOWED_IMAGE_TYPES.includes(file.type)
        );

    }


    /* =====================================================
       5. TITLE CHARACTER COUNT
       ===================================================== */

    const titleCount = document.getElementById(
        "title-character-count"
    );

    function updateTitleCount() {

        if (!titleInput || !titleCount) {
            return;
        }

        titleCount.textContent =
            `${titleInput.value.length} / 150`;

    }

    if (titleInput) {

        titleInput.addEventListener(
            "input",
            updateTitleCount
        );

    }


    /* =====================================================
       6. EXCERPT CHARACTER COUNT
       ===================================================== */

    const excerptCount = document.getElementById(
        "excerpt-character-count"
    );

    function updateExcerptCount() {

        if (!excerptInput || !excerptCount) {
            return;
        }

        excerptCount.textContent =
            `${excerptInput.value.length} / 300`;

    }

    if (excerptInput) {

        excerptInput.addEventListener(
            "input",
            updateExcerptCount
        );

    }


    /* =====================================================
       7. ARTICLE WORD COUNT
       ===================================================== */

    const wordCount = document.getElementById(
        "article-word-count"
    );

    function updateWordCount() {

        if (!editor || !wordCount) {
            return;
        }

        const text = editor.innerText.trim();

        const words = text
            ? text.split(/\s+/).filter(Boolean).length
            : 0;

        wordCount.textContent =
            `${words} ${words === 1 ? "word" : "words"}`;

    }

    if (editor) {

        editor.addEventListener(
            "input",
            updateWordCount
        );

        editor.addEventListener(
            "keyup",
            updateWordCount
        );

        editor.addEventListener(
            "paste",
            function () {

                setTimeout(updateWordCount, 0);

            }
        );

    }


    /* =====================================================
       8. EDITOR SELECTION MANAGEMENT
       ===================================================== */

    function saveEditorSelection() {

        if (!editor) {
            return;
        }

        const selection = window.getSelection();

        if (
            selection &&
            selection.rangeCount > 0 &&
            editor.contains(selection.anchorNode)
        ) {

            savedEditorRange =
                selection.getRangeAt(0).cloneRange();

        }

    }


    function restoreEditorSelection() {

        if (!editor || !savedEditorRange) {
            return;
        }

        editor.focus();

        const selection = window.getSelection();

        selection.removeAllRanges();

        selection.addRange(savedEditorRange);

    }


    if (editor) {

        editor.addEventListener(
            "keyup",
            saveEditorSelection
        );

        editor.addEventListener(
            "mouseup",
            saveEditorSelection
        );

        editor.addEventListener(
            "focus",
            saveEditorSelection
        );

    }


    /* =====================================================
       9. EDITOR FORMATTING TOOLBAR
       ===================================================== */

    const editorTools = document.querySelectorAll(
        ".editor-tool[data-command]"
    );


    // Preserve the editor selection when toolbar buttons
    // receive mouse interaction.

    editorTools.forEach(function (button) {

        button.addEventListener(
            "mousedown",
            function (event) {

                event.preventDefault();

            }
        );

        button.addEventListener(
            "click",
            function () {

                if (!editor) {
                    return;
                }

                const command = button.dataset.command;

                const value = button.dataset.value || null;

                restoreEditorSelection();

                if (command === "formatBlock") {

                    document.execCommand(
                        command,
                        false,
                        `<${value}>`
                    );

                } else {

                    document.execCommand(
                        command,
                        false,
                        value
                    );

                }

                editor.focus();

                saveEditorSelection();

                updateWordCount();

                button.classList.toggle("active");

            }
        );

    });


    /* =====================================================
       10. INSERT ARTICLE LINK
       ===================================================== */

    if (insertLinkButton && editor) {

        insertLinkButton.addEventListener(
            "mousedown",
            function (event) {

                event.preventDefault();

            }
        );

        insertLinkButton.addEventListener(
            "click",
            function () {

                restoreEditorSelection();

                const url = prompt(
                    "Enter the complete website address (https://...)"
                );

                if (!url) {
                    return;
                }

                let validatedURL;

                try {

                    validatedURL = new URL(url.trim());

                } catch {

                    showMessage(
                        "Please enter a valid website address.",
                        "error"
                    );

                    return;

                }

                if (
                    !["http:", "https:"].includes(
                        validatedURL.protocol
                    )
                ) {

                    showMessage(
                        "Only HTTP and HTTPS links are supported.",
                        "error"
                    );

                    return;

                }

                const selection = window.getSelection();

                if (
                    !selection ||
                    selection.rangeCount === 0 ||
                    !editor.contains(selection.anchorNode)
                ) {

                    showMessage(
                        "Select some text in your article before inserting a link.",
                        "info"
                    );

                    return;

                }

                document.execCommand(
                    "createLink",
                    false,
                    validatedURL.href
                );

                editor.focus();

                saveEditorSelection();

            }
        );

    }


    /* =====================================================
       11. COVER IMAGE UPLOAD
       ===================================================== */

    function openCoverFilePicker() {

        if (coverInput) {
            coverInput.click();
        }

    }


    if (chooseCoverButton) {

        chooseCoverButton.addEventListener(
            "click",
            openCoverFilePicker
        );

    }

    if (replaceCoverButton) {

        replaceCoverButton.addEventListener(
            "click",
            openCoverFilePicker
        );

    }


    async function handleCoverImage(file) {

        if (!file) {
            return;
        }

        if (!isAllowedImage(file)) {

            showMessage(
                "Unsupported image format. Please choose a JPG, PNG or WebP image.",
                "error"
            );

            coverInput.value = "";

            return;

        }

        if (file.size > MAX_COVER_SIZE) {

            showMessage(
                "The cover image is too large. Please choose an image smaller than 5 MB.",
                "error"
            );

            coverInput.value = "";

            return;

        }

        try {

            const imageData = await readFileAsDataURL(file);

            selectedCoverData = imageData;

            coverPreviewImage.src = imageData;

            coverFileName.textContent = file.name;

            coverPlaceholder.hidden = true;

            coverPreview.hidden = false;

            updateEditorStatus("Cover image selected");

            hideMessage();

        } catch (error) {

            showMessage(
                error.message,
                "error"
            );

        }

    }


    if (coverInput) {

        coverInput.addEventListener(
            "change",
            function () {

                const file = coverInput.files[0];

                handleCoverImage(file);

            }
        );

    }


    /* =====================================================
       12. REMOVE COVER IMAGE
       ===================================================== */

    if (removeCoverButton) {

        removeCoverButton.addEventListener(
            "click",
            function () {

                selectedCoverData = "";

                coverInput.value = "";

                coverPreviewImage.removeAttribute("src");

                coverFileName.textContent = "";

                coverAltInput.value = "";

                coverPreview.hidden = true;

                coverPlaceholder.hidden = false;

                updateEditorStatus("Cover image removed");

            }
        );

    }


    /* =====================================================
       13. INLINE ARTICLE IMAGE UPLOAD
       ===================================================== */

    if (insertImageButton && inlineImageInput) {

        insertImageButton.addEventListener(
            "mousedown",
            function (event) {

                event.preventDefault();

            }
        );

        insertImageButton.addEventListener(
            "click",
            function () {

                saveEditorSelection();

                inlineImageInput.click();

            }
        );

    }


    if (inlineImageInput) {

        inlineImageInput.addEventListener(
            "change",
            async function () {

                const file = inlineImageInput.files[0];

                if (!file) {
                    return;
                }

                if (!isAllowedImage(file)) {

                    showMessage(
                        "Please select a JPG, PNG or WebP image.",
                        "error"
                    );

                    inlineImageInput.value = "";

                    return;

                }

                if (file.size > MAX_INLINE_IMAGE_SIZE) {

                    showMessage(
                        "Inline images must be smaller than 3 MB.",
                        "error"
                    );

                    inlineImageInput.value = "";

                    return;

                }

                try {

                    const imageData =
                        await readFileAsDataURL(file);

                    restoreEditorSelection();

                    const image = document.createElement("img");

                    image.src = imageData;

                    image.alt = "";

                    image.loading = "lazy";

                    const selection = window.getSelection();

                    if (
                        savedEditorRange &&
                        editor.contains(savedEditorRange.commonAncestorContainer)
                    ) {

                        savedEditorRange.deleteContents();

                        savedEditorRange.insertNode(image);

                        const paragraph =
                            document.createElement("p");

                        image.after(paragraph);

                        const range =
                            document.createRange();

                        range.setStart(paragraph, 0);

                        range.collapse(true);

                        selection.removeAllRanges();

                        selection.addRange(range);

                    } else {

                        editor.appendChild(image);

                        editor.appendChild(
                            document.createElement("p")
                        );

                    }

                    editor.focus();

                    saveEditorSelection();

                    updateWordCount();

                    hideMessage();

                } catch (error) {

                    showMessage(
                        "Unable to insert this image. Please try again.",
                        "error"
                    );

                }

                inlineImageInput.value = "";

            }
        );

    }


    /* =====================================================
       14. IMAGE DRAG AND DROP
       ===================================================== */

    const coverUploadArea = document.getElementById(
        "cover-upload-area"
    );

    if (coverUploadArea) {

        coverUploadArea.addEventListener(
            "dragover",
            function (event) {

                event.preventDefault();

                coverUploadArea.classList.add("dragging");

            }
        );

        coverUploadArea.addEventListener(
            "dragleave",
            function () {

                coverUploadArea.classList.remove("dragging");

            }
        );

        coverUploadArea.addEventListener(
            "drop",
            function (event) {

                event.preventDefault();

                coverUploadArea.classList.remove("dragging");

                const file = event.dataTransfer.files[0];

                if (!file) {
                    return;
                }

                handleCoverImage(file);

            }
        );

    }


    /* =====================================================
       15. COLLECT ARTICLE DATA
       ===================================================== */

    function collectArticleData() {

        const tags = tagsInput.value
            .split(",")
            .map(function (tag) {
                return tag.trim();
            })
            .filter(Boolean);

        return {

            title: titleInput.value.trim(),

            excerpt: excerptInput.value.trim(),

            content: editor.innerHTML,

            category: categoryInput.value,

            language: languageInput.value,

            tags: tags,

            coverImage: selectedCoverData,

            coverImageName:
                coverFileName.textContent || "",

            coverImageAlt:
                coverAltInput.value.trim(),

            updatedAt: new Date().toISOString()

        };

    }


    /* =====================================================
       16. SAVE ARTICLE DRAFT
       ===================================================== */

    function saveDraft() {

        const articleData = collectArticleData();

        try {

            localStorage.setItem(
                DRAFT_STORAGE_KEY,
                JSON.stringify(articleData)
            );

            updateEditorStatus("Draft saved loc
            updateEditorStatus("Draft saved locally");

            showMessage(
                "Your draft has been saved in this browser on this device. It has not been uploaded to ArticleHub.",
                "success"
            );

        } catch (error) {

            showMessage(
                "The draft could not be saved. Browser storage may be full, especially if your article contains large images. Try removing some images and saving again.",
                "error"
            );

        }

    }


    if (saveDraftButton) {

        saveDraftButton.addEventListener(
            "click",
            saveDraft
        );

    }


    /* =====================================================
       17. RESTORE SAVED DRAFT
       ===================================================== */

    function restoreDraft() {

        try {

            const savedDraft = localStorage.getItem(
                DRAFT_STORAGE_KEY
            );

            if (!savedDraft) {
                return;
            }

            const draft = JSON.parse(savedDraft);

            const shouldRestore = confirm(
                "A previously saved ArticleHub draft was found in this browser. Would you like to restore it?"
            );

            if (!shouldRestore) {
                return;
            }

            titleInput.value = draft.title || "";

            excerptInput.value = draft.excerpt || "";

            editor.innerHTML = draft.content || "";

            categoryInput.value = draft.category || "";

            languageInput.value = draft.language || "en";

            tagsInput.value = Array.isArray(draft.tags)
                ? draft.tags.join(", ")
                : "";

            coverAltInput.value =
                draft.coverImageAlt || "";

            if (draft.coverImage) {

                selectedCoverData = draft.coverImage;

                coverPreviewImage.src = draft.coverImage;

                coverFileName.textContent =
                    draft.coverImageName || "Saved cover image";

                coverPlaceholder.hidden = true;

                coverPreview.hidden = false;

            }

            updateTitleCount();

            updateExcerptCount();

            updateWordCount();

            updateEditorStatus("Draft restored");

            showMessage(
                "Your previously saved draft has been restored.",
                "success"
            );

        } catch (error) {

            showMessage(
                "The saved draft could not be restored. It may be damaged or incompatible.",
                "error"
            );

        }

    }

    restoreDraft();


    /* =====================================================
       18. SANITIZE ARTICLE HTML FOR PREVIEW
       ===================================================== */

    function sanitizeArticleHTML(html) {

        const template = document.createElement("template");

        template.innerHTML = html;

        const forbiddenElements = template.content.querySelectorAll(
            "script, style, iframe, object, embed, form, input, button"
        );

        forbiddenElements.forEach(function (element) {
            element.remove();
        });

        const allElements =
            template.content.querySelectorAll("*");

        allElements.forEach(function (element) {

            Array.from(element.attributes).forEach(
                function (attribute) {

                    const name = attribute.name.toLowerCase();

                    const value = attribute.value.trim().toLowerCase();

                    if (name.startsWith("on")) {

                        element.removeAttribute(attribute.name);

                    }

                    if (
                        ["href", "src", "xlink:href"].includes(name) &&
                        (
                            value.startsWith("javascript:") ||
                            value.startsWith("vbscript:") ||
                            (
                                value.startsWith("data:") &&
                                !(
                                    name === "src" &&
                                    value.startsWith("data:image/")
                                )
                            )
                        )
                    ) {

                        element.removeAttribute(attribute.name);

                    }

                }
            );

        });

        return template.innerHTML;

    }


    /* =====================================================
       19. ARTICLE PREVIEW
       ===================================================== */

    function previewArticle() {

        const title = titleInput.value.trim();

        const excerpt = excerptInput.value.trim();

        const content = editor.innerHTML.trim();

        if (!title && !excerpt && !editor.innerText.trim()) {

            showMessage(
                "Add some article content before opening the preview.",
                "error"
            );

            return;

        }

        const previewWindow = window.open(
            "",
            "_blank"
        );

        if (!previewWindow) {

            showMessage(
                "Your browser blocked the preview window. Allow pop-ups for this site and try again.",
                "error"
            );

            return;

        }

        const safeContent = sanitizeArticleHTML(content);

        const safeTitle = title || "Untitled Article";

        const safeExcerpt = excerpt || "";

        const safeCover = selectedCoverData;

        const safeAlt = coverAltInput.value.trim();

        const documentContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport"
                      content="width=device-width, initial-scale=1.0">

                <title>Article Preview | ArticleHub</title>

                <style>

                    * {
                        box-sizing: border-box;
                    }

                    body {
                        margin: 0;
                        background: #f4f7fc;
                        color: #17243b;
                        font-family: Arial, sans-serif;
                        line-height: 1.8;
                    }

                    .preview-header {
                        padding: 20px;
                        background: #ffffff;
                        border-bottom: 1px solid #e0e7f1;
                        text-align: center;
                        font-weight: 800;
                        color: #1262e8;
                    }

                    .preview-notice {
                        margin: 25px auto;
                        width: min(850px, 92%);
                        padding: 12px 16px;
                        background: #e4efff;
                        border-radius: 8px;
                        color: #0849bd;
                        font-size: 13px;
                        text-align: center;
                    }

                    .preview-article {
                        width: min(850px, 92%);
                        margin: 30px auto 70px;
                        padding: 40px;
                        background: #ffffff;
                        border-radius: 14px;
                        box-shadow: 0 10px 35px rgba(18,50,100,.07);
                    }

                    h1 {
                        margin: 0 0 20px;
                        font-size: clamp(28px, 5vw, 42px);
                        line-height: 1.25;
                    }

                    .preview-excerpt {
                        margin-bottom: 25px;
                        color: #64748b;
                        font-size: 17px;
                    }

                    .preview-cover {
                        width: 100%;
                        max-height: 430px;
                        object-fit: cover;
                        border-radius: 10px;
                        margin-bottom: 25px;
                    }

                    .preview-body {
                        overflow-wrap: anywhere;
                        font-size: 16px;
                    }

                    .preview-body img {
                        display: block;
                        max-width: 100%;
                        height: auto;
                        margin: 25px auto;
                        border-radius: 9px;
                    }

                    .preview-body h2 {
                        margin-top: 35px;
                        font-size: 27px;
                    }

                    .preview-body h3 {
                        margin-top: 25px;
                        font-size: 21px;
                    }

                    .preview-body a {
                        color: #1262e8;
                    }

                    @media (max-width: 600px) {

                        .preview-article {
                            padding: 23px 18px;
                        }

                    }

                </style>

            </head>

            <body>

                <header class="preview-header">
                    ArticleHub
                </header>

                <div class="preview-notice">
                    This is a preview of your article.
                    It has not been published.
                </div>

                <main class="preview-article">

                    <h1 id="preview-title"></h1>

                    <p class="preview-excerpt"
                       id="preview-excerpt"></p>

                    <img
                        id="preview-cover"
                        class="preview-cover"
                        hidden
                    >

                    <article
                        id="preview-body"
                        class="preview-body">
                    </article>

                </main>

            </body>
            </html>
        `;

        previewWindow.document.open();

        previewWindow.document.write(documentContent);

        previewWindow.document.close();

        previewWindow.document.getElementById(
            "preview-title"
        ).textContent = safeTitle;

        previewWindow.document.getElementById(
            "preview-excerpt"
        ).textContent = safeExcerpt;

        previewWindow.document.getElementById(
            "preview-body"
        ).innerHTML = safeContent;

        if (safeCover) {

            const previewCover = previewWindow.document.getElementById(
                "preview-cover"
            );

            previewCover.src = safeCover;

            previewCover.alt = safeAlt;

            previewCover.hidden = false;

        }

    }


    if (previewButton) {

        previewButton.addEventListener(
            "click",
            previewArticle
        );

    }


    /* =====================================================
       20. ARTICLE VALIDATION
       ===================================================== */

    function validateArticle() {

        const title = titleInput.value.trim();

        const excerpt = excerptInput.value.trim();

        const articleText = editor.innerText.trim();

        const category = categoryInput.value;

        if (!title) {

            titleInput.focus();

            showMessage(
                "Please enter an article title.",
                "error"
            );

            return false;

        }

        if (title.length < 10) {

            titleInput.focus();

            showMessage(
                "Your article title should contain at least 10 characters.",
                "error"
            );

            return false;

        }

        if (!excerpt) {

            excerptInput.focus();

            showMessage(
                "Please provide an article summary.",
                "error"
            );

            return false;

        }

        if (excerpt.length < 30) {

            excerptInput.focus();

            showMessage(
                "Your article summary should contain at least 30 characters.",
                "error"
            );

            return false;

        }

        if (!category) {

            categoryInput.focus();

            showMessage(
                "Please select a primary article category.",
                "error"
            );

            return false;

        }

        if (!articleText) {

            editor.focus();

            showMessage(
                "Please write the main content of your article.",
                "error"
            );

            return false;

        }

        const words = articleText
            .split(/\s+/)
            .filter(Boolean).length;

        if (words < 100) {

            editor.focus();

            showMessage(
                "Your article should contain at least 100 words before submission. Develop your ideas further.",
                "error"
            );

            return false;

        }

        if (words > 10000) {

            editor.focus();

            showMessage(
                "Your article exceeds the 10,000-word demonstration limit.",
                "error"
            );

            return false;

        }

        return true;

    }


    /* =====================================================
       21. SUBMIT ARTICLE FOR REVIEW
       ===================================================== */

    if (form) {

        form.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                hideMessage();

                if (!validateArticle()) {
                    return;
                }

                const articleData = collectArticleData();

                /*
                 * FRONTEND DEMONSTRATION ONLY.
                 *
                 * No article is sent to an administrator.
                 * No database or server is connected.
                 */

                console.log(
                    "Article prepared for review:",
                    {
                        ...articleData,
                        coverImage: articleData.coverImage
                            ? "[Selected image]"
                            : ""
                    }
                );

                updateEditorStatus("Ready for review");

                showMessage(
                    "Your article has passed the frontend checks. The review workflow is not connected yet, so this article has NOT been submitted to an administrator or published.",
                    "success"
                );

                submitButton.textContent =
                    "Demo Complete";

                submitButton.disabled = true;

            }
        );

    }


    /* =====================================================
       22. AUTOMATIC COPYRIGHT YEAR
       ===================================================== */

    const currentYear = document.getElementById(
        "current-year"
    );

    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();

    }


    /* =====================================================
       23. CLEAR FEEDBACK WHEN USER EDITS
       ===================================================== */

    [
        titleInput,
        excerptInput,
        editor,
        categoryInput,
        tagsInput
    ].forEach(function (element) {

        if (!element) {
            return;
        }

        element.addEventListener(
            "input",
            hideMessage
        );

        element.addEventListener(
            "change",
            hideMessage
        );

    });


    /* =====================================================
       24. INITIAL COUNTER VALUES
       ===================================================== */

    updateTitleCount();

    updateExcerptCount();

    updateWordCount();


});
