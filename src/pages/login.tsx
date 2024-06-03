import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useWeb3Auth } from '../components/features/Web3authProvider';
import useAuth from '../components/shared/hooks/useAuth';

import { Button } from "flowbite-react";

const Login = () => {

    const { login } = useWeb3Auth();

    const navigate = useNavigate();

    const auth = useAuth();

    useEffect(() => {
        if (auth?.isConnected) {
            navigate('/data', { replace: true });
        }
    }, [auth]);

    return auth?.isConnected ? (
        <Navigate to="/data" replace />
    ) : (
        <div className="flex flex-col h-screen">
            <div className="p-5 px-[30px] bg-white flex justify-between items-center">
                <div>Log app</div>
                <Button color="blue" onClick={login}>Connect</Button>
            </div>
        </div>
    );
};

export default Login;