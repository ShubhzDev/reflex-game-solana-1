import { useCallback, useState, useEffect, useRef } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-hot-toast';
import { GameState, GamePhase } from '../types';
import { GAME_CONFIG, GAME_PHASES } from '../config/constants';
import { useSocket } from './useSocket';

const initialGameState: GameState = {
  targetPosition: { x: 50, y: 50 },
  players: [],
  isActive: false,
  currentRoundEndTime: Date.now(),
  winners: [],
  prizePool: 0,
  serverTime: Date.now(),
  currentPhase: GAME_PHASES.STAKING,
  phaseEndTime: Date.now()
};

export const useGameState = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const socket = useSocket();
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [currentPhase, setCurrentPhase] = useState<GamePhase>(GAME_PHASES.STAKING);
  const [phaseTimeLeft, setPhaseTimeLeft] = useState<number>(0);
  const [serverTimeOffset, setServerTimeOffset] = useState<number>(0);

  useEffect(() => {
    if (socket) {
      socket.on('gameState', (newState: GameState) => {
        setGameState(newState);
        setCurrentPhase(newState.currentPhase);
        
        // Calculate server time offset
        const clientTime = Date.now();
        const offset = newState.serverTime - clientTime;
        setServerTimeOffset(offset);
      });

      socket.on('error', (error: { message: string }) => {
        toast.error(error.message);
      });

      // Request initial state
      socket.emit('requestGameState');
    }

    return () => {
      if (socket) {
        socket.off('gameState');
        socket.off('error');
      }
    };
  }, [socket]);

  // Update time left based on server time
  useEffect(() => {
    const timer = setInterval(() => {
      const currentServerTime = Date.now() + serverTimeOffset;
      const timeLeft = Math.max(0, Math.ceil((gameState.phaseEndTime - currentServerTime) / 1000));
      setPhaseTimeLeft(timeLeft);

      // Auto-request new state when phase ends
      if (timeLeft === 0) {
        socket?.emit('requestGameState');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.phaseEndTime, serverTimeOffset, socket]);

  const isStaked = useCallback((): boolean => {
    if (!wallet.publicKey) return false;
    return gameState.players.some(p => p.wallet === wallet.publicKey?.toBase58());
  }, [wallet.publicKey, gameState.players]);

  const handleTargetClick = useCallback(() => {
    if (!wallet.publicKey || !isStaked() || currentPhase !== GAME_PHASES.GAMEPLAY) {
      return;
    }
    
    socket?.emit('targetClick', {
      wallet: wallet.publicKey.toBase58(),
      timestamp: Date.now() + serverTimeOffset
    });
  }, [wallet.publicKey, isStaked, currentPhase, serverTimeOffset, socket]);

  const connectToGame = useCallback(() => {
    if (!socket?.connected) {
      socket?.connect();
    }
  }, [socket]);

  const getStatusMessage = useCallback(() => {
    switch (currentPhase) {
      case GAME_PHASES.STAKING:
        return 'Staking phase - Get ready for the next round!';
      case GAME_PHASES.GAMEPLAY:
        return 'Game in progress - Click the targets as fast as you can!';
      case GAME_PHASES.WINNER_DECLARATION:
        return 'Calculating winners...';
      default:
        return '';
    }
  }, [currentPhase]);

  return {
    gameState,
    isStaked: isStaked(),
    handleTargetClick,
    connectToGame,
    currentPhase,
    phaseTimeLeft,
    statusMessage: getStatusMessage()
  };
};