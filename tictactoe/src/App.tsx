import { useMemo, useState } from "react";
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
    if (v && v === board[b] && v === board[c]) {
      return { winner: v, line };
    }
  }
  return null;
}

function isDraw(board: Cell[]) {
  return board.every((c) => c !== null);
}

export default function App() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [nextPlayer, setNextPlayer] = useState<Player>("X");

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

  function handleCellClick(index: number) {
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
  }
return (
  <div className="page">
    <div className="game">
      <h1 className="title">Tic-Tac-Toe</h1>

      <div className="statusRow">
        <span className="status">{statusText}</span>
        <button className="btn" onClick={restartGame}>
          Restart
        </button>
      </div>

      <div className="board" role="grid" aria-label="Tic tac toe board">
        {board.map((cell, i) => {
          const isWinningCell = winningLine?.includes(i) ?? false;
          return (
            <button
              key={i}
              className={`cell ${isWinningCell ? "cell--win" : ""}`}
              onClick={() => handleCellClick(i)}
            >
              {cell ?? ""}
            </button>
          );
        })}
      </div>

      {gameOver && (
        <button className="btn btn--primary" onClick={restartGame}>
          Play again
        </button>
      )}

      <p className="hint">
        Two players on one device. Click a square to place your mark.
      </p>
    </div>
  </div>
);

}
