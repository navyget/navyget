import mongoose from 'mongoose';

const SocialPostSchema = new mongoose.Schema({
	post_content: {
		type: String,
		required: true
	},
	post_author: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	// image_links: {},
	created_at: {
		type: Date
	},
	updated_at: {
		type: Date
	}
});

const SocialPosts = mongoose.model('SocialPosts', SocialPostSchema);

export default SocialPosts;
