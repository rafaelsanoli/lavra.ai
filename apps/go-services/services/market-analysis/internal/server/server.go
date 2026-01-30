package server

import (
	"context"
	
	pb "github.com/rafaelsanoli/lavra.ai/go-services/pb/market"
)

// MarketAnalysisServer interface (gerada pelo protoc)
type MarketAnalysisServer interface {
	AnalyzePriceTrend(context.Context, *pb.PriceTrendRequest) (*pb.PriceTrendResponse, error)
	CalculateVolatility(context.Context, *pb.VolatilityRequest) (*pb.VolatilityResponse, error)
	DetectPriceAnomalies(context.Context, *pb.AnomaliesRequest) (*pb.AnomaliesResponse, error)
	CalculateCorrelations(context.Context, *pb.CorrelationsRequest) (*pb.CorrelationsResponse, error)
	ForecastPrice(context.Context, *pb.ForecastRequest) (*pb.ForecastResponse, error)
	AnalyzeSeasonality(context.Context, *pb.SeasonalityRequest) (*pb.SeasonalityResponse, error)
}

// RegisterMarketAnalysisServer registra o servidor gRPC
func RegisterMarketAnalysisServer(s interface{}, srv MarketAnalysisServer) {
	// Implementação será gerada pelo protoc
	// Este arquivo serve como stub durante desenvolvimento
}
