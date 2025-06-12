// routes/postRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadImages");
const postController = require("../controllers/postController");
const { verifyToken, isHost } = require("../middleware/authMiddleware");

// Public routes
router.get("/", postController.getPosts);

// Protected routes
router.post("/check-listing", verifyToken, postController.checkListingExists);
router.post("/create", [verifyToken, isHost, upload.array("listingPhotos")], postController.createPost);
router.put("/:postId", [verifyToken, isHost, upload.array("listingPhotos")], postController.updatePost);
router.delete("/:postId", [verifyToken, isHost], postController.deletePost);

module.exports = router;