import React from 'react';
import logo from '../../assets/icons/logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Future Home of Github Directory Search <br/>
          <em>(React Edition)</em>
        </p>
      </header>
      <footer className="App-footer">
        <a href="https://github.com/KyleMit/github-directory/tree/react">View Source</a>
      </footer>
    </div>
  );
}

export default App;
