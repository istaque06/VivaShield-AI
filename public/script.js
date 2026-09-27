// ==========================================
// VivaShield AI - Frontend JavaScript
// ==========================================


// Get HTML elements
const userInput = document.getElementById("userInput");

const sendButton = document.getElementById("sendButton");

const responseBox = document.getElementById("response");

const emergencyButtons =
    document.querySelectorAll(".emergency-btn");


// ==========================================
// Display response
// ==========================================

function displayResponse(text) {

    responseBox.innerText = text;

}


// ==========================================
// Send message to backend
// ==========================================

async function sendMessage(message, category = "General Emergency") {

    // Check empty message
    if (!message || message.trim() === "") {

        displayResponse(
            "Please describe your emergency situation."
        );

        return;
    }


    // Disable button while processing
    sendButton.disabled = true;

    sendButton.innerText = "Getting Safety Guidance...";


    try {

        // Send request to backend
        const response = await fetch("/api/emergency", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                message: message.trim(),

                category: category

            })

        });


        // Convert response to JSON
        const data = await response.json();


        // Check backend error
        if (!response.ok) {

            throw new Error(
                data.error || "Something went wrong."
            );

        }


        // Display AI response
        displayResponse(
            data.response ||
            data.message ||
            "No response received from AI."
        );


    } catch (error) {

        console.error("Error:", error);


        displayResponse(
            "Sorry, I could not connect to the AI service.\n\n" +
            "Please check that the server is running and try again."
        );


    } finally {

        // Enable button again
        sendButton.disabled = false;

        sendButton.innerText = "Send";

    }

}


// ==========================================
// Send button
// ==========================================

sendButton.addEventListener("click", function () {

    const message = userInput.value;

    sendMessage(message);

});


// ==========================================
// Emergency category buttons
// ==========================================

emergencyButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const category =
            button.dataset.category;


        let prompt = "";


        if (category === "Medical Emergency") {

            prompt =
                "I am facing a medical emergency. " +
                "Please provide immediate safety guidance.";

        }


        else if (category === "Fire Emergency") {

            prompt =
                "There is a fire or smoke emergency. " +
                "Please provide immediate safety guidance.";

        }


        else if (category === "Accident") {

            prompt =
                "I am involved in an accident. " +
                "Please provide immediate safety guidance.";

        }


        else if (category === "Personal Safety") {

            prompt =
                "I am facing a personal safety or security emergency. " +
                "Please provide immediate safety guidance.";

        }


        // Put prompt into textarea
        userInput.value = prompt;


        // Move cursor to textarea
        userInput.focus();

    });

});


// ==========================================
// Enter key support
// ==========================================

userInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter" && !event.shiftKey) {

        event.preventDefault();

        sendButton.click();

    }

});