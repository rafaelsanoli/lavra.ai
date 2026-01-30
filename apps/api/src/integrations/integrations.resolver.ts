import { Resolver, Query, Args, Float } from '@nestjs/graphql';
import { B3Service } from './services/b3.service';
import { InmetService } from './services/inmet.service';
import { NasaPowerService } from './services/nasa-power.service';
import { CepeaService } from './services/cepea.service';
import { B3QuoteDto, B3FuturesDto } from './dto/b3-quote.dto';
import { InmetStationDto, InmetWeatherDataDto, InmetForecastDto } from './dto/inmet-weather.dto';
import { NasaPowerDataDto, NasaPowerAgriculturalIndicesDto } from './dto/nasa-power.dto';
import { CepeaPriceDto, CepeaHistoricalSeriesDto, CepeaMarketIndicatorDto } from './dto/cepea-price.dto';

@Resolver()
export class IntegrationsResolver {
  constructor(
    private readonly b3Service: B3Service,
    private readonly inmetService: InmetService,
    private readonly nasaPowerService: NasaPowerService,
    private readonly cepeaService: CepeaService,
  ) {}

  // ========== B3 Queries ==========

  @Query(() => B3QuoteDto, { name: 'b3Quote' })
  async getB3Quote(@Args('symbol') symbol: string): Promise<B3QuoteDto> {
    return this.b3Service.getQuote(symbol);
  }

  @Query(() => [B3FuturesDto], { name: 'b3Futures' })
  async getB3Futures(
    @Args('commodity') commodity: string,
    @Args('limit', { type: () => Float, defaultValue: 5 }) limit: number,
  ): Promise<B3FuturesDto[]> {
    return this.b3Service.getFutures(commodity, limit);
  }

  @Query(() => [B3QuoteDto], { name: 'b3BatchQuotes' })
  async getB3BatchQuotes(@Args('symbols', { type: () => [String] }) symbols: string[]): Promise<B3QuoteDto[]> {
    return this.b3Service.getBatchQuotes(symbols);
  }

  @Query(() => Boolean, { name: 'isB3MarketOpen' })
  isB3MarketOpen(): boolean {
    return this.b3Service.isMarketOpen();
  }

  // ========== INMET Queries ==========

  @Query(() => [InmetStationDto], { name: 'inmetStations' })
  async findInmetStations(
    @Args('latitude', { type: () => Float }) latitude: number,
    @Args('longitude', { type: () => Float }) longitude: number,
    @Args('radiusKm', { type: () => Float, defaultValue: 100 }) radiusKm: number,
  ): Promise<InmetStationDto[]> {
    return this.inmetService.findNearbyStations(latitude, longitude, radiusKm);
  }

  @Query(() => InmetWeatherDataDto, { name: 'inmetCurrentWeather' })
  async getInmetCurrentWeather(@Args('stationCode') stationCode: string): Promise<InmetWeatherDataDto> {
    return this.inmetService.getCurrentWeather(stationCode);
  }

  @Query(() => [InmetWeatherDataDto], { name: 'inmetHistoricalWeather' })
  async getInmetHistoricalWeather(
    @Args('stationCode') stationCode: string,
    @Args('startDate') startDate: Date,
    @Args('endDate') endDate: Date,
  ): Promise<InmetWeatherDataDto[]> {
    return this.inmetService.getHistoricalWeather(stationCode, startDate, endDate);
  }

  @Query(() => [InmetForecastDto], { name: 'inmetForecast' })
  async getInmetForecast(
    @Args('municipality') municipality: string,
    @Args('uf') uf: string,
    @Args('days', { type: () => Float, defaultValue: 7 }) days: number,
  ): Promise<InmetForecastDto[]> {
    return this.inmetService.getForecast(municipality, uf, days);
  }

  @Query(() => InmetWeatherDataDto, { name: 'inmetWeatherByCoordinates' })
  async getInmetWeatherByCoordinates(
    @Args('latitude', { type: () => Float }) latitude: number,
    @Args('longitude', { type: () => Float }) longitude: number,
  ): Promise<InmetWeatherDataDto> {
    return this.inmetService.getWeatherByCoordinates(latitude, longitude);
  }

  // ========== NASA POWER Queries ==========

  @Query(() => NasaPowerDataDto, { name: 'nasaPowerDailyData' })
  async getNasaPowerDailyData(
    @Args('latitude', { type: () => Float }) latitude: number,
    @Args('longitude', { type: () => Float }) longitude: number,
    @Args('startDate') startDate: Date,
    @Args('endDate') endDate: Date,
  ): Promise<NasaPowerDataDto> {
    return this.nasaPowerService.getDailyData(latitude, longitude, startDate, endDate);
  }

  @Query(() => [NasaPowerAgriculturalIndicesDto], { name: 'nasaPowerAgriculturalIndices' })
  async getNasaPowerAgriculturalIndices(
    @Args('latitude', { type: () => Float }) latitude: number,
    @Args('longitude', { type: () => Float }) longitude: number,
    @Args('startDate') startDate: Date,
    @Args('endDate') endDate: Date,
    @Args('cropType', { defaultValue: 'SOJA' }) cropType: string,
  ): Promise<NasaPowerAgriculturalIndicesDto[]> {
    return this.nasaPowerService.calculateAgriculturalIndices(
      latitude,
      longitude,
      startDate,
      endDate,
      cropType,
    );
  }

  @Query(() => NasaPowerDataDto, { name: 'nasaPowerMonthlyAverages' })
  async getNasaPowerMonthlyAverages(
    @Args('latitude', { type: () => Float }) latitude: number,
    @Args('longitude', { type: () => Float }) longitude: number,
    @Args('year', { type: () => Float }) year: number,
  ): Promise<NasaPowerDataDto> {
    return this.nasaPowerService.getMonthlyAverages(latitude, longitude, year);
  }

  // ========== CEPEA Queries ==========

  @Query(() => CepeaPriceDto, { name: 'cepeaCurrentPrice' })
  async getCepeaCurrentPrice(
    @Args('commodity') commodity: string,
    @Args('market', { defaultValue: 'PARANAGUA' }) market: string,
  ): Promise<CepeaPriceDto> {
    return this.cepeaService.getCurrentPrice(commodity, market);
  }

  @Query(() => CepeaHistoricalSeriesDto, { name: 'cepeaHistoricalSeries' })
  async getCepeaHistoricalSeries(
    @Args('commodity') commodity: string,
    @Args('market') market: string,
    @Args('startDate') startDate: Date,
    @Args('endDate') endDate: Date,
  ): Promise<CepeaHistoricalSeriesDto> {
    return this.cepeaService.getHistoricalSeries(commodity, market, startDate, endDate);
  }

  @Query(() => CepeaMarketIndicatorDto, { name: 'cepeaMarketIndicator' })
  async getCepeaMarketIndicator(@Args('commodity') commodity: string): Promise<CepeaMarketIndicatorDto> {
    return this.cepeaService.getMarketIndicator(commodity);
  }

  @Query(() => [CepeaPriceDto], { name: 'cepeaCompareMarkets' })
  async cepeaCompareMarkets(
    @Args('commodity') commodity: string,
    @Args('markets', { type: () => [String] }) markets: string[],
  ): Promise<CepeaPriceDto[]> {
    return this.cepeaService.compareMarkets(commodity, markets);
  }

  @Query(() => [String], { name: 'cepeaAvailableCommodities' })
  async getCepeaAvailableCommodities(): Promise<string[]> {
    return this.cepeaService.getAvailableCommodities();
  }

  @Query(() => [String], { name: 'cepeaMarketsByCommodity' })
  async getCepeaMarketsByCommodity(@Args('commodity') commodity: string): Promise<string[]> {
    return this.cepeaService.getMarketsByCommodity(commodity);
  }
}
