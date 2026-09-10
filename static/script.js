function updateLength() {

    const length = document.getElementById("length").value;

    document.getElementById("lengthValue").textContent = length;
}


async function generatePassword() {

    const length = document.getElementById("length").value;

    const uppercase =
        document.getElementById("uppercase").checked;

    const lowercase =
        document.getElementById("lowercase").checked;

    const numbers =
        document.getElementById("numbers").checked;

    const symbols =
        document.getElementById("symbols").checked;

    const message =
        document.getElementById("message");

    message.textContent = "";

    try {

        const response = await fetch("/generate", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                length: length,

                uppercase: uppercase,

                lowercase: lowercase,

                numbers: numbers,

                symbols: symbols

            })

        });


        const data = await response.json();


        if (!response.ok) {

            message.textContent = data.error;

            message.style.color = "red";

            return;
        }


        document.getElementById("password").value =
            data.password;


        document.getElementById("strength").textContent =
            data.strength;


        updateStrengthBar(data.score);


        message.textContent =
            "Password generated successfully!";

        message.style.color = "green";


    } catch (error) {

        message.textContent =
            "Unable to connect to the server.";

        message.style.color = "red";
    }
}


function updateStrengthBar(score) {

    const bar =
        document.getElementById("strengthBar");

    if (score <= 2) {

        bar.style.width = "30%";

    } else if (score <= 4) {

        bar.style.width = "60%";

    } else if (score === 5) {

        bar.style.width = "80%";

    } else {

        bar.style.width = "100%";
    }
}


function togglePassword() {

    const password =
        document.getElementById("password");

    const button =
        document.getElementById("showBtn");


    if (password.type === "password") {

        password.type = "text";

        button.textContent = "🙈";

    } else {

        password.type = "password";

        button.textContent = "👁";
    }
}


async function copyPassword() {

    const password =
        document.getElementById("password").value;

    const message =
        document.getElementById("message");


    if (!password) {

        message.textContent =
            "Generate a password first.";

        message.style.color = "red";

        return;
    }


    try {

        await navigator.clipboard.writeText(password);

        message.textContent =
            "Password copied!";

        message.style.color = "green";

    } catch (error) {

        message.textContent =
            "Unable to copy password.";

        message.style.color = "red";
    }
}