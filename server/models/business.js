import mongoose from 'mongoose';

const BusinessSchema = mongoose.Schema({
	business_name: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	business_type: {
		type: String,
		required: true,
		trim: true
	},
	business_description: {
		type: String,
		required: true,
		trim: true
	},
	business_category: [
		{
			category: {
				type: String,
				required: true,
				trim: true
			}
		}
	],
	business_subcategory: [
		{
			subcategory: {
				type: String,
				required: true,
				trim: true
			}
		}
	],
	location: [
		{
			title: {
				type: String,
				required: true
			},
			area: {
				type: String,
				required: true
			},
			physical_address: {
				type: String,
				required: true
			},
			town_city: {
				type: String,
				required: true
			},
			county: {
				type: String,
				required: true
			},
			country: {
				type: String,
				required: true
			},
			weekdays: {
				type: String,
				required: true
			},
			saturdays: {
				type: String,
				required: true
			},
			sundays: {
				type: String,
				required: true
			},
			public_holidays: {
				type: String,
				required: true
			}
		}
	],
	created_at: {
		type: Date
	},
	updated_at: {
		type: Date
	},
	_business_admin: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	}
});

// update updated_at on creation

// eslint-disable-next-line func-names
BusinessSchema.pre('save', function (next) {
	const business = this;
	const currentDate = new Date();
	business.updated_at = currentDate;
	next();
});

// eslint-disable-next-line func-names
BusinessSchema.pre('findOneAndUpdate', function (next) {
	const business = this;
	business.update({}, { $set: { updated_at: new Date() } });
	next();
});

const Businesses = mongoose.model('Businesses', BusinessSchema);

export default Businesses;
