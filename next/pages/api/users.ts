import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';

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
  } catch (error) {
    console.error("خطا در برقراری ارتباط با سرور:", error);

    // مدیریت خطا با استفاده از axios
    if (axios.isAxiosError(error)) {
      return res.status(error.response?.status || 500).json({
        message: error.response?.data?.message || 'خطا در برقراری ارتباط با سرور',
      });
    } else {
      // برای خطاهای غیر Axios
      return res.status(500).json({ message: 'خطا غیر منتظره‌ای رخ داد.' });
    }
  }
}
