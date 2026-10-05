import React from "react";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">
          
          <span>Meddibuddy</span>
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
        </section>
      </main>
    </div>
  );
}

export default App;