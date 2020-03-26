import { Users } from '../models';

const authenticate = async (req, res, next) => {
	const token = req.header('x-auth');
	try {
		const user = await Users.findByToken(token);
		req.user = user;
		req.token = token;
		req.account = user.account_type;
		return next();
	} catch (e) {
		return res.status(401).send(e);
	}
};

export default authenticate;
