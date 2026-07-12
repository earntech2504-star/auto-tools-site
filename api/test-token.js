export default function handler(req, res) {
  const token = process.env.HF_TOKEN;
  
  if (!token) {
    return res.status(500).json({ 
      status: 'FAIL', 
      error: 'HF_TOKEN not found in environment' 
    });
  }
  
  res.status(200).json({ 
    status: 'PASS', 
    message: 'Token mil gaya bhai', 
    token_start: token.substring(0, 6) + '...' 
  });
}
