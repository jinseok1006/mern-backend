import { Schema, Types, model } from 'mongoose';

export interface IBoard {
  type: string;
  next_id: number;
}

const BoardSchema = new Schema<IBoard>(
  {
    type: { type: String, required: true },
    next_id: { type: Number, required: true },
  },
  {
    collection: 'bbs_board',
  }
);

const BoardModel = model('Board', BoardSchema);
export default BoardModel;
