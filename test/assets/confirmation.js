window.onload = function () {
    // PESEL
    const pesel = localStorage.getItem('pesel');
    if (pesel) {
        document.getElementById('pesel').textContent = pesel;
    } else {
        document.getElementById('pesel').textContent = '-';
    }

    // Dane z generatedData
    const data = JSON.parse(localStorage.getItem('generatedData'));
    if (data) {
        // Imię
        document.getElementById('imie').textContent = data.name || '-';
        // Nazwisko
        document.getElementById('nazwisko').textContent = data.surname || '-';
        // Zdjęcie profilowe
        const photoUrl = data.image;
        if (photoUrl) {
            document.querySelector('.profile_photo').src = photoUrl;
        }
    } else {
        // Brak danych — domyślne wartości
        document.getElementById('imie').textContent = '-';
        document.getElementById('nazwisko').textContent = '-';
    }
}
