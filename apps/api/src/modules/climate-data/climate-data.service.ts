import { Injectable, NotFoundException, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClimateDataInput } from './dto/create-climate-data.input';
import { UpdateClimateDataInput } from './dto/update-climate-data.input';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ClimateDataService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async create(userId: string, createClimateDataInput: CreateClimateDataInput) {
    // Verificar se o usuário é dono da fazenda
    const farm = await this.prisma.farm.findFirst({
      where: {
        id: createClimateDataInput.farmId,
        userId,
      },
    });

    if (!farm) {
      throw new NotFoundException('Fazenda não encontrada ou você não tem permissão para acessá-la');
    }

    return this.prisma.climateData.create({
      data: {
        ...createClimateDataInput,
        date: new Date(createClimateDataInput.date),
      },
    });
  }

  async findAll(userId: string, farmId?: string, startDate?: string, endDate?: string) {
    const where: any = {
      farm: {
        userId,
      },
    };

    if (farmId) {
      where.farmId = farmId;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    return this.prisma.climateData.findMany({
      where,
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const climateData = await this.prisma.climateData.findFirst({
      where: {
        id,
        farm: {
          userId,
        },
      },
      include: {
        farm: true,
      },
    });

    if (!climateData) {
      throw new NotFoundException('Dado climático não encontrado ou você não tem permissão para acessá-lo');
    }

    return climateData;
  }

  async update(id: string, userId: string, updateClimateDataInput: UpdateClimateDataInput) {
    // Verificar se o dado existe e o usuário tem permissão
    await this.findOne(id, userId);

    return this.prisma.climateData.update({
      where: { id },
      data: updateClimateDataInput,
    });
  }

  async remove(id: string, userId: string) {
    // Verificar se o dado existe e o usuário tem permissão
    await this.findOne(id, userId);

    return this.prisma.climateData.delete({
      where: { id },
    });
  }

  /**
   * Busca dados climáticos da API OpenWeather para uma fazenda
   */
  async fetchFromOpenWeather(farmId: string, userId: string) {
    const farm = await this.prisma.farm.findFirst({
      where: {
        id: farmId,
        userId,
      },
    });

    if (!farm) {
      throw new NotFoundException('Fazenda não encontrada');
    }

    if (!farm.latitude || !farm.longitude) {
      throw new HttpException(
        'Fazenda não possui coordenadas cadastradas',
        HttpStatus.BAD_REQUEST,
      );
    }

    const apiKey = this.configService.get<string>('OPENWEATHER_API_KEY');
    if (!apiKey) {
      throw new HttpException(
        'API Key do OpenWeather não configurada',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${farm.latitude}&lon=${farm.longitude}&appid=${apiKey}&units=metric&lang=pt_br`;
      
      const response = await firstValueFrom(
        this.httpService.get(url),
      );

      const data = response.data;

      // Criar registro com dados da API
      return this.create(userId, {
        farmId: farm.id,
        date: new Date().toISOString(),
        temperature: data.main.temp,
        humidity: data.main.humidity,
        rainfall: data.rain?.['1h'] || 0,
        windSpeed: data.wind?.speed || 0,
        solarRadiation: null,
        source: 'OpenWeather',
      });
    } catch (error) {
      throw new HttpException(
        `Erro ao buscar dados do OpenWeather: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Calcula estatísticas climáticas para um período
   */
  async getStatistics(userId: string, farmId: string, startDate: string, endDate: string) {
    const data = await this.findAll(userId, farmId, startDate, endDate);

    if (data.length === 0) {
      return {
        count: 0,
        avgTemperature: 0,
        avgHumidity: 0,
        totalRainfall: 0,
        avgWindSpeed: 0,
      };
    }

    const sum = data.reduce(
      (acc, curr) => ({
        temperature: acc.temperature + curr.temperature,
        humidity: acc.humidity + curr.humidity,
        rainfall: acc.rainfall + curr.rainfall,
        windSpeed: acc.windSpeed + (curr.windSpeed || 0),
      }),
      { temperature: 0, humidity: 0, rainfall: 0, windSpeed: 0 },
    );

    return {
      count: data.length,
      avgTemperature: sum.temperature / data.length,
      avgHumidity: sum.humidity / data.length,
      totalRainfall: sum.rainfall,
      avgWindSpeed: sum.windSpeed / data.length,
    };
  }
}
