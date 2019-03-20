// import modules
import React from 'react';

// stateless component for course index elements
const Course = props => {
  // TODO: add href once course detail component is built
  return (
    <div className="grid-33">
      <a className="course--module course--link">
        <h4 className="course--label">Course</h4>
        <h3 className="course--title">{props.title}</h3>
      </a>
    </div>
  );
};

export default Course;