package server

import (
	"context"
	
	pb "github.com/rafaelsanoli/lavra.ai/go-services/pb/decision"
)

// DecisionEngineServer interface (gerada pelo protoc)
type DecisionEngineServer interface {
	EvaluateDecision(context.Context, *pb.DecisionRequest) (*pb.DecisionResponse, error)
	OptimizePlantingStrategy(context.Context, *pb.PlantingOptimizationRequest) (*pb.PlantingOptimizationResponse, error)
	CompareScenarios(context.Context, *pb.ScenarioComparisonRequest) (*pb.ScenarioComparisonResponse, error)
	RecommendHedgeStrategy(context.Context, *pb.HedgeRecommendationRequest) (*pb.HedgeRecommendationResponse, error)
	AssessInsuranceNeed(context.Context, *pb.InsuranceAssessmentRequest) (*pb.InsuranceAssessmentResponse, error)
	CalculateExpectedValue(context.Context, *pb.ExpectedValueRequest) (*pb.ExpectedValueResponse, error)
}

// RegisterDecisionEngineServer registra o servidor gRPC
func RegisterDecisionEngineServer(s interface{}, srv DecisionEngineServer) {
	// Implementação será gerada pelo protoc
}
