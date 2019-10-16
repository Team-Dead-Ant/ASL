const inquirer = require('inquirer');
// const chalk = require('chalk');
const request = require('superagent');

const REQUEST_URL = require('./requestUrl');

const signinInput = [
  {
    type: 'input',
    name: 'email',
    message: 'Please enter your email'
  },
  {
    type: 'password',
    name: 'password',
    message: 'Please enter a password'
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
    message: 'Please enter your email'
  },
  {
    type: 'password',
    name: 'password',
    message: 'Please enter a password'
  }
];

const signupPrefs = [
  {
    type: 'list',
    name: 'gender',
    message: 'Please enter your gender',
    choices: ['male', 'female', 'non-binary']
  },
  {
    type: 'number',
    name: 'age',
    message: 'Please enter your age',
    default: 18
  },
  {
    type: 'input',
    name: 'image',
    message: 'Please add a link to your best selfie'
  },
  {
    type: 'checkbox',
    name: 'genderPref',
    message: 'Which gender are you looking to date?',
    choices: ['male', 'female', 'non-binary', 'no preference'],
    default: ['no preference']
  },
  {
    type: 'number',
    name: 'minPrefAge',
    message: 'What is the youngest you would date?',
    default: 18
  },
  {
    type: 'number',
    name: 'maxPrefAge',
    message: 'What is the oldest you would date?',
    default: 120
  }
];

const intermission = [
  {
    type: 'boolean',
    name: 'intermission',
    message: 'HAWT! We have some questions before your date begins. Press enter to continue'
  }
];

const intermission2 = [
  {
    type: 'boolean',
    name: 'intermission2',
    message: 'Great job...now you\'re ready for your date! Press enter to continue'
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
  },
  {
    type: 'input',
    name: 'activity',
    message: 'What activity would you like to partake in? (ending in ing)',
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
  },
  {
    type: 'input',
    name: 'color',
    message: 'What is your favorite color?',
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
  },
  {
    type: 'input',
    name: 'beverage',
    message: 'What is your beverage of choice?',
  },
  {
    type: 'input',
    name: 'action',
    message: 'An action word ending in -ing.',
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
    message: 'What is your favorite article of clothing that you always wear on a first date?',
  },
];

let chosenThree;

function newMatches(user) {
  return request
    .post(`${REQUEST_URL}/api/matches`)
    .set('Authorization', user.token)
    .send({ minAge: user.minPrefAge, maxAge: user.maxPrefAge, gender: user.genderPref })
    .then(({ body }) => chosenThree = body)
    .then(() => inquirer.prompt(
      {
        type: 'list',
        name: 'matchChoice',
        message: 'Pick your date!',
        choices: [`${chosenThree[0].name}`, `${chosenThree[1].name}`, `${chosenThree[2].name}`]
      }
    ));
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
          console.log('user', user);
          return newMatches(user);
        })
        .then(() => inquirer.prompt(intermission))
        .then(() => inquirer.prompt(dateQs));
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
          return newMatches(user);
        })
        .then(() => inquirer.prompt(intermission))
        .then(() => inquirer.prompt(dateQs))
        .then((answers) => {
          return request
            .post(`${REQUEST_URL}/api/results`)
            .set('Authorization', user.token)
            .send({ user: user._id, result:`The witching hour fast approaches, I can hear the howls of city coyotes as I am ${answers.methodOfTravel} to meet my date at the Lone Fir Cemetery.I'm wearing the ${answers.color} feather in my hair to signal to my date that I have arrived. I met ~match.name~ in front of a mausoleum in the NE corner of the cemetery. I think to myself, they sure we're brave to meet me here at this hour, let's see if ~match.pronoun~ has what it takes to keep up with me. We sat around the cemetery for a while talking and drinking some ${answers.beverage} I brought with me. After a while I suggested ${answers.activity}, which is met with enthusiasm by my new partner in crime. We headed off, plotting and laughing maniacally as we traveled to ${answers.place}. We spent several hours ${answers.activity} and worked up quite the appetite. Fortunately, by the time we decided we were done, places started opening for breakfast. We headed off to ${answers.restaurant} for ${answers.food} where we spilled our guts to one another about our lives, hopes, and dreams. After spending these hours together we decided to meet up next Saturday night for ${answers.action} during the full moon at ${answers.venue}.  All in all, this turned out to be one of my best dates, if you can believe that.` })
            .then(({ body }) => body);
        })
        .then((result) => {
          return request
            .get(`${REQUEST_URL}/api/results/${result._id}`)
            .set('Authorization', user.token)
            .then(({ body }) => 
              console.log(body.result));

        });

    });

module.exports = { signinPrompt, signupPrompt };