import React from 'react';
import ReactDOM from 'react-dom';
import Scoreboard from './MiniScoreboard';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Scoreboard />, div);
  ReactDOM.unmountComponentAtNode(div);
});
