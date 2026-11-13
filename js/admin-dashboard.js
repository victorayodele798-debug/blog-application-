
/* =========================================================
   ARTICLEHUB — ADMIN DASHBOARD
   Frontend demonstration only.
   No backend or permanent database connection.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       1. ELEMENT REFERENCES
       ===================================================== */

    const adminSidebar = document.getElementById("admin-sidebar");
    const adminMenuToggle = document.getElementById("admin-menu-toggle");

    const adminNavLinks = document.querySelectorAll(
        ".admin-nav-link[data-admin-section]"
    );

    const adminSections = document.querySelectorAll(
        ".admin-section[data-admin-content]"
    );

    const adminMain = document.getElementById("admin-main");
    const currentYear = document.getElementById("admin-current-year");


    /* =====================================================
       2. MOBILE SIDEBAR
       ===================================================== */

    function openAdminSidebar() {
        if (!adminSidebar || !adminMenuToggle) return;

        adminSidebar.classList.add("open");
        adminMenuToggle.setAttribute("aria-expanded", "true");
    }

    function closeAdminSidebar() {
        if (!adminSidebar || !adminMenuToggle) return;

        adminSidebar.classList.remove("open");
        adminMenuToggle.setAttribute("aria-expanded", "false");
    }

    if (adminMenuToggle && adminSidebar) {

        adminMenuToggle.addEventListener("click", () => {
            const isOpen = adminSidebar.classList.contains("open");

            if (isOpen) {
                closeAdminSidebar();
            } else {
                openAdminSidebar();
            }
        });

        document.addEventListener("click", (event) => {
            const clickedInsideSidebar =
                adminSidebar.contains(event.target);

            const clickedMenuButton =
                adminMenuToggle.contains(event.target);

            if (!clickedInsideSidebar && !clickedMenuButton) {
                closeAdminSidebar();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeAdminSidebar();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 760) {
                closeAdminSidebar();
            }
        });
    }


    /* =====================================================
       3. DASHBOARD SECTION NAVIGATION
       ===================================================== */

    function showAdminSection(sectionName, updateHash = true) {

        const targetSection = document.querySelector(
            `.admin-section[data-admin-content="${sectionName}"]`
        );

        if (!targetSection) return;

        adminSections.forEach((section) => {
            section.classList.remove("active");
        });

        targetSection.classList.add("active");

        adminNavLinks.forEach((link) => {
            const isActive =
                link.dataset.adminSection === sectionName;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });

        closeAdminSidebar();

        if (updateHash) {
            history.replaceState(null, "", `#${sectionName}`);
        }

        if (adminMain) {
            adminMain.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        } else {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    }

    adminNavLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();

            const sectionName = link.dataset.adminSection;

            showAdminSection(sectionName);
        });
    });


    /* =====================================================
       4. INTERNAL DASHBOARD SECTION LINKS
       ===================================================== */

    const internalSectionLinks = document.querySelectorAll(
        "[data-admin-link]"
    );

    internalSectionLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const sectionName = link.dataset.adminLink;

            if (!sectionName) return;

            event.preventDefault();

            showAdminSection(sectionName);
        });
    });


    /* =====================================================
       5. RESTORE SECTION FROM URL HASH
       ===================================================== */

    const initialSection = window.location.hash.replace("#", "");

    if (
        initialSection &&
        document.querySelector(
            `.admin-section[data-admin-content="${initialSection}"]`
        )
    ) {
        showAdminSection(initialSection, false);
    } else {
        showAdminSection("overview", false);
    }


    /* =====================================================
       6. CURRENT YEAR
       ===================================================== */

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =====================================================
       7. ARTICLE STATUS FILTER
       ===================================================== */

    const articleFilter = document.getElementById(
        "admin-article-filter"
    );

    const adminArticlesTable = document.getElementById(
        "admin-articles-table"
    );

    if (articleFilter && adminArticlesTable) {

        articleFilter.addEventListener("change", () => {

            const selectedStatus = articleFilter.value.toLowerCase();

            const articleRows = adminArticlesTable.querySelectorAll(
                "tr[data-article-status]"
            );

            articleRows.forEach((row) => {

                const rowStatus =
                    row.dataset.articleStatus.toLowerCase();

                const shouldShow =
                    selectedStatus === "all" ||
                    rowStatus === selectedStatus;

                row.hidden = !shouldShow;
            });
        });
    }


    /* =====================================================
       8. CONTRIBUTOR SEARCH
       ===================================================== */

    const contributorSearch = document.getElementById(
        "admin-contributor-search"
    );

    const contributorsTable = document.getElementById(
        "admin-contributors-table"
    );

    if (contributorSearch && contributorsTable) {

        contributorSearch.addEventListener("input", () => {

            const searchTerm =
                contributorSearch.value.trim().toLowerCase();

            const contributorRows = contributorsTable.querySelectorAll(
                "tr"
            );

            contributorRows.forEach((row) => {

                const rowText = row.textContent.toLowerCase();

                row.hidden = !rowText.includes(searchTerm);
            });
        });
    }


    /* =====================================================
       9. REVIEW CENTRE
       ===================================================== */

    const reviewTable = document.getElementById(
        "admin-review-table"
    );

    const reviewDetail = document.getElementById(
        "admin-review-detail"
    );

    const pendingReviewCount = document.getElementById(
        "pending-review-count"
    );

    let selectedReviewRow = null;


    function createReviewElement(tag, className, text) {

        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text !== undefined) {
            element.textContent = text;
        }

        return element;
    }


    function updatePendingReviewCount() {

        if (!reviewTable || !pendingReviewCount) return;

        const pendingRows = reviewTable.querySelectorAll(
            'tr[data-review-status="pending"]'
        );

        pendingReviewCount.textContent = pendingRows.length;
    }


    function getReviewInformation(row) {

        const cells = Array.from(row.querySelectorAll("td"));

        const values = cells.map((cell) => {
            return cell.textContent.trim();
        });

        return {
            title: values[0] || "Untitled article",
            contributor: values[1] || "Contributor not specified",
            category: values[2] || "Category not specified",
            date: values[3] || "Date not specified"
        };
    }


    function showReviewDetails(row) {

        if (!reviewDetail || !row) return;

        selectedReviewRow = row;

        const article = getReviewInformation(row);

        reviewDetail.replaceChildren();

        const wrapper = createReviewElement(
            "div",
            "admin-review-content"
        );

        const heading = createReviewElement(
            "div",
            "admin-review-detail-heading"
        );

        heading.appendChild(
            createReviewElement("span", "admin-eyebrow", "ARTICLE REVIEW")
        );

        heading.appendChild(
            createReviewElement("h3", "", article.title)
        );

        wrapper.appendChild(heading);

        const information = createReviewElement(
            "div",
            "admin-review-information"
        );

        const details = [
            ["Contributor", article.contributor],
            ["Category", article.category],
            ["Submitted", article.date]
        ];

        details.forEach(([label, value]) => {

            const item = createReviewElement(
                "div",
                "admin-review-information-item"
            );

            item.appendChild(
                createReviewElement("small", "", label)
            );

            item.appendChild(
                createReviewElement("strong", "", value)
            );

            information.appendChild(item);
        });

        wrapper.appendChild(information);

        const note = createReviewElement(
            "p",
            "admin-review-demo-note",
            "This is a sample review record. Full article content and contributor feedback will be connected when the backend is implemented."
        );

        wrapper.appendChild(note);

        const actionContainer = createReviewElement(
            "div",
            "admin-review-actions"
        );

        const approveButton = createReviewElement(
            "button",
            "admin-button admin-button-primary",
            "Approve Article"
        );

        approveButton.type = "button";

        const changesButton = createReviewElement(
            "button",
            "admin-button admin-button-secondary",
            "Request Changes"
        );

        changesButton.type = "button";

        const rejectButton = createReviewElement(
            "button",
            "admin-button admin-button-danger",
            "Reject Article"
        );

        rejectButton.type = "button";

        approveButton.addEventListener("click", () => {
            updateReviewStatus(row, "published", "Approved");
        });

        changesButton.addEventListener("click", () => {

            const feedback = window.prompt(
                "Enter the changes the contributor should make:"
            );

            if (!feedback || !feedback.trim()) return;

            updateReviewStatus(
                row,
                "review",
                "Changes requested"
            );
        });

        rejectButton.addEventListener("click", () => {

            const confirmed = window.confirm(
                "Are you sure you want to reject this sample article?"
            );

            if (!confirmed) return;

            updateReviewStatus(row, "rejected", "Rejected");
        });

        actionContainer.append(
            approveButton,
            changesButton,
            rejectButton
        );

        wrapper.appendChild(actionContainer);

        reviewDetail.appendChild(wrapper);

        reviewDetail.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    }


    function updateReviewStatus(row, newStatus, message) {

        if (!row) return;

        const confirmed = window.confirm(
            `${message}. This will update only the current demonstration page. Continue?`
        );

        if (!confirmed) return;

        row.dataset.reviewStatus = newStatus;

        const statusCell = row.querySelector(
            ".admin-status"
        );

        if (statusCell) {

            statusCell.className = `admin-status ${newStatus}`;

            const statusLabels = {
                published: "Approved",
                review: "Changes Requested",
                rejected: "Rejected"
            };

            statusCell.textContent =
                statusLabels[newStatus] || newStatus;
        }

        updatePendingReviewCount();

        if (reviewDetail) {
            reviewDetail.replaceChildren(
                createReviewElement(
                    "p",
                    "admin-review-success",
                    `${message}. This demonstration record has been updated locally.`
                )
            );
        }

        selectedReviewRow = null;
    }


    if (reviewTable) {

        reviewTable.addEventListener("click", (event) => {

            const viewButton = event.target.closest(
                '[data-review-action="view"]'
            );

            if (!viewButton) return;

            const row = viewButton.closest("tr");

            if (!row) return;

            showReviewDetails(row);
        });

        updatePendingReviewCount();
    }


    /* =====================================================
       10. ARTICLE MANAGEMENT BUTTONS
       ===================================================== */

    if (adminArticlesTable) {

        adminArticlesTable.addEventListener("click", (event) => {

            const manageButton = event.target.closest("button");

            if (!manageButton) return;

            const row = manageButton.closest("tr");

            if (!row) return;

            const articleTitle =
                row.querySelector("td")?.textContent.trim() ||
                "Selected article";

            window.alert(
                `Article management for "${articleTitle}" will be connected to the article database in a future backend stage.`
            );
        });
    }


    /* =====================================================
       11. CONTRIBUTOR VIEW BUTTONS
       ===================================================== */

    if (contributorsTable) {

        contributorsTable.addEventListener("click", (event) => {

            const viewButton = event.target.closest("button");

            if (!viewButton) return;

            const row = viewButton.closest("tr");

            if (!row) return;

            const contributorName =
                row.querySelector("td")?.textContent.trim() ||
                "Selected contributor";

            window.alert(
                `Contributor profile: ${contributorName}\n\nDetailed contributor records will be available after backend integration.`
            );
        });
    }


    /* =====================================================
       12. CATEGORY MANAGEMENT
       ===================================================== */

    const addCategoryButton = document.getElementById(
        "add-category-button"
    );

    const categoryGrid = document.getElementById(
        "admin-category-grid"
    );


    function createCategoryCard(categoryName) {

        const card = createReviewElement(
            "div",
            "admin-category-card"
        );

        const heading = createReviewElement(
            "h3",
            "",
            categoryName
        );

        const description = createReviewElement(
            "p",
            "",
            "New demonstration category"
        );

        const status = createReviewElement(
            "span",
            "admin-status published",
            "Active"
        );

        card.append(heading, description, status);

        return card;
    }


    if (addCategoryButton && categoryGrid) {

        addCategoryButton.addEventListener("click", () => {

            const categoryName = window.prompt(
                "Enter the name of the new category:"
            );

            if (!categoryName || !categoryName.trim()) return;

            const cleanName = categoryName.trim();

            const existingCategories = Array.from(
                categoryGrid.querySelectorAll("h3")
            );

            const alreadyExists = existingCategories.some((heading) => {
                return heading.textContent.toLowerCase() ===
                    cleanName.toLowerCase();
            });

            if (alreadyExists) {
                window.alert("This category already exists.");
                return;
            }

            categoryGrid.appendChild(
                createCategoryCard(cleanName)
            );

            window.alert(
                "Category added to this demonstration page. It will not be permanently saved."
            );
        });
    }


    /* =====================================================
       13. DASHBOARD QUICK ACTIONS
       ===================================================== */

    document.querySelectorAll("[data-admin-link]").forEach((link) => {

        link.addEventListener("click", (event) => {

            const sectionName = link.dataset.adminLink;

            if (!sectionName) return;

            const targetExists = document.querySelector(
                `.admin-section[data-admin-content="${sectionName}"]`
            );

            if (!targetExists) return;

            event.preventDefault();

            showAdminSection(sectionName);
        });
    });


    /* =====================================================
       14. INITIAL DASHBOARD STATE
       ===================================================== */

    updatePendingReviewCount();

});
