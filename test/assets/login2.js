async function startWebAuthn() {
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
        alert("Logowanie biometryczne zakończone sukcesem!");
        window.location.href = 'home.html';
      } else {
        alert("Błąd logowania biometrycznego!");
      }
    } catch (err) {
      console.error("Błąd logowania:", err);
      alert("Logowanie nie powiodło się.");
    }
  }
  
  // Obsługa przycisku
  document.getElementById('loginBiometricsBtn').addEventListener('click', startWebAuthn);
  