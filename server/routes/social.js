import express from 'express';
import { ObjectID } from 'mongodb';
import * as _ from 'lodash';
import SocialPosts from '../models/socialPost';
import SocialPostsComments from '../models/socialComment';
import SocialLike from '../models/socialLike';
import authenticate from '../middleware/authenticate';

const router = express.Router();

// POST method route
// Create a post on account timeline
router.post('/social', authenticate, async (req, res) => {});

// GET method route
// retrieve a single social post
router.get('/social/:postId', async (req, res) => {});

// GET method route
// retrieve all social posts of an account
router.get('/social/:accountId', async (req, res) => {});

// EDIT, PATCH method route
// edit a social post
router.patch('/social/:postId', authenticate, async (req, res) => {});

// DELETE method route
// edit a social post
router.delete('/social/:postId', authenticate, async (req, res) => {});

/** ***** Comments endpoints ***** */
// POST method route
// Create a comment on a post
router.post('/social/comment', authenticate, async (req, res) => {});

// GET method route
// Get all comments assosiated with a post
router.get('/social/:postId/comments', async (req, res) => {});

// PATCH method route
// Edit a comment
router.patch(
	'/social/comment/:commentId',
	authenticate,
	async (req, res) => {}
);

// DELETE method route
// Delete a comment
router.delete(
	'/social/comment/:commentId',
	authenticate,
	async (req, res) => {}
);

/** ***** Like/Unlike endpoints ***** */
// POST method route
// Like a post
router.post('/social/comment/like', authenticate, async (req, res) => {});

// Delete method route
// Unlike a post
router.delete('/social/:postId/comments', async (req, res) => {});

export default router;