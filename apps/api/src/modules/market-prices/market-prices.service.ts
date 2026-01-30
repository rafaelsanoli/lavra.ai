import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMarketPriceInput } from './dto/create-market-price.input';
import { UpdateMarketPriceInput } from './dto/update-market-price.input';
import { PricesGateway } from '../../websockets/prices.gateway';

@Injectable()
export class MarketPricesService {
  constructor(
    private prisma: PrismaService,
    private pricesGateway: PricesGateway,
  ) {}

  async create(createMarketPriceInput: CreateMarketPriceInput) {
    const price = await this.prisma.marketPrice.create({
      data: {
        ...createMarketPriceInput,
        timestamp: new Date(createMarketPriceInput.timestamp),
      },
    });

    // Emit WebSocket event for price update
    try {
      this.pricesGateway.sendPriceUpdate(price.commodity, price);
    } catch (error) {
      console.error('Failed to send WebSocket price update:', error);
    }

    return price;
  }

  async findAll(
    commodity?: string,
    market?: string,
    startDate?: string,
    endDate?: string,
  ) {
    const where: any = {};

    if (commodity) {
      where.commodity = commodity;
    }

    if (market) {
      where.market = market;
    }

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) {
        where.timestamp.gte = new Date(startDate);
      }
      if (endDate) {
        where.timestamp.lte = new Date(endDate);
      }
    }

    return this.prisma.marketPrice.findMany({
      where,
      orderBy: {
        timestamp: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const price = await this.prisma.marketPrice.findUnique({
      where: { id },
    });

    if (!price) {
      throw new NotFoundException('Preço de mercado não encontrado');
    }

    return price;
  }

  async update(id: string, updateMarketPriceInput: UpdateMarketPriceInput) {
    await this.findOne(id);

    return this.prisma.marketPrice.update({
      where: { id },
      data: updateMarketPriceInput,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.marketPrice.delete({
      where: { id },
    });
  }

  /**
   * Busca o último preço de uma commodity
   */
  async getLatestPrice(commodity: string, market?: string) {
    const where: any = { commodity };
    if (market) {
      where.market = market;
    }

    const price = await this.prisma.marketPrice.findFirst({
      where,
      orderBy: {
        timestamp: 'desc',
      },
    });

    if (!price) {
      throw new NotFoundException(`Preço não encontrado para ${commodity}`);
    }

    return price;
  }

  /**
   * Calcula tendência de preço (comparação com período anterior)
   */
  async getPriceTrend(commodity: string, market?: string, days: number = 7) {
    const where: any = { commodity };
    if (market) {
      where.market = market;
    }

    const latestPrice = await this.prisma.marketPrice.findFirst({
      where,
      orderBy: { timestamp: 'desc' },
    });

    if (!latestPrice) {
      throw new NotFoundException(`Preço não encontrado para ${commodity}`);
    }

    const compareDate = new Date(latestPrice.timestamp);
    compareDate.setDate(compareDate.getDate() - days);

    const previousPrice = await this.prisma.marketPrice.findFirst({
      where: {
        ...where,
        timestamp: { lte: compareDate },
      },
      orderBy: { timestamp: 'desc' },
    });

    if (!previousPrice) {
      return {
        commodity,
        currentPrice: latestPrice.price,
        previousPrice: latestPrice.price,
        changePercent: 0,
        trend: 'STABLE',
      };
    }

    const changePercent =
      ((latestPrice.price - previousPrice.price) / previousPrice.price) * 100;

    let trend = 'STABLE';
    if (changePercent > 1) {
      trend = 'UP';
    } else if (changePercent < -1) {
      trend = 'DOWN';
    }

    return {
      commodity,
      currentPrice: latestPrice.price,
      previousPrice: previousPrice.price,
      changePercent: Number(changePercent.toFixed(2)),
      trend,
    };
  }

  /**
   * Calcula estatísticas de preço para um período
   */
  async getPriceStatistics(
    commodity: string,
    market?: string,
    startDate?: string,
    endDate?: string,
  ) {
    const where: any = { commodity };
    if (market) {
      where.market = market;
    }
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) {
        where.timestamp.gte = new Date(startDate);
      }
      if (endDate) {
        where.timestamp.lte = new Date(endDate);
      }
    }

    const prices = await this.prisma.marketPrice.findMany({ where });

    if (prices.length === 0) {
      return {
        commodity,
        minPrice: 0,
        maxPrice: 0,
        avgPrice: 0,
        count: 0,
      };
    }

    const values = prices.map((p) => p.price);
    const minPrice = Math.min(...values);
    const maxPrice = Math.max(...values);
    const avgPrice = values.reduce((a, b) => a + b, 0) / values.length;

    return {
      commodity,
      minPrice: Number(minPrice.toFixed(2)),
      maxPrice: Number(maxPrice.toFixed(2)),
      avgPrice: Number(avgPrice.toFixed(2)),
      count: prices.length,
    };
  }

  /**
   * Lista commodities disponíveis
   */
  async getAvailableCommodities() {
    const commodities = await this.prisma.marketPrice.findMany({
      distinct: ['commodity'],
      select: { commodity: true },
    });

    return commodities.map((c) => c.commodity);
  }
}
