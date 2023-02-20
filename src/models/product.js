import mongoose, { Schema } from 'mongoose';

const ProductSchema = new Schema({
  brand: String,
  productName: String,
  engProductName: String,
  brandPage: String,
  price: String,
  releaseDate: {
    type: Date,
  },
  images: [],
  leftDay: Number,
  alarm: {
    type: Boolean,
    default: true,
  },
});

ProductSchema.index({
  engProductName: 'text',
  productName: 'text',
  brand: 'text',
});

const Product = mongoose.model('Product', ProductSchema);
export default Product;


