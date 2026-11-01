from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.telegram import TelegramWebhookUpdate, TelegramBroadcastRequest
from app.services.telegram_bot import telegram_bot_service

router = APIRouter()

@router.post("/webhook", summary="Telegram Bot Webhook Receiver")
async def telegram_webhook(update: TelegramWebhookUpdate, background_tasks: BackgroundTasks):
    """
    Receives incoming updates from the Telegram Bot API.
    Processes commands like /status, /advice, /start asynchronously.
    """
    if not update.message:
        return {"status": "ignored"}

    text = update.message.get("text", "")
    chat = update.message.get("chat", {})
    chat_id = str(chat.get("id", ""))

    if text.startswith("/"):
        response_text = await telegram_bot_service.handle_command(command=text, chat_id=chat_id)
        background_tasks.add_task(telegram_bot_service.send_message, text=response_text, chat_id=chat_id)

    return {"status": "ok"}

@router.post("/test-alert", summary="Trigger manual Telegram test dispatch")
async def send_test_alert(req: TelegramBroadcastRequest):
    """Dispatches a test diagnostic alert to the configured Telegram chat."""
    success = await telegram_bot_service.send_message(
        text=f"🌿 <b>PlantCare AI Test Alert</b>\n\n{req.message}"
    )
    return {
        "dispatched": success,
        "configured": telegram_bot_service.is_configured(),
        "message": req.message
    }
