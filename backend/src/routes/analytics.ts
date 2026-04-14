import express from 'express'
import { getAnalytics, trackVisit, trackPageVisit } from '../controllers/analyticsController'
const router = express.Router()
router.get('/', getAnalytics)
router.post('/track-visit', trackVisit)
router.post('/track-page', trackPageVisit)
export default router
