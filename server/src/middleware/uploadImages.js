// File: server/src/middleware/uploadImages.js
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // thư mục lưu ảnh
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // tên ảnh
  },
});

const upload = multer({ storage });

module.exports = upload;
