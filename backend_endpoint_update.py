from ..models.activity_log_mdl import ActivityLog
from ..services.activity_log_service import ActivityLogService

@router.get("/recent-activity", dependencies=[Depends(require_admin)])
async def recent_activity(db: Session = Depends(get_db)):
    """
    Get recent activity from activity log (admin only)
    """
    activities = ActivityLogService.get_recent_activities(db, limit=10)
    
    return [
        {
            "type": activity.activity_type,
            "title": activity.title,
            "message": activity.message,
            "time": activity.created_at.isoformat() if activity.created_at else None,
            "metadata": activity.metadata
        }
        for activity in activities
    ]

@router.post("/moderators", dependencies=[Depends(require_admin)])
async def create_moderator(user_data: ModeratorCreate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_user)):
    """
    Create a new moderator and assign dolls (admin only)
    """
    # ... existing moderator creation code ...
    
    try:
        db.add(moderator)
        db.commit()
        db.refresh(moderator)

        # Sync assignments (sets `assigned=True`, etc.)
        sync_moderator_dolls(db, moderator.id)

        # Log the activity
        ActivityLogService.log_moderator_creation(
            db=db,
            moderator_id=moderator.id,
            moderator_email=moderator.email,
            created_by_admin_id=current_admin.id
        )

        return {"message": "Moderator created successfully", "moderator_id": moderator.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# When a payment is completed:
ActivityLogService.log_payment(
    db=db,
    user_id=payment.user_id,
    user_email=user.email,
    amount=float(payment.amount),
    payment_type="subscription",  # or "model_purchase"
    payment_id=payment.id
)

# When a new user registers:
ActivityLogService.log_user_registration(
    db=db,
    user_id=user.id,
    user_email=user.email
)

# When a message is flagged:
ActivityLogService.log_message_flagged(
    db=db,
    message_id=message.id,
    user_id=message.user_id,
    user_email=user.email,
    reason=flag_reason
) 