package server

import (
	"context"
	
	pb "github.com/rafaelsanoli/lavra.ai/go-services/pb/alert"
)

// AlertWorkerServer interface (gerada pelo protoc)
type AlertWorkerServer interface {
	ProcessAlert(context.Context, *pb.AlertProcessRequest) (*pb.AlertProcessResponse, error)
	BatchProcessAlerts(context.Context, *pb.BatchAlertRequest) (*pb.BatchAlertResponse, error)
	PrioritizeAlerts(context.Context, *pb.AlertPrioritizationRequest) (*pb.AlertPrioritizationResponse, error)
	DispatchNotifications(context.Context, *pb.NotificationDispatchRequest) (*pb.NotificationDispatchResponse, error)
	AggregateAlerts(context.Context, *pb.AlertAggregationRequest) (*pb.AlertAggregationResponse, error)
	ScheduleAlert(context.Context, *pb.AlertScheduleRequest) (*pb.AlertScheduleResponse, error)
}

// RegisterAlertWorkerServer registra o servidor gRPC
func RegisterAlertWorkerServer(s interface{}, srv AlertWorkerServer) {
	// Implementação será gerada pelo protoc
}
