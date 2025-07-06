var params = new URLSearchParams(window.location.search);

(async () => {
  const savedImage = await getData('userImage');
  if (savedImage) {
    params.set('image', savedImage);
  }
})();

document.querySelector(".login").addEventListener('click', () => {
  toHome();
});

document.querySelector(".login_biometrics").addEventListener('click', async () => {
  if (!window.PublicKeyCredential) {
    alert("Twoja przeglądarka nie obsługuje biometrii!");
    return;
  }

  const res = await fetch('/api/login');
  const options = await res.json();

  options.challenge = Uint8Array.from(atob(options.challenge), c => c.charCodeAt(0));
  options.allowCredentials = options.allowCredentials.map(cred => ({
    id: Uint8Array.from(atob(cred.id), c => c.charCodeAt(0)),
    type: cred.type
  }));

  try {
    const credential = await navigator.credentials.get({ publicKey: options });

    const verifyRes = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credential)
    });

    const result = await verifyRes.json();
    if (result.success) {
      alert("Logowanie zakończone sukcesem!");
      toHome();
    } else {
      alert("Błąd logowania!");
    }
  } catch (err) {
    console.error("Błąd logowania:", err);
    alert("Logowanie nie powiodło się.");
  }
});

var welcome = "Dzień dobry!";
var date = new Date();
if (date.getHours() >= 18) {
  welcome = "Dobry wieczór!"
}
document.querySelector(".welcome").innerHTML = welcome;

function toHome() {
  location.href = 'home.html?' + params.toString();
}

var input = document.querySelector(".password_input");
input.addEventListener("keypress", (event) => {
  if (event.key === 'Enter') {
    document.activeElement.blur();
  }
});

var dot = "•";
var original = "";
var eye = document.querySelector(".eye");

input.addEventListener("input", () => {
  var value = input.value.toString();
  var char = value.substring(value.length - 1);
  if (value.length < original.length) {
    original = original.substring(0, original.length - 1);
  } else {
    original = original + char;
  }

  if (!eye.classList.contains("eye_close")) {
    var dots = "";
    for (var i = 0; i < value.length - 1; i++) {
      dots = dots + dot
    }
    input.value = dots + char;
    delay(3000).then(() => {
      value = input.value;
      if (value.length != 0) {
        input.value = value.substring(0, value.length - 1) + dot
      }
    });
    console.log(original)
  }
});

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

eye.addEventListener('click', () => {
  var classlist = eye.classList;
  if (classlist.contains("eye_close")) {
    classlist.remove("eye_close");
    var dots = "";
    for (var i = 0; i < input.value.length - 1; i++) {
      dots = dots + dot
    }
    input.value = dots;
  } else {
    classlist.add("eye_close");
    input.value = original;
  }
});
