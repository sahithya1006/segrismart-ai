# WasteAI — Smart Waste Segregation Scanner

WasteAI is a mobile-first, serverless React application designed to assist residents of Hyderabad, India, in real-time waste classification and compliance with Greater Hyderabad Municipal Corporation (GHMC) segregation guidelines. By utilizing a device's rear camera and the Google Gemini 2.5 Flash API, WasteAI instantly scans household waste and categorizes it with actionable disposal advice.

## 🚀 Core Features
* **Zero-Install Mobile Web App:** Responsive, dark-themed UI configured specifically to match a native mobile app look and feel.
* **Live Video Viewfinder:** Seamlessly utilizes browser-level hardware access (`getUserMedia`) targeting optimal back-camera streams.
* **Real-time AI Segregation:** Captures image coordinates, parses binary image matrices to base64 formatting, and requests visual processing models directly.
* **Localized Guidance:** Dynamically returns strict structural JSON detailing the five GHMC core designations: *Wet, Dry, Hazardous, E-Waste, or Recyclable*.

## 🛠️ Tech Stack
* **Frontend Library:** React (Hooks context architecture)
* **Build System:** Vite (Next-generation bundle toolchain)
* **Styling Infrastructure:** Tailwind CSS v4
* **Vector Icons:** Lucide React
* **AI Processing Model:** Google Gemini 2.5 Flash API (Structured JSON output engine)

## 🔧 Installation & Local Setup

### Prerequisites
* Node.js (v18.0.0 or higher)
* npm (v9.0.0 or higher)

### Step-by-Step Installation
1. Clone the project repository:
   ```bash
   git clone [https://code.swecha.org/JaswanthMucherla/segresmart-ai.git](https://code.swecha.org/JaswanthMucherla/segresmart-ai.git)
   cd waste-ai

   Install all core workspace dependencies:

2. Install all core workspace dependencies:
npm install

3. Set up your local environment environment configurations. Create a .env file in the root of the project:
Code snippet
VITE_GEMINI_API_KEY=AIzaSyYourActualKeyGoesHere

4. Fire up the local Vite engine securely:
npm run dev -- --host

5. Access the secure application using your network IP address over standard SSL channels (https://192.168.x.x:5173) to unlock device-level camera streaming permissions.

## 🌐 Production Deployment
This repository is pre-optimized for rapid zero-config edge hosting deployments via Vercel or Netlify. Remember to map the VITE_GEMINI_API_KEY system environment variables inside your hosting provider dashboard before triggering production builds.