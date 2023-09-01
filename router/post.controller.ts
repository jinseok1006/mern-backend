import { Request, Response, NextFunction } from 'express';
import BoardModel, { IBoard } from '../models/board';
import PostModel, { IPost } from '../models/post';

export function invalidPost(req: Request, res: Response, next: NextFunction) {
  console.log('invaliPost 거쳐감');
  const postId = parseInt(req.params.id);
  if (isNaN(postId))
    return res
      .status(400)
      .json({ message: 'invalid post id', use: 'invalidPost middleware' });
  return next();
}

export const deletePost = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id!);
  const { allowedPost } = req.session;
  if (allowedPost !== postId) {
    return res
      .status(403)
      .json({ message: `no permission for post ${postId}.` });
  }

  try {
    const deleted = await PostModel.deleteOne({ id: postId });
    if (!deleted)
      return res.status(404).json({ message: `Post ${postId} not found.` });
    return res.json({ postId, message: 'deleted successfully.' });
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const modifyPost = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id!);
  const { title, content } = req.body;
  const { allowedPost } = req.session;

  if (!title || !content)
    return res.status(400).json({ message: '필드가 부족합니다.' });
  if (allowedPost !== postId)
    return res
      .status(402)
      .json({ message: `no permission for post ${postId}` });

  try {
    const updated = await PostModel.findOneAndUpdate(
      { id: postId },
      { $set: { title: title, content: content } },
      { $new: true, projection: { __v: false, _id: false } }
    );

    if (!updated)
      return res.status(404).json({ message: `Post ${postId} not found.` });
    return res.json({ message: 'updated successfully.' });
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const getPost = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id!);

  try {
    const post = await PostModel.findOne(
      { id: postId },
      { _id: false, password: false, __v: false }
    );
    if (!post) return res.status(404).json({ message: '포스트 없음' });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.send(err);
  }
};

export const createPost = async (req: Request, res: Response) => {
  const { title, content, author, password } = req.body;
  if (!title || !content || !author || !password)
    return res.status(400).json({ message: '필드가 부족합니다.' });

  try {
    const board = await BoardModel.findOneAndUpdate(
      { type: '자유게시판' },
      { $inc: { next_id: 1 } },
      { projection: { next_id: true } }
    );

    if (!board) throw new Error('해당하는 boardModel이 존재하지 않음');

    const newPost: IPost = {
      board_id: board._id,
      title,
      content,
      author,
      password,
      createdAt: new Date(),
      id: board.next_id,
    };

    const created = await PostModel.create(newPost);
    // 일부 필드만 보이게 출력
    const createdProjection = await PostModel.find(
      { _id: created._id },
      { _id: false, __v: false }
    );
    res.json(createdProjection);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await PostModel.find({}, { _id: false });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const authenticatePost = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id!);
  const password = req.body.password;

  if (isNaN(postId))
    return res.status(400).json({ message: 'invalid post id.' });
  try {
    const post = await PostModel.findOne({ id: postId });
    if (!post) return res.status(404).json({ message: 'there is no a post.' });

    console.log(password, post.password);

    if (post.password !== password)
      return res
        .status(401)
        .json({ message: 'mismatch of password for post.' });

    req.session.allowedPost = postId;
    res.json({ allowedPost: postId });
  } catch (err) {
    console.error(err);
  }
};
