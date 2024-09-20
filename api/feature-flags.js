import { loadJSONFile } from 'utils/load-json-file';

export default async function handler(req, res) {
  try {
    const data = await loadJSONFile('feature-flags');  // Load specific JSON file
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}