// import modules
import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header = props => {
  return (
    <div className="header">
      <div className="bounds">
        <div>
          <Link to="/courses" className="header--logo">Courses</Link>
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