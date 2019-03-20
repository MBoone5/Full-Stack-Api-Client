// import modules
import React from 'react';

// import components
import UserSignOut from './UserSignOut';

const Header = props => {
  return (
    <div className="bounds">
      <div>
        <h1 className="header--logo">Courses</h1>
        {props.user ? (
          <nav>
            <span>Welcome {props.user.name}</span>
            <UserSignOut />
          </nav>
        ) : (
          <nav>
            <a className="signup" href="#">
                  Sign Up
            </a>
            <a className="signin" href="#">
                  Sign In
            </a>
          </nav>
        )}
      </div>
    </div>
  );
};

export default Header;