package service

import (
	"context"
	"fmt"
	"math"
	"math/rand"
	"sort"
	"time"

	pb "github.com/rafaelsanoli/lavra.ai/go-services/pb/decision"
	"github.com/rafaelsanoli/lavra.ai/go-services/services/decision-engine/internal/models"
)

// DecisionEngineService implementa o serviço gRPC
type DecisionEngineService struct {
	// pb.UnimplementedDecisionEngineServiceServer
}

// NewDecisionEngineService cria nova instância
func NewDecisionEngineService() *DecisionEngineService {
	return &DecisionEngineService{}
}

// EvaluateDecision avalia decisão com múltiplos critérios
func (s *DecisionEngineService) EvaluateDecision(
	ctx context.Context,
	req *pb.DecisionRequest,
) (*pb.DecisionResponse, error) {
	// Parse critérios com pesos
	var criteria []models.DecisionCriterion
	totalWeight := 0.0
	
	for _, c := range req.Criteria {
		criteria = append(criteria, models.DecisionCriterion{
			Name:        c.Name,
			Weight:      c.Weight,
			Score:       c.Score,
			Description: c.Description,
		})
		totalWeight += c.Weight
	}
	
	// Normalizar pesos se necessário
	if totalWeight > 1.01 || totalWeight < 0.99 {
		for i := range criteria {
			criteria[i].Weight = criteria[i].Weight / totalWeight
		}
	}
	
	// Calcular score ponderado
	overallScore := 0.0
	for _, c := range criteria {
		overallScore += c.Score * c.Weight
	}
	
	// Ajustar por risco
	riskAdjustment := s.calculateRiskAdjustment(req.RiskLevel, req.RiskAppetite)
	adjustedScore := overallScore * riskAdjustment
	
	// Calcular nível de confiança
	confidence := s.calculateConfidence(criteria, req.UncertaintyLevel)
	
	// Gerar recomendação
	recommendation := s.generateRecommendation(adjustedScore, confidence, req.DecisionType)
	
	// Identificar fatores críticos
	criticalFactors := s.identifyCriticalFactors(criteria)
	
	// Análise de sensibilidade
	sensitivityAnalysis := s.performSensitivityAnalysis(criteria, overallScore)
	
	return &pb.DecisionResponse{
		DecisionType:        req.DecisionType,
		OverallScore:        overallScore,
		AdjustedScore:       adjustedScore,
		Confidence:          confidence,
		Recommendation:      recommendation,
		CriticalFactors:     criticalFactors,
		SensitivityAnalysis: sensitivityAnalysis,
		Timestamp:           time.Now().Unix(),
	}, nil
}

// OptimizePlantingStrategy otimiza estratégia de plantio
func (s *DecisionEngineService) OptimizePlantingStrategy(
	ctx context.Context,
	req *pb.PlantingOptimizationRequest,
) (*pb.PlantingOptimizationResponse, error) {
	// Gerar combinações possíveis de culturas
	cropOptions := req.CropOptions
	totalArea := req.TotalArea
	
	// Simular múltiplos cenários
	var scenarios []*pb.PlantingScenario
	
	// Cenário 1: Monocultura cultura dominante
	if len(cropOptions) > 0 {
		dominant := cropOptions[0]
		scenario1 := s.createPlantingScenario(
			"monocultura_dominante",
			[]string{dominant.CropType},
			[]float64{totalArea},
			dominant.ExpectedYield,
			dominant.ExpectedPrice,
			0.4, // risk médio-alto
		)
		scenarios = append(scenarios, scenario1)
	}
	
	// Cenário 2: Diversificação 50-50 (se há 2+ culturas)
	if len(cropOptions) >= 2 {
		scenario2 := s.createPlantingScenario(
			"diversificacao_equilibrada",
			[]string{cropOptions[0].CropType, cropOptions[1].CropType},
			[]float64{totalArea * 0.5, totalArea * 0.5},
			(cropOptions[0].ExpectedYield + cropOptions[1].ExpectedYield) / 2,
			(cropOptions[0].ExpectedPrice + cropOptions[1].ExpectedPrice) / 2,
			0.25, // risk médio
		)
		scenarios = append(scenarios, scenario2)
	}
	
	// Cenário 3: Diversificação máxima (3+ culturas)
	if len(cropOptions) >= 3 {
		cropTypes := make([]string, 0, len(cropOptions))
		areas := make([]float64, 0, len(cropOptions))
		avgYield := 0.0
		avgPrice := 0.0
		
		areaPerCrop := totalArea / float64(len(cropOptions))
		for _, opt := range cropOptions {
			cropTypes = append(cropTypes, opt.CropType)
			areas = append(areas, areaPerCrop)
			avgYield += opt.ExpectedYield
			avgPrice += opt.ExpectedPrice
		}
		
		scenario3 := s.createPlantingScenario(
			"diversificacao_maxima",
			cropTypes,
			areas,
			avgYield/float64(len(cropOptions)),
			avgPrice/float64(len(cropOptions)),
			0.15, // risk baixo
		)
		scenarios = append(scenarios, scenario3)
	}
	
	// Ordenar por objetivo
	s.rankScenariosByObjective(scenarios, req.OptimizationGoal, req.RiskAppetite)
	
	// Recomendar melhor cenário
	optimalScenario := scenarios[0]
	
	// Análise de trade-offs
	tradeoffs := s.analyzeTradeoffs(scenarios)
	
	// Recomendações específicas
	recommendations := s.generatePlantingRecommendations(
		optimalScenario,
		req.Constraints,
		req.RiskAppetite,
	)
	
	return &pb.PlantingOptimizationResponse{
		OptimalScenario:    optimalScenario,
		AlternativeScenarios: scenarios[1:],
		Tradeoffs:          tradeoffs,
		Recommendations:    recommendations,
		Timestamp:          time.Now().Unix(),
	}, nil
}

// CompareScenarios compara múltiplos cenários
func (s *DecisionEngineService) CompareScenarios(
	ctx context.Context,
	req *pb.ScenarioComparisonRequest,
) (*pb.ScenarioComparisonResponse, error) {
	scenarios := req.Scenarios
	
	// Calcular métricas para cada cenário
	var comparisons []*pb.ScenarioComparison
	
	for _, scenario := range scenarios {
		// Expected Value
		expectedValue := scenario.Revenue - scenario.Cost
		
		// Risk-adjusted return
		riskAdjustedReturn := expectedValue / (1 + scenario.RiskScore)
		
		// Sharpe Ratio (simplificado)
		sharpeRatio := expectedValue / math.Max(scenario.RiskScore*1000, 100)
		
		// Probabilidade de sucesso
		successProb := s.calculateSuccessProbability(scenario.RiskScore, scenario.Confidence)
		
		// Worst/Best case
		worstCase := expectedValue * (1 - scenario.RiskScore)
		bestCase := expectedValue * (1 + scenario.RiskScore*0.5)
		
		comparison := &pb.ScenarioComparison{
			ScenarioId:         scenario.Id,
			ScenarioName:       scenario.Name,
			ExpectedValue:      expectedValue,
			RiskAdjustedReturn: riskAdjustedReturn,
			SharpeRatio:        sharpeRatio,
			SuccessProbability: successProb,
			WorstCase:          worstCase,
			BestCase:           bestCase,
		}
		
		comparisons = append(comparisons, comparison)
	}
	
	// Ordenar por critério escolhido
	s.sortComparisons(comparisons, req.ComparisonCriteria)
	
	// Identificar melhor cenário
	bestScenario := comparisons[0]
	
	// Matriz de trade-offs
	tradeoffMatrix := s.buildTradeoffMatrix(comparisons)
	
	// Análise de sensibilidade
	sensitivityFactors := s.analyzeSensitivityFactors(scenarios)
	
	// Recomendação
	recommendation := fmt.Sprintf(
		"Cenário '%s' apresenta melhor desempenho com Expected Value de R$ %.2f e Sharpe Ratio de %.2f",
		bestScenario.ScenarioName,
		bestScenario.ExpectedValue,
		bestScenario.SharpeRatio,
	)
	
	return &pb.ScenarioComparisonResponse{
		Comparisons:        comparisons,
		BestScenario:       bestScenario,
		TradeoffMatrix:     tradeoffMatrix,
		SensitivityFactors: sensitivityFactors,
		Recommendation:     recommendation,
		Timestamp:          time.Now().Unix(),
	}, nil
}

// RecommendHedgeStrategy recomenda estratégia de hedge
func (s *DecisionEngineService) RecommendHedgeStrategy(
	ctx context.Context,
	req *pb.HedgeRecommendationRequest,
) (*pb.HedgeRecommendationResponse, error) {
	// Gerar estratégias de hedge
	var strategies []*pb.HedgeStrategy
	
	// Estratégia 1: Hedge Parcial (50-70%)
	partialHedge := s.createHedgeStrategy(
		"hedge_parcial",
		"FUTURES",
		req.Commodity,
		req.Volume*0.6,
		req.CurrentPrice*1.02,
		0.60, // 60% proteção
		0.40, // 40% upside
		req.Volume*0.6*req.CurrentPrice*0.02, // custo ~2%
	)
	strategies = append(strategies, partialHedge)
	
	// Estratégia 2: Hedge Total (100%)
	fullHedge := s.createHedgeStrategy(
		"hedge_total",
		"FUTURES",
		req.Commodity,
		req.Volume,
		req.CurrentPrice*1.01,
		1.0, // 100% proteção
		0.0, // 0% upside
		req.Volume*req.CurrentPrice*0.025, // custo ~2.5%
	)
	strategies = append(strategies, fullHedge)
	
	// Estratégia 3: Collar (Opções)
	collar := s.createHedgeStrategy(
		"collar_opcoes",
		"OPTIONS",
		req.Commodity,
		req.Volume,
		req.CurrentPrice,
		0.85, // 85% proteção (floor)
		0.20, // 20% upside (cap)
		req.Volume*req.CurrentPrice*0.015, // custo ~1.5%
	)
	strategies = append(strategies, collar)
	
	// Calcular efetividade para cada estratégia
	for _, strategy := range strategies {
		strategy.Effectiveness = s.calculateHedgeEffectiveness(
			strategy,
			req.PriceVolatility,
			req.RiskAppetite,
		)
	}
	
	// Ordenar por efetividade
	sort.Slice(strategies, func(i, j int) bool {
		return strategies[i].Effectiveness > strategies[j].Effectiveness
	})
	
	// Recomendar melhor estratégia
	recommendedStrategy := strategies[0]
	
	// Calcular proteção esperada
	expectedProtection := s.calculateExpectedProtection(
		recommendedStrategy,
		req.Volume,
		req.CurrentPrice,
		req.PriceVolatility,
	)
	
	// Análise de custo-benefício
	costBenefitAnalysis := fmt.Sprintf(
		"Custo: R$ %.2f | Proteção: %.0f%% | Upside: %.0f%%",
		recommendedStrategy.Cost,
		recommendedStrategy.ProtectionLevel*100,
		recommendedStrategy.UpsideRetention*100,
	)
	
	// Recomendações
	recommendations := []string{
		fmt.Sprintf("Implementar %s para proteger %.0f%% da exposição", recommendedStrategy.StrategyType, recommendedStrategy.ProtectionLevel*100),
		"Monitorar basis (diferença futuros vs físico) semanalmente",
		"Ajustar posição conforme evolução da safra",
	}
	
	if req.RiskAppetite == "CONSERVATIVE" {
		recommendations = append(recommendations, "Considerar aumentar proteção para 80-100%")
	}
	
	return &pb.HedgeRecommendationResponse{
		RecommendedStrategy:  recommendedStrategy,
		AlternativeStrategies: strategies[1:],
		ExpectedProtection:   expectedProtection,
		CostBenefitAnalysis:  costBenefitAnalysis,
		Recommendations:      recommendations,
		Timestamp:            time.Now().Unix(),
	}, nil
}

// AssessInsuranceNeed avalia necessidade de seguro
func (s *DecisionEngineService) AssessInsuranceNeed(
	ctx context.Context,
	req *pb.InsuranceAssessmentRequest,
) (*pb.InsuranceAssessmentResponse, error) {
	// Calcular exposição ao risco
	exposureValue := req.ExpectedRevenue
	
	// Avaliar riscos por categoria
	riskScores := map[string]float64{
		"CLIMATE":    s.assessClimateRisk(req.ClimateRiskLevel),
		"MARKET":     s.assessMarketRisk(req.PriceVolatility),
		"OPERATIONAL": 0.3, // fixo para exemplo
		"FINANCIAL":  0.2,
	}
	
	// Risco agregado
	aggregatedRisk := 0.0
	for _, score := range riskScores {
		aggregatedRisk += score
	}
	aggregatedRisk = aggregatedRisk / float64(len(riskScores))
	
	// Calcular perda máxima esperada (VaR 95%)
	maxExpectedLoss := exposureValue * aggregatedRisk * 1.645 // Z-score 95%
	
	// Determinar necessidade de seguro
	insuranceNeed := "NONE"
	if aggregatedRisk > 0.5 {
		insuranceNeed = "HIGH"
	} else if aggregatedRisk > 0.3 {
		insuranceNeed = "MEDIUM"
	} else if aggregatedRisk > 0.15 {
		insuranceNeed = "LOW"
	}
	
	// Gerar produtos recomendados
	var recommendedProducts []*pb.InsuranceProduct
	
	if aggregatedRisk > 0.2 {
		// Seguro de produtividade
		productivityInsurance := &pb.InsuranceProduct{
			ProductType:  "CROP_PRODUCTIVITY",
			CoverageLevel: 0.70,
			Premium:      exposureValue * 0.04, // 4% da receita
			Deductible:   exposureValue * 0.10,
			MaxPayout:    exposureValue * 0.70,
			CoveredRisks: []string{"DROUGHT", "FROST", "HAIL", "EXCESS_RAIN"},
			Recommendation: "Recomendado: protege contra perdas climáticas",
		}
		recommendedProducts = append(recommendedProducts, productivityInsurance)
	}
	
	if req.PriceVolatility > 0.25 {
		// Seguro de receita
		revenueInsurance := &pb.InsuranceProduct{
			ProductType:  "REVENUE_PROTECTION",
			CoverageLevel: 0.80,
			Premium:      exposureValue * 0.06, // 6% da receita
			Deductible:   exposureValue * 0.05,
			MaxPayout:    exposureValue * 0.80,
			CoveredRisks: []string{"PRICE_DROP", "YIELD_LOSS"},
			Recommendation: "Recomendado: protege receita total (preço + volume)",
		}
		recommendedProducts = append(recommendedProducts, revenueInsurance)
	}
	
	// Seguro paramétrico (inovação)
	if aggregatedRisk > 0.3 {
		parametricInsurance := &pb.InsuranceProduct{
			ProductType:  "PARAMETRIC",
			CoverageLevel: 0.60,
			Premium:      exposureValue * 0.03, // 3% da receita
			Deductible:   0, // sem franquia
			MaxPayout:    exposureValue * 0.60,
			CoveredRisks: []string{"PRECIPITATION_INDEX", "TEMPERATURE_INDEX"},
			Recommendation: "Inovador: pagamento automático por índices climáticos",
		}
		recommendedProducts = append(recommendedProducts, parametricInsurance)
	}
	
	// Análise de custo-benefício
	totalPremiums := 0.0
	totalCoverage := 0.0
	for _, product := range recommendedProducts {
		totalPremiums += product.Premium
		totalCoverage += product.MaxPayout
	}
	
	costBenefitRatio := 0.0
	if totalPremiums > 0 {
		costBenefitRatio = totalCoverage / totalPremiums
	}
	
	costBenefitAnalysis := fmt.Sprintf(
		"Prêmio Total: R$ %.2f | Cobertura: R$ %.2f | Ratio: %.2fx",
		totalPremiums,
		totalCoverage,
		costBenefitRatio,
	)
	
	// Recomendação final
	var recommendation string
	if insuranceNeed == "HIGH" {
		recommendation = "Seguro altamente recomendado: risco elevado justifica proteção"
	} else if insuranceNeed == "MEDIUM" {
		recommendation = "Seguro recomendado: considerar proteção de riscos críticos"
	} else if insuranceNeed == "LOW" {
		recommendation = "Seguro opcional: avaliar custo-benefício caso a caso"
	} else {
		recommendation = "Seguro não prioritário: risco gerenciável com outras estratégias"
	}
	
	return &pb.InsuranceAssessmentResponse{
		InsuranceNeed:       insuranceNeed,
		AggregatedRisk:      aggregatedRisk,
		MaxExpectedLoss:     maxExpectedLoss,
		RiskBreakdown:       s.convertRiskBreakdown(riskScores),
		RecommendedProducts: recommendedProducts,
		CostBenefitAnalysis: costBenefitAnalysis,
		Recommendation:      recommendation,
		Timestamp:           time.Now().Unix(),
	}, nil
}

// CalculateExpectedValue calcula valor esperado de decisões
func (s *DecisionEngineService) CalculateExpectedValue(
	ctx context.Context,
	req *pb.ExpectedValueRequest,
) (*pb.ExpectedValueResponse, error) {
	outcomes := req.Outcomes
	
	// Calcular Expected Value
	expectedValue := 0.0
	totalProbability := 0.0
	
	for _, outcome := range outcomes {
		expectedValue += outcome.Value * outcome.Probability
		totalProbability += outcome.Probability
	}
	
	// Normalizar se probabilidades não somam 1
	if totalProbability > 1.01 || totalProbability < 0.99 {
		expectedValue = expectedValue / totalProbability
	}
	
	// Calcular variância e desvio padrão
	variance := 0.0
	for _, outcome := range outcomes {
		diff := outcome.Value - expectedValue
		variance += outcome.Probability * diff * diff
	}
	standardDeviation := math.Sqrt(variance)
	
	// Coeficiente de variação
	coefficientOfVariation := 0.0
	if expectedValue != 0 {
		coefficientOfVariation = standardDeviation / math.Abs(expectedValue)
	}
	
	// Calcular percentis (simplificado)
	sortedOutcomes := make([]*pb.Outcome, len(outcomes))
	copy(sortedOutcomes, outcomes)
	sort.Slice(sortedOutcomes, func(i, j int) bool {
		return sortedOutcomes[i].Value < sortedOutcomes[j].Value
	})
	
	percentile10 := s.calculatePercentile(sortedOutcomes, 0.10)
	percentile50 := s.calculatePercentile(sortedOutcomes, 0.50)
	percentile90 := s.calculatePercentile(sortedOutcomes, 0.90)
	
	// Calcular Downside Risk (semi-variância abaixo da média)
	downsideRisk := 0.0
	for _, outcome := range outcomes {
		if outcome.Value < expectedValue {
			diff := expectedValue - outcome.Value
			downsideRisk += outcome.Probability * diff * diff
		}
	}
	downsideRisk = math.Sqrt(downsideRisk)
	
	// Calcular Upside Potential
	upsidePotential := 0.0
	for _, outcome := range outcomes {
		if outcome.Value > expectedValue {
			diff := outcome.Value - expectedValue
			upsidePotential += outcome.Probability * diff
		}
	}
	
	// Sortino Ratio (EV / Downside Risk)
	sortinoRatio := 0.0
	if downsideRisk > 0 {
		sortinoRatio = expectedValue / downsideRisk
	}
	
	// Interpretar risco
	var riskInterpretation string
	if coefficientOfVariation < 0.3 {
		riskInterpretation = "BAIXO - Resultado previsível"
	} else if coefficientOfVariation < 0.6 {
		riskInterpretation = "MÉDIO - Variação moderada"
	} else {
		riskInterpretation = "ALTO - Alta incerteza"
	}
	
	// Recomendação
	var recommendation string
	if expectedValue > 0 && coefficientOfVariation < 0.5 {
		recommendation = "Decisão favorável: EV positivo com risco controlado"
	} else if expectedValue > 0 && coefficientOfVariation >= 0.5 {
		recommendation = "Decisão potencialmente favorável, mas com alta incerteza - considerar mitigação de riscos"
	} else if expectedValue < 0 {
		recommendation = "Decisão desfavorável: EV negativo - não recomendado"
	} else {
		recommendation = "Decisão neutra: avaliar outros critérios qualitativos"
	}
	
	return &pb.ExpectedValueResponse{
		ExpectedValue:         expectedValue,
		StandardDeviation:     standardDeviation,
		CoefficientOfVariation: coefficientOfVariation,
		Percentile_10:         percentile10,
		Percentile_50:         percentile50,
		Percentile_90:         percentile90,
		DownsideRisk:          downsideRisk,
		UpsidePotential:       upsidePotential,
		SortinoRatio:          sortinoRatio,
		RiskInterpretation:    riskInterpretation,
		Recommendation:        recommendation,
		Timestamp:             time.Now().Unix(),
	}, nil
}

// ========== Helper Functions ==========

func (s *DecisionEngineService) calculateRiskAdjustment(riskLevel string, riskAppetite string) float64 {
	// Matriz de ajuste baseada em risco e apetite
	adjustments := map[string]map[string]float64{
		"LOW": {
			"CONSERVATIVE": 1.0,
			"MODERATE":     1.05,
			"AGGRESSIVE":   1.1,
		},
		"MEDIUM": {
			"CONSERVATIVE": 0.85,
			"MODERATE":     1.0,
			"AGGRESSIVE":   1.05,
		},
		"HIGH": {
			"CONSERVATIVE": 0.7,
			"MODERATE":     0.85,
			"AGGRESSIVE":   1.0,
		},
		"CRITICAL": {
			"CONSERVATIVE": 0.5,
			"MODERATE":     0.7,
			"AGGRESSIVE":   0.85,
		},
	}
	
	if levelMap, ok := adjustments[riskLevel]; ok {
		if adj, ok := levelMap[riskAppetite]; ok {
			return adj
		}
	}
	
	return 1.0
}

func (s *DecisionEngineService) calculateConfidence(criteria []models.DecisionCriterion, uncertainty float64) float64 {
	// Confiança base a partir da consistência dos scores
	var scores []float64
	for _, c := range criteria {
		scores = append(scores, c.Score)
	}
	
	// Calcular desvio padrão dos scores
	mean := 0.0
	for _, score := range scores {
		mean += score
	}
	mean = mean / float64(len(scores))
	
	variance := 0.0
	for _, score := range scores {
		diff := score - mean
		variance += diff * diff
	}
	stdDev := math.Sqrt(variance / float64(len(scores)))
	
	// Confiança inversamente proporcional ao desvio e incerteza
	confidence := 1.0 - (stdDev/100.0 + uncertainty) / 2.0
	return math.Max(0.1, math.Min(1.0, confidence))
}

func (s *DecisionEngineService) generateRecommendation(score, confidence float64, decisionType string) string {
	if score >= 70 && confidence >= 0.7 {
		return fmt.Sprintf("RECOMENDADO: %s apresenta alta viabilidade (score: %.1f, confiança: %.0f%%)", decisionType, score, confidence*100)
	} else if score >= 50 && confidence >= 0.5 {
		return fmt.Sprintf("AVALIAR: %s viável mas requer análise adicional", decisionType)
	} else {
		return fmt.Sprintf("NÃO RECOMENDADO: %s apresenta baixa viabilidade", decisionType)
	}
}

func (s *DecisionEngineService) identifyCriticalFactors(criteria []models.DecisionCriterion) []string {
	var critical []string
	for _, c := range criteria {
		if c.Weight > 0.2 || c.Score < 30 {
			critical = append(critical, fmt.Sprintf("%s (peso: %.0f%%, score: %.0f)", c.Name, c.Weight*100, c.Score))
		}
	}
	return critical
}

func (s *DecisionEngineService) performSensitivityAnalysis(criteria []models.DecisionCriterion, baseScore float64) map[string]float64 {
	sensitivity := make(map[string]float64)
	
	for _, c := range criteria {
		// Simular variação de +10 pontos no score
		delta := 10.0 * c.Weight
		sensitivity[c.Name] = delta / baseScore * 100 // % de impacto
	}
	
	return sensitivity
}

func (s *DecisionEngineService) createPlantingScenario(
	id, name string,
	cropTypes []string,
	areas []float64,
	avgYield, avgPrice, risk float64,
) *pb.PlantingScenario {
	totalArea := 0.0
	for _, area := range areas {
		totalArea += area
	}
	
	revenue := totalArea * avgYield * avgPrice
	cost := totalArea * 3000 // custo médio R$ 3000/ha
	
	return &pb.PlantingScenario{
		Id:             id,
		Name:           name,
		CropTypes:      cropTypes,
		Areas:          areas,
		Revenue:        revenue,
		Cost:           cost,
		ExpectedProfit: revenue - cost,
		RiskScore:      risk,
		Confidence:     0.75,
	}
}

func (s *DecisionEngineService) rankScenariosByObjective(
	scenarios []*pb.PlantingScenario,
	objective string,
	riskAppetite string,
) {
	sort.Slice(scenarios, func(i, j int) bool {
		switch objective {
		case "MAXIMIZE_REVENUE":
			return scenarios[i].Revenue > scenarios[j].Revenue
		case "MINIMIZE_RISK":
			return scenarios[i].RiskScore < scenarios[j].RiskScore
		case "MAXIMIZE_SHARPE":
			sharpeI := scenarios[i].ExpectedProfit / (1 + scenarios[i].RiskScore)
			sharpeJ := scenarios[j].ExpectedProfit / (1 + scenarios[j].RiskScore)
			return sharpeI > sharpeJ
		default: // BALANCE_RISK_RETURN
			scoreI := scenarios[i].ExpectedProfit * (1 - scenarios[i].RiskScore*0.5)
			scoreJ := scenarios[j].ExpectedProfit * (1 - scenarios[j].RiskScore*0.5)
			return scoreI > scoreJ
		}
	})
}

func (s *DecisionEngineService) analyzeTradeoffs(scenarios []*pb.PlantingScenario) []string {
	if len(scenarios) < 2 {
		return []string{"Apenas um cenário disponível"}
	}
	
	best := scenarios[0]
	second := scenarios[1]
	
	revenueDiff := best.Revenue - second.Revenue
	riskDiff := best.RiskScore - second.RiskScore
	
	return []string{
		fmt.Sprintf("Cenário ótimo oferece R$ %.2f a mais de receita", revenueDiff),
		fmt.Sprintf("Diferença de risco: %.1f pontos percentuais", riskDiff*100),
	}
}

func (s *DecisionEngineService) generatePlantingRecommendations(
	scenario *pb.PlantingScenario,
	constraints []string,
	riskAppetite string,
) []string {
	recommendations := []string{
		fmt.Sprintf("Alocar %.0f hectares conforme distribuição recomendada", s.sumAreas(scenario.Areas)),
		"Monitorar condições climáticas antes do plantio",
		"Preparar sistema de irrigação",
	}
	
	if scenario.RiskScore > 0.3 && riskAppetite == "CONSERVATIVE" {
		recommendations = append(recommendations, "Considerar seguro agrícola devido ao risco elevado")
	}
	
	return recommendations
}

func (s *DecisionEngineService) sumAreas(areas []float64) float64 {
	sum := 0.0
	for _, a := range areas {
		sum += a
	}
	return sum
}

func (s *DecisionEngineService) sortComparisons(comparisons []*pb.ScenarioComparison, criteria string) {
	sort.Slice(comparisons, func(i, j int) bool {
		switch criteria {
		case "EXPECTED_VALUE":
			return comparisons[i].ExpectedValue > comparisons[j].ExpectedValue
		case "SHARPE_RATIO":
			return comparisons[i].SharpeRatio > comparisons[j].SharpeRatio
		case "SUCCESS_PROBABILITY":
			return comparisons[i].SuccessProbability > comparisons[j].SuccessProbability
		default:
			return comparisons[i].RiskAdjustedReturn > comparisons[j].RiskAdjustedReturn
		}
	})
}

func (s *DecisionEngineService) buildTradeoffMatrix(comparisons []*pb.ScenarioComparison) map[string]string {
	matrix := make(map[string]string)
	
	if len(comparisons) >= 2 {
		best := comparisons[0]
		second := comparisons[1]
		
		matrix["revenue_tradeoff"] = fmt.Sprintf("%.1f%% a mais", (best.ExpectedValue-second.ExpectedValue)/second.ExpectedValue*100)
		matrix["risk_tradeoff"] = fmt.Sprintf("Sharpe %.2f vs %.2f", best.SharpeRatio, second.SharpeRatio)
	}
	
	return matrix
}

func (s *DecisionEngineService) analyzeSensitivityFactors(scenarios []*pb.Scenario) []string {
	return []string{
		"Preço de commodities: impacto alto (±15% no resultado)",
		"Produtividade: impacto médio (±10% no resultado)",
		"Custos operacionais: impacto baixo (±5% no resultado)",
	}
}

func (s *DecisionEngineService) createHedgeStrategy(
	id, strategyType, commodity string,
	volume, price, protection, upside, cost float64,
) *pb.HedgeStrategy {
	return &pb.HedgeStrategy{
		StrategyId:       id,
		StrategyType:     strategyType,
		Commodity:        commodity,
		Volume:           volume,
		HedgePrice:       price,
		ProtectionLevel:  protection,
		UpsideRetention:  upside,
		Cost:             cost,
		Effectiveness:    0.0, // será calculado depois
	}
}

func (s *DecisionEngineService) calculateHedgeEffectiveness(
	strategy *pb.HedgeStrategy,
	volatility float64,
	riskAppetite string,
) float64 {
	// Efetividade baseada em proteção, custo e upside
	protectionScore := strategy.ProtectionLevel * 0.5
	upsideScore := strategy.UpsideRetention * 0.3
	costScore := (1 - strategy.Cost/(strategy.Volume*strategy.HedgePrice)) * 0.2
	
	effectiveness := protectionScore + upsideScore + costScore
	
	// Ajustar por apetite ao risco
	if riskAppetite == "CONSERVATIVE" {
		effectiveness = effectiveness * (1 + strategy.ProtectionLevel*0.2)
	} else if riskAppetite == "AGGRESSIVE" {
		effectiveness = effectiveness * (1 + strategy.UpsideRetention*0.3)
	}
	
	return math.Min(1.0, effectiveness)
}

func (s *DecisionEngineService) calculateExpectedProtection(
	strategy *pb.HedgeStrategy,
	volume, price, volatility float64,
) float64 {
	// Proteção esperada = volume protegido × possível variação negativa
	potentialLoss := volume * price * volatility * 1.645 // VaR 95%
	return potentialLoss * strategy.ProtectionLevel
}

func (s *DecisionEngineService) assessClimateRisk(level string) float64 {
	risks := map[string]float64{
		"LOW":      0.1,
		"MEDIUM":   0.3,
		"HIGH":     0.5,
		"CRITICAL": 0.7,
	}
	
	if risk, ok := risks[level]; ok {
		return risk
	}
	return 0.3
}

func (s *DecisionEngineService) assessMarketRisk(volatility float64) float64 {
	// Volatilidade como proxy de risco de mercado
	return math.Min(0.9, volatility)
}

func (s *DecisionEngineService) convertRiskBreakdown(scores map[string]float64) map[string]float64 {
	return scores
}

func (s *DecisionEngineService) calculatePercentile(sortedOutcomes []*pb.Outcome, percentile float64) float64 {
	cumulativeProb := 0.0
	for _, outcome := range sortedOutcomes {
		cumulativeProb += outcome.Probability
		if cumulativeProb >= percentile {
			return outcome.Value
		}
	}
	return sortedOutcomes[len(sortedOutcomes)-1].Value
}

func (s *DecisionEngineService) calculateSuccessProbability(risk, confidence float64) float64 {
	return confidence * (1 - risk)
}
