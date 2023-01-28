import Joi from 'joi';
import User from '../../models/user';

export const register = async (ctx) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { email, password } = ctx.request.body;
  try {
    const exists = await User.findByEmail(email);
    if (exists) {
      ctx.status = 409;
      ctx.body = '이미 가입된 이메일입니다.';
      return;
    }

    const user = new User({
      email,
    });
    await user.setPassword(password);
    await user.save();

    ctx.body = user.serialize();

    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const login = async (ctx) => {
  const { email, password } = ctx.request.body;

  if (!email || !password) {
    ctx.status = 401;
    return;
  }

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      ctx.status = 401;
      ctx.body = '존재하지 않는 이메일입니다.';
      return;
    }
    const valid = await user.checkPassword(password);
    if (!valid) {
      ctx.status = 401;
      ctx.body = '비밀번호를 잘못 입력했습니다.';
      return;
    }
    ctx.body = user.serialize();

    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const check = async (ctx) => {
  const { user } = ctx.state;
  if (!user) {
    ctx.status = 401;
    return;
  }
  ctx.body = user;
};

export const logout = async (ctx) => {
  ctx.cookies.set('access_token');
  ctx.status = 204;
};

export const googleLogin = async (ctx) => {
  const { email } = ctx.request.body;
  try {
    const exists = await User.findByEmail(email);
    if (!exists) {
      const user = new User({ email });
      await user.save();

      ctx.body = user;

      const token = user.generateToken();
      ctx.cookies.set('access_token', token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
      });
      return;
    }

    ctx.body = exists.serialize();
    const token = exists.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};
