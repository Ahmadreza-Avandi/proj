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
      `SELECT 
         c.id,
         c.name,
         m.name as major,
         g.name as grade
       FROM class c
       LEFT JOIN major m ON c.majorId = m.id
       LEFT JOIN grade g ON c.gradeId = g.id`
    );
    await connection.end();
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching classes:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
