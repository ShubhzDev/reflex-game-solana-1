import { useCallback, useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-hot-toast';
import { SolanaService } from '../services/solanaService';
import { GAME_CONFIG } from '../config/constants';

export const useSolanaGame = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [solanaService, setSolanaService] = useState<SolanaService | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [playerState, setPlayerState] = useState<any>(null);

  useEffect(() => {
    if (connection && wallet) {
      setSolanaService(new SolanaService(connection, wallet));
    }
  }, [connection, wallet]);

  const refreshPlayerState = useCallback(async () => {
    if (!solanaService || !wallet.publicKey) return;

    try {
      const state = await solanaService.getPlayerState();
      setPlayerState(state);
    } catch (error) {
      console.error('Error fetching player state:', error);
    }
  }, [solanaService, wallet.publicKey]);

  useEffect(() => {
    refreshPlayerState();
  }, [refreshPlayerState]);

  const handleStake = useCallback(async (): Promise<void> => {
    if (!solanaService || !wallet.publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      const toastId = toast.loading('Processing stake transaction...');
      await solanaService.stake(GAME_CONFIG.STAKE_AMOUNT);
      
      toast.success('Successfully staked SOL!', { id: toastId });
      await refreshPlayerState();
    } catch (error) {
      console.error('Error staking:', error);
      toast.error('Failed to stake SOL. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [solanaService, wallet.publicKey, refreshPlayerState]);

  const handleClaimRewards = useCallback(async (): Promise<void> => {
    if (!solanaService || !wallet.publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      const toastId = toast.loading('Claiming rewards...');
      await solanaService.claimRewards();
      
      toast.success('Successfully claimed rewards!', { id: toastId });
      await refreshPlayerState();
    } catch (error) {
      console.error('Error claiming rewards:', error);
      toast.error('Failed to claim rewards. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [solanaService, wallet.publicKey, refreshPlayerState]);

  return {
    isLoading,
    playerState,
    handleStake,
    handleClaimRewards,
    refreshPlayerState,
  };
};