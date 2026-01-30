package server

import (
	"context"
	
	pb "github.com/rafaelsanoli/lavra.ai/go-services/pb/climate"
)

// ClimateAnalysisServer interface (gerada pelo protoc)
type ClimateAnalysisServer interface {
	CalculateClimateRisk(context.Context, *pb.ClimateRiskRequest) (*pb.ClimateRiskResponse, error)
	AnalyzePlantingConditions(context.Context, *pb.PlantingConditionsRequest) (*pb.PlantingConditionsResponse, error)
	PredictHarvestWindow(context.Context, *pb.HarvestWindowRequest) (*pb.HarvestWindowResponse, error)
	CalculateWaterBalance(context.Context, *pb.WaterBalanceRequest) (*pb.WaterBalanceResponse, error)
	DetectExtremeEvents(context.Context, *pb.ExtremeEventsRequest) (*pb.ExtremeEventsResponse, error)
	AnalyzeCropGrowth(context.Context, *pb.CropGrowthRequest) (*pb.CropGrowthResponse, error)
}

// RegisterClimateAnalysisServer registra o servidor gRPC
func RegisterClimateAnalysisServer(s interface{}, srv ClimateAnalysisServer) {
	// Implementação será gerada pelo protoc
}
