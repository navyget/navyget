import mongoose from 'mongoose';

const SocialCommentSchema = new mongoose.Schema({
	comment_content: {
		type: String,
		required: true
	},
	post_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	comment_author: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	created_at: {
		type: Date
	},
	updated_at: {
		type: Date
	}
});

const SocialPostsComments = mongoose.model('SocialPosts', SocialCommentSchema);

export default SocialPostsComments;
