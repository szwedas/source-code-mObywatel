// Lista użytkowników przypisanych do kodów
const users = {
    '123456': {
      photo: 'https://i.imgur.com/yourPhoto.png',
      pesel: '73112473512',
      firstName: 'Jan',
      lastName: 'Kowalski',
      birthDate: '21.02.2003',
      issueDate: '21.08.2023',
      verifyDate: '20.10.2022, 16:31',
      validTo: '20.10.2023'
    },
    '654321': {
      photo: 'https://i.imgur.com/yourPhoto.png',
      pesel: '85061212345',
      firstName: 'Anna',
      lastName: 'Nowak',
      birthDate: '12.06.1985',
      issueDate: '14.07.2021',
      verifyDate: '12.11.2023, 14:22',
      validTo: '12.11.2024'
    }
  };
  
  // Pobierz kod z parametru URL
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  
  // Funkcja tworząca widok potwierdzenia
  function showConfirmation(data) {
    const confirmationView = document.createElement('div');
    confirmationView.className = 'confirmation_view';
    confirmationView.innerHTML = `
      <div class="scanner_header">
        <p class="main_title">Dane użytkownika</p>
      </div>
      <div class="confirmation_content">
        <img src="${data.photo}" alt="Zdjęcie" class="confirmation_photo">
        <p class="confirmation_status"><span class="status_icon">✔️</span> mDowód został potwierdzony</p>
        <p class="confirmation_valid">Data i godzina weryfikacji: ${data.verifyDate}</p>
        <p class="confirmation_valid">Certyfikat mDowodu jest ważny do ${data.validTo}</p>
        <div class="confirmation_data">
          <p><strong>Numer PESEL:</strong> ${data.pesel}</p>
          <p><strong>Imię:</strong> ${data.firstName}</p>
          <p><strong>Nazwisko:</strong> ${data.lastName}</p>
          <p><strong>Data urodzenia:</strong> ${data.birthDate}</p>
          <p><strong>Data wydania:</strong> ${data.issueDate}</p>
        </div>
      </div>
    `;
    document.body.appendChild(confirmationView);
  }
  
  // Sprawdzenie czy użytkownik istnieje
  if (users[code]) {
    showConfirmation(users[code]);
  } else {
    document.body.innerHTML = `
      <div class="error_view">
        <p class="main_title">Błąd</p>
        <p class="description">Nie znaleziono użytkownika dla podanego kodu.</p>
        <button onclick="window.history.back()">Wróć</button>
      </div>
    `;
  }
  