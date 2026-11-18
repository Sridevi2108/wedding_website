export interface EventDetails {
  id: string;
  title: string;
  tamilTitle?: string;
  dateStr: string; // e.g. "Sunday, 13 December 2026"
  dateIso: string; // ISO string for calendar
  endDateIso?: string;
  timeStr: string;
  venueName: string;
  venueSubtitle?: string;
  addressLines: string[];
  city: string;
  isConfirmed: boolean;
  mapQuery?: string;
  mapEmbedUrl?: string;
  notes?: string;
  ritualDescription?: string;
  attireSuggestion?: string;
}

export interface Blessing {
  id: string;
  guestName: string;
  message: string;
  createdAt: string;
  status: 'approved' | 'pending' | 'rejected';
  leafPosition?: [number, number, number];
  leafRotation?: [number, number, number];
  leafColor?: string;
}

export const WEDDING_CONFIG = {
  couple: {
    groom: {
      fullName: 'C. Vignesh',
      shortName: 'Vignesh',
      role: 'Groom',
      bio: 'Known for his thoughtful demeanor, deep respect for family traditions, and devotion to making every shared moment memorable.',
    },
    bride: {
      fullName: 'S. Pavithra',
      shortName: 'Pavithra',
      role: 'Bride',
      bio: 'Cherished for her grace, warm smile, and artistic soul, bringing joy, laughter, and radiance to every room she enters.',
    },
    subtitle: 'Two hearts, one beautiful beginning.',
    familiesInvitationText:
      'Together with the family, we cordially invite you to join us in celebrating the auspicious wedding ceremony of',
    auspiciousInvocation: 'Om Shri Ganeshaya Namah',
    tamilInvocation: 'ஓம் ஸ்ரீ மகா கணபதியே நமஹ',
  },

  keyDates: {
    weddingDateText: 'Monday, 14 December 2026',
    // Muhurtham exact auspicious window: 06:15 AM - 07:15 AM IST on Dec 14, 2026
    muhurthamIso: '2026-12-14T06:15:00+05:30',
    timezone: 'Asia/Kolkata',
  },

  events: [
    {
      id: 'engagement',
      title: 'Engagement Ceremony',
      tamilTitle: 'நிச்சயதார்த்தம் (Nischayathartham)',
      dateStr: 'Sunday, 13 December 2026',
      dateIso: '2026-12-13T18:00:00+05:30',
      endDateIso: '2026-12-13T21:30:00+05:30',
      timeStr: '6:00 PM onwards',
      venueName: 'Sri Srinivasa Perumal Kalyana Mandapam',
      venueSubtitle: 'Near Mahindra Showroom, Ettines Road',
      addressLines: [
        'Sri Srinivasa Perumal Kalyana Mandapam',
        'Near Mahindra Showroom, Ettines Road',
        'Udhagamandalam (Ooty), The Nilgiris - 643001',
      ],
      city: 'Ooty',
      isConfirmed: true,
      mapQuery: 'Sri Srinivasa Perumal Kalyana Mandapam Ettines Road Ooty',
      notes: 'An intimate evening of formal commitment, exchange of auspicious thamboolam, rings, and family blessings.',
      ritualDescription: 'Traditional ring exchange and exchange of auspicious lagna patrika followed by family dinner.',
    },
    {
      id: 'muhurtham',
      title: 'Auspicious Muhurtham & Wedding',
      tamilTitle: 'மங்கல முகூர்த்தம் (Mangala Muhurtham)',
      dateStr: 'Monday, 14 December 2026',
      dateIso: '2026-12-14T06:15:00+05:30',
      endDateIso: '2026-12-14T11:00:00+05:30',
      timeStr: 'Between 06:15 AM and 07:15 AM',
      venueName: 'Sri Srinivasa Perumal Kalyana Mandapam',
      venueSubtitle: 'Near Mahindra Showroom, Ettines Road',
      addressLines: [
        'Sri Srinivasa Perumal Kalyana Mandapam',
        'Near Mahindra Showroom, Ettines Road',
        'Udhagamandalam (Ooty), The Nilgiris - 643001',
      ],
      city: 'Ooty',
      isConfirmed: true,
      mapQuery: 'Sri Srinivasa Perumal Kalyana Mandapam Ettines Road Ooty',
      notes: 'Auspicious Thali tying ceremony (Mangalya Dharanam) during Brahma Muhurtham followed by traditional Virundhu (Sadya).',
      ritualDescription: 'Kasi Yatra, Oonjal (Swing ritual), Kanyadanam, Mangalya Dharanam, and Saptapadi around sacred Agni.',
    },
    {
      id: 'reception',
      title: 'Grand Wedding Reception',
      tamilTitle: 'திருமண வரவேற்பு (Reception)',
      dateStr: 'Tuesday, 15 December 2026',
      dateIso: '2026-12-15T18:00:00+05:30',
      endDateIso: '2026-12-15T22:30:00+05:30',
      timeStr: '06:00 PM onwards',
      venueName: 'GT Palace Thirumana Mandapam',
      venueSubtitle: 'Natham Main Road, Paraipatti Vilakku',
      addressLines: [
        'GT Palace Thirumana Mandapam',
        'Natham Main Road, Paraipatti Vilakku',
        'Madurai, Tamil Nadu - 625014',
      ],
      city: 'Madurai',
      isConfirmed: true,
      mapQuery: 'GT Palace Thirumana Mandapam Natham Main Road Madurai',
      notes: 'An enchanting evening of celebration, musical performances, personal greetings, photography, and grand royal feast.',
      ritualDescription: 'Greeting the newlyweds, blessings from elders, music & dinner reception.',
    },
  ] as EventDetails[],

  venues: [
    {
      id: 'ooty-venue',
      title: 'Ooty Wedding Venue (Muhurtham)',
      name: 'Sri Srinivasa Perumal Kalyana Mandapam',
      landmark: 'Near Mahindra Showroom, Ettines Road',
      address: 'Ettines Road, Near Mahindra Showroom, Ooty, The Nilgiris, Tamil Nadu - 643001',
      directionsUrl: 'https://maps.app.goo.gl/KxeiPiwEaJ4tpg8n7?g_st=aw',
      city: 'Ooty',
      event: 'Muhurtham (14 Dec 2026)',
      isConfirmed: true,
      travelGuide: {
        nearestAirport: 'Coimbatore International Airport (CJB) - approx. 88 km via Mettupalayam Ghat Road.',
        nearestRailway: 'Udagamandalam (Ooty) Railway Station / Mettupalayam Junction.',
        climateTips: 'December mornings in Ooty are pleasantly cool and crisp (10°C - 18°C). Warm shawls or jackets are recommended for the morning journey.',
        parking: 'Dedicated parking available within mandapam premises and designated street bays along Ettines Road.',
        accommodation: 'Guest accommodations arranged nearby. Please contact the wedding hospitality desk for room allotments.',
      },
      hospitalityContact: {
        name: 'Wedding Hospitality Desk',
        role: 'Guest Assistance (Ooty)',
        phone: '+91 98400 12345 (Placeholder)',
      },
    },
    {
      id: 'madurai-venue',
      title: 'Madurai Reception Venue',
      name: 'GT Palace Thirumana Mandapam',
      landmark: 'Natham Main Road, Paraipatti Vilakku',
      address: 'Natham Main Road, Paraipatti Vilakku, Madurai, Tamil Nadu - 625014',
      directionsUrl: 'https://maps.app.goo.gl/hufKLCP9QirNh1Am6',
      city: 'Madurai',
      event: 'Reception (15 Dec 2026)',
      isConfirmed: true,
      travelGuide: {
        nearestAirport: 'Madurai International Airport (IXM) - approx. 20 km via Ring Road.',
        nearestRailway: 'Madurai Junction (MDU) - approx. 9 km.',
        climateTips: 'Pleasant tropical winter evening (22°C - 27°C). Light festive garments are comfortable.',
        parking: 'Spacious on-site car and bus parking facility within the palace compound with valet assistance.',
        accommodation: 'Hotels and guest suites arranged near Natham Road for outstation guests.',
      },
      hospitalityContact: {
        name: 'Reception Coordination Team',
        role: 'Guest Assistance (Madurai)',
        phone: '+91 98400 67890 (Placeholder)',
      },
    },
  ],

};
