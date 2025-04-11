import { NextApiRequest, NextApiResponse } from 'next';
import Redis from 'ioredis';

// Initialize Redis client with fallback URL
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { national_code } = req.query;

  try {
    // Get user photo directly using national code as key
    const photo = await redis.get(`${national_code}`);
    
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    return res.status(200).json({ photo });
  } catch (error) {
    console.error('Error fetching photo from Redis:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}