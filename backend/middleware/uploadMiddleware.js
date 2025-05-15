import multer from 'multer';
import { storage } from './cloudinary.js';

const upload = multer({ storage });

export default upload;
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';

// const uploadDir = path.resolve('uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename(req, file, cb) {
//     const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
//     cb(null, uniqueName);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowed = /jpg|jpeg|png/;
//   const ext = path.extname(file.originalname).toLowerCase();
//   cb(null, allowed.test(ext));
// };

// const upload = multer({ storage, fileFilter });

// export default upload;
