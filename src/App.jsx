import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import HomePage from './components/HomePage.jsx';
import StoryPage from './components/StoryPage.jsx';
import { Navbar, Nav } from 'react-bootstrap';

const App = () => {
  return (
    <Router>
      <div className="d-flex flex-column h-100">
        <Navbar className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
          <Nav.Link className="navbar-brand" as={Link} to="/">Hacker News Reader</Nav.Link>
        </Navbar>
      </div>
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route exact path="/story">
          <StoryPage />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
