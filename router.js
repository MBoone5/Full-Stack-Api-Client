'use strict';

// import modules
const express = require('express');
const router = express.Router();
const {User, Course} = require('./models');
const auth = require('basic-auth');

// bcrypt refrences
const bcrypt = require('bcryptjs');
const saltRounds = 10;

// user authentication middleware
const authUser = (req, res, next) => {
  // Parse authorization header
  const credentials = auth(req);

  // authorization logic
  if (credentials) { // if credentials are available
    User.findOne({ emailAddress: credentials.name }) // find user with matching email
      .then(doc => {
        const user = doc;
        bcrypt.compare(credentials.pass, user.password) // compare passwords
          .then(result => {
            if (result) { // successful authentication
              console.log('Authentication successful'); // auth logging
              res.locals.currentUser = user; // set currentUser on locals for passing through middleware
              next(); // if all is well, move forwards
            } else { // if passwords don't match
              console.log('Authentication failed'); // auth logging
              const err = new Error();
              err.message = 'Invalid password';
              err.status = 401;
              next(err);
            }
          })
          .catch(next);
      })
      .catch(err => { // if the user doc isn't found
        console.log('Authentication failed'); // auth logging
        err.message = 'User not found';
        err.status = 401;
        next(err);
      });
  } else { // if there is no auth header, send to handler
    console.log('Authentication failed'); // auth logging
    const err = new Error();
    err.message = 'Authentication required';
    err.status = 401;
    next(err);
  }
};
// user routes
router.route('/users')
  .all(authUser)
  .get((req, res, next) => {
    // returns currently authed user
    User.findById(res.locals.currentUser._id)
      .then(doc => {
        res.status(200);
        res.location(`api/users/${doc._id}`);
        res.json(doc);
      })
      .catch(next);
  })
  .post((req, res, next) => {
    // creates a user
    const newUser = new User(req.body);
    bcrypt.hash(newUser.password, saltRounds) // generate password hash
      .then(hash => {
        // persist new user
        newUser.password = hash; // set password as hash first
        newUser.save()
          .then(result => {
            res.status(201);
            res.location('/');
            res.send(); 
          })
          .catch(next); 
      })
      .catch(next);
  });

// course routes
router.route('/courses')
  .get((req, res, next) => {
    // TODO: Return user of course as a seperate piece of JSON data
    // returns a list of courses + user that owns each course
    // sends 200
    Promise.resolve() // wrapper for error handling because the promise from .exec cant be chained
      .then(() => {
        Course.find({})
          .exec((err, docs) => {
            if (err) return next(err); //pass error to catch
            res.status(200);
            res.json(docs);
          });        
      })
      .catch(next);
  })
  .post(authUser, (req, res, next) => {
    // TODO:  Does this need to append the current authed user into the document? - Validation?
    // Creates a course, sets the Location header to the URI for the course, and returns no content
    // sends 201
    Course.create(req.body)
      .then(doc => {
        res.status(201);
        res.location(`/api/courses/${doc._id}`);
        res.send();
      })
      .catch(next);
  });

// course/id routes
router.route('/courses/:id')
  .all((req, res, next) => { 
    // TODO: Needs to send the user who owns the course as well
    // find the matchibng course
    Course.findById(req.params.id)
      .then(doc => {
        res.locals.currentCourse = doc;
        next(); 
      })
      .catch(next);
  }) 
  .get((req, res, next) => {
    // send the course
    Promise.resolve() // Promise.resolve eliminates overhead of try{} catch{}
      .then(() => {
        res.status(200);
        res.json(res.locals.currentCourse);
      })
      .catch(err => next(err));
  })
  // update the course
  .put(authUser, (req, res, next) => {
    res.locals.currentCourse.updateOne(req.body)
      .then(() => {
        res.sendStatus(204);
      })
      .catch(next);
  })
  // delete the given course
  .delete(authUser, (req, res, next) => {
    res.locals.currentCourse.remove()
      .then(() => {
        res.sendStatus(204);
      })
      .catch(next); 
  });

module.exports = router;