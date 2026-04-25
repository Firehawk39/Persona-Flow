<div align="center">
  
# 🌊 PersonaFlow
**An Intelligent Hybrid-AI Mental Wellness Platform**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![n8n](https://img.shields.io/badge/n8n-Workflow_Automation-FF6B6B?style=for-the-badge&logo=n8n)](https://n8n.io/)
[![Ollama](https://img.shields.io/badge/Ollama-Local_LLM-black?style=for-the-badge&logo=ollama)](https://ollama.ai/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://persona-flow-three.vercel.app/)

PersonaFlow is a modern, privacy-first mental wellness companion that utilizes orchestrated AI agents to facilitate therapeutic conversations, intelligent journaling, and habit tracking.

</div>

---

## 🌟 Overview

PersonaFlow breaks away from standard "chatbot" architectures by implementing a **Hybrid AI Orchestration Engine** through [n8n](https://n8n.io/). Instead of monolithic LLM calls, the platform routes user intents to specialized agents—providing a more empathetic, context-aware, and secure user experience.

Whether users need a safe space to vent, actionable solutions to a problem, or a reflective journaling partner, PersonaFlow adapts dynamically.

## 🚀 Key Features

* **🧠 Agentic Therapy Sessions:** Context-aware conversations routed through specific personas (Gain Clarity, Vent, Solution-oriented) powered by LangChain and Ollama.
* **📝 Reflective AI Journaling:** Capture daily thoughts with an AI that doesn't just listen, but helps you identify behavioral patterns and emotional trends.
* **🎯 Habit Formation & Tracking:** Build and sustain positive routines with analytical dashboards and tailored AI encouragement.
* **⚡ Blazing Fast Architecture:** Built on Next.js 14 App Router for optimal rendering performance, with background AI warming for zero-latency conversations.

## 🏗️ Architecture

PersonaFlow is built with a modern, decoupled stack prioritizing both developer experience and end-user privacy:

* **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS
* **Orchestration:** n8n (Node-based AI Workflow Automation)
* **AI Models:** Local & Cloud Hybrid via LangChain (Ollama integration for low-latency, privacy-preserving inference)
* **State & Persistence:** Supabase / LocalStorage (configurable for strict privacy requirements)

> **Deep Dive:** For a comprehensive look at the system architecture and the Multi-Agent topology, please review our [Architecture Design Document](./docs/DESIGN.md) and [Agent Specifications](./docs/Agents.md).

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- [n8n](https://n8n.io/) (Local instance or Cloud)
- [Ollama](https://ollama.ai/) (For local inference)

### Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Firehawk39/Persona-Flow.git
   cd Persona-Flow
   ```

2. **Configure Environment:**
   ```bash
   cp .env.example .env.local
   ```
   Add your n8n webhook URLs and (optional) Supabase keys.

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at [http://localhost:3000](http://localhost:3000).

*For full deployment guidelines, please refer to the [Setup Guide](./docs/SETUP.md).*

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Firehawk39/Persona-Flow/issues).

## 📄 License

This project is licensed under the MIT License.
