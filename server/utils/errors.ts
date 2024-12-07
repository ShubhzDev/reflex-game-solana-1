export class GameError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'GameError';
    }
  }
  
  export class StakeError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'StakeError';
    }
  }
  
  export class SolanaError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'SolanaError';
    }
  }