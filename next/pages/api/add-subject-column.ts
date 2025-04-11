import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

const dbConfig = {
  connectionString: process.env.DATABASE_URL || 'mysql://root:@localhost:3306/proj',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const connection = await mysql.createConnection(dbConfig.connectionString);
    
    // Check if the subjectId column already exists
    const [columns] = await connection.execute(`
      SHOW COLUMNS FROM attendance LIKE 'subjectId'
    `);
    
    if ((columns as any[]).length === 0) {
      // The column doesn't exist, so add it
      await connection.execute(`
        ALTER TABLE attendance 
        ADD COLUMN subjectId INT NULL,
        ADD CONSTRAINT subject_fk FOREIGN KEY (subjectId) REFERENCES subject(id) ON DELETE SET NULL
      `);
      
      await connection.end();
      return res.status(200).json({ message: 'Added subjectId column to attendance table' });
    } else {
      await connection.end();
      return res.status(200).json({ message: 'subjectId column already exists' });
    }
  } catch (error: unknown) {
    console.error('Error updating database schema:', error);
    return res.status(500).json({ 
      message: 'Internal server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
} 