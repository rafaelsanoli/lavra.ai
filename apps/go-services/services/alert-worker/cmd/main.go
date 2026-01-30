package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"os"
	"os/signal"
	"syscall"

	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"

	"github.com/rafaelsanoli/lavra.ai/go-services/services/alert-worker/internal/server"
	"github.com/rafaelsanoli/lavra.ai/go-services/services/alert-worker/internal/service"
)

const (
	defaultPort = "50054"
)

func main() {
	// Get port from environment or use default
	port := os.Getenv("ALERT_SERVICE_PORT")
	if port == "" {
		port = defaultPort
	}

	// Create listener
	lis, err := net.Listen("tcp", fmt.Sprintf(":%s", port))
	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}

	// Initialize service
	alertService := service.NewAlertWorkerService()

	// Create gRPC server
	grpcServer := grpc.NewServer(
		grpc.MaxRecvMsgSize(10 * 1024 * 1024), // 10MB
		grpc.MaxSendMsgSize(10 * 1024 * 1024), // 10MB
	)

	// Register service
	server.RegisterAlertWorkerServer(grpcServer, alertService)

	// Register reflection service
	reflection.Register(grpcServer)

	// Graceful shutdown
	go func() {
		sigChan := make(chan os.Signal, 1)
		signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)
		<-sigChan
		log.Println("Shutting down gracefully...")
		grpcServer.GracefulStop()
	}()

	log.Printf("🔔 Alert Worker Service listening on port %s", port)
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
}
