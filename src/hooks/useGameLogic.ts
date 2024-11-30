import { useState, useEffect, useCallback } from 'react';
import { Position } from '../types';

type Difficulty = 'easy' | 'medium' | 'hard';

const GAME_DURATION = 30;
const DIFFICULTY_SETTINGS = {
  easy: { interval: 1500, points: 1 },
  medium: { interval: 1000, points: 2 },
  hard: { interval: 750, points: 3 },
};

export const useGameLogic = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isGameActive, setIsGameActive] = useState(false);
  const [targetPosition, setTargetPosition] = useState<Position>({ x: 50, y: 50 });
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  const generateNewPosition = useCallback((): Position => {
    const padding = 10; // Keep target away from edges
    return {
      x: Math.random() * (100 - 2 * padding) + padding,
      y: Math.random() * (100 - 2 * padding) + padding,
    };
  }, []);

  const startGame = useCallback(() => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setIsGameActive(true);
    setTargetPosition(generateNewPosition());
  }, [generateNewPosition]);

  const handleTargetClick = useCallback(() => {
    if (!isGameActive) return;
    setScore((prev) => prev + DIFFICULTY_SETTINGS[difficulty].points);
    setTargetPosition(generateNewPosition());
  }, [isGameActive, generateNewPosition, difficulty]);

  useEffect(() => {
    let timer: number;
    if (isGameActive && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsGameActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGameActive, timeLeft]);

  useEffect(() => {
    let moveTimer: number;
    if (isGameActive) {
      moveTimer = window.setInterval(() => {
        setTargetPosition(generateNewPosition());
      }, DIFFICULTY_SETTINGS[difficulty].interval);
    }
    return () => clearInterval(moveTimer);
  }, [isGameActive, difficulty, generateNewPosition]);

  return {
    score,
    timeLeft,
    isGameActive,
    targetPosition,
    difficulty,
    startGame,
    handleTargetClick,
    setDifficulty,
  };
};