import { Template } from 'meteor/templating';
 
import './body.html';
 
Template.body.helpers({
  tasks: [
    { text: 'This is Victor Yunusa' },
    { text: 'I love You!' },
    { text: 'This is task 3' },
    { text: 'This is task 2' },
    { text: 'This is task 3' },
  ],
});