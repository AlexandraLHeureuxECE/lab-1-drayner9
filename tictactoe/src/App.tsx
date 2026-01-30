import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

type Player = "X" | "O";
type Cell = Player | null;

const WIN_LINES: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function getWinner(board: Cell[]): { winner: Player; line: number[] } | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    const v = board[a];
    if (v && v === board[b] && v === board[c]) return { winner: v, line };
  }
  return null;
}

function isDraw(board: Cell[]) {
  return board.every((c) => c !== null);
}

export default function App() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [nextPlayer, setNextPlayer] = useState<Player>("X");

  const [focusedIndex, setFocusedIndex] = useState(0);
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const playAgainRef = useRef<HTMLButtonElement | null>(null);

  const result = useMemo(() => getWinner(board), [board]);
  const winner = result?.winner ?? null;
  const winningLine = result?.line ?? null;

  const draw = !winner && isDraw(board);
  const gameOver = Boolean(winner) || draw;

  const statusText = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    if (draw) return "Draw!";
    return `Next turn: ${nextPlayer}`;
  }, [winner, draw, nextPlayer]);

  function placeMark(index: number) {
    if (gameOver) return;
    if (board[index] !== null) return;

    setBoard((prev) => {
      const copy = [...prev];
      copy[index] = nextPlayer;
      return copy;
    });

    setNextPlayer((p) => (p === "X" ? "O" : "X"));
  }

  function restartGame() {
    setBoard(Array(9).fill(null));
    setNextPlayer("X");
    setFocusedIndex(0);
    // focus will be set by effects below
  }

  // Initial focus to first cell (only while game not over)
  useEffect(() => {
    if (!gameOver) cellRefs.current[0]?.focus();
  }, []); // run once

  // Keep DOM focus in sync with focusedIndex (only while game not over)
  useEffect(() => {
    if (!gameOver) cellRefs.current[focusedIndex]?.focus();
  }, [focusedIndex, gameOver]);

  // When game ends, lock focus on Play Again
  useEffect(() => {
    if (gameOver) {
      playAgainRef.current?.focus();
    }
  }, [gameOver]);

  // Global keyboard shortcut: press "R" to restart anytime
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        restartGame();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function moveFocus(deltaRow: number, deltaCol: number) {
    const row = Math.floor(focusedIndex / 3);
    const col = focusedIndex % 3;

    const newRow = (row + deltaRow + 3) % 3;
    const newCol = (col + deltaCol + 3) % 3;

    setFocusedIndex(newRow * 3 + newCol);
  }

  function handleBoardKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    // When game is over, do not allow focus movement/interaction on the board
    if (gameOver) return;

    if (e.key === "ArrowUp") {
      e.preventDefault();
      moveFocus(-1, 0);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveFocus(1, 0);
      return;
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      moveFocus(0, -1);
      return;
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      moveFocus(0, 1);
      return;
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      placeMark(focusedIndex);
      return;
    }

    // Optional: number keys 1–9
    if (/^[1-9]$/.test(e.key)) {
      e.preventDefault();
      const idx = Number(e.key) - 1;
      setFocusedIndex(idx);
      placeMark(idx);
    }
  }

  return (
    <div className="page">
      <div className="game">
        <h1 className="title">Tic-Tac-Toe</h1>

        <div className="statusRow">
          <span className="status">{statusText}</span>

          {/* Only show Restart while game is running. When game is over, only Play Again is focusable. */}
          {!gameOver && (
            <button className="btn" onClick={restartGame}>
              Restart
            </button>
          )}
        </div>

        <div
          className="board"
          role="grid"
          aria-label="Tic tac toe board"
          tabIndex={gameOver ? -1 : 0}
          onKeyDown={handleBoardKeyDown}
        >
          {board.map((cell, i) => {
            const isWinningCell = winningLine?.includes(i) ?? false;

            return (
              <button
                key={i}
                ref={(el) => {
                  cellRefs.current[i] = el;
                }}
                type="button"
                className={`cell ${isWinningCell ? "cell--win" : ""}`}
                onClick={() => {
                  if (gameOver) return;
                  setFocusedIndex(i);
                  placeMark(i);
                }}
                tabIndex={gameOver ? -1 : i === focusedIndex ? 0 : -1}
                disabled={gameOver}
                aria-label={`Cell ${i + 1}${cell ? `, ${cell}` : ""}`}
              >
                {cell ?? ""}
              </button>
            );
          })}
        </div>

        {gameOver && (
          <button
            ref={playAgainRef}
            className="btn btn--primary"
            onClick={restartGame}
            onKeyDown={(e) => {
              // Explicit: Enter/Space restarts (button does this anyway, but this makes it guaranteed)
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                restartGame();
              }
            }}
          >
            Play again
          </button>
        )}

        <p className="hint">
          <strong>Keyboard:</strong> Arrow keys move • Enter/Space places •{" "}
          <strong>R</strong> restarts • (Optional) 1–9 picks a square
        </p>
      </div>
    </div>
  );
}
