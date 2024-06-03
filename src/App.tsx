import React from 'react';
import { useWeb3Auth } from './components/features/Web3authProvider';
import useAuth from './components/shared/hooks/useAuth';
import { Button } from "flowbite-react";

function App() {

  const { login, logout } = useWeb3Auth();
  const { isConnected, address } = useAuth();

  return (
    <div className="container w-full h-full bg-gray-50">
     
    {isConnected ? (
        <Button onClick={logout}>Logout - {address}</Button>
      ) : (
        <Button onClick={login} color="gray">Connect</Button>
      )
      }
    </div>
  );
}

export default App;
