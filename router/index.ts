import express, { Request, Response } from 'express';
import postRouter from './post';
import AccessLogModel from '../models/accessLog';

const router = express.Router();
router.get('/', (req, res) => {
  res.status(403).end();
});

router.use('/posts', postRouter);

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

const getRobotsTxt = (req: Request, res: Response) => {
  res.set('Content-Type', 'text/plain').send('User-agent: *\nDisallow: /');
};

router.get('/access-log', getAccessLog);
router.get('/robots.txt', getRobotsTxt);

export default router;
