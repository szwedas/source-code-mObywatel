function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = value;
}

function getRandom(min, max) {
  return parseInt(Math.random() * (max - min) + min);
}

function setClock() {
  const now = new Date();
  document.getElementById("time").innerHTML = "Czas: " + now.toLocaleTimeString("pl-PL");
  document.getElementById("date").innerHTML = now.toLocaleDateString("pl-PL");
  setTimeout(setClock, 1000);
}
setClock();

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function openPage(page) {
  clearClassList();
  document.querySelector(".confirm").classList.add("page_open");
  document.querySelector(".confirm").classList.add("page_" + page + "_open");
}

function closePage() {
  clearClassList();
}

function clearClassList() {
  const classList = document.querySelector(".confirm").classList;
  classList.remove("page_open", "page_1_open", "page_2_open", "page_3_open");
}

function sendTo(url) {
  location.href = url + ".html";
}

function deleteDocument() {
  openDatabase(db => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(1); // usuń dane główne
    store.delete(2); // zameldowanie
    store.delete(3); // pesel
    store.delete(4); // datę aktualizacji
    transaction.oncomplete = () => {
      alert("Dokument został usunięty.");
      location.href = "index.html";
    };
  });
}

// rozwijanie sekcji "Twoje dodatkowe dane"
document.querySelectorAll(".info_holder").forEach(el => {
  el.addEventListener("click", () => {
    el.classList.toggle("unfolded");
  });
});

// obsługa przycisku „Aktualizuj” po załadowaniu strony
function attachUpdateButton(options) {
  const updateButton = document.querySelector(".update");
  if (updateButton) {
    updateButton.addEventListener("click", () => {
      const newUpdate = new Date().toLocaleDateString("pl-PL", options);
      document.querySelector(".bottom_update_value").innerHTML = newUpdate;
      saveToIndexedDB({ id: 4, update: newUpdate });
      scroll(0, 0);
    });
  }
}

// pobranie danych z IndexedDB
getFromIndexedDB(1, (data) => {
  if (!data) {
    alert("Brak danych — wróć do generatora!");
    window.location.href = "index.html";
    return;
  }

  document.querySelector(".id_own_image").style.backgroundImage = `url(${data.image})`;

  const birthdaySplit = data.birthDate.split(".");
  const day = parseInt(birthdaySplit[0]);
  const month = parseInt(birthdaySplit[1]);
  const year = parseInt(birthdaySplit[2]);

  const birthdayDate = new Date(year, month - 1, day);
  const options = { year: 'numeric', month: 'numeric', day: '2-digit' };
  const birthdayFormatted = birthdayDate.toLocaleDateString("pl-PL", options);

  setText("name", data.name.toUpperCase());
  setText("surname", data.surname.toUpperCase());
  setText("nationality", data.nationality.toUpperCase());
  setText("birthday", birthdayFormatted);
  setText("familyName", data.familyName);
  setText("sex", data.sex);
  setText("fathersFamilyName", data.fathersFamilyName);
  setText("mothersFamilyName", data.mothersFamilyName);
  setText("birthPlace", data.birthPlace);
  setText("countryOfBirth", data.countryOfBirth);

  const adress = `ul. ${data.adress1}<br>${data.adress2} ${data.city}`;
  setText("adress", adress);
  setText("mothersName", data.mothersName);
  setText("fathersName", data.fathersName);
  setText("givenDate", data.givenDate);
  setText("expiryDate", data.expiryDate);
  setText("seriesAndNumber", data.seriesAndNumber);


  // domyślna data zameldowania
  getFromIndexedDB(2, (homeData) => {
    if (!homeData) {
      const homeDay = getRandom(1, 25);
      const homeMonth = getRandom(0, 12);
      const homeYear = getRandom(2012, 2019);
      const homeDate = new Date(homeYear, homeMonth, homeDay);
      const homeFormatted = homeDate.toLocaleDateString("pl-PL", options);

      document.querySelector(".home_date").innerHTML = homeFormatted;
      saveToIndexedDB({ id: 2, homeDate: homeFormatted });
    } else {
      document.querySelector(".home_date").innerHTML = homeData.homeDate;
    }
  });

  // PESEL
  let peselMonth = parseInt(month);
  if (year >= 2000) peselMonth = 20 + peselMonth;

  const later = data.sex.toLowerCase() === "mężczyzna" ? "0295" : "0382";
  const pesel =
    year.toString().substring(2) +
    (peselMonth < 10 ? "0" + peselMonth : peselMonth) +
    (day < 10 ? "0" + day : day) +
    later + "7";

  setText("pesel", pesel);
  saveToIndexedDB({ id: 3, pesel: pesel });

  // data ostatniej aktualizacji
  getFromIndexedDB(4, (updateData) => {
    if (!updateData) {
      const defaultUpdate = "24.12.2024";
      document.querySelector(".bottom_update_value").innerHTML = defaultUpdate;
      saveToIndexedDB({ id: 4, update: defaultUpdate });
    } else {
      document.querySelector(".bottom_update_value").innerHTML = updateData.update;
    }
    attachUpdateButton(options);
  });

});

// przypięcie funkcji do window dla onclick w HTML
window.openPage = openPage;
window.closePage = closePage;
window.sendTo = sendTo;
window.deleteDocument = deleteDocument;
