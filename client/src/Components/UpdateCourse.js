// import modules
import React, { Component } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';


class UpdateCourse extends Component {
  constructor(props) {
    super(props);
    /*
      This form is a controlled component rather than an uncontrolled component because
      the <textarea> tag does not accept the value tage, and changing the description
      to an <input> tag intrerferes with the css styling and would require a lot of restructuring
      of the css in order to achieve the same look that <textarea> has
    */
    this.state = {
      courseId: this.props.match.params.id,
      title: '',
      description: '',
      estimatedTime: '',
      materialsNeeded: '',
      owner: '',
      redirect: false,
      titleInvalid: false,
      descInvalid: false
    };
  }
  
  // lifecycle method calls when component mounts 
  componentDidMount() {
    // GET api data for specefic course
    axios.get(`http://localhost:5000/api/courses/${this.state.courseId}`)
      .then(result => {
        // update state with inital data for forms fields
        this.setState({ 
          title: result.data.title,
          description: result.data.description,
          estimatedTime: result.data.estimatedTime,
          materialsNeeded: result.data.materialsNeeded // if estimate or mats has a falsey value, react will automatically omit the value attribute
        });

        // second api reqeust to get the name of the user who owns the course
        axios.get(`http://localhost:5000/api/users/${result.data.user._id}`)
          .then(result => {
            // update state with name of the course owner
            this.setState({ owner: result.fullName });

          }).catch(err => {
            // log erros
            console.log(err);
          });
      }).catch(err => {
        // log errors
        console.log(err);
      });
  }

  // handle value change
  handleChange = e => {
    // updating state with form value
    this.setState({[e.target.name]: e.target.value});
  }

  // handle form submit
  handleSubmit = e => {
    // prevent refresh
    e.preventDefault();
    const {redirect, owner, courseId, ...formFields} = this.state;
    // PUT form data
    axios.put(`http://localhost:5000/api/courses/${this.state.courseId}`, formFields, {
      // sending basic authorization credentials
      auth: {
        username: this.props.user.emailAddress,
        password: this.props.password
      }
    })
      .then(() => {        
        // upddating state for redirect
        this.setState({
          titleInvalid: false,
          descInvalid: false,
          validationErrors: false,
          redirect: true
        });
      }).catch(err => {
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
        } else {
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
    if  (this.state.redirect) {
      return  <Redirect to={`/courses/${this.state.courseId}`} />;
    } else {
      return (
        <div className="bounds course--detail">
          <h1>Update Course</h1>
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
                  {this.state.owner &&
                    <div>
                      <input
                        id="owner"
                        name="owner"
                        type="text"
                        className="input-title course--owner--input"
                        placeholder="Course owner..."
                        value={this.state.owner}
                        onChange={this.handleChange}
                      />
                    </div>
                  }
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
                  Update Course
                </button>
                <button className="button button-secondary">
                  <Link to={`/courses/${this.state.courseId}`}>Cancel</Link>
                </button>
              </div>
            </form>
          </div>
  
        </div>
      );

    }

  }
}

export default UpdateCourse;