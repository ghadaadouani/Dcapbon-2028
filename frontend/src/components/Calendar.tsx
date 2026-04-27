import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Event {
  id: number;
  title_en: string;
  title_fr: string;
  description_en: string;
  description_fr: string;
  location: string;
  start_date: string;
  end_date: string;
  cover_url?: string;
  category?: string;
  is_published: boolean;
}

const categoryColors: Record<string, string> = {
  gastronomy: 'bg-brand-forest',
  culture: 'bg-brand-sage',
  nature: 'bg-brand-deep',
  international: 'bg-brand-red',
  default: 'bg-brand-red',
};

const Calendar: React.FC = () => {
  const { language } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then(r => r.json())
      .then(data => setEvents(Array.isArray(data) ? data.filter((e: Event) => e.is_published) : []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthName = currentDate.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US', { month: 'long' });
  const year = currentDate.getFullYear();

  const getColor = (event: Event) => categoryColors[event.category || ''] || categoryColors.default;

  const days = [];
  const totalDays = daysInMonth(year, currentDate.getMonth());
  const startDay = firstDayOfMonth(year, currentDate.getMonth());

  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 md:h-32 border-b border-r border-brand-forest/5 bg-brand-deep/5" />);
  }

  for (let d = 1; d <= totalDays; d++) {
    const dayDate = new Date(year, currentDate.getMonth(), d).toISOString().split('T')[0];
    const dayEvents = events.filter(e => {
      const start = e.start_date?.split('T')[0];
      const end = (e.end_date || e.start_date)?.split('T')[0];
      return start <= dayDate && end >= dayDate;
    });

    days.push(
      <div key={d} className="h-24 md:h-32 border-b border-r border-brand-forest/10 p-2 relative group hover:bg-white/50 transition-colors">
        <span className="text-xs font-bold text-brand-deep/40">{d}</span>
        <div className="mt-1 space-y-1 overflow-y-auto max-h-[80%]">
          {dayEvents.map(event => (
            <button
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className={`w-full text-left px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase truncate transition-all hover:scale-105 text-white ${getColor(event)}`}
            >
              {language === 'fr' ? event.title_fr : event.title_en}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-brand-forest/10">
      <div className="bg-brand-deep p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <h2 className="text-white text-3xl font-serif font-medium italic capitalize">
            {monthName} <span className="text-white/30 not-italic ml-2">{year}</span>
          </h2>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-brand-red transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextMonth} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-brand-red transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="hidden md:grid grid-cols-7 bg-brand-deep/5 text-center text-[10px] font-bold uppercase tracking-widest py-3 border-b border-brand-forest/10">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} className="text-brand-forest/50">
            {language === 'fr' ? { Sun:'Dim', Mon:'Lun', Tue:'Mar', Wed:'Mer', Thu:'Jeu', Fri:'Ven', Sat:'Sam' }[d] : d}
          </div>
        ))}
      </div>

      {loading ? (
        <div className="p-12 text-center text-brand-forest/40 italic text-sm">
          {language === 'fr' ? 'Chargement...' : 'Loading...'}
        </div>
      ) : (
        <>
          <div className="hidden md:grid grid-cols-7 border-l border-brand-forest/10">{days}</div>

          <div className="md:hidden divide-y divide-brand-forest/10">
            {events
              .filter(e => new Date(e.start_date).getMonth() === currentDate.getMonth())
              .sort((a, b) => a.start_date.localeCompare(b.start_date))
              .map(event => (
                <div key={event.id} onClick={() => setSelectedEvent(event)} className="p-4 flex gap-4 items-start">
                  <div className={`w-12 h-12 shrink-0 rounded-lg flex flex-col items-center justify-center text-white ${getColor(event)}`}>
                    <span className="text-[10px] font-bold uppercase">{event.start_date.split('-')[1]}</span>
                    <span className="text-lg font-bold leading-none">{event.start_date.split('-')[2]}</span>
                  </div>
                  <div>
                    <h3 className="text-brand-deep font-serif font-medium text-lg leading-tight mb-1">
                      {language === 'fr' ? event.title_fr : event.title_en}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] text-brand-forest/60 uppercase tracking-widest">
                      <MapPin className="w-3 h-3" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            {events.filter(e => new Date(e.start_date).getMonth() === currentDate.getMonth()).length === 0 && (
              <div className="p-12 text-center text-brand-forest/40 italic text-sm">
                {language === 'fr' ? 'Aucun événement ce mois-ci' : 'No events this month'}
              </div>
            )}
          </div>
        </>
      )}

      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-deep/80 backdrop-blur-sm"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-brand-cream w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-brand-red transition-all">
                <X className="w-4 h-4" />
              </button>
              {selectedEvent.cover_url && (
                <div className="h-48">
                  <img src={selectedEvent.cover_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-8">
                <h2 className="text-brand-deep text-2xl font-serif font-medium mb-6">
                  {language === 'fr' ? selectedEvent.title_fr : selectedEvent.title_en}
                </h2>
                <div className="space-y-4 mb-8 text-[11px] uppercase tracking-widest font-bold text-brand-forest/60">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-4 h-4 text-brand-red" />
                    <span>{selectedEvent.start_date?.split('T')[0]} {selectedEvent.end_date ? `- ${selectedEvent.end_date?.split('T')[0]}` : ''}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-brand-red" />
                    <span>{selectedEvent.location}</span>
                  </div>
                </div>
                <p className="text-brand-deep/70 leading-relaxed">
                  {language === 'fr' ? selectedEvent.description_fr : selectedEvent.description_en}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Calendar;
