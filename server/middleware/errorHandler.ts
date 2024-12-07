import { Request, Response, NextFunction } from 'express';
import { GameError, StakeError, SolanaError } from '../utils/errors';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  if (error instanceof GameError) {
    return res.status(400).json({ error: error.message });
  }

  if (error instanceof StakeError) {
    return res.status(400).json({ error: error.message });
  }

  if (error instanceof SolanaError) {
    return res.status(500).json({ error: 'Solana transaction failed' });
  }

  return res.status(500).json({ error: 'Internal server error' });
};