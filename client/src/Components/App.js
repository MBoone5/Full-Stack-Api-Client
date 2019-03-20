// importing modules
import React, { Component } from 'react';

// importing components
import CourseIndex from './CourseIndex';

// parent wrapper component for client
class App extends Component {

  // rendering nested component content
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          
          <CourseIndex />
        </header>
      </div>
    );
  }
}

export default App;
