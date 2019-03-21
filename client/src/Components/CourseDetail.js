// import modules
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

class CourseDetail extends Component {
  // constructor to initialize state and recieve props
  constructor(props) {
    super(props);
    this.state = { 
      courseId: this.props.match.params.id,
      apiData: [],
      courseOwner: '' ,
      redirect: false
    };
  }
   

  // lifecycle method calls when component mounts 
  componentDidMount() {
    // GET api data for specefic course
    axios.get(`http://localhost:5000/api/courses/${this.state.courseId}`)
      .then(result => {
        // update state with api data
        this.setState({apiData: result.data });

        // second api reqeust to get the name of the user who owns the course
        axios.get(`http://localhost:5000/api/users/${result.data.user._id}`)
          .then((result) => {
            // update state with name of the course owner
            this.setState({courseOwner: result.fullName})
            ;
          }).catch((err) => {
            // log erros
            console.log(err);
          });
      }).catch(err => {
        // log errors
        console.log(err); 
      });
  }

  // class method to handle delete request
  handleDelete = e => {
    // prevent default
    e.preventDefault();

    // send delete request
    axios.delete(`http://localhost:5000/api/courses/${this.state.courseId}`);

    // redirect
    this.setState({redirect: true});
  }

  render() {
    // references
    const currentCourse = this.state.apiData;
    const courseId = this.state.courseId;
    const courseOwner = this.state.courseOwner;

    if (this.state.redirect) {
      return <Redirect to="/courses" />;
    } else {
      return (
        <div>
          <hr />
          <div>
            <div className="actions--bar">
              <div className="bounds">
                <div className="grid-100">
                  <span>
                    <Link className="button" to={`/courses/${courseId}/update`}>Update Course</Link>
                    <button className="button" onClick={this.handleDelete}>Delete Course</button>
                  </span>
                  <Link className="button button-secondary" to="/courses">Return to List</Link>
                </div>
              </div>
            </div>
            <div className="bounds course--detail">
              <div className="grid-66">
                <div className="course--header">
                  <h4 className="course--label">Course</h4>
                  <h3 className="course--title">{currentCourse.title}</h3>
                  {courseOwner &&
                    <p> By {courseOwner}</p>
                  }
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
}

export default CourseDetail;