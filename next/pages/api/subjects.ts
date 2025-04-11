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

  const { classId, dayOfWeek } = req.query;

  try {
    const connection = await mysql.createConnection(dbConfig.connectionString);
    
    let query = `
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
      WHERE 1=1
    `;
    
    const queryParams: any[] = [];
    
    if (classId) {
      query += ` AND s.classId = ?`;
      queryParams.push(classId);
    }
    
    if (dayOfWeek) {
      query += ` AND s.dayOfWeek = ?`;
      queryParams.push(dayOfWeek);
    }
    
    query += ` ORDER BY s.name ASC`;
    
    const [rows] = await connection.execute(query, queryParams);
    await connection.end();
    
    return res.status(200).json(rows);
  } catch (error: unknown) {
    console.error('Error fetching subjects:', error);
    return res.status(500).json({ 
      message: 'Internal server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
} 