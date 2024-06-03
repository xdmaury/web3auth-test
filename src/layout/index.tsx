import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import TopNavigation from './top-navigation';
import './layout.css';

import useAuth from '../components/shared/hooks/useAuth';

const Layout = () => {

    const auth = useAuth();

    return auth?.isConnected ? (
        <div id="layout-wrapper">
            <TopNavigation />
            <main>
                <Outlet />
            </main>
        </div>
    ) : (
        <Navigate to="/" replace />
    );
};

export default Layout;