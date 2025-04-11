import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

const dbConfig = {
  connectionString: process.env.DATABASE_URL || 'mysql://root:@localhost:3306/proj',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  try {
    const connection = await mysql.createConnection(dbConfig.connectionString);
    if (req.method === 'PUT') {
      const { fullName, nationalCode, phoneNumber, roleId, classId } = req.body;
      const query = `
        UPDATE user 
        SET fullName = ?, nationalCode = ?, phoneNumber = ?, roleId = ?, classId = ?
        WHERE id = ?
      `;
      const params = [fullName, nationalCode, phoneNumber, roleId, classId || null, id];
      await connection.execute(query, params);
      await connection.end();
      return res.status(200).json({ message: 'User updated successfully' });
    } else if (req.method === 'DELETE') {
      const query = `DELETE FROM user WHERE id = ?`;
      await connection.execute(query, [id]);
      await connection.end();
      return res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.setHeader('Allow', ['PUT', 'DELETE']);
      await connection.end();
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error updating/deleting user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
