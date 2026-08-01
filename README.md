# Project Name: Interactive Date Invitation App

## Description
This is a simple, interactive, and romantic single-page web application built to ask my girlfriend out on a date. The app flows through a series of screens (steps) with a fun "anti-gravity" button, choice selections, and a joke payment confirmation that sends her choices directly to my WhatsApp.

## Tech Stack
- Frontend Framework: React (using Vite)
- Styling: Tailwind CSS
- State Management: React `useState` hooks
- Backend: None (Using WhatsApp API redirect for form submission)

## Global Styling & Setup
- The app should have a soft, romantic theme (light pink/pastel backgrounds, cute emojis).
- Ensure the app is mobile-responsive and centered on the screen.
- Hide overflow on the body so the screen doesn't scroll when the "No" button runs away.
- Use smooth fade-in animations when transitioning between steps.

---

## Screen Flow & Logic

### Step 1: The Question
- **UI:** Large text asking "Will you go on a date with me? 🥺"
- **Buttons:** 
  - `Yes` (Pink button, normal click behavior). Clicking goes to Step 2.
  - `No` (Gray button).
- **Special Logic (Anti-gravity):** When the cursor hovers over the `No` button, or when it is clicked/tapped (for mobile), it must immediately move to a random position on the screen. It should be impossible to click. Use absolute positioning and random viewport coordinates.

### Step 2: The Surprise
- **UI:** 
  - Heading: "Wait... You Actually Said Yes?!"
  - Subheading: "I was ready for you to say no 😁"
- **Button:** "Okay Okay! -->". Clicking goes to Step 3.

### Step 3: Set The Date
- **UI:** 
  - Heading: "Set Your date on 15th August 📅" beautifully formatted.
- **Button:** "Set and okay ✨". Clicking goes to Step 4.

### Step 4: Pick The Vibe (Preferences)
- **UI:** 
  - Heading: "What are we feeling? 🤔"
  - Subheading: "Pick your vibe for the day"
- **Selection Categories (Must pick one from each to proceed):**
  1. **Morning Time:**
     - "Bike ride with a view 🏍️"
     - "Coffee & Morning Walk ☕"
     - "Just chill & talk 😌"
  2. **Midday (10 AM+):**
     - "Garden / Park Walk 🌳"
     - "Relax at the Beach 🌊"
     - "Watch a Movie 🍿"
  3. **Evening / Food:**
     - "Authentic Sri Lankan with a Sea view (OGF) 🍛🌊"
     - "Pizza Time 🍕"
     - "Hot Ramen 🍜"
- **Button:** "Lock it in! 🔒" (Disabled until all 3 choices are selected). Clicking goes to Step 5.

### Step 5: Confirmation
- **UI:**
  - Heading: "Glad you didn't say no. 😉"
  - Subheading: "Be ready by 9:00 AM, I'm coming to get you 🏍️"
  - Add a small romantic quote underneath (e.g., *"I can't wait to make new beautiful memories with you."*).
- **Button:** "Ok. I Accept 💝". Clicking goes to Step 6.

### Step 6: The Joke Fee
- **UI:**
  - Heading: "One small fee..."
  - Subtext: "to confirm your acceptance of this date, please complete the following transaction. totally normal. everyone does this."
  - A visually distinct box that says: **"Date Agreement - 5,000 LKR"**
- **Button:** "Pay 5000LKR & Confirm 💸". 
- **Action on Click:** 
  - Change app state to Step 7.
  - Trigger a WhatsApp redirect using `window.open`. Format a message containing the selected options from Step 4. 
  *(Developer note: Keep a placeholder variable `const WA_NUMBER = "YOUR_NUMBER_HERE"` at the top of the file).*
  *Message format:* "Hey! I paid the 5000LKR. Here are my date choices: [Morning Choice], [Midday Choice], [Food Choice]."

### Step 7: Final Screen
- **UI:**
  - Heading: "Your Money Received! 🤑"
  - Subtext: "Just joking... save it for the ice cream!"
  - Final Text: "See you on the 15th! ❤️"
