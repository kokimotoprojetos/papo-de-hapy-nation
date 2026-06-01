export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const apiToken = process.env.INVICTUS_API_TOKEN || '4puFJxwmWBVhKl4QcnBRnRob54YscEYFBeFSaCr0ljG4hVn1uaB2eXPsMWQY';
  const productHash = process.env.INVICTUS_PRODUCT_HASH || 'ebkyuskgpr';
  const offerHash = process.env.INVICTUS_OFFER_HASH || 'sflcapne6m';

  // Override hashes in the payload with env variables if provided
  const payload = req.body;
  if (payload.offer_hash) payload.offer_hash = offerHash;
  if (payload.cart && payload.cart[0]) {
    payload.cart[0].product_hash = productHash;
  }

  try {
    const response = await fetch(`https://api.invictuspay.app.br/api/public/v1/transactions?api_token=${apiToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    console.error('Error proxying transaction to Invictus Pay:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
