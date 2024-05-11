import React, { useEffect, useState } from "react";
import SignInForm from "../../components/SignIn/index";
import "./styles.scss";

const LoginRegisterPage = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      setWidth(windowWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="login-register-page">
      <h1>Infinity Cinema</h1>
      {width > 768 ? (
        <div className="container">
          <SignInForm />
        </div>
      ) : (
        <div className="container">
          <SignInForm />
        </div>
      )}
    </div>
  );
};

export default LoginRegisterPage;
