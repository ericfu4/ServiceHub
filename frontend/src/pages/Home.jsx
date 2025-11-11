// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import ServiceList from './ServiceList';
import ServiceForm from './ServiceForm';
import './Home.css';

export default function Home() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [category, setCategory] = useState('');
  const [school, setSchool] = useState('');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [refreshId, setRefreshId] = useState(0); // 👈 add this

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <main className="home">
      {/* Hero */}
      <section className="hero">
        <div className="container hero__inner">
          <div>
            <div className="kicker">Student Services Marketplace</div>
            <h1 className="h1" style={{ marginTop: 6, marginBottom: 4 }}>
              Find help fast. Earn faster.
            </h1>
            <p className="text-muted" style={{ maxWidth: 720 }}>
              Book tutoring, moving help, tech support, photography and more —
              from verified students on your campus.
            </p>
          </div>

          {/* Search / Filters */}
          <div className="searchBar" role="search">
            <input
              className="input"
              placeholder="Search services, e.g. “calculus tutoring”, “iPhone screen”"
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
            </select>

            <select
              className="select"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              aria-label="School"
            >
              <option value="">All schools</option>
              <option value="Northeastern University">Northeastern</option>
              <option value="Boston University">Boston University</option>
              <option value="MIT">MIT</option>
              <option value="Harvard">Harvard</option>
              <option value="Boston College">Boston College</option>
              <option value="Tufts">Tufts</option>
              <option value="UMass Boston">UMass Boston</option>
              <option value="Berklee">Berklee</option>
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
      </section>

      {/* Main grid */}
      <section className="section">
        <div className="container home__grid">
          <div className="home__left">
            <div className="home__sectionHeader">
              <h2 className="h2">Explore</h2>
              <span className="text-muted">
                Browse listings that match your filters.
              </span>
            </div>

            <ServiceList
              query={debouncedQuery}
              category={category}
              school={school}
              min={min}
              max={max}
              refreshId={refreshId}
            />
          </div>

          <aside className="home__right">
            <div className="home__sectionHeader">
              <h2 className="h2">Create a listing</h2>
              <span className="text-muted">
                Offer your skills and start earning.
              </span>
            </div>

            <div className="card" style={{ padding: 16 }}>
              <ServiceForm onCreated={() => setRefreshId((n) => n + 1)} />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
