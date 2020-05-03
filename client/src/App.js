import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Main from "./components/Main.js";
import CreateRoom from "./components/CreateRoom.js";
import Room from "./components/Room.js";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/room">
            <Room />
          </Route>
          <Route path="/createRoom">
            <CreateRoom />
          </Route>
          <Route path="/">
            <Main />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
