import React, { Component } from 'react';
import logo from './logo.svg';
import contractFunctions from './contractFunctions/contractFunctions'
import './App.css';



class App extends Component {
  async componentDidMount(){
    this.cF = new contractFunctions()
    this.cF.initialize()
    console.log(await this.cF.getNumberOfCandidates())
    console.log(await this.cF.getCandidate(1))
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
        </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    )
  }
}

export default App;
