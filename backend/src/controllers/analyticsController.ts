import { Request, Response } from 'express';
import Visit from '../models/Visit';
import Order from '../models/Order';
import Product from '../models/Product';
import Message from '../models/Message';
import PageVisit from '../models/PageVisit';
import Visitor from '../models/Visitor';

export const trackVisit = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔥 TRACK VISIT CALLED');

    await Visitor.create({});

    res.status(200).json({ message: 'Visit tracked' });
  } catch (error) {
    console.error('❌ TRACK ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const [totalVisitors, totalOrders, totalProducts, totalMessages, pendingOrders, recentOrders] = await Promise.all([
      Visitor.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments({ isDeleted: { $ne: true } }),
      Message.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.find().sort({ timestamp: -1 }).limit(5),
    ]);

    const visitorTrends = await Visitor.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          visitors: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      },
      {
        $project: {
          date: '$_id',
          visitors: 1,
          _id: 0
        }
      }
    ]);

    const pageVisitDocs = await PageVisit.find().sort({ count: -1 }).limit(10);
    const pageVisits: Record<string, number> = {};
    pageVisitDocs.forEach(p => { pageVisits[p.page] = p.count; });

    res.status(200).json({
      totalVisitors,
      totalOrders,
      totalProducts,
      totalMessages,
      pendingOrders,
      visitorTrends,
      pageVisits,
      recentOrders,
    });
  } catch (error) {
    console.error('❌ ANALYTICS ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const trackPageVisit = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page } = req.body;
    if (!page) { res.status(400).json({ message: 'Page required' }); return; }
    await PageVisit.findOneAndUpdate(
      { page },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );
    await Visitor.create({});
    res.status(200).json({ message: 'Tracked' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};