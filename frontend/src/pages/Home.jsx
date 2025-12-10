// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import ServiceList from './ServiceList';
import './Home.css';

function Home() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [category, setCategory] = useState('');
  const [school, setSchool] = useState('');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <main className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero__inner">
          <div>
            <h1
              style={{
                fontSize: '3.2rem',
                fontWeight: 900,
                margin: '0 0 12px 0',
                lineHeight: 1.1,
              }}
            >
              Find help fast. Earn faster.
            </h1>
            <div
              className="kicker"
              style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                letterSpacing: 1,
                marginBottom: 12,
                textTransform: 'uppercase',
              }}
            >
              Student Services Marketplace
            </div>
            <p
              className="text-muted"
              style={{ fontSize: '1rem', maxWidth: 900, marginBottom: 0 }}
            >
              Book tutoring, moving help, tech support, photography and more —
              from verified students on your campus.
            </p>
            {user && (
              <button
                className="button button--primary"
                onClick={() => navigate('/create-listing')}
                style={{ marginTop: 16, fontSize: '1rem', padding: '8px 20px' }}
              >
                Create a Listing
              </button>
            )}
          </div>

          {/* Search / Filters */}
          <div className="searchBarWrapper">
            <div className="searchBar" role="search">
              <input
                className="input"
                placeholder="Search services..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search services"
              />
              <select
                className="select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Category"
              >
                <option value="">All categories</option>
                <option value="tutoring">Tutoring</option>
                <option value="moving">Moving & Delivery</option>
                <option value="tech">Tech Support</option>
                <option value="photo">Photography & Video</option>
                <option value="events">Event Services</option>
                <option value="design">Graphic Design</option>
                <option value="writing">Writing & Editing</option>
                <option value="music">Music Lessons</option>
                <option value="fitness">Fitness & Training</option>
                <option value="petcare">Pet Care</option>
                <option value="home">Home Services</option>
                <option value="auto">Car Services</option>
                <option value="food">Food & Catering</option>
                <option value="admin">Administrative</option>
                <option value="other">Other</option>
                <option value="selling">Selling</option>
              </select>

              <select
                className="select"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                aria-label="School"
              >
                <option value="">All schools</option>
                <option value="Boston University">Boston University</option>
                <option value="Northeastern University">
                  Northeastern University
                </option>
                <option value="Harvard University">Harvard University</option>
                <option value="MIT">MIT</option>
                <option value="Tufts University">Tufts University</option>
                <option value="Boston College">Boston College</option>
                <option value="Emerson College">Emerson College</option>
                <option value="Suffolk University">Suffolk University</option>
                <option value="UMass Boston">UMass Boston</option>
                <option value="Berklee College of Music">
                  Berklee College of Music
                </option>
                <option value="Simmons University">Simmons University</option>
                <option value="Wentworth Institute of Technology">
                  Wentworth Institute of Technology
                </option>
                <option value="Lesley University">Lesley University</option>
                <option value="MCPHS University">MCPHS University</option>
                <option value="Bentley University">Bentley University</option>
                <option value="Brandeis University">Brandeis University</option>
                <option value="Babson College">Babson College</option>
                <option value="Olin College of Engineering">
                  Olin College of Engineering
                </option>
                <option value="Fisher College">Fisher College</option>
                <option value="Emmanuel College">Emmanuel College</option>
                <option value="Wheelock College">Wheelock College</option>
              </select>
              <input
                className="input"
                type="number"
                min="0"
                inputMode="numeric"
                placeholder="Min $"
                value={min}
                onChange={(e) => setMin(e.target.value)}
                aria-label="Minimum hourly rate"
              />
              <input
                className="input"
                type="number"
                min="0"
                inputMode="numeric"
                placeholder="Max $"
                value={max}
                onChange={(e) => setMax(e.target.value)}
                aria-label="Maximum hourly rate"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Browse Services Section */}
      <section className="section">
        <div className="container">
          <div className="home__sectionHeader" style={{ marginBottom: 32 }}>
            <h2 className="h2">Browse the Most Recent Services</h2>
            <span className="text-muted">
              Find the services that match your needs.
            </span>
          </div>

          <ServiceList
            query={debouncedQuery}
            category={category}
            school={school}
            min={min}
            max={max}
          />
        </div>
      </section>
    </main>
  );
}

Home.propTypes = {};

export default Home;
