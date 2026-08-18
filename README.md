# 🎉 Mobile-First Birthday Reel Website for Your Sister

A modern, interactive, Instagram-Reel / TikTok styled birthday celebration website built with pure **HTML5**, **Vanilla CSS**, and **Vanilla JavaScript** (Zero dependencies required!).

---

## 📁 Project Structure

```
├── index.html               # Main HTML markup with Instagram Story & Reel layout
├── style.css                # Instagram dark-mode styles, CSS scroll-snap, glassmorphism & keyframes
├── script.js                # Interaction engine (Scroll observer, Confetti, Web Audio synth, Modals)
├── single-file-version.html # All-in-one combined single file (easy copy-paste & instant run)
└── README.md                # Quickstart & Customization guide
```

---

## 🚀 How to Run in Visual Studio / VS Code

1. **Option 1 (Direct in Browser):**
   - Double-click `index.html` (or `single-file-version.html`) to open it directly in Chrome, Edge, Safari, or Firefox.
2. **Option 2 (VS Code Live Server):**
   - Open this folder in Visual Studio Code.
   - Right-click `index.html` and select **"Open with Live Server"**.
3. **Mobile Testing:**
   - Open Chrome DevTools (`F12` or `Ctrl+Shift+I`), click the **Mobile Device Toggle Icon** (`Ctrl+Shift+M`), and choose any mobile screen (e.g., iPhone 14 Pro, Pixel 7) to experience the full vertical scroll snap!

---

## 🎨 Key Features & User Journey

1. **Entrance Overlay ("Tap to Start Experience")**:
   - Bypasses browser autoplay restrictions.
   - Triggers background music & celebratory sound effects with a sleek blur exit.
2. **Screen 1 (The Hook - "Happy Birthday Queen")**:
   - Glowing animated Instagram Story avatar ring with crown badge.
   - Verified blue badge & heartbeat typography.
   - Bouncing "Swipe Down" indicator.
3. **Screen 2 (The Vibe - "Aesthetic & Unmatched")**:
   - 3D Tilting Polaroid photo card with washi tape effect.
   - Aesthetic quote card with glassmorphism glow.
4. **Screen 3 (The Memories - "Core Memories")**:
   - Scroll-reveal timeline cards with childhood memories.
   - **Interactive Scratch Card**: Tap to reveal a secret sibling confession.
5. **Screen 4 (The Reveal - "Grand Finale & Surprise Gift")**:
   - Heartfelt personal birthday letter.
   - **"Tap for Birthday Surprise" 🎁 Button**: Triggers dual-cannon HTML5 Canvas Confetti explosion and celebratory chimes.
   - Unlocks a VIP Golden Ticket Birthday Voucher modal.
6. **Instagram Action Bar**:
   - ❤️ **Like Button & Double-Tap**: Flying heart particles & counter increment.
   - 💬 **Comment Drawer**: Slide-up Instagram comments drawer with real-time commenting.
   - ↗️ **Share Button**: Native Web Share API + clipboard fallback with toast alerts.
   - 🎵 **Rotating Vinyl Disc**: Sound equalizer toggle (mute/unmute).

---

## ✏️ Customization Cheat Sheet

All customization points are clearly labeled with `CUSTOMIZATION POINT` comments in the code:

| What to Change | File | Search Term in Code |
| :--- | :--- | :--- |
| **Sister's Name & Nicknames** | `index.html` | `CUSTOMIZATION POINT: SISTER'S NAME` |
| **Sister's Photos** | `index.html` | `CUSTOMIZATION POINT: MAIN HERO PHOTO` |
| **Polaroid Photo (Screen 2)** | `index.html` | `CUSTOMIZATION POINT: SCREEN 2 POLAROID PHOTO` |
| **Background Music MP3** | `index.html` | `CUSTOMIZATION POINT: BACKGROUND AUDIO` |
| **Personal Birthday Letter** | `index.html` | `CUSTOMIZATION POINT: YOUR PERSONAL WISH` |
| **Gift Voucher Perks** | `index.html` | `CUSTOMIZATION POINT: GIFT VOUCHER PERKS` |
| **Secret Compliment** | `index.html` | `CUSTOMIZATION POINT: CONFESSION` |

> 💡 **Audio Tip**: If you don't have an MP3 file ready, the website includes a **built-in Web Audio Synthesizer** that automatically plays a festive birthday melody out-of-the-box!
