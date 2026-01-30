package service

import (
	"context"
	"fmt"
	"math"
	"math/rand"
	"time"

	pb "github.com/rafaelsanoli/lavra.ai/go-services/pb/climate"
	"github.com/rafaelsanoli/lavra.ai/go-services/services/climate-analysis/internal/models"
)

// ClimateAnalysisService implementa o serviço gRPC
type ClimateAnalysisService struct {
	// pb.UnimplementedClimateAnalysisServiceServer
}

// NewClimateAnalysisService cria nova instância
func NewClimateAnalysisService() *ClimateAnalysisService {
	return &ClimateAnalysisService{}
}

// CalculateClimateRisk calcula risco climático para lavoura
func (s *ClimateAnalysisService) CalculateClimateRisk(
	ctx context.Context,
	req *pb.ClimateRiskRequest,
) (*pb.ClimateRiskResponse, error) {
	cropParams := s.getCropParameters(req.CropType)
	
	// Gerar previsão climática
	forecast := s.generateForecast(req.Latitude, req.Longitude, int(req.ForecastDays))
	
	// Avaliar riscos por categoria
	var riskFactors []*pb.ClimateRiskFactor
	
	// Risco de geada
	frostRisk := s.assessFrostRisk(forecast, cropParams, req.GrowthStage)
	if frostRisk.Probability > 0.1 {
		riskFactors = append(riskFactors, frostRisk)
	}
	
	// Risco de seca
	droughtRisk := s.assessDroughtRisk(forecast, cropParams, req.GrowthStage)
	if droughtRisk.Probability > 0.2 {
		riskFactors = append(riskFactors, droughtRisk)
	}
	
	// Risco de estresse térmico
	heatRisk := s.assessHeatStressRisk(forecast, cropParams, req.GrowthStage)
	if heatRisk.Probability > 0.15 {
		riskFactors = append(riskFactors, heatRisk)
	}
	
	// Risco de excesso de chuva
	excessRainRisk := s.assessExcessRainRisk(forecast, req.GrowthStage)
	if excessRainRisk.Probability > 0.25 {
		riskFactors = append(riskFactors, excessRainRisk)
	}
	
	// Calcular risco geral
	overallRiskScore := s.calculateOverallRisk(riskFactors)
	riskLevel := s.classifyRiskLevel(overallRiskScore)
	
	// Gerar recomendações
	recommendations := s.generateRiskRecommendations(riskFactors, req.CropType)

	return &pb.ClimateRiskResponse{
		CropType:         req.CropType,
		OverallRiskScore: overallRiskScore,
		RiskLevel:        riskLevel,
		RiskFactors:      riskFactors,
		Recommendations:  recommendations,
		Timestamp:        time.Now().Unix(),
	}, nil
}

// AnalyzePlantingConditions analisa condições de plantio
func (s *ClimateAnalysisService) AnalyzePlantingConditions(
	ctx context.Context,
	req *pb.PlantingConditionsRequest,
) (*pb.PlantingConditionsResponse, error) {
	cropParams := s.getCropParameters(req.CropType)
	
	// Obter dados climáticos recentes e previsão
	recentData := s.getRecentClimateData(req.Latitude, req.Longitude, 7)
	forecast := s.generateForecast(req.Latitude, req.Longitude, 7)
	
	// Avaliar temperatura
	avgTemp := s.calculateAverageTemp(recentData)
	isTempSuitable := avgTemp >= cropParams.BaseTemp && avgTemp <= cropParams.HeatStressTemp
	
	// Avaliar precipitação recente
	recentPrecip := s.calculateTotalPrecipitation(recentData)
	forecastPrecip := s.calculateTotalPrecipitation(forecast)
	
	// Status de umidade do solo (simulado)
	var soilMoistureStatus string
	if recentPrecip < 20 {
		soilMoistureStatus = "DRY"
	} else if recentPrecip > 100 {
		soilMoistureStatus = "EXCESSIVE"
	} else {
		soilMoistureStatus = "ADEQUATE"
	}
	
	// Fatores favoráveis e desfavoráveis
	var favorable, unfavorable []string
	
	if isTempSuitable {
		favorable = append(favorable, fmt.Sprintf("Temperatura adequada (%.1f°C)", avgTemp))
	} else {
		unfavorable = append(unfavorable, fmt.Sprintf("Temperatura fora da faixa ideal (%.1f°C)", avgTemp))
	}
	
	if soilMoistureStatus == "ADEQUATE" {
		favorable = append(favorable, "Umidade do solo adequada")
	} else {
		unfavorable = append(unfavorable, fmt.Sprintf("Umidade do solo %s", soilMoistureStatus))
	}
	
	if forecastPrecip >= 30 && forecastPrecip <= 80 {
		favorable = append(favorable, fmt.Sprintf("Previsão de chuva favorável (%.0fmm)", forecastPrecip))
	} else if forecastPrecip > 100 {
		unfavorable = append(unfavorable, "Excesso de chuva previsto")
	}
	
	// Calcular score de adequação
	suitabilityScore := 0.0
	if isTempSuitable {
		suitabilityScore += 0.4
	}
	if soilMoistureStatus == "ADEQUATE" {
		suitabilityScore += 0.3
	}
	if forecastPrecip >= 30 && forecastPrecip <= 80 {
		suitabilityScore += 0.3
	}
	
	isSuitable := suitabilityScore >= 0.6
	
	// Recomendação
	var recommendation string
	if isSuitable {
		recommendation = fmt.Sprintf("Condições favoráveis para plantio de %s. Recomenda-se iniciar semeadura.", req.CropType)
	} else if suitabilityScore >= 0.4 {
		recommendation = "Condições marginais. Aguardar melhorias climáticas ou ajustar práticas de manejo."
	} else {
		recommendation = "Condições desfavoráveis. Não recomendado plantar no momento."
	}

	return &pb.PlantingConditionsResponse{
		CropType:              req.CropType,
		IsSuitable:            isSuitable,
		SuitabilityScore:      suitabilityScore,
		SoilMoistureStatus:    soilMoistureStatus,
		TemperatureAvg:        avgTemp,
		PrecipitationForecast_7D: forecastPrecip,
		FavorableFactors:      favorable,
		UnfavorableFactors:    unfavorable,
		Recommendation:        recommendation,
		Timestamp:             time.Now().Unix(),
	}, nil
}

// PredictHarvestWindow prevê janela de colheita
func (s *ClimateAnalysisService) PredictHarvestWindow(
	ctx context.Context,
	req *pb.HarvestWindowRequest,
) (*pb.HarvestWindowResponse, error) {
	cropParams := s.getCropParameters(req.CropType)
	
	// Parse planting date
	plantingDate, _ := time.Parse("2006-01-02", req.PlantingDate)
	
	// Simular acúmulo de GDD desde plantio
	daysElapsed := int(time.Since(plantingDate).Hours() / 24)
	historicalGDD := s.simulateGDDAccumulation(
		req.Latitude,
		req.Longitude,
		plantingDate,
		daysElapsed,
		cropParams.BaseTemp,
	)
	
	// Calcular progresso de maturação
	maturityProgress := historicalGDD / cropParams.TotalGDD
	
	// Estimar dias restantes para completar ciclo
	daysRemaining := int((cropParams.TotalGDD - historicalGDD) / 10.0) // ~10 GDD/dia
	
	// Janela ótima de colheita
	optimalStart := plantingDate.AddDate(0, 0, int(req.ExpectedCycleDays)-3)
	optimalEnd := plantingDate.AddDate(0, 0, int(req.ExpectedCycleDays)+3)
	
	optimalWindow := &pb.HarvestWindow{
		StartDate:  optimalStart.Format("2006-01-02"),
		EndDate:    optimalEnd.Format("2006-01-02"),
		Confidence: 0.85,
		Conditions: []string{
			"GDD acumulado atingido",
			"Umidade de grãos ideal",
			"Condições climáticas favoráveis",
		},
	}
	
	// Janela aceitável (mais ampla)
	acceptableStart := plantingDate.AddDate(0, 0, int(req.ExpectedCycleDays)-7)
	acceptableEnd := plantingDate.AddDate(0, 0, int(req.ExpectedCycleDays)+7)
	
	acceptableWindow := &pb.HarvestWindow{
		StartDate:  acceptableStart.Format("2006-01-02"),
		EndDate:    acceptableEnd.Format("2006-01-02"),
		Confidence: 0.70,
		Conditions: []string{
			"Maturação fisiológica alcançada",
			"Possível variação na qualidade",
		},
	}
	
	// Recomendações
	recommendations := []string{
		"Monitorar umidade de grãos semanalmente",
		"Verificar previsão do tempo para janela sem chuva",
		"Preparar maquinário com antecedência",
	}
	
	if maturityProgress < 0.8 {
		recommendations = append(recommendations, "Cultura ainda não atingiu maturação plena")
	}

	return &pb.HarvestWindowResponse{
		CropType:         req.CropType,
		OptimalWindow:    optimalWindow,
		AcceptableWindow: acceptableWindow,
		AccumulatedGdd:   historicalGDD,
		MaturityProgress: maturityProgress,
		Recommendations:  recommendations,
		Timestamp:        time.Now().Unix(),
	}, nil
}

// CalculateWaterBalance calcula balanço hídrico
func (s *ClimateAnalysisService) CalculateWaterBalance(
	ctx context.Context,
	req *pb.WaterBalanceRequest,
) (*pb.WaterBalanceResponse, error) {
	cropParams := s.getCropParameters(req.CropType)
	
	// Gerar dados climáticos históricos
	climateData := s.getRecentClimateData(req.Latitude, req.Longitude, int(req.AnalysisDays))
	
	// Calcular balanço hídrico diário
	var dailyBalances []*pb.DailyWaterBalance
	var totalPrecip, totalET, cumulativeDeficit float64
	
	for i, data := range climateData {
		// Calcular ET usando Hargreaves simplificado
		et := s.calculateDailyET(data, req.Latitude)
		
		// Balanço diário
		balance := data.Precipitation - et
		
		// Déficit acumulado (apenas valores negativos)
		if balance < 0 {
			cumulativeDeficit += math.Abs(balance)
		} else {
			cumulativeDeficit = math.Max(0, cumulativeDeficit-balance)
		}
		
		// Status
		var status string
		if balance > 20 {
			status = "SURPLUS"
		} else if balance >= 0 {
			status = "ADEQUATE"
		} else if balance >= -5 {
			status = "DEFICIT"
		} else {
			status = "SEVERE_DEFICIT"
		}
		
		dailyBalances = append(dailyBalances, &pb.DailyWaterBalance{
			Date:               time.Now().AddDate(0, 0, -len(climateData)+i).Format("2006-01-02"),
			Precipitation:      data.Precipitation,
			Evapotranspiration: et,
			Balance:            balance,
			AccumulatedDeficit: cumulativeDeficit,
			Status:             status,
		})
		
		totalPrecip += data.Precipitation
		totalET += et
	}
	
	// Classificar estresse hídrico
	var waterStressLevel string
	if cumulativeDeficit < 30 {
		waterStressLevel = "NONE"
	} else if cumulativeDeficit < 60 {
		waterStressLevel = "MILD"
	} else if cumulativeDeficit < 100 {
		waterStressLevel = "MODERATE"
	} else {
		waterStressLevel = "SEVERE"
	}
	
	// Recomendação de irrigação
	irrigationRecommendation := math.Max(0, cumulativeDeficit*0.8) // 80% do déficit

	return &pb.WaterBalanceResponse{
		CropType:                 req.CropType,
		DailyBalances:            dailyBalances,
		TotalPrecipitation:       totalPrecip,
		TotalEvapotranspiration:  totalET,
		CumulativeDeficit:        cumulativeDeficit,
		WaterStressLevel:         waterStressLevel,
		IrrigationRecommendation: irrigationRecommendation,
		Timestamp:                time.Now().Unix(),
	}, nil
}

// DetectExtremeEvents detecta eventos climáticos extremos
func (s *ClimateAnalysisService) DetectExtremeEvents(
	ctx context.Context,
	req *pb.ExtremeEventsRequest,
) (*pb.ExtremeEventsResponse, error) {
	// Gerar previsão
	forecast := s.generateForecast(req.Latitude, req.Longitude, int(req.ForecastDays))
	
	var events []*pb.ExtremeEvent
	
	// Detectar cada tipo de evento
	eventTypes := req.EventTypes
	if len(eventTypes) == 0 {
		eventTypes = []string{"FROST", "HEAT_WAVE", "HEAVY_RAIN", "DROUGHT"}
	}
	
	for _, eventType := range eventTypes {
		switch eventType {
		case "FROST":
			if event := s.detectFrostEvent(forecast); event != nil {
				events = append(events, event)
			}
		case "HEAT_WAVE":
			if event := s.detectHeatWaveEvent(forecast); event != nil {
				events = append(events, event)
			}
		case "HEAVY_RAIN":
			if event := s.detectHeavyRainEvent(forecast); event != nil {
				events = append(events, event)
			}
		case "DROUGHT":
			if event := s.detectDroughtEvent(forecast); event != nil {
				events = append(events, event)
			}
		}
	}
	
	// Identificar período de maior risco
	var highestRiskPeriod string
	if len(events) > 0 {
		highestRiskPeriod = events[0].StartDate
	} else {
		highestRiskPeriod = "Nenhum evento crítico previsto"
	}

	return &pb.ExtremeEventsResponse{
		Events:             events,
		TotalEvents:        int32(len(events)),
		HighestRiskPeriod:  highestRiskPeriod,
		Timestamp:          time.Now().Unix(),
	}, nil
}

// AnalyzeCropGrowth analisa crescimento de culturas
func (s *ClimateAnalysisService) AnalyzeCropGrowth(
	ctx context.Context,
	req *pb.CropGrowthRequest,
) (*pb.CropGrowthResponse, error) {
	cropParams := s.getCropParameters(req.CropType)
	
	// Parse planting date
	plantingDate, _ := time.Parse("2006-01-02", req.PlantingDate)
	daysElapsed := int(time.Since(plantingDate).Hours() / 24)
	
	// Calcular GDD acumulado
	accumulatedGDD := s.simulateGDDAccumulation(
		req.Latitude,
		req.Longitude,
		plantingDate,
		daysElapsed,
		cropParams.BaseTemp,
	)
	
	// Progresso de crescimento
	growthProgress := math.Min(1.0, accumulatedGDD/cropParams.TotalGDD)
	
	// Determinar estágio atual
	currentStage := s.determineCurrentStage(accumulatedGDD, cropParams)
	
	// Gerar todos os estágios
	allStages := s.generateAllStages(plantingDate, cropParams)
	
	// Estimar data de colheita
	daysToComplete := int((cropParams.TotalGDD - accumulatedGDD) / 10.0)
	estimatedHarvestDate := time.Now().AddDate(0, 0, daysToComplete).Format("2006-01-02")
	
	// Taxa de desenvolvimento (GDD/dia médio)
	developmentRate := accumulatedGDD / float64(daysElapsed)
	
	// Status de saúde
	var healthStatus string
	if developmentRate > 12 {
		healthStatus = "EXCELLENT"
	} else if developmentRate > 10 {
		healthStatus = "GOOD"
	} else if developmentRate > 8 {
		healthStatus = "FAIR"
	} else {
		healthStatus = "POOR"
	}

	return &pb.CropGrowthResponse{
		CropType:              req.CropType,
		AccumulatedGdd:        accumulatedGDD,
		GddTarget:             cropParams.TotalGDD,
		GrowthProgress:        growthProgress,
		CurrentStage:          currentStage,
		AllStages:             allStages,
		EstimatedHarvestDate:  estimatedHarvestDate,
		DevelopmentRate:       developmentRate,
		HealthStatus:          healthStatus,
		Timestamp:             time.Now().Unix(),
	}, nil
}

// ========== Helper Functions ==========

func (s *ClimateAnalysisService) getCropParameters(cropType string) models.CropParameters {
	params := map[string]models.CropParameters{
		"SOJA": {
			CropType:       "SOJA",
			TotalGDD:       1800,
			BaseTemp:       10,
			OptimalTemp:    25,
			FrostTemp:      2,
			HeatStressTemp: 35,
			WaterReq:       500,
		},
		"MILHO": {
			CropType:       "MILHO",
			TotalGDD:       1500,
			BaseTemp:       10,
			OptimalTemp:    28,
			FrostTemp:      0,
			HeatStressTemp: 38,
			WaterReq:       450,
		},
		"CAFE": {
			CropType:       "CAFE",
			TotalGDD:       3000,
			BaseTemp:       12,
			OptimalTemp:    22,
			FrostTemp:      1,
			HeatStressTemp: 34,
			WaterReq:       1200,
		},
	}
	
	if param, ok := params[cropType]; ok {
		return param
	}
	return params["SOJA"] // Default
}

func (s *ClimateAnalysisService) generateForecast(lat, lon float64, days int) []models.ClimateData {
	forecast := make([]models.ClimateData, days)
	rand.Seed(time.Now().UnixNano())
	
	for i := 0; i < days; i++ {
		forecast[i] = models.ClimateData{
			Date:          time.Now().AddDate(0, 0, i),
			Temperature:   20 + rand.Float64()*10,
			MinTemp:       15 + rand.Float64()*5,
			MaxTemp:       25 + rand.Float64()*10,
			Precipitation: rand.Float64() < 0.3 ? rand.Float64()*30 : 0,
			Humidity:      50 + rand.Float64()*40,
			WindSpeed:     rand.Float64() * 8,
			SolarRad:      400 + rand.Float64()*400,
		}
	}
	
	return forecast
}

func (s *ClimateAnalysisService) getRecentClimateData(lat, lon float64, days int) []models.ClimateData {
	return s.generateForecast(lat, lon, days)
}

func (s *ClimateAnalysisService) assessFrostRisk(
	forecast []models.ClimateData,
	params models.CropParameters,
	stage string,
) *pb.ClimateRiskFactor {
	minTemp := 100.0
	for _, data := range forecast {
		if data.MinTemp < minTemp {
			minTemp = data.MinTemp
		}
	}
	
	probability := 0.0
	if minTemp < params.FrostTemp {
		probability = 0.9
	} else if minTemp < params.FrostTemp+2 {
		probability = 0.5
	}
	
	severity := "LOW"
	if probability > 0.7 {
		severity = "CRITICAL"
	} else if probability > 0.4 {
		severity = "HIGH"
	}
	
	return &pb.ClimateRiskFactor{
		Factor:      "FROST",
		Severity:    severity,
		Probability: probability,
		Description: fmt.Sprintf("Temperatura mínima prevista: %.1f°C", minTemp),
	}
}

func (s *ClimateAnalysisService) assessDroughtRisk(
	forecast []models.ClimateData,
	params models.CropParameters,
	stage string,
) *pb.ClimateRiskFactor {
	totalPrecip := 0.0
	for _, data := range forecast {
		totalPrecip += data.Precipitation
	}
	
	probability := 0.0
	if totalPrecip < 10 {
		probability = 0.8
	} else if totalPrecip < 30 {
		probability = 0.4
	}
	
	severity := "MEDIUM"
	if probability > 0.6 {
		severity = "HIGH"
	}
	
	return &pb.ClimateRiskFactor{
		Factor:      "DROUGHT",
		Severity:    severity,
		Probability: probability,
		Description: fmt.Sprintf("Precipitação prevista: %.1fmm", totalPrecip),
	}
}

func (s *ClimateAnalysisService) assessHeatStressRisk(
	forecast []models.ClimateData,
	params models.CropParameters,
	stage string,
) *pb.ClimateRiskFactor {
	maxTemp := 0.0
	for _, data := range forecast {
		if data.MaxTemp > maxTemp {
			maxTemp = data.MaxTemp
		}
	}
	
	probability := 0.0
	if maxTemp > params.HeatStressTemp {
		probability = 0.7
	} else if maxTemp > params.HeatStressTemp-3 {
		probability = 0.3
	}
	
	severity := "MEDIUM"
	if probability > 0.5 {
		severity = "HIGH"
	}
	
	return &pb.ClimateRiskFactor{
		Factor:      "HEAT_STRESS",
		Severity:    severity,
		Probability: probability,
		Description: fmt.Sprintf("Temperatura máxima prevista: %.1f°C", maxTemp),
	}
}

func (s *ClimateAnalysisService) assessExcessRainRisk(
	forecast []models.ClimateData,
	stage string,
) *pb.ClimateRiskFactor {
	maxDailyRain := 0.0
	for _, data := range forecast {
		if data.Precipitation > maxDailyRain {
			maxDailyRain = data.Precipitation
		}
	}
	
	probability := 0.0
	if maxDailyRain > 80 {
		probability = 0.6
	} else if maxDailyRain > 50 {
		probability = 0.3
	}
	
	return &pb.ClimateRiskFactor{
		Factor:      "EXCESS_RAIN",
		Severity:    probability > 0.5 ? "HIGH" : "MEDIUM",
		Probability: probability,
		Description: fmt.Sprintf("Precipitação máxima diária: %.1fmm", maxDailyRain),
	}
}

func (s *ClimateAnalysisService) calculateOverallRisk(factors []*pb.ClimateRiskFactor) float64 {
	if len(factors) == 0 {
		return 0.1
	}
	
	maxRisk := 0.0
	for _, factor := range factors {
		if factor.Probability > maxRisk {
			maxRisk = factor.Probability
		}
	}
	
	return maxRisk
}

func (s *ClimateAnalysisService) classifyRiskLevel(score float64) string {
	if score > 0.7 {
		return "CRITICAL"
	} else if score > 0.5 {
		return "HIGH"
	} else if score > 0.3 {
		return "MEDIUM"
	}
	return "LOW"
}

func (s *ClimateAnalysisService) generateRiskRecommendations(
	factors []*pb.ClimateRiskFactor,
	cropType string,
) []string {
	var recommendations []string
	
	for _, factor := range factors {
		switch factor.Factor {
		case "FROST":
			recommendations = append(recommendations, "Considerar irrigação por aspersão preventiva")
		case "DROUGHT":
			recommendations = append(recommendations, "Planejar sistema de irrigação suplementar")
		case "HEAT_STRESS":
			recommendations = append(recommendations, "Monitorar estresse hídrico diariamente")
		case "EXCESS_RAIN":
			recommendations = append(recommendations, "Verificar sistema de drenagem")
		}
	}
	
	if len(recommendations) == 0 {
		recommendations = append(recommendations, "Manter monitoramento climático regular")
	}
	
	return recommendations
}

func (s *ClimateAnalysisService) calculateAverageTemp(data []models.ClimateData) float64 {
	sum := 0.0
	for _, d := range data {
		sum += d.Temperature
	}
	return sum / float64(len(data))
}

func (s *ClimateAnalysisService) calculateTotalPrecipitation(data []models.ClimateData) float64 {
	total := 0.0
	for _, d := range data {
		total += d.Precipitation
	}
	return total
}

func (s *ClimateAnalysisService) calculateDailyET(data models.ClimateData, latitude float64) float64 {
	// Hargreaves simplificado
	tempRange := data.MaxTemp - data.MinTemp
	avgTemp := (data.MaxTemp + data.MinTemp) / 2
	
	et := 0.0023 * (avgTemp + 17.8) * math.Sqrt(tempRange) * 5.0 // Ra simplificado
	return math.Max(0, et)
}

func (s *ClimateAnalysisService) simulateGDDAccumulation(
	lat, lon float64,
	plantingDate time.Time,
	days int,
	baseTemp float64,
) float64 {
	gdd := 0.0
	for i := 0; i < days; i++ {
		avgTemp := 20 + rand.Float64()*8 // Temperatura média simulada
		dailyGDD := math.Max(0, avgTemp-baseTemp)
		gdd += dailyGDD
	}
	return gdd
}

func (s *ClimateAnalysisService) determineCurrentStage(
	gdd float64,
	params models.CropParameters,
) *pb.GrowthStage {
	progress := gdd / params.TotalGDD
	
	var stageName string
	var gddRequired float64
	
	if progress < 0.15 {
		stageName = "GERMINATION"
		gddRequired = params.TotalGDD * 0.15
	} else if progress < 0.50 {
		stageName = "VEGETATIVE"
		gddRequired = params.TotalGDD * 0.35
	} else if progress < 0.80 {
		stageName = "FLOWERING"
		gddRequired = params.TotalGDD * 0.30
	} else {
		stageName = "MATURITY"
		gddRequired = params.TotalGDD * 0.20
	}
	
	return &pb.GrowthStage{
		StageName:   stageName,
		StartDate:   time.Now().AddDate(0, 0, -30).Format("2006-01-02"),
		EndDate:     time.Now().AddDate(0, 0, 30).Format("2006-01-02"),
		GddRequired: gddRequired,
		IsCurrent:   true,
	}
}

func (s *ClimateAnalysisService) generateAllStages(
	plantingDate time.Time,
	params models.CropParameters,
) []*pb.GrowthStage {
	stages := []*pb.GrowthStage{
		{
			StageName:   "GERMINATION",
			StartDate:   plantingDate.Format("2006-01-02"),
			EndDate:     plantingDate.AddDate(0, 0, 15).Format("2006-01-02"),
			GddRequired: params.TotalGDD * 0.15,
			IsCurrent:   false,
		},
		{
			StageName:   "VEGETATIVE",
			StartDate:   plantingDate.AddDate(0, 0, 15).Format("2006-01-02"),
			EndDate:     plantingDate.AddDate(0, 0, 60).Format("2006-01-02"),
			GddRequired: params.TotalGDD * 0.35,
			IsCurrent:   true,
		},
		{
			StageName:   "FLOWERING",
			StartDate:   plantingDate.AddDate(0, 0, 60).Format("2006-01-02"),
			EndDate:     plantingDate.AddDate(0, 0, 100).Format("2006-01-02"),
			GddRequired: params.TotalGDD * 0.30,
			IsCurrent:   false,
		},
		{
			StageName:   "MATURITY",
			StartDate:   plantingDate.AddDate(0, 0, 100).Format("2006-01-02"),
			EndDate:     plantingDate.AddDate(0, 0, 120).Format("2006-01-02"),
			GddRequired: params.TotalGDD * 0.20,
			IsCurrent:   false,
		},
	}
	
	return stages
}

func (s *ClimateAnalysisService) detectFrostEvent(forecast []models.ClimateData) *pb.ExtremeEvent {
	for i, data := range forecast {
		if data.MinTemp < 2 {
			return &pb.ExtremeEvent{
				EventType:  "FROST",
				StartDate:  data.Date.Format("2006-01-02"),
				EndDate:    data.Date.AddDate(0, 0, 1).Format("2006-01-02"),
				Intensity:  2 - data.MinTemp,
				Probability: 0.85,
				Severity:   "CRITICAL",
				Impacts: []string{
					"Dano severo a tecidos vegetais",
					"Perda de produtividade",
					"Morte de plantas jovens",
				},
				MitigationActions: []string{
					"Irrigação por aspersão durante a madrugada",
					"Cobertura de plantas",
					"Queima controlada (onde permitido)",
				},
			}
		}
	}
	return nil
}

func (s *ClimateAnalysisService) detectHeatWaveEvent(forecast []models.ClimateData) *pb.ExtremeEvent {
	consecutiveHotDays := 0
	for _, data := range forecast {
		if data.MaxTemp > 35 {
			consecutiveHotDays++
		}
	}
	
	if consecutiveHotDays >= 3 {
		return &pb.ExtremeEvent{
			EventType:   "HEAT_WAVE",
			StartDate:   time.Now().Format("2006-01-02"),
			EndDate:     time.Now().AddDate(0, 0, consecutiveHotDays).Format("2006-01-02"),
			Intensity:   float64(consecutiveHotDays),
			Probability: 0.75,
			Severity:    "HIGH",
			Impacts: []string{
				"Estresse térmico nas plantas",
				"Aumento da demanda hídrica",
				"Redução da fotossíntese",
			},
			MitigationActions: []string{
				"Aumentar frequência de irrigação",
				"Monitorar sinais de estresse",
			},
		}
	}
	return nil
}

func (s *ClimateAnalysisService) detectHeavyRainEvent(forecast []models.ClimateData) *pb.ExtremeEvent {
	for _, data := range forecast {
		if data.Precipitation > 80 {
			return &pb.ExtremeEvent{
				EventType:   "HEAVY_RAIN",
				StartDate:   data.Date.Format("2006-01-02"),
				EndDate:     data.Date.AddDate(0, 0, 1).Format("2006-01-02"),
				Intensity:   data.Precipitation,
				Probability: 0.65,
				Severity:    "MEDIUM",
				Impacts: []string{
					"Encharcamento do solo",
					"Erosão",
					"Dificuldade de operações",
				},
				MitigationActions: []string{
					"Verificar drenagem",
					"Postergar operações de campo",
				},
			}
		}
	}
	return nil
}

func (s *ClimateAnalysisService) detectDroughtEvent(forecast []models.ClimateData) *pb.ExtremeEvent {
	totalPrecip := 0.0
	for _, data := range forecast {
		totalPrecip += data.Precipitation
	}
	
	if totalPrecip < 10 && len(forecast) >= 7 {
		return &pb.ExtremeEvent{
			EventType:   "DROUGHT",
			StartDate:   time.Now().Format("2006-01-02"),
			EndDate:     time.Now().AddDate(0, 0, len(forecast)).Format("2006-01-02"),
			Intensity:   10 - totalPrecip,
			Probability: 0.70,
			Severity:    "HIGH",
			Impacts: []string{
				"Déficit hídrico severo",
				"Estresse na cultura",
				"Redução de produtividade",
			},
			MitigationActions: []string{
				"Implementar irrigação",
				"Reduzir evaporação (mulching)",
			},
		}
	}
	return nil
}
