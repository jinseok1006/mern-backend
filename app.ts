import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import router from './router';
import accessLog from './accessLog';
import cors from 'cors';
import session from 'express-session';
const app = express();

app.use(
  cors({
    origin: [/https?:\/\/localhost:[0-9]{4,5}\/?/, /https?:\/\/(.*\.)?jinseok.store\/?/],
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(accessLog);
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    saveUninitialized: false,
    resave: false,
  })
);

app.use('/', router);

app.use((req, res) => {
  res.status(404).end();
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).end();
});

export default app;
