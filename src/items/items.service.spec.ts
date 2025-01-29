import { Test } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { PrismaService } from '../prisma/prisma.service';
import { Item, ItemStatus } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
const mockPrismaService = {
  item: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('ItemsServiceTest', () => {
  let itemsService;
  let prismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      // ItemsServiceのprismaServiceをmockPrismaServiceに置き換える
      providers: [
        ItemsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    itemsService = module.get<ItemsService>(ItemsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('findAll', () => {
    it('正常系', async () => {
      prismaService.item.findMany.mockResolvedValue([]);
      const expected = [];
      const result = await itemsService.findAll();
      expect(result).toEqual(expected);
    });
  });

  describe('findById', () => {
    it('正常系', async () => {
      const item: Item = {
        id: 'test-id1',
        name: 'test-item1',
        price: 100,
        description: '',
        status: ItemStatus.ON_SALE,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        userId: 'test-user1',
      };
      prismaService.item.findUnique.mockResolvedValue(item);

      const result = await itemsService.findById('test-id1');
      expect(result).toEqual(item);
      expect(prismaService.item.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-id1' },
      });
    });

    it('異常系: 商品が存在しない', async () => {
      prismaService.item.findUnique.mockResolvedValue(null);
      await expect(itemsService.findById('test-id1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('正常系', async () => {
      const createItemDto: CreateItemDto = {
        name: 'test-id1',
        price: 100,
        description: '',
      };
      const userId = 'test-user1';

      const expected: Item = {
        id: 'test-id1',
        name: createItemDto.name,
        price: createItemDto.price,
        description: createItemDto.description,
        status: ItemStatus.ON_SALE,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        userId,
      };

      prismaService.item.create.mockResolvedValue(expected);

      const result = await itemsService.create(createItemDto, userId);
      expect(result).toEqual(expected);
      expect(prismaService.item.create).toHaveBeenCalledWith({
        data: {
          name: createItemDto.name,
          price: createItemDto.price,
          description: createItemDto.description,
          status: ItemStatus.ON_SALE,
          userId,
        },
      });
    });
  });

  describe('updateStatus', () => {
    it('正常系', async () => {
      const id = 'test-id1';

      const expected: Item = {
        id,
        name: 'test-id1',
        price: 100,
        description: '',
        status: ItemStatus.SOLD_OUT,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        userId: 'test-user1',
      };

      prismaService.item.update.mockResolvedValue(expected);

      const result = await itemsService.updateStatus(id);
      expect(result).toEqual(expected);
      expect(prismaService.item.update).toHaveBeenCalledWith({
        data: {
          status: 'SOLD_OUT',
        },
        where: {
          id,
        },
      });
    });
  });

  describe('delete', () => {
    it('正常系', async () => {
      const id = 'test-id1';
      const userId = 'test-user1';

      await itemsService.delete(id, userId);
      expect(prismaService.item.delete).toHaveBeenCalledWith({
        where: {
          id,
          userId,
        },
      });
    });
  });
});
