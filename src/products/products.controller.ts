import { Controller, Get, Post, Patch, Delete, Param, Query, Body, HttpCode, HttpStatus, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('api/v1/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query) {
    try {
      const products = await this.productsService.findAll(query);
      return {
        statusCode: HttpStatus.OK,
        message: 'Products retrieved successfully',
        data: products,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error retrieving products: ${error.message}`,
      });
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    try {
      const product = await this.productsService.findOne(id);
      if (!product) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: `Product with ID ${id} not found`,
        });
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Product retrieved successfully',
        data: product,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error retrieving product: ${error.message}`,
      });
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      const product = await this.productsService.create(createProductDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Product created successfully',
        data: product,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error creating product: ${error.message}`,
      });
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    try {
      const updatedProduct = await this.productsService.update(id, updateProductDto);
      if (!updatedProduct) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: `Product with ID ${id} not found`,
        });
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Product updated successfully',
        data: updatedProduct,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error updating product: ${error.message}`,
      });
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    try {
      const deleted = await this.productsService.remove(id);
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: 'Product deleted successfully',
        data: deleted, // Retorna el producto eliminado si es necesario
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error deleting product: ${error.message}`,
      });
    }
  }

  @Get('/brand/:brand')
  @HttpCode(HttpStatus.OK)
  async findByBrand(@Param('brand') brand: string) {
    try {
      const products = await this.productsService.findByBrand(brand);
      return {
        statusCode: HttpStatus.OK,
        message: 'Products retrieved successfully',
        data: products,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error retrieving products by brand: ${error.message}`,
      });
    }
  }

  @Get('/category/:category')
  @HttpCode(HttpStatus.OK)
  async findByCategory(@Param('category') category: string) {
    try {
      const products = await this.productsService.findByCategory(category);
      return {
        statusCode: HttpStatus.OK,
        message: 'Products retrieved successfully',
        data: products,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error retrieving products by category: ${error.message}`,
      });
    }
  }

  @Get('/price-range')
  @HttpCode(HttpStatus.OK)
  async findByPriceRange(@Query('min') min: number, @Query('max') max: number) {
    try {
      const products = await this.productsService.findByPriceRange(min, max);
      return {
        statusCode: HttpStatus.OK,
        message: 'Products retrieved successfully',
        data: products,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error retrieving products by price range: ${error.message}`,
      });
    }
  }
}
