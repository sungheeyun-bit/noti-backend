import Router from 'koa-router';
import * as productsCtrl from './products.ctrl';
import multer from '@koa/multer';
import isAdmin from '../../lib/checkIsAdmin';

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

const products = new Router();
products.post('/productList', productsCtrl.productList);

products.post('/upload', isAdmin, productsCtrl.addProduct);

products.post('/image', upload.single('file'), productsCtrl.image);
products.get(
  '/detail/:id',
  productsCtrl.getProductById,
  productsCtrl.detailProduct,
);

export default products;
