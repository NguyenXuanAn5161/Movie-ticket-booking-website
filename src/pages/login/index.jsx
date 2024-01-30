import React, { useState } from "react";
import SignInForm from "../../components/SignIn/index";
import SignUpForm from "../../components/SignUp/index";
import "./styles.scss";

const LoginRegisterPage = () => {
  const [type, setType] = useState("signIn");

  const handleOnClick = (text) => {
    if (text !== type) {
      setType(text);
      return;
    }
  };

  const containerClass =
    "container " + (type === "signUp" ? "right-panel-active" : "");

  return (
    <div className="login-register-page">
      <h1>Cinema</h1>
      <div className={containerClass} id="container">
        {type === "signIn" ? (
          <SignInForm />
        ) : (
          <SignUpForm onSuccess={() => handleOnClick("signIn")} />
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
              <p>Nhập thông tin của bạn và bắt đầu trải nghiệm với chúng tôi</p>
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
    </div>
  );
};

export default LoginRegisterPage;
