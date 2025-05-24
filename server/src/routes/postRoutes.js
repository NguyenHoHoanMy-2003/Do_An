// routes/postRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadImages");
const postController = require("../controllers/postController");

// Route tạo bài đăng mới
router.post("/create", upload.array("listingPhotos"), postController.createPost);

// Route lấy danh sách bài đăng (hiển thị mainpage)
router.get("/", postController.getPosts);

// Check if listing exists (new)
router.post("/check-listing", postController.checkListingExists);

module.exports = router;