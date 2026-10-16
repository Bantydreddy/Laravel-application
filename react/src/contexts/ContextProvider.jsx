/* eslint-disable no-undef */
/* eslint-disable react-refresh/only-export-components */
/*eslint-disable no-unused-vars*/

import { createContext, useContext, useState } from 'react';

const StateContext = createContext({
    user: null,
    token: null,
    notification: null,
    setUser: () => {},
    setToken: () => {},
    setNotification: () => {},
});

export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    // read the saved token on startup so a page refresh does not log you out
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
    const [notification, _setNotification] = useState('');

    const setToken = (token) => {
        _setToken(token);
        if (token) {
            localStorage.setItem('ACCESS_TOKEN', token);
        } else {
            localStorage.removeItem('ACCESS_TOKEN');
        }
    };

    // show a message for 5 seconds, then hide it again
    const setNotification = (message) => {
        _setNotification(message);

        setTimeout(() => {
            _setNotification('');
        }, 5000);
    };

    return (
        <StateContext.Provider
            value={{
                user,
                token,
                notification,
                setUser,
                setToken,
                setNotification,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
