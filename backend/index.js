const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

let citas = []

app.get('/', (req, res) => {
  res.send('Backend del salón de uñas funcionando 💅')
})

app.get('/api/citas', (req, res) => {
  res.json(citas)
})

app.post('/api/citas', (req, res) => {
  const { nombre, servicio, fecha } = req.body

  if (!nombre || !servicio || !fecha) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' })
  }

  const nuevaCita = {
    id: citas.length + 1,
    nombre,
    servicio,
    fecha
  }

  citas.push(nuevaCita)

  res.json({
    mensaje: 'Cita registrada correctamente 💅',
    cita: nuevaCita
  })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
