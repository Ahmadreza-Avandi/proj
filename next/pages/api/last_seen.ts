import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch('http://localhost:3001/last_seen'); // پورت 3001
    if (!response.ok) {
      throw new Error('Failed to fetch data from NestJS API');
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching last_seen data:', error);
    res.status(500).json({ message: 'Error fetching last_seen data' });
  }
}
