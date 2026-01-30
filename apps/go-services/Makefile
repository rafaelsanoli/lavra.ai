.PHONY: proto build run test clean docker

# Variáveis
PROTO_DIR=proto
PROTO_OUT=pb
GO_SERVICES=market-analysis climate-analysis decision-engine alert-worker

# Gerar código a partir dos arquivos .proto
proto:
	@echo "Generating protobuf code..."
	mkdir -p $(PROTO_OUT)
	protoc --go_out=$(PROTO_OUT) --go_opt=paths=source_relative \
		--go-grpc_out=$(PROTO_OUT) --go-grpc_opt=paths=source_relative \
		$(PROTO_DIR)/*.proto

# Build todos os serviços
build:
	@echo "Building all services..."
	@for service in $(GO_SERVICES); do \
		echo "Building $$service..."; \
		cd services/$$service && go build -o ../../bin/$$service ./cmd/main.go; \
		cd ../..; \
	done

# Executar serviço específico
run-market:
	@echo "Running Market Analysis Service..."
	@go run services/market-analysis/cmd/main.go

run-climate:
	@echo "Running Climate Analysis Service..."
	@go run services/climate-analysis/cmd/main.go

run-decision:
	@echo "Running Decision Engine Service..."
	@go run services/decision-engine/cmd/main.go

run-alert:
	@echo "Running Alert Worker Service..."
	@go run services/alert-worker/cmd/main.go

# Executar todos os serviços (background)
run-all:
	@echo "Starting all services..."
	@make run-market &
	@make run-climate &
	@make run-decision &
	@make run-alert &

# Testes
test:
	@echo "Running tests..."
	@for service in $(GO_SERVICES); do \
		echo "Testing $$service..."; \
		cd services/$$service && go test ./... -v; \
		cd ../..; \
	done

# Testes com cobertura
test-coverage:
	@echo "Running tests with coverage..."
	@for service in $(GO_SERVICES); do \
		echo "Testing $$service..."; \
		cd services/$$service && go test ./... -coverprofile=coverage.out; \
		go tool cover -html=coverage.out -o coverage.html; \
		cd ../..; \
	done

# Lint
lint:
	@echo "Running linter..."
	@golangci-lint run ./...

# Limpar binários
clean:
	@echo "Cleaning..."
	@rm -rf bin/
	@rm -rf $(PROTO_OUT)/

# Docker build
docker-build:
	@echo "Building Docker images..."
	@for service in $(GO_SERVICES); do \
		echo "Building $$service image..."; \
		docker build -t lavra-$$service:latest -f services/$$service/Dockerfile .; \
	done

# Docker compose
docker-up:
	@echo "Starting services with docker-compose..."
	@docker-compose up -d

docker-down:
	@echo "Stopping services..."
	@docker-compose down

# Dependências
deps:
	@echo "Installing dependencies..."
	@go mod download
	@go mod tidy

# Verificar formatação
fmt:
	@echo "Formatting code..."
	@go fmt ./...

# Verificar código
vet:
	@echo "Vetting code..."
	@go vet ./...

# Help
help:
	@echo "Available targets:"
	@echo "  proto           - Generate protobuf code"
	@echo "  build           - Build all services"
	@echo "  run-market      - Run Market Analysis Service"
	@echo "  run-climate     - Run Climate Analysis Service"
	@echo "  run-decision    - Run Decision Engine Service"
	@echo "  run-alert       - Run Alert Worker Service"
	@echo "  run-all         - Run all services"
	@echo "  test            - Run tests"
	@echo "  test-coverage   - Run tests with coverage"
	@echo "  lint            - Run linter"
	@echo "  clean           - Clean binaries"
	@echo "  docker-build    - Build Docker images"
	@echo "  docker-up       - Start services with docker-compose"
	@echo "  docker-down     - Stop services"
	@echo "  deps            - Install dependencies"
	@echo "  fmt             - Format code"
	@echo "  vet             - Vet code"
