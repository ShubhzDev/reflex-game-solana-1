import { useCallback, useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { toast } from 'react-hot-toast';
import { GameState } from '../types';
import { GAME_CONFIG } from '../config/constants';
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
    }
  }, [socket]);

  const isStaked = wallet.publicKey && gameState.players.some(
    p => p.wallet === wallet.publicKey?.toBase58()
  );

  const handleTargetClick = useCallback(() => {
    if (!wallet.publicKey || !isStaked) return;
    
    socket?.emit('targetClick', {
      wallet: wallet.publicKey.toBase58(),
      timestamp: Date.now()
    });
  }, [wallet.publicKey, isStaked, socket]);

  const stakeSOL = useCallback(async (amount: number) => {
    if (!wallet.publicKey || !solanaService) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      const toastId = toast.loading('Staking SOL...');
      await solanaService.stake(amount);
      
      socket?.emit('stake', {
        wallet: wallet.publicKey.toBase58(),
        amount: amount * LAMPORTS_PER_SOL
      });
      
      toast.success('Successfully staked SOL!', { id: toastId });
    } catch (error) {
      console.error('Error staking SOL:', error);
      toast.error('Failed to stake SOL');
    }
  }, [wallet.publicKey, solanaService, socket]);

  const connectToGame = useCallback(() => {
    if (!socket?.connected) {
      socket?.connect();
    }
  }, [socket]);

  return {
    gameState,
    isStaked,
    handleTargetClick,
    stakeSOL,
    connectToGame
  };
};