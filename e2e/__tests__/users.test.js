const request = require('../request');
const db = require('../db');
const { signUpUser } = require('../data-helpers');
const User = require('../../lib/models/user');


describe('users api', () => {
  beforeEach(() => {
    return db.dropCollection('users');
  });

  const data = {
    email: 'user@user.com',
    password: 'abc123',
    name: 'Bill',
    age: 18,
    minPrefAge: 18,
    maxPrefAge: 120,
    gender: 'non-binary',
    genderPref: 'non-binary'
  };

  function postUser(user) {
    return request 
      .post('/api/users')
      .send(user)
      .expect(200)
      .then(({ body }) => body);
  }

  it('posts a user', () => {
    return postUser(data)
      .then(user => {
        expect(user).toEqual({
          _id: expect.any(String),
          __v: 0,
          hash: expect.any(String),
          email: 'user@user.com',
          name: 'Bill',
          age: 18,
          minPrefAge: 18,
          maxPrefAge: 120,
          gender: 'non-binary',
          genderPref: 'non-binary'
        }); 
      });
  });

  it('gets a user by id', () => {
    return postUser(data)
      .then(user => {
        return request
          .get(`/api/users/${user._id}`)
          .expect(200)
          .then(({ body }) => {
            expect(body).toEqual(data);
          });
      });
  });
});