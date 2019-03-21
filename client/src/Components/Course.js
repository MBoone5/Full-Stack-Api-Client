// import modules
import React from 'react';
import { Link } from 'react-router-dom';

// stateless component for course index elements
const Course = props => {
  // TODO: add href once course detail component is built
  return (
    <div className="grid-33">
      <Link to={`/courses/${props.courseId}`} className="course--module course--link">
        <h4 className="course--label">Course</h4>
        <h3 className="course--title">{props.title}</h3>
      </Link>
    </div>
  );
};

export default Course;