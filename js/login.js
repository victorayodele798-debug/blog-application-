
/* =========================================
   ARTICLEHUB LOGIN FUNCTIONALITY
   ========================================= */


/* ---------- ELEMENT REFERENCES ---------- */

const loginForm = document.getElementById("login-form");

const emailInput = document.getElementById("login-email");

const passwordInput = document.getElementById("login-password");

const passwordToggle = document.getElementById("toggle-password");

const passwordEyeIcon = document.getElementById("password-eye-icon");

const loginMessage = document.getElementById("login-message");

const loginSubmit = document.getElementById("login-submit");


/* ---------- PASSWORD VISIBILITY ---------- */

if (passwordToggle && passwordInput) {

    passwordToggle.addEventListener("click", () => {

        const isPasswordHidden = passwordInput.type === "password";

        passwordInput.type = isPasswordHidden ? "text" : "password";

        passwordToggle.setAttribute(
            "aria-label",
            isPasswordHidden ? "Hide password" : "Show password"
        );

        passwordToggle.setAttribute(
            "aria-pressed",
            String(isPasswordHidden)
        );

        if (passwordEyeIcon) {

            passwordEyeIcon.innerHTML = isPasswordHidden

                ? `
                    <path d="M3 3L21 21"/>

                    <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/>

                    <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5
                    c6.5 0 10 7 10 7a15.8 15.8 0 0 1-3.1 3.9"/>

                    <path d="M6.2 6.2C3.5 8 2 12 2 12
                    s3.5 7 10 7c1.3 0 2.5-.3 3.5-.8"/>
                  `

                : `
                    <path d="M2 12s3.5-7 10-7 10 7 10 7
                    -3.5 7-10 7-10-7-10-7z"/>

                    <circle cx="12" cy="12" r="3"/>
                  `;

        }

    });

}


/* ---------- MESSAGE HANDLER ---------- */

function showLoginMessage(message, type = "info") {

    if (!loginMessage) return;

    loginMessage.textContent = message;

    loginMessage.className = `login-message show ${type}`;

}


function clearLoginMessage() {

    if (!loginMessage) return;

    loginMessage.textContent = "";

    loginMessage.className = "login-message";

}


/* ---------- EMAIL VALIDATION ---------- */

function isValidEmail(email) {

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);

}


/* ---------- INPUT FEEDBACK ---------- */

if (emailInput) {

    emailInput.addEventListener("input", clearLoginMessage);

}

if (passwordInput) {

    passwordInput.addEventListener("input", clearLoginMessage);

}


/* ---------- FORM SUBMISSION ---------- */

if (loginForm) {

    loginForm.addEventListener("submit", (event) => {

        event.preventDefault();

        clearLoginMessage();


        const email = emailInput.value.trim();

        const password = passwordInput.value;


        /* Check empty email */

        if (!email) {

            showLoginMessage(
                "Please enter your email address.",
                "error"
            );

            emailInput.focus();

            return;

        }


        /* Check email format */

        if (!isValidEmail(email)) {

            showLoginMessage(
                "Please enter a valid email address.",
                "error"
            );

            emailInput.focus();

            return;

        }


        /* Check empty password */

        if (!password.trim()) {

            showLoginMessage(
                "Please enter your password.",
                "error"
            );

            passwordInput.focus();

            return;

        }


        /* Frontend demonstration notice */

        showLoginMessage(
            "The login interface is ready. Account authentication will be connected during the backend development phase.",
            "info"
        );

    });

}


/* =========================================
   END OF LOGIN FUNCTIONALITY
   ========================================= */
