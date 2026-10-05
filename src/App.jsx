import React, { useState } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">
          <span className="logo-icon">✦</span>
          <span>NxtWave</span>
        </div>

        <nav>
          <a href="#medicines">Medicines</a>
          <a href="#health">Health Information</a>
          <a href="#doctor">Consult a Doctor</a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <h1>
            Know your <span>medicine</span>,
            <br />
            before you take it.
          </h1>

          <p>
            Search medicines by brand name or active ingredient.
          </p>

          <form className="search-box">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by medicine name or active ingredient"
            />

            <button type="submit">⌕</button>
          </form>

          <div className="popular">
            <span>Popular searches :</span>

            <button onClick={() => setQuery("Advil")}>Advil</button>
            <button onClick={() => setQuery("Ibuprofen")}>Ibuprofen</button>
            <button onClick={() => setQuery("Aspirin")}>Aspirin</button>
            <button onClick={() => setQuery("Paracetamol")}>
              Paracetamol
            </button>
          </div>

          <div className="notice">
            ⓘ This tool uses public FDA data and is not medical advice.
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;