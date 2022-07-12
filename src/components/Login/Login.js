import React, { useState } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import "./Login.css";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ setSignedIn }) => {
  const [, setPayload] = useState();

  let navigate = useNavigate();

  // const { state: loginState } = usePostAxios(
  //   `${process.env.REACT_APP_USER_URL}/users/login`,
  //   payload
  // );

  const onFinish = (values) => {
    setPayload(values);
    navigate('/', { replace: true })
  };

  // useEffect(() => {
  //   if (loginState.status === "fetched") {
  //     console.log("fetched", loginState.data);
  //     localStorage.setItem("token", loginState.data);
  //     toast.success("You have successfully logged in!");
  //     setTimeout(() => {
  //       navigate("/", { replace: true });
  //     }, 800);
  //   } else if (loginState.status === "fetching") {
  //     console.log("fetching", loginState.data);
  //   } else if (loginState.status === "idle") {
  //     console.log("idle", loginState.data);
  //     console.log("payload", payload);
  //   } else {
  //     console.log("error", loginState.data);
  //   }
  // }, [loginState, payload]);

  return (
    <div className="login-form">
      <h2>Sign In</h2>
      <Form
        name="normal_login"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your Email!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            type="email"
            placeholder="joe@buupass.com"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <span
            className="login-form-forgot"
          >
          </span>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button login-button-effect"
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
