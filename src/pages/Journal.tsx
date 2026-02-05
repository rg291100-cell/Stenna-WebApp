
import React from 'react';
import { JOURNAL_ENTRIES } from '../constants';

export const Journal: React.FC = () => {
  return (
    <div className="pt-32 pb-20 px-6 md:px-12 bg-white">
      <div className="max-w-screen-xl mx-auto">
        <header className="mb-20 text-center">
          <h1 className="text-6xl md:text-8xl font-serif mb-6 italic">The Journal</h1>
          <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Curation, Concept, and Creation</p>
        </header>

        <div className="grid grid-cols-1 gap-32">
          {JOURNAL_ENTRIES.map((entry, i) => (
            <article key={entry.id} className={`flex flex-col ${i % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center group`}>
              <div className="w-full md:w-1/2 overflow-hidden aspect-[16/10]">
                <img 
                  src={entry.image} 
                  alt={entry.title}
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" 
                />
              </div>
              <div className="w-full md:w-1/2 flex flex-col gap-6 max-w-lg">
                <span className="text-[10px] tracking-widest text-gray-400 uppercase">{entry.date}</span>
                <h2 className="text-4xl md:text-5xl font-serif leading-tight group-hover:italic transition-all duration-300">
                  {entry.title}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed font-light">
                  {entry.excerpt}
                </p>
                <button className="w-fit border-b border-black pb-2 text-xs uppercase tracking-widest hover:opacity-50 transition-opacity">
                  Read More
                </button>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-40 bg-gray-50 p-12 md:p-24 text-center">
          <h3 className="text-3xl font-serif mb-8 italic">Stay Curated</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mb-10 leading-relaxed">
            Receive our seasonal lookbooks and exclusive design insights directly to your inbox.
          </p>
          <form className="flex flex-col md:flex-row justify-center gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="YOUR EMAIL" 
              className="flex-1 bg-transparent border-b border-black py-3 text-xs uppercase tracking-widest focus:outline-none"
            />
            <button className="bg-black text-white text-[10px] uppercase tracking-widest px-8 py-3 hover:bg-gray-800">
              Subscribe
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};
