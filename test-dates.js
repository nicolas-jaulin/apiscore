// Test des dates de la DB
require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.query('SELECT match_date, equipe_int, equipe_ext FROM `Match` LIMIT 1', (err, results) => {
  if (err) {
    console.error('Erreur SQL:', err);
  } else {
    console.log('=== ANALYSE DES DATES ===');
    console.log('Date brute de la DB:', results[0].match_date);
    console.log('Type de la date:', typeof results[0].match_date);

    const dateObj = new Date(results[0].match_date);
    console.log('Date en UTC:', dateObj.toISOString());
    console.log('Date locale (France):', dateObj.toLocaleString('fr-FR'));
    console.log('Timestamp:', dateObj.getTime());

    // Test de différentes interprétations
    console.log('\n=== TESTS D\'INTERPRÉTATION ===');
    console.log('Sans timeZone (défaut):', dateObj.toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }));

    console.log('Avec timeZone Europe/Paris:', dateObj.toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
      timeZone: 'Europe/Paris'
    }));
  }
  connection.end();
});