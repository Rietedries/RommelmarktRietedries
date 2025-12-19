let isProcessing = false;
const volzet = false; // Zet op true als de markt volzet is
const inschrijvingenGeopend = false; // Zet op true als inschrijvingen geopend zijn


function sendMail() {
    isProcessing = true; // Markeer dat een proces bezig is
    const submitButton = document.getElementById("submitButton");
    const submitSpan = submitButton.querySelector("span");
    const loadingDots = document.getElementById("loadingDots");
    const successCheck = document.getElementById("successCheck");

    const stands = document.getElementById("numberOfStands").value;
    const pricePerStand = 5;

    // Reset knop en verberg elementen
    submitButton.disabled = true;
    submitSpan.style.display = "none";
    
    // Begin direct met de LoadingDots
    loadingDots.style.display = "flex";

    // Verzenden van de gegevens met EmailJS en Google Sheets
    const params = {
        firstname: document.getElementById("firstname").value,
        lastname: document.getElementById("lastname").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value || "Niet opgegeven",
        numberOfStands: stands,
        totalPrice: stands * pricePerStand,
        remarks: document.getElementById("remarks").value || "Geen opmerkingen",
    };

    emailjs
    .send("service_4jdfvkf", "template_7bgkfgl", params)
    .then(() => pushSpreadcheet(params))
    .then(() => {
        if (!isProcessing) return; // Stop als proces geannuleerd is
        setTimeout(() => {
            loadingDots.style.display = "none";
            successCheck.style.display = "block";

            setTimeout(() => {
                resetButton();
                hideSignupForm();
                showSuccessMessage();
                isProcessing = false; // Reset vlag
            }, 2000); // Laat succescheck zien voor 2 seconden
        }, 2000); // Duur van de bolletjes-animatie
    })
    .catch((error) => {
        isProcessing = false; // Markeer dat proces is gestopt
        console.log("Fout bij versturen of opslaan: ", error);
        loadingDots.style.display = "none"; // Zorg dat loadingDots verdwijnt
        resetButton();
        showMisluktMessage(); // Toon foutmelding
    });
}

function pushSpreadcheet(params) {
const scriptURL = "https://script.google.com/macros/s/AKfycbyhWx0Wrk1JwxWb4DxsBObD3QKcX-OtXLp-GZqQTvRgvmdj7bXtXNRvkaDHeuB2FCee/exec";
const formData = new URLSearchParams();
formData.append("firstname", params.firstname);
formData.append("lastname", params.lastname);
formData.append("email", params.email);
formData.append("phone", params.phone);
formData.append("numberOfStands", params.numberOfStands);
formData.append("totalPrice", params.totalPrice);
formData.append("remarks", params.remarks);

return fetch(scriptURL, {
    method: "POST",
    body: formData,
    mode: "no-cors",
}).catch((error) => {
    console.error("Fout bij toevoegen aan spreadsheet:", error);
    throw error; // Gooi een fout, zodat de catch in sendMail wordt geactiveerd
});
}

function resetButton() {
isProcessing = false; // Stop proces expliciet
const submitButton = document.getElementById("submitButton");
const submitSpan = submitButton.querySelector("span");
const loadingDots = document.getElementById("loadingDots");
const successCheck = document.getElementById("successCheck");

submitButton.disabled = false;
submitSpan.style.display = "inline";
loadingDots.style.display = "none";
successCheck.style.display = "none";
}

// Functie om het formulier opnieuw in te stellen en de succesboodschap te verbergen
function prepareSignupForm() {
const formContainer = document.getElementById("inschrijvingsformuliercontainer");
const Message = document.getElementById("Message");
const signupForm = document.getElementById("signupFormElement");

signupForm.reset(); // Reset formulier
formContainer.style.display = "block"; // Toon formulier
Message.style.display = "none"; // Verberg bericht

const remarksField = document.getElementById("remarks");
    const remarksCounter = document.getElementById("remarksCounter");
    const MAX_REMARKS = 500;

    if (remarksField && remarksCounter) {
        const updateCounter = () => {
            const length = remarksField.value.length;
            remarksCounter.textContent = `${length} / ${MAX_REMARKS}`;
            remarksCounter.style.color = length >= MAX_REMARKS ? "orangered" : "#666";
        };

        updateCounter();
        remarksField.addEventListener("input", updateCounter);
    }
}

// Functie om het succesbericht te tonen
function showSuccessMessage() {
const container = document.getElementById("Message");
container.innerHTML = "";
const Message = document.createElement("div");
container.style.display = "block";
Message.innerHTML = `
    <div class="success-message">
        <h2>Bedankt voor je inschrijving!</h2>
        <p>U kreeg een email van ons met de vraag uw betaling in orde te brengen. Indien u geen email van ons heeft gekregen, contacteer ons dan op het emailadres: veronique.holderbeke@gmail.com</p>
    </div>
    `;
container.appendChild(Message);

}

// Functie om de mislukte boodschap te tonen
function showMisluktMessage() {
const container = document.getElementById("Message");
container.innerHTML = "";
const Message = document.createElement("div");
container.style.display = "block";
Message.id = "failureMessage";
Message.className = "failure-message";
Message.innerHTML = `
    <div>
    <h2 class="Fail">Er is iets misgegaan!</h2>
    <p>We konden je inschrijving niet voltooien. Controleer je gegevens en probeer het later opnieuw. </p>
    </div>
 `;
container.appendChild(Message);
}

// Functie om het formulier te verbergen
function hideSignupForm() {
const formContainer = document.getElementById("inschrijvingsformuliercontainer");
formContainer.style.display = "none";
}

// Controleer bij laden van de pagina
window.onload = function () {
    updateSignupStatus();
};


function updateSignupStatus() {
    const signupButton = document.getElementById("signupButton");

    const eventDateEl = document.getElementById("eventDate");
    const deadlineEl = document.getElementById("signupDeadline");

    if (!eventDateEl || !deadlineEl) return;

    const eventDate = new Date(eventDateEl.dataset.date);
    const signupDeadline = new Date(deadlineEl.dataset.date);
    const today = new Date();

    // Event voorbij
    if (today > eventDate) {
        disableSignup(
            "Event gepasseerd",
            "Dit evenement is al voorbij."
        );
        return;
    }

    if (!inschrijvingenGeopend) {
        disableSignup(
            "Inschrijvingen nog niet geopend",
            "De inschrijvingen zijn binnenkort beschikbaar."
        );
        return;
    }

    // Deadline voorbij
    if (today > signupDeadline) {
        disableSignup(
            "Inschrijven niet meer mogelijk",
            "De inschrijvingsdeadline is verstreken."
        );
        return;
    }

    // Volzet (manueel)
    if (volzet) {
        disableSignup(
            "Volzet",
            "De markt is volzet."
        );
        return;
    }

    // Alles ok
    signupButton.classList.remove("disabled");
    signupButton.innerHTML = "<span>Inschrijven</span>";
    signupButton.onclick = prepareSignupForm;
}

function disableSignup(label, message) {
    const signupButton = document.getElementById("signupButton");
    signupButton.classList.add("disabled");
    signupButton.innerHTML = `<span>${label}</span>`;
    signupButton.onclick = () => alert(message);
}


// Functie om de foto's te tonen
function showPhotos(year) {
const photos = {
2024: [
    './img/2024/Schmink052024.jpg',
    './img/2024/Schmink052024_2.jpg',
    './img/2024/Kraam052024.jpg'
],
2025: [
    './img/2025/Biesbilkstraat1.jpg',
    './img/2025/IjskarElwin.jpg',
    './img/2025/Biesbilkstraat2.jpg',
]
};

const PhotoGallery = document.getElementById('PhotoGallery');
PhotoGallery.style.display = "grid";

PhotoGallery.innerHTML = '';

if (photos[year]) {
photos[year].forEach(photo => {
    const img = document.createElement('img');
    img.src = photo;
    img.alt = 'Foto van de schminkworkshop';
    PhotoGallery.appendChild(img);
});
} else {
PhotoGallery.innerHTML = `<span>Nog geen foto's beschikbaar voor ${year}.</span>`;
}
}


// Web Share API voor moderne browsers
document.getElementById("shareButton").addEventListener("click", function () {
if (navigator.share) {
navigator.share({
    title: "Rommelmarkt & Garageverkoop Rietedries",
    text: "Kom ook naar de Rommelmarkt & Garageverkoop Rietedries op 9 mei 2026! Gratis toegang. Bekijk hier meer details!",
    url: window.location.href
}).then(() => {
    console.log("Succesvol gedeeld!");
}).catch(console.error);
} else {
alert("Delen wordt niet ondersteund in deze browser. Gebruik de specifieke knoppen hieronder.");
}
});

// Specifieke deelopties
const eventUrl = encodeURIComponent(window.location.href);
const eventTitle = encodeURIComponent("Rommelmarkt & Garageverkoop Rietedries");
const eventText = encodeURIComponent("Kom ook naar de Rommelmarkt & Garageverkoop Rietedries op 9 mei 2026! Gratis toegang.");

// Facebook
document.getElementById("facebookShare").href = `https://www.facebook.com/sharer/sharer.php?u=${eventUrl}`;

// WhatsApp
document.getElementById("whatsappShare").href = `https://api.whatsapp.com/send?text=${eventText}%20${eventUrl}`;

// E-mail
document.getElementById("emailShare").href = `mailto:?subject=${eventTitle}&body=${eventText}%20${eventUrl}`;
