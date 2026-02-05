# Tic-Tac-Toe (React + Vite + TypeScript)

A simple, web-based **Tic-Tac-Toe** game built with **React**, **TypeScript**, and **Vite**.  
The game supports **two players on the same device**, provides **keyboard-only gameplay**, and can be restarted at any time without refreshing the page.

🔗 **Live Demo:**  
https://alexandralheureuxece.github.io/lab-1-drayner9/

---

## Features

- Interactive **3×3 Tic-Tac-Toe grid**
- Two-player gameplay (X and O)
- Turn-based logic with clear status messages
- Win and draw detection
- **Restart game at any time**
- **Keyboard accessibility (no mouse required)**
- Fully client-side, no backend required
- Deployed using **GitHub Pages**

---

## Keyboard Controls

The game can be played entirely using the keyboard:

| Key | Action |
|----|-------|
| Arrow Keys | Move between cells |
| Enter / Space | Place a mark |
| **R** | Restart the game |
| 1–9 | (Optional) Select a cell directly |
| Enter / Space (on Play Again) | Restart after game over |

When the game ends:
- Focus is locked on the **Play Again** button
- The grid is disabled
- Focus cannot move until the game is restarted

---

## Tech Stack

- **React**
- **TypeScript**
- **Vite**
- **CSS**
- **GitHub Pages** (deployment)

---

## Project Setup

### 1. Clone the repository
```bash
git clone https://github.com/AlexandraLHeureuxECE/lab-1-drayner9.git
cd lab-1-drayner9
