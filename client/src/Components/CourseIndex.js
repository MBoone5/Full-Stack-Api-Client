// importing modules
import React, { Component } from 'react';
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
        <>
          {this.createCourseElements()}
        </>
      </div>
    );
  }
}

export default CourseIndex;