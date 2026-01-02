// On "importe" les outils qu'on a installés pour pouvoir les utiliser

require('dotenv').config(); // Charge les variables du fichier .env

const express = require('express');

const mysql = require('mysql2');

const cors = require('cors');

// On crée l'application (le serveur)

const app = express();

// On configure CORS pour accepter les requêtes venant d'ailleurs (du front)

app.use(cors());

// On sert les fichiers statiques du dossier public (HTML, CSS, JS)

app.use(express.static('public'));

// Route pour servir la page d'accueil

app.get('/', (req, res) => {

  res.sendFile(__dirname + '/public/index.html');

});

// --- CONFIGURATION DE LA BASE DE DONNÉES ---

// On récupère les infos de connexion depuis les variables d'environnement (le fichier .env)

// C'est sécurisé : le mot de passe n'est pas écrit ici !

console.log('🔧 Configuration DB:');

console.log('  Host:', process.env.DB_HOST);

console.log('  Port:', process.env.DB_PORT);

console.log('  User:', process.env.DB_USER);

console.log('  Database:', process.env.DB_NAME);

console.log('  Password défini:', !!process.env.DB_PASSWORD);

const connection = mysql.createConnection({

  host: process.env.DB_HOST,

  port: process.env.DB_PORT,

  user: process.env.DB_USER,

  password: process.env.DB_PASSWORD,

  database: process.env.DB_NAME

});

// On teste la connexion au démarrage

connection.connect((err) => {

  if (err) {

    console.error('Erreur de connexion à la base de données :', err);

    console.error('Détails de l\'erreur:', err.code, err.errno, err.sqlState);

  } else {

    console.log('Connecté à la base de données MySQL sur Aiven !');

  }

});

// --- LES ROUTES DE L'API (Les URLs disponibles) ---

// 1. Route de santé (Health Check)

// Permet de vérifier que l'API est en vie.

// Quand on appellera GET /api/healthz, ça répondra { "ok": true }

app.get('/api/healthz', (req, res) => {

  res.json({ ok: true });

});

// 2. Route pour récupérer les matchs

// Quand on appellera GET /api/matches, on demandera la liste à la base de données

app.get('/api/matches', (req, res) => {

  console.log('🔍 Requête reçue sur /api/matches depuis:', req.ip);

  // On écrit la requête SQL avec mapping des colonnes

  const query = `
    SELECT
      id,
      match_date,
      equipe_int as team1_name,
      equipe_ext as team2_name,
      score_int as score_team1,
      score_ext as score_team2,
      status,
      notes
    FROM \`Match\`
    ORDER BY match_date ASC
  `;

  console.log('📝 Exécution de la requête SQL avec mapping des colonnes');

  // On l'exécute sur la connexion

  connection.query(query, (err, results) => {

    if (err) {

      // S'il y a une erreur technique (ex: table inexistante), on renvoie une erreur 500

      console.error('Erreur SQL:', err);

      res.status(500).json({ error: 'Erreur lors de la récupération des matchs' });

    } else {

      console.log(`✅ ${results.length} matchs trouvés et mappés`);

      if (results.length === 0) {

        console.log('⚠️  Aucun match dans la base de données');

      } else {

        console.log('📊 Premier match mappé:', {

          date: results[0].match_date,

          team1: results[0].team1_name,

          team2: results[0].team2_name,

          score: `${results[0].score_team1} - ${results[0].score_team2}`

        });

      }

      // Sinon, on renvoie les résultats en format JSON (texte structuré)

      res.json(results);

    }

  });

});

// --- DÉMARRAGE DU SERVEUR ---

// On dit à l'application d'écouter sur le port défini (souvent 3000 en local, ou défini par Render en ligne)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(`🚀 Serveur API lancé sur le port ${PORT}`);

  console.log(`📍 Environnement: ${process.env.NODE_ENV || 'development'}`);

  console.log(`🔗 URL locale: http://localhost:${PORT}`);

  console.log(`🏥 Health check: http://localhost:${PORT}/api/healthz`);

  console.log(`⚽ Matches API: http://localhost:${PORT}/api/matches`);

});
