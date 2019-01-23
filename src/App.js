import React, { Component } from 'react';

import './App.css';
import Scoreboard from './components/Scoreboard/Scoreboard';
import MiniScoreboard from './components/MiniScoreboard/MiniScoreboard';

class App extends Component {

  render() {
    return (
      <div className="App">
        <MiniScoreboard />
        <Scoreboard />
      </div>
    );
  }
}

export default App;
