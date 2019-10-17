/* eslint-disable no-unused-vars */
const inquirer = require('inquirer');
// const chalk = require('chalk');
const request = require('superagent');
const storySelect = require('./stories');
const validator = require('email-validator');
const terminalImage = require('terminal-image');
const asciify = require('asciify-image');

const REQUEST_URL = require('./requestUrl');

const signinInput = [
  {
    type: 'input',
    name: 'email',
    message: 'Please enter your email',
    validate: function validEmail(email) {
      if(!validator.validate(email)) {
        return 'Please enter a valid email';
      }
      else {
        return true;
      }
    }
  },
  {
    type: 'password',
    name: 'password',
    message: 'Please enter a password',
    validate: function validPass(pass) {
      if(pass.length !== 0) {
        return true;
      }
      else {
        return 'Please enter a valid password';
      }
    }
  }
];

const signupInput = [
  {
    type: 'input',
    name: 'name',
    message: 'Please type your name'
  },
  {
    type: 'input',
    name: 'email',
    message: 'Please enter your email',
    validate: function validEmail(email) {
      if(!validator.validate(email)) {
        return 'Please enter a valid email';
      }
      else {
        return true;
      }
    }
  },
  {
    type: 'password',
    name: 'password',
    message: 'Please enter a password',
    validate: function validPass(pass) {
      if(pass.length !== 0) {
        return true;
      }
      else {
        return 'Please enter a valid password';
      }
    }
  }
];

const signupPrefs = [
  {
    type: 'list',
    name: 'gender',
    message: 'Please enter your gender',
    choices: ['female', 'male', 'non-binary']
  },
  {
    type: 'number',
    name: 'age',
    message: 'Please enter your age',
    default: 18,
    validate: function validAge(age) {
      if(age < 18) {
        return 'You must be at least 18 years old to play';
      }
      else {
        return true;
      }
    }
  },
  // {
  //   type: 'input',
  //   name: 'image',
  //   message: 'Please add a link to your best selfie'
  // },
  {
    type: 'checkbox',
    name: 'genderPref',
    message: 'Which gender are you looking to date?',
    choices: ['female', 'male', 'non-binary', 'no preference'],
    default: ['no preference']
  },
  {
    type: 'number',
    name: 'minPrefAge',
    message: 'What is the youngest you would date?',
    default: 18,
    validate: function validAge(age) {
      if(age < 18) {
        return 'Whoa there! You cannot date underage people!!';
      }
      else {
        return true;
      }
    }
  },
  {
    type: 'number',
    name: 'maxPrefAge',
    message: 'What is the oldest you would date?',
    default: 120,
    validate: function validAge(age) {
      if(age > 120) {
        return 'Uhhh why are you trying to be a grave robber? pick someone younger';
      }
      else {
        return true;
      }
    }
  }
];

const intermission = [
  {
    type: 'boolean',
    name: 'intermission',
    message: '\n HAWT! We have some questions before your date begins. Press enter to continue \n'
  }
];

const intermission3 = [
  {
    type: 'boolean',
    name: 'intermission3',
    message: '\n Not satisfied? Pick a new date! \n'
  }
];

const dateQs = [
  {
    type: 'list',
    name: 'timeOfDay',
    message: 'What time of day would you like to go on a date?',
    choices: ['daybreak', 'noon', 'afternoon', 'sunset', 'late af']
  },
  {
    type: 'input',
    name: 'venue',
    message: 'Where would you like to go on a date?',
    validate: function validInput(input) {
      if(input.length !== 0) {
        return true;
      }
      else {
        return 'Please enter a venue';
      }
    }
  },
  {
    type: 'input',
    name: 'activity',
    message: 'What activity would you like to partake in? (ending in ing)',
    validate: function validInput(input) {
      if(input.length !== 0) {
        return true;
      }
      else {
        return 'Please enter an activity';
      }
    }
  },
  {
    type: 'input',
    name: 'dessert',
    message: 'What is your favorite dessert?',
    validate: function validInput(input) {
      if(input.length !== 0) {
        return true;
      }
      else {
        return 'Please enter a dessert';
      }
    }
  },
  {
    type: 'list',
    name: 'food',
    message: 'What meal are you having?',
    choices: ['octopus', 'tacos', 'falafel', 'cake', 'duck confit']
  },
  {
    type: 'input',
    name: 'animal',
    message: 'What is your favorite animal? (plural)',
    validate: function validInput(input) {
      if(input.length !== 0) {
        return true;
      }
      else {
        return 'Please enter an animal';
      }
    }
  },
  {
    type: 'input',
    name: 'color',
    message: 'What is your favorite color?',
    validate: function validInput(input) {
      if(input.length !== 0) {
        return true;
      }
      else {
        return 'Please enter a color';
      }
    }
  },
  {
    type: 'list',
    name: 'methodOfTravel',
    message: 'How do you like to get around when not driving?',
    choices: ['walking', 'busing', 'tandem unicyling', 'rafting', 'E-Scootering']
  },
  {
    type: 'input',
    name: 'place',
    message: 'Name a place you love to take people.',
    validate: function validInput(input) {
      if(input.length !== 0) {
        return true;
      }
      else {
        return 'Please enter a place';
      }
    }
  },
  {
    type: 'input',
    name: 'beverage',
    message: 'What is your beverage of choice?',
    validate: function validInput(input) {
      if(input.length !== 0) {
        return true;
      }
      else {
        return 'Please enter a beverage';
      }
    }
  },
  {
    type: 'input',
    name: 'action',
    message: 'An action word ending in -ing.',
    validate: function validInput(input) {
      if(input.length !== 0) {
        return true;
      }
      else {
        return 'Please enter an action';
      }
    }
  },
  {
    type: 'list',
    name: 'restaurant',
    message: 'What restaurant/bar would you take a date to?',
    choices: ['Portland City Grill', 'Super Deluxe', 'Nicholas', 'Baby Doll Pizza', 'My Father\'s Place']
  },
  {
    type: 'input',
    name: 'clothing',
    message: 'What is your favorite article of clothing that you always wear on a first date?\n',
    validate: function validInput(input) {
      if(input.length !== 0) {
        return true;
      }
      else {
        return 'Please enter a clothing item';
      }
    }
  },
  {
    type: 'boolean',
    name: 'intermission2',
    message: 'Great job...now you\'re ready for your date! Press enter to continue\n'
  }
];

let match;
let chosenThree;

function newMatches(user) {
  return request
    .post(`${REQUEST_URL}/api/matches`)
    .set('Authorization', user.token)
    .send({ minAge: user.minPrefAge, maxAge: user.maxPrefAge, gender: user.genderPref })
    .then(({ body }) => chosenThree = body)
    .then(() => Promise.all([
      request.get(chosenThree[0].image),
      request.get(chosenThree[1].image),
      request.get(chosenThree[2].image)
    ])
    )
    .then(res => {
      return Promise.all(res.map((response) => terminalImage.buffer(response.body)))
        .then(matchImages => {
          return inquirer.prompt(
            {
              type: 'list',
              name: 'matchChoice',
              message: `\n Pick your date! \n*${chosenThree[0].name}:\n${matchImages[0]}\n*${chosenThree[1].name}:\n${matchImages[1]}\n*${chosenThree[2].name}:\n${matchImages[2]}`,
              choices: [
                `${chosenThree[0].name}, age:${chosenThree[0].age}, location:${chosenThree[0].location.city}, ${chosenThree[0].location.state}`,
                `${chosenThree[1].name}, age:${chosenThree[1].age}, location:${chosenThree[1].location.city}, ${chosenThree[1].location.state}`,
                `${chosenThree[2].name}, age:${chosenThree[2].age}, location:${chosenThree[2].location.city}, ${chosenThree[2].location.state}`
              ]
            }
          );
        });
    });
}

function dateSim(answers, user, match) {
  let genderPronoun;
  let toBe;
  let toHave;
  let wasWere;
  if(match.gender[0] === 'male') {
    genderPronoun = 'he';
    toBe = 'is';
    toHave = 'has';
    wasWere = 'was';
  } else if(match.gender[0] === 'female') {
    genderPronoun = 'she';
    toBe = 'is';
    toHave = 'has';
    wasWere = 'was';
  } else {
    genderPronoun = 'they';
    toBe = 'are';
    toHave = 'have';
    wasWere = 'were';
  }

  const story = storySelect(answers, match, genderPronoun, toBe, toHave, wasWere);

  return request
    .post(`${REQUEST_URL}/api/results`)
    .set('Authorization', user.token)
    .send({ user: user._id, match: match._id, result: story })
    .then(({ body }) => body)
    .then((result) => {
      return request
        .get(`${REQUEST_URL}/api/results/${result._id}`)
        .set('Authorization', user.token)
        .then(({ body }) =>
          console.log(body.result)); //We need this to display the story to user
    });
}

const signinPrompt = () =>
  inquirer.prompt(signinInput)
    .then(answers => {
      let user = {
        email: answers.email,
        password: answers.password
      };
      return request
        .post(`${REQUEST_URL}/api/auth/signin`)
        .send(user)
        .then(({ body }) => {
          user = body;
        })
        .then(() => {
          return newMatches(user)
            .then(answer => {
              if(answer.matchChoice === chosenThree[0].name) {
                match = chosenThree[0];
              } else if(answer.matchChoice === chosenThree[1].name) {
                match = chosenThree[1];
              } else {
                match = chosenThree[2];
              }
            });
        })
        .then(() => inquirer.prompt(intermission))
        .then(() => inquirer.prompt(dateQs))
        .then((answers) => {
          return dateSim(answers, user, match);
        });
    })
    .catch(() => {
      console.log('ERROR: Invalid email or password');
      signinPrompt();
    });

const signupPrompt = () =>
  inquirer.prompt(signupInput)
    .then(answers => {
      let user = {
        name: answers.name,
        email: answers.email,
        password: answers.password
      };
      return request
        .post(`${REQUEST_URL}/api/auth/signup`)
        .send(user)
        .then(({ body }) => {
          user = body;
        })
        .then(() => inquirer.prompt(signupPrefs))
        .then(pref => {
          let userPref = {
            gender: pref.gender,
            age: pref.age,
            image: pref.image,
            genderPref: pref.genderPref,
            minPrefAge: pref.minPrefAge,
            maxPrefAge: pref.maxPrefAge
          };
          return request
            .put(`${REQUEST_URL}/api/users/${user._id}`)
            .set('Authorization', user.token)
            .send(userPref)
            .then(({ body }) => {
              body.token = user.token;
              user = body;
            });
        })
        .then(() => {
          return newMatches(user)
            .then(answer => {
              if(answer.matchChoice === chosenThree[0].name) {
                match = chosenThree[0];
              } else if(answer.matchChoice === chosenThree[1].name) {
                match = chosenThree[1];
              } else {
                match = chosenThree[2];
              }
            });
        })
        .then(() => inquirer.prompt(intermission))
        .then(() => inquirer.prompt(dateQs))
        .then((answers) => {
          return dateSim(answers, user, match);
        });
    });

const evanTest = ['Dylan: An agendered poly queer circus performer and punk/metal musician that enjoys spending time with their family in the forest and gardening. Their hobbies include: dance trapeze, hand-balancing, playing and making music, guitar, singing in choirs and screaming in bands. \n', 'Evan: A full stack software developer. When he\'s not coding, he enjoys hiking, going to shows, and playing chess. \n', 'Angela: Graphic Designer/Animator turned Software Developer. Enjoys costume making, cooking/baking, gardening, and horror/sci-fi flicks. \n', 'Donna: Like a cat, but Vegan. Also likes chess. \n', 'Anonella: Loves cute and fluffy dogs and anime, dislikes cooked carrots. Played \'Dream Daddy\' twice. \n'];

const img = ['assets/images/dylan.png', 'assets/images/evan.png', 'assets/images/angela.png', 'assets/images/donna.png', 'assets/images/antonella.png'];

const asciiLogo = 'assets/images/DeadAnt-Logo.png';

const options = {
  fit: 'box',
  width: 45,
  height: 45
};

const aboutUsPrompt = () => {
  return inquirer.prompt({
    name: 'Dead Ant',
    type: 'boolean',
    message: asciify(asciiLogo, options, function(err, asciified) {
      if(err) {
        throw Error;
      }
      console.log(asciified);
    })
  })
    .then(() => {
      return Promise.all(img.map((path) => terminalImage.file(path)))
        .then(termiImages => {
          return inquirer.prompt(termiImages.map((image, i) => {
            return {
              name: 'about us',
              type: 'boolean',
              message: `${image} \n\n ${evanTest[i]}`
            };
          }));
        });
    })
    .catch(err => console.log(err));
};

module.exports = { signinPrompt, signupPrompt, aboutUsPrompt };