const isAdmin = (ctx, next) => {
  if (!ctx.state.user.isAdmin) {
    ctx.status = 403;
    ctx.body = 'Access denied. Not authorized...';
    return;
  }
  return next();
};

export default isAdmin;
