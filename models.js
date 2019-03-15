'use strict';

// mongoose ORM module
const mongoose = require('mongoose');

// schema reference
const Schema = mongoose.Schema;

// users schema
const UserSchema = new Schema({
  firstName: { type: String, required: [true, 'A first name is required'] },
  lastName: { type: String, required: [true, 'A last name is required'] },
  emailAddress: { type: String, required: [true, 'An email is required'] },
  password: { type: String, required: [true, 'A password is required'] }
});

// course schema
const CourseSchema = new Schema({
  user: UserSchema, // reference to a user document
  title: { type: String, required: [true, 'A course title is required'] },
  description: { type: String, required: [true, 'A course description is required'] },
  estimatedTime: { type: String },
  materialsNeeded: { type: String }
});

const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);
module.exports = {User, Course};