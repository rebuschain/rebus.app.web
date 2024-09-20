import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Extract the requested file name from the URL
  const { file } = req.query;

  // Define the path to the JSON file
  const filePath = path.join(process.cwd(), 'data', `${file}.json`);

  try {
    // Check if the file exists and read the contents
    const fileContents = await fs.readFile(filePath, 'utf8');

    // Parse the JSON data
    const data = JSON.parse(fileContents);

    // Return the JSON data
    res.status(200).json(data);
  } catch (error) {
    // Handle file not found or other errors
    res.status(404).json({ error: `File ${file}.json not found` });
  }
}
