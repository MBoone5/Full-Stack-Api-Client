// importing modules
import React, { Component, StrictMode } from 'react';
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
import PrivateRoute from './PrivateRoute';

// parent wrapper component for client
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authedUser: false,
      password: ''
    };
  }
  
  // initializing local storage for credential persistance

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
        return true;
      }).catch((err) => {
        console.log(err);
        return false;
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
            <StrictMode> {/* Rendering with strict mode helps catch potential issues or breaches in best practice*/}
              <Header user={this.state.authedUser} />
              <Switch>
                {/* redirect to /courses from / */}
                <Route exact path="/" render={() => <Redirect to="/courses" />} />

                {/* courses routes */}
                <Route exact path="/courses" component={CourseIndex} />
                <PrivateRoute exact path="/courses/create" user={this.state.authedUser} password={this.state.password} component={CreateCourse} />
                <PrivateRoute exact path="/courses/:id" user={this.state.authedUser} password={this.state.password} component={CourseDetail} />
                <PrivateRoute exact path="/courses/:id/update" user={this.state.authedUser} password={this.state.password} component={UpdateCourse} />

                {/* user routes */}
                <Route exact path="/signup" component={UserSignUp} />
                <Route exact path="/signin" render={() => <UserSignIn signIn={this.signIn} />} />
                <Route exact path="/signout" render={() => <UserSignOut signOut={this.signOut} />} />

              </Switch>
            </StrictMode>
          </header>
        </div>
      </Router>
    );
  }
}

export default App;
