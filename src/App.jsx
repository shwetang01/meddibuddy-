import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const cache = new Map();

function App() {
  const [query, setQuery] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const controllerRef = useRef(null);

  const getValue = (data, field) => {
    return data?.[field]?.[0] || "Information not available.";
  };

  const searchMedicine = async (value = query) => {
    const search = value.trim();

    if (!search) {
      setMedicines([]);
      setError("Please enter a medicine name.");
      return;
    }

    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    if (cache.has(search.toLowerCase())) {
      setMedicines(cache.get(search.toLowerCase()));
      setError("");
      return;
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError("");
    setSelectedMedicine(null);

    try {
      const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${encodeURIComponent(
        search
      )}&limit=20`;

      const response = await fetch(url, {
        signal: controller.signal
      });

      if (response.status === 404) {
        setMedicines([]);
        setError("No results found.");
        return;
      }

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();
      const results = data.results || [];

      cache.set(search.toLowerCase(), results);
      setMedicines(results);

      if (!results.length) {
        setError("No results found.");
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setMedicines([]);
        setError("Unable to load medicines. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const openDetails = (medicine) => {
    const brand = medicine.openfda?.brand_name?.[0];

    if (!brand) return;

    setSelectedMedicine(medicine);
    window.history.pushState(
      {},
      "",
      `?medicine=${encodeURIComponent(brand)}`
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setSelectedMedicine(null);
    window.history.pushState({}, "", window.location.pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const medicine = params.get("medicine");

    if (!medicine) return;

    const loadMedicine = async () => {
      setLoading(true);

      try {
        const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${encodeURIComponent(
          medicine
        )}&limit=1`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error();
        }

        const data = await response.json();

        if (data.results?.length) {
          setSelectedMedicine(data.results[0]);
        } else {
          setError("Medicine details could not be found.");
        }
      } catch {
        setError("Unable to load medicine details.");
      } finally {
        setLoading(false);
      }
    };

    loadMedicine();
  }, []);

  const popular = ["Advil", "Ibuprofen", "Aspirin", "Paracetamol"];

  if (selectedMedicine) {
    const brand = getValue(selectedMedicine.openfda, "brand_name");
    const generic = getValue(selectedMedicine.openfda, "generic_name");
    const manufacturer = getValue(
      selectedMedicine.openfda,
      "manufacturer_name"
    );

    return (
      <div className="app">
        <header className="navbar">
          <div className="logo">
            <span className="logo-icon"></span>
            <span>Meddibuddy</span>
          </div>

          <nav>
            <a href="#" onClick={goBack}>Medicines</a>
            <a href="#health">Health Information</a>
            <a href="#doctor">Consult a Doctor</a>
          </nav>
        </header>

        <main className="detail-page">
          <button className="back-button" onClick={goBack}>
            ← Back to Search
          </button>

          <div className="disclaimer">
            <strong>Important Disclaimer:</strong> The information on this
            page is sourced directly from the US FDA Label Database.
            Formulations, dosage conventions, active ingredients, and
            regulatory language may differ by country. Always consult a
            healthcare provider before use.
          </div>

          <section className="detail-header">
            <h1>{brand}</h1>
            <p>{generic}</p>
            <span>Manufactured by {manufacturer}</span>
          </section>

          <section className="detail-card warning">
            <h2>⚠ Warnings & Safety Info</h2>
            <p>
              {getValue(selectedMedicine, "warnings")}
            </p>
          </section>

          <section className="detail-section">
            <h2>Active Ingredients</h2>
            <p>
              {getValue(selectedMedicine, "active_ingredient")}
            </p>
          </section>

          <section className="detail-section">
            <h2>Purpose & Indications</h2>
            <p>
              {getValue(selectedMedicine, "purpose")}
            </p>
          </section>

          <section className="detail-section">
            <h2>Dosage and Administration</h2>
            <p>
              {getValue(selectedMedicine, "dosage_and_administration")}
            </p>
          </section>

          <section className="detail-section">
            <h2>Product Information</h2>

            <div className="detail-grid">
              <div>
                <span>Product Type</span>
                <strong>
                  {getValue(selectedMedicine.openfda, "product_type")}
                </strong>
              </div>

              <div>
                <span>Route</span>
                <strong>
                  {getValue(selectedMedicine.openfda, "route")}
                </strong>
              </div>

              <div>
                <span>Manufacturer</span>
                <strong>{manufacturer}</strong>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

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

          <p>Search medicines by brand name or active ingredient.</p>

          <form
            className="search-box"
            onSubmit={(e) => {
              e.preventDefault();
              searchMedicine();
            }}
          >
            <input
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

                  return (
                    <article
                      className="medicine-card"
                      key={index}
                      onClick={() => openDetails(medicine)}
                    >
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
                          <strong>
                            {getValue(
                              medicine.openfda,
                              "product_type"
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>Route</span>
                          <strong>
                            {getValue(medicine.openfda, "route")}
                          </strong>
                        </div>
                      </div>

                      <button
                        className="details-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetails(medicine);
                        }}
                      >
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