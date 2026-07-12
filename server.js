const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const multer = require('multer');
const FormData = require('form-data');  // ← Ye line add ki maine
const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// 1. AI Image Generator
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await fetch(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HF_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: prompt })
      }
    );
    
    if (!response.ok) {
      return res.status(500).json({ error: 'HuggingFace API failed' });
    }
    
    const imageBuffer = await response.buffer();
    res.set('Content-Type', 'image/png');
    res.send(imageBuffer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Image generation failed' });
  }
});

// 2. Background Remover
app.post('/api/remove-bg', upload.single('image'), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append('image_file', req.file.buffer, 'image.png');
    formData.append('size', 'auto');
    
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 'X-Api-Key': process.env.REMOVE_BG_KEY },
      body: formData
    });
    
    if (!response.ok) {
      return res.status(500).json({ error: 'Remove.bg API failed' });
    }
    
    const imageBuffer = await response.buffer();
    res.set('Content-Type', 'image/png');
    res.send(imageBuffer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Background removal failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
