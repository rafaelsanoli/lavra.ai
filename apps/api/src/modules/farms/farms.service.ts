import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFarmInput } from './dto/create-farm.input';
import { UpdateFarmInput } from './dto/update-farm.input';

@Injectable()
export class FarmsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createFarmInput: CreateFarmInput) {
    return this.prisma.farm.create({
      data: {
        ...createFarmInput,
        userId,
      },
      include: {
        plots: true,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.farm.findMany({
      where: { userId },
      include: {
        plots: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const farm = await this.prisma.farm.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        plots: {
          include: {
            plantings: true,
          },
        },
      },
    });

    if (!farm) {
      throw new NotFoundException('Fazenda não encontrada');
    }

    return farm;
  }

  async update(id: string, userId: string, updateFarmInput: UpdateFarmInput) {
    const farm = await this.findOne(id, userId);

    return this.prisma.farm.update({
      where: { id: farm.id },
      data: updateFarmInput,
      include: {
        plots: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    const farm = await this.findOne(id, userId);

    await this.prisma.farm.delete({
      where: { id: farm.id },
    });

    return true;
  }
}
