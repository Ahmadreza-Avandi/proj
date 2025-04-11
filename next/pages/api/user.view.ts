// src/pages/api/user.view.ts
import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

interface UserRow {
  id: number;
  fullName: string;
  nationalCode: string;
  phoneNumber: string;
  roleId: number;
  roleName: string | null;
  permissions: string | null;
  className: string | null;
  majorName: string | null;
  gradeName: string | null;
}

const dbConfig = {
  connectionString: process.env.DATABASE_URL || 'mysql://root:@localhost:3306/proj',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
    const { classId, roleId } = req.query;
    const connection = await mysql.createConnection(dbConfig.connectionString);
    let query = `
      SELECT 
        u.id,
        u.fullName,
        u.nationalCode,
        u.phoneNumber,
        u.roleId,
        r.name as roleName,
        r.permissions,
        c.name as className,
        m.name as majorName,
        g.name as gradeName
      FROM user u
      LEFT JOIN role r ON u.roleId = r.id
      LEFT JOIN class c ON u.classId = c.id
      LEFT JOIN major m ON u.majorId = m.id
      LEFT JOIN grade g ON u.gradeId = g.id
    `;
    const params: any[] = [];
    const conditions: string[] = [];
    if (classId) {
      conditions.push('u.classId = ?');
      params.push(classId);
    }
    if (roleId) {
      conditions.push('u.roleId = ?');
      params.push(roleId);
    }
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    const [rows] = await connection.execute(query, params);
    await connection.end();

    // تبدیل داده‌های دریافت شده به ساختار دلخواه
    const users = (rows as UserRow[]).map((row) => ({
      id: row.id,
      fullName: row.fullName,
      nationalCode: row.nationalCode,
      phoneNumber: row.phoneNumber,
      roleId: row.roleId,
      role: {
        id: row.roleId,
        name: row.roleName,
        permissions: row.permissions,
      },
      className: row.className,
      majorName: row.majorName,
      gradeName: row.gradeName,
      classId: null, // در صورت نیاز می‌توانید مقدار classId را از جدول user نیز برگردانید
    }));

    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
