// import modules
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

class CourseDetail extends Component {
  // constructor to initialize state and recieve props
  constructor(props) {
    super(props);
    this.state = { 
      courseId: this.props.match.params.id,
      apiData: [],
      courseOwner: false,
      courseOwnerName: '' ,
      redirect: false
    };
  }
   
  // class method to determine if the currently authorized user owns this course
  checkOwner = () => {
    // conditional to check if user ids match
    if (this.props.user._id === this.state.apiData.user._id) {
      this.setState({ // update state
        courseOwner: true,
        courseOwnerName: `${this.props.user.firstName} ${this.props.user.lastName}`
      });
    }
  }

  // lifecycle method calls when component mounts 
  componentDidMount() {
    // GET api data for specefic course
    axios.get(`http://localhost:5000/api/courses/${this.state.courseId}`)
      .then(result => {
        // update state with api data
        this.setState({apiData: result.data });

        // check if the authorized user owns this course
        this.checkOwner();

        // if this course is not owne dby the user, find the name of who does, but only if the course document has a user included
        if (this.state.courseOwner === false && this.state.apiData.user) {
          // second api reqeust to get the name of the user who owns the course
          axios.get(`http://localhost:5000/api/users/${this.state.apiData.user._id}`)
            .then((result) => {
              // update state with name of the course owner
              this.setState({ courseOwnerName: result.fullName });
              
            }).catch((err) => {
              // log erros
              console.log(err);
            });
        }        
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
    axios.delete(`http://localhost:5000/api/courses/${this.state.courseId}`, {
      // sending basic authorization credentials
      auth: {
        username: this.props.user.emailAddress,
        password: this.props.password
      }
    })
      .then(() => {
        // redirect
        this.setState({redirect: true});
      })
      .catch((err) => {
        console.log(err);
      });

  }
  render() {
    // references
    const currentCourse = this.state.apiData;

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
                  {this.state.courseOwner &&
                    <span>
                      <Link className="button" to={`/courses/${this.state.courseId}/update`}>Update Course</Link>
                      <button className="button" onClick={this.handleDelete}>Delete Course</button>
                    </span>
                  }
                  <Link className="button button-secondary" to="/courses">Return to List</Link>
                </div>
              </div>
            </div>
            <div className="bounds course--detail">
              <div className="grid-66">
                <div className="course--header">
                  <h4 className="course--label">Course</h4>
                  <h3 className="course--title">{currentCourse.title}</h3>
                  {this.state.courseOwnerName &&
                    <p> By {this.state.courseOwnerName}</p>
                  }
                </div>
                <ReactMarkdown className="course--description" source={currentCourse.description} />
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
                          <ReactMarkdown source={currentCourse.materialsNeeded} />
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