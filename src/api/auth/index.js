import Router from 'koa-router';
import * as authCtrl from './auth.ctrl';

const auth = new Router();

auth.post('/register', authCtrl.register);
auth.post('/login', authCtrl.login);
auth.post('/googleLogin', authCtrl.googleLogin);
auth.get('/check', authCtrl.check);
auth.post('/logout', authCtrl.logout);

export default auth;
