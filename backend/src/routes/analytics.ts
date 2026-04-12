import express from 'express'
import { getAnalytics, trackVisit } from '../controllers/analyticsController'
import auth from '../middleware/auth'

const router = express.Router()

router.get('/', auth, getAnalytics)
router.post('/track-visit', trackVisit)

export default router