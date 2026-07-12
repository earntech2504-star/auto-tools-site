const multer = require('multer');
const FormData = require('form-data');
const fetch = require('node-fetch');

const upload = multer();

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

module.exports = async (req, res) => {
  await runMiddleware(req, res, upload.single('image'));
  
  try {
    const formData = new FormData();
    formData.append('image_file', req.file.buffer, 'image.png');
    formData.append('size', 'auto');
    
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 'X-Api-Key': process.env.REMOVE_BG_KEY },
      body: formData
    });
    
    if (!response.ok) throw new Error('Remove.bg API failed');
    
    const imageBuffer = await response.buffer();
    res.setHeader('Content-Type', 'image/png');
    res.send(imageBuffer);
  } catch (error) {
    res.status(500).json({ error: 'Background removal failed' });
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};
