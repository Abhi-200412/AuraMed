# AuraMed - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Quick Start](#quick-start)
4. [AI Service Integration](#ai-service-integration)
5. [User Flows](#user-flows)
6. [Project Structure](#project-structure)

## Project Overview

AuraMed is a comprehensive, futuristic React + TypeScript web application for AI-assisted medical diagnosis, patient management, and doctor control center. Built with modern animations, glassmorphism design, and voice-enabled interfaces.

### Features

#### Patient Portal
- 🤖 **AI Avatar Companion** — Animated breathing avatar with personality
- 📤 **Medical Image Upload** — Drag-and-drop interface with real-time analysis
- 💬 **AI Chat Interface** — Real-time chat with voice input/output and TTS
- 📊 **Health Dashboard** — Interactive charts and health metrics
- 🔊 **Voice Features** — Text-to-speech and voice-to-text powered by Web Speech API

#### Doctor Dashboard
- 📋 **Case Management** — View incoming scans and pending reports
- 🔍 **3D Scan Viewer** — Interactive 3D medical imaging placeholder
- 🤖 **AI Analysis Panel** — Diagnostic insights and probability analysis
- 📄 **Report Builder** — Create, customize, and export reports

#### Global Features
- 🎨 **Theme Toggle** — Beautiful dark/light mode switching
- 🎭 **Glassmorphism Design** — Modern frosted glass UI elements
- ✨ **Particle Background** — Animated canvas with floating particles
- 🎬 **Smooth Animations** — Framer Motion transitions and hover effects
- 🔔 **Toast Notifications** — User feedback system
- ♿ **Accessibility** — Text size adjustment, high contrast mode
- 📱 **Fully Responsive** — Mobile, tablet, and desktop layouts

## Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18.2 + TypeScript 5 |
| **Build** | Next.js 14 |
| **Styling** | Tailwind CSS 3.3 |
| **Animations** | Framer Motion 10.16 |
| **State** | Zustand 4.4 |
| **Data Viz** | Recharts 2.10 |
| **Voice** | Web Speech API (browser native) |
| **File Upload** | react-dropzone |
| **AI Services** | Google Gemini API |

## Quick Start

### Installation
```bash
# Install dependencies
npm install
```

### Running the Application

#### For Development
```bash
# Start the Next.js development server
npm run dev
```

#### For Production
```bash
# Build the application
npm run build

# Start the production server
npm start
```

### Accessing the Application
- Web application (frontend): http://localhost:3000

## AI Service Integration

AuraMed leverages Google's Gemini API for advanced medical image analysis and conversational AI capabilities.

### Features
- **Image Analysis**: Detects anomalies in medical images using Gemini 2.0 Pro Vision.
- **Conversational AI**: Provides interactive medical assistance using Gemini 2.0 Flash.

### Environment Configuration

Make sure your `.env` file includes your Gemini API key:

```
GEMINI_API_KEY=your_api_key_here
```

## User Flows

### Patient Flow
1. **Landing** → Choose between Patient/Doctor
2. **Patient Onboarding** → Enter name, age, contact details, address
3. **Patient Dashboard** → See AI Avatar & action buttons
4. **Upload** → Drag medical image → Instant AI analysis
5. **Chat** → Type or speak to AI → Get voice responses
6. **Health Dashboard** → View health metrics and history

### Doctor Flow
1. **Landing** → Choose Doctor option
2. **Doctor Login** → Enter credentials
3. **Doctor Dashboard** → See stats (incoming scans, pending reports)
4. **View Scan** → Open 3D viewer
5. **Analysis** → Review AI insights & probability scores
6. **Report** → Build and export PDF report

## Project Structure

```
src/
├── app/                      # Next.js 14 App Router structure
│   ├── layout.tsx            # Root layout with providers
│   ├── page.tsx              # Landing page
│   ├── patient/              # Patient portal routes
│   │   ├── page.tsx          # Patient dashboard
│   │   ├── upload/page.tsx   # Medical image upload
│   │   ├── chat/page.tsx     # AI chat interface
│   │   └── dashboard/page.tsx # Health metrics
│   └── doctor/               # Doctor portal routes
│       ├── page.tsx          # Doctor dashboard
│       ├── scan/page.tsx     # 3D scan viewer
│       ├── analysis/page.tsx # AI analysis panel
│       └── reports/page.tsx  # Report builder
├── components/               # Reusable UI components
│   ├── AIAvatar.tsx          # Breathing AI avatar animation
│   ├── Layout.tsx            # Main layout container
│   ├── Sidebar.tsx           # Navigation sidebar
│   ├── Topbar.tsx            # Header with theme & profile
│   ├── ParticleBackground.tsx # Animated canvas background
│   ├── VoiceInput.tsx        # Web Speech API input
│   ├── LoadingDots.tsx       # Loading animation
│   ├── Message.tsx           # Chat message component
│   ├── LottiePlayer.tsx      # Lottie animation wrapper
│   └── ThemeToggle.tsx       # Dark/light mode toggle
├── ai/                       # AI service integrations
│   ├── flows.ts              # AI conversation flows
│   ├── detectionAI.ts        # Gemini-based image analysis
│   └── conversational.ts     # Gemini-based chat interface
├── hooks/                    # Custom React hooks
│   ├── useTTS.ts             # Text-to-speech hook
│   └── useVoice.ts           # Voice input hook
├── utils/                    # Utility functions
│   ├── api.ts                # API client
│   └── helpers.ts            # Helper functions
├── stores/                   # Zustand stores
│   └── useStore.ts           # Global state management
└── types/                    # TypeScript types
    └── index.ts              # Type definitions
```