import { useEffect } from 'react';
import useAuth from './useAuth';
import { useWeb3Auth } from '../../features/Web3authProvider';
import { useNavigate } from 'react-router-dom';

export default () => {

    const auth = useAuth();
    const navigate = useNavigate();
    const { loggedIn, logout } = useWeb3Auth();


    const handleLogout = () => {
        if (loggedIn) {
            logout();
        }
        localStorage.clear();
        navigate('/', { replace: true });
    };

    useEffect(() => {
        if (!auth.isConnected) {
            if (loggedIn) {
                logout();
            }
            localStorage.clear();
            navigate('/', { replace: true });
        }
    }, [auth.isConnected]);

    return { handleLogout };
};