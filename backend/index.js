const express = require('express')
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Backend del salón de uñas funcionando 💅')
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
