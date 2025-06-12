const express = require("express");
const router = express.Router();
const { 
    getContractsForRenter,
    getAllContracts,
    createContract,
    deleteContract,
    renewContract,
    approveContract,
    getContractById,
    signContract
} = require("../controllers/contractController");
const { Contract, SubRoom, Room, User, Property } = require('../models');
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');
const { verifyToken } = require('../middleware/authMiddleware');

// Cấu hình transporter cho nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

console.log("Contract Controller functions loaded in routes."); // Debug log

// Route để lấy danh sách hợp đồng của một người thuê (yêu cầu xác thực)
router.get("/renter/:tenantId", verifyToken, getContractsForRenter);

// Lấy hợp đồng theo ID (không yêu cầu xác thực cho luồng xem/ký công khai)
router.get('/:id', getContractById);

// Route để xem và ký hợp đồng (sử dụng cho link email - không yêu cầu xác thực)
router.get('/sign-contract/:id', getContractById);

// Lấy danh sách hợp đồng (yêu cầu xác thực)
router.get('/', verifyToken, getAllContracts);

// Tạo hợp đồng mới (yêu cầu xác thực)
router.post('/create', verifyToken, createContract);

// Xóa hợp đồng (yêu cầu xác thực)
router.delete('/:id', verifyToken, deleteContract);

// Gia hạn hợp đồng (yêu cầu xác thực)
router.put('/:id', verifyToken, renewContract);

// Phê duyệt hợp đồng (từ trạng thái pending - yêu cầu xác thực)
router.put('/:id/approve', verifyToken, approveContract);

// Route để ký hợp đồng (yêu cầu xác thực)
router.put('/:id/sign', verifyToken, signContract);

// Route để gửi email (yêu cầu xác thực)
router.post('/send-email', verifyToken, async (req, res) => {
    try {
        const { contract_id, tenant_id, host_id } = req.body;

        if (!contract_id || !tenant_id || !host_id) {
            return res.status(400).json({ message: 'Thiếu thông tin cần thiết' });
        }

        // Lấy thông tin hợp đồng và người thuê
        const contract = await Contract.findOne({
            where: {
                id_contract: contract_id
            },
            attributes: [
                'id_contract', 
                'subroom_id', 
                'tenant_id', 
                'start_date', 
                'end_date', 
                'status', 
                'gia_thue', 
                'signature_a', 
                'signature_b', 
                'contract_html_content', 
                'price_text', 
                'pay_date', 
                'deposit', 
                'deposit_text'
            ],
            include: [
                {
                    model: User,
                    as: 'tenant',
                    attributes: ['email', 'name']
                },
                {
                    model: SubRoom,
                    as: 'SubRoom',
                    include: [{
                        model: Room,
                        as: 'room',
                        include: [{
                            model: Property,
                            as: 'property',
                            include: [{
                                model: User,
                                as: 'host',
                                attributes: ['name', 'phone', 'email']
                            }]
                        }]
                    }]
                }
            ]
        });

        if (!contract) {
            return res.status(404).json({ message: 'Không tìm thấy hợp đồng' });
        }

        if (!contract.tenant?.email) {
            return res.status(400).json({ message: 'Người thuê chưa có email' });
        }

        // Tạo link ký hợp đồng
        const signatureLink = `${process.env.FRONTEND_URL}/contracts/sign-contract/${contract_id}`;
        console.log("Generated signatureLink:", signatureLink);

        // Gửi email cho người thuê
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: contract.tenant.email,
            subject: 'Hợp đồng thuê phòng cần ký',
            html: `
                <h2>HỢP ĐỒNG CHO THUÊ PHÒNG TRỌ</h2>
                <p>Kính gửi ${contract.tenant.name},</p>
                <p>Chúng tôi gửi đến bạn hợp đồng thuê phòng đã được ký bởi chủ trọ.</p>
                
                <h3>Thông tin hợp đồng:</h3>
                <ul>
                    <li>Địa chỉ phòng: ${contract.SubRoom?.room?.property?.street_address || 'N/A'}</li>
                    <li>Tòa nhà: ${contract.SubRoom?.room?.property?.name_bd || 'N/A'}</li>
                    <li>Phòng: ${contract.SubRoom?.name || 'N/A'}</li>
                    <li>Giá thuê: ${contract.gia_thue?.toLocaleString('vi-VN')} VNĐ/tháng</li>
                    <li>Ngày bắt đầu: ${new Date(contract.start_date).toLocaleDateString('vi-VN')}</li>
                    <li>Ngày kết thúc: ${new Date(contract.end_date).toLocaleDateString('vi-VN')}</li>
                </ul>

                <p>Vui lòng nhấp vào link sau để xem và ký hợp đồng:</p>
                <a href="${signatureLink}" style="
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #FF385C;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    margin: 20px 0;
                ">Xem và ký hợp đồng</a>

                <p>Trân trọng,</p>
                <p>Hệ thống VoyAway</p>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Email đã được gửi thành công đến:', contract.tenant.email);
            res.json({ message: 'Email đã được gửi thành công' });
        } catch (emailError) {
            console.error('Lỗi khi gửi email:', emailError);
            res.status(500).json({ message: 'Lỗi khi gửi email: ' + emailError.message });
        }
    } catch (error) {
        console.error('Lỗi khi gửi email:', error);
        res.status(500).json({ message: 'Lỗi server: ' + error.message });
    }
});

module.exports = router; 