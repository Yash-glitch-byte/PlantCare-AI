# Contributing to PlantCare AI 🌿

Thank you for your interest in contributing to **PlantCare AI — Intelligent Plant Monitoring & Care Platform**! Whether you are a student, agricultural enthusiast, IoT hacker, or machine-learning researcher, your contributions are welcome.

---

## 1. Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free experience for everyone. Please be respectful and constructive in all discussions, issues, and pull requests.

---

## 2. Getting Started

### Prerequisites
- **Git** (>= 2.30)
- **Node.js** (>= 18.0) & **npm** (>= 9.0)
- **Python** (>= 3.10, recommended 3.12 or 3.13)
- An optional [Telegram](https://telegram.org) account for bot testing
- An optional [Supabase](https://supabase.com) account for cloud database deployment

### Fork and Clone
```bash
# 1. Fork the repository on GitHub: https://github.com/Yash-glitch-byte/PlantCare-AI
# 2. Clone your fork locally:
git clone https://github.com/YOUR_USERNAME/PlantCare-AI.git
cd PlantCare-AI

# 3. Add the upstream remote to sync future updates:
git remote add upstream https://github.com/Yash-glitch-byte/PlantCare-AI.git
```

---

## 3. Environment Configuration

Copy the example environment configuration:
```bash
cp .env.example .env
```
Open `.env` in your editor and configure the necessary variables (e.g., `DATABASE_URL`, `TELEGRAM_BOT_TOKEN`). 

> **CRITICAL SECURITY RULE:** Never commit `.env` or any sensitive credentials to Git. PlantCare AI enforces pre-commit git checks to reject any private keys or tokens.

---

## 4. Local Development Setup

### Backend (FastAPI + Python)
```bash
cd backend

# Create and activate a Python virtual environment:
python -m venv .venv

# Windows:
.venv\Scripts\activate
# Linux/macOS:
# source .venv/bin/activate

# Install dependencies:
pip install -r requirements.txt

# Run the FastAPI development server with auto-reload:
uvicorn app.main:app --reload --port 8000
```
The interactive Swagger API documentation will be accessible at: `http://localhost:8000/docs`

### Frontend (React + Vite + TypeScript)
```bash
cd frontend

# Install npm dependencies:
npm install

# Start the Vite local development server:
npm run dev
```
The frontend dashboard will be available at: `http://localhost:5173`

---

## 5. Branching Strategy & Git Workflow

We adhere to a standard branch lifecycle:

- `main`: Production-ready, fully tested, stable code.
- `develop`: Staging area for integrating tested features before release.
- `feature/<feature-name>`: Dedicated branch for developing new features.
- `fix/<bug-name>`: Dedicated branch for bug fixes.
- `research/<experiment-name>`: Experimental optical/ML research models and notebooks.

### Creating a Feature Branch
```bash
# Always branch off the latest main or develop
git checkout main
git pull upstream main
git checkout -b feature/smart-irrigation-heuristics
```

---

## 6. Coding Standards & Best Practices

### Python / FastAPI
- Format code following **PEP 8** conventions.
- Use explicit type annotations everywhere (`Pydantic` models for schemas, type hints for function signatures).
- Keep route controllers lightweight by delegating business logic to `app/services/`.
- Handle errors gracefully using standard FastAPI `HTTPException`.

### TypeScript / React
- Write strict TypeScript with explicit interfaces and types (avoid `any`).
- Use Tailwind CSS utility classes aligned with our botanical design palette.
- Keep components modular and reusable inside `src/components/`.
- Ensure desktop and mobile responsiveness for all dashboard views.

---

## 7. Commit Message Conventions

We follow Conventional Commits guidelines to ensure clear, automated changelogs:

- `feat:` Adds a new user-facing feature (e.g., `feat: add live soil moisture gauge to dashboard`)
- `fix:` Fixes a bug (e.g., `fix: resolve telegram alert cooldown race condition`)
- `docs:` Documentation changes only (e.g., `docs: add ESP32 pinout wiring diagram`)
- `refactor:` Code change that neither fixes a bug nor adds a feature
- `test:` Adding or updating test cases
- `chore:` Maintenance, dependency bumps, or build script updates

---

## 8. Submitting a Pull Request

1. Push your branch to your GitHub fork:
   ```bash
   git push origin feature/your-feature-name
   ```
2. Navigate to `https://github.com/Yash-glitch-byte/PlantCare-AI/pulls` and click **New Pull Request**.
3. Fill out the PR template describing:
   - The purpose of the change
   - How the change was tested
   - Screenshots/GIFs if modifying the frontend UI
4. Ensure all CI automated tests pass.
5. Address code review comments constructively.
