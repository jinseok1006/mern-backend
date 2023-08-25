import { Schema, model, Types } from 'mongoose';
export interface IPost {
  board_id: Types.ObjectId;
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  password: string;
}

const PostSchmea = new Schema<IPost>(
  {
    board_id: { type: Schema.Types.ObjectId, required: true },
    id: { type: Number, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    password: { type: String, required: true },
  },
  { collection: 'bbs_posts' }
);

const PostModel = model<IPost>('Post', PostSchmea);
export default PostModel;
