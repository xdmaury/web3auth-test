import React from "react";
import { Route, Routes } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import Login from "../pages/login";
import MyData from "../pages/data";
import Layout from "../layout";


function Base() {

    return (
        <>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route element={<Layout />}>
                    <Route path="/data" element={<MyData />} />
                </Route>
            </Routes>
        </>
    );
};

export default Base;
