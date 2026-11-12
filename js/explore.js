
document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. SELECT PAGE ELEMENTS
    // ==========================================

    const searchForm = document.getElementById("explore-search-form");
    const searchInput = document.getElementById("explore-search");

    const topicButtons = document.querySelectorAll(
        ".explore-topic-card[data-topic]"
    );

    const articleGrid = document.getElementById("explore-article-grid");

    const articleCards = articleGrid
        ? articleGrid.querySelectorAll(".explore-article-card")
        : [];

    const emptyState = document.getElementById("explore-empty-state");
    const clearButton = document.getElementById("clear-explore-filters");


    // ==========================================
    // 2. CHECK REQUIRED ELEMENTS
    // ==========================================

    if (!searchInput || !articleGrid || !emptyState) {
        console.warn("Explore page elements could not be found.");
        return;
    }


    // ==========================================
    // 3. FILTER STATE
    // ==========================================

    let activeTopic = "all";


    // ==========================================
    // 4. FILTER ARTICLES
    // ==========================================

    function filterArticles() {

        const searchTerm = searchInput.value
            .trim()
            .toLowerCase();

        let visibleCount = 0;

        articleCards.forEach((card) => {

            const title = (
                card.dataset.title || ""
            ).toLowerCase();

            const category = (
                card.dataset.category || ""
            ).toLowerCase();

            const author = (
                card.dataset.author || ""
            ).toLowerCase();

            const articleContent = card.textContent.toLowerCase();

            // Check whether the selected topic matches.
            const matchesTopic =
                activeTopic === "all" ||
                category === activeTopic;

            // Search across title, category, author and card text.
            const matchesSearch =
                searchTerm === "" ||
                title.includes(searchTerm) ||
                category.includes(searchTerm) ||
                author.includes(searchTerm) ||
                articleContent.includes(searchTerm);

            // Both conditions must match.
            const shouldShow = matchesTopic && matchesSearch;

            card.hidden = !shouldShow;

            if (shouldShow) {
                visibleCount++;
            }

        });


        // ======================================
        // 5. HANDLE EMPTY RESULTS
        // ======================================

        const hasResults = visibleCount > 0;

        emptyState.hidden = hasResults;
        articleGrid.hidden = !hasResults;

    }


    // ==========================================
    // 6. TOPIC BUTTON INTERACTIONS
    // ==========================================

    topicButtons.forEach((button) => {

        button.addEventListener("click", () => {

            activeTopic = (
                button.dataset.topic || "all"
            ).toLowerCase();

            // Update active topic button.
            topicButtons.forEach((topicButton) => {

                const isActive = topicButton === button;

                topicButton.classList.toggle("active", isActive);

                topicButton.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );

            });

            filterArticles();

        });

    });


    // ==========================================
    // 7. SEARCH INPUT
    // ==========================================

    searchInput.addEventListener("input", filterArticles);


    // ==========================================
    // 8. SEARCH FORM SUBMISSION
    // ==========================================

    if (searchForm) {

        searchForm.addEventListener("submit", (event) => {

            event.preventDefault();

            filterArticles();

        });

    }


    // ==========================================
    // 9. CLEAR SEARCH AND FILTERS
    // ==========================================

    if (clearButton) {

        clearButton.addEventListener("click", () => {

            // Clear search field.
            searchInput.value = "";

            // Reset selected topic.
            activeTopic = "all";

            // Reset topic button appearance.
            topicButtons.forEach((button) => {

                const isAll = button.dataset.topic === "all";

                button.classList.toggle("active", isAll);

                button.setAttribute(
                    "aria-pressed",
                    String(isAll)
                );

            });

            // Display all articles again.
            filterArticles();

            searchInput.focus();

        });

    }


    // ==========================================
    // 10. INITIALISE EXPLORE PAGE
    // ==========================================

    filterArticles();

});
