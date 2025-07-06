(async () => {
  const discordId = localStorage.getItem('discord_id');
  const KLIENT_ROLE_ID = '';

  if (!discordId) {
    return window.location.href = '/login.html';
  }

  try {
    const res = await fetch(`/api/check-user?discord_id=${discordId}`);
    const data = await res.json();

    if (!data.roles || !data.roles.includes(KLIENT_ROLE_ID)) {
      alert('Brak roli klienta – dostęp zabroniony');
      return window.location.href = '/login.html';
    }

    console.log('✅ Użytkownik ma rolę klient');
  } catch (err) {
    console.error('Błąd:', err);
    return window.location.href = '/login.html';
  }
})();
