/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
//eslint-disable-next-line no-unused-vars
import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosClient from '../axios-client'
import { useStateContext } from '../contexts/ContextProvider'

export default function Users() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const { setNotification } = useStateContext()

  const getUsers = useCallback(() => {
    setLoading(true)
    axiosClient.get('/users', { params: { page } })
      .then(({ data }) => {
        setLoading(false)
        setUsers(data.data)
        setLastPage(data.meta.last_page)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [page])

  useEffect(() => {
    getUsers();
  }, [getUsers])

  const onDeleteClick = (user) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return
    }
    axiosClient.delete(`/users/${user.id}`)
      .then(() => {
        setNotification('User was successfully deleted')
        // if that was the last user on this page, go back one page
        if (users.length === 1 && page > 1) {
          setPage(page - 1)
        } else {
          getUsers()
        }
      })
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Users</h1>
        <Link className="btn-add" to="/users/new">Add new</Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Create Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center">Loading...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">No users found</td>
              </tr>
            ) : (
              users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.created_at}</td>
                  <td>
                    <Link className="btn-edit" to={'/users/' + u.id}>Edit</Link>
                    &nbsp;
                    <button className="btn-delete" onClick={() => onDeleteClick(u)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {lastPage > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
            <button className="btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
            <span>Page {page} of {lastPage}</span>
            <button className="btn" disabled={page >= lastPage} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        )}
      </div>
    </div>
  )
}
