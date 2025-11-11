import fs from 'fs/promises';

export async function readSeedFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist, return null so we generate synthetic data
    return null;
  }
}
