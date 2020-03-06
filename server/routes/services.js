import express from 'express';
import { ObjectId } from 'mongodb';
import * as _ from 'lodash';
import Businesses from '../models/business';
import Services from '../models/services';

const router = express.Router();

// POST method route
// business role can create a service (private)
router.post('/:businessId/service/create', authenticate, async (req, res) => {
	const { businessId } = req.params;
	const businessAdmin = req.user._id;
	const body = _.pick(req.body, [
		'service_name',
		'service_price',
		'service_description',
		'service_category',
		'service_subcategory',
		'service_attributes',
		'availability',
		'published'
	]);
	if (!ObjectId.isValid(businessId)) {
		return res.status(404).send({
			message: 'Invalid business Id'
		});
	}
	if (req.account !== 'business account') {
		return res.status().send({ message: 'Unauthorized account' });
	}
	const business = await Businesses.findById(businessId);
	try {
		if (!business) {
			return res.status(404).send({ message: 'Business does not exist' });
		}
		const service = await Services.findOne({
			service_name: body.service_name,
			_businessId: businessId
		});
		if (service) {
			return res
				.status(409)
				.send({ message: 'Service already exists in database' });
		}
		const serviceBody = Object.assign(
			{},
			body,
			{ _businessId: businessId },
			{ _businessAdmin: businessAdmin }
		);
		const newService = new Services(serviceBody);
		const createdService = await newService.save();
		return res.send({
			createdService,
			message: 'You have successfully created the service'
		});
	} catch (e) {
		return res.send(e);
	}
});

// GET method route
// View service from store (public)
router.get('/:businessId/service/:serviceId', async (req, res) => {
	const { businessId, serviceId } = req.params;
	if (!ObjectId.isValid(businessId) || !ObjectId.isValid(serviceId)) {
		return res.status(404).send();
	}
	try {
		const service = await Services.findOne({
			_id: serviceId,
			_businessId: businessId
		});
		if (!service) {
			return res.status(404).send({
				message: 'Service does not exist.'
			});
		}
		return res.send({ service });
	} catch (e) {
		return res.send(e);
	}
});

// EDIT method route
// Business can update a service (private)
router.patch(
	'/:businessId/service/:serviceId',
	authenticate,
	async (req, res) => {
		const { businessId, serviceId } = req.params;
		const businessAdmin = req.user._id;
		const body = _.pick(req.body, [
			'service_name',
			'service_price',
			'service_description',
			'service_category',
			'service_subcategory',
			'service_attributes',
			'availability',
			'published'
		]);
		if (req.account !== 'business account') {
			return res.status().send({ message: 'Unauthorized account' });
		}
		if (!ObjectId.isValid(businessId) || !ObjectId.isValid(serviceId)) {
			return res.status(404).send();
		}
		try {
			const service = await Services.findOneAndUpdate(
				{
					_businessId: businessId,
					_id: serviceId,
					_businessAdmin: businessAdmin
				},
				{ $set: body },
				{ new: true }
			);
			if (!service) {
				return res.status(404).send({
					message: 'Service does not exist.'
				});
			}
			return res.send({
				service,
				message: 'Service has been successfully updated'
			});
		} catch (e) {
			return res.send(e);
		}
	}
);

// Delete method Route
// Business role can delete service (private)
router.delete(
	'/:businessId/service/:serviceId',
	authenticate,
	async (req, res) => {
		const { businessId, serviceId } = req.params;
		const businessAdmin = req.user._id;
		if (req.account !== 'business account') {
			return res.status().send({ message: 'Unauthorized account' });
		}
		if (!ObjectId.isValid(businessId) || !ObjectId.isValid(serviceId)) {
			return res.status(404).send();
		}
		try {
			const service = await Services.findByIdAndDelete({
				_businessId: businessId,
				_id: serviceId,
				_businessAdmin: businessAdmin
			});
			if (!service) {
				return res.status(404).send({
					message: 'Service does not exist.'
				});
			}
			return res.send({
				service,
				message: 'Service has been successfully updated'
			});
		} catch (e) {
			return res.send(e);
		}
	}
);

// GET method route
// View all Services in the business (public)
router.get('/:businessId/services', async (req, res) => {
	const { businessId } = req.params;
	if (!ObjectId.isValid(businessId)) {
		return res.status(404).send();
	}
	try {
		const services = await Services.find({
			_businessId: businessId
		});
		if (!services) {
			return res.status(404).send({
				message: 'Services do not exist.'
			});
		}
		return res.send({
			services
		});
	} catch (e) {
		return res.send(e);
	}
});

module.exports = router;
