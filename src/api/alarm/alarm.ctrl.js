import User from '../../models/user';

const getSortedList = (list) => {
  const sortedList = list.myList.sort((a, b) => {
    return new Date(a.releaseDate) - new Date(b.releaseDate);
  });
  return sortedList;
};

export const getUserInfo = async (ctx, next) => {
  const { user } = ctx.state;
  try {
    const userInfo = await User.findById(user._id).exec();
    if (!userInfo) {
      ctx.status = 404;
      return;
    }
    ctx.state.userInfo = userInfo;
    return next();
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const addToAlarm = async (ctx) => {
  const { user, userInfo } = ctx.state;
  const { body } = ctx.request;

  let duplicate = false;
  userInfo.myList.forEach((item) => {
    if (item.productId === body._id) {
      duplicate = true;
    }
  });

  try {
    if (duplicate) {
      ctx.status = 409;
      ctx.body = '이미 등록된 알람입니다.';
      return;
    } else {
      let newList = {
        productId: body._id,
        productName: body.productName,
        releaseDate: body.releaseDate,
        images: body.images,
        alarm: body.alarm,
      };
      const addedAlarm = await User.findByIdAndUpdate(
        user._id,
        {
          $push: { myList: newList },
        },
        { new: true },
      ).exec();
      if (!addedAlarm) {
        ctx.status = 404;
        return;
      }
      ctx.status = 201;
      ctx.body = addedAlarm.myList;
    }
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const listAlarms = async (ctx) => {
  const { userInfo } = ctx.state;

  const sortedList = getSortedList(userInfo);
  ctx.body = sortedList;
};

export const removeFromAlarm = async (ctx) => {
  const { user } = ctx.state;

  try {
    const removedAlarm = await User.findByIdAndUpdate(
      user._id,
      {
        $pull: { myList: { productId: ctx.params.id } },
      },
      { new: true },
    );
    if (!removedAlarm) {
      ctx.status = 404;
      return;
    }

    const sortedList = getSortedList(removedAlarm);
    ctx.body = sortedList;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const changeFromAlarm = async (ctx) => {
  const { user, userInfo } = ctx.state;
  const { productId } = ctx.request.body[0];

  userInfo.myList.forEach((item) => {
    if (item.productId === productId) {
      item.alarm ? (item.alarm = false) : (item.alarm = true);
    }
  });

  try {
    const updatedAlarmList = await User.findByIdAndUpdate(
      user._id,
      {
        myList: userInfo.myList,
      },
      { new: true },
    ).exec();

    if (!updatedAlarmList) {
      ctx.status = 404;
    }

    const sortedList = getSortedList(updatedAlarmList);
    ctx.body = sortedList;
  } catch (e) {
    ctx.throw(500, e);
  }
};
