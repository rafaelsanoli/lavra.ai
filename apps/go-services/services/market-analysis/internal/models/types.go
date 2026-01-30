package models

// LinearTrend representa uma tendência linear (y = mx + b)
type LinearTrend struct {
	Slope     float64 // m (inclinação)
	Intercept float64 // b (intercepto)
}

// PriceSeries representa uma série temporal de preços
type PriceSeries struct {
	Commodity string
	Market    string
	Prices    []PricePoint
}

// PricePoint representa um ponto de preço
type PricePoint struct {
	Date  string
	Price float64
}

// StatisticalSummary contém estatísticas descritivas
type StatisticalSummary struct {
	Mean     float64
	Median   float64
	StdDev   float64
	Min      float64
	Max      float64
	Q1       float64
	Q3       float64
}

// VolatilityMetrics contém métricas de volatilidade
type VolatilityMetrics struct {
	HistoricalVol float64 // Volatilidade histórica
	ImpliedVol    float64 // Volatilidade implícita
	RealizedVol   float64 // Volatilidade realizada
	GARCH         float64 // GARCH(1,1)
}

// TrendIndicators contém indicadores de tendência
type TrendIndicators struct {
	SMA50         float64 // Média móvel 50 dias
	SMA200        float64 // Média móvel 200 dias
	EMA20         float64 // Média móvel exponencial 20 dias
	RSI           float64 // Relative Strength Index
	MACD          float64 // Moving Average Convergence Divergence
	BollingerUp   float64 // Bollinger Band superior
	BollingerDown float64 // Bollinger Band inferior
}
