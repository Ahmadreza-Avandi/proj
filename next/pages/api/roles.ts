import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

const dbConfig = {
  connectionString: process.env.DATABASE_URL || 'mysql://root:@localhost:3306/proj',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
    const connection = await mysql.createConnection(dbConfig.connectionString);
    const [rows] = await connection.execute(
      `SELECT id, name, permissions FROM role`
    );
    await connection.end();
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching roles:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
