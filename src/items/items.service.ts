/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { Item } from './entities/items.entity';

@Injectable()
export class ItemsService {
  private items: Item[] = [];
  private idCounter = 1;

  // Create
  create(createItemDto: CreateItemDto): Item {
    const newItem: Item = {
      id: this.idCounter++,
      ...createItemDto,
    };
    this.items.push(newItem);
    return newItem;
  }

  // Read All
  findAll(): Item[] {
    return this.items;
  }

  // Read One
  findOne(id: number): Item {
    const item = this.items.find(item => item.id === id);
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return item;
  }

  // Update
  update(id: number, updateItemDto: Partial<CreateItemDto>): Item {
    const item = this.findOne(id);
    const updatedItem = { ...item, ...updateItemDto };
    this.items = this.items.map(i => (i.id === id ? updatedItem : i));
    return updatedItem;
  }

  // Delete
  delete(id: number): void {
    const item = this.findOne(id);
    this.items = this.items.filter(i => i.id !== id);
  }
}
