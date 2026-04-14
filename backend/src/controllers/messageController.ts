import { Request, Response } from 'express';
import Message from '../models/Message';
import mongoose from 'mongoose';

export const createMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;

    const newMessage = new Message({
      name,
      email,
      message,
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      message: 'Message saved successfully',
      data: newMessage,
    });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save message',
    });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Message.find().sort({ timestamp: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    let { id } = req.params

    // ✅ FIX: ensure id is always a string
    if (Array.isArray(id)) {
      id = id[0]
    }

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid message ID' })
    }

    const deleted = await Message.findByIdAndDelete(id)

    if (!deleted) {
      return res.status(404).json({ error: 'Message not found' })
    }

    res.json({ success: true })

  } catch (error) {
    console.error('Delete error:', error)
    res.status(500).json({ error: 'Failed to delete message' })
  }
};