// Script pour vérifier et initialiser la base de données
require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

console.log('🔍 Vérification de la structure de la table Match...');

// Vérifier la structure de la table
connection.query('DESCRIBE `Match`', (err, results) => {
  if (err) {
    console.error('❌ Erreur lors de la vérification de la table:', err);
    return;
  }

  console.log('📋 Structure de la table Match:');
  results.forEach(column => {
    console.log(`  - ${column.Field}: ${column.Type} ${column.Null === 'YES' ? '(NULL)' : '(NOT NULL)'}`);
  });

  // Vérifier s'il y a des données
  connection.query('SELECT COUNT(*) as count FROM `Match`', (err, results) => {
    if (err) {
      console.error('❌ Erreur lors du comptage:', err);
      return;
    }

    const count = results[0].count;
    console.log(`📊 Nombre de matchs dans la base: ${count}`);

    if (count === 0) {
      console.log('⚠️  Aucun match trouvé. Ajout de données de test...');

      // Ajouter des données de test
      const testMatches = [
        {
          match_date: '2026-01-15 20:00:00',
          team1_name: 'PSG',
          team2_name: 'OM',
          score_team1: 2,
          score_team2: 1
        },
        {
          match_date: '2026-01-22 18:30:00',
          team1_name: 'Real Madrid',
          team2_name: 'FC Barcelone',
          score_team1: null,
          score_team2: null
        },
        {
          match_date: '2026-01-10 15:00:00',
          team1_name: 'Manchester City',
          team2_name: 'Liverpool',
          score_team1: 3,
          score_team2: 0
        },
        {
          match_date: '2026-02-05 21:00:00',
          team1_name: 'Juventus',
          team2_name: 'AC Milan',
          score_team1: null,
          score_team2: null
        }
      ];

      // Insérer les données de test
      const insertQuery = 'INSERT INTO `Match` (match_date, team1_name, team2_name, score_team1, score_team2) VALUES ?';
      const values = testMatches.map(match => [
        match.match_date,
        match.team1_name,
        match.team2_name,
        match.score_team1,
        match.score_team2
      ]);

      connection.query(insertQuery, [values], (err, result) => {
        if (err) {
          console.error('❌ Erreur lors de l\'insertion des données de test:', err);
        } else {
          console.log(`✅ ${result.affectedRows} matchs de test ajoutés avec succès !`);
        }
        connection.end();
      });
    } else {
      // Afficher quelques exemples de données
      connection.query('SELECT * FROM `Match` LIMIT 3', (err, results) => {
        if (err) {
          console.error('❌ Erreur lors de la récupération des exemples:', err);
        } else {
          console.log('📋 Exemples de données:');
          results.forEach((match, index) => {
            console.log(`  Match ${index + 1}:`, JSON.stringify(match, null, 2));
          });
        }
        connection.end();
      });
    }
  });
});