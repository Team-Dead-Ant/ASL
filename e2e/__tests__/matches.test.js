const request = require('../request');
const db = require('../db');
const { signupUser } = require('../data-helpers');

describe('matches api', () => {
  beforeEach(() => db.dropCollection('users'));
  beforeEach(() => db.dropCollection('matches'));

  let user;
  beforeEach(() => {
    return signupUser().then(newUser => (user = newUser));
  });

  const match = {
    name: 'Light Yagami',
    gender: 'male',
    age: 19,
    location: {
      city: 'Portland',
      state: 'Oregon'
    },
    image: '/assets/images/testm.jpg'
  };

  // function postMatch(match, user) {
  //   return request
  //     .post('/api/matches')
  //     .set('Authorization', user.token)
  //     .send(match)
  //     .expect(200)
  //     .then(({ body }) => body);
  // }

  it('post a match for this user', () => {
    console.log(user);
    return request
      .post('/api/matches')
      .set('Authorization', user.token)
      .send(match)
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchInlineSnapshot(
          {
            _id: expect.any(String)
          },
          `
          Object {
            "__v": 0,
            "_id": Any<String>,
            "age": 19,
            "gender": Array [
              "male",
            ],
            "image": "/assets/images/testm.jpg",
            "location": Array [
              Object {
                "_id": "5da119d705b47253ca9396af",
                "city": "Portland",
                "state": "Oregon",
              },
            ],
            "name": "Light Yagami",
          }
        `
        );
      });
  });
});
// return request
// .post('/api/matches')
// .set('Authorization', user.token)
// .send(match)
// .expect(200)
// .then(({ body }) => {
//   expect(body).toMatchInlineSnapshot(
//     {
//       _id: expect.any(String),
//       user: expect.any(String)
//     },
//   );
// });
// });

// it('post a match', () => {
//   return postMatch(match, user)
//     .then(match => {
//       expect(match).toEqual({
//         _id: expect.any(String),
//         __v: 0,
//         ...match
//       });
//     });
// });

// it('gets a list of matches', () => {
//   const firstMatch = {
//     name: 'Light Yagami',
//     gender: 'male',
//     age: 19,
//     location: {
//       city: 'Portland',
//       state: 'Oregon'
//     },
//     image: '/assets/images/testm.jpg'
//   };
//   return Promise.all([
//     postMatch(firstMatch, user),
//     postMatch(
//       {
//         name: 'Tuxedo Mask',
//         gender: 'male',
//         age: 18,
//         location: {
//           city: 'Seattle',
//           state: 'Washington'
//         },
//         image: '/assets/images/testm.jpg'
//       },
//       user,
//     ),

//     postMatch(
//       {
//         name: 'Sebastian Michaelis',
//         gender: 'male',
//         age: 99,
//         location: {
//           city: 'London',
//           state: 'England'
//         },
//         image: '/assets/images/testseb.jpg'
//       },
//       user,
//     )
//   ])

//     .then(() => {
//       return request
//         .get('/api/matches')
//         .expect(200)
//         .set('Authorization', user.token)
//         .expect(200);
//     })
//     .then(({ body }) => {
//       expect(body.length).toBe(3);
//       expect(body[0]).toEqual({
//         _id: expect.any(String),
//         name: firstMatch.name,
//         age: firstMatch.age,
//         location: firstMatch.location
//       });
//     });
//});
