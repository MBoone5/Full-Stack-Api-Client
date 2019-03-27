// import modules
import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// build protected router component
const PrivateRoute = ({component: WrappedComponent, ...rest}) => {
  // return protected route component
  return (
    <Route 
      {...rest}
      render={() => rest.user ? (
        <WrappedComponent user={rest.user} password={rest.password} match={rest.computedMatch} />
      ) : (
        <Redirect to="/signin" />
      )}
    />
  );
};
 
export default PrivateRoute;