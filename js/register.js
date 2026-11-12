
/* =========================================
   ARTICLEHUB REGISTRATION FUNCTIONALITY
   ========================================= */


/* ---------- ELEMENT REFERENCES ---------- */

const registerForm = document.getElementById("register-form");

const fullNameInput = document.getElementById("register-name");

const emailInput = document.getElementById("register-email");

const usernameInput = document.getElementById("register-username");

const passwordInput = document.getElementById("register-password");

const confirmPasswordInput = document.getElementById(
    "register-confirm-password"
);

const termsCheckbox = document.getElementById("register-terms");

const registerMessage = document.getElementById("register-message");


/* ---------- MESSAGE HANDLER ---------- */

function showRegisterMessage(message, type = "info") {

    if (!registerMessage) return;

    registerMessage.textContent = message;

    registerMessage.className = `register-message show ${type}`;

}


function clearRegisterMessage() {

    if (!registerMessage) return;

    registerMessage.textContent = "";

    registerMessage.className = "register-message";

}


/* ---------- PASSWORD VISIBILITY ---------- */

const passwordToggles = document.querySelectorAll(
    ".register-password-toggle"
);

passwordToggles.forEach((toggle) => {

    toggle.addEventListener("click", () => {

        const targetId = toggle.dataset.passwordTarget;

        const targetInput = document.getElementById(targetId);

        if (!targetInput) return;

        const isHidden = targetInput.type === "password";

        targetInput.type = isHidden ? "text" : "password";

        toggle.setAttribute(
            "aria-label",
            isHidden ? "Hide password" : "Show password"
        );

        toggle.setAttribute(
            "aria-pressed",
            String(isHidden)
        );

    });

});


/* ---------- VALIDATION HELPERS ---------- */

function isValidEmail(email) {

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);

}


function isValidUsername(username) {

    const usernamePattern = /^[A-Za-z0-9_]{3,30}$/;

    return usernamePattern.test(username);

}


/* ---------- INPUT FEEDBACK ---------- */

const registerInputs = [
    fullNameInput,
    emailInput,
    usernameInput,
    passwordInput,
    confirmPasswordInput
];

registerInputs.forEach((input) => {

    if (input) {

        input.addEventListener("input", clearRegisterMessage);

    }

});

if (termsCheckbox) {

    termsCheckbox.addEventListener("change", clearRegisterMessage);

}


/* ---------- FORM SUBMISSION ---------- */

if (registerForm) {

    registerForm.addEventListener("submit", (event) => {

        event.preventDefault();

        clearRegisterMessage();


        /* Collect form values */

        const fullName = fullNameInput.value.trim();

        const email = emailInput.value.trim();

        const username = usernameInput.value.trim();

        const password = passwordInput.value;

        const confirmPassword = confirmPasswordInput.value;


        /* Validate full name */

        if (!fullName) {

            showRegisterMessage(
                "Please enter your full name.",
                "error"
            );

            fullNameInput.focus();

            return;

        }


        /* Validate email */

        if (!email) {

            showRegisterMessage(
                "Please enter your email address.",
                "error"
            );

            emailInput.focus();

            return;

        }

        if (!isValidEmail(email)) {

            showRegisterMessage(
                "Please enter a valid email address.",
                "error"
            );

            emailInput.focus();

            return;

        }


        /* Validate username */

        if (!username) {

            showRegisterMessage(
                "Please choose a username.",
                "error"
            );

            usernameInput.focus();

            return;

        }

        if (!isValidUsername(username)) {

            showRegisterMessage(
                "Your username must contain 3–30 characters using only letters, numbers, and underscores.",
                "error"
            );

            usernameInput.focus();

            return;

        }


        /* Validate password */

        if (!password.trim()) {

            showRegisterMessage(
                "Please create a password.",
                "error"
            );

            passwordInput.focus();

            return;

        }

        if (password.length < 8) {

            showRegisterMessage(
                "Your password must contain at least 8 characters.",
                "error"
            );

            passwordInput.focus();

            return;

        }


        /* Validate password confirmation */

        if (!confirmPassword) {

            showRegisterMessage(
                "Please confirm your password.",
                "error"
            );

            confirmPasswordInput.focus();

            return;

        }

        if (password !== confirmPassword) {

            showRegisterMessage(
                "Your passwords do not match. Please check them.",
                "error"
            );

            confirmPasswordInput.focus();

            return;

        }


        /* Validate terms agreement */

        if (!termsCheckbox.checked) {

            showRegisterMessage(
                "Please agree to the Terms of Service and Privacy Policy.",
                "error"
            );

            termsCheckbox.focus();

            return;

        }


        /* Registration demonstration notice */

        showRegisterMessage(
            "Your information has passed the frontend checks. Account creation and registration approval will be implemented during the backend development phase.",
            "info"
        );

    });

}


/* =========================================
   END OF REGISTRATION FUNCTIONALITY
   ========================================= */
