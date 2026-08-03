import React from 'react';

export default function ValuePropsSection() {
  const cards = [
    {
      subhead: 'TWO WEDDINGS, ONE PLAN',
      title: 'Traditional and white',
      body: 'Each celebration keeps its own date, venue, budget and checklist — but you see everything in one place.'
    },
    {
      subhead: 'LOCAL VENDORS',
      title: 'Made for your area',
      body: 'Vendors in Johannesburg, Sandton, Pretoria, Midrand and Soweto who understand both traditions.'
    },
    {
      subhead: 'PLAN WITH THE PEOPLE YOU LOVE',
      title: 'Mama, fiancé, sisters',
      body: 'Invite the people around you to help — with their own photos, roles and conversations.'
    }
  ];

  return (
    <section className="py-16 lg:py-20 border-t border-[#E6DED6]/50 bg-[#F9F5F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {cards.map((card, i) => (
            <div
              key={i}
              className="bg-white p-7 rounded-2xl border border-[#E6DED6] space-y-3 transition-all hover:border-[#9E784B]/40 hover:shadow-xs"
            >
              <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-[#1A1816]/60">
                {card.subhead}
              </span>
              <h3 className="font-serif text-2xl font-medium text-[#1A1816]">
                {card.title}
              </h3>
              <p className="font-sans text-sm text-[#1A1816]/70 leading-relaxed">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
