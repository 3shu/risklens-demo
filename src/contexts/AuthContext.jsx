import { createContext, useContext, useState } from 'react'

const USERS = [
  { email: 'admin@mnkseguros.com',  password: 'risklens', apiKey: 'rl_mnk-seguros-oc_7y066-psc6sxtm8jxNP7oYYt', nombre: 'MNK Seguros' },
  { email: 'admin@assaseguros.com', password: 'risklens', apiKey: 'rl_assa-compania_Z3Ou1d8XFPn-_dlF6l-20zty',  nombre: 'ASSA Compañía' },
  { email: 'admin@qualitas.com',    password: 'risklens', apiKey: 'rl_qualitas-compa_u0HpRaiq-0bDPrZ-N5i7twy0', nombre: 'Qualitas Compañía' },
  { email: 'admin@ins.com',         password: 'risklens', apiKey: 'rl_ins-instituto_X-mqxq8uC6HKvvZlEycWgcJu',  nombre: 'INS Instituto' },
  { email: 'admin@risklens-cr.com', password: 'risklens', apiKey: 'test-001',                                    nombre: 'Tenant de Desarrollo' },
]

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('rl_user')) } catch { return null }
  })

  const login = (email, password) => {
    const found = USERS.find(u => u.email === email && u.password === password)
    if (!found) return false
    const { password: _, ...safe } = found
    sessionStorage.setItem('rl_user', JSON.stringify(safe))
    setUser(safe)
    return true
  }

  const logout = () => {
    sessionStorage.removeItem('rl_user')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
