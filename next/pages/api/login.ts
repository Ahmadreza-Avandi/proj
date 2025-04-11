import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { nationalCode, password } = req.body;

    try {
      // ارسال درخواست به API Nest.js برای ورود
      const response = await axios.post(
        'http://localhost:3001/auth/login',
        {
          nationalCode,
          password,
        }
      );

      // اگر ورود موفقیت‌آمیز بود
      res.status(200).json(response.data);
    } catch (error) {
      // اگر ورود ناموفق بود
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};
