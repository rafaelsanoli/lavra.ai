package service

import (
	"context"
	"fmt"
	"math/rand"
	"sort"
	"strings"
	"time"

	pb "github.com/rafaelsanoli/lavra.ai/go-services/pb/alert"
	"github.com/rafaelsanoli/lavra.ai/go-services/services/alert-worker/internal/models"
)

// AlertWorkerService implementa o serviço gRPC
type AlertWorkerService struct {
	// pb.UnimplementedAlertWorkerServiceServer
	notificationQueue []models.Notification
	alertCache        map[string]models.Alert
}

// NewAlertWorkerService cria nova instância
func NewAlertWorkerService() *AlertWorkerService {
	return &AlertWorkerService{
		notificationQueue: make([]models.Notification, 0),
		alertCache:        make(map[string]models.Alert),
	}
}

// ProcessAlert processa um alerta individual
func (s *AlertWorkerService) ProcessAlert(
	ctx context.Context,
	req *pb.AlertProcessRequest,
) (*pb.AlertProcessResponse, error) {
	alert := req.Alert
	
	// Validar alerta
	validationErrors := s.validateAlert(alert)
	if len(validationErrors) > 0 {
		return &pb.AlertProcessResponse{
			Success:          false,
			AlertId:          alert.Id,
			ProcessedAt:      time.Now().Unix(),
			ValidationErrors: validationErrors,
		}, nil
	}
	
	// Calcular prioridade
	calculatedPriority := s.calculatePriority(alert)
	
	// Enriquecer alerta com contexto
	enrichedAlert := s.enrichAlert(alert)
	
	// Determinar ações necessárias
	actions := s.determineActions(enrichedAlert, calculatedPriority)
	
	// Identificar destinatários
	recipients := s.identifyRecipients(enrichedAlert, req.UserPreferences)
	
	// Criar notificações
	var notifications []*pb.Notification
	for _, recipient := range recipients {
		channels := s.selectChannels(recipient, enrichedAlert.Severity, req.UserPreferences)
		
		for _, channel := range channels {
			notification := &pb.Notification{
				Id:        s.generateID(),
				AlertId:   alert.Id,
				Channel:   channel,
				Recipient: recipient,
				Subject:   s.formatSubject(enrichedAlert),
				Body:      s.formatBody(enrichedAlert, channel),
				Status:    "PENDING",
				CreatedAt: time.Now().Unix(),
			}
			notifications = append(notifications, notification)
		}
	}
	
	// Armazenar em cache
	s.alertCache[alert.Id] = models.Alert{
		ID:       alert.Id,
		Type:     models.AlertType(alert.Type),
		Severity: models.AlertSeverity(alert.Severity),
		Priority: models.AlertPriority(calculatedPriority),
		Title:    alert.Title,
		Message:  alert.Message,
	}
	
	return &pb.AlertProcessResponse{
		Success:            true,
		AlertId:            alert.Id,
		ProcessedAt:        time.Now().Unix(),
		CalculatedPriority: int32(calculatedPriority),
		Actions:            actions,
		Notifications:      notifications,
		NextReviewAt:       time.Now().Add(1 * time.Hour).Unix(),
	}, nil
}

// BatchProcessAlerts processa múltiplos alertas em lote
func (s *AlertWorkerService) BatchProcessAlerts(
	ctx context.Context,
	req *pb.BatchAlertRequest,
) (*pb.BatchAlertResponse, error) {
	alerts := req.Alerts
	
	var results []*pb.BatchAlertResult
	successCount := 0
	failureCount := 0
	
	startTime := time.Now()
	
	// Processar cada alerta
	for _, alert := range alerts {
		result := &pb.BatchAlertResult{
			AlertId: alert.Id,
		}
		
		// Validar
		errors := s.validateAlert(alert)
		if len(errors) > 0 {
			result.Success = false
			result.ErrorMessage = strings.Join(errors, "; ")
			failureCount++
		} else {
			// Processar
			priority := s.calculatePriority(alert)
			result.Success = true
			result.Priority = int32(priority)
			successCount++
		}
		
		results = append(results, result)
	}
	
	processingTime := time.Since(startTime).Milliseconds()
	
	// Estatísticas
	stats := &pb.BatchProcessingStats{
		TotalAlerts:    int32(len(alerts)),
		SuccessCount:   int32(successCount),
		FailureCount:   int32(failureCount),
		ProcessingTime: processingTime,
		Throughput:     float64(len(alerts)) / (float64(processingTime) / 1000.0),
	}
	
	return &pb.BatchAlertResponse{
		Results:    results,
		Stats:      stats,
		ProcessedAt: time.Now().Unix(),
	}, nil
}

// PrioritizeAlerts prioriza lista de alertas
func (s *AlertWorkerService) PrioritizeAlerts(
	ctx context.Context,
	req *pb.AlertPrioritizationRequest,
) (*pb.AlertPrioritizationResponse, error) {
	alerts := req.Alerts
	strategy := req.Strategy
	
	// Calcular score de prioridade para cada alerta
	type alertScore struct {
		alert *pb.Alert
		score float64
	}
	
	var scores []alertScore
	
	for _, alert := range alerts {
		score := s.calculatePriorityScore(alert, strategy)
		scores = append(scores, alertScore{alert: alert, score: score})
	}
	
	// Ordenar por score (maior primeiro)
	sort.Slice(scores, func(i, j int) bool {
		return scores[i].score > scores[j].score
	})
	
	// Criar alertas priorizados
	var prioritizedAlerts []*pb.PrioritizedAlert
	
	for rank, item := range scores {
		prioritized := &pb.PrioritizedAlert{
			Alert:          item.alert,
			PriorityScore:  item.score,
			Rank:           int32(rank + 1),
			RecommendedSla: s.calculateSLA(item.score),
			Reasoning:      s.explainPriority(item.alert, item.score, strategy),
		}
		prioritizedAlerts = append(prioritizedAlerts, prioritized)
	}
	
	// Identificar alertas críticos (top 20% ou score > 80)
	criticalThreshold := int(float64(len(prioritizedAlerts)) * 0.2)
	var criticalAlerts []string
	
	for i, pa := range prioritizedAlerts {
		if i < criticalThreshold || pa.PriorityScore > 80 {
			criticalAlerts = append(criticalAlerts, pa.Alert.Id)
		}
	}
	
	return &pb.AlertPrioritizationResponse{
		PrioritizedAlerts: prioritizedAlerts,
		CriticalAlerts:    criticalAlerts,
		Strategy:          strategy,
		Timestamp:         time.Now().Unix(),
	}, nil
}

// DispatchNotifications despacha notificações
func (s *AlertWorkerService) DispatchNotifications(
	ctx context.Context,
	req *pb.NotificationDispatchRequest,
) (*pb.NotificationDispatchResponse, error) {
	notifications := req.Notifications
	
	var results []*pb.NotificationDispatchResult
	successCount := 0
	failureCount := 0
	
	for _, notification := range notifications {
		result := &pb.NotificationDispatchResult{
			NotificationId: notification.Id,
			Channel:        notification.Channel,
			Recipient:      notification.Recipient,
		}
		
		// Simular envio com taxa de sucesso de 95%
		sendSuccess := rand.Float64() < 0.95
		
		if sendSuccess {
			result.Success = true
			result.Status = "SENT"
			result.SentAt = time.Now().Unix()
			
			// Simular delivery (90% de taxa)
			if rand.Float64() < 0.90 {
				result.Status = "DELIVERED"
				result.DeliveredAt = time.Now().Add(2 * time.Second).Unix()
			}
			
			successCount++
		} else {
			result.Success = false
			result.Status = "FAILED"
			result.ErrorMessage = "Temporary delivery failure"
			result.RetryScheduledAt = time.Now().Add(5 * time.Minute).Unix()
			failureCount++
		}
		
		results = append(results, result)
	}
	
	// Estatísticas
	stats := &pb.DispatchStats{
		TotalNotifications: int32(len(notifications)),
		SuccessCount:       int32(successCount),
		FailureCount:       int32(failureCount),
		SuccessRate:        float64(successCount) / float64(len(notifications)),
	}
	
	// Agrupar por canal
	channelBreakdown := make(map[string]int32)
	for _, notification := range notifications {
		channelBreakdown[notification.Channel]++
	}
	stats.ChannelBreakdown = channelBreakdown
	
	return &pb.NotificationDispatchResponse{
		Results:   results,
		Stats:     stats,
		Timestamp: time.Now().Unix(),
	}, nil
}

// AggregateAlerts agrega alertas similares
func (s *AlertWorkerService) AggregateAlerts(
	ctx context.Context,
	req *pb.AlertAggregationRequest,
) (*pb.AlertAggregationResponse, error) {
	alerts := req.Alerts
	strategy := req.AggregationStrategy
	windowMinutes := req.TimeWindowMinutes
	
	// Agrupar alertas por estratégia
	groups := s.groupAlerts(alerts, strategy)
	
	var aggregatedGroups []*pb.AggregatedAlertGroup
	
	for key, alertGroup := range groups {
		// Filtrar por janela de tempo
		filteredAlerts := s.filterByTimeWindow(alertGroup, int(windowMinutes))
		
		if len(filteredAlerts) < int(req.MinAlertsToAggregate) {
			// Não agregar se abaixo do mínimo
			continue
		}
		
		// Criar grupo agregado
		aggregated := &pb.AggregatedAlertGroup{
			GroupKey:        key,
			AlertType:       filteredAlerts[0].Type,
			AlertCount:      int32(len(filteredAlerts)),
			FirstAlertTime:  s.getFirstAlertTime(filteredAlerts),
			LastAlertTime:   s.getLastAlertTime(filteredAlerts),
			AggregatedTitle: s.createAggregatedTitle(filteredAlerts),
			AggregatedMessage: s.createAggregatedMessage(filteredAlerts, strategy),
			HighestSeverity: s.getHighestSeverity(filteredAlerts),
			AffectedEntities: s.extractAffectedEntities(filteredAlerts),
		}
		
		aggregatedGroups = append(aggregatedGroups, aggregated)
	}
	
	// Estatísticas
	originalCount := int32(len(alerts))
	aggregatedCount := int32(len(aggregatedGroups))
	reductionRate := 0.0
	if originalCount > 0 {
		reductionRate = float64(originalCount-aggregatedCount) / float64(originalCount)
	}
	
	return &pb.AlertAggregationResponse{
		AggregatedGroups:    aggregatedGroups,
		OriginalAlertCount:  originalCount,
		AggregatedGroupCount: aggregatedCount,
		ReductionRate:       reductionRate,
		Timestamp:           time.Now().Unix(),
	}, nil
}

// ScheduleAlert agenda um alerta para envio futuro
func (s *AlertWorkerService) ScheduleAlert(
	ctx context.Context,
	req *pb.AlertScheduleRequest,
) (*pb.AlertScheduleResponse, error) {
	alert := req.Alert
	scheduleTime := time.Unix(req.ScheduleTime, 0)
	
	// Validar tempo de agendamento
	if scheduleTime.Before(time.Now()) {
		return &pb.AlertScheduleResponse{
			Success:      false,
			ErrorMessage: "Schedule time must be in the future",
		}, nil
	}
	
	// Validar alerta
	errors := s.validateAlert(alert)
	if len(errors) > 0 {
		return &pb.AlertScheduleResponse{
			Success:      false,
			ErrorMessage: strings.Join(errors, "; "),
		}, nil
	}
	
	scheduleID := s.generateID()
	
	// Calcular tempo até execução
	timeUntilExecution := time.Until(scheduleTime)
	
	// Determinar recorrência se aplicável
	var nextExecution int64
	if req.RecurrencePattern != "" {
		nextExecution = s.calculateNextExecution(scheduleTime, req.RecurrencePattern)
	}
	
	// Status
	status := "SCHEDULED"
	if timeUntilExecution < 5*time.Minute {
		status = "PENDING_EXECUTION"
	}
	
	return &pb.AlertScheduleResponse{
		Success:         true,
		ScheduleId:      scheduleID,
		Status:          status,
		ScheduledFor:    req.ScheduleTime,
		NextExecution:   nextExecution,
		EstimatedDelay:  int32(timeUntilExecution.Seconds()),
	}, nil
}

// ========== Helper Functions ==========

func (s *AlertWorkerService) validateAlert(alert *pb.Alert) []string {
	var errors []string
	
	if alert.Id == "" {
		errors = append(errors, "Alert ID is required")
	}
	if alert.Type == "" {
		errors = append(errors, "Alert type is required")
	}
	if alert.Severity == "" {
		errors = append(errors, "Alert severity is required")
	}
	if alert.Title == "" {
		errors = append(errors, "Alert title is required")
	}
	if alert.Message == "" {
		errors = append(errors, "Alert message is required")
	}
	
	return errors
}

func (s *AlertWorkerService) calculatePriority(alert *pb.Alert) int {
	// Mapa de severidade para score base
	severityScores := map[string]int{
		"INFO":      1,
		"WARNING":   2,
		"CRITICAL":  4,
		"EMERGENCY": 5,
	}
	
	baseScore := severityScores[alert.Severity]
	
	// Ajustar por tipo
	if alert.Type == "CLIMATE" || alert.Type == "HEALTH" {
		baseScore++
	}
	
	// Limitar entre 1 e 5
	if baseScore > 5 {
		baseScore = 5
	}
	if baseScore < 1 {
		baseScore = 1
	}
	
	return baseScore
}

func (s *AlertWorkerService) enrichAlert(alert *pb.Alert) *pb.Alert {
	// Clonar alerta
	enriched := &pb.Alert{
		Id:        alert.Id,
		Type:      alert.Type,
		Severity:  alert.Severity,
		Title:     alert.Title,
		Message:   alert.Message,
		Source:    alert.Source,
		FarmId:    alert.FarmId,
		UserId:    alert.UserId,
		CreatedAt: alert.CreatedAt,
		Metadata:  alert.Metadata,
	}
	
	// Adicionar contexto
	if enriched.Metadata == nil {
		enriched.Metadata = make(map[string]string)
	}
	enriched.Metadata["enriched_at"] = fmt.Sprintf("%d", time.Now().Unix())
	enriched.Metadata["processor"] = "alert-worker-service"
	
	return enriched
}

func (s *AlertWorkerService) determineActions(alert *pb.Alert, priority int) []string {
	var actions []string
	
	if priority >= 4 {
		actions = append(actions, "NOTIFY_IMMEDIATELY")
		actions = append(actions, "LOG_INCIDENT")
	}
	
	if priority >= 3 {
		actions = append(actions, "NOTIFY_USERS")
	}
	
	if alert.Type == "CLIMATE" {
		actions = append(actions, "UPDATE_FORECAST")
	}
	
	if alert.Type == "MARKET" {
		actions = append(actions, "UPDATE_PRICES")
	}
	
	actions = append(actions, "STORE_ALERT")
	
	return actions
}

func (s *AlertWorkerService) identifyRecipients(alert *pb.Alert, prefs map[string]*pb.UserPreference) []string {
	var recipients []string
	
	// Por padrão, notificar owner da fazenda
	if alert.UserId != "" {
		recipients = append(recipients, alert.UserId)
	}
	
	// Para alertas críticos, adicionar mais destinatários
	if alert.Severity == "CRITICAL" || alert.Severity == "EMERGENCY" {
		// Simular notificação de equipe
		recipients = append(recipients, "team@lavra.ai")
	}
	
	return recipients
}

func (s *AlertWorkerService) selectChannels(recipient string, severity string, prefs map[string]*pb.UserPreference) []string {
	// Padrão
	channels := []string{"IN_APP"}
	
	// Baseado em severidade
	if severity == "CRITICAL" || severity == "EMERGENCY" {
		channels = append(channels, "EMAIL", "PUSH")
		
		if severity == "EMERGENCY" {
			channels = append(channels, "SMS")
		}
	} else if severity == "WARNING" {
		channels = append(channels, "EMAIL")
	}
	
	// Verificar preferências do usuário
	if pref, ok := prefs[recipient]; ok {
		if pref.EmailEnabled {
			if !s.contains(channels, "EMAIL") {
				channels = append(channels, "EMAIL")
			}
		}
		if pref.SmsEnabled && (severity == "CRITICAL" || severity == "EMERGENCY") {
			if !s.contains(channels, "SMS") {
				channels = append(channels, "SMS")
			}
		}
	}
	
	return channels
}

func (s *AlertWorkerService) contains(slice []string, item string) bool {
	for _, s := range slice {
		if s == item {
			return true
		}
	}
	return false
}

func (s *AlertWorkerService) formatSubject(alert *pb.Alert) string {
	return fmt.Sprintf("[%s] %s", alert.Severity, alert.Title)
}

func (s *AlertWorkerService) formatBody(alert *pb.Alert, channel string) string {
	if channel == "SMS" {
		// SMS curto
		return fmt.Sprintf("%s: %s", alert.Title, alert.Message[:100])
	}
	
	// Email/Push completo
	return fmt.Sprintf(
		"Tipo: %s\nSeveridade: %s\n\n%s\n\nFazenda: %s\nHorário: %s",
		alert.Type,
		alert.Severity,
		alert.Message,
		alert.FarmId,
		time.Unix(alert.CreatedAt, 0).Format("02/01/2006 15:04"),
	)
}

func (s *AlertWorkerService) generateID() string {
	return fmt.Sprintf("%d-%d", time.Now().UnixNano(), rand.Intn(10000))
}

func (s *AlertWorkerService) calculatePriorityScore(alert *pb.Alert, strategy string) float64 {
	baseScore := 0.0
	
	// Score por severidade
	switch alert.Severity {
	case "EMERGENCY":
		baseScore = 100
	case "CRITICAL":
		baseScore = 80
	case "WARNING":
		baseScore = 50
	case "INFO":
		baseScore = 20
	}
	
	// Ajustar por estratégia
	switch strategy {
	case "SEVERITY_FIRST":
		// Severidade já é o fator principal
	case "TIME_SENSITIVE":
		// Alertas mais recentes ganham pontos
		age := time.Since(time.Unix(alert.CreatedAt, 0)).Minutes()
		if age < 5 {
			baseScore += 20
		} else if age < 30 {
			baseScore += 10
		}
	case "IMPACT_BASED":
		// Alertas de clima e saúde são mais impactantes
		if alert.Type == "CLIMATE" || alert.Type == "HEALTH" {
			baseScore += 15
		}
	}
	
	return baseScore
}

func (s *AlertWorkerService) calculateSLA(priorityScore float64) int32 {
	// SLA em minutos baseado no score
	if priorityScore >= 90 {
		return 5 // 5 minutos
	} else if priorityScore >= 70 {
		return 15
	} else if priorityScore >= 50 {
		return 60
	} else {
		return 240 // 4 horas
	}
}

func (s *AlertWorkerService) explainPriority(alert *pb.Alert, score float64, strategy string) string {
	return fmt.Sprintf(
		"Score %.1f baseado em %s: severidade %s, tipo %s",
		score,
		strategy,
		alert.Severity,
		alert.Type,
	)
}

func (s *AlertWorkerService) groupAlerts(alerts []*pb.Alert, strategy string) map[string][]*pb.Alert {
	groups := make(map[string][]*pb.Alert)
	
	for _, alert := range alerts {
		var key string
		
		switch strategy {
		case "BY_TYPE":
			key = alert.Type
		case "BY_SEVERITY":
			key = alert.Severity
		case "BY_FARM":
			key = alert.FarmId
		case "BY_TYPE_AND_FARM":
			key = fmt.Sprintf("%s_%s", alert.Type, alert.FarmId)
		default:
			key = alert.Type
		}
		
		groups[key] = append(groups[key], alert)
	}
	
	return groups
}

func (s *AlertWorkerService) filterByTimeWindow(alerts []*pb.Alert, windowMinutes int) []*pb.Alert {
	cutoff := time.Now().Add(-time.Duration(windowMinutes) * time.Minute)
	
	var filtered []*pb.Alert
	for _, alert := range alerts {
		if time.Unix(alert.CreatedAt, 0).After(cutoff) {
			filtered = append(filtered, alert)
		}
	}
	
	return filtered
}

func (s *AlertWorkerService) getFirstAlertTime(alerts []*pb.Alert) int64 {
	if len(alerts) == 0 {
		return 0
	}
	
	earliest := alerts[0].CreatedAt
	for _, alert := range alerts {
		if alert.CreatedAt < earliest {
			earliest = alert.CreatedAt
		}
	}
	
	return earliest
}

func (s *AlertWorkerService) getLastAlertTime(alerts []*pb.Alert) int64 {
	if len(alerts) == 0 {
		return 0
	}
	
	latest := alerts[0].CreatedAt
	for _, alert := range alerts {
		if alert.CreatedAt > latest {
			latest = alert.CreatedAt
		}
	}
	
	return latest
}

func (s *AlertWorkerService) createAggregatedTitle(alerts []*pb.Alert) string {
	if len(alerts) == 0 {
		return ""
	}
	
	return fmt.Sprintf("%d alertas de %s", len(alerts), alerts[0].Type)
}

func (s *AlertWorkerService) createAggregatedMessage(alerts []*pb.Alert, strategy string) string {
	if len(alerts) == 0 {
		return ""
	}
	
	return fmt.Sprintf(
		"Agregados %d alertas similares no período (estratégia: %s)",
		len(alerts),
		strategy,
	)
}

func (s *AlertWorkerService) getHighestSeverity(alerts []*pb.Alert) string {
	severityOrder := map[string]int{
		"INFO":      1,
		"WARNING":   2,
		"CRITICAL":  3,
		"EMERGENCY": 4,
	}
	
	highest := "INFO"
	highestValue := 1
	
	for _, alert := range alerts {
		if val, ok := severityOrder[alert.Severity]; ok {
			if val > highestValue {
				highest = alert.Severity
				highestValue = val
			}
		}
	}
	
	return highest
}

func (s *AlertWorkerService) extractAffectedEntities(alerts []*pb.Alert) []string {
	entityMap := make(map[string]bool)
	
	for _, alert := range alerts {
		if alert.FarmId != "" {
			entityMap[alert.FarmId] = true
		}
	}
	
	var entities []string
	for entity := range entityMap {
		entities = append(entities, entity)
	}
	
	return entities
}

func (s *AlertWorkerService) calculateNextExecution(baseTime time.Time, pattern string) int64 {
	// Padrões de recorrência simplificados
	switch pattern {
	case "HOURLY":
		return baseTime.Add(1 * time.Hour).Unix()
	case "DAILY":
		return baseTime.Add(24 * time.Hour).Unix()
	case "WEEKLY":
		return baseTime.Add(7 * 24 * time.Hour).Unix()
	default:
		return 0
	}
}
