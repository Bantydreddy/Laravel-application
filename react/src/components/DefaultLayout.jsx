/*eslint-disable no-unused-vars*/
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { Link, Navigate, Outlet } from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider'
import axiosClient from '../axios-client'

export default function DefaultLayout() {
    const { user, token, notification, setUser, setToken } = useStateContext()

    // hooks must run before any early return
    useEffect(() => {
        if (token) {
            axiosClient.get('/user').then(({ data }) => setUser(data))
        }
    }, [token])

    if (!token) {
        return <Navigate to="/login" />
    }

    const onLogout = (ev) => {
        ev.preventDefault()
        axiosClient.post('/logout').then(() => {
            setUser({})
            setToken(null)
        })
    }

    return (
        <div id="defaultLayout">
            <aside>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/users">Users</Link>
            </aside>
            <div className="content">
                <header>
                    <div>
                        Header
                    </div>
                    <div>
                        {user.name} &nbsp; &nbsp;
                        <a href="#" onClick={onLogout} className="btn-logout">Logout</a>
                    </div>
                </header>
                <main>
                    <Outlet />
                </main>
                {notification &&
                    <div className="notification">
                        {notification}
                    </div>
                }
            </div>

        </div>
    )
}
