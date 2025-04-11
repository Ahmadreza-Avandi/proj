// pages/api/validate-token.ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Token is missing' });
    }

    try {
      const response = await axios.get('http://localhost:3001/auth/validate-token', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      res.status(200).json(response.data);
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};
