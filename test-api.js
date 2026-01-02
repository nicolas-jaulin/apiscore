// Test rapide de l'API
const http = require('http');

const req = http.get('http://localhost:3000/api/matches', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const matches = JSON.parse(data);
      console.log('=== TEST API LOCAL ===');
      console.log('Nombre de matches:', matches.length);
      if (matches.length > 0) {
        const match = matches[0];
        console.log('Premier match:');
        console.log('- Date:', match.match_date);
        console.log('- Équipe 1:', match.team1_name);
        console.log('- Équipe 2:', match.team2_name);
        console.log('- Score:', match.score_team1, '-', match.score_team2);
      }
    } catch (e) {
      console.log('Réponse brute:', data.substring(0, 200));
    }
  });
}).on('error', err => {
  console.error('Erreur de connexion:', err.message);
});