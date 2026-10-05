import React, { useState } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchMedicine = async (value = query) => {
    const search = value.trim();

    if (!search) {
      setMedicines([]);
      setError("Please enter a medicine name.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${encodeURIComponent(
        search
      )}&limit=20`;

      const response = await fetch(url);

      if (response.status === 404) {
        setMedicines([]);
        setError("No results found.");
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to fetch medicines.");
      }

      const data = await response.json();
      setMedicines(data.results || []);

      if (!data.results?.length) {
        setError("No results found.");
      }
    } catch {
      setMedicines([]);
      setError("Unable to load medicines. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchMedicine();
  };

  const popular = ["Advil", "Ibuprofen", "Aspirin", "Paracetamol"];

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

          <p>Search medicines by brand name or active ingredient.</p>

          <form className="search-box" onSubmit={handleSubmit}>
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

            {popular.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setQuery(item);
                  searchMedicine(item);
                }}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="notice">
            ⓘ This tool uses public FDA data and is not medical advice.
          </div>
        </section>

        {(loading || error || medicines.length > 0) && (
          <section className="results">
            <div className="results-heading">
              <h2>Medicine Directory</h2>
              <p>
                Search the FDA database for drug labels, indications, and
                active ingredients.
              </p>
            </div>

            {loading && (
              <div className="status">
                <div className="loader"></div>
                Searching medicines...
              </div>
            )}

            {!loading && error && (
              <div className="status error-message">{error}</div>
            )}

            {!loading && medicines.length > 0 && (
              <div className="medicine-grid">
                {medicines.map((medicine, index) => {
                  const brand =
                    medicine.openfda?.brand_name?.[0] || "Unknown";

                  const generic =
                    medicine.openfda?.generic_name?.[0] ||
                    "Not available";

                  const manufacturer =
                    medicine.openfda?.manufacturer_name?.[0] ||
                    "Not available";

                  const productType =
                    medicine.openfda?.product_type?.[0] ||
                    "Not available";

                  const route =
                    medicine.openfda?.route?.[0] ||
                    "Not available";

                  return (
                    <article className="medicine-card" key={index}>
                      <div className="card-top">
                        <div className="medicine-icon">💊</div>

                        <div>
                          <h3>{brand}</h3>
                          <p>{generic}</p>
                        </div>
                      </div>

                      <div className="medicine-info">
                        <div>
                          <span>Manufacturer</span>
                          <strong>{manufacturer}</strong>
                        </div>

                        <div>
                          <span>Product Type</span>
                          <strong>{productType}</strong>
                        </div>

                        <div>
                          <span>Route</span>
                          <strong>{route}</strong>
                        </div>
                      </div>

                      <button className="details-button">
                        View full details →
                      </button>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;