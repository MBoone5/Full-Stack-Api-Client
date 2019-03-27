// import modules
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

// class component to create a new course
class CreateCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      estimatedTime: '',
      materialsNeeded: '',
      redirect: false,
      validationErrors: false,
      titleInvalid: false,
      descInvalid: false
    };
  }

  // class method to handle changes in from data
  handleChange = e => {
    // prevent default
    e.preventDefault();

    // update state values
    this.setState({[e.target.name]: e.target.value});
  }

  // class method to handle form submit
  handleSubmit = e => {
    // prevent default
    e.preventDefault();

    // get form data
    const {redirect, ...formData } = this.state;

    // reference to user document
    const user = { user: this.props.user};

    // combining form data with user object
    const courseData = {...user, ...formData};

    // POST request to api to create a new course
    axios.post('http://localhost:5000/api/courses', courseData, {
      // sending basic authorization credentials
      auth: {
        username: this.props.user.emailAddress,
        password: this.props.password
      }
    })
      .then(response => {
        // update redirect state
        this.setState({ 
          titleInvalid: false,
          descInvalid: false,
          validationErrors: false,
          redirect: true
        });
      })
      .catch(err => {
        // message reference
        const message = err.response.data.message;

        // regex to find 'title' adnd 'descritipion
        const title = /title/;
        const description = /description/;

        // testing for matches
        if (title.test(message) && description.test(message)) {
          // update state
          this.setState({
            titleInvalid: true,
            descInvalid: true,
            validationErrors: true
          });
        } else if (title.test(message)) {
          // update state
          this.setState({
            titleInvalid: true,
            descInvalid: false,
            validationErrors: true
          });
        } else  {
          // update state
          this.setState({
            titleInvalid: false,
            descInvalid: true,
            validationErrors: true
          });
        }
      });
  }
  render() {
    if (this.state.redirect) {
      return <Redirect to="/courses" />;
    } else {
      return (
        <div className="bounds course--detail">
          <div>
            <h1>Create Course</h1>
            <div>
              <div>
                {this.state.validationErrors && 
                  <>
                  <h2 className="validation--errors--label">Validation Errors</h2>
                    <div className="validation-errors">
                      <ul>
                        {this.state.titleInvalid && <li>Please provide a value for "Title"</li>}
                        {this.state.descInvalid && <li>Please provide a value for "Description"</li>}
                      </ul>
                    </div>
                  </>
                }
              </div>
              <form onSubmit={this.handleSubmit}>
                <div className="grid-66">
                  <div className="course--header">
                    <h4 className="course--label">Course</h4>
                    <div>
                      <input
                        id="title"
                        name="title"
                        type="text"
                        className="input-title course--title--input"
                        placeholder="Course title..."
                        value={this.state.title}
                        onChange={this.handleChange}
                      />
                    </div>
                    {(this.props.user &&
                      (
                        <p>By {`${this.props.user.firstName} ${this.props.user.lastName}`}</p>
                      )
                    )}
                  </div>
                  <div className="course--description">
                    <div>
                      <textarea
                        id="description"
                        name="description"
                        placeholder="Course description..."
                        value={this.state.description}
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid-25 grid-right">
                  <div className="course--stats">
                    <ul className="course--stats--list">
                      <li className="course--stats--list--item">
                        <h4>Estimated Time</h4>
                        <div>
                          <input
                            id="estimatedTime"
                            name="estimatedTime"
                            type="text"
                            className="course--time--input"
                            placeholder="Hours"
                            value={this.state.estimatedTime}
                            onChange={this.handleChange}
                          />
                        </div>
                      </li>
                      <li className="course--stats--list--item">
                        <h4>Materials Needed</h4>
                        <div>
                          <textarea
                            id="materialsNeeded"
                            name="materialsNeeded"
                            placeholder="List materials..."
                            value={this.state.materialsNeeded}
                            onChange={this.handleChange}
                          />
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="grid-100 pad-bottom">
                  <button className="button" type="submit">
                    Create Course
                  </button>
                  <Link to="/courses" className="button button-secondary">
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>

        </div>
      );
    }
  }
}

export default CreateCourse;