import React, { Component } from "react";
import {
  Button,
  Form,
  Grid,
  Message,
  Segment,
  Divider,
  Icon
} from "semantic-ui-react";

import axios from "axios";

const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const MessageExampleList = errors => (
  <Message error>
    <Message.Header>Errors</Message.Header>
    <Message.List>
      {errors.map((error, index) => (
        <Message.Item key={index}>{Object.values(error)[0]}</Message.Item>
      ))}
    </Message.List>
  </Message>
);

class LoginForm extends Component {
  state = {
    user: {},
    login: false,
    signup: false,
    username: "",
    email: "",
    password: "",
    errors: [],
    backendErrors: "",
    backendOk: false
  };

  handleSubmit = e => {
    const { signup, username, email, password, errors } = this.state;
    if (!signup && (password === "" || email === "")) return;
    if (signup && (username === "" || password === "" || email === "")) return;
    if (errors.length > 0) return;
    /** login */
    if (!signup) {
      this.login(email, password);
    } else {
      this.signup(username, email, password);
    }
  };

  handleChange = (e, { name }) => {
    const { signup, username, email, password } = this.state;
    let errors = [];
    if (name === "username" && signup && username.length < 3) {
      errors.push({ username: "Username needs to be at least 4 characters" });
    }
    if (name === "email" && !emailReg.test(email)) {
      errors.push({ email: "Please enter a vaild email address" });
    }
    if (name === "password" && password.length < 5) {
      errors.push({ password: "Password needs to be at least 6 characters" });
    }
    this.setState({ errors });
    this.setState({ [name]: e.target.value });
  };

  login = async (email, password) => {
    const result = await axios.post("/api/user/login", {
      email,
      password
    });
    console.log("------------------------------------");
    console.log("result", result);
    console.log("------------------------------------");
    if (!result.data.ok) {
      this.setState({ backendOk: false, backendResult: result.data.error });
    } else {
      this.setState({
        user: result.data.data,
        login: true,
        backendResult: "Weclome, You are Logged in",
        backendOk: true,
        signup: false,
        username: "",
        email: "",
        password: ""
      });
      localStorage.setItem("auth", result.data.data.token);
    }
  };

  signup = async (username, email, password) => {
    const result = await axios.post("/api/user/signup", {
      username,
      email,
      password
    });
    if (!result.data.ok) {
      this.setState({ backendOk: false, backendResult: result.data.error });
    } else {
      this.setState({
        backendOk: true,
        backendResult:
          "Congratulations, You account was created! You can login in now",
        signup: false,
        username: "",
        email: "",
        password: ""
      });
    }
  };

  logout = () => {
    this.setState({
      user: {},
      login: false,
      backendOk: false,
      backendResult: false
    });
    localStorage.removeItem("auth");
  };

  render() {
    const {
      user,
      login,
      signup,
      errors,
      username,
      email,
      password,
      backendResult,
      backendOk
    } = this.state;
    return (
      <div className="login-form">
        <Grid
          textAlign="center"
          style={{ height: "100%" }}
          verticalAlign="middle"
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            {!login && (
              <div>
                <Divider horizontal style={{ color: "teal" }}>
                  {signup ? "Sign up your Account" : "Login into Account"}
                </Divider>
                {signup && (
                  <div
                    style={{
                      margin: "20px 0px",
                      color: "#2185d0",
                      cursor: "pointer"
                    }}
                    onClick={() =>
                      this.setState({
                        signup: false,
                        errors: [],
                        username: "",
                        email: "",
                        password: ""
                      })}
                  >
                    Login
                  </div>
                )}
                {errors.length > 0 && MessageExampleList(errors)}
                <Form size="large">
                  <Segment stacked>
                    {signup && (
                      <Form.Input
                        name="username"
                        value={username}
                        fluid
                        icon="user"
                        iconPosition="left"
                        placeholder="Username"
                        onChange={this.handleChange}
                        required
                        error={errors.some(
                          error => Object.keys(error)[0] === "username"
                        )}
                      />
                    )}
                    <Form.Input
                      fluid
                      name="email"
                      value={email}
                      icon="mail outline"
                      iconPosition="left"
                      placeholder="E-mail address"
                      onChange={this.handleChange}
                      required
                      error={errors.some(
                        error => Object.keys(error)[0] === "email"
                      )}
                    />
                    <Form.Input
                      fluid
                      name="password"
                      value={password}
                      icon="lock"
                      iconPosition="left"
                      placeholder="Password"
                      type="password"
                      onChange={this.handleChange}
                      required
                      error={errors.some(
                        error => Object.keys(error)[0] === "password"
                      )}
                    />
                    <Button
                      color={signup ? "blue" : "teal"}
                      fluid
                      size="large"
                      type="submit"
                      onClick={this.handleSubmit}
                    >
                      {signup ? "Sign Up" : "Login"}
                    </Button>
                    {!signup && (
                      <div>
                        <Divider horizontal>OR</Divider>
                        <Button
                          color="blue"
                          fluid
                          size="large"
                          onClick={() =>
                            this.setState({
                              signup: true,
                              errors: [],
                              username: "",
                              email: "",
                              password: ""
                            })}
                        >
                          Sign Up
                        </Button>
                      </div>
                    )}
                  </Segment>
                </Form>
                <Divider horizontal>
                  {signup ? "OR Sign Up With" : "OR Login With"}
                </Divider>
                <Segment.Group horizontal>
                  <Segment>
                    <a href="/api/user/auth/google">
                      <Button color="google plus" fluid>
                        <Icon name="google plus" /> Google
                      </Button>
                    </a>
                  </Segment>
                  <Segment>
                    <a href="/api/user/auth/facebook">
                      <Button color="facebook" fluid>
                        <Icon name="facebook" /> Facebook
                      </Button>
                    </a>
                  </Segment>
                </Segment.Group>
              </div>
            )}
            {backendResult && (
              <Message error={!backendOk} success={backendOk}>
                {backendResult}
              </Message>
            )}
            <Segment>
              <h1>User Profile</h1>
              {!login && <h3>Please login to view the profile</h3>}
              {login && (
                <div>
                  <Message color="purple">
                    JWT Token is saved in the local storge, You can use it to
                    access protect routes in the future
                  </Message>
                  <div style={{ textAlign: "left", wordWrap: "break-word" }}>
                    <h4>id: {user._id}</h4>
                    <h4>Username: {user.username}</h4>
                    <h4>Email: {user.email}</h4>
                    <h4>Token: {user.token}</h4>
                  </div>

                  <Segment.Group horizontal>
                    <Segment>
                      <a href="/api/user/auth/google">
                        <Button color="google plus" fluid>
                          <Icon name="google plus" /> Link to Google
                        </Button>
                      </a>
                    </Segment>
                    <Segment>
                      <a href="/api/user/connect/facebook">
                        <Button color="facebook" fluid>
                          <Icon name="facebook" /> LInk to Facebook
                        </Button>
                      </a>
                    </Segment>
                  </Segment.Group>
                  <Button
                    color="orange"
                    fluid
                    style={{ marginTop: "20px" }}
                    onClick={this.logout}
                  >
                    Log Out
                  </Button>
                </div>
              )}
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default LoginForm;
