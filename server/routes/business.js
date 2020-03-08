import express from 'express';
import { ObjectID } from 'mongodb';
import * as _ from 'lodash';
import Businesses from '../models/business';

const router = express.Router();

// GET method route
// Can view particular business profile (public)
// to-do: get business with owner privilege
router.get('/business/:businessId', async (req, res) => {
	const { businessId } = req.params;
	if (!ObjectID.isValid(businessId)) {
		return res.status(404).send({ message: 'Invalid business id' });
	}
	const business = await Businesses.findById(businessId);
	try {
		if (!business) {
			return res.status(404).send({ message: 'Business does not exist' });
		}
		return res.send({ business });
	} catch (e) {
		return res.send(e);
	}
});

// GET method route
// Business views its own business profile and dashboard (private)
router.get('/my_busines', authenticate, async (req, res) => {
	const userId = res.user._id;
	if (req.account !== 'business account') {
		return res.status(403).send({ message: 'Unauthorized account.' });
	}
	const business = await Businesses.findOne({ _business_admin: userId });
	try {
		if (!business) {
			return res.status(404).send({ message: 'Business does not exist' });
		}
		return res.send({ business });
	} catch (e) {
		return res.send(e);
	}
});

// EDIT method route
// Business can edit business profile (private)
router.patch('/business/:businessId', authenticate, async (req, res) => {
	const { businessId } = req.params;
	const body = _.pick(req.body, [
		'business_name',
		'business_type',
		'business_category',
		'location'
	]);
	if (!ObjectID.isValid(businessId)) {
		return res.status(404).send({
			message: 'Invalid business Id'
		});
	}
	if (req.account !== 'business account') {
		return res.status().send({ message: 'Unauthorized account' });
	}
	const business = await Businesses.findByIdAndUpdate(
		businessId,
		{ $set: body },
		{ new: true }
	);
	try {
		if (!business) {
			return res.status(404).send({ message: 'Business does not exist' });
		}
		return res.send({ business, message: 'Business has been updated' });
	} catch (e) {
		return res.send(e);
	}
});

// Delete method Route
// Business role can delete business account (private)
router.delete('/business/:businessId', authenticate, async (req, res) => {
	const { businessId } = req.params;
	if (!ObjectID.isValid(businessId)) {
		return res.status(404).send({
			message: 'Invalid business Id'
		});
	}
	if (req.account !== 'business account') {
		return res.status().send({ message: 'Unauthorized account' });
	}
	const business = await Businesses.findByIdAndRemove(businessId);
	try {
		if (!business) {
			return res.status(404).send({ message: 'Business does not exist' });
		}
		return res.send({ business, message: 'Business has been updated' });
	} catch (e) {
		return res.send(e);
	}
});

export default router;
