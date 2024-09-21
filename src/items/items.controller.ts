/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { Item } from './entities/items.entity';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  // Create Item
  @Post()
  create(@Body() createItemDto: CreateItemDto): Item {
    return this.itemsService.create(createItemDto);
  }

  // Get All Items
  @Get()
  findAll(): Item[] {
    return this.itemsService.findAll();
  }

  // Get One Item
  @Get(':id')
  findOne(@Param('id') id: number): Item {
    return this.itemsService.findOne(Number(id));
  }

  // Update Item
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateItemDto: Partial<CreateItemDto>,
  ): Item {
    return this.itemsService.update(Number(id), updateItemDto);
  }

  // Delete Item
  @Delete(':id')
  delete(@Param('id') id: number): void {
    this.itemsService.delete(Number(id));
  }
}
