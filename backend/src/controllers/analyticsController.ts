import { Request, Response } from 'express';
import Visit from '../models/Visit';
import Order from '../models/Order';
import Product from '../models/Product';
import Message from '../models/Message';

export const trackVisit = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔥 TRACK VISIT CALLED');

    const dateString = new Date().toISOString().split('T')[0];

    await Visit.findOneAndUpdate(
      { date: dateString },
      { $inc: { count: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ message: 'Visit tracked' });
  } catch (error) {
    console.error('❌ TRACK ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const [totalVisitors, totalOrders, totalProducts, totalMessages, pendingOrders, recentOrders] = await Promise.all([
      Visit.aggregate([{ $group: { _id: null, total: { $sum: '$count' } } }]).then(result => result[0]?.total || 0),
      Order.countDocuments(),
      Product.countDocuments(),
      Message.countDocuments(),
      Order.countDocuments({ status: 'Pending' }),
      Order.find().sort({ timestamp: -1 }).limit(5).select('customerName productName status timestamp')
    ]);

    const visitorTrends = await Visit.find().sort({ date: 1 }).select('date count').then(visits =>
      visits.map(v => ({ date: v.date, visitors: v.count }))
    );

    res.status(200).json({
      totalVisitors,
      totalOrders,
      totalProducts,
      totalMessages,
      pendingOrders,
      visitorTrends,
      pageVisits: {},
      recentOrders
    });
  } catch (error) {
    console.error('❌ ANALYTICS ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};