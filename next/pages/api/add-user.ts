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
        'mysql://root:@localhost:3306/proj',
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
    } catch (error) {
      // مدیریت خطا
      if (error && typeof error === 'object' && 'response' in error) {
        const errorMessage = (error.response as any)?.data?.message || 'Failed to add user';
        console.error('Error adding user:', errorMessage); // ثبت خطا در کنسول
        return res.status(400).json({ message: errorMessage });
      } else {
        // برای خطاهای دیگر
        console.error('Unexpected error:', error);
        return res.status(500).json({ message: 'Unexpected error occurred' });
      }
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
};
