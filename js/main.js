
// ==========================================
// ARTICLEHUB - MAIN JAVASCRIPT
// ==========================================


// 1. MOBILE NAVIGATION

const menuToggle = document.getElementById("menu-toggle");
const navigation = document.getElementById("navigation");

if (menuToggle && navigation) {

    menuToggle.addEventListener("click", () => {

        const isOpen = navigation.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", isOpen);
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );

    });

    // Close menu after selecting a navigation link

    navigation.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {
            navigation.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        });

    });

}


// 2. AUTOMATIC AND MANUAL THEME

const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

const systemTheme = window.matchMedia(
    "(prefers-color-scheme: dark)"
);

function getCurrentTheme() {

    const savedTheme = localStorage.getItem("articlehub-theme");

    return savedTheme || (
        systemTheme.matches ? "dark" : "light"
    );

}


function applyTheme(theme) {

    document.documentElement.setAttribute(
        "data-theme",
        theme
    );

    if (themeIcon) {
        themeIcon.textContent =
            theme === "dark" ? "☀" : "☾";
    }

    if (themeToggle) {
        themeToggle.setAttribute(
            "aria-label",
            theme === "dark"
                ? "Switch to light theme"
                : "Switch to dark theme"
        );
    }

}


// Apply saved or system theme

applyTheme(getCurrentTheme());


// React to device theme changes unless the visitor
// has manually selected a theme.

systemTheme.addEventListener("change", event => {

    if (!localStorage.getItem("articlehub-theme")) {
        applyTheme(event.matches ? "dark" : "light");
    }

});


// Manual theme switch

if (themeToggle) {

    themeToggle.addEventListener("click", () => {

        const currentTheme =
            document.documentElement.getAttribute("data-theme");

        const newTheme =
            currentTheme === "dark" ? "light" : "dark";

        localStorage.setItem("articlehub-theme", newTheme);

        applyTheme(newTheme);

    });

}


// 3. ARTICLE SEARCH

const searchInput = document.getElementById("article-search");

const articleCards = document.querySelectorAll(".article-card");

const emptyMessage = document.getElementById("empty-message");


function filterArticles(searchTerm = "") {

    let visibleCount = 0;

    const searchValue = searchTerm.toLowerCase().trim();

    articleCards.forEach(card => {

        const content = card.textContent.toLowerCase();

        const matches = content.includes(searchValue);

        card.classList.toggle("hidden", !matches);

        if (matches) {
            visibleCount++;
        }

    });

    if (emptyMessage) {
        emptyMessage.classList.toggle(
            "show",
            visibleCount === 0
        );
    }

}


if (searchInput) {

    searchInput.addEventListener("input", () => {

        // Clear selected topic when performing a new search

        document.querySelectorAll(".topic-card").forEach(card => {
            card.classList.remove("selected");
        });

        filterArticles(searchInput.value);

    });

}


// 4. TOPIC CATEGORY FILTERING

const topicCards = document.querySelectorAll(".topic-card");

topicCards.forEach(topic => {

    topic.addEventListener("click", () => {

        const selectedCategory =
            topic.dataset.category.toLowerCase();

        // Clear the search input

        if (searchInput) {
            searchInput.value = "";
        }

        // Update selected topic appearance

        topicCards.forEach(card => {
            card.classList.remove("selected");
        });

        topic.classList.add("selected");

        // Filter article cards

        let visibleCount = 0;

        articleCards.forEach(article => {

            const articleCategory =
                article.dataset.category.toLowerCase();

            const matches =
                articleCategory === selectedCategory;

            article.classList.toggle("hidden", !matches);

            if (matches) {
                visibleCount++;
            }

        });

        if (emptyMessage) {
            emptyMessage.classList.toggle(
                "show",
                visibleCount === 0
            );
        }

    });

});


// 5. NEWSLETTER FORM

const newsletterForm =
    document.getElementById("newsletter-form");

const newsletterEmail =
    document.getElementById("newsletter-email");

const newsletterMessage =
    document.getElementById("newsletter-message");


if (newsletterForm) {

    newsletterForm.addEventListener("submit", event => {

        event.preventDefault();

        if (!newsletterForm.checkValidity()) {
            newsletterForm.reportValidity();
            return;
        }

        const email = newsletterEmail.value.trim();

        if (!email) {
            newsletterMessage.textContent =
                "Please enter your email address.";

            return;
        }

        newsletterMessage.textContent =
            "Thank you for your interest! " +
            "Newsletter registration is a frontend demonstration.";

        newsletterForm.reset();

    });

}


// 6. DYNAMIC COPYRIGHT YEAR

const currentYear = document.getElementById("current-year");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


// 7. CONSOLE MESSAGE

console.log(
    "ArticleHub is running successfully."
);
