import { useCallback, useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { toast } from 'react-hot-toast';
import { GameState, GamePhase } from '../types';
import { GAME_CONFIG, GAME_PHASES } from '../config/constants';
import { SolanaService } from '../services/solanaService';
import { useSocket } from './useSocket';

const initialGameState: GameState = {
  targetPosition: { x: 50, y: 50 },
  players: [],
  isActive: false,
  currentRoundEndTime: Date.now(),
  winners: [],
  prizePool: 0
};

export const useGameState = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const socket = useSocket();
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [solanaService, setSolanaService] = useState<SolanaService | null>(null);
  const [currentPhase, setCurrentPhase] = useState<GamePhase>(GAME_PHASES.STAKING);
  const [phaseTimeLeft, setPhaseTimeLeft] = useState<number>(GAME_CONFIG.PHASES.STAKING);
  const [statusMessage, setStatusMessage] = useState<string>('Staking phase in progress...');

  useEffect(() => {
    if (connection && wallet) {
      setSolanaService(new SolanaService(connection, wallet));
    }
  }, [connection, wallet]);

  useEffect(() => {
    if (socket) {
      socket.on('gameState', (newState: GameState) => {
        setGameState(newState);
      });

      socket.on('phaseChange', ({ phase, timeLeft, message }) => {
        setCurrentPhase(phase);
        setPhaseTimeLeft(timeLeft);
        setStatusMessage(message);
      });
    }
  }, [socket]);

  const isStaked = useCallback((): boolean => {
    if (!wallet.publicKey) return false;
    return gameState.players.some(p => p.wallet === wallet.publicKey?.toBase58());
  }, [wallet.publicKey, gameState.players]);

  const handleTargetClick = useCallback(() => {
    if (!wallet.publicKey || !isStaked() || currentPhase !== GAME_PHASES.GAMEPLAY) return;
    
    socket?.emit('targetClick', {
      wallet: wallet.publicKey.toBase58(),
      timestamp: Date.now()
    });
  }, [wallet.publicKey, isStaked, currentPhase, socket]);

  const connectToGame = useCallback(() => {
    if (!socket?.connected) {
      socket?.connect();
    }
  }, [socket]);

  return {
    gameState,
    isStaked: isStaked(),
    handleTargetClick,
    connectToGame,
    currentPhase,
    phaseTimeLeft,
    statusMessage
  };
};