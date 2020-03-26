import mongoose from 'mongoose';

const EventsSchema = new mongoose.Schema({
	event_name: {
		type: String,
		required: true,
		trim: true
	},
	event_description: {
		type: String,
		required: true,
		trim: true
	},
	event_type: {
		type: String,
		required: true
	},
	event_date_start: {
		type: Date,
		required: true
	},
	event_date_end: {
		type: Date,
		required: true
	},
	event_agenda: [
		{
			date: {
				type: Date
			},
			start_time: {
				type: Date
			},
			end_time: {
				type: Date
			},
			agenda_topic: {
				type: String,
				required: true,
				trim: true
			},
			about: {
				type: String,
				trim: true
			},
			tags: [
				{
					type: String,
					required: true,
					trim: true
				}
			],
			location: {
				type: String,
				required: true
			},
			personality: {
				type: String,
				required: true
			},
			personality_title: {
				type: String,
				required: true
			}
		}
	],
	event_location: {
		type: String,
		required: true
	},
	requirements: [
		{
			requirement: {
				type: String,
				required: true
			}
		}
	],
	charges: [
		{
			category_name: {
				type: String,
				required: true
			},
			category_value: {
				type: String,
				required: true
			}
		}
	],
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

// eslint-disable-next-line func-names
EventsSchema.pre('save', function (next) {
	const event = this;
	const currentDate = new Date();
	event.updated_at = currentDate;
	next();
});

// eslint-disable-next-line func-names
EventsSchema.pre('findOneAndUpdate', function (next) {
	const event = this;
	event.update({}, { $set: { updated_at: new Date() } });
	next();
});

const Events = mongoose.model('Events', EventsSchema);

export default Events;
