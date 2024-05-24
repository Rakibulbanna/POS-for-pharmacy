import {
  createPurchaseOrder,
  getPurchaseOrder,
  updatePurchaseOrder,
  GetProductOnPurchaseOrder,
  PurchaseReceive, DirectReceive,
  Index,
  IndexPurchasReceive
} from '../controllers/purchaseOrder';

const express = require('express');

export const purchaseRouter = express.Router();


purchaseRouter.get("/", Index)
purchaseRouter.get("/product-on-order-purchase", GetProductOnPurchaseOrder)
purchaseRouter.get('/:supplierId',getPurchaseOrder)
purchaseRouter.post('/',createPurchaseOrder)
purchaseRouter.patch('/', updatePurchaseOrder)
purchaseRouter.patch("/:id/po-receive", PurchaseReceive)
purchaseRouter.get("/:id/receive", IndexPurchasReceive)
purchaseRouter.post("/direct-receive", DirectReceive)


// practice BANNA
// purchaseRouter.get('/test/wd',practicetesting);