
/* =========================================================
   ARTICLEHUB CONTRIBUTOR DASHBOARD
   File: js/contributor-dashboard.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       1. ELEMENT REFERENCES
       ===================================================== */

    const sidebar = document.getElementById("dashboard-sidebar");

    const menuToggle = document.getElementById(
        "dashboard-menu-toggle"
    );

    const navigationLinks = document.querySelectorAll(
        ".dashboard-nav-link"
    );

    const sectionLinks = document.querySelectorAll(
        "[data-section-link]"
    );

    const dashboardSections = document.querySelectorAll(
        "[data-dashboard-section]"
    );

    const articleStatusFilter = document.getElementById(
        "article-status-filter"
    );

    const articleRows = document.querySelectorAll(
        "#dashboard-articles-body tr"
    );


    /* =====================================================
       2. DASHBOARD SECTION NAVIGATION
       ===================================================== */

    function showDashboardSection(sectionName) {

        const targetSection = document.querySelector(
            `[data-dashboard-section="${sectionName}"]`
        );

        if (!targetSection) {
            return;
        }

        // Hide all dashboard sections.
        dashboardSections.forEach(function (section) {

            section.classList.remove("active");

        });


        // Display selected section.
        targetSection.classList.add("active");


        // Update active sidebar link.
        navigationLinks.forEach(function (link) {

            const isActive =
                link.dataset.section === sectionName;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }

        });


        // Update URL hash.
        history.replaceState(
            null,
            "",
            `#${sectionName}`
        );


        // Close mobile sidebar after navigation.
        closeMobileSidebar();

        // Return the user to the top of the dashboard.
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    /* =====================================================
       3. SIDEBAR NAVIGATION LINKS
       ===================================================== */

    navigationLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            event.preventDefault();

            const sectionName = link.dataset.section;

            showDashboardSection(sectionName);

        });

    });


    /* =====================================================
       4. DASHBOARD INTERNAL LINKS
       ===================================================== */

    sectionLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const sectionName = link.dataset.sectionLink;

            if (!sectionName) {
                return;
            }

            event.preventDefault();

            showDashboardSection(sectionName);

        });

    });


    /* =====================================================
       5. LOAD SECTION FROM URL HASH
       ===================================================== */

    function loadSectionFromHash() {

        const sectionName = window.location.hash.replace("#", "");

        if (sectionName) {

            const targetSection = document.querySelector(
                `[data-dashboard-section="${sectionName}"]`
            );

            if (targetSection) {

                showDashboardSection(sectionName);

                return;

            }

        }

        showDashboardSection("overview");

    }

    loadSectionFromHash();


    /* =====================================================
       6. MOBILE SIDEBAR
       ===================================================== */

    function openMobileSidebar() {

        if (!sidebar || !menuToggle) {
            return;
        }

        sidebar.classList.add("open");

        menuToggle.classList.add("active");

        menuToggle.setAttribute("aria-expanded", "true");

        menuToggle.setAttribute(
            "aria-label",
            "Close dashboard menu"
        );

    }


    function closeMobileSidebar() {

        if (!sidebar || !menuToggle) {
            return;
        }

        sidebar.classList.remove("open");

        menuToggle.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.setAttribute(
            "aria-label",
            "Open dashboard menu"
        );

    }


    if (menuToggle && sidebar) {

        menuToggle.addEventListener("click", function () {

            const isOpen = sidebar.classList.contains("open");

            if (isOpen) {

                closeMobileSidebar();

            } else {

                openMobileSidebar();

            }

        });

    }


    /* =====================================================
       7. CLOSE SIDEBAR WHEN CLICKING OUTSIDE
       ===================================================== */

    document.addEventListener("click", function (event) {

        if (!sidebar || !menuToggle) {
            return;
        }

        const clickedInsideSidebar =
            sidebar.contains(event.target);

        const clickedMenuButton =
            menuToggle.contains(event.target);

        if (
            sidebar.classList.contains("open") &&
            !clickedInsideSidebar &&
            !clickedMenuButton
        ) {

            closeMobileSidebar();

        }

    });


    /* =====================================================
       8. CLOSE SIDEBAR WITH ESCAPE KEY
       ===================================================== */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            closeMobileSidebar();

        }

    });


    /* =====================================================
       9. ARTICLE STATUS FILTER
       ===================================================== */

    if (articleStatusFilter && articleRows.length > 0) {

        articleStatusFilter.addEventListener(
            "change",
            function () {

                const selectedStatus = articleStatusFilter.value;

                articleRows.forEach(function (row) {

                    const articleStatus = row.dataset.status;

                    const shouldDisplay =
                        selectedStatus === "all" ||
                        articleStatus === selectedStatus;

                    row.hidden = !shouldDisplay;

                });

            }
        );

    }


    /* =====================================================
       10. AUTOMATIC COPYRIGHT YEAR
       ===================================================== */

    const currentYear = document.getElementById("current-year");

    if (currentYear) {

        currentYear.textContent = new Date().getFullYear();

    }


    /* =====================================================
       11. RESPONSIVE SIDEBAR RESET
       ===================================================== */

    window.addEventListener("resize", function () {

        if (window.innerWidth > 760) {

            closeMobileSidebar();

        }

    });


});
