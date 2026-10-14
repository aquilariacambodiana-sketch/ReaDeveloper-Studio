# Rea Agents Studio

## Project Description
Rea Agents Studio is an advanced autonomous multi-agent orchestration and workflow execution platform built with Next.js and powered by the Google Gemini AI API (`@google/genai`). It allows developers and researchers to design, configure, visualize, and execute collaborative AI agent pipelines—combining lead research analysts, quantitative data evaluators, senior software engineers, technical writers, and quality assurance auditors into seamless workflows.

---

## Installation

Follow these steps to set up Rea Agents Studio locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/example/rea-agents-studio.git
   cd rea-agents-studio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Copy `.env.example` to `.env` and provide your Gemini API key:
   ```bash
   cp .env.example .env
   ```
   Set your `GEMINI_API_KEY` in `.env`.

---

## Usage

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open the application:**
   Navigate to `http://localhost:3000` in your browser.

3. **Build workflows:**
   - Use the **Workflow Studio** to select templates or chain autonomous agents together.
   - Enter your task prompt and execute the pipeline in real time.
   - Inspect step-by-step telemetry, agent reasoning logs, and synthesized outputs.

---

## Linting & Code Quality

This project enforces standard JavaScript/TypeScript style guidelines and rules for common errors using ESLint:

- Run linter:
  ```bash
  npm run lint
  ```

---

## Contribution Guidelines

We welcome contributions to Rea Agents Studio! To contribute:

1. **Fork the repository.**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes:**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to the branch:**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request.**

Please ensure all tests and linters pass (`npm run lint`) before submitting code.
