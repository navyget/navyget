import mongoose from 'mongoose';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const _ = require('lodash');

const UserSchema = new mongoose.Schema({
	first_name: {
		type: String,
		required: true,
		minlength: 2,
		trim: true
	},
	middle_name: {
		type: String,
		minlength: 2, // fix this
		trim: true
	},
	last_name: {
		type: String,
		required: true,
		minlength: 2,
		trim: true
	},
	date_of_birth: {
		type: Date,
		required: true
	},
	username: {
		type: String,
		required: true,
		unique: true,
		minlength: 2,
		trim: true
	},
	email_address: {
		type: String,
		required: true,
		minlength: 5,
		trim: true,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email address'
		}
	},
	password: {
		type: String,
		required: true,
		minlength: 2
	},
	account_type: {
		type: String,
		required: true
	},
	role: [
		{
			access: {
				type: String,
				required: true
			},
			store_token: {
				type: String,
				required: true
			}
		}
	],
	tokens: [
		{
			access: {
				type: String,
				required: true
			},
			token: {
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
	last_login: {
		type: Date
	}
});

// pick out user information
// eslint-disable-next-line func-names
UserSchema.methods.toJson = function() {
	const user = this;
	const userObject = user.toObject(); // research this
	return _.pick(userObject, [
		'first_name',
		'middle_name',
		'last_name',
		'date_of_birth',
		'username',
		'email_address',
		'account_type'
	]);
};

// Generate Authentication Token
// eslint-disable-next-line func-names
UserSchema.methods.generateAuthToken = async function() {
	try {
		const user = this;
		const access = 'auth';
		const token = jwt
			.sign(
				{
					_id: user._id.toHexString(),
					account: user.account_type,
					access
				},
				process.env.JWT_SECRET
			)
			.toString();

		user.tokens = user.tokens.concat([{ access, token }]);

		const currentDate = new Date();
		user.last_login = currentDate;
		await user.save();
		return token;
	} catch (e) {
		throw new Error(e);
	}
};

// Remove authentication token
// eslint-disable-next-line func-names
UserSchema.methods.removeToken = function(token) {
	const user = this;

	return user.update({
		$pull: {
			tokens: {
				token
			}
		}
	});
};

// find user using token
// eslint-disable-next-line func-names
UserSchema.statics.findByToken = async function(token) {
	const User = this;
	let decoded;

	try {
		decoded = await jwt.verify(token, process.env.JWT_SECRET);
		return User.findOne({
			_id: decoded._id,
			account_type: decoded.account,
			'tokens.access': 'auth',
			'tokens.token': token
		});
	} catch (e) {
		return e;
	}
};

// find user by credentials
// eslint-disable-next-line func-names
UserSchema.statics.findByCredentials = async (email, password) => {
	const user = await Users.findOne({ email_address: email });
	if (!user) {
		throw new Error('Unable to find user');
	}
	const isMatch = await bcrypt.compare(password, user.password);

	if (!isMatch) {
		throw new Error('incorrect email or password.');
	}

	return user;
};

// hash user password before saving
// eslint-disable-next-line func-names
UserSchema.pre('save', async function(next) {
	const user = this;

	const currentDate = new Date();
	user.updated_at = currentDate;

	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
		return next();
	}
	return next();
});

const Users = mongoose.model('Users', UserSchema);

export default Users;
