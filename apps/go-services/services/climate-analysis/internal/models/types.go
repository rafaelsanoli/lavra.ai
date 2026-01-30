package models

import "time"

// ClimateData representa dados climáticos
type ClimateData struct {
	Date          time.Time
	Temperature   float64 // °C
	MinTemp       float64
	MaxTemp       float64
	Precipitation float64 // mm
	Humidity      float64 // %
	WindSpeed     float64 // m/s
	SolarRad      float64 // W/m²
}

// CropStage representa estágio de crescimento
type CropStage struct {
	Name       string
	BaseTemp   float64 // Temperatura base para GDD
	GDDTarget  float64 // GDD necessário para completar estágio
	WaterNeed  float64 // Necessidade hídrica diária (mm)
	DayLength  int     // Duração do estágio (dias)
}

// CropParameters parâmetros agronômicos por cultura
type CropParameters struct {
	CropType      string
	TotalGDD      float64        // GDD total do ciclo
	BaseTemp      float64        // Temperatura base
	OptimalTemp   float64        // Temperatura ótima
	FrostTemp     float64        // Temperatura de geada
	HeatStressTemp float64       // Temperatura de estresse térmico
	WaterReq      float64        // Necessidade hídrica total (mm)
	Stages        []CropStage
}

// WaterBalanceDay representa balanço hídrico diário
type WaterBalanceDay struct {
	Date                time.Time
	Precipitation       float64
	Evapotranspiration  float64
	Balance             float64 // P - ET
	AccumulatedDeficit  float64
	SoilMoisture        float64 // % capacidade de campo
}

// ExtremeEventType tipos de eventos extremos
type ExtremeEventType string

const (
	EventFrost      ExtremeEventType = "FROST"
	EventHeatWave   ExtremeEventType = "HEAT_WAVE"
	EventHeavyRain  ExtremeEventType = "HEAVY_RAIN"
	EventDrought    ExtremeEventType = "DROUGHT"
	EventHail       ExtremeEventType = "HAIL"
	EventStrongWind ExtremeEventType = "STRONG_WIND"
)

// RiskLevel níveis de risco
type RiskLevel string

const (
	RiskLow      RiskLevel = "LOW"
	RiskMedium   RiskLevel = "MEDIUM"
	RiskHigh     RiskLevel = "HIGH"
	RiskCritical RiskLevel = "CRITICAL"
)

// GrowthStageInfo informações de estágio de crescimento
type GrowthStageInfo struct {
	StageName    string
	StartDate    time.Time
	EndDate      time.Time
	GDDRequired  float64
	IsCurrent    bool
}
