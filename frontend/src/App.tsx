import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LanguageProvider } from './context/LanguageContext';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/region/About'));
const Partners = lazy(() => import('./pages/region/Partners'));
const Candidature = lazy(() => import('./pages/region/Candidature'));
const Products = lazy(() => import('./pages/gastronomy/Products'));
const Specialities = lazy(() => import('./pages/gastronomy/Specialities'));
const ArtisanalCrafts = lazy(() => import('./pages/gastronomy/ArtisanalCrafts'));
const Itineraries = lazy(() => import('./pages/tourism/Itineraries'));
const Accommodations = lazy(() => import('./pages/tourism/Accommodations'));
const Restaurants = lazy(() => import('./pages/tourism/Restaurants'));
const Mice = lazy(() => import('./pages/tourism/Mice'));
const Blog = lazy(() => import('./pages/events/Blog'));
const BlogDetail = lazy(() => import('./pages/events/BlogDetail'));
const Agenda = lazy(() => import('./pages/events/Agenda'));
const Medias = lazy(() => import('./pages/events/Medias'));
const Galerie = lazy(() => import('./pages/events/Galerie'));
const Contact = lazy(() => import('./pages/Contact'));

const Loading = () => (
  <div className="fixed inset-0 bg-dark flex items-center justify-center z-[99998]">
    <div className="text-center">
      <span className="font-serif italic text-[18px] text-white/50 tracking-[0.3em] uppercase">Discover</span>
      <div className="font-serif text-[72px] font-light text-white mt-2">
        <span className="text-green">C</span>ap <span className="text-red">B</span>on
      </div>
    </div>
  </div>
);

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Layout>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/la-region/a-propos" element={<About />} />
              <Route path="/la-region/partners" element={<Partners />} />
              <Route path="/la-region/projet-candidature" element={<Candidature />} />
              <Route path="/gastronomie/produits-phares" element={<Products />} />
              <Route path="/gastronomie/plats-specialites" element={<Specialities />} />
              <Route path="/gastronomie/les-arts-du-cap-bon" element={<ArtisanalCrafts />} />
              <Route path="/tourisme/itineraires" element={<Itineraries />} />
              <Route path="/tourisme/hebergements" element={<Accommodations />} />
              <Route path="/tourisme/tables-d-hotes" element={<Restaurants />} />
              <Route path="/tourisme/mice" element={<Mice />} />
              <Route path="/evenements/blog" element={<Blog />} />
              <Route path="/evenements/blog/:id" element={<BlogDetail />} />
              <Route path="/evenements/agenda" element={<Agenda />} />
              <Route path="/evenements/medias" element={<Medias />} />
              <Route path="/evenements/galerie" element={<Galerie />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </LanguageProvider>
  );
}

export default App;
