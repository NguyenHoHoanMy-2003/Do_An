import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLogin } from '../redux/state';
import { useNavigate } from 'react-router-dom';

const SocialCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await fetch('http://localhost:5001/auth/user', {
          credentials: 'include', // Gửi cookie nếu có
        });

        const result = await response.json();
        if (response.ok) {
          dispatch(setLogin({
            user: {
              id_user: result.user?.id_user,
              name: result.user?.name,
              role: result.user?.role,
            },
            token: result.token || "", // fallback nếu không có JWT, tùy vào backend
          }));
          navigate('/');
        } else {
          console.error("Lỗi xác thực:", result.message);
          navigate('/login');
        }
      } catch (error) {
        console.error("Lỗi khi gọi API user:", error);
        navigate('/login');
      }
    };

    getUserInfo();
  }, [dispatch, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <p>Đang xác thực tài khoản xã hội...</p>
    </div>
  );
};

export default SocialCallback;