/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
//eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axiosClient from '../axios-client'
import { useStateContext } from '../contexts/ContextProvider'

export default function UserForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [user, setUser] = useState({
    id: null,
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  })
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const { setNotification } = useStateContext()

  // when there is an id in the URL we are editing, so load that user
  useEffect(() => {
    if (!id) return
    setLoading(true)
    axiosClient.get(`/users/${id}`)
      .then(({ data }) => {
        setLoading(false)
        setUser(data)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [id])

  const onSubmit = (ev) => {
    ev.preventDefault()
    setErrors(null)

    const isUpdate = Boolean(user.id)
    const request = isUpdate
      ? axiosClient.put(`/users/${user.id}`, user)
      : axiosClient.post('/users', user)

    request
      .then(() => {
        setNotification(isUpdate ? 'User was successfully updated' : 'User was successfully created')
        navigate('/users')
      })
      .catch((err) => {
        const response = err.response
        if (response && response.status === 422) {
          setErrors(response.data.errors)
        }
      })
  }

  return (
    <>
      {user.id && <h1>Update User: {user.name}</h1>}
      {!user.id && <h1>New User</h1>}
      <div className="card animated fadeInDown">
        {loading && (
          <div className="text-center">
            Loading...
          </div>
        )}
        {errors && (
          <div className="alert">
            {Object.keys(errors).map(key => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}
        {!loading && (
          <form onSubmit={onSubmit}>
            <input
              value={user.name}
              onChange={ev => setUser({ ...user, name: ev.target.value })}
              placeholder="Name"
            />
            <input
              type="email"
              value={user.email}
              onChange={ev => setUser({ ...user, email: ev.target.value })}
              placeholder="Email"
            />
            <input
              type="password"
              value={user.password || ''}
              onChange={ev => setUser({ ...user, password: ev.target.value })}
              placeholder={user.id ? 'New password (leave empty to keep the current one)' : 'Password'}
            />
            <input
              type="password"
              value={user.password_confirmation || ''}
              onChange={ev => setUser({ ...user, password_confirmation: ev.target.value })}
              placeholder="Password Confirmation"
            />
            <button className="btn">Save</button>
          </form>
        )}
      </div>
    </>
  )
}
