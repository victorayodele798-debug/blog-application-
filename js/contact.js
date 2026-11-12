
document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. SELECT FORM ELEMENTS
    // ==========================================

    const contactForm = document.getElementById("contact-form");

    const nameInput = document.getElementById("contact-name");
    const emailInput = document.getElementById("contact-email");
    const subjectInput = document.getElementById("contact-subject");
    const messageInput = document.getElementById("contact-message");

    const feedback = document.getElementById("contact-message-status");
    const submitButton = document.getElementById("contact-submit");


    // ==========================================
    // 2. CHECK REQUIRED ELEMENTS
    // ==========================================

    if (
        !contactForm ||
        !nameInput ||
        !emailInput ||
        !subjectInput ||
        !messageInput ||
        !feedback ||
        !submitButton
    ) {
        console.warn("Contact form elements could not be found.");
        return;
    }


    // ==========================================
    // 3. EMAIL VALIDATION
    // ==========================================

    function isValidEmail(email) {

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailPattern.test(email);

    }


    // ==========================================
    // 4. DISPLAY FEEDBACK
    // ==========================================

    function showFeedback(message, type) {

        feedback.textContent = message;

        feedback.className = "contact-form-message " + type;

        feedback.hidden = false;

    }


    // ==========================================
    // 5. CLEAR FEEDBACK
    // ==========================================

    function clearFeedback() {

        feedback.textContent = "";

        feedback.className = "contact-form-message";

        feedback.hidden = true;

    }


    // ==========================================
    // 6. VALIDATE FORM DATA
    // ==========================================

    function validateForm() {

        const fullName = nameInput.value.trim();

        const email = emailInput.value.trim();

        const subject = subjectInput.value;

        const message = messageInput.value.trim();


        if (fullName.length < 2) {

            showFeedback(
                "Please enter your full name.",
                "error"
            );

            nameInput.focus();

            return false;

        }


        if (fullName.length > 80) {

            showFeedback(
                "Your name must not exceed 80 characters.",
                "error"
            );

            nameInput.focus();

            return false;

        }


        if (!email) {

            showFeedback(
                "Please enter your email address.",
                "error"
            );

            emailInput.focus();

            return false;

        }


        if (!isValidEmail(email) || email.length > 254) {

            showFeedback(
                "Please enter a valid email address.",
                "error"
            );

            emailInput.focus();

            return false;

        }


        if (!subject) {

            showFeedback(
                "Please select an enquiry type.",
                "error"
            );

            subjectInput.focus();

            return false;

        }


        if (message.length < 10) {

            showFeedback(
                "Your message must contain at least 10 characters.",
                "error"
            );

            messageInput.focus();

            return false;

        }


        if (message.length > 3000) {

            showFeedback(
                "Your message must not exceed 3,000 characters.",
                "error"
            );

            messageInput.focus();

            return false;

        }


        return true;

    }


    // ==========================================
    // 7. HANDLE FORM SUBMISSION
    // ==========================================

    contactForm.addEventListener("submit", (event) => {

        event.preventDefault();

        clearFeedback();


        // Validate all fields.
        const isValid = validateForm();

        if (!isValid) {
            return;
        }


        // This is a frontend-only demonstration.
        // No message is sent or stored at this stage.

        showFeedback(
            "Your information has passed validation. Message delivery is not yet available because the contact form has not been connected to a backend or form service.",
            "success"
        );

    });


    // ==========================================
    // 8. CLEAR FEEDBACK WHEN USER EDITS FORM
    // ==========================================

    const formFields = [
        nameInput,
        emailInput,
        subjectInput,
        messageInput
    ];

    formFields.forEach((field) => {

        field.addEventListener("input", clearFeedback);

        field.addEventListener("change", clearFeedback);

    });


    // ==========================================
    // 9. INITIALISE CONTACT FORM
    // ==========================================

    contactForm.reset();

});
