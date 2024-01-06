/* eslint-disable react/jsx-no-comment-textnodes */
import { useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { login } from "../../services/auth.service";

import InputGroup from "react-bootstrap/InputGroup";
import { Form } from "react-bootstrap";
import {
  Eye,
  EyeSlashFill,
  HouseExclamation,
  Key,
} from "react-bootstrap-icons";

const Login = () => {
  let navigate: NavigateFunction = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const initialValues: {
    username: string;
    password: string;
  } = {
    username: "",
    password: "",
  };

  const [showPass, setShowPass] = useState(false);
  const clickHandler = () => {
    setShowPass((prev) => !prev);
  };
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("This field is required!"),
    password: Yup.string().required("This field is required!"),
  });

  const handleLogin = (formValue: { username: string; password: string }) => {
    const { username, password } = formValue;

    setMessage("");
    setLoading(true);

    login(username, password).then(
      () => {
        navigate("/profile");
        window.location.reload();
      },
      (error: {
        response: { data: { message: any } };
        message: any;
        toString: () => any;
      }) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setLoading(false);
        setMessage(resMessage);
      }
    );
  };

  return (
    <div className="col-md-12">
      <div className="card card-container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />

        {/* 
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          <Form>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <Field name="username" type="text" className="form-control" />
              <ErrorMessage
                name="username"
                component="div"
                className="alert alert-danger"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Field
                name="password"
                type={"password"}
                className="form-control"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="alert alert-danger"
              />
            </div>

            <div className="form-group">
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Login</span>
              </button>
            </div>

            {message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
            )}
          </Form>
        </Formik> */}
        <>
          <InputGroup className="mb-3">
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
              <Form.Control
                placeholder="Username"
                aria-label="Username"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
          </InputGroup>
          <InputGroup>
            <InputGroup.Text id="password-input">
              <Key />
            </InputGroup.Text>
            <Form.Control
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Password"
              aria-label="password"
              aria-describedby="password-input"
              required
            />
            <InputGroup.Text onClick={clickHandler}>
              {/* You can use both. I ran into some width issues with FontAwesome but they can be fixed by playing around */}
              {/* <FontAwesomeIcon icon={showPass ? faEyeSlash : faEye} /> */}
              {showPass ? <EyeSlashFill /> : <Eye />}
            </InputGroup.Text>
          </InputGroup>
        </>
      </div>
    </div>
  );
};

export default Login;
