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
      passCheck: false,
      firstInvalid: false,
      lastInvalid: false,
      emailInvalid: false,
      passInvalid: false,
      validationErrors: false
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

    // TODO: IMPLEMENT METHOD TO MATCH PASSWORDS THAT DOESN'T CONFLICT WITH VALIDATION

    // update state
    this.setState({[e.target.name]: e.target.value});
  }


  // class method to handle form submission
  handleSubmit = e => {
    // prevent default
    e.preventDefault();


    // send form data if passwords match
    // getting form data
    const { redirect, passCheck, firstInvalid, lastInvalid, emailInvalid, passInvalid, validationErrors, confirmPassword, ...formData } = this.state;
    console.log(formData);

    // post data to api
    axios.post('http://localhost:5000/api/users', formData)
      .then((response) => {     
        // update state to redirect
        this.setState({
          firstInvalid: false,
          lastInvalid: false,
          emailInvalid: false,
          passInvalid: false,
          validationErrors: false,
          redirect: true,
        });
      })
      .catch((err) => {
        // message reference
        const message = err.response.data.message;

        // regex to find 'title' adnd 'descritipion
        const firstName = /firstName/;
        const lastName = /lastName/;
        const email = /emailAddress/;
        const password = /password/;

        // update overall validity
        this.setState({validationErrors: true});

        // testing for matches
        if (firstName.test(message)) {
          // update state
          this.setState({firstInvalid: true});
        } else {
          // update validity state
          this.setState({firstInvalid: false});
        }

        if (lastName.test(message)) {
          // update state
          this.setState({lastInvalid: true});
        } else {
          // update validity state
          this.setState({lastInvalid: false});
        }

        if (email.test(message)) {
          // update state
          this.setState({emailInvalid: true});
        } else {
          // update validity state
          this.setState({emailInvalid: false});
        }

        if (password.test(message)) {
          // update state
          this.setState({passInvalid: true});
        } else {
          // update validity state
          this.setState({passInvalid: false});
        }

        // checking if there is any form of validation error
        let validationStates = [this.state.firstInvalid, this.state.lastInvalid, this.state.emailInvalid, this.state.passInvalid];
        if (validationStates.indexOf(true) !== -1) {
          // update validation errors state
          this.setState({validationErrors: true});
        }
      } 
      );
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
              <div>
                {this.state.validationErrors &&
                  <>
                    <h2 className="validation--errors--label">Validation Errors</h2>
                    <div className="validation-errors">
                      <ul>
                        {this.state.firstInvalid && <li>Please provide a value for "First Name"</li>}
                        {this.state.lastInvalid && <li>Please provide a value for "Last Name"</li>}
                        {this.state.emailInvalid && <li>Please provide a value for "Email Address"</li>} 
                        {this.state.passInvalid && <li>Please provide a value for "Password"</li>}
                      </ul>
                    </div>
                  </>
                }
              </div>
              <form onSubmit={this.handleSubmit}>
                <div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    value={this.state.firstName}
                    onChange={this.handleChange}

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