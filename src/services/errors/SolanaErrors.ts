import { SendTransactionError } from '@solana/web3.js';

export class SolanaTransactionError extends Error {
  constructor(message: string, public readonly logs?: string[]) {
    super(message);
    this.name = 'SolanaTransactionError';
  }

  static fromSendTransactionError(error: SendTransactionError): SolanaTransactionError {
    const logs = error.logs || [];
    let message = 'Transaction failed';

    if (logs.some(log => log.includes('already in use'))) {
      message = 'Account already exists. Try again.';
    } else if (logs.some(log => log.includes('insufficient funds'))) {
      message = 'Insufficient funds for transaction.';
    }

    return new SolanaTransactionError(message, logs);
  }
}

export class SolanaConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SolanaConnectionError';
  }
}

export class SolanaConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SolanaConfigError';
  }
}