import mongoose from 'mongoose';

const SocialLikeSchema = new mongoose.Schema({
	post_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	created_at: {
		type: Date
	}
});

const SocialLike = mongoose.model('SocialPosts', SocialLikeSchema);

export default SocialLike;
