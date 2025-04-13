import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const API_URL = 'http://localhost:3001/users'; // آدرس API NestJS

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // دریافت لیست کاربران
      const response = await axios.get(API_URL);
      return res.status(200).json(response.data);
    } else if (req.method === 'POST') {
      const { userId, role } = req.body;

      // اعتبارسنجی ورودی‌ها
      if (!userId || !role) {
        return res.status(400).json({ message: 'لطفا userId و نقش را مشخص کنید.' });
      }

      // تغییر نقش کاربر
      const response = await axios.put(`${API_URL}/${userId}/role`, { role });
      return res.status(200).json(response.data);
    } else {
      // اگر متد معتبر نیست
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    console.error('Error fetching users:', error);
    
    // Handle errors with a more direct approach
    const statusCode = error.response?.status || 500;
    const message = error.response?.data?.message || 'An error occurred while fetching users';
    
    return res.status(statusCode).json({ message });
  }
}
