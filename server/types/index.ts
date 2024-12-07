import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { handlePlayerClick, getGameState } from './services/gameService';
import { createNewRound } from './services/roundService';
import { stakeSOL } from './services/playerService';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  },
});

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

interface TargetClickData {
  wallet: string;
  timestamp: number;
}

interface StakeData {
  wallet: string;
  amount: number;
}

const initializeServer = async () => {
  try {
    await connectDB();
    
    const startGameLoop = async () => {
      try {
        await createNewRound();
        setInterval(async () => {
          try {
            await createNewRound();
            const gameState = await getGameState();
            if (gameState) {
              io.emit('gameState', gameState);
            }
          } catch (error) {
            console.error('Error in game loop:', error);
          }
        }, 3000);
      } catch (error) {
        console.error('Error starting game loop:', error);
      }
    };

    await startGameLoop();

    io.on('connection', async (socket) => {
      try {
        const gameState = await getGameState();
        if (gameState) {
          socket.emit('gameState', gameState);
        }

        socket.on('targetClick', async (data: TargetClickData) => {
          try {
            const updatedPlayer = await handlePlayerClick(data.wallet, data.timestamp);
            if (updatedPlayer) {
              const newGameState = await getGameState();
              if (newGameState) {
                io.emit('gameState', newGameState);
              }
            }
          } catch (error) {
            console.error('Error handling target click:', error);
            socket.emit('error', { message: 'Failed to process click' });
          }
        });

        socket.on('stake', async (data: StakeData) => {
          try {
            const player = await stakeSOL(data.wallet, data.amount);
            if (player) {
              socket.emit('playerStaked', data.wallet);
              const newGameState = await getGameState();
              if (newGameState) {
                io.emit('gameState', newGameState);
              }
            }
          } catch (error) {
            console.error('Error handling stake:', error);
            socket.emit('error', { message: 'Failed to process stake' });
          }
        });
      } catch (error) {
        console.error('Error in socket connection:', error);
      }
    });

    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
};

initializeServer();