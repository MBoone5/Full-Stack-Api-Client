// import modules
import React, { Component } from 'react';
import axios from 'axios';

class CourseDetail extends Component {
  // constructor to initialize state and recieve props
  constructor(props) {
    super(props);
    this.state = { apiData: [] };
  }
   

  // lifecycle method calls when component mounts 
  componentDidMount() {
    // GET api data for specefic course
    axios.get(`localhost:5000/api/courses/${this.props.courseId}`)
      .then(result => {
        // update state with api data
        this.setState({apiData: result.data});
      }).catch(err => {
        // log errors
        console.log(err); 
      });
  }

  // TODO: update hrefs, add sign out componenet
  render() {
    // references
    const currentCourse = this.state.apiData;
    const courseOwner = `${currentCourse.user.firstName} ${currentCourse.user.lastName}`;
    return (
      <div>
        {/* <div className="header">
          <div className="bounds">
            <h1 className="header--logo">Courses</h1>
            <nav><span>Welcome Joe Smith!</span><a className="signout">Sign Out</a></nav>
          </div>
        </div>
        <hr />
        <div>
          <div className="actions--bar">
            <div className="bounds">
              <div className="grid-100"><span><a className="button">Update Course</a><a className="button" href="#">Delete Course</a></span><a className="button button-secondary" href="index.html">Return to List</a></div>
            </div>
          </div> */}
          <div className="bounds course--detail">
            <div className="grid-66">
              <div className="course--header">
                <h4 className="course--label">Course</h4>
                <h3 className="course--title">{currentCourse.title}</h3>
                <p>By {courseOwner}</p>
              </div>
              <div className="course--description">
                {currentCourse.description}
              </div>
            </div>
            <div className="grid-25 grid-right">
              <div className="course--stats">
                <ul className="course--stats--list">
                  {currentCourse.estimatedTime &&
                    <li className="course--stats--list--item">
                      <h4>Estimated Time</h4>
                      <h3>{currentCourse.estimatedTime}</h3>
                    </li>
                  }
                  {currentCourse.materialsNeeded &&
                    <li className="course--stats--list--item">
                      <h4>Materials Needed</h4>
                      <ul>
                        {currentCourse.materialsNeeded}
                      </ul>
                    </li>
                  }
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CourseDetail;