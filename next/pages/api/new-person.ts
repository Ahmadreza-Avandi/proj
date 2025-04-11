// pages/api/new-person.ts
import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import axios from 'axios';
import express, { Request, Response } from 'express'; // اضافه کردن express

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const config = {
  api: {
    bodyParser: false,
  },
};

interface RequestWithFiles extends NextApiRequest {
  files: any[];
}

export default async (req: RequestWithFiles, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const expressReq = req as unknown as express.Request;
      const expressReqTyped = expressReq as Request;

      // تبدیل نوع res به نوع مورد نیاز تابع upload.any()
      const expressRes = res as unknown as express.Response;
      const expressResTyped = expressRes as Response;

      upload.any()(expressReqTyped, expressResTyped, async (err) => {
        if (err) {
          console.error(err);
          return expressRes.status(500).json({ message: 'Failed to process the request' });
        }

        const { files, body } = req;
        const { firstName, lastName, nationalCode, studentId } = body;
        const face = files && files.length > 0 ? files[0].buffer : null;

        const response = await axios.post(
          'http://localhost:3001/new-person',
          {
            face,
            firstName,
            lastName,
            nationalCode,
            studentId,
          }
        );

        return res.status(200).json(response.data);
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to save data' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
};
