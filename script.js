// Functie om de gegevens van het formulier te versturen via EmailJS
function sendMail() {
    const submitButton = document.getElementById("submitButton");
    const submitSpan = submitButton.querySelector("span");
    const envelopeGif = document.getElementById("envelopeGif");
    const loadingDots = document.getElementById("loadingDots");
    const successCheck = document.getElementById("successCheck");

    // Reset knop en verberg elementen
    submitButton.disabled = true;
    submitSpan.style.display = "none";
    envelopeGif.style.display = "block";

    // Begin met de GIF-animatie (2 seconden)
    setTimeout(() => {
        envelopeGif.style.display = "none";
        loadingDots.style.display = "flex";
    }, 2000);

    // Schakel naar de bolletjes-animatie (3 seconden)
    setTimeout(() => {
        loadingDots.style.display = "none";
        successCheck.style.display = "block";
    }, 5000);

    // Toon succesbericht na alle animaties (7 seconden totaal)
    setTimeout(() => {
        resetButton();
        hideSignupForm();
        showSuccessMessage();
    }, 7000);

    // Verzenden van de gegevens met EmailJS en Google Sheets
    const params = {
        firstname: document.getElementById("firstname").value,
        lastname: document.getElementById("lastname").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value || "Niet opgegeven",
    };

    emailjs.send("service_prxhdxf", "template_94jtjce", params)
    .then(() => pushSpreadcheet(params))
    .catch((error) => {
        alert("Er is iets misgegaan bij het versturen van je inschrijving. Probeer het later opnieuw.");
        console.error("EmailJS error: ", error);
        resetButton();
    });
}

function pushSpreadcheet(params) {
const scriptURL = "https://script.google.com/macros/s/AKfycbzFUzpV7kFsD67CF3-9iwtoR6nPdJh46jSB3To2JLNrnRaF5ZDwi-gUMAipJe7e2SUw/exec";
const formData = new URLSearchParams();
formData.append("firstname", params.firstname);
formData.append("lastname", params.lastname);
formData.append("email", params.email);
formData.append("phone", params.phone);

fetch(scriptURL, {
    method: "POST",
    body: formData,
    mode: "no-cors",
}).catch((error) => console.error("Fout bij toevoegen aan spreadsheet:", error));
}

// Functie om de knop en formulier te resetten
function resetButton() {
const submitButton = document.getElementById("submitButton");
const submitSpan = submitButton.querySelector("span");
const envelopeGif = document.getElementById("envelopeGif");
const loadingDots = document.getElementById("loadingDots");
const successCheck = document.getElementById("successCheck");

submitButton.disabled = false;
submitSpan.style.display = "block";
envelopeGif.style.display = "none";
loadingDots.style.display = "none";
successCheck.style.display = "none";
}

// Functie om het formulier opnieuw in te stellen en de succesboodschap te verbergen
function prepareSignupForm() {
const formContainer = document.getElementById("inschrijvingsformuliercontainer");
const successMessage = document.getElementById("successMessage");
const signupForm = document.getElementById("signupFormElement");

signupForm.reset(); // Reset formulier
formContainer.style.display = "block"; // Toon formulier
successMessage.style.display = "none"; // Verberg succesbericht
}

// Functie om het succesbericht te tonen
function showSuccessMessage() {
const successMessage = document.getElementById("successMessage");
successMessage.style.display = "block";
}

// Functie om het formulier te verbergen
function hideSignupForm() {
const formContainer = document.getElementById("inschrijvingsformuliercontainer");
formContainer.style.display = "none";
}


// Functie om het succesbericht te tonen
function showSuccessMessage() {
const successMessage = document.getElementById("successMessage");
successMessage.style.display = "block";
}

// Controleer deadline voor inschrijving
function checkSignupDate() {
const deadline = new Date("2025-05-03");
const today = new Date();
const signupButton = document.getElementById("signupButton");

if (today > deadline) {
    signupButton.classList.add("disabled");
    signupButton.onclick = function () {
        alert("De inschrijvingen zijn gesloten.");
    };
}
}

// Controleer bij laden van de pagina
window.onload = function () {
checkSignupDate();
};



// Functie om de foto's te tonen
function showPhotos(year) {
const photos = {
    2024: [
        './img/2024/Schmink052024.jpg',
        './img/2024/Schmink052024_2.jpg',
        './img/2024/Kraam052024.jpg'
    ]
};

const PhotoGallery = document.getElementById('PhotoGallery');

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
        text: "Kom ook naar de Rommelmarkt & Garageverkoop Rietedries op 10 mei 2025! Gratis toegang. Bekijk hier meer details!",
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
const eventText = encodeURIComponent("Kom ook naar de Rommelmarkt & Garageverkoop Rietedries op 10 mei 2025! Gratis toegang.");

// Facebook
document.getElementById("facebookShare").href = `https://www.facebook.com/sharer/sharer.php?u=${eventUrl}`;

// WhatsApp
document.getElementById("whatsappShare").href = `https://api.whatsapp.com/send?text=${eventText}%20${eventUrl}`;

// E-mail
document.getElementById("emailShare").href = `mailto:?subject=${eventTitle}&body=${eventText}%20${eventUrl}`;
