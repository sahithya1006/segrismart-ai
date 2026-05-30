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
   git clone [https://code.swecha.org/your-username/waste-ai.git](https://code.swecha.org/your-username/waste-ai.git)
   cd waste-ai