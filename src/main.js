require('dotenv').config();
import Koa from 'koa';
import Router from 'koa-router';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import serve from 'koa-static';
import mount from 'koa-mount';

import api from './api/index.js';
import jwtMiddleware from './lib/jwtMiddleware.js';

const { PORT, MONGO_URL } = process.env;

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((e) => {
    console.log(e);
  });

const app = new Koa();
const router = new Router();

router.use('/api', api.routes());
app.use(cors());

app.use(bodyParser());
app.use(jwtMiddleware);

app.use(router.routes()).use(router.allowedMethods());

app.use((ctx) => {
  ctx.body = 'Hello World';
});

app.proxy = true;
app.use(mount('/uploads', serve('uploads')));

const port = PORT || 4000;
app.listen(port, () => {
  console.log('Listening to port 4000', port);
});
