export default function handler(req, res) {
  res.status(200).json({
    hf_token_exists: !!process.env.HF_TOKEN,
    remove_bg_exists: !!process.env.REMOVE_BG_KEY,
    hf_token_length: process.env.HF_TOKEN?.length || 0
  });
}
