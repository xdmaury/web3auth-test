
import React, { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import { ADAPTER_EVENTS, CHAIN_NAMESPACES, CONNECTED_EVENT_DATA, UserInfo, WEB3AUTH_NETWORK } from "@web3auth/base";
import { Web3Auth, Web3AuthOptions } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { LOGIN_MODAL_EVENTS } from "@web3auth/ui";
import Web3 from "web3";

// Providers
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

// Wallet Services
import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";

// Adapters
import { getDefaultExternalAdapters } from "@web3auth/default-evm-adapter";

const clientId = process.env.REACT_APP_WEB3_KEY || "";

const chainConfig = {
    chainId: "0x1", // Please use 0x1 for Mainnet
    rpcTarget: "https://eth.drpc.org",
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    displayName: "Ethereum Mainnet",
    blockExplorerUrl: "https://etherscan.io/",
    ticker: "ETH",
    tickerName: "Ethereum",
    logo: "https://images.toruswallet.io/eth.svg"
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig: chainConfig }
});

const web3AuthOptions: Web3AuthOptions = {
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    privateKeyProvider: privateKeyProvider,
    sessionTime: 86400, // 1 day
    uiConfig: {
        appName: "iPal",
        appUrl: "https://app.ipal.network",
        mode: "auto",
    },
};

const web3auth = new Web3Auth(web3AuthOptions);

const openloginAdapter = new OpenloginAdapter({
    loginSettings: {
        mfaLevel: "optional",
    },
    adapterSettings: {
        uxMode: "popup", // "redirect" | "popup"
        whiteLabel: {
            appName: "iPal",
            appUrl: "https://app.ipal.network",
            mode: "auto",
        },
        mfaSettings: {
            deviceShareFactor: {
                enable: true,
                priority: 1,
                mandatory: true,
            },
            backUpShareFactor: {
                enable: true,
                priority: 2,
                mandatory: true,
            },
            socialBackupFactor: {
                enable: true,
                priority: 3,
                mandatory: false,
            },
            passwordFactor: {
                enable: true,
                priority: 4,
                mandatory: false,
            },
        },
    },
});


web3auth.configureAdapter(openloginAdapter);


// // Wallet Services Plugin
const walletServicesPlugin = new WalletServicesPlugin();
web3auth.addPlugin(walletServicesPlugin);


// Only when you want to add External default adapters, which includes WalletConnect, Metamask, Torus EVM Wallet
const adapters = await getDefaultExternalAdapters({ options: web3AuthOptions });
adapters.forEach((adapter) => {
    web3auth.configureAdapter(adapter);
});


export interface Web3AuthContextProps {
    web3auth: Web3Auth | null,
    provider: CONNECTED_EVENT_DATA | null,
    user: Partial<UserInfo> | null,
    address: string | null,
    loggedIn: boolean,
    onSuccessfulLogin: (data: CONNECTED_EVENT_DATA, user: Partial<UserInfo>, address: string) => void,
    login: () => void,
    logout: () => void,
}

const Web3AuthContext = createContext<Web3AuthContextProps | undefined>(undefined);

export const Web3AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [provider, setProvider] = useState<CONNECTED_EVENT_DATA | null>(null);
    const [user, setUser] = useState<Partial<UserInfo> | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [loggedIn, setLoggedIn] = useState(false);

    const onSuccessfulLogin = useCallback((data: CONNECTED_EVENT_DATA, user: Partial<UserInfo>, address: string) => {
        // console.log('onSuccessfulLogin', data, user, address);
        setProvider(data);
        setUser(user);
        setAddress(address);
    }, []);

    const login = useCallback(() => {
        web3auth.connect().then(() => {
            setLoggedIn(true);
        }).catch(err => {
            console.log(err)
        })
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setProvider(null);
        setAddress(null);
        web3auth.logout().then(() => {
            // login on logout
            setLoggedIn(false);
        }).catch(err => {
            console.log('logout', err)
        })
    }, [])

    const subscribeAuthEvents = useCallback((web3auth: Web3Auth) => {
        web3auth.on(ADAPTER_EVENTS.CONNECTED, (data: CONNECTED_EVENT_DATA) => {
            // console.log("Yeah!, you are successfully logged in", data);

            const web3 = new Web3(web3auth.provider as any);
            web3.eth.getAccounts().then((address) => {

                // GET BALANCE
                // web3.eth.getBalance(address[0]).then((value) => {
                //     const balance = web3.utils.fromWei(value ,"ether");
                //     console.log("balance: ", balance);
                // })

                web3auth.getUserInfo().then((user) => {
                    onSuccessfulLogin(data, user, address[0])
                })
            })
        });

        web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
            console.log("connecting");
        });

        web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
            console.log("disconnected");
            web3auth.clearCache();
            setUser(null);
            setProvider(null);
            setAddress(null);
            localStorage.clear();
        });

        web3auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
            console.log("some error or user have cancelled login request", error);
        });

        web3auth.on(LOGIN_MODAL_EVENTS.MODAL_VISIBILITY, (isVisible) => {
            console.log("modal visibility", isVisible);
        });

    }, [onSuccessfulLogin])

    useEffect(() => {
        subscribeAuthEvents(web3auth);

        web3auth.initModal().catch(err => {
            alert('error' + err)
        })

    }, [])


    useEffect(() => {
        subscribeAuthEvents(web3auth);

        web3auth.initModal().catch(err => {
            alert('error' + err)
        })

    }, [])

    const ctx: Web3AuthContextProps = {
        web3auth,
        provider,
        user,
        address,
        loggedIn,
        onSuccessfulLogin,
        login,
        logout,
    }


    return (
        <Web3AuthContext.Provider value={ctx}>
            {children}
        </Web3AuthContext.Provider>
    )
};

export const useWeb3Auth = (): Web3AuthContextProps => {
    const context = useContext(Web3AuthContext);
    if (!context) {
        throw new Error("useWeb3Auth must be used within a Web3AuthProvider");
    }
    return context;
};