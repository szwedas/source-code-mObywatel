// index.js
require('dotenv').config();

const { Client, GatewayIntentBits, SlashCommandBuilder, PermissionFlagsBits, REST, Routes } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch').default;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers // ← DODAJ TO!
  ]
});
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY);

// Komendy
const commands = [
  new SlashCommandBuilder()
    .setName('register')
    .setDescription('Rejestruj się za pomocą klucza i roli')
    .addStringOption(option =>
      option.setName('key').setDescription('Podaj swój klucz').setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('createkey')
    .setDescription('Generuje nowy klucz i zapisuje do bazy (admin only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
].map(command => command.toJSON());

// Rejestracja komend
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);
rest.put(Routes.applicationGuildCommands(process.env.DISCORD_APPLICATION_ID, process.env.DISCORD_GUILD_ID), { body: commands })
  .then(() => console.log('✅ Komendy zarejestrowane!'))
  .catch(console.error);

// Obsługa komend
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  // Komenda /register
  if (interaction.commandName === 'register') {
    const key = interaction.options.getString('key');
    const userId = interaction.user.id;

    const { data: keyData, error: keyError } = await supabase
      .from('keys')
      .select('*')
      .eq('key', key)
      .single();

    if (keyError || !keyData || keyData.used) {
      await interaction.reply({ content: '❌ Nieprawidłowy lub już użyty klucz!', ephemeral: true });
      return;
    }

    const token = process.env.DISCORD_BOT_TOKEN;

    // Pobieranie danych użytkownika
    const userResponse = await fetch(`https://discord.com/api/v10/users/@me`, {
      headers: { Authorization: `Bot ${token}` }
    });
    const userData = await userResponse.json();
    console.log('🧑 Dane użytkownika:', userData);

    // Pobieranie danych członka z serwera
    const memberResponse = await fetch(`https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}/members/${userId}`, {
      headers: { Authorization: `Bot ${token}` }
    });
    const memberData = await memberResponse.json();
    console.log('📄 Dane członka serwera:', memberData);

    if (!memberData.roles || !memberData.roles.includes('1360739779142226130')) {
      await interaction.reply({ content: '❌ Użytkownik nie ma wymaganej roli "klient".', ephemeral: true });
      return;
    }

    const { error: insertError } = await supabase
      .from('passwords')
      .insert([{
        password: crypto.randomBytes(8).toString('hex'),
        hwid: userData.id,
        loggedIn: false,
        userID: userId
      }]);

    if (insertError) {
      await interaction.reply({ content: '❌ Wystąpił błąd przy dodawaniu do bazy!', ephemeral: true });
      return;
    }

    await supabase
      .from('keys')
      .update({ used: true })
      .eq('key', key);

    const jwtToken = jwt.sign({ userId, username: interaction.user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    await interaction.reply({
      content: `✅ Rejestracja zakończona pomyślnie! Oto Twój token: \`${jwtToken}\`. Możesz teraz użyć go do zalogowania się na stronie.`,
      ephemeral: true
    });
  }

  // Komenda /createkey
  if (interaction.commandName === 'createkey') {
    const newKey = crypto.randomBytes(8).toString('hex').toUpperCase();

    const { error: keyInsertError } = await supabase
      .from('keys')
      .insert([{ key: newKey, used: false }]);

    if (keyInsertError) {
      await interaction.reply({ content: '❌ Wystąpił błąd przy tworzeniu klucza!', ephemeral: true });
      return;
    }

    await interaction.reply({ content: `✅ Nowy klucz: \`${newKey}\``, ephemeral: true });
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
