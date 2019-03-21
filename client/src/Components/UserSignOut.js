// import modules
import React from 'react';
import { Redirect } from 'react-router-dom';

// stateless component to sign out a user
const UserSignOut = props => {
  // call sign out function
  props.signOut();

  // redirect to sign in form
  return (
    <Redirect to="/signin" />
  );
};

export default UserSignOut;