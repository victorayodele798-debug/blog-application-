
/* =========================================
   ARTICLEHUB — PASSWORD RECOVERY
   ========================================= */


/* ---------- ELEMENT REFERENCES ---------- */

const recoveryForm = document.getElementById("recovery-form");

const recoveryEmail = document.getElementById("recovery-email");

const recoveryMessage = document.getElementById("recovery-message");

const recoverySubmit = document.getElementById("recovery-submit");


/* ---------- MESSAGE HANDLER ---------- */

function showRecoveryMessage(message, type = "info") {

    if (!recoveryMessage) return;

    recoveryMessage.textContent = message;

    recoveryMessage.className = `recovery-message show ${type}`;

}


function clearRecoveryMessage() {

    if (!recoveryMessage) return;

    recoveryMessage.textContent = "";

    recoveryMessage.className = "recovery-message";

}


/* ---------- EMAIL VALIDATION ---------- */

function isValidRecoveryEmail(email) {

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);

}


/* ---------- INPUT FEEDBACK ---------- */

if (recoveryEmail) {

    recoveryEmail.addEventListener("input", () => {

        clearRecoveryMessage();

    });

}


/* ---------- FORM SUBMISSION ---------- */

if (recoveryForm) {

    recoveryForm.addEventListener("submit", (event) => {

        event.preventDefault();

        clearRecoveryMessage();


        /* Collect email address */

        const email = recoveryEmail.value.trim();


        /* Check empty email */

        if (!email) {

            showRecoveryMessage(
                "Please enter your registered email address.",
                "error"
            );

            recoveryEmail.focus();

            return;

        }


        /* Check email format */

        if (!isValidRecoveryEmail(email)) {

            showRecoveryMessage(
                "Please enter a valid email address.",
                "error"
            );

            recoveryEmail.focus();

            return;

        }


        /* Frontend demonstration */

        showRecoveryMessage(
            "Your email address has passed the frontend validation. Password recovery emails and account verification will be implemented during backend development.",
            "info"
        );


        /*
           IMPORTANT:

           This page currently does not:
           - Send recovery emails.
           - Verify account ownership.
           - Generate password reset links.
           - Change account passwords.

           These features require backend implementation.
        */

    });

}


/* =========================================
   END OF PASSWORD RECOVERY FUNCTIONALITY
   ========================================= */
