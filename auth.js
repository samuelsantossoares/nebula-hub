const axios = require('axios');

const REDIRECT_URI = 'https://la-store.vercel.app/api/auth';
const CLIENT_ID = '1403917323961893007';
const CLIENT_SECRET = process.env.CLIENT_SECRET; // Vem do Vercel
const SCOPE = 'identify';

module.exports = async (req, res) => {
  const { query } = req;
  const code = query.code;

  if (!code) {
    const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${SCOPE}&prompt=consent`;
    res.writeHead(302, { Location: discordAuthUrl });
    res.end();
    return;
  }

  try {
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
      scope: SCOPE
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const { access_token } = tokenResponse.data;

    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const user = userResponse.data;

    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify({ user }));
  } catch (err) {
    console.error('Erro na autenticação:', err.response?.data || err.message);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Falha ao conectar com Discord' }));
  }
};