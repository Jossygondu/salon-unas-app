import { useState, useEffect } from 'react'
import { io } from "socket.io-client"
import './App.css'

const API_URL = 'http://localhost:3001/api/citas'
const socket = io("http://localhost:4000")

function App() {

  const [nombre, setNombre] = useState('')
  const [servicio, setServicio] = useState('')
  const [fecha, setFecha] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [citas, setCitas] = useState([])
  const [verCitas, setVerCitas] = useState(false)
  const [citaEditando, setCitaEditando] = useState(null)

  // 🔥 SOCKET
  useEffect(() => {

    socket.on("connect", () => {
      console.log("Conectado a notificaciones")
    })

    socket.on("notificacion", (data) => {
      console.log("Notificación recibida:", data)
      alert(data.mensaje)
    })

    return () => {
      socket.off("notificacion")
    }

  }, [])

  useEffect(() => {
    cargarCitas()
  }, [])

  const cargarCitas = async () => {
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      setCitas(data)
    } catch (err) {
      console.log('Error al cargar citas')
    }
  }

  const guardarCita = async (e) => {
    e.preventDefault()

    if (!nombre || !servicio || !fecha) {
      setMensaje('⚠️ Completa todos los campos')
      return
    }

    try {

      if (citaEditando) {

        const res = await fetch(`${API_URL}/${citaEditando.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, servicio, fecha })
        })

        const data = await res.json()
        setMensaje(data.mensaje)
        setCitas(citas.map(c => c.id === citaEditando.id ? data.cita : c))

        // ✏️ EVENTO EDITAR
        socket.emit("cita_editada", data.cita)

        setCitaEditando(null)

      } else {

        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, servicio, fecha })
        })

        const data = await res.json()
        setMensaje(data.mensaje)
        setCitas([...citas, data.cita])

        // ➕ EVENTO NUEVA CITA
        socket.emit("nueva_cita", data.cita)
      }

      setNombre('')
      setServicio('')
      setFecha('')

    } catch (err) {
      setMensaje('❌ Error al guardar cita')
    }
  }

  const eliminarCita = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      setCitas(citas.filter(c => c.id !== id))

      // 🗑️ EVENTO ELIMINAR
      socket.emit("cita_eliminada", { id })

    } catch (err) {
      console.log('Error al eliminar cita')
    }
  }

  const editarCita = (cita) => {
    setNombre(cita.nombre)
    setServicio(cita.servicio)
    setFecha(cita.fecha)
    setCitaEditando(cita)
  }

  const cancelarEdicion = () => {
    setNombre('')
    setServicio('')
    setFecha('')
    setCitaEditando(null)
    setMensaje('')
  }

  return (
    <div className="container">
      <h1>💅 Salón de Uñas Josefina</h1>

      <form className="form" onSubmit={guardarCita}>
        <input type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />

        <select value={servicio} onChange={e => setServicio(e.target.value)}>
          <option value="">Selecciona un servicio</option>
          <option value="Gelish">Gelish</option>
          <option value="Acrílicas">Acrílicas</option>
          <option value="Pedicure">Pedicure</option>
        </select>

        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />

        <button type="submit">
          {citaEditando ? 'Actualizar cita' : 'Reservar cita'}
        </button>

        {citaEditando && (
          <button type="button" onClick={cancelarEdicion}>Cancelar</button>
        )}
      </form>

      {mensaje && <p className="mensaje">{mensaje}</p>}

      <button className="btn-libreta" onClick={() => setVerCitas(!verCitas)}>
        📒 {verCitas ? 'Ocultar citas' : 'Ver citas'}
      </button>

      {verCitas && (
        <>
          <h2>📋 Citas registradas</h2>

          <ul className="lista-citas">
            {citas.map(cita => (
              <li key={cita.id}>
                <strong>{cita.nombre}</strong> — {cita.servicio} — {cita.fecha}
                <button onClick={() => eliminarCita(cita.id)}>🗑️ Eliminar</button>
                <button onClick={() => editarCita(cita)}>✏️ Editar</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default App
