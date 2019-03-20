import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {apiTest: null};
  }
  
  componentDidMount() {
    axios.get('http://localhost:5000/api/courses')
      .then(result => {
        console.log(result);
      }).catch(err => {
        console.log(err)
      });
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
        </header>
      </div>
    );
  }
}

export default App;
