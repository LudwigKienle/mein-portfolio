import React, { useState } from 'react';

// --- ICONS (Heroicons) ---
// Using inline SVGs for simplicity and performance.
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);

const UserIcon = ()=>(
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);


// --- MOCK DATA ---
// Replace this with your actual project data.
const projects = [
  {
    id: 1,
    title: 'Neuronale Träume',
    category: 'AI Art',
    imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Neuronale+Träume',
    description: 'Eine Serie von Bildern, die mit einem StyleGAN-Modell erstellt wurden und die Fluidität von Träumen erforschen.'
  },
  {
    id: 2,
    title: 'Synthetische Symphonie',
    category: 'AI Film',
    imageUrl: 'https://placehold.co/600x400/2a2a2a/ffffff?text=Synthetische+Symphonie',
    description: 'Ein Kurzfilm, dessen Visuals vollständig von einer Text-zu-Bild-KI generiert und animiert wurden.'
  },
  {
    id: 3,
    title: 'Algorithmische Abstraktionen',
    category: 'AI Art',
    imageUrl: 'https://placehold.co/600x400/1e1e1e/ffffff?text=Algorithmische+Abstraktionen',
    description: 'Abstrakte Kunstwerke, die durch prozedurale Algorithmen und fraktale Geometrien erzeugt wurden.'
  },
  {
    id: 4,
    title: 'Die stille Maschine',
    category: 'AI Film',
    imageUrl: 'https://placehold.co/600x400/3a3a3a/ffffff?text=Die+stille+Maschine',
    description: 'Ein narrativer Film, der KI nutzt, um Umgebungen und Charakterkonzepte zu erschaffen.'
  },
  {
    id: 5,
    title: 'Daten-Porträts',
    category: 'AI Art',
    imageUrl: 'https://placehold.co/600x400/2e2e2e/ffffff?text=Daten-Porträts',
    description: 'Porträts, die aus Datensätzen generiert wurden und die Schnittstelle von Identität und Daten visualisieren.'
  },
  {
    id: 6,
    title: 'Ewige Wiederkehr',
    category: 'AI Film',
    imageUrl: 'https://placehold.co/600x400/1c1c1c/ffffff?text=Ewige+Wiederkehr',
    description: 'Ein experimenteller Endlos-Loop-Film, der sich mit jedem Abspielen durch KI leicht verändert.'
  }
];

const filterCategories = ['Alle', 'AI Art', 'AI Film'];


// --- MAIN APP COMPONENT ---
export default function App() {
  const [activeFilter, setActiveFilter] = useState('Alle');
  const [formStatus, setFormStatus] = useState('');

  const filteredProjects = activeFilter === 'Alle'
    ? projects
    : projects.filter(p => p.category === activeFilter);
    
  const handleFormSubmit = (e) => {
      e.preventDefault();
      setFormStatus('Vielen Dank! Ihre Nachricht wurde gesendet.');
      // Hier würden Sie normalerweise die Formulardaten an einen Server senden.
      setTimeout(() => setFormStatus(''), 5000);
      e.target.reset();
  }

  // Smooth scroll functionality
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-900 text-gray-200 font-sans leading-normal tracking-tight">
      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-80 backdrop-blur-md z-50 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-white tracking-wider">IHR NAME</span>
            </div>
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button onClick={() => scrollToSection('home')} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</button>
                <button onClick={() => scrollToSection('about')} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Über Mich</button>
                <button onClick={() => scrollToSection('projects')} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Projekte</button>
                <button onClick={() => scrollToSection('contact')} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Kontakt</button>
              </div>
            </nav>
          </div>
        </div>
      </header>
      
      <main>
        {/* --- HERO SECTION --- */}
        <section id="home" className="h-screen flex items-center justify-center bg-black relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-gray-700/20 [mask-image:linear-gradient(to_bottom,white_20%,transparent_100%)]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
            <div className="text-center z-10 p-4">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-4 tracking-tighter leading-tight">
                    Kunst an der Schnittstelle
                    <br />
                    <span className="text-purple-400">von Mensch und Maschine.</span>
                </h1>
                <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 mb-8">
                    Willkommen in meinem digitalen Atelier. Hier erforsche ich die kreativen Möglichkeiten von künstlicher Intelligenz, um fesselnde visuelle Erzählungen und Kunstwerke zu schaffen.
                </p>
                <button onClick={() => scrollToSection('projects')} className="bg-purple-600 text-white font-bold py-3 px-8 rounded-full hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto text-lg">
                    Meine Arbeit ansehen <ArrowRightIcon />
                </button>
            </div>
        </section>

        {/* --- ABOUT SECTION --- */}
        <section id="about" className="py-20 sm:py-32 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-4xl font-bold text-white mb-4">Über Mich</h2>
              <p className="text-gray-300 mb-4 text-lg">
                Als AI Artist und Filmemacher bewege ich mich an der vordersten Front der digitalen Kreativität. Meine Leidenschaft ist es, die Grenzen des Möglichen zu erweitern, indem ich fortschrittliche Algorithmen nicht nur als Werkzeuge, sondern als kreative Partner betrachte.
              </p>
              <p className="text-gray-300 mb-6 text-lg">
                Ich kombiniere traditionelle filmische Techniken mit generativen Modellen (GANs), neuronalen Stilübertragungen und anderen KI-Methoden, um einzigartige Ästhetiken und unerzählte Geschichten zu entdecken. Jedes Projekt ist eine Erkundung des Dialogs zwischen menschlicher Absicht und künstlicher Intuition.
              </p>
               <div className="flex space-x-4">
                    <a href="#contact" className="bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors">Kontaktieren Sie mich</a>
                    <a href="/lebenslauf.pdf" target="_blank" className="border-2 border-purple-500 text-purple-400 font-semibold py-3 px-6 rounded-lg hover:bg-purple-500 hover:text-white transition-colors">Lebenslauf ansehen</a>
                </div>
            </div>
            <div className="order-1 md:order-2">
                <div className="relative w-full h-auto rounded-lg shadow-2xl shadow-purple-900/20 transform hover:scale-105 transition-transform duration-500">
                    <img 
                        src="https://placehold.co/500x500/1a1a1a/ffffff?text=Ihr+Foto" 
                        alt="Porträt von [Ihr Name]"
                        className="rounded-lg object-cover" 
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/500x500/1a1a1a/ffffff?text=Bild+nicht+gefunden'; }}
                    />
                    <div className="absolute -bottom-4 -right-4 bg-purple-600 text-white text-sm font-bold p-4 rounded-lg shadow-lg">
                        AI Artist & Filmmaker
                    </div>
                </div>
            </div>
          </div>
        </section>

        {/* --- PROJECTS SECTION --- */}
        <section id="projects" className="py-20 sm:py-32 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white text-center mb-4">Projekte</h2>
            <p className="text-lg text-gray-400 text-center mb-12 max-w-3xl mx-auto">
              Eine kuratierte Auswahl meiner Arbeiten, die die Vielfalt und das Potenzial von KI in Kunst und Film demonstrieren.
            </p>
            
            {/* Filter Buttons */}
            <div className="flex justify-center space-x-2 mb-12">
              {filterCategories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className={`px-6 py-2 rounded-full font-semibold text-sm transition-colors ${
                    activeFilter === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Project Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map(project => (
                <div key={project.id} className="bg-gray-900 rounded-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300 shadow-lg shadow-black/30">
                  <div className="relative">
                     <img 
                        src={project.imageUrl}
                        alt={project.title} 
                        className="w-full h-60 object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/1a1a1a/ffffff?text=Bild+fehlerhaft'; }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-white text-xl font-bold border-2 border-white px-4 py-2 rounded-md">Details ansehen</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="text-sm font-semibold text-purple-400">{project.category}</span>
                    <h3 className="text-2xl font-bold text-white mt-2 mb-3">{project.title}</h3>
                    <p className="text-gray-400">{project.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* --- CONTACT SECTION --- */}
        <section id="contact" className="py-20 sm:py-32 bg-gray-900">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl font-bold text-white mb-4">Lassen Sie uns zusammenarbeiten</h2>
                <p className="text-lg text-gray-400 mb-12">
                    Haben Sie ein Projekt im Sinn oder möchten Sie mehr über meine Arbeit erfahren? Ich freue mich, von Ihnen zu hören.
                </p>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="relative">
                        <UserIcon />
                        <input type="text" name="name" placeholder="Ihr Name" required className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg py-3 px-4 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" />
                    </div>
                    <div className="relative">
                        <MailIcon />
                        <input type="email" name="email" placeholder="Ihre E-Mail-Adresse" required className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg py-3 px-4 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" />
                    </div>
                     <div>
                        <textarea name="message" placeholder="Ihre Nachricht..." rows="5" required className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105">
                        Nachricht senden
                    </button>
                </form>
                {formStatus && (
                    <p className="mt-6 text-green-400">{formStatus}</p>
                )}
            </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-black py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} [Ihr Name]. Alle Rechte vorbehalten.</p>
          <div className="flex justify-center space-x-6 mt-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">Twitter</a>
<a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">Instagram</a>
<a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
