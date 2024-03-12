// pages/api/modelProxy.js

export default async function handler(req, res) {
  const { modelUrl } = req.query;

  try {
    const modelRes = await fetch(modelUrl);
    const modelBuffer = await modelRes.arrayBuffer();
    res.setHeader('Content-Type', 'model/gltf-binary');
    res.send(Buffer.from(modelBuffer));
  } catch (error) {
    console.error('Error fetching model:', error);
    res.status(500).json({ message: 'Error fetching model' });
  }
}
