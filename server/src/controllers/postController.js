'use strict';
const {
  Post, Attribute, Category, Label, Overview,
  District, User, Property, Room, Image, Floor, City, SubRoom
} = require("../models");
const { v4: uuidv4 } = require("uuid");
const postService = require('../services/postService');

// Hàm tách tên phòng thành danh sách các phòng con
const parseRoomName = (name) => {
  if (!name) return [];
  name = name.trim();
  if (name.includes('-')) {
    const [start, end] = name.split('-').map(Number);
    if (!isNaN(start) && !isNaN(end) && start <= end) {
      return Array.from({ length: end - start + 1 }, (_, i) => (start + i).toString());
    }
  } else if (name.includes(',')) {
    return name.split(',').map(item => item.trim()).filter(item => item);
  } else if (name !== '') {
    return [name];
  }
  return [];
};

// ================================
// API: Tạo bài đăng mới
// ================================
exports.createPost = async (req, res) => {
  try {
    const postData = await postService.createPost(req.body, req.files);
    res.status(201).json({
      message: "Post created successfully",
      post: postData
    });
  } catch (error) {
    console.error("Create Post Error:", error);
    res.status(error.message.includes('host') ? 403 : 500).json({ 
      message: error.message || "Server error when creating post"
    });
  }
};

// ================================
// API: Lấy danh sách bài đăng
// ================================
exports.getPosts = async (req, res) => {
  try {
    const posts = await postService.getPosts();
    res.status(200).json({
      message: "Fetched posts successfully",
      posts
    });
  } catch (error) {
    console.error("Get Posts Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================================
// API: Check if listing exists
// ================================
exports.checkListingExists = async (req, res) => {
  try {
    const { buildingName, floorName, roomName } = req.body;
    const result = await postService.checkListingExists(buildingName, floorName, roomName);
    res.status(200).json(result);
  } catch (error) {
    console.error("Check Listing Error:", error);
    res.status(500).json({ message: "Server error when checking listing" });
  }
};

// ================================
// API: Cập nhật bài đăng
// ================================
exports.updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const updatedPost = await postService.updatePost(postId, req.body, req.files);
    res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost
    });
  } catch (error) {
    console.error("Update Post Error:", error);
    if (error.message.includes('tồn tại')) {
      res.status(404).json({ message: error.message });
    } else if (error.message.includes('quyền')) {
      res.status(403).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message || "Server error when updating post" });
    }
  }
};

// ================================
// API: Xóa bài đăng
// ================================
exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body; // Lấy userId từ body để kiểm tra quyền sở hữu
    const result = await postService.deletePost(postId, userId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Delete Post Error:", error);
    if (error.message.includes('tồn tại')) {
      res.status(404).json({ message: error.message });
    } else if (error.message.includes('quyền')) {
      res.status(403).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message || "Server error when deleting post" });
    }
  }
};