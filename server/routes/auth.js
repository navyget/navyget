import express from 'express';
import * as _ from 'lodash';
import authenticate from '../middleware/authenticate';
import { Users, Businesses } from '../models';

const router = express.Router();

// POST method route
// Create a user account (public)
router.post('/user/register', async (req, res) => {
	const body = _.pick(req.body, [
		'first_name',
		'middle_name',
		'last_name',
		'date_of_birth',
		'username',
		'email_address',
		'password',
		'account_type'
	]);
	if (body.account_type !== 'normal_user') {
		return res.status(403).send({
			message: 'Please Select normal user as account type'
		});
	}
	try {
		const user = await new Users(body);
		const token = await user.generateAuthToken();
		return res.header('x-auth', token).send({
			user,
			message: 'Congratulations. You have Successfully opened a user account'
		});
	} catch (e) {
		return res.status(400).send(e);
	}
});

// POST method route
// Create a business account (public)
router.post('/business/register', async (req, res) => {
	const userBody = _.pick(req.body, [
		'first_name',
		'middle_name',
		'last_name',
		'date_of_birth',
		'username',
		'email_address',
		'password',
		'account_type'
	]);
	const businessBody = _.pick(req.body, [
		'business_name',
		'business_type',
		'business_description',
		'business_category',
		'business_subcategory',
		'location',
		'_business_admin'
	]);

	if (userBody.account_type !== 'business_account') {
		return res
			.status(403)
			.send({ message: 'Please Select business account as account type.' });
	}
	try {
		const user = await new Users(userBody);
		const token = await user.generateAuthToken();
		const createdUser = await Users.findByToken(token);
		if (!createdUser) {
			throw new Error('Unable to create user');
		}
		const business = Object.assign({}, businessBody, {
			_business_admin: user._id
		});
		const newBusiness = new Businesses(business);
		const createdBusiness = await newBusiness.save();
		return res.header('x-auth', token).send({
			createdUser,
			createdBusiness,
			message:
				'Congratulations. You have Successfully created your business account'
		});
	} catch (e) {
		return res.status(400).send(e);
	}
});

// POST method route
// Log in to account (public) {email/password}
router.post('/login', async (req, res) => {
	try {
		const body = _.pick(req.body, ['email_address', 'password']);
		const user = await Users.findByCredentials(
			body.emailAddress,
			body.password
		);
		const token = await user.generateAuthToken();
		return res.header('x-auth', token).send({
			user,
			message: 'Congratulations. You have successfully logged into your account'
		});
	} catch (e) {
		return res.status(400).send(e);
	}
});

// DELETE method route
// Logout a user from the account(public)
router.delete('/logout', authenticate, async (req, res) => {
	const { token, user } = req;
	try {
		await user.removeToken(token);
		return res.send({
			message: 'You have been successfully logged out.'
		});
	} catch (e) {
		return res.status(400).send(e);
	}
});

export default router;
