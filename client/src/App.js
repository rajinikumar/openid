import React, { Component } from "react";

import { Container, Header, Divider } from "semantic-ui-react";

import LoginForm from "./Login";

const App = () => (
  <div>
    <Header
      as="h1"
      content="Authnication Examples"
      textAlign="center"
      style={{ marginTop: "3em" }}
    />
    <Container>
      <LoginForm login={this.login} />
    </Container>
  </div>
);

export default App;
