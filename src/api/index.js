import Router from 'koa-router';
import products from './products';
import auth from './auth';
import alarm from './alarm';

const api = new Router();

api.use('/auth', auth.routes());
api.use('/alarm', alarm.routes());
api.use('/products', products.routes());

export default api;
