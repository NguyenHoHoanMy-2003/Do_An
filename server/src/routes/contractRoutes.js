const express = require("express");
const router = express.Router();
const { getContractsForRenter } = require("../controllers/contractController");

// Route để lấy danh sách hợp đồng của một người thuê
router.get("/renter/:tenantId", getContractsForRenter);

module.exports = router; 