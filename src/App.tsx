import React from 'react';
import { WalletContextProvider } from './components/WalletContextProvider';
import Game from './components/Game';

function App() {
  return (
    <WalletContextProvider>
      <Game />
    </WalletContextProvider>
  );
}

export default App;