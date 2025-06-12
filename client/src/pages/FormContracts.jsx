import React, { useState, useEffect } from 'react';
import "../styles/FormContracts.scss";
import Navbar from "../components/Navbar";
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function FormContracts({ contractDataForForm, isSigningFlow, isReadOnlyView }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Lấy thông tin user từ Redux store ở cấp component
  const currentUser = useSelector(state => state.user.user);
  const token = useSelector(state => state.user.token) || localStorage.getItem('token');

  // Helper function to safely format dates for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : "";
  };

  // Helper function to safely get year
  const getYearSafely = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return !isNaN(date.getTime()) ? date.getFullYear().toString() : "";
  };

  // Ensure initialContractData is always an object, prioritizing contractDataForForm
  const initialContractData = contractDataForForm || location.state?.contractData || {};

  // Safely access nested properties for initial state
  const initialTenantData = initialContractData.tenant || {};
  const initialSubRoomData = initialContractData.SubRoom || {};
  const initialRoomData = initialSubRoomData.room || {};
  const initialPropertyData = initialRoomData.property || {};
  const initialPostData = initialRoomData.post || {};
  const initialAttributeData = initialPostData.Attribute || {};

  const [formData, setFormData] = useState(() => {
    console.log("Initial Contract Data for FormContracts:", initialContractData);
    console.log("Initial Tenant Data for FormContracts:", initialTenantData);
    console.log("Initial SubRoom Data for FormContracts:", initialSubRoomData);
    console.log("Initial Room Data for FormContracts:", initialRoomData);
    console.log("Initial Property Data for FormContracts:", initialPropertyData);
    console.log("Initial Host Data for FormContracts (Bên A):", initialPropertyData.host);
    console.log("Initial Host Data JSON (Bên A):", JSON.stringify(initialPropertyData.host, null, 2));

    // Log specific date fields before processing
    console.log("Initial date_of_birth (B):", initialTenantData.date_of_birth);
    console.log("Initial date_of_issue (B):", initialTenantData.date_of_issue);
    console.log("Initial start_date (contract):", initialContractData.start_date);
    console.log("Initial end_date (contract):", initialContractData.end_date);
    console.log("Initial created_at (contract):", initialContractData.created_at);

    const initialHostData = initialPropertyData.host || {};

    return {
    nameA: initialHostData.name || "",
    yearA: getYearSafely(initialHostData.date_of_birth),
    cccdA: initialHostData.national_id || "",
    issueDateA: formatDateForInput(initialHostData.date_of_issue),
    placeIssueA: initialHostData.place_of_issue || "",
    addressA: initialHostData.permanent_address || "",
    phoneA: initialHostData.phone || "",
    nameB: initialTenantData.name || "",
    yearB: getYearSafely(initialTenantData.date_of_birth),
    cccdB: initialTenantData.national_id || "",
    issueDateB: formatDateForInput(initialTenantData.date_of_issue),
    placeIssueB: initialTenantData.place_of_issue || "",
    addressB: initialTenantData.permanent_address || "",
    phoneB: initialTenantData.phone || "",
    roomAddress: `Phòng: ${initialSubRoomData.name || ''}, Tòa nhà: ${initialPropertyData.name_bd || ''}, Địa chỉ: ${initialPropertyData.street_address || ''}`,
    rentStartDate: formatDateForInput(initialContractData.start_date),
    rentEndDate: formatDateForInput(initialContractData.end_date),
    price: initialContractData.gia_thue || initialAttributeData.price || "", // Use gia_thue from contract if available
    priceText: initialContractData.price_text || "",
    payDate: initialContractData.pay_date || "",
    deposit: initialContractData.deposit || "",
    depositText: initialContractData.deposit_text || "",
    contractDate: formatDateForInput(initialContractData.created_at) || formatDateForInput(new Date()),
    signatureA: initialContractData.signature_a || null,
    signatureB: initialContractData.signature_b || null
  };
  });

  const [agreeA, setAgreeA] = useState(false);
  const [agreeB, setAgreeB] = useState(false);

  const isContractLockedForEditing = initialContractData.id_contract && (initialContractData.status === 'approved' || initialContractData.status === 'cancelled' || initialContractData.status === 'terminated');

  // Debug logs to verify props and initial data
  console.log("FormContracts: isSigningFlow prop =", isSigningFlow);
  console.log("FormContracts: initialContractData.status =", initialContractData.status);

  // useEffect to fetch current user's data for Bên A (only if not in signing flow and not read-only view)
  useEffect(() => {
    // Không cần fetch lại nếu là signing flow HOẶC là chế độ xem chỉ đọc
    if (!isSigningFlow && !isReadOnlyView && currentUser) { 
      const fetchPartyAData = async () => {
        try {
          const response = await fetch(`http://localhost:5001/users/${currentUser.id_user}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          let partyAData = null;
          if (data && data.user) {
            partyAData = data.user;
          } else if (data && data.id_user) {
            partyAData = data;
          }

          if (!partyAData || !partyAData.id_user) {
            console.error("Không nhận được dữ liệu người dùng hợp lệ từ API cho Bên A.");
            alert("Không thể tải thông tin người dùng cho Bên A. Vui lòng thử lại sau.");
            return;
          }
          console.log("Party A Data (date_of_birth):", partyAData.date_of_birth);
          console.log("Party A Data (date_of_issue):", partyAData.date_of_issue);

          setFormData(prev => ({
            ...prev,
            nameA: partyAData.name || "",
            yearA: getYearSafely(partyAData.date_of_birth),
            cccdA: partyAData.national_id || "",
            issueDateA: formatDateForInput(partyAData.date_of_issue),
            placeIssueA: partyAData.place_of_issue || "",
            addressA: partyAData.permanent_address || "",
            phoneA: partyAData.phone || "",
          }));
        } catch (error) {
          console.error("Lỗi chi tiết khi tải thông tin Bên A:", error);
          alert("Không thể tải thông tin người dùng. Vui lòng thử lại sau.");
        }
      };
      fetchPartyAData();
    }
  }, [currentUser, isSigningFlow, isReadOnlyView]);

  // useEffect to populate contract details when contractDataForForm changes or initialContractData is set
  useEffect(() => {
    if (initialContractData.id_contract || contractDataForForm) {
      const contractToLoad = contractDataForForm || initialContractData;
      console.log("FormContracts - contractToLoad:", contractToLoad);
      console.log("FormContracts - contractToLoad JSON:", JSON.stringify(contractToLoad, null, 2));

      // Safely access nested properties from contractToLoad
      const fetchedTenantData = contractToLoad.tenant || {};
      const fetchedSubRoomData = contractToLoad.SubRoom || {};
      const fetchedRoomData = fetchedSubRoomData.room || {};
      const fetchedPropertyData = fetchedRoomData.property || {};
      const fetchedPostData = fetchedRoomData.post || {};
      const fetchedAttributeData = fetchedPostData.Attribute || {};

      // Log the fetched host data explicitly
      console.log("Fetched Host Data (Bên A):", fetchedPropertyData.host);
      console.log("Fetched Host Data JSON (Bên A):", JSON.stringify(fetchedPropertyData.host, null, 2));

      console.log("Fetched Tenant Data (date_of_birth):", fetchedTenantData.date_of_birth);
      console.log("Fetched Tenant Data (date_of_issue):", fetchedTenantData.date_of_issue);
      console.log("Contract To Load (start_date):", contractToLoad.start_date);
      console.log("Contract To Load (end_date):", contractToLoad.end_date);
      console.log("Contract To Load (created_at):", contractToLoad.created_at);

      setFormData(prev => ({
        ...prev,
        // Populate Bên B from fetchedTenantData
        nameB: fetchedTenantData.name || "",
        yearB: getYearSafely(fetchedTenantData.date_of_birth),
        cccdB: fetchedTenantData.national_id || "",
        issueDateB: formatDateForInput(fetchedTenantData.date_of_issue),
        placeIssueB: fetchedTenantData.place_of_issue || "",
        addressB: fetchedTenantData.permanent_address || "",
        phoneB: fetchedTenantData.phone || "",
        roomAddress: `Phòng: ${fetchedSubRoomData.name || ''}, Tòa nhà: ${fetchedPropertyData.name_bd || ''}, Địa chỉ: ${fetchedPropertyData.street_address || ''}`,
        rentStartDate: formatDateForInput(contractToLoad.start_date),
        rentEndDate: formatDateForInput(contractToLoad.end_date),
        price: contractToLoad.gia_thue || fetchedAttributeData.price || "",
        priceText: contractToLoad.price_text || "",
        payDate: contractToLoad.pay_date || "",
        deposit: contractToLoad.deposit || "",
        depositText: contractToLoad.deposit_text || "",
        contractDate: formatDateForInput(contractToLoad.created_at) || formatDateForInput(new Date()),
        signatureA: contractToLoad.signature_a || null,
        signatureB: contractToLoad.signature_b || null
      }));
      setAgreeA(!!contractToLoad.signature_a); // Set agreeA if signatureA exists
      setAgreeB(!!contractToLoad.signature_b); // Set agreeB if signatureB exists
    }
  }, [initialContractData, contractDataForForm]); // Depend on both for re-evaluation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, signatureType) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1500;
          const MAX_HEIGHT = 1500;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressedImage = canvas.toDataURL('image/jpeg', 0.5);
          setFormData(prev => ({
            ...prev,
            [signatureType]: compressedImage
          }));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit được gọi!");
    
    // Logic for Bên B signing (triggered by isSigningFlow prop)
    if (isSigningFlow && initialContractData.id_contract) {
      if (!agreeB) {
        alert("Vui lòng xác nhận đồng ý điều khoản cho bên B!");
        return;
      }

      if (!formData.signatureB) {
        alert("Vui lòng tải lên chữ ký của bên B!");
        return;
      }

      // Thêm kiểm tra token cho người thuê
      if (!token) {
        alert("Bạn cần đăng nhập để ký hợp đồng.");
        navigate('/login'); // Điều hướng đến trang đăng nhập nếu không có token
        return;
      }

      console.log("Token being sent for tenant signing:", token);

      try {
        const response = await fetch(`http://localhost:5001/contracts/${initialContractData.id_contract}/sign`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Thêm token vào header
          },
          body: JSON.stringify({
            signatureB: formData.signatureB,
            status: 'signed'
          }),
        });

        if (response.ok) {
          alert("Hợp đồng đã được ký thành công bởi bạn! Hợp đồng đang chờ chủ trọ phê duyệt cuối cùng.");
          navigate('/my-contracts');
        } else {
          const errorData = await response.json();
          alert(`Lỗi khi ký hợp đồng: ${errorData.message || response.statusText}`);
        }
      } catch (error) {
        console.error("Lỗi khi ký hợp đồng:", error);
        alert("Đã xảy ra lỗi khi ký hợp đồng.");
      }
      return;
    }

    // Nếu là bên A đang cập nhật hợp đồng
    else if (initialContractData.id_contract) {
      if (!agreeA) {
        alert("Vui lòng xác nhận đồng ý điều khoản cho bên A!");
        return;
      }

      if (!formData.signatureA) {
        alert("Vui lòng tải lên chữ ký của bên A!");
        return;
      }

      if (!token) {
        alert("Bạn cần đăng nhập để cập nhật hợp đồng.");
        navigate('/login');
        return;
      }

      // Log thông tin user và token để debug
      console.log("Current user from Redux:", currentUser);
      console.log("Token being used:", token);

      // Determine the API endpoint and status based on current contract status
      let apiEndpoint;
      let newStatus;

      if (initialContractData.status === 'signed') {
        // If contract is signed by tenant, host is now approving
        apiEndpoint = `http://localhost:5001/contracts/${initialContractData.id_contract}/approve`;
        newStatus = 'approved';
      } else {
        // If contract is new or pending, host is sending/updating it
        apiEndpoint = `http://localhost:5001/contracts/${initialContractData.id_contract}`;
        newStatus = 'pending';
      }

      try {
        const response = await fetch(apiEndpoint, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            ...formData,
            gia_thue: parseFloat(formData.price),
            signature_a: formData.signatureA,
            status: newStatus, // Use determined newStatus
            start_date: formData.rentStartDate, // Explicitly send start_date
            end_date: formData.rentEndDate
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error response:", errorData);
          alert(`Lỗi khi cập nhật hợp đồng: ${errorData.message || response.statusText}`);
          return;
        }

        // Gửi email cho người thuê chỉ khi hợp đồng được gửi lần đầu (trạng thái pending)
        if (newStatus === 'pending') {
          try {
            console.log("Sending email with contract_id (update flow):", initialContractData.id_contract);
            const emailResponse = await fetch("http://localhost:5001/contracts/send-email", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Thêm token vào header
              },
              body: JSON.stringify({
                contract_id: initialContractData.id_contract,
                tenant_id: initialContractData.tenant_id,
                host_id: currentUser.id_user
              }),
            });
  
            if (emailResponse.ok) {
              alert("Hợp đồng đã được gửi thành công! Email đã được gửi cho người thuê. Vui lòng chờ người thuê ký hợp đồng.");
              navigate('/contracts');
            } else {
              const emailErrorData = await emailResponse.json();
              console.error("Email error:", emailErrorData);
              alert(`Hợp đồng đã được cập nhật nhưng không thể gửi email: ${emailErrorData.message || 'Lỗi không xác định'}`);
            }
          } catch (error) {
            console.error("Lỗi khi gửi email:", error);
            alert("Hợp đồng đã được cập nhật nhưng không thể gửi email. Vui lòng thử lại sau.");
          }
        } else if (newStatus === 'approved') {
          alert("Hợp đồng đã được phê duyệt thành công!");
          navigate('/contracts');
        }

      } catch (error) {
        console.error("Lỗi khi cập nhật hợp đồng:", error);
        alert("Đã xảy ra lỗi khi cập nhật hợp đồng.");
      }
    }
  };

  return (
    <div>
      {/* Navbar should only be here if not in signing flow */}
      {!isSigningFlow && <Navbar />}
      <div className="contract-form">
        <h2>CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
        <h3>Độc Lập - Tự Do - Hạnh Phúc</h3>
        <div className="divider">---oOo---</div>
        <h2>HỢP ĐỒNG CHO THUÊ PHÒNG TRỌ</h2>

        <form onSubmit={handleSubmit}>
          <div className="section">
            <h3>BÊN A: BÊN CHO THUÊ PHÒNG TRỌ</h3>
            <div className="form-group">
              <label>Họ và Tên:</label>
              <input type="text" name="nameA" value={formData.nameA} onChange={handleChange} required disabled={isContractLockedForEditing || isSigningFlow || isReadOnlyView} />
            </div>
            <div className="form-group">
              <label>Năm sinh:</label>
              <input type="text" name="yearA" value={formData.yearA} onChange={handleChange} required disabled={isContractLockedForEditing || isSigningFlow || isReadOnlyView} />
            </div>
            <div className="form-group row">
              <div className="col">
                <label>CCCD số:</label>
                <input type="text" name="cccdA" value={formData.cccdA} onChange={handleChange} required disabled={isContractLockedForEditing || isSigningFlow || isReadOnlyView} />
              </div>
              <div className="col">
                <label>Ngày cấp:</label>
                <input type="date" name="issueDateA" value={formData.issueDateA} onChange={handleChange} required disabled={isContractLockedForEditing || isSigningFlow || isReadOnlyView} />
              </div>
              <div className="col">
                <label>Nơi cấp:</label>
                <input type="text" name="placeIssueA" value={formData.placeIssueA} onChange={handleChange} required disabled={isContractLockedForEditing || isSigningFlow || isReadOnlyView} />
              </div>
            </div>
            <div className="form-group">
              <label>Thường Trú:</label>
              <input type="text" name="addressA" value={formData.addressA} onChange={handleChange} required disabled={isContractLockedForEditing || isSigningFlow || isReadOnlyView} />
            </div>
            <div className="form-group">
              <label>Số điện thoại:</label>
              <input type="text" name="phoneA" value={formData.phoneA} onChange={handleChange} required disabled={isContractLockedForEditing || isSigningFlow || isReadOnlyView} />
            </div>
          </div>

          <div className="section">
            <h3>BÊN B: BÊN THUÊ PHÒNG TRỌ</h3>
            <div className="form-group">
              <label>Họ và Tên:</label>
              <input type="text" name="nameB" value={formData.nameB} onChange={handleChange} required disabled={isContractLockedForEditing || !isSigningFlow || isReadOnlyView} />
            </div>
            <div className="form-group">
              <label>Năm sinh:</label>
              <input type="text" name="yearB" value={formData.yearB} onChange={handleChange} required disabled={isContractLockedForEditing || !isSigningFlow || isReadOnlyView} />
            </div>
            <div className="form-group row">
              <div className="col">
                <label>CCCD số:</label>
                <input type="text" name="cccdB" value={formData.cccdB} onChange={handleChange} required disabled={isContractLockedForEditing || !isSigningFlow || isReadOnlyView} />
              </div>
              <div className="col">
                <label>Ngày cấp:</label>
                <input type="date" name="issueDateB" value={formData.issueDateB} onChange={handleChange} required disabled={isContractLockedForEditing || !isSigningFlow || isReadOnlyView} />
              </div>
              <div className="col">
                <label>Nơi cấp:</label>
                <input type="text" name="placeIssueB" value={formData.placeIssueB} onChange={handleChange} required disabled={isContractLockedForEditing || !isSigningFlow || isReadOnlyView} />
              </div>
            </div>
            <div className="form-group">
              <label>Thường Trú:</label>
              <input type="text" name="addressB" value={formData.addressB} onChange={handleChange} required disabled={isContractLockedForEditing || !isSigningFlow || isReadOnlyView} />
            </div>
            <div className="form-group">
              <label>Số điện thoại:</label>
              <input type="text" name="phoneB" value={formData.phoneB} onChange={handleChange} required disabled={isContractLockedForEditing || !isSigningFlow || isReadOnlyView} />
            </div>
          </div>

          <div className="section">
            <h3>Hai bên cùng thỏa thuận và đồng ý với nội dung sau:</h3>
            
            <div className="clause">
              <h4>Điều 1:</h4>
              <div className="form-group">
                <label>Địa chỉ phòng trọ:</label>
                <input type="text" name="roomAddress" value={formData.roomAddress} onChange={handleChange} required disabled={isContractLockedForEditing || (isSigningFlow && initialContractData.status !== 'pending') || isReadOnlyView} />
              </div>
              <div className="form-group">
                <label>Ngày bắt đầu thuê:</label>
                <input type="date" name="rentStartDate" value={formData.rentStartDate} onChange={handleChange} required disabled={isContractLockedForEditing || (isSigningFlow && initialContractData.status !== 'pending') || isReadOnlyView} />
              </div>
              <div className="form-group">
                <label>Ngày kết thúc thuê:</label>
                <input type="date" name="rentEndDate" value={formData.rentEndDate} onChange={handleChange} disabled={isContractLockedForEditing || (isSigningFlow && initialContractData.status !== 'pending') || isReadOnlyView} />
              </div>
            </div>

            <div className="clause">
              <h4>Điều 2:</h4>
              <div className="form-group">
                <label>Giá tiền thuê phòng (đồng/tháng):</label>
                <input type="text" name="price" value={formData.price} onChange={handleChange} required disabled={isContractLockedForEditing || (isSigningFlow && initialContractData.status !== 'pending') || isReadOnlyView} />
              </div>
              <div className="form-group">
                <label>Bằng chữ:</label>
                <input type="text" name="priceText" value={formData.priceText} onChange={handleChange} required disabled={isContractLockedForEditing || (isSigningFlow && initialContractData.status !== 'pending') || isReadOnlyView} />
              </div>
              <div className="form-group">
                <label>Ngày thanh toán hàng tháng:</label>
                <input type="text" name="payDate" value={formData.payDate} onChange={handleChange} required disabled={isContractLockedForEditing || (isSigningFlow && initialContractData.status !== 'pending') || isReadOnlyView} />
              </div>
              <div className="form-group">
                <label>Tiền thế chân (số tiền):</label>
                <input type="text" name="deposit" value={formData.deposit} onChange={handleChange} required disabled={isContractLockedForEditing || (isSigningFlow && initialContractData.status !== 'pending') || isReadOnlyView} />
              </div>
              <div className="form-group">
                <label>Tiền thế chân (bằng chữ):</label>
                <input type="text" name="depositText" value={formData.depositText} onChange={handleChange} required disabled={isContractLockedForEditing || (isSigningFlow && initialContractData.status !== 'pending') || isReadOnlyView} />
              </div>
            </div>

            <div className="clause">
              <h4>Điều 3: Trách nhiệm bên A</h4>
              <ul>
                <li>Giao phòng trọ, trang thiết bị trong phòng trọ cho bên B đúng ngày ký hợp đồng.</li>
                <li>Hướng dẫn bên B chấp hành đúng các quy định của địa phương, hoàn tất mọi thủ tục giấy tờ đăng ký tạm trú cho bên B.</li>
              </ul>
            </div>

            <div className="clause">
              <h4>Điều 4: Trách nhiệm bên B</h4>
              <ul>
                <li>Trả tiền thuê phòng trọ hàng tháng theo hợp đồng.</li>
                <li>Sử dụng đúng mục đích thuê nhà, khi cần sửa chữa, cải tạo theo yêu cầu sử dụng riêng phải được sự đồng ý của bên A.</li>
                <li>Đồ đạt trang thiết bị trong phòng trọ phải có trách nhiệm bảo quản cẩn thận không làm hư hỏng mất mát.</li>
              </ul>
            </div>

            <div className="clause">
              <h4>Điều 5: Điều khoản chung</h4>
              <ul>
                <li>Bên A và bên B thực hiện đúng các điều khoản ghi trong hợp đồng.</li>
                <li>Trường hợp có tranh chấp hoặc một bên vi phạm hợp đồng thì hai bên cùng nhau bàn bạc giải quyết, nếu không giải quyết được thì yêu cầu cơ quan có thẩm quyền giải quyết.</li>
                <li>Hợp đồng được lập thành 02 bản có giá trị ngang nhau, mỗi bên giữ 01 bản.</li>
              </ul>
            </div>

            <div className="contract-date-row">
              <em>
                {(() => {
                  if (!formData.contractDate) return 'Đà Nẵng, ngày ... tháng ... năm 20...';
                  const d = new Date(formData.contractDate);
                  if (isNaN(d.getTime())) return 'Đà Nẵng, ngày ... tháng ... năm 20...';
                  return `Đà Nẵng, ngày ${d.getDate()} tháng ${d.getMonth() + 1} năm ${d.getFullYear()}`;
                })()}
              </em>
              <input
                type="date"
                name="contractDate"
                value={formData.contractDate}
                onChange={handleChange}
                disabled={isContractLockedForEditing || (isSigningFlow && initialContractData.status !== 'pending') || isReadOnlyView}
              />
            </div>
          </div>

          <div className="terms-confirm-row">
            {!isSigningFlow && (
              <div className="terms-col">
                <div className="terms-desc">
                  Bằng cách nhấp chuột vào nút "ĐỒNG Ý", Khách hàng xác nhận rằng mình đã đọc, hiểu và đồng ý với toàn bộ các điều kiện và điều khoản áp dụng của VoyAway. Vui lòng đọc kỹ trước khi tiếp tục sử dụng dịch vụ.
                </div>
                <label>
                  <input type="checkbox" checked={agreeA} onChange={e => setAgreeA(e.target.checked)} disabled={isContractLockedForEditing || (initialContractData.id_contract && initialContractData.status === 'signed') || isReadOnlyView} />
                  Tôi đã đọc và đồng ý với các điều khoản (Bên A)
                </label>
              </div>
            )}
            <div className="terms-col">
              <div className="terms-desc">
                Bằng cách nhấp chuột vào nút "ĐỒNG Ý", tôi xác nhận rằng mình đã đọc, hiểu và đồng ý với toàn bộ các điều kiện và điều khoản trong hợp đồng này. Tôi cam kết sẽ tuân thủ đầy đủ các quy định và trách nhiệm được nêu trong hợp đồng.
              </div>
              <label>
                <input type="checkbox" checked={agreeB} onChange={e => setAgreeB(e.target.checked)} disabled={isContractLockedForEditing || (isSigningFlow && initialContractData.status === 'signed') || (!isSigningFlow) || isReadOnlyView} />
                Tôi đã đọc và đồng ý với các điều khoản trong hợp đồng
              </label>
            </div>
          </div>

          <div className="signatures">
            {!isSigningFlow && (
              <div className="signature-block">
                <div>BÊN A</div>
                <div className="signature-container" onClick={() => !(isContractLockedForEditing || (initialContractData.id_contract && initialContractData.status === 'signed') || isReadOnlyView) && document.getElementById('fileA').click()}>
                  {formData.signatureA ? (
                    <img src={formData.signatureA} alt="Chữ ký bên A" className="signature-image" />
                  ) : (
                    <span>Chọn ảnh chữ ký bên A</span>
                  )}
                </div>
                <input
                  type="file"
                  id="fileA"
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'signatureA')}
                  disabled={isContractLockedForEditing || (initialContractData.id_contract && initialContractData.status === 'signed') || isReadOnlyView}
                />
              </div>
            )}
            <div className="signature-block">
              <div>BÊN B</div>
              <div className="signature-container" onClick={() => !(isContractLockedForEditing || (isSigningFlow && initialContractData.status === 'signed') || (!isSigningFlow) || isReadOnlyView) && document.getElementById('fileB').click()}>
                {formData.signatureB ? (
                  <img src={formData.signatureB} alt="Chữ ký bên B" className="signature-image" />
                ) : (
                  <span>Chọn ảnh chữ ký bên B</span>
                )}
              </div>
              <input
                type="file"
                id="fileB"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'signatureB')}
                disabled={isContractLockedForEditing || (isSigningFlow && initialContractData.status === 'signed') || (!isSigningFlow) || isReadOnlyView}
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={isReadOnlyView || isContractLockedForEditing || (isSigningFlow && (initialContractData.id_contract && (initialContractData.status === 'signed' || initialContractData.status === 'approved'))) || (!isSigningFlow && (initialContractData.id_contract && (initialContractData.status === 'approved' || initialContractData.status === 'cancelled' || initialContractData.status === 'terminated')))}>
            {isReadOnlyView ? "Xem Hợp Đồng" : (isSigningFlow ? 
                (initialContractData.id_contract && (initialContractData.status === 'signed' || initialContractData.status === 'approved') ? "Đã Ký" : "Ký Hợp Đồng") 
                : 
                (initialContractData.id_contract ? 
                  (initialContractData.status === 'approved' ? "Đã Hoàn Thành" : 
                   initialContractData.status === 'pending' ? "Gửi Hợp Đồng" : 
                   initialContractData.status === 'signed' ? "Phê Duyệt Hợp Đồng" : 
                   initialContractData.status === 'cancelled' ? "Đã Hủy" : 
                   initialContractData.status === 'terminated' ? "Đã Kết Thúc" : "Cập nhật Hợp Đồng") 
                  : "Gửi Hợp Đồng")
            )}
          </button>
          {isSigningFlow && initialContractData.id_contract && initialContractData.status === 'signed' && <p style={{textAlign: 'center', marginTop: '10px', color: 'green'}}>Hợp đồng đã được bạn ký và đang chờ chủ trọ phê duyệt cuối cùng.</p>}
          {isSigningFlow && initialContractData.id_contract && initialContractData.status === 'approved' && <p style={{textAlign: 'center', marginTop: '10px', color: 'green'}}>Hợp đồng đã được phê duyệt và có hiệu lực.</p>}
          {!isSigningFlow && initialContractData.id_contract && initialContractData.status === 'approved' && <p style={{textAlign: 'center', marginTop: '10px', color: 'green'}}>Hợp đồng này đã được phê duyệt và có hiệu lực.</p>}
          {!isSigningFlow && initialContractData.id_contract && initialContractData.status === 'pending' && <p style={{textAlign: 'center', marginTop: '10px', color: 'orange'}}>Hợp đồng này đang chờ người thuê ký.</p>}
          {!isSigningFlow && initialContractData.id_contract && initialContractData.status === 'signed' && <p style={{textAlign: 'center', marginTop: '10px', color: 'blue'}}>Hợp đồng này đã được người thuê ký, đang chờ chủ trọ phê duyệt.</p>}
          {!isSigningFlow && initialContractData.id_contract && initialContractData.status === 'cancelled' && <p style={{textAlign: 'center', marginTop: '10px', color: 'red'}}>Hợp đồng này đã bị hủy.</p>}
          {!isSigningFlow && initialContractData.id_contract && initialContractData.status === 'terminated' && <p style={{textAlign: 'center', marginTop: '10px', color: 'gray'}}>Hợp đồng này đã kết thúc.</p>}
        </form>
      </div>
    </div>
  );
}

export default FormContracts;