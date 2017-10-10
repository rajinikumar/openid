import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import { Container, Header, Divider } from "semantic-ui-react";

import LoginForm from "./Login";

const App = () => (
  <Router>
  <div>
    <Header
      as="h1"
      content="Authnication Examples"
      textAlign="center"
      style={{ marginTop: "3em" }}
    />
    <Container>
      <Route path='/' exact component={LoginForm} />
      <Route path='/socialLogin/:token' exact render={(props) => {
        const token = props.match.params.token;
        localStorage.setItem("auth", token);
        props.history.push('/');
        return null;
      }} />
    </Container>
    </div>
  </Router>
);

export default App;
