import { Request, Response } from 'express';
import Product from '../models/Product';
import Joi from 'joi';
import fs from 'fs';
import path from 'path';

const productSchema = Joi.object({
  brand: Joi.string().valid('Topicrem', 'Novexpert').required(),
  category: Joi.string().required(),
  images: Joi.array().items(Joi.string()).min(1).required(),
  price: Joi.number().min(0).required(),
  name: Joi.object({
    en: Joi.string().required(),
    ar: Joi.string().required(),
  }).required(),
  description: Joi.object({
    en: Joi.string().required(),
    ar: Joi.string().required(),
  }).required(),
  howToUse: Joi.object({
    en: Joi.string().required(),
    ar: Joi.string().required(),
  }).required(),
});

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { brand, category } = req.query;
    const filter: any = {};
    if (brand) filter.brand = new RegExp(`^${brand}$`, 'i');
    if (category) filter.category = category;

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('createProduct req.body:', req.body);
    console.log('createProduct req.files:', req.files);

    const files = req.files as Express.Multer.File[];
    let imageUrls: string[] = [];

    if (files && files.length > 0) {
      const cloudinary = require('../config/cloudinary');
      const uploadPromises = files.map(file =>
        cloudinary.uploader.upload(file.path, { folder: 'skincare-products' })
      );
      const results = await Promise.all(uploadPromises);
      imageUrls = results.map(result => result.secure_url);
      const fs = require('fs');
      files.forEach(file => { try { fs.unlinkSync(file.path); } catch {} });
    }

    // Accept pre-uploaded image URLs sent as strings in FormData
    if (imageUrls.length === 0 && req.body.images) {
      const imgs = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
      imageUrls = imgs.filter((i: string) => typeof i === 'string' && i.startsWith('http'));
    }

    const {
      nameEn, nameAr, brand, category,
      descriptionEn, descriptionAr,
      howToUseEn, howToUseAr,
      benefitsEn, benefitsAr,
      ingredientsEn, ingredientsAr,
      price, texture, skinType
    } = req.body;

    const productData = {
      name: { en: nameEn || '', ar: nameAr || nameEn || '' },
      brand,
      category: category || null,
      description: { en: descriptionEn || '', ar: descriptionAr || descriptionEn || '' },
      howToUse: { en: howToUseEn || '', ar: howToUseAr || howToUseEn || '' },
      benefits: { en: benefitsEn || '', ar: benefitsAr || benefitsEn || '' },
      ingredients: { en: ingredientsEn || '', ar: ingredientsAr || ingredientsEn || '' },
      price: Number(price) || 0,
      texture: texture || '',
      skinType: skinType || '',
      images: imageUrls,
    };

    const product = new Product(productData);
    await product.save();

    console.log('Product created:', product._id);
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    let imageUrls: string[] = [];

    // Handle image uploads if files are present
    if (files && files.length > 0) {
      const cloudinary = require('../config/cloudinary');
      const uploadPromises = files.map(file =>
        cloudinary.uploader.upload(file.path, {
          folder: 'skincare-products',
        })
      );

      const results = await Promise.all(uploadPromises);
      imageUrls = results.map(result => result.secure_url);

      // Clean up temp files
      const fs = require('fs');
      files.forEach(file => fs.unlinkSync(file.path));
    }

    // Get form data
    const {
      nameEn, nameAr, brand, category, descriptionEn, descriptionAr,
      howToUseEn, howToUseAr, benefitsEn, benefitsAr,
      ingredientsEn, ingredientsAr, price, texture, skinType,
      existingImages
    } = req.body;

    const productData: any = {
      name: { en: nameEn, ar: nameAr },
      brand,
      category: category || null,
      description: { en: descriptionEn, ar: descriptionAr },
      howToUse: { en: howToUseEn, ar: howToUseAr },
      benefits: { en: benefitsEn, ar: benefitsAr },
      ingredients: { en: ingredientsEn, ar: ingredientsAr },
      price: Number(price) || 0,
      texture,
      skinType,
    };

    // Handle images - use new uploads if present, otherwise keep existing
    if (imageUrls.length > 0) {
      productData.images = imageUrls;
    } else if (existingImages) {
      try {
        productData.images = JSON.parse(existingImages);
      } catch {
        productData.images = [];
      }
    }

    const product = await Product.findByIdAndUpdate(req.params.id, productData, { new: true });
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};