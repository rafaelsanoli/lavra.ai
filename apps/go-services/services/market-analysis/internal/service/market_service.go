package service

import (
	"context"
	"fmt"
	"math"
	"math/rand"
	"time"

	pb "github.com/rafaelsanoli/lavra.ai/go-services/pb/market"
	"github.com/rafaelsanoli/lavra.ai/go-services/services/market-analysis/internal/models"
)

// MarketAnalysisService implementa o serviço gRPC
type MarketAnalysisService struct {
	// pb.UnimplementedMarketAnalysisServiceServer (será gerado pelo protoc)
}

// NewMarketAnalysisService cria uma nova instância do serviço
func NewMarketAnalysisService() *MarketAnalysisService {
	return &MarketAnalysisService{}
}

// AnalyzePriceTrend analisa tendência de preços
func (s *MarketAnalysisService) AnalyzePriceTrend(
	ctx context.Context,
	req *pb.PriceTrendRequest,
) (*pb.PriceTrendResponse, error) {
	// Simular análise de tendência
	// TODO: Implementar com dados reais do database

	// Gerar série temporal sintética
	prices := s.generatePriceSeries(req.Commodity, int(req.Days))
	
	// Calcular tendência usando regressão linear simples
	trend := s.calculateLinearTrend(prices)
	
	// Calcular força da tendência (R²)
	trendStrength := s.calculateTrendStrength(prices, trend)
	
	// Determinar direção
	var trendDirection string
	if trend.Slope > 0.01 {
		trendDirection = "BULLISH"
	} else if trend.Slope < -0.01 {
		trendDirection = "BEARISH"
	} else {
		trendDirection = "NEUTRAL"
	}
	
	// Calcular variação percentual
	changePercent := ((prices[len(prices)-1] - prices[0]) / prices[0]) * 100
	
	// Calcular preço médio
	avgPrice := s.calculateMean(prices)

	return &pb.PriceTrendResponse{
		Commodity:      req.Commodity,
		Trend:          trendDirection,
		TrendStrength:  trendStrength,
		ChangePercent:  changePercent,
		AveragePrice:   avgPrice,
		Timestamp:      time.Now().Unix(),
	}, nil
}

// CalculateVolatility calcula volatilidade de preços
func (s *MarketAnalysisService) CalculateVolatility(
	ctx context.Context,
	req *pb.VolatilityRequest,
) (*pb.VolatilityResponse, error) {
	// Gerar série de preços
	prices := s.generatePriceSeries(req.Commodity, int(req.WindowDays))
	
	// Calcular retornos logarítmicos
	returns := s.calculateLogReturns(prices)
	
	// Calcular volatilidade (desvio padrão anualizado)
	volatility := s.calculateStdDev(returns) * math.Sqrt(252) // 252 dias úteis/ano
	
	// Coeficiente de variação
	mean := s.calculateMean(prices)
	stdDev := s.calculateStdDev(prices)
	cv := (stdDev / mean) * 100
	
	// Classificar nível de risco
	var riskLevel string
	if volatility < 0.15 {
		riskLevel = "LOW"
	} else if volatility < 0.30 {
		riskLevel = "MEDIUM"
	} else {
		riskLevel = "HIGH"
	}

	return &pb.VolatilityResponse{
		Commodity:              req.Commodity,
		Volatility:             volatility,
		CoefficientOfVariation: cv,
		RiskLevel:              riskLevel,
		Timestamp:              time.Now().Unix(),
	}, nil
}

// DetectPriceAnomalies detecta anomalias de preço
func (s *MarketAnalysisService) DetectPriceAnomalies(
	ctx context.Context,
	req *pb.AnomaliesRequest,
) (*pb.AnomaliesResponse, error) {
	// Gerar série de preços
	prices := s.generatePriceSeries(req.Commodity, int(req.LookbackDays))
	
	// Calcular média e desvio padrão
	mean := s.calculateMean(prices)
	stdDev := s.calculateStdDev(prices)
	
	// Detectar anomalias usando Z-score
	var anomalies []*pb.PriceAnomaly
	threshold := req.Threshold
	if threshold == 0 {
		threshold = 2.0 // Padrão: 2 desvios padrão
	}
	
	for i, price := range prices {
		zScore := (price - mean) / stdDev
		if math.Abs(zScore) > threshold {
			severity := s.classifySeverity(math.Abs(zScore))
			
			anomalies = append(anomalies, &pb.PriceAnomaly{
				Date:          time.Now().AddDate(0, 0, -len(prices)+i).Format("2006-01-02"),
				Price:         price,
				ExpectedPrice: mean,
				Deviation:     zScore,
				Severity:      severity,
			})
		}
	}

	return &pb.AnomaliesResponse{
		Commodity:  req.Commodity,
		Anomalies:  anomalies,
		TotalCount: int32(len(anomalies)),
		Timestamp:  time.Now().Unix(),
	}, nil
}

// CalculateCorrelations calcula correlações entre commodities
func (s *MarketAnalysisService) CalculateCorrelations(
	ctx context.Context,
	req *pb.CorrelationsRequest,
) (*pb.CorrelationsResponse, error) {
	var correlations []*pb.Correlation
	
	// Gerar séries de preços para cada commodity
	priceSeriesMap := make(map[string][]float64)
	for _, commodity := range req.Commodities {
		priceSeriesMap[commodity] = s.generatePriceSeries(commodity, int(req.Days))
	}
	
	// Calcular correlação de Pearson para cada par
	commodities := req.Commodities
	for i := 0; i < len(commodities); i++ {
		for j := i + 1; j < len(commodities); j++ {
			corr := s.calculatePearsonCorrelation(
				priceSeriesMap[commodities[i]],
				priceSeriesMap[commodities[j]],
			)
			
			strength := s.classifyCorrelationStrength(corr)
			
			correlations = append(correlations, &pb.Correlation{
				CommodityA:  commodities[i],
				CommodityB:  commodities[j],
				Correlation: corr,
				Strength:    strength,
			})
		}
	}

	return &pb.CorrelationsResponse{
		Correlations: correlations,
		Timestamp:    time.Now().Unix(),
	}, nil
}

// ForecastPrice prevê preços futuros
func (s *MarketAnalysisService) ForecastPrice(
	ctx context.Context,
	req *pb.ForecastRequest,
) (*pb.ForecastResponse, error) {
	// Gerar série histórica
	historicalPrices := s.generatePriceSeries(req.Commodity, 60) // 60 dias históricos
	
	// Calcular tendência
	trend := s.calculateLinearTrend(historicalPrices)
	
	// Gerar previsões
	var forecasts []*pb.PriceForecast
	lastPrice := historicalPrices[len(historicalPrices)-1]
	lastDate := time.Now()
	
	for i := 1; i <= int(req.ForecastDays); i++ {
		// Previsão simples: tendência linear + ruído
		predicted := lastPrice + (trend.Slope * float64(i))
		
		// Intervalo de confiança (95%)
		stdDev := s.calculateStdDev(historicalPrices)
		margin := 1.96 * stdDev * math.Sqrt(float64(i)) // Cresce com horizonte
		
		forecasts = append(forecasts, &pb.PriceForecast{
			Date:            lastDate.AddDate(0, 0, i).Format("2006-01-02"),
			PredictedPrice:  predicted,
			ConfidenceLower: predicted - margin,
			ConfidenceUpper: predicted + margin,
		})
	}
	
	// Calcular acurácia (RMSE mock)
	accuracyScore := 0.85 + rand.Float64()*0.10 // 85-95%

	return &pb.ForecastResponse{
		Commodity:     req.Commodity,
		Forecasts:     forecasts,
		AccuracyScore: accuracyScore,
		Timestamp:     time.Now().Unix(),
	}, nil
}

// AnalyzeSeasonality analisa padrões sazonais
func (s *MarketAnalysisService) AnalyzeSeasonality(
	ctx context.Context,
	req *pb.SeasonalityRequest,
) (*pb.SeasonalityResponse, error) {
	// Simular padrões mensais baseados na commodity
	monthlyPatterns := s.generateSeasonalPatterns(req.Commodity)
	
	// Identificar picos e vales
	var peakMonth, troughMonth string
	maxIndex, minIndex := 1.0, 1.0
	peakMonthNum, troughMonthNum := 1, 1
	
	for _, pattern := range monthlyPatterns {
		if pattern.SeasonalIndex > maxIndex {
			maxIndex = pattern.SeasonalIndex
			peakMonthNum = int(pattern.Month)
		}
		if pattern.SeasonalIndex < minIndex {
			minIndex = pattern.SeasonalIndex
			troughMonthNum = int(pattern.Month)
		}
	}
	
	peakMonth = time.Month(peakMonthNum).String()
	troughMonth = time.Month(troughMonthNum).String()
	
	// Força da sazonalidade (range dos índices)
	seasonalityStrength := (maxIndex - minIndex) / ((maxIndex + minIndex) / 2)

	return &pb.SeasonalityResponse{
		Commodity:           req.Commodity,
		MonthlyPatterns:     monthlyPatterns,
		PeakMonth:           peakMonth,
		TroughMonth:         troughMonth,
		SeasonalityStrength: seasonalityStrength,
		Timestamp:           time.Now().Unix(),
	}, nil
}

// ========== Helper Functions ==========

func (s *MarketAnalysisService) generatePriceSeries(commodity string, days int) []float64 {
	// Preços base por commodity
	basePrices := map[string]float64{
		"SOJA":    135.50,
		"MILHO":   68.30,
		"CAFE":    1250.00,
		"TRIGO":   85.40,
		"ALGODAO": 165.20,
	}
	
	basePrice := basePrices[commodity]
	if basePrice == 0 {
		basePrice = 100.0
	}
	
	prices := make([]float64, days)
	prices[0] = basePrice
	
	// Random walk com drift
	drift := 0.0001
	volatility := 0.02
	
	rand.Seed(time.Now().UnixNano())
	for i := 1; i < days; i++ {
		change := drift + volatility*rand.NormFloat64()
		prices[i] = prices[i-1] * (1 + change)
	}
	
	return prices
}

func (s *MarketAnalysisService) calculateLinearTrend(prices []float64) models.LinearTrend {
	n := float64(len(prices))
	
	var sumX, sumY, sumXY, sumX2 float64
	for i, price := range prices {
		x := float64(i)
		sumX += x
		sumY += price
		sumXY += x * price
		sumX2 += x * x
	}
	
	slope := (n*sumXY - sumX*sumY) / (n*sumX2 - sumX*sumX)
	intercept := (sumY - slope*sumX) / n
	
	return models.LinearTrend{
		Slope:     slope,
		Intercept: intercept,
	}
}

func (s *MarketAnalysisService) calculateTrendStrength(prices []float64, trend models.LinearTrend) float64 {
	// Calcular R² (coeficiente de determinação)
	mean := s.calculateMean(prices)
	
	var ssTotal, ssResidual float64
	for i, price := range prices {
		predicted := trend.Intercept + trend.Slope*float64(i)
		ssTotal += math.Pow(price-mean, 2)
		ssResidual += math.Pow(price-predicted, 2)
	}
	
	rSquared := 1 - (ssResidual / ssTotal)
	return math.Max(0, math.Min(1, rSquared)) // Clamp entre 0 e 1
}

func (s *MarketAnalysisService) calculateMean(values []float64) float64 {
	var sum float64
	for _, v := range values {
		sum += v
	}
	return sum / float64(len(values))
}

func (s *MarketAnalysisService) calculateStdDev(values []float64) float64 {
	mean := s.calculateMean(values)
	var sumSquares float64
	
	for _, v := range values {
		sumSquares += math.Pow(v-mean, 2)
	}
	
	variance := sumSquares / float64(len(values))
	return math.Sqrt(variance)
}

func (s *MarketAnalysisService) calculateLogReturns(prices []float64) []float64 {
	returns := make([]float64, len(prices)-1)
	for i := 1; i < len(prices); i++ {
		returns[i-1] = math.Log(prices[i] / prices[i-1])
	}
	return returns
}

func (s *MarketAnalysisService) calculatePearsonCorrelation(x, y []float64) float64 {
	if len(x) != len(y) {
		return 0
	}
	
	n := float64(len(x))
	meanX := s.calculateMean(x)
	meanY := s.calculateMean(y)
	
	var covariance, stdDevX, stdDevY float64
	
	for i := 0; i < len(x); i++ {
		devX := x[i] - meanX
		devY := y[i] - meanY
		
		covariance += devX * devY
		stdDevX += devX * devX
		stdDevY += devY * devY
	}
	
	correlation := covariance / math.Sqrt(stdDevX*stdDevY)
	return correlation
}

func (s *MarketAnalysisService) classifySeverity(zScore float64) string {
	if zScore > 3.0 {
		return "CRITICAL"
	} else if zScore > 2.5 {
		return "HIGH"
	} else if zScore > 2.0 {
		return "MEDIUM"
	}
	return "LOW"
}

func (s *MarketAnalysisService) classifyCorrelationStrength(corr float64) string {
	abs := math.Abs(corr)
	if abs > 0.7 {
		return "STRONG"
	} else if abs > 0.4 {
		return "MODERATE"
	}
	return "WEAK"
}

func (s *MarketAnalysisService) generateSeasonalPatterns(commodity string) []*pb.MonthlyPattern {
	// Padrões sazonais típicos para commodities agrícolas brasileiras
	patterns := make([]*pb.MonthlyPattern, 12)
	
	// Índices sazonais base (SOJA como exemplo)
	baseIndices := []float64{
		0.95, 0.92, 0.98, 1.05, 1.12, 1.08, // Jan-Jun
		1.02, 0.96, 0.90, 0.88, 0.95, 1.02, // Jul-Dez
	}
	
	// Ajustar baseado na commodity
	adjustment := s.getCommoditySeasonalAdjustment(commodity)
	
	for i := 0; i < 12; i++ {
		patterns[i] = &pb.MonthlyPattern{
			Month:         int32(i + 1),
			AveragePrice:  100 * baseIndices[i] * adjustment,
			StdDeviation:  5 + rand.Float64()*5,
			SeasonalIndex: baseIndices[i],
		}
	}
	
	return patterns
}

func (s *MarketAnalysisService) getCommoditySeasonalAdjustment(commodity string) float64 {
	adjustments := map[string]float64{
		"SOJA":    1.35,
		"MILHO":   0.68,
		"CAFE":    12.50,
		"TRIGO":   0.85,
		"ALGODAO": 1.65,
	}
	
	if adj, ok := adjustments[commodity]; ok {
		return adj
	}
	return 1.0
}
