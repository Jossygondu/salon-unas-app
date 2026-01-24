import './App.css'

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>Salón de Uñas Glam</h1>
        <p>Gelish & Acrílicas</p>
      </header>

      <main className="main">
        <section className="section">
          <h2>Servicios</h2>
          <ul>
            <li>💅 Uñas acrílicas</li>
            <li>✨ Gelish</li>
            <li>🎨 Diseños personalizados</li>
          </ul>
        </section>

        <section className="section">
          <h2>Agenda tu cita</h2>
          <button>Reservar ahora</button>
        </section>
      </main>
    </div>
  )
}

export default App
