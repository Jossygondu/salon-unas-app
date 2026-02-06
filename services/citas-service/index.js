const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

let citas = []
let siguienteId = 1 // para IDs únicos

// 🏠 Ruta principal
app.get('/', (req, res) => {
  res.send('Backend del salón de uñas funcionando 💅')
})

// 📋 OBTENER CITAS
app.get('/api/citas', (req, res) => {
  res.json(citas)
})

// ➕ CREAR CITA
app.post('/api/citas', (req, res) => {
  const { nombre, servicio, fecha } = req.body
  if (!nombre || !servicio || !fecha) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' })
  }

  const nuevaCita = { id: siguienteId++, nombre, servicio, fecha }
  citas.push(nuevaCita)

  res.json({ mensaje: 'Cita registrada correctamente 💅', cita: nuevaCita })
})

// 🗑️ ELIMINAR CITA
app.delete('/api/citas/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const index = citas.findIndex(c => c.id === id)
  if (index === -1) return res.status(404).json({ mensaje: 'Cita no encontrada' })

  citas.splice(index, 1)
  res.json({ mensaje: 'Cita eliminada correctamente 🗑️' })
})

// ✏️ EDITAR CITA
app.put('/api/citas/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const { nombre, servicio, fecha } = req.body

  const index = citas.findIndex(c => c.id === id)
  if (index === -1) return res.status(404).json({ mensaje: 'Cita no encontrada' })
  if (!nombre || !servicio || !fecha) return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' })

  citas[index] = { id, nombre, servicio, fecha }
  res.json({ mensaje: 'Cita actualizada correctamente ✏️', cita: citas[index] })
})

const PORT = 3001
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`))
