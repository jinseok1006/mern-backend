import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app';

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

mongoose
  .connect(process.env.MONGO_URL!)
  .then(() =>
    app.listen(port, '0.0.0.0', () => {
      console.log(`server is running http://localhost:${port}`);
    })
  )
  .catch((err) => console.error(`mongodb 연결 에러:${err}`));
