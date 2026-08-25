import { Request, Response } from 'express';

export const uploadSingleImage = (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ success: false, message: 'لم يتم استلام أي ملف' });
    return;
  }

  const filePath = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    message: 'تم رفع الصورة بنجاح',
    data: {
      imagePath: filePath,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
    },
  });
};

export const uploadMultipleImages = (req: Request, res: Response): void => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    res.status(400).json({ success: false, message: 'لم يتم استلام أي ملفات' });
    return;
  }

  const uploaded = files.map((file, idx) => ({
    imagePath: `/uploads/${file.filename}`,
    fileName: file.filename,
    originalName: file.originalname,
    size: file.size,
    sortOrder: idx,
    isPrimary: idx === 0,
  }));

  res.json({
    success: true,
    message: `تم رفع ${uploaded.length} صورة بنجاح`,
    data: uploaded,
  });
};
