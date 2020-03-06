import mongoose from 'mongoose';

const ProductSchema = mongoose.Schema({
	product_name: {
		type: String,
		required: true,
		trim: true
	},
	product_price: {
		type: Number,
		required: true
	},
	product_description: {
		type: String,
		required: true,
		trim: true
	},
	product_category: {
		type: String,
		required: true
	},
	product_subcategory: {
		type: String,
		required: true
	},
	product_attributes: [
		{
			attribute_name: {
				type: String,
				required: true
			},
			attribute_value: {
				type: String,
				required: true
			}
		}
	],
	availability: {
		type: Boolean,
		required: true
	},
	published: {
		type: Boolean,
		required: true
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	updated_at: {
		type: Date
	},
	_businessId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'Stores'
	},
	_businessAdmin: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	}
});

// update update_at on creation.

// eslint-disable-next-line func-names
ProductSchema.pre('save', function (next) {
	const product = this;
	const currentDate = new Date();
	product.updated_at = currentDate;
	next();
});

// eslint-disable-next-line func-names
ProductSchema.pre('findOneAndUpdate', function (next) {
	const product = this;
	product.update({}, { $set: { updated_at: new Date() } });
	next();
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;
