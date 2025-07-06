// Blokowanie F12, Ctrl+Shift+I, Ctrl+U
document.addEventListener('keydown', function (e) {
  if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && e.keyCode === 73) || (e.ctrlKey && e.keyCode === 85)) {
    e.preventDefault();
  }
});

// Po załadowaniu DOM podłączenie przycisku
document.addEventListener('DOMContentLoaded', () => {
  const goButton = document.querySelector('.go');
  if (goButton) {
    goButton.addEventListener('click', saveData);
  } else {
    console.error("Nie znaleziono przycisku .go");
  }
});

// Funkcja zapisująca dane do `mObywatelDB`
function saveData() {
  const name = document.getElementById('name').value.trim();
  const surname = document.getElementById('surname').value.trim();
  const image = document.getElementById('image').value.trim();

  const birthDay = document.querySelectorAll('.date_input')[0].value.padStart(2, '0');
  const birthMonth = document.querySelectorAll('.date_input')[1].value.padStart(2, '0');
  const birthYear = document.querySelectorAll('.date_input')[2].value.trim();

  const nationality = document.getElementById('nationality').value.trim();
  const familyName = document.getElementById('familyName').value.trim();
  const fathersFamilyName = document.getElementById('fathersFamilyName').value.trim();
  const mothersFamilyName = document.getElementById('mothersFamilyName').value.trim();
  const birthPlace = document.getElementById('birthPlace').value.trim();
  const countryOfBirth = document.getElementById('countryOfBirth').value.trim();
  const adress1 = document.getElementById('adress1').value.trim();
  const adress2 = document.getElementById('adress2').value.trim();
  const city = document.getElementById('city').value.trim();
  const mothersName = document.getElementById('mothersName').value.trim();
  const fathersName = document.getElementById('fathersName').value.trim();
  const givenDate = document.getElementById('givenDate').value.trim();
  const expiryDate = document.getElementById('expiryDate').value.trim();
  const seriesAndNumber = document.getElementById('seriesAndNumber').value.trim();

  const sex = document.querySelector('.selected_text').innerText.trim();

  const requiredFields = [
    name, surname, birthDay, birthMonth, birthYear,
    nationality, familyName, fathersFamilyName, mothersFamilyName,
    birthPlace, countryOfBirth, adress1, adress2, city, sex,
    mothersName, fathersName, givenDate, expiryDate,
    seriesAndNumber
  ];

  if (requiredFields.some(field => !field)) {
    alert("Uzupełnij wszystkie wymagane dane!");
    return;
  }

  if (
    birthDay < 1 || birthDay > 31 ||
    birthMonth < 1 || birthMonth > 12 ||
    birthYear.length !== 4 || isNaN(birthYear)
  ) {
    alert("Wprowadź prawidłową datę!");
    return;
  }

  let peselMonth = parseInt(birthMonth);
  if (parseInt(birthYear) >= 2000) peselMonth += 20;
  peselMonth = peselMonth.toString().padStart(2, '0');

  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  const pesel = birthYear.slice(2) + peselMonth + birthDay + randomDigits;

  const generatedData = {
    id: 1,
    pesel,
    name,
    surname,
    sex,
    image,
    nationality,
    familyName,
    fathersFamilyName,
    mothersFamilyName,
    birthPlace,
    countryOfBirth,
    adress1,
    adress2,
    city,
    birthDate: `${birthDay}.${birthMonth}.${birthYear}`,
    mothersName,
    fathersName,
    givenDate,
    expiryDate,
    seriesAndNumber
  };

  // Zapisz do mObywatelDB
  saveToIndexedDB(generatedData);

  // Przekierowanie do card.html
  window.location.href = 'card.html';
}
