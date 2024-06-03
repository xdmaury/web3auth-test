import React, { useEffect, useState } from 'react';
import metamastIcon from "../../images/metamask.svg"
import walletIcon from "../../images/wallet-icon.png"
import solanaIcon from '../../images/solana.svg';
import pathontomIcon from '../../images/phantom.svg';
import { Link } from 'react-router-dom';
import { MdHistory } from 'react-icons/md';
import { BsThreeDots } from 'react-icons/bs';
import useAuth from '../../components/shared/hooks/useAuth';
import { useDetectClickOutside } from 'react-detect-click-outside';
import useLogout from '../../components/shared/hooks/useLogout';

function TopNavigation() {

    const icon = {
        metamask: metamastIcon,
        solana: solanaIcon,
        pathon: pathontomIcon,
        openlogin:walletIcon,
    };


    const auth = useAuth();
    const [toggledInfo, setToggledInfo] = useState<'notification' | 'profile' | null>(null);
    const ref = useDetectClickOutside({
        onTriggered: () => setToggledInfo(null),
    });


    const { handleLogout } = useLogout();

    return (
        <div id="top-navigation">
            <div className="flex justify-between">
               <div>logo app</div>
                <div ref={ref} className="relative flex items-center gap-[15px]">
                    <div className="flex items-center gap-3 rounded-[10px] p-[5px] px-[15px] border border-[#C4C4C4]">
                        <span className="truncate w-[10rem] text-[#1C1C1C]">{auth?.address}</span>
                        <img className="w-5 h-5" src={icon[auth.wallet]} alt="Icon" />
                    </div>
                    <div
                        className="bg-white h-9 w-9 rounded-[10px] relative inline-flex justify-center items-center cursor-pointer hover:bg-[#f3f3f3] transition-all duration-100"
                        style={{ boxShadow: '0px 12px 26px rgba(16, 30, 115, 0.06)' }}
                        onClick={() =>
                            setToggledInfo(
                                toggledInfo === 'notification' ? null : 'notification'
                            )
                        }
                    >
                        <MdHistory size={25} />
                    </div>
                    <div
                        className="bg-white h-9 w-9 rounded-[10px] flex justify-center items-center cursor-pointer hover:bg-[#f3f3f3] transition-all duration-100"
                        style={{ boxShadow: '0px 12px 26px rgba(16, 30, 115, 0.06)' }}
                        onClick={() =>
                            setToggledInfo(toggledInfo === 'profile' ? null : 'profile')
                        }
                    >
                        <BsThreeDots size={25} />
                    </div>
                    {toggledInfo === 'profile' ? (
                        <div
                            className="absolute w-full top-12 bg-white px-5 rounded-[8px] z-50"
                            style={{ boxShadow: '0px 12px 26px rgba(16, 30, 115, 0.06)' }}
                        >
                            <div className="flex flex-col">
                                <Link
                                    to="/profile"
                                    className="pt-3 pb-2"
                                    onClick={() => setToggledInfo(null)}
                                >
                                    Profile
                                </Link>
                                <div
                                    style={{ borderTop: '0.5px solid rgba(41, 50, 74, 0.15)' }}
                                />
                                <button
                                    type="button"
                                    className="pb-3 pt-2 self-start text-[#FD686A] text-lg"
                                    onClick={() => { handleLogout() }}
                                >
                                    Log out
                                </button>
                            </div>
                        </div>
                    ) : null}
                   
                </div>
            </div>
        </div>
    );
}

export default TopNavigation;