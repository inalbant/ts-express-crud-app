import { Router } from 'express';
import { body } from 'express-validator';
import {
    createProduct,
    deleteProduct,
    getOneProduct,
    getProducts,
    updateProduct,
} from './handlers/product';
import {
    createUpdate,
    deleteUpdate,
    editUpdate,
    getOneUpdate,
    getUpdates,
} from './handlers/update';
import { handleInputError } from './utils/middleware';

export const router = Router();

// Product
router.get('/product', getProducts);
router.get('/product/:id', getOneProduct);
router.put(
    '/product/:id',
    body('name').isString(),
    handleInputError,
    updateProduct
);
router.post(
    '/product',
    body('name').isString(),
    handleInputError,
    createProduct
);
router.delete('/product/:id', deleteProduct);

// Update
router.get('/update', getUpdates);
router.get('/update/:id', getOneUpdate);
router.put(
    '/update/:id',
    body('title').optional(),
    body('body').optional(),
    body('status').isIn(['IN_PROGRESS', 'SHIPPED', 'DEPRECATED']).optional(),
    body('version').optional(),
    editUpdate
);
router.post(
    '/update',
    body('title').exists().isString(),
    body('body').exists().isString(),
    body('productId').exists().isString(),
    createUpdate
);
router.delete('/update/:id', deleteUpdate);

// Update Point
router.get('/updatepoint', () => {});

router.get('/updatepoint/:id', () => {});

router.put('/updatepoint/:id', () => {});

router.post('/updatepoint', () => {});

router.delete('/updatepoint/:id', () => {});
