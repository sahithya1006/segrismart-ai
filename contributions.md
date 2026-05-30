# Contributing & Team Roles — SegreSmart-AI

This document outlines how our 3-person team divided the work and combined everything into the final application.

---

## 👥 Team Roles & Work Division

To work efficiently, we split the project into three clear core responsibilities:

### 1. Frontend & UI Layout
* **Developer:** Jaswanth Mucherla
* **Tasks:**
  * Set up the main application architecture using Vite, React, and Tailwind v4.
  * Designed the dark-themed mobile-first layout and UI styling.
  * Implemented the responsive results drawer card that slides up smoothly after a scan.

### 2. Camera Integration
* **Developer:** Gowtham Sai Muppidi
* **Tasks:**
  * Handled browser-level camera permission access codes.
  * Configured the viewport to default directly to the phone's rear camera lens.
  * Wrote the image capture canvas utility that converts raw video frames into data payloads.

### 3. AI API Integration & Prompts
* **Developer:** Sahithya Thallapally
* **Tasks:**
  * Wired the frontend components to the Google Gemini API endpoint.
  * Authored the strict JSON prompt template ensuring flawless data parsing.
  * Localized the classification rules to match the 5 primary waste paths used by the GHMC in Hyderabad.

---

## 🔄 Combining Our Work

1. Each developer built, tested, and polished their assigned component modules locally.
2. We merged our independent contributions together into our local setup.
3. We integrated the codebase with our remote GitLab files using:
```bash
   git pull origin main --allow-unrelated-histories

4. Finally, we pushed the unified, fully functional PoC code to our Swecha GitLab repository!