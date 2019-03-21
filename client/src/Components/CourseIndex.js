// importing modules
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// import componentes
import Course from './Course';

// stateful class component for courses index
class CourseIndex extends Component {
  // initializing state
  state = { apiData: [] }
  /*
    It's imperitave that apiData is an empty array and NOT null
    otherwise .map is not available before the component updates with the api data
  */

  // lifecycle method for when component mounts
  componentDidMount() {
    // get courses data
    axios.get('http://localhost:5000/api/courses')
      .then(result => {
        // updating state and returning elements array
        this.setState({ apiData: result.data });
      })
      .catch(err => {
        // log error
        console.log(err);
      }); 
  }

  // class method to get api data and create course elements
  createCourseElements = () => {
    // counter for elements
    let counter = 0;

    // iterating over api data to create elements
    const courseElements = this.state.apiData.map(course => {
      return (
        <Course
          title={course.title}
          courseId={course._id}
          key={counter += 1}
        />
      );
    });

    // return array of course elements
    return courseElements;
  }

  // rendering component content
  render() {
    return (
      <div className="bounds">
        {/* course elements  */}
        <>
          {this.createCourseElements()}
        </>
        {/* link to create a new course */}
        <div className="grid-33 course--add--wrapper">
          <Link className="course--module course--add--module" to="/courses/create">
            <h3 className="course--add--title">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 13 13"
                className="add"
              >
                <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 " />
              </svg>New Course
            </h3>
          </Link>
        </div>

      </div>
    );
  }
}

export default CourseIndex;