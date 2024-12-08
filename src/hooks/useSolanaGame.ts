import { useCallback, useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-hot-toast';
import { SolanaService } from '../services/solanaService';
import { GAME_CONFIG } from '../config/constants';
import { useSocket } from './useSocket';
import { SolanaTransactionError, SolanaConnectionError, SolanaConfigError } from '../services/errors/SolanaErrors';

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
    const toastId = toast.loading('Processing stake transaction...');

    try {
      const signature = await solanaService.stake(GAME_CONFIG.STAKE_AMOUNT);
      
      socket?.emit('stake', {
        wallet: wallet.publicKey.toBase58(),
        amount: GAME_CONFIG.STAKE_AMOUNT,
        signature
      });

      toast.success('Successfully staked SOL!', { id: toastId });
    } catch (error) {
      console.error('Error staking:', error);
      
      let errorMessage = 'Failed to stake SOL';
      if (error instanceof SolanaTransactionError) {
        errorMessage = error.message;
      } else if (error instanceof SolanaConnectionError) {
        errorMessage = 'Connection error. Please try again.';
      } else if (error instanceof SolanaConfigError) {
        errorMessage = 'Invalid configuration. Please check your wallet.';
      }

      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  }, [solanaService, wallet.publicKey, socket]);

  return {
    isLoading,
    handleStake
  };
};