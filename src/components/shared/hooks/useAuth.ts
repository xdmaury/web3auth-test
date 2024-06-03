import React, { useEffect } from "react";
import { useWeb3Auth } from "../../features/Web3authProvider";


interface AuthProps {
    address: string | any;
    wallet: string;
    isConnected: boolean;
    token?: string;
}

export default (): AuthProps => {

    const { web3auth, address, loggedIn, provider } = useWeb3Auth();

    const auth: AuthProps = JSON.parse(localStorage.getItem('auth') as string) || {
        address: '',
        wallet: '',
        isConnected: false,
        token: '',
    };

    useEffect(() => {

        if (loggedIn && web3auth?.status === 'connected') {
            web3auth?.getUserInfo().then((value) => console.log(value))
            localStorage.setItem(
                'auth',
                JSON.stringify({
                    address: address,
                    wallet: provider?.adapter,
                    isConnected: loggedIn,
                    token: '',
                })
            );
        }
    }, [loggedIn]);


    return auth;
};