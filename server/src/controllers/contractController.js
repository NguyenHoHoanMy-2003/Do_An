const { Contract, SubRoom, Room, User, Property, Post, Attribute } = require('../models');
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// Lấy thông tin hợp đồng theo ID
const getContractById = async (req, res) => {
    try {
        const contract = await Contract.findOne({
            where: {
                id_contract: req.params.id
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
                    attributes: ['id_user', 'email', 'name', 'date_of_birth', 'national_id', 'date_of_issue', 'place_of_issue', 'permanent_address', 'phone']
                },
                {
                    model: SubRoom,
                    as: 'SubRoom',
                    include: [{
                        model: Room,
                        as: 'room',
                        include: [
                            {
                                model: Property,
                                as: 'property',
                                include: [{
                                    model: User,
                                    as: 'host',
                                    attributes: ['id_user', 'name', 'phone', 'email', 'date_of_birth', 'national_id', 'date_of_issue', 'place_of_issue', 'permanent_address']
                                }]
                            },
                            {
                                model: Post,
                                as: 'post',
                                attributes: ['attributes_id'],
                                include: [{
                                    model: Attribute,
                                    as: 'Attribute',
                                    attributes: ['price']
                                }]
                            }
                        ]
                    }]
                }
            ]
        });

        if (!contract) {
            return res.status(404).json({ message: 'Không tìm thấy hợp đồng' });
        }

        res.json({ contract });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin hợp đồng:', error);
        res.status(500).json({ 
            message: 'Lỗi server khi lấy thông tin hợp đồng',
            error: error.message 
        });
    }
};

// Lấy danh sách hợp đồng của người thuê
const getContractsForRenter = async (req, res) => {
    try {
        const { tenantId } = req.params;
        const contracts = await Contract.findAll({
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
                'deposit_text',
                'created_at'
            ],
            where: { tenant_id: tenantId },
            include: [
                {
                    model: SubRoom,
                    as: 'SubRoom',
                    include: [{
                        model: Room,
                        as: 'room',
                        attributes: ['name', 'id_room'],
                        include: [
                            {
                                model: Property,
                                as: 'property',
                                attributes: ['name_bd', 'street_address'],
                                include: [{
                                    model: User,
                                    as: 'host',
                                    attributes: ['id_user', 'name', 'email', 'phone', 'date_of_birth', 'national_id', 'date_of_issue', 'place_of_issue', 'permanent_address']
                                }]
                            },
                            {
                                model: Post,
                                as: 'post',
                                attributes: ['attributes_id'],
                                include: [{
                                    model: Attribute,
                                    as: 'Attribute',
                                    attributes: ['price']
                                }]
                            }
                        ]
                    }]
                },
                {
                    model: User,
                    as: 'tenant',
                    attributes: ['id_user', 'email', 'name', 'date_of_birth', 'national_id', 'date_of_issue', 'place_of_issue', 'permanent_address', 'phone']
                }
            ],
            order: [['created_at', 'DESC']]
        });
        res.json({ contracts });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách hợp đồng:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Lấy tất cả hợp đồng
const getAllContracts = async (req, res) => {
    try {
        const contracts = await Contract.findAll({
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
                'price_text',
                'pay_date',
                'deposit',
                'deposit_text'
            ],
            include: [
                {
                    model: SubRoom,
                    as: 'SubRoom',
                    include: [{
                        model: Room,
                        as: 'room',
                        attributes: ['name', 'id_room'],
                        include: [
                            {
                                model: Property,
                                as: 'property',
                                attributes: ['name_bd', 'street_address']
                            },
                            {
                                model: Post,
                                as: 'post',
                                attributes: ['attributes_id'],
                                include: [{
                                    model: Attribute,
                                    as: 'Attribute',
                                    attributes: ['price']
                                }]
                            }
                        ]
                    }]
                },
                {
                    model: User,
                    as: 'tenant',
                    attributes: ['name', 'phone', 'date_of_birth', 'national_id', 'date_of_issue', 'place_of_issue', 'permanent_address']
                }
            ],
            order: [['created_at', 'DESC']]
        });
        console.log("Contracts trả về FE:", contracts.map(c => c.toJSON ? c.toJSON() : c));
        res.json({ contracts });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách hợp đồng:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Tạo hợp đồng mới
const createContract = async (req, res) => {
    try {
        const { subroom_id, tenant_id, start_date, status, gia_thue } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!subroom_id || !tenant_id || !start_date) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
        }

        // Tạo hợp đồng mới
        const contract = await Contract.create({
            subroom_id,
            tenant_id,
            start_date,
            status: status || 'pending',
            gia_thue: gia_thue || 0,
            end_date: req.body.end_date,
            price_text: req.body.priceText,
            pay_date: req.body.payDate,
            deposit: req.body.deposit,
            deposit_text: req.body.depositText,
            signature_a: req.body.signatureA,
        });

        // Cập nhật trạng thái phòng
        await SubRoom.update(
            { status: 'occupied' },
            { where: { id: subroom_id } }
        );

        // Lấy lại hợp đồng với các thông tin liên quan để tạo HTML
        const createdContractWithDetails = await Contract.findOne({
            where: { id_contract: contract.id_contract },
            include: [
                {
                    model: User,
                    as: 'tenant',
                    attributes: ['id_user', 'email', 'name', 'date_of_birth', 'national_id', 'date_of_issue', 'place_of_issue', 'permanent_address', 'phone']
                },
                {
                    model: SubRoom,
                    as: 'SubRoom',
                    include: [{
                        model: Room,
                        as: 'room',
                        include: [
                            {
                                model: Property,
                                as: 'property',
                                include: [{
                                    model: User,
                                    as: 'host',
                                    attributes: ['id_user', 'name', 'phone', 'email', 'date_of_birth', 'national_id', 'date_of_issue', 'place_of_issue', 'permanent_address']
                                }]
                            },
                            {
                                model: Post,
                                as: 'post',
                                attributes: ['attributes_id'],
                                include: [{
                                    model: Attribute,
                                    as: 'Attribute',
                                    attributes: ['price']
                                }]
                            }
                        ]
                    }]
                }
            ]
        });

        // Tạo nội dung HTML và cập nhật vào hợp đồng
        if (createdContractWithDetails) {
            const htmlContent = generateContractHtmlContent(createdContractWithDetails);
            await contract.update({ contract_html_content: htmlContent });
        }

        res.status(201).json({
            message: 'Tạo hợp đồng thành công',
            contract: createdContractWithDetails || contract
        });
        console.log("Hợp đồng vừa tạo:", createdContractWithDetails || contract);
    } catch (error) {
        console.error('Lỗi khi tạo hợp đồng:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Xóa hợp đồng
const deleteContract = async (req, res) => {
    try {
        const contract = await Contract.findOne({
            where: {
                id_contract: req.params.id
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
                    model: SubRoom,
                    as: 'SubRoom',
                    include: [{
                        model: Room,
                        as: 'room',
                        attributes: ['name'],
                        include: [
                            {
                                model: Property,
                                as: 'property',
                                attributes: ['name_bd']
                            },
                            {
                                model: Post,
                                as: 'post',
                                attributes: ['attributes_id'],
                                include: [{
                                    model: Attribute,
                                    as: 'Attribute',
                                    attributes: ['price']
                                }]
                            }
                        ]
                    }]
                }
            ]
        });

        if (!contract) {
            return res.status(404).json({ message: 'Không tìm thấy hợp đồng' });
        }

        // Cập nhật trạng thái phòng về available
        await SubRoom.update(
            { status: 'available' },
            { where: { id: contract.subroom_id } }
        );

        await contract.destroy();
        res.json({ message: 'Xóa hợp đồng thành công' });
    } catch (error) {
        console.error('Lỗi khi xóa hợp đồng:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Gia hạn hợp đồng
const renewContract = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            start_date,
            end_date,
            status,
            gia_thue,
            signature_a,
            price_text,
            pay_date,
            deposit,
            deposit_text
        } = req.body;

        console.log("Renew Contract - Received req.body:", req.body);
        console.log("Renew Contract - start_date to update:", start_date);
        console.log("Renew Contract - end_date to update:", end_date);

        const contract = await Contract.findByPk(id);
        if (!contract) {
            return res.status(404).json({ message: 'Không tìm thấy hợp đồng' });
        }

        if (req.user.role !== 'host') {
            return res.status(403).json({ message: 'Chỉ chủ trọ mới có quyền gia hạn hoặc sửa đổi hợp đồng.' });
        }

        await contract.update({
            start_date: start_date || contract.start_date,
            end_date: end_date || contract.end_date,
            status: status || contract.status,
            gia_thue: gia_thue || contract.gia_thue,
            signature_a: signature_a || contract.signature_a,
            price_text: price_text || contract.price_text,
            pay_date: pay_date || contract.pay_date,
            deposit: deposit || contract.deposit,
            deposit_text: deposit_text || contract.deposit_text,
        });

        if (status === 'approved') {
            await SubRoom.update(
                { status: 'occupied' },
                { where: { id: contract.subroom_id } }
            );
        }

        res.json({
            message: 'Cập nhật hợp đồng thành công',
            contract
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật hợp đồng:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Cấu hình transporter cho nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Hàm gửi email
const sendContractEmail = async (to, contractId, signatureLink) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: 'Yêu cầu ký hợp đồng thuê phòng',
        html: `
            <h2>Xin chào,</h2>
            <p>Bạn có một hợp đồng thuê phòng cần ký.</p>
            <p>Vui lòng nhấp vào link sau để xem và ký hợp đồng:</p>
            <a href="${signatureLink}">Xem và ký hợp đồng</a>
            <p>Trân trọng,</p>
            <p>Nguyen Van A</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Lỗi khi gửi email:', error);
        return false;
    }
};

// Thêm hàm ký hợp đồng
const signContract = async (req, res) => {
    try {
        const { id } = req.params;
        const { signatureB } = req.body; // Loại bỏ status từ req.body

        // Find the contract and include related models to get landlord's email
        const contract = await Contract.findOne({
            where: { id_contract: id },
            include: [
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
                                as: 'host', // This is the landlord (Bên A)
                                attributes: ['email', 'name']
                            }]
                        }]
                    }]
                },
                {
                    model: User,
                    as: 'tenant', // This is the tenant (Bên B)
                    attributes: ['name']
                }
            ]
        });

        if (!contract) {
            return res.status(404).json({ message: 'Không tìm thấy hợp đồng' });
        }

        // Check if contract is already signed by Bên B or approved
        if (contract.status === 'signed' || contract.status === 'approved' || contract.status === 'disabled') {
            return res.status(400).json({ message: 'Hợp đồng đã được ký hoặc đã hoàn tất.' });
        }

        // Update signatureB and set status to 'signed' (by tenant)
        await contract.update({
            signature_b: signatureB,
            status: 'signed' // Đặt trạng thái là 'signed' sau khi Bên B ký
        });

        // Lấy lại hợp đồng với các thông tin liên quan để cập nhật HTML
        const updatedContractWithDetails = await Contract.findOne({
            where: { id_contract: id },
            include: [
                {
                    model: SubRoom,
                    as: 'SubRoom',
                    include: [{
                        model: Room,
                        as: 'room',
                        include: [
                            {
                                model: Property,
                                as: 'property',
                                include: [{
                                    model: User,
                                    as: 'host',
                                    attributes: ['id_user', 'name', 'phone', 'email', 'date_of_birth', 'national_id', 'date_of_issue', 'place_of_issue', 'permanent_address']
                                }]
                            },
                            {
                                model: Post,
                                as: 'post',
                                attributes: ['attributes_id'],
                                include: [{
                                    model: Attribute,
                                    as: 'Attribute',
                                    attributes: ['price']
                                }]
                            }
                        ]
                    }]
                },
                {
                    model: User,
                    as: 'tenant',
                    attributes: ['id_user', 'email', 'name', 'date_of_birth', 'national_id', 'date_of_issue', 'place_of_issue', 'permanent_address', 'phone']
                }
            ]
        });

        // Tạo nội dung HTML đã cập nhật và lưu
        if (updatedContractWithDetails) {
            const htmlContent = generateContractHtmlContent(updatedContractWithDetails);
            await updatedContractWithDetails.update({ contract_html_content: htmlContent });
        }

        // Xóa phần gửi email thông báo cho chủ trọ
        res.json({ message: 'Hợp đồng đã được ký thành công bởi người thuê và đang chờ chủ trọ phê duyệt.' });

    } catch (error) {
        console.error('Lỗi khi người thuê ký hợp đồng:', error);
        res.status(500).json({ message: 'Lỗi server khi ký hợp đồng.' });
    }
};

// Phê duyệt hợp đồng
const approveContract = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            start_date,
            end_date,
            gia_thue,
            signature_a,
            price_text,
            pay_date,
            deposit,
            deposit_text
        } = req.body;

        console.log("Approve Contract - Received req.body:", req.body);
        console.log("Approve Contract - start_date to update:", start_date);
        console.log("Approve Contract - end_date to update:", end_date);

        console.log('User from token (approveContract):', req.user);
        console.log('User role:', req.user?.role);

        if (!req.user) {
            return res.status(401).json({ message: 'Không tìm thấy thông tin người dùng' });
        }

        if (req.user.role !== 'host') {
            console.log('User role mismatch:', req.user.role);
            return res.status(403).json({
                message: 'Bạn không có quyền phê duyệt hợp đồng',
                userRole: req.user.role,
                requiredRole: 'host'
            });
        }

        const contract = await Contract.findByPk(id);
        if (!contract) {
            return res.status(404).json({ message: 'Không tìm thấy hợp đồng' });
        }

        if (contract.status !== 'signed') {
            return res.status(400).json({
                message: 'Hợp đồng không ở trạng thái chờ phê duyệt cuối cùng (chưa được người thuê ký).',
                currentStatus: contract.status
            });
        }

        await contract.update({
            start_date: start_date || contract.start_date,
            end_date: end_date || contract.end_date,
            gia_thue: gia_thue || contract.gia_thue,
            signature_a: signature_a || contract.signature_a,
            price_text: price_text || contract.price_text,
            pay_date: pay_date || contract.pay_date,
            deposit: deposit || contract.deposit,
            deposit_text: deposit_text || contract.deposit_text,
            status: 'approved'
        });

        await SubRoom.update(
            { status: 'occupied' },
            { where: { id: contract.subroom_id } }
        );

        res.json({
            message: 'Hợp đồng đã được phê duyệt thành công bởi chủ trọ',
            contract
        });
    } catch (error) {
        console.error('Lỗi khi phê duyệt hợp đồng:', error);
        res.status(500).json({
            message: 'Lỗi server khi phê duyệt hợp đồng',
            error: error.message
        });
    }
};

// Hàm helper để tạo nội dung HTML của hợp đồng
const generateContractHtmlContent = (contractData) => {
    // Đảm bảo tất cả các trường cần thiết đều có dữ liệu
    const nameA = contractData.host?.name || '...';
    const phoneA = contractData.host?.phone || '...';
    const addressA = contractData.host?.permanent_address || '...';
    const nameB = contractData.tenant?.name || '...';
    const yearB = contractData.tenant?.date_of_birth ? new Date(contractData.tenant.date_of_birth).getFullYear() : '...';
    const cccdB = contractData.tenant?.national_id || '...';
    const issueDateB = contractData.tenant?.date_of_issue ? new Date(contractData.tenant.date_of_issue).toLocaleDateString('vi-VN') : '...';
    const placeIssueB = contractData.tenant?.place_of_issue || '...';
    const addressB = contractData.tenant?.permanent_address || '...';
    const phoneB = contractData.tenant?.phone || '...';

    const roomAddress = contractData.SubRoom?.name ? 
        `Phòng: ${contractData.SubRoom.name}, Tòa nhà: ${contractData.SubRoom.room?.property?.name_bd || ''}, Địa chỉ: ${contractData.SubRoom.room?.property?.street_address || ''}`
        : '...';
    
    const rentStartDate = contractData.start_date ? new Date(contractData.start_date).toLocaleDateString('vi-VN') : '...';
    const rentEndDate = contractData.end_date ? new Date(contractData.end_date).toLocaleDateString('vi-VN') : '...';
    const price = contractData.gia_thue ? contractData.gia_thue.toLocaleString('vi-VN') : '...';
    const priceText = contractData.price_text || '...';
    const payDate = contractData.pay_date || '...';
    const deposit = contractData.deposit ? contractData.deposit.toLocaleString('vi-VN') : '...';
    const depositText = contractData.deposit_text || '...';
    const contractDate = contractData.createdAt ? new Date(contractData.createdAt).toLocaleDateString('vi-VN') : '...';

    const signatureA_img = contractData.signature_a ? `<img src="${contractData.signature_a}" alt="Chữ ký bên A" style="max-width: 150px; height: auto; display: block; margin: 10px auto; border: 1px solid #ccc;"/>` : '<div style="height: 100px; border: 1px dashed #ccc; text-align: center; line-height: 100px; color: #999;">Chữ ký bên A</div>';
    const signatureB_img = contractData.signature_b ? `<img src="${contractData.signature_b}" alt="Chữ ký bên B" style="max-width: 150px; height: auto; display: block; margin: 10px auto; border: 1px solid #ccc;"/>` : '<div style="height: 100px; border: 1px dashed #ccc; text-align: center; line-height: 100px; color: #999;">Chữ ký bên B</div>';

    return `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="text-align: center; color: #FF385C;">CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
            <h3 style="text-align: center; color: #555;">Độc Lập - Tự Do - Hạnh Phúc</h3>
            <div style="text-align: center; margin: 20px 0; color: #777;">---oOo---</div>
            <h2 style="text-align: center; color: #FF385C; margin-bottom: 30px;">HỢP ĐỒNG CHO THUÊ PHÒNG TRỌ</h2>

            <div style="border: 1px solid #eee; padding: 20px; margin-bottom: 20px; border-radius: 8px;">
                <h3 style="color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 10px; margin-bottom: 20px;">BÊN A: BÊN CHO THUÊ PHÒNG TRỌ</h3>
                <p><strong>Họ và Tên:</strong> ${nameA}</p>
                <p><strong>Số điện thoại:</strong> ${phoneA}</p>
                <p><strong>Địa chỉ liên quan:</strong> ${addressA}</p>
            </div>

            <div style="border: 1px solid #eee; padding: 20px; margin-bottom: 20px; border-radius: 8px;">
                <h3 style="color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 10px; margin-bottom: 20px;">BÊN B: BÊN THUÊ PHÒNG TRỌ</h3>
                <p><strong>Họ và Tên:</strong> ${nameB}</p>
                <p><strong>Năm sinh:</strong> ${yearB}</p>
                <p><strong>CCCD số:</strong> ${cccdB} - <strong>Ngày cấp:</strong> ${issueDateB} - <strong>Nơi cấp:</strong> ${placeIssueB}</p>
                <p><strong>Thường Trú:</strong> ${addressB}</p>
                <p><strong>Số điện thoại:</strong> ${phoneB}</p>
            </div>

            <div style="border: 1px solid #eee; padding: 20px; margin-bottom: 20px; border-radius: 8px;">
                <h3 style="color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 10px; margin-bottom: 20px;">Hai bên cùng thỏa thuận và đồng ý với nội dung sau:</h3>
                <h4>Điều 1:</h4>
                <p><strong>Địa chỉ phòng trọ:</strong> ${roomAddress}</p>
                <p><strong>Ngày bắt đầu thuê:</strong> ${rentStartDate}</p>
                <p><strong>Ngày kết thúc thuê:</strong> ${rentEndDate}</p>

                <h4>Điều 2:</h4>
                <p><strong>Giá tiền thuê phòng (đồng/tháng):</strong> ${price} VNĐ</p>
                <p><strong>Bằng chữ:</strong> ${priceText}</p>
                <p><strong>Ngày thanh toán hàng tháng:</strong> ${payDate}</p>
                <p><strong>Tiền thế chân (số tiền):</strong> ${deposit} VNĐ</p>
                <p><strong>Tiền thế chân (bằng chữ):</strong> ${depositText}</p>

                <h4>Điều 3: Trách nhiệm bên A</h4>
                <ul>
                    <li>Giao phòng trọ, trang thiết bị trong phòng trọ cho bên B đúng ngày ký hợp đồng.</li>
                    <li>Hướng dẫn bên B chấp hành đúng các quy định của địa phương, hoàn tất mọi thủ tục giấy tờ đăng ký tạm trú cho bên B.</li>
                </ul>

                <h4>Điều 4: Trách nhiệm bên B</h4>
                <ul>
                    <li>Trả tiền thuê phòng trọ hàng tháng theo hợp đồng.</li>
                    <li>Sử dụng đúng mục đích thuê nhà, khi cần sửa chữa, cải tạo theo yêu cầu sử dụng riêng phải được sự đồng ý của bên A.</li>
                    <li>Đồ đạt trang thiết bị trong phòng trọ phải có trách nhiệm bảo quản cẩn thận không làm hư hỏng mất mát.</li>
                </ul>

                <h4>Điều 5: Điều khoản chung</h4>
                <ul>
                    <li>Bên A và bên B thực hiện đúng các điều khoản ghi trong hợp đồng.</li>
                    <li>Trường hợp có tranh chấp hoặc một bên vi phạm hợp đồng thì hai bên cùng nhau bàn bạc giải quyết, nếu không giải quyết được thì yêu cầu cơ quan có thẩm quyền giải quyết.</li>
                    <li>Hợp đồng được lập thành 02 bản có giá trị ngang nhau, mỗi bên giữ 01 bản.</li>
                </ul>

                <p style="text-align: right; font-style: italic; margin-top: 30px;">Đà Nẵng, ngày ${contractDate}</p>
            </div>

            <div style="display: flex; justify-content: space-around; text-align: center; margin-top: 50px;">
                <div style="flex: 1;">
                    <p style="font-weight: bold;">BÊN A</p>
                    ${signatureA_img}
                </div>
                <div style="flex: 1;">
                    <p style="font-weight: bold;">BÊN B</p>
                    ${signatureB_img}
                </div>
            </div>
        </div>
    `;
};

module.exports = {
    getContractsForRenter,
    getAllContracts,
    createContract,
    deleteContract,
    renewContract,
    approveContract,
    getContractById,
    signContract,
    generateContractHtmlContent
}; 