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

const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const MessageExampleList = errors => (
  <Message error>
    <Message.Header>Errors</Message.Header>
    <Message.List>
      {errors.map((error, index) => (
        <Message.Item>{Object.values(error)[0]}</Message.Item>
      ))}
    </Message.List>
  </Message>
);

class LoginForm extends Component {
  state = {
    signup: false,
    username: "",
    email: "",
    password: "",
    errors: []
  };

  handleSubmit = e => {
    console.log("submit");
    const { signup, username, email, password } = this.state;
    console.log(username, email, password);
    let errors = [];
    if (signup && username.length < 4) {
      errors.push({ username: "Username needs to be at least 4 characters" });
    }
    if (!emailReg.test(email)) {
      errors.push({ email: "Please enter a vaild email address" });
    }
    if (password.length < 6) {
      errors.push({ password: "Password needs to be at least 6 characters" });
    }
    console.log("errors", errors);
    this.setState({ errors });
  };

  handleChange = (e, { name }) => {
    this.setState({ [name]: e.target.value });
  };
  render() {
    const { signup, errors, username, email, password } = this.state;
    return (
      <div className="login-form">
        <Grid
          textAlign="center"
          style={{ height: "100%" }}
          verticalAlign="middle"
        >
          <Grid.Column style={{ maxWidth: 450 }}>
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
            <Segment>
              <Button color="google plus">
                <Icon name="google plus" /> Google
              </Button>
              <Button color="facebook">
                <Icon name="facebook" /> Facebook
              </Button>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default LoginForm;
