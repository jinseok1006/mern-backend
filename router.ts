import express, { Request, Response } from 'express';
import AccessLogModel from './models/accessLog';

import {
  getPosts,
  createPost,
  getPost,
  modifyPost,
  deletePost,
  authenticatePost,
  invalidPost,
} from './board.controller';
import PostModel from './models/post';

const router = express.Router();
router.get('/', (req, res) => {
  res.status(403).end();
});

const postRouter = express.Router();

router.use('/posts', postRouter);

postRouter.route('/').get(getPosts).post(createPost);

postRouter.route('/:id').all(invalidPost).get(getPost).put(modifyPost).delete(deletePost);
postRouter.route('/:id/auth').post(authenticatePost);

const getAccessLog = async (req: Request, res: Response) => {
  const accessLogsPerPage = 35;
  const requestedPage = req.query.page ? parseInt(req.query.page as string) : 1;
  if (isNaN(requestedPage))
    return res.status(400).json({ message: '엑세스 로그 페이지가 잘못됨.' });

  try {
    const accessLog = await AccessLogModel.find({}, { _id: false, __v: false })
      .sort({ timestamp: -1 })
      .skip((requestedPage - 1) * accessLogsPerPage)
      .limit(accessLogsPerPage)
      .lean();
    if (!accessLog) return res.status(404).json({ message: '로그 없음' });
    const totalAccessLogs = await AccessLogModel.find({}).count();

    const maskedAccessLogs = accessLog.map((log) => ({
      ...log,
      ipAddress: log.ipAddress.split('.').slice(0, 2).join('.') + '.*.*',
    }));

    const totalPages = Math.ceil(totalAccessLogs / accessLogsPerPage);
    const response = {
      logs: maskedAccessLogs,
      totalPages,
    };
    res.json(response);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e });
  }
};

router.get('/access-log', getAccessLog);

export default router;
