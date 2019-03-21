// import modules
import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = props => {
  return (
    <div className="header">
      <div className="bounds">
        <div>
          <h1 className="header--logo">Courses</h1>
          {props.user ? (
            <nav>
              <span>Welcome, {`${props.user.firstName} ${props.user.lastName}`}</span>
              <NavLink activeClassName="active" className="signout" to="/signout">Sign Out</NavLink> 
            </nav>
          ) : (
            <nav>
              <NavLink activeClassName="active" className="signup" to="/signup">Sign Up</NavLink>
              <NavLink activeClassName="active" className="signin" to="/signin">Sign In</NavLink>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;