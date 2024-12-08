import { useCallback, useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-hot-toast';
import { SolanaService } from '../services/solanaService';
import { GAME_CONFIG } from '../config/constants';
import { useSocket } from './useSocket';

export const useSolanaGame = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const socket = useSocket();
  const [solanaService, setSolanaService] = useState<SolanaService | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (connection && wallet) {
      setSolanaService(new SolanaService(connection, wallet));
    }
  }, [connection, wallet]);

  const handleStake = useCallback(async (): Promise<void> => {
    if (!solanaService || !wallet.publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      const toastId = toast.loading('Processing stake transaction...');
      console.log("GAME_CONFIG.STAKE_AMOUNT ",GAME_CONFIG.STAKE_AMOUNT);
      const signature = await solanaService.stake(GAME_CONFIG.STAKE_AMOUNT);
      
      // Notify backend about the stake
      socket?.emit('stake', {
        wallet: wallet.publicKey.toBase58(),
        amount: GAME_CONFIG.STAKE_AMOUNT,
        signature
      });

      toast.success('Successfully staked SOL!', { id: toastId });
    } catch (error) {
      console.error('Error staking:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to stake SOL');
    } finally {
      setIsLoading(false);
    }
  }, [solanaService, wallet.publicKey, socket]);

  return {
    isLoading,
    handleStake
  };
};