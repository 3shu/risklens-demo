import { createContext, useContext, useState } from 'react'

const USERS = [
  { email: 'admin@mnkseguros.com',  password: 'markwell', apiKey: 'mw_mnk-seguros_n9c2lUdcgjvqKdJhoj-OYHvg', secret_ref: 'mws_live_3bYmB4D65ivP_2OR-XhGu84yEy5bVCMrnwZlIQjuikc', nombre: 'MNK Seguros' },
  { email: 'admin@assaseguros.com', password: 'markwell', apiKey: 'rl_assa-compania_Z3Ou1d8XFPn-_dlF6l-20zty',  secret_ref: 'secret-ref-cli', nombre: 'ASSA Compañía' },
  { email: 'admin@qualitas.com',    password: 'markwell', apiKey: 'rl_qualitas-compa_u0HpRaiq-0bDPrZ-N5i7twy0', secret_ref: 'secret-ref-cli', nombre: 'Qualitas Compañía' },
  { email: 'admin@ins.com',         password: 'markwell', apiKey: 'rl_ins-instituto_X-mqxq8uC6HKvvZlEycWgcJu',  secret_ref: 'secret-ref-cli', nombre: 'INS Instituto' },
  { email: 'admin@markwell.ai', password: 'markwell', apiKey: 'mw_demo_fixed',                                    secret_ref: 'mws_live_XP6Q9uury4rqP1FaNg4ghLv8pfTsuAM1iwMQ-5V4D7Y', nombre: 'Tenant de Desarrollo' },
]

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('mw_user')) } catch { return null }
  })

  const login = (email, password) => {
    const found = USERS.find(u => u.email === email && u.password === password)
    if (!found) return false
    const { password: _, ...safe } = found
    sessionStorage.setItem('mw_user', JSON.stringify(safe))
    setUser(safe)
    return true
  }

  const logout = () => {
    sessionStorage.removeItem('mw_user')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
