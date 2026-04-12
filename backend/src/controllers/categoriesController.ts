import { Request, Response } from 'express';
import Category from '../models/Category';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ brand: 1, name: 1 });

    // Group by brand
    const grouped: Record<string, string[]> = {};
    categories.forEach(cat => {
      if (!grouped[cat.brand]) {
        grouped[cat.brand] = [];
      }
      grouped[cat.brand].push(cat.name);
    });

    res.status(200).json({
      success: true,
      data: grouped,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
    });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { brand, name } = req.body;

    if (!brand || !name) {
      return res.status(400).json({
        success: false,
        message: 'Brand and name are required',
      });
    }

    const category = new Category({ brand, name });
    await category.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error: any) {
    console.error('Error creating category:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists for this brand',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create category',
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { brand, name } = req.body;

    if (!brand || !name) {
      return res.status(400).json({
        success: false,
        message: 'Brand and name are required',
      });
    }

    const category = await Category.findOneAndDelete({ brand, name });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
    });
  }
};