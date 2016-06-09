'use strict';

// LIBRARIES
import app from '../../../index';
import {knex} from '../../setup.teardown';
import request from 'supertest-as-promised';
import Auth0Facade from 'auth0.facade.js';

// ERRORS
import errors from '../../../errors/errors';

describe('[API] [Users]', function() {
  var user;

  function clearUserDatabase() {
        return knex('users').del()
          .catch(logAndThrow);
  };

  function logAndThrow(err) {
    console.error(err);
    throw err;
  }

  // Clear users after testing
  before(clearUserDatabase);

  describe('[CREATE]', function() {

    describe('[SUCCESSFUL]', function() {
      before(clearUserDatabase);

      it('should allow an user to complete his registration', function() {
        return request(app)
          .post(`/api/users`)
          .send({email: 'user01@mail.com', firstName: 'user', lastName: '01', password: '123456'})
          .expect(201)
          .then(res => {
            var user = res.body.user;
            expect(user.firstName).to.eql('user');
          });
      });
    });

    describe('[UNSUCCESSFUL]', function() {

      it('should not allow an authenticated user to complete his registration twice', function() {
        let email = 'user02@mail.com';

        return request(app)
          .post(`/api/users`)
          .send({email: email, firstName: 'user', lastName: '02'})
          .expect(201)
          .then(function() {
            return request(app)
              .post(`/api/users`)
              .send({email: email, firstName: 'user', lastName: '03'})
              .expect(400);
          })
          .then(clearUserDatabase);
      });

      it('should not allow an authenticated user to complete his registration if email is missing', function() {
        return request(app)
          .post(`/api/users`)
          .send({firstName: 'user', lastName: '02'})
          .expect(400)
          .then(res => {
            var error = res.body;
            expect(error.message).to.eql(errors.bad_request_400.invalid_email.message);
          });
      });

      it('should not allow an authenticated user to complete his registration if email is invalid', function() {
        return request(app)
          .post(`/api/users`)
          .send({email: 'user01@', firstName: 'user', lastName: '01'})
          .expect(400)
          .then(res => {
            var error = res.body;
            expect(error.message).to.eql(errors.bad_request_400.invalid_email.message);
          });
      });

      it('should not allow an authenticated user to complete his registration if first name is missing', function() {
        return request(app)
          .post(`/api/users`)
          .send({lastName: '02'})
          .expect(400)
          .then(res => {
            var error = res.body;
            expect(error.message).to.eql(errors.bad_request_400.invalid_first_name.message);
          });
      });

      it('should not allow an authenticated user to complete his registration if first name is invalid', function() {
        return request(app)
          .post(`/api/users`)
          .send({firstName: '1', lastName: '02'})
          .expect(400)
          .then(res => {
            var error = res.body;
            expect(error.message).to.eql(errors.bad_request_400.invalid_first_name.message);
          });
      });

      it('should not allow an authenticated user to complete his registration if last name is missing', function() {
        return request(app)
          .post(`/api/users`)
          .send({firstName: '02'})
          .expect(400)
          .then(res => {
            var error = res.body;
            expect(error.message).to.eql(errors.bad_request_400.invalid_last_name.message);
          });
      });

      it('should not allow an authenticated user to complete his registration if last name is invalid', function() {
        return request(app)
          .post(`/api/users`)
          .send({firstName: 'user', lastName: '0'})
          .expect(400)
          .then(res => {
            var error = res.body;
            expect(error.message).to.eql(errors.bad_request_400.invalid_last_name.message);
          });
      });

      it('should not allow an authenticated user to complete his registration if the phone is invalid', function() {
        return request(app)
          .post(`/api/users`)
          .send({email: 'user01@mail.com', firstName: 'user', lastName: '01', phone: '1'})
          .expect(400)
          .then(res => {
            var error = res.body;
            expect(error.message).to.eql(errors.bad_request_400.invalid_phone.message);
          });
      });

      it('should not allow an authenticated user to complete his registration if there is an email already registered', function() {
        var email = 'franklopez@mail.com';

        return request(app)
          .post(`/api/users`)
          .send({email: 'user04@mail.com', firstName: 'user', lastName: '04'})
          .expect(201)
          .then(() => {

            return request(app)
              .post(`/api/users`)
              .send({email: 'user04@mail.com', firstName: 'user', lastName: '04'})
              .expect(400)
              .then(res => {
                var error = res.body;
                expect(error.message).to.eql(errors.bad_request_400.user_email_used.message);
              });

          });
      });

    });

  });

  xdescribe('[UNAUTHENTICATED]', function() {

    describe('[RETRIEVE]', function() {
      it('should not allow any user to query the API unless they are logged in', function() {
        return request(app)
          .get(`/api/users/1`)
          .expect(401);
      });

      it('should not allow any user to query the API unless they are logged in', function() {
        return request(app)
          .get(`/api/users`)
          .expect(401);
      });
    });

    describe('[CREATE]', function() {
      it('should not allow an unauthenticated user to complete his registration', function() {
        return request(app)
          .post(`/api/users`)
          .send({})
          .expect(401);
      });
    });

    describe('[UPDATE]', function() {
      it('should not allow an unauthenticated user to update users', function() {
        return request(app)
          .put(`/api/users/5`)
          .send({})
          .expect(401);
      });
    });

  });

  describe('[AUTHENTICATED USER]', function() {

  });

});
