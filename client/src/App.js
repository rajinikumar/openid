import React, { Component } from "react";
import { Container, Header, Divider } from "semantic-ui-react";

import LoginForm from "./components/Login";

class App extends Component {
  render() {
    return (
      <div>
        <Header
          as="h1"
          content="Authnication Examples"
          textAlign="center"
          style={{ marginTop: "3em" }}
        />
        <Container>
          <LoginForm />
        </Container>
      </div>
    );
  }
}

export default App;
