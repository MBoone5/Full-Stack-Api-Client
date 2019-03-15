'use strict';

// import modules
const express = require('express');
const router = express.Router();
const {User, Course} = require('./models');
const auth = require('basic-auth');

// bcrypt refrences
const bcrypt = require('bcryptjs');
const saltRounds = 10;

/* user authentication
 followed along with the express rest api authorization 
 tutoriial here: https://teamtreehouse.com/library/rest-api-authentication-with-express */
const authUser = (req, res, next) => {
  // Parse authorization header
  const credentials = auth(req);


  // authorization logic
  if (credentials) { // if credentials are available
    User.findOne({ emailAddress: credentials.name }) // find user with matchingt email
      .then(doc => {
        const user = doc;
        bcrypt.compare(credentials.pass, user.password) // compare passwords
          .then(result => {
            if (result) { // successful authentication
              console.log('Authenticaion successful'); // auth llogging
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
    err.message = 'Authenticaion required';
    err.status = 401;
    next(err);
  }
};
// user routes
router.route('/users')
  .get(authUser, (req, res, next) => {
    // TODO: update to return currently authed user and not .findone
    // returns currently authed user
    // sends 200
    User.findById(res.locals.currentUser._id)
      .then(doc => {
        res.status(200);
        res.json(doc);
      })
      .catch(next);
  })
  .post((req, res, next) => {
    // creates a user
    // sends 201
    Promise.resolve()
      .then(() => {
        const newUser = new User(req.body);
        bcrypt.hash(newUser.password, saltRounds)
          .then(hash => {
            newUser.password = hash;
            newUser.save();  
            res.sendStatus(201);  
          })
          .catch(next);
      })
      .catch(err => {
        err.status = 400;
        next(err);
      });
  });

// course routes
router.route('/courses')
  .get((req, res, next) => {
    // returns a list of courses + user that owns each course
    // sends 200
    Course.find({})
      .exec()
      .then((err, docs) => {
        if (err) return next(err); //pass error to catch
        res.status(200);
        res.json(docs);
      })
      .catch(next);
  })
  .post((req, res, next) => {
    // Creates a course, sets the Location header to the URI for the course, and returns no content
    // sends 201
    Course.create(req.body)
      .then((err, doc) => {
        if (err) return next(err);
        res.status(201);
        res.location(`/api/courses/${doc._id}`);
      })
      .catch((err) => {
        err.status(400);
        next(err);
      });
  });

// course/id routes
router.route('/courses/:id')
  .all((req, res, next) => { 
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
  .put((req, res, next) => {
    res.locals.currentCourse.updateOne(req.body)
      .then(() => {
        res.json(res.locals.currentCourse);
        res.status(204);
      })
      .catch(next);
  })
  // delete the given course
  .delete((req, res, next) => {
    res.locals.currentCourse.remove()
      .then(() => {
        res.sendStatus(204);
      })
      .catch(next); 
  });

module.exports = router;