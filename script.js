// Functie om de gegevens van het formulier te versturen via EmailJS
function sendMail() {
    // Haal de gegevens van het formulier op
    let params = {
        firstname: document.getElementById('firstname').value,
        lastname: document.getElementById('lastname').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value || 'Niet opgegeven',  // Als telefoonnummer leeg is, geef "Niet opgegeven" terug
    };

    // Stuur de e-mail via de EmailJS API
    emailjs.send("service_prxhdxf", "template_94jtjce", params)
        .then(function(response) {
            // Verberg het formulier en toon de succesboodschap
            hideSignupForm();
            showSuccessMessage(); // Toon succesbericht
        }, function(error) {
            // Optioneel: we kunnen hier nog iets toevoegen om de gebruiker te informeren als het fout gaat
            alert("Er is iets misgegaan bij het versturen van je inschrijving. Probeer het later opnieuw.");
            console.error("EmailJS error: ", error);
        });
}

// Functie om het inschrijfformulier te tonen
function showSignupForm() {
    var form = document.getElementById("inschrijvingsformuliercontainer");
    form.style.display = "block"; // Maak het formulier zichtbaar
}

// Functie om het inschrijfformulier te verbergen
function hideSignupForm() {
    var form = document.getElementById("inschrijvingsformuliercontainer");
    form.style.display = "none"; // Verberg het formulier
}

// Functie om het succesbericht te tonen
function showSuccessMessage() {
    var successMessage = document.getElementById("successMessage");
    successMessage.style.display = "block"; // Maak het succesbericht zichtbaar
}

// Functie om te controleren of inschrijven nog mogelijk is
function checkSignupDate() {
    var deadline = new Date("2025-05-03"); // Deadline voor inschrijving
    var today = new Date();

    if (today > deadline) {
        // Verberg de inschrijvingsknop en geef feedback dat inschrijving gesloten is
        var signupButton = document.getElementById("signupButton");
        signupButton.classList.add("disabled");
        signupButton.onclick = function() {
            alert("De inschrijvingen zijn gesloten.");
        };
    }
}

// Controleer de datum bij het laden van de pagina
window.onload = function() {
    checkSignupDate();
};

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

