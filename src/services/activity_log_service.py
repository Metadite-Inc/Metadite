from sqlalchemy.orm import Session
from ..models.activity_log_mdl import ActivityLog
from typing import Optional, Dict, Any

class ActivityLogService:
    @staticmethod
    def log_activity(
        db: Session,
        activity_type: str,
        title: str,
        message: str,
        user_id: Optional[int] = None,
        related_id: Optional[int] = None,
        metadata: Optional[Dict[str, Any]] = None
    ):
        """Log an activity to the activity log table"""
        activity = ActivityLog(
            activity_type=activity_type,
            title=title,
            message=message,
            user_id=user_id,
            related_id=related_id,
            metadata=metadata or {}
        )
        db.add(activity)
        db.commit()
        return activity

    @staticmethod
    def log_user_registration(db: Session, user_id: int, user_email: str):
        """Log when a new user registers"""
        return ActivityLogService.log_activity(
            db=db,
            activity_type="user_registration",
            title="New User Registration",
            message=f"User {user_email} joined the platform",
            user_id=user_id
        )

    @staticmethod
    def log_payment(db: Session, user_id: int, user_email: str, amount: float, payment_type: str, payment_id: int):
        """Log when a payment is made"""
        return ActivityLogService.log_activity(
            db=db,
            activity_type="payment",
            title=f"New {payment_type.title()} Payment",
            message=f"User {user_email} made a payment of ${amount:.2f}",
            user_id=user_id,
            related_id=payment_id,
            metadata={
                "amount": amount,
                "payment_type": payment_type,
                "payment_id": payment_id
            }
        )

    @staticmethod
    def log_subscription(db: Session, user_id: int, user_email: str, plan: str, amount: float, payment_id: int):
        """Log when a subscription is created"""
        return ActivityLogService.log_activity(
            db=db,
            activity_type="subscription",
            title="New Subscription",
            message=f"User {user_email} subscribed to {plan} plan for ${amount:.2f}",
            user_id=user_id,
            related_id=payment_id,
            metadata={
                "plan": plan,
                "amount": amount,
                "payment_id": payment_id
            }
        )

    @staticmethod
    def log_model_purchase(db: Session, user_id: int, user_email: str, model_name: str, amount: float, order_id: int):
        """Log when a model is purchased"""
        return ActivityLogService.log_activity(
            db=db,
            activity_type="model_purchase",
            title="Model Purchase",
            message=f"User {user_email} purchased {model_name} for ${amount:.2f}",
            user_id=user_id,
            related_id=order_id,
            metadata={
                "model_name": model_name,
                "amount": amount,
                "order_id": order_id
            }
        )

    @staticmethod
    def log_moderator_creation(db: Session, moderator_id: int, moderator_email: str, created_by_admin_id: int):
        """Log when a moderator is created"""
        return ActivityLogService.log_activity(
            db=db,
            activity_type="moderator_created",
            title="New Moderator Added",
            message=f"Moderator {moderator_email} was added to the platform",
            user_id=moderator_id,
            related_id=created_by_admin_id,
            metadata={
                "moderator_email": moderator_email,
                "created_by_admin_id": created_by_admin_id
            }
        )

    @staticmethod
    def log_message_flagged(db: Session, message_id: int, user_id: int, user_email: str, reason: str):
        """Log when a message is flagged"""
        return ActivityLogService.log_activity(
            db=db,
            activity_type="message_flagged",
            title="Message Flagged",
            message=f"Message from {user_email} was flagged for review",
            user_id=user_id,
            related_id=message_id,
            metadata={
                "reason": reason,
                "message_id": message_id
            }
        )

    @staticmethod
    def get_recent_activities(db: Session, limit: int = 10):
        """Get recent activities for admin dashboard"""
        return db.query(ActivityLog).order_by(ActivityLog.created_at.desc()).limit(limit).all() 