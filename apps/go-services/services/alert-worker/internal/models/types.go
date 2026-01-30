package models

import "time"

// Alert representa um alerta
type Alert struct {
	ID          string
	Type        AlertType
	Severity    AlertSeverity
	Priority    AlertPriority
	Title       string
	Message     string
	Source      string
	FarmID      string
	UserID      string
	Metadata    map[string]interface{}
	CreatedAt   time.Time
	ExpiresAt   time.Time
	IsProcessed bool
}

// AlertType tipos de alerta
type AlertType string

const (
	AlertClimate      AlertType = "CLIMATE"
	AlertMarket       AlertType = "MARKET"
	AlertOperational  AlertType = "OPERATIONAL"
	AlertFinancial    AlertType = "FINANCIAL"
	AlertHealth       AlertType = "HEALTH"
	AlertCompliance   AlertType = "COMPLIANCE"
)

// AlertSeverity severidade do alerta
type AlertSeverity string

const (
	SeverityInfo     AlertSeverity = "INFO"
	SeverityWarning  AlertSeverity = "WARNING"
	SeverityCritical AlertSeverity = "CRITICAL"
	SeverityEmergency AlertSeverity = "EMERGENCY"
)

// AlertPriority prioridade do alerta
type AlertPriority int

const (
	PriorityLow      AlertPriority = 1
	PriorityMedium   AlertPriority = 2
	PriorityHigh     AlertPriority = 3
	PriorityCritical AlertPriority = 4
	PriorityUrgent   AlertPriority = 5
)

// NotificationChannel canal de notificação
type NotificationChannel string

const (
	ChannelEmail    NotificationChannel = "EMAIL"
	ChannelSMS      NotificationChannel = "SMS"
	ChannelPush     NotificationChannel = "PUSH"
	ChannelInApp    NotificationChannel = "IN_APP"
	ChannelWebhook  NotificationChannel = "WEBHOOK"
)

// NotificationStatus status de notificação
type NotificationStatus string

const (
	StatusPending   NotificationStatus = "PENDING"
	StatusSent      NotificationStatus = "SENT"
	StatusDelivered NotificationStatus = "DELIVERED"
	StatusFailed    NotificationStatus = "FAILED"
	StatusRetrying  NotificationStatus = "RETRYING"
)

// Notification representa uma notificação
type Notification struct {
	ID          string
	AlertID     string
	Channel     NotificationChannel
	Recipient   string
	Subject     string
	Body        string
	Status      NotificationStatus
	SentAt      time.Time
	DeliveredAt time.Time
	RetryCount  int
	MaxRetries  int
}

// AlertRule regra de alerta
type AlertRule struct {
	ID          string
	Type        AlertType
	Condition   string
	Threshold   float64
	IsActive    bool
	CooldownMin int
}

// AggregationWindow janela de agregação
type AggregationWindow struct {
	StartTime time.Time
	EndTime   time.Time
	Duration  time.Duration
}

// AlertGroup grupo de alertas agregados
type AlertGroup struct {
	Key         string
	Type        AlertType
	Count       int
	Alerts      []Alert
	FirstAlert  time.Time
	LastAlert   time.Time
}
