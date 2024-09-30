import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

  async findAll(query): Promise<Product[]> {
    const filters = {};
    if (query.brand) filters['brand'] = query.brand;
    if (query.category) filters['category'] = query.category;
    return this.productModel.find(filters).exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = new this.productModel(createProductDto);
    return newProduct.save();
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const existingProduct = await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true });
    if (!existingProduct) throw new NotFoundException('Product not found');
    return existingProduct;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Product not found');
  }

  async findByBrand(brand: string): Promise<Product[]> {
    return this.productModel.find({ brand }).exec();
  }

  async findByCategory(category: string): Promise<Product[]> {
    return this.productModel.find({ category }).exec();
  }

  async findByPriceRange(min: number, max: number): Promise<Product[]> {
    return this.productModel.find({ price: { $gte: min, $lte: max } }).exec();
  }
}
