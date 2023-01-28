import mongoose, { Schema } from 'mongoose';

const CommentSchema = new Schema({
  nickname: String,
  body: String,
  state: {
    type: Number,
    default: 0,
  },
  goodCount: Number,
  goodUsers: [String],
});

const ProductSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  productName: String,
  brandPage: String,
  price: Number,
  releaseDate: {
    type: Date,
  },
  images: [],
  leftDay: Number,
  comments: [CommentSchema],
  alarm: {
    type: Boolean,
    default: true,
  },
});

ProductSchema.index({ productName: 'text' });

const Product = mongoose.model('Product', ProductSchema);
export default Product;
