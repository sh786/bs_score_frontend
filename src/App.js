import React, { Component } from 'react';

import './App.css';
import Scoreboard from './components/Scoreboard';

class App extends Component {

  componentDidMount() {
    
  }

  render() {
    return (
      <div className="App">
        <Scoreboard />
      </div>
    );
  }
}

export default App;
