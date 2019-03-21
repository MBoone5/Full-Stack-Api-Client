// importing modules
import React, { Component } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';

// class component for user sign up form
class UserSignUp extends Component {
  constructor(props) {
    super(props);

    // initializing state
    this.state = {
      firstName: '',
      lastName: '',
      emailAddress: '',
      password: '',
      confirmPassword: '',
      redirect: false,
      passCheck: false
    };

    // refs
    this.pass = React.createRef();
    this.match = React.createRef();
  }
  
  // class method to check validity of password for sign up form
  checkPasswords = () => {
    // if passwords match return true
    if (this.pass.current.value === this.match.current.value) {
      // clear error message
      this.match.current.setCustomValidity('');

      // update password check
      this.setState({passCheck: true});

    } else { //if they don't match set html5 validation error and return false
      // setting error message
      this.match.current.setCustomValidity('Passwords must be matching');

      // update password check
      this.setState({passCheck: false});
    }
  }

  // class method to handle input change
  handleChange = e => {
    // prevent default
    e.preventDefault();

    // if the password field changes, update the value of password checck
    if(e.target.name === 'confirmPassword' || e.target.name === 'password' ) {
      this.checkPasswords();
    }

    // update state
    this.setState({[e.target.name]: e.target.value});
  }


  // class method to handle form submission
  handleSubmit = e => {
    // prevent default
    e.preventDefault();

    // check if passwords match
    if (this.state.passCheck) {
      // send form data if passwords match
      // getting form data
      const { redirect, ...formData } = this.state;
  
      // post data to api
      axios.post('http://localhost:5000/api/users', formData)
        .then(() => {     
          // update state to redirect
          this.setState({redirect: true});
        }).catch((err) => {
          console.log(err);
        });
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/courses" />;
    } else {
      return (
        <div className="bounds">
          <div className="grid-33 centered signin">
            <h1>Sign Up</h1>
            <div>
              <form onSubmit={this.handleSubmit}>
                <div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    value={this.state.firstName}
                    onChange={this.handleChange}
                    required
                  />
                </div>
                <div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Last Name"
                    value={this.state.lastName}
                    onChange={this.handleChange}
                    required
                  />
                </div>
                <div>
                  <input
                    id="emailAddress"
                    name="emailAddress"
                    type="text"
                    placeholder="Email Address"
                    value={this.state.emailAddress}
                    onChange={this.handleChange}
                    required
                    title="Please provide a valid email"
                    pattern="(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\x22(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\x22)@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])"
                  />
                </div>
                <div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={this.state.password}
                    onChange={this.handleChange}
                    required
                    ref={this.pass}
                  />
                </div>
                <div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    value={this.state.confirmPassword}
                    onChange={this.handleChange}
                    required
                    ref={this.match}
                  />
                </div>
                <div className="grid-100 pad-bottom">
                  <button className="button" type="submit">
                    Sign Up
                  </button>
                  <Link className="button button-secondary" to="/courses">
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
            <p>&nbsp;</p>
            <p>
              Already have a user account?{' '}
              <Link to="/signin">
                Click here
              </Link>{' '}
              to sign in!
            </p>
          </div>
        </div>
      );
    }
  }
}

export default UserSignUp;