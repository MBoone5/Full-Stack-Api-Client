'use strict';

// import modules
const express = require('express');
const router = express.Router();
const {User, Course} = require('./models');
const auth = require('basic-auth');

// bcrypt refrences
const bcrypt = require('bcryptjs');
const saltRounds = 10;

// user authentication
const authUser = (req, res, next) => {
  // Parse the user's credentials from the Authorization header.

  // If the user's credentials are available...
  // Attempt to retrieve the user from the data store
  // by their username (i.e. the user's "key"
  // from the Authorization header).

  // If a user was successfully retrieved from the data store...
  // Use the bcryptjs npm package to compare the user's password
  // (from the Authorization header) to the user's password
  // that was retrieved from the data store.

  // If the passwords match...
  // Then store the retrieved user object on the request object
  // so any middleware functions that follow this middleware function
  // will have access to the user's information.

  // If user authentication failed...
  // Return a response with a 401 Unauthorized HTTP status code.

  // Or if user authentication succeeded...
  // Call the next() method.
};
// user routes
router.route('/users')
  .get(authUser, (req, res, next) => {
    // returns currently authed user
    // sends 200
    Promise.resolve()
      .then(() => {
        User.findOne()
          .then(doc => {
            res.status(200);
            res.json(doc);
          })
          .catch(next);
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
    Promise.resolve().then(() => {
      Course.find({})
        .exec((err, docs) => {
          if (err) return next(err); //pass error to catch
          res.status(200);
          res.json(docs);
        });
    }).catch(next);
  })
  .post((req, res, next) => {
    // Creates a course, sets the Location header to the URI for the course, and returns no content
    // sends 201
    Promise.resolve().then(() => {
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
    }).catch(next);
  });

// course/id routes
router.route('/courses/:id')
  .all((req, res, next) => { 
    // find the matchibng course
    Course.findById(req.params.id, (err, doc) => {
      if (err) return next(err); // catch error
      if (!doc) { // if doc is missing
        err = new Error('Not Found');
        res.status(404);
        return next(err);
      }
      res.locals.currentCourse = doc;
      next();
    }); 
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
    Promise.resolve()
      .then(() => {
        res.locals.currentCourse.updateOne(req.body)
          .then(() => {
            res.json(res.locals.currentCourse);
            res.status(204);
          })
          .catch(next);
      })
      .catch(next);
  })
  // delete the given course
  .delete((req, res, next) => {
    Promise.resolve()
      .then(() => {
        res.locals.currentCourse.remove()
          .then(() => {
            res.sendStatus(204);
          })
          .catch(next); 
      })
      .catch(next);
  });

module.exports = router;