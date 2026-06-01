export default async function handler(req, res) {
  const { hash } = req.query;
  if (!hash) {
    return res.status(400).json({ message: 'Missing transaction hash' });
  }

  const apiToken = process.env.INVICTUS_API_TOKEN || '4puFJxwmWBVhKl4QcnBRnRob54YscEYFBeFSaCr0ljG4hVn1uaB2eXPsMWQY';

  try {
    const response = await fetch(`https://api.invictuspay.app.br/api/public/v1/transactions/${hash}?api_token=${apiToken}`);
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    console.error('Error proxying transaction query:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
