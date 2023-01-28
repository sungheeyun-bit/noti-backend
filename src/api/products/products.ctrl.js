import Product from '../../models/product';
import mongoose from 'mongoose';
import Joi from 'joi';
import moment from 'moment';

const date = new Date();
const today = moment(date).format();

const { ObjectId } = mongoose.Types;

export const getProductById = async (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400;
    return;
  }
  try {
    const product = await Product.findById(id).exec();
    if (!product) {
      ctx.status = 404;
      ctx.body = { message: 'product not found' };
      return;
    }
    ctx.state.product = product;
    return next();
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const detailProduct = async (ctx) => {
  ctx.body = ctx.state.product;
};

export const addProduct = async (ctx) => {
  const schema = Joi.object().keys({
    productName: Joi.string().required(),
    brandPage: Joi.string().required(),
    price: Joi.number().required(),
    releaseDate: Joi.date(),
    images: Joi.array(),
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }
  const product = new Product(ctx.request.body);

  try {
    await product.save();
    ctx.body = product;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const productList = async (ctx) => {
  const { limit, skip, searchTerm } = ctx.request.body;

  let limitNum = limit ? parseInt(limit) : 16;
  let skipNum = skip ? parseInt(skip) : 0;

  try {
    if (searchTerm) {
      const products = await Product.find({
        releaseDate: { $gte: today },
      })
        .find({
          $text: { $search: searchTerm },
        })
        .sort({ releaseDate: 1 })
        .skip(skipNum)
        .limit(limitNum)
        .exec();

      if (!products) {
        ctx.status = 400;
        ctx.body = '검색 결과가 없습니다.';
        return;
      }
      ctx.body = { products, postSize: products.length };
    } else {
      const products = await Product.find({ releaseDate: { $gte: today } })
        .sort({ releaseDate: 1 })
        .skip(skipNum)
        .limit(limitNum)
        .exec();

      if (!products) {
        ctx.status = 400;
        return;
      }

      ctx.body = { products, postSize: products.length };
    }
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const image = async (ctx) => {
  const { filename, path } = ctx.request.file;

  if (!ctx.request.file) {
    ctx.status = 400;
    ctx.body = {
      error: 'No file was provided in the request',
    };
    return;
  }
  ctx.body = {
    filePath: path,
    fileName: filename,
  };
};

