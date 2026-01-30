package models

import "time"

// DecisionCriterion representa um critério de decisão
type DecisionCriterion struct {
	Name        string
	Weight      float64 // 0-1
	Score       float64 // 0-100
	Description string
}

// Scenario representa um cenário de decisão
type Scenario struct {
	ID          string
	Name        string
	Description string
	Probability float64
	Revenue     float64
	Cost        float64
	Risk        float64
	Criteria    []DecisionCriterion
}

// HedgeStrategy estratégia de hedge
type HedgeStrategy struct {
	Type           string  // FUTURES, OPTIONS, SWAP
	Commodity      string
	Volume         float64 // toneladas
	Price          float64 // por tonelada
	ExpirationDate time.Time
	Cost           float64
	Protection     float64 // % proteção de downside
	Upside         float64 // % upside preservado
}

// InsuranceProduct produto de seguro
type InsuranceProduct struct {
	Type        string  // CROP, REVENUE, PARAMETRIC
	Coverage    float64 // %
	Premium     float64 // R$
	Deductible  float64 // R$
	MaxPayout   float64 // R$
	Risks       []string
}

// PlantingWindow janela de plantio
type PlantingWindow struct {
	StartDate   time.Time
	EndDate     time.Time
	CropType    string
	Area        float64 // hectares
	ExpectedYield float64
	RiskLevel   string
}

// DecisionType tipos de decisão
type DecisionType string

const (
	DecisionPlanting   DecisionType = "PLANTING"
	DecisionHarvest    DecisionType = "HARVEST"
	DecisionHedge      DecisionType = "HEDGE"
	DecisionInsurance  DecisionType = "INSURANCE"
	DecisionInvestment DecisionType = "INVESTMENT"
)

// RiskAppetite apetite ao risco
type RiskAppetite string

const (
	RiskConservative RiskAppetite = "CONSERVATIVE"
	RiskModerate     RiskAppetite = "MODERATE"
	RiskAggressive   RiskAppetite = "AGGRESSIVE"
)

// OptimizationObjective objetivo de otimização
type OptimizationObjective string

const (
	MaximizeRevenue       OptimizationObjective = "MAXIMIZE_REVENUE"
	MinimizeRisk          OptimizationObjective = "MINIMIZE_RISK"
	MaximizeSharpeRatio   OptimizationObjective = "MAXIMIZE_SHARPE"
	BalanceRiskReturn     OptimizationObjective = "BALANCE_RISK_RETURN"
)
