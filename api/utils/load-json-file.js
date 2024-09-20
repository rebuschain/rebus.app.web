import { promises as fs } from 'fs';
import path from 'path';

// Generic function to load a specific JSON file
export const loadJSONFile = async (filename) => {
  const filePath = path.join(process.cwd(), 'data', `${filename}.json`);
  
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    throw new Error(`Failed to load file: ${filename}.json`);
  }
};