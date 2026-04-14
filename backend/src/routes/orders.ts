import express from 'express'
import mongoose from 'mongoose'
import Order from '../models/Order'

const router = express.Router()

// GET ORDERS
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    return res.json(orders)
  } catch (error: any) {
    console.error('GET /orders ERROR:', error.message)
    return res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

// POST ORDER - save new order to MongoDB
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body)
    await order.save()
    console.log('Order saved:', order._id)
    return res.status(201).json({ success: true, data: order })
  } catch (error: any) {
    console.error('POST /orders ERROR:', error.message)
    return res.status(500).json({ success: false, message: 'Failed to create order' })
  }
})

// COMPLETE ORDER - update status
router.put('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndUpdate(
      id,
      { status: 'completed' }, // ✅ MATCHES SCHEMA
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.json({ success: true, data: order });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to complete order' });
  }
});

const updateOrderStatusHandler = async (req: express.Request, res: express.Response) => {
  try {
    const idRaw = req.params.id
    const id = Array.isArray(idRaw) ? idRaw[0] : idRaw
    const { status } = req.body

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid order ID' })
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' })
    }

    return res.json(updatedOrder)
  } catch (error: any) {
    console.error('PUT /orders ERROR:', error.message)
    return res.status(500).json({ error: 'Failed to update order' })
  }
}

router.put('/:id', updateOrderStatusHandler)
router.put('/:id/status', updateOrderStatusHandler)

export default router