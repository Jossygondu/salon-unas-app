import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://localhost:3001/api/citas'

function App() {
  const [nombre, setNombre] = useState('')
  const [servicio, setServicio] = useState('')
  const [fecha, setFecha] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [citas, setCitas] = useState([])
  const [error, setError] = useState(false)
  const [verCitas, setVerCitas] = useState(false)

  const cargarCitas = async () => {
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      setCitas(data)
      setError(false)
    } catch (err) {
      setError(true)
    }
  }

  useEffect(() => {
    cargarCitas()
  }, [])

  const reservarCita = async (e) => {
    e.preventDefault()

    if (!nombre || !servicio || !fecha) {
      setMensaje('⚠️ Completa todos los campos')
      return
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, servicio, fecha })
      })

      const data = await response.json()
      setMensaje(data.mensaje)

      setNombre('')
      setServicio('')
      setFecha('')

      cargarCitas()
    } catch (err) {
      setMensaje('❌ Error al reservar cita')
    }
  }

  return (
    <div className="container">
      <h1>💅 Salón de Uñas Josefina</h1>

      <form className="form" onSubmit={reservarCita}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <select
          value={servicio}
          onChange={(e) => setServicio(e.target.value)}
        >
          <option value="">Selecciona un servicio</option>
          <option value="Gelish">Gelish</option>
          <option value="Acrílicas">Acrílicas</option>
          <option value="Pedicure">Pedicure</option>
        </select>

        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />

        <button>Reservar cita</button>
      </form>

      {mensaje && <p className="mensaje">{mensaje}</p>}
      {error && <p className="mensaje error">❌ Error al cargar citas</p>}

      {/* BOTÓN LIBRETA */}
      <button
        className="btn-libreta"
        onClick={() => setVerCitas(!verCitas)}
      >
        📒 {verCitas ? 'Ocultar citas' : 'Ver citas'}
      </button>

      {/* LISTA DE CITAS */}
      {verCitas && (
        <>
          <h2>📋 Citas registradas</h2>

          <ul className="lista-citas">
            {citas.map((cita) => (
              <li key={cita.id}>
                <strong>{cita.nombre}</strong> — {cita.servicio} — {cita.fecha}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default App
