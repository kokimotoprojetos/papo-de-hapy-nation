export default function handler(req, res) {
  if (req.method === 'POST') {
    // Log the transaction update details sent by the gateway
    console.log('InvictusPay Webhook Received:', req.body);
    
    // Respond with a 200 OK to Invictus Pay to confirm receipt
    return res.status(200).json({ success: true, message: 'Webhook received successfully' });
  }
  
  return res.status(405).json({ message: 'Method Not Allowed' });
}
