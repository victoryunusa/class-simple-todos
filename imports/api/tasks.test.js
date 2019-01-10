/* eslint-env mocha */
 
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';
import { Accounts } from 'meteor/accounts-base';
 
import { Tasks } from './tasks.js';
 
if (Meteor.isServer) {
    describe('Tasks', () => {     
        describe('methods', () => {
            const username = 'victoryunusa';
            let taskId, userId;

        before(function() {
            let user = Meteor.users.findOne({username: username});
            if (!user) {
                userId = Accounts.createUser({
                'username': username,
                'email': 'victor@agrilet.com',
                'password': 'victor',
                }); 
            } else {
                userId = user._id;
            }
        });
    
        beforeEach(() => {
            Tasks.remove({});
            taskId = Tasks.insert({
            text: 'test task',
            createdAt: new Date(),
            owner: userId,
            username: 'tmeasday',
            });
        });

            //Test for Insert a new task
            // Insert
      it('can insert task', function() {
        let text = 'Hello!';
        const insert = Meteor.server.method_handlers['tasks.insert'];
        const invocation = { userId };
        insert.apply(invocation, [text]);
        assert.equal(Tasks.find().count(), 2);
      });

      it('cannot insert task if not logged in', function() {
        let text = 'Hi!';

        const insert = Meteor.server.method_handlers['tasks.insert'];

        // No userId passed into fake method invocation
        const invocation = {};

        assert.throws(function() {
          insert.apply(invocation, [text]);
        }, Meteor.Error, /not-authorized/);

        assert.equal(Tasks.find().count(), 1);
      });


    
            it('can delete owned task', () => {
                // Find the internal implementation of the task method so we can
                // test it in isolation
                const deleteTask = Meteor.server.method_handlers['tasks.remove'];
        
                // Set up a fake method invocation that looks like what the method expects
                const invocation = { userId };
        
                // Run the method with `this` set to the fake invocation
                deleteTask.apply(invocation, [taskId]);
        
                // Verify that the method does what we expected
                assert.equal(Tasks.find().count(), 0);
            });

            it("cannot delete someone else's task", function() {
                
                Tasks.update(taskId, { $set: { private: true } });
        
                
                const userId = Random.id();
        
                const deleteTask = Meteor.server.method_handlers['tasks.remove'];
                const invocation = { userId };
        
                // Verify that error is thrown
                assert.throws(function() {
                  deleteTask.apply(invocation, [taskId]);
                }, Meteor.Error, 'not-authorized');
        
                // Verify that task is not deleted
                assert.equal(Tasks.find().count(), 1);
              });
        });
    });
}