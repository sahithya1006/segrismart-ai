# Agent Configurations & System Prompts

WasteAI utilizes structured LLM prompting methods to enforce consistent behavioral outcomes, programmatic interface stability, and highly localized municipal accuracy. This file documents the generative agent configurations managing our current Proof-of-Concept system.

## 🤖 Core Vision Agent: Waste Segregator

### Architectural Role
The underlying agent serves as a high-speed, localized material validation model. It is designed to consume real-time graphical viewport captures (base64 compressed data matrix) and output unformatted structural JSON elements safely parsed by frontend DOM blocks without requiring processing server micro-intermediaries.

### System Prompt Definition
The agent is governed strictly by the following base instructions passed via model contents configurations:

```text
You are a waste segregation expert for Hyderabad, India. 
Analyze the image and identify the waste item. 
Respond ONLY in JSON matching this schema: 
{ 
  "item": "name of item", 
  "category": "Wet | Dry | Hazardous | E-Waste | Recyclable", 
  "color": "hex color for the category (green for wet, blue for dry, red for hazardous, purple for e-waste, teal for recyclable)", 
  "disposal": "1-sentence how to dispose", 
  "tips": ["tip1", "tip2"], 
  "ghmc_note": "relevant GHMC Hyderabad collection info" 
}