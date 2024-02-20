import React, { useEffect, useState } from "react";
import SignInForm from "../../components/SignIn/index";
import SignUpForm from "../../components/SignUp/index";
import "./styles.scss";

const LoginRegisterPage = () => {
  const [type, setType] = useState("signIn");
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      // Lấy chiều rộng
      const windowWidth = window.innerWidth;
      setWidth(windowWidth);
    };

    // Đăng ký event listener để lắng nghe sự kiện resize
    window.addEventListener("resize", handleResize);

    // Cleanup: Loại bỏ event listener khi component bị unmount để tránh rò rỉ bộ nhớ
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleOnClick = (text) => {
    if (text !== type) {
      setType(text);
    }
  };

  const containerClass =
    "container containerLG" + (type === "signUp" ? " right-panel-active" : "");

  return (
    <div className="login-register-page">
      <h1>Cinema</h1>
      {width > 768 ? (
        <div className={containerClass} id="container">
          {type === "signIn" ? (
            <SignInForm />
          ) : (
            <SignUpForm setType={setType} />
          )}
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>Chào mừng trở lại!</h1>
                <p>Để duy trì kết nối với chúng tôi vui lòng đăng nhập</p>
                <button
                  className="ghost custom-button"
                  id="signIn"
                  onClick={() => handleOnClick("signIn")}
                >
                  Đăng nhập
                </button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1>Chào bạn!</h1>
                <p>
                  Nhập thông tin của bạn và bắt đầu trải nghiệm với chúng tôi
                </p>
                <button
                  className="ghost custom-button"
                  id="signUp"
                  onClick={() => handleOnClick("signUp")}
                >
                  Đăng ký
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container containerMD">
          {type === "signIn" ? (
            <SignInForm setType={setType} />
          ) : (
            <SignUpForm setType={setType} />
          )}
        </div>
      )}
    </div>
  );
};

export default LoginRegisterPage;
