import express from 'express';
import axios from 'axios';
import Users from '../models';

const _ = require('lodash');

const router = express.Router();

router.post('/user/register', (req, res) => {
  const body = _.pick(req.body, ['first_name', 'middle_name',
    'last_name', 'date_of_birth', 'username', 'email_address',
    'password', 'account_type', 'role']);
  if (body.account_type !== 'normal_user') {
    return res.status(403).send({
      message: 'Please Select normal user as account type',
    });
  }
  const user = new Users(body);
  user.save().then(() => user.generateAuthToken()).then((token) => {
    res.header('x-auth', token).send({
      user,
      message: 'Congratulations. You have Successfully opened a user account',
    });
  }).catch((e) => {
    res.status(400).send(e);
  });
});
