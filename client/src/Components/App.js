// importing modules
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import axios from 'axios';

// importing css
import './styles/global.css';

// importing components
import Header from './Header';
import CourseIndex from './CourseIndex';
import CourseDetail from './CourseDetail';
import CreateCourse from './CreateCourse';
import UpdateCourse from './UpdateCourse';
import UserSignUp from './UserSignUp';
import UserSignIn from './UserSignIn';
import UserSignOut from './UserSignOut';

// parent wrapper component for client
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authedUser: false,
      password: ''
    };
  }
  

  // global method to sign in
  signIn = credentials => {
    // make request to log in user with provided credentials
    axios.get('http://localhost:5000/api/users', {
      auth: { // basic auth config
        username: credentials.emailAddress,
        password: credentials.password
      }
    })
      .then((result) => {
        // persist authenticated user
        this.setState({
          authedUser: result.data,
          password: credentials.password
        });
      }).catch((err) => {
        console.log(err);
      });
  }

  // global method to sign out
  signOut = () => {
    // clear the values of authUser and their password
    this.setState({
      authedUser: false,
      password: ''
    });
  }


  // rendering nested component content
  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <Header user={this.state.authedUser} />
            <Switch>
              {/* redirect to /courses from / */}
              <Route exact path="/" render={() => <Redirect to="/courses" />} />

              {/* courses routes */}
              <Route exact path="/courses" component={CourseIndex} />
              <Route exact path="/courses/create" render={() => <CreateCourse user={this.state.authedUser} />} />
              <Route exact path="/courses/:id" component={CourseDetail} />
              <Route exact path="/courses/:id/update" component={UpdateCourse}/>

              {/* user routes */}
              <Route exact path="/signup" component={UserSignUp} />
              <Route exact path="/signin" render={() => <UserSignIn signIn={this.signIn} />} />
              <Route exact path="/signout" render={() => <UserSignOut signOut={this.signOut} />} />
            </Switch>
          </header>
        </div>
      </Router>
    );
  }
}

export default App;
