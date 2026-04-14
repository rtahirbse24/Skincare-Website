import express from 'express'
import Visitor from '../models/Visitor'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    await Visitor.create({})
    res.status(201).json({ success: true })
  } catch (error) {
    console.error('Visitor error:', error)
    res.status(500).json({ error: 'Failed to track visitor' })
  }
})

router.get('/count', async (req, res) => {
  try {
    const count = await Visitor.countDocuments()
    res.json({ count })
  } catch (error) {
    res.status(500).json({ error: 'Failed to count visitors' })
  }
})

export default router
