/* eslint-disable new-cap */
const router = require('express').Router();
const Match = require('../models/match');
const ensureAuth = require('../middleware/ensure-auth');
const getMatch = require('../services/match-generator');

router
  .post('/', ensureAuth(), (req, res, next) => {
    const data1 = getMatch(req.body.minAge, req.body.maxAge, req.body.gender[0]);
    const data2 = getMatch(req.body.minAge, req.body.maxAge, req.body.gender[0]);
    const data3 = getMatch(req.body.minAge, req.body.maxAge, req.body.gender[0]);

    Promise.all([
      Match.create(data1),
      Match.create(data2),
      Match.create(data3)
    ])
      .then(match => {
        return res.json(match);
      })
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Match.findById(req.params.id)
      .lean()
      .then(match => res.json(match))
      .catch(next);
  })

  .get('/', ({ query }, res, next) => {
    const findQuery = {};
    if(query.name) findQuery.name = query.name;
    if(query.age) findQuery.age = query.age;
    if(query.location) findQuery.location = query.location;

    Match.find(findQuery)
      .lean()
      .then(matches => {
        res.json(matches);
      })
      .catch(next);
  });

module.exports = router; 