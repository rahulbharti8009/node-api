const express = require('express')
const { userCreate, getLogin, getTest } = require('../controller/user.controller')
const multer  = require('multer')
const path = require('path');

const router = express.Router()// storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads'); // relative path without slash
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
  });
  // Image file filter
const imageFileFilter = function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
  
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
  };
  const upload = multer({   storage: storage,
    fileFilter: imageFileFilter });

router.post('/signup', userCreate)
router.post('/login',getLogin)
router.get('/test',getTest)

router.post('/upload', (req, res) => {
    upload.single('profile')(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // Multer-specific errors
        return res.status(400).json({ message: err.message });
      } else if (err) {
        // Other errors (e.g., from fileFilter)
        return res.status(400).json({ message: err.message });
      }
  
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded or invalid file type' });
      }
  
      res.status(200).json({ message: 'Image uploaded successfully', file: req.file });
    });
  });





module.exports = router