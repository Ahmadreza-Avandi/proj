import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

const dbConfig = {
  connectionString: process.env.DATABASE_URL || 'mysql://user:userpassword@mysql:3306/mydatabase',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { classId, dayOfWeek } = req.query;

  if (!classId || !dayOfWeek) {
    return res.status(400).json({ message: 'کلاس و روز هفته الزامی هستند' });
  }

  try {
    const connection = await mysql.createConnection(dbConfig.connectionString);
    
    // کوئری برای دریافت دروس کلاس در روز هفته مشخص
    const query = `
      SELECT 
        s.id,
        s.name,
        s.classId,
        s.teacherId,
        s.dayOfWeek,
        s.startTime,
        s.endTime,
        c.name as className,
        u.fullName as teacherName
      FROM subject s
      LEFT JOIN class c ON s.classId = c.id
      LEFT JOIN user u ON s.teacherId = u.id
      WHERE s.classId = ? AND s.dayOfWeek = ?
      ORDER BY s.startTime ASC
    `;
    
    const [rows] = await connection.execute(query, [classId, dayOfWeek]);
    await connection.end();
    
    return res.status(200).json(rows);
  } catch (error: unknown) {
    console.error('Error fetching class subjects:', error);
    return res.status(500).json({ 
      message: 'Internal server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
} 