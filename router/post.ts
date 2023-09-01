import express from 'express';
import {
  getPosts,
  createPost,
  getPost,
  modifyPost,
  deletePost,
  authenticatePost,
  invalidPost,
} from './post.controller';

const postRouter = express.Router();
postRouter.route('/').get(getPosts).post(createPost);
postRouter
  .route('/:id')
  .all(invalidPost)
  .get(getPost)
  .put(modifyPost)
  .delete(deletePost);
postRouter.route('/:id/auth').post(authenticatePost);

export default postRouter;
