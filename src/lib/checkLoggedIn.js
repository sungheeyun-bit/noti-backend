const checkLoggedIn = (ctx, next) => {
  console.log('유저', ctx.state.user);
  if (!ctx.state.user) {
    ctx.status = 401;
    return;
  }
  return next();
};

export default checkLoggedIn;
