import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

  async findAll(query: any, page: number, limit: number): Promise<any> {
    const skip = (page - 1) * limit;  // Calcular cuántos documentos saltar según la página

    const filters = {};
    if (query.brand) filters['brand'] = query.brand;
    if (query.category) filters['category'] = query.category;

    const [totalItems, data] = await Promise.all([
      this.productModel.countDocuments(filters),  // Contar el total de productos con esos filtros
      this.productModel.find(filters)             // Obtener los productos con paginación
        .skip(skip)
        .limit(limit)
        .exec(),
    ]);

    return {
      totalItems,
      itemCount: data.length,
      totalPages: Math.ceil(totalItems / limit),
      data,
    };
  }




  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) throw new NotFoundException(`Product with ID ${id} not found`);
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = new this.productModel(createProductDto);
    return newProduct.save();
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }).exec();
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updatedProduct;
  }

  async remove(id: string): Promise<Product> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
    if (!deletedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return deletedProduct;
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
