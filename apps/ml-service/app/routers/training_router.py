from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from datetime import datetime
import logging
import uuid

from app.schemas.schemas import (
    TrainingRequest,
    TrainingResponse,
    TrainingStatus,
)
from app.models.model_loader import ModelLoader

logger = logging.getLogger(__name__)

router = APIRouter()

# In-memory storage for training jobs (use Redis/DB in production)
training_jobs = {}

def get_model_loader():
    from main import model_loader
    return model_loader

async def train_model_background(
    job_id: str,
    request: TrainingRequest,
    model_loader: ModelLoader
):
    """Background task to train model"""
    try:
        training_jobs[job_id]['status'] = 'TRAINING'
        training_jobs[job_id]['started_at'] = datetime.now()
        
        logger.info(f"🎓 Starting training job {job_id} for {request.model_type}")
        
        # This is a placeholder - actual training would load data and train
        # For now, just simulate training
        import time
        import numpy as np
        
        # Simulate training progress
        total_epochs = request.hyperparameters.get('epochs', 100) if request.hyperparameters else 100
        
        for epoch in range(total_epochs):
            # Simulate epoch
            time.sleep(0.1)  # Simulated training time
            
            # Update progress
            training_jobs[job_id]['current_epoch'] = epoch + 1
            training_jobs[job_id]['total_epochs'] = total_epochs
            training_jobs[job_id]['progress'] = (epoch + 1) / total_epochs
            training_jobs[job_id]['metrics'] = {
                'loss': 0.5 * np.exp(-epoch / 20),  # Simulated decreasing loss
                'val_loss': 0.6 * np.exp(-epoch / 20),
            }
        
        # Mark as completed
        training_jobs[job_id]['status'] = 'COMPLETED'
        training_jobs[job_id]['completed_at'] = datetime.now()
        training_jobs[job_id]['metrics'] = {
            'final_loss': 0.05,
            'final_val_loss': 0.07,
            'mae': 0.03,
        }
        
        logger.info(f"✅ Training job {job_id} completed successfully")
        
    except Exception as e:
        logger.error(f"❌ Training job {job_id} failed: {e}")
        training_jobs[job_id]['status'] = 'FAILED'
        training_jobs[job_id]['error_message'] = str(e)
        training_jobs[job_id]['completed_at'] = datetime.now()

@router.post("/train", response_model=TrainingResponse)
async def train_model(
    request: TrainingRequest,
    background_tasks: BackgroundTasks,
    model_loader: ModelLoader = Depends(get_model_loader)
):
    """
    Start training/retraining a model.
    
    Training runs in the background. Use GET /training/{job_id} to check status.
    """
    try:
        # Validate model type
        if request.model_type not in ['YIELD', 'PRICE', 'ANOMALY']:
            raise HTTPException(
                status_code=400,
                detail="Invalid model_type. Must be YIELD, PRICE, or ANOMALY"
            )
        
        # Create job
        job_id = str(uuid.uuid4())
        
        training_jobs[job_id] = {
            'job_id': job_id,
            'model_type': request.model_type,
            'status': 'PENDING',
            'progress': 0.0,
            'current_epoch': None,
            'total_epochs': None,
            'metrics': None,
            'started_at': None,
            'completed_at': None,
            'error_message': None,
        }
        
        # Start background training
        background_tasks.add_task(
            train_model_background,
            job_id,
            request,
            model_loader
        )
        
        logger.info(f"📋 Created training job {job_id} for {request.model_type}")
        
        return TrainingResponse(
            job_id=job_id,
            model_type=request.model_type,
            status='PENDING',
            message=f"Training job created. Use GET /training/{job_id} to check status.",
            estimated_duration=600  # 10 minutes estimate
        )
        
    except Exception as e:
        logger.error(f"❌ Failed to create training job: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{job_id}", response_model=TrainingStatus)
async def get_training_status(job_id: str):
    """
    Get status of a training job.
    """
    if job_id not in training_jobs:
        raise HTTPException(status_code=404, detail="Training job not found")
    
    job = training_jobs[job_id]
    
    return TrainingStatus(
        job_id=job['job_id'],
        model_type=job['model_type'],
        status=job['status'],
        progress=job['progress'],
        current_epoch=job['current_epoch'],
        total_epochs=job['total_epochs'],
        metrics=job['metrics'],
        started_at=job['started_at'],
        completed_at=job['completed_at'],
        error_message=job['error_message'],
    )

@router.get("/")
async def list_training_jobs():
    """List all training jobs"""
    return {
        "total_jobs": len(training_jobs),
        "jobs": [
            {
                "job_id": job['job_id'],
                "model_type": job['model_type'],
                "status": job['status'],
                "progress": job['progress'],
            }
            for job in training_jobs.values()
        ]
    }
