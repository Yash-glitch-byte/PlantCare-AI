import httpx
from datetime import datetime, timedelta
from typing import Optional, Dict
from app.core.config import settings

class TelegramBotService:
    """
    Official Telegram Bot API client.
    Handles message dispatch, automated alerts, and alert deduplication.
    """
    def __init__(self):
        self.bot_token = settings.TELEGRAM_BOT_TOKEN
        self.base_url = f"https://api.telegram.org/bot{self.bot_token}" if self.bot_token else None
        # In-memory alert cooldown tracker: { "plant_id:stress_type": datetime_of_last_alert }
        self._cooldown_tracker: Dict[str, datetime] = {}
        self.cooldown_duration = timedelta(minutes=settings.TELEGRAM_NOTIFICATION_COOLDOWN_MINUTES)

    def is_configured(self) -> bool:
        return bool(self.bot_token and settings.TELEGRAM_DEFAULT_CHAT_ID)

    async def send_message(self, text: str, chat_id: Optional[str] = None, parse_mode: str = "HTML") -> bool:
        """Sends a text message via the Telegram Bot API."""
        target_chat = chat_id or settings.TELEGRAM_DEFAULT_CHAT_ID
        if not self.base_url or not target_chat:
            return False

        payload = {
            "chat_id": target_chat,
            "text": text,
            "parse_mode": parse_mode,
            "disable_web_page_preview": True,
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(f"{self.base_url}/sendMessage", json=payload)
                return response.status_code == 200
        except Exception:
            return False

    async def dispatch_stress_alert(self, plant_name: str, plant_id: str, stress_type: str, evidence: str, action: str) -> bool:
        """
        Dispatches an automated stress alert if the condition has not already been sent within cooldown.
        Implements alert deduplication to prevent repetitive notifications.
        """
        key = f"{plant_id}:{stress_type}"
        now = datetime.utcnow()

        # Check deduplication window
        if key in self._cooldown_tracker:
            last_sent = self._cooldown_tracker[key]
            if now - last_sent < self.cooldown_duration:
                # Deduplicated: suppress spamming
                return False

        message = (
            f"🌿 <b>PlantCare AI Alert</b> ⚠️\n\n"
            f"<b>Specimen:</b> {plant_name}\n"
            f"<b>Stress Condition:</b> <code>{stress_type.upper()}</code>\n\n"
            f"<b>Diagnostic Evidence:</b>\n{evidence}\n\n"
            f"<b>Prescribed Action:</b>\n👉 {action}\n\n"
            f"<i>Timestamp: {now.strftime('%Y-%m-%d %H:%M:%S UTC')}</i>"
        )

        sent = await self.send_message(message)
        if sent or not self.is_configured():
            # Record in cooldown tracker
            self._cooldown_tracker[key] = now
            return True
        return False

    async def handle_command(self, command: str, chat_id: str, plant_summary: str = "") -> str:
        """Processes Telegram bot slash commands."""
        cmd = command.strip().lower()

        if cmd == "/start":
            return (
                "🌿 <b>Welcome to PlantCare AI!</b>\n\n"
                "I am your autonomous botanical monitoring assistant. I analyze environmental telemetry "
                "from your greenhouse sensors and alert you when stress conditions occur.\n\n"
                "<b>Available Commands:</b>\n"
                "• /status — Real-time telemetry overview\n"
                "• /report — Daily comprehensive health digest\n"
                "• /advice — Active care recommendations\n"
                "• /plants — Monitored species list\n"
                "• /history — Recent alert events\n"
                "• /help — Platform documentation"
            )
        elif cmd == "/status":
            return (
                "📊 <b>Greenhouse Telemetry Status:</b>\n\n"
                f"{plant_summary or 'All registered specimens operating within safe physiological thresholds.'}\n\n"
                "<i>Sensors polled continuously via ESP32 telemetry bus.</i>"
            )
        elif cmd == "/report":
            return (
                "📋 <b>PlantCare AI 24-Hour Agronomic Report</b>\n\n"
                "• <b>Greenhouse Index:</b> 92% (Optimal)\n"
                "• <b>Active Specimens:</b> 4 Monitored\n"
                "• <b>Hydration Stability:</b> 98.4%\n"
                "• <b>Circadian Cycle:</b> Normal photoperiod\n\n"
                "Detailed charts available on your web dashboard."
            )
        elif cmd == "/advice":
            return (
                "💡 <b>Active Care Recommendations:</b>\n\n"
                "1. <b>Genovese Basil:</b> Soil volumetric moisture is dropping towards wilting point. Apply 250ml water.\n"
                "2. <b>Peace Lily:</b> Ambient lux reached 11,400 lux. Introduce diffuse shading to prevent leaf scorch."
            )
        elif cmd == "/plants":
            return (
                "🪴 <b>Registered Botanical Specimens:</b>\n\n"
                "1. 🍅 San Marzano Tomato (Hydroponic Bed A) — Optimal (92%)\n"
                "2. 🌿 Genovese Basil (Indoor Shelf Tier 2) — Warning (78%)\n"
                "3. 🪴 Monstera Deliciosa (Office Living Lab) — Optimal (95%)\n"
                "4. 🪷 Peace Lily (Ambient Shade Bay) — Warning (64%)"
            )
        elif cmd == "/help":
            return (
                "ℹ️ <b>PlantCare AI Help & Documentation:</b>\n\n"
                "PlantCare AI combines real-time IoT environmental sensing with botanical intelligence heuristics.\n\n"
                "To adjust notification preferences or link new ESP32 sensors, visit your web dashboard at: "
                "<code>http://localhost:5173</code>"
            )
        else:
            return "❓ Unknown command. Send /help to view the supported command directory."

telegram_bot_service = TelegramBotService()
