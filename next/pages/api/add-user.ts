import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { fullName, nationalCode, phoneNumber, password, roleId } = req.body;

    // اعتبارسنجی ورودی‌ها
    if (!fullName || !nationalCode || !phoneNumber || !password || !roleId) {
      return res.status(400).json({ message: 'لطفا همه فیلدها را پر کنید' });
    }

    try {
      // ارسال درخواست به API Nest.js برای افزودن کاربر
      const response = await axios.post(
        'http://backend:3001/users',
        {
          fullName,
          nationalCode,
          phoneNumber,
          password, // اضافه کردن رمز عبور به درخواست
          roleId, // اطمینان حاصل کنید که roleId اینجا درست ارسال می‌شود
        }
      );

      // اگر عملیات افزودن کاربر موفقیت‌آمیز بود
      return res.status(200).json(response.data);
    } catch (error: any) {
      // Handle errors with type checking
      console.error('Error adding user:', error);
      
      const errorMessage = error.response?.data?.message || 'Failed to add user';
      const statusCode = error.response?.status || 500;
      
      return res.status(statusCode).json({ message: errorMessage });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
};
