import mongoose from 'mongoose';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const _ = require('lodash');

const UserSchema = mongoose.Schema({
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

/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

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
		'account_type',
		'role'
	]);
};

// Generate Authentication Token
// eslint-disable-next-line func-names
UserSchema.methods.generateAuthToken = function() {
	const user = this;
	const access = 'auth';
	const token = jwt
		.sign(
			{
				_id: user._id.toHexString(),
				account: user.account_type,
				role: user.role,
				access
			},
			process.env.JWT_SECRET
		)
		.toString();

	user.tokens = user.tokens.concat([{ access, token }]);

	const currentDate = new Date();
	user.last_login = currentDate;

	return user.save().then(() => token);
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
UserSchema.statics.findByToken = function(token) {
	const User = this;
	let decoded;

	try {
		decoded = jwt.verify(token, process.env.JWT_SECRET);
	} catch (e) {
		return Promise.reject(e);
	}

	return User.findOne({
		_id: decoded._id,
		account_type: decoded.account,
		'tokens.access': 'auth',
		'tokens.token': token
	});
};

// find user by credentials
// eslint-disable-next-line func-names
UserSchema.statics.findByCredentials = function(email, password) {
	const User = this;

	return User.findOne({ email }).then(user => {
		if (!user) {
			return Promise.reject();
		}

		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, res) => {
				if (res) {
					resolve(user);
				} else {
					reject(err);
				}
			});
		});
	});
};

// hash user password before saving
// eslint-disable-next-line func-names
UserSchema.pre('save', function(next) {
	const user = this;

	const currentDate = new Date();
	user.updated_at = currentDate;

	if (user.isModified('password')) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, hash => {
				if (err) {
					return err;
				}
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}
});

const Users = mongoose.model('Users', UserSchema);

export default Users;
