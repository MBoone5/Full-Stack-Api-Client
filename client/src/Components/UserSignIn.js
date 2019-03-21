import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

class UserSignIn extends Component {
  constructor(props) {
    super(props);
    this.state= {
      emailAddress: '',
      password: '',
      redirect: false
    };
  }
  
  handleChange = e => {
    // prevent default
    e.preventDefault();

    // update state
    this.setState({[e.target.name]: e.target.value});
  }

  handleSubmit = e => {
    // prevent default response
    e.preventDefault();

    // get user credentials
    const {redirect, ...credentials} = this.state;

    // call signIn function
    this.props.signIn(credentials);

    // update redirect
    this.setState({redirect: true});
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/courses" />;
    } else {
      return (
        <div>
          <div className="bounds">
            <div className="grid-33 centered signin">
              <h1>Sign In</h1>
              <div>
                <form onSubmit={this.handleSubmit}>
                  <div>
                    <input
                      id="emailAddress"
                      name="emailAddress"
                      type="text"
                      value={this.emailAddress}
                      required
                      pattern="(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\x22(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\x22)@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])"
                      placeholder="Email Address"
                      onChange={this.handleChange}
                    />
                  </div>
                  <div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={this.password}
                      required
                      placeholder="Password"
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="grid-100 pad-bottom">
                    <button className="button" type="submit">
                      Sign In
                    </button>
                    <Link to="/courses" className="button button-secondary">
                      Cancel
                    </Link>
                  </div>
                </form>
              </div>
              <p>&nbsp;</p>
              <p>
                Don't have a user account?{' '}
                <Link to="/signup">Click here</Link>
                to sign up!
              </p>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default UserSignIn;