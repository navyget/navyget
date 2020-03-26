import express from 'express';
import { ObjectId } from 'mongodb';
import * as _ from 'lodash';
import Businesses from '../models/business';
import Products from '../models/products';
import authenticate from '../middleware/authenticate';

const router = express.Router();

// POST method route
// business role can create a product (private)
router.post('/:businessId/create', authenticate, async (req, res) => {
	const { businessId } = req.params;
	const businessAdmin = req.user._id;
	const body = _.pick(req.body, [
		'product_name',
		'product_price',
		'product_description',
		'product_category',
		'product_subcategory',
		'product_attributes',
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
		const product = await Products.findOne({
			product_name: body.product_name,
			_businessId: businessId
		});
		if (product) {
			return res
				.status(409)
				.send({ message: 'Product already exists in database' });
		}
		const productBody = Object.assign(
			{},
			body,
			{ _businessId: businessId },
			{ _businessAdmin: businessAdmin }
		);
		const newProduct = new Products(productBody);
		const createdProduct = await newProduct.save();
		return res.send({
			createdProduct,
			message: 'You have successfully created the product'
		});
	} catch (e) {
		return res.send(e);
	}
});

// GET method route
// Get product from store (public)
router.get('/:businessId/:productId', async (req, res) => {
	const { businessId, productId } = req.params;
	if (!ObjectId.isValid(businessId) || !ObjectId.isValid(productId)) {
		return res.status(404).send();
	}
	try {
		const product = await Products.findOne({
			_id: productId,
			_businessId: businessId
		});
		if (!product) {
			return res.status(404).send({
				message: 'Product does not exist.'
			});
		}
		return res.send({ product });
	} catch (e) {
		return res.send(e);
	}
});

// EDIT method route
// Business can update a product (private)
router.patch('/:businessId/:productId', authenticate, async (req, res) => {
	const { businessId, productId } = req.params;
	const businessAdmin = req.user._id;
	const body = _.pick(req.body, [
		'product_name',
		'product_price',
		'product_description',
		'product_category',
		'product_subcategory',
		'product_attributes',
		'availability',
		'published'
	]);
	if (req.account !== 'business account') {
		return res.status().send({ message: 'Unauthorized account' });
	}
	if (!ObjectId.isValid(businessId) || !ObjectId.isValid(productId)) {
		return res.status(404).send();
	}
	try {
		const product = await Products.findOneAndUpdate(
			{
				_businessId: businessId,
				_id: productId,
				_businessAdmin: businessAdmin
			},
			{ $set: body },
			{ new: true }
		);
		if (!product) {
			return res.status(404).send({
				message: 'Product does not exist.'
			});
		}
		return res.send({
			product,
			message: 'Product has been successfully updated'
		});
	} catch (e) {
		return res.send(e);
	}
});

// Delete method Route
// Business role can delete product (private)
router.delete('/:businessId/:productId', authenticate, async (req, res) => {
	const { businessId, productId } = req.params;
	const businessAdmin = req.user._id;
	if (req.account !== 'business account') {
		return res.status().send({ message: 'Unauthorized account' });
	}
	if (!ObjectId.isValid(businessId) || !ObjectId.isValid(productId)) {
		return res.status(404).send();
	}
	try {
		const product = await Products.findByIdAndDelete({
			_businessId: businessId,
			_id: productId,
			_businessAdmin: businessAdmin
		});
		if (!product) {
			return res.status(404).send({
				message: 'Product does not exist.'
			});
		}
		return res.send({
			product,
			message: 'Product has been successfully updated'
		});
	} catch (e) {
		return res.send(e);
	}
});

// GET method route
// View all Products in the business (public)
router.get('/:businessId/products', async (req, res) => {
	const { businessId } = req.params;
	if (!ObjectId.isValid(businessId)) {
		return res.status(404).send();
	}
	try {
		const products = await Products.find({
			_businessId: businessId
		});
		if (!products) {
			return res.status(404).send({
				message: 'Products does not exist.'
			});
		}
		return res.send({
			products
		});
	} catch (e) {
		return res.send(e);
	}
});

export default router;
