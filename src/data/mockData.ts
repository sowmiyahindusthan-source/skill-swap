import { LocationZone, UserProfile, ServiceRequest, ExchangeProposal } from '../types/exchange';

// Generated authentic portraits
import devAvatar from '../assets/images/avatar_student_dev_1791440058815.jpg';
import tutorAvatar from '../assets/images/avatar_designer_tutor_1791440074142.jpg';
import makerAvatar from '../assets/images/avatar_craftsman_maker_1791440091720.jpg';

export const LOCAL_ZONES: LocationZone[] = [
  {
    id: 'zone-north-campus',
    name: 'North Campus · Engineering & Science Quad',
    type: 'Campus',
    coordinates: { lat: 37.7749, lng: -122.4194 },
    description: 'Central library, engineering labs, and study common rooms.'
  },
  {
    id: 'zone-west-dorms',
    name: 'West Dormitories & Student Village',
    type: 'Campus',
    coordinates: { lat: 37.7785, lng: -122.4280 },
    description: 'Residential halls, recreation center, and bike racks.'
  },
  {
    id: 'zone-downtown-hub',
    name: 'Innovation Hub · Downtown Tech District',
    type: 'Community Center',
    coordinates: { lat: 37.7690, lng: -122.4110 },
    description: 'Co-working spaces, maker spaces, and student incubators.'
  },
  {
    id: 'zone-arts-quarter',
    name: 'South Arts & Music Quarter',
    type: 'Neighborhood',
    coordinates: { lat: 37.7610, lng: -122.4220 },
    description: 'Studio lofts, rehearsal spaces, and coffee shops.'
  },
  {
    id: 'zone-riverfront',
    name: 'Riverfront Green & Community Garden',
    type: 'Neighborhood',
    coordinates: { lat: 37.7830, lng: -122.4050 },
    description: 'Community gardens, outdoor workshops, and park pavilions.'
  }
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-aarav',
    name: 'Aarav Chen',
    headline: 'Sophomore in Data Science & Fingerstyle Guitarist',
    bio: 'Passionate about acoustic fingerstyle guitar and music theory. Currently tackling Advanced Algorithms & Python data structures and looking for peer tutoring.',
    avatar: devAvatar,
    role: 'University Student',
    locationZoneId: 'zone-west-dorms',
    locationName: 'West Dormitories & Student Village',
    coordinates: { lat: 37.7785, lng: -122.4280 },
    modePreference: 'Hybrid',
    skillsOffered: [
      {
        id: 'sk-guitar',
        name: 'Acoustic Guitar & Music Basics',
        category: 'Music & Arts',
        level: 'Advanced',
        verificationStatus: 'verified',
        endorsementsCount: 14,
        portfolioUrl: 'https://github.com/soundtracks'
      },
      {
        id: 'sk-video',
        name: 'Video Editing & Premiere Pro',
        category: 'Creative & Design',
        level: 'Intermediate',
        verificationStatus: 'peer_endorsed',
        endorsementsCount: 8
      }
    ],
    skillsWanted: ['Python Tutoring', 'Data Structures & Algorithms', 'Calculus II'],
    availability: [
      { day: 'Mon', slots: ['Evening'] },
      { day: 'Wed', slots: ['Evening'] },
      { day: 'Sat', slots: ['Morning', 'Afternoon'] },
      { day: 'Sun', slots: ['Afternoon'] }
    ],
    reputationScore: 4.9,
    totalExchanges: 12,
    responseRatePct: 98,
    isIdVerified: true,
    creditsBalance: 45,
    reviews: [
      {
        id: 'rev-1',
        reviewerId: 'user-elena',
        reviewerName: 'Elena Rostova',
        reviewerAvatar: tutorAvatar,
        rating: 5,
        date: '2026-09-28',
        skillExchanged: 'Acoustic Guitar Lessons',
        comment: 'Aarav broke down fingerpicking chords so patiently! In just 2 sessions I was playing my first full song. Highly recommended peer mentor.',
        tags: ['Patient Mentor', 'Super Prepared', 'Great Explanations']
      },
      {
        id: 'rev-2',
        reviewerId: 'user-liam',
        reviewerName: 'Liam Keller',
        reviewerAvatar: makerAvatar,
        rating: 5,
        date: '2026-09-14',
        skillExchanged: 'Video Editing',
        comment: 'Helped me edit a tutorial video for community bike repair. Quick turnaround and clear feedback.',
        tags: ['Punctual', 'High Quality']
      }
    ]
  },
  {
    id: 'user-maya',
    name: 'Maya Lin',
    headline: 'Senior Computer Science Major & Campus Coding TA',
    bio: 'Undergrad teaching assistant for CS106. Love breaking down Python algorithms, recursion, and debugging. Wanting to learn acoustic guitar or Spanish conversation in exchange.',
    avatar: tutorAvatar,
    role: 'Campus Mentor',
    locationZoneId: 'zone-north-campus',
    locationName: 'North Campus · Engineering & Science Quad',
    coordinates: { lat: 37.7749, lng: -122.4194 },
    modePreference: 'Hybrid',
    skillsOffered: [
      {
        id: 'sk-py',
        name: 'Python Tutoring & Algorithm Debugging',
        category: 'Tech & Programming',
        level: 'Expert',
        verificationStatus: 'verified',
        endorsementsCount: 29,
        portfolioUrl: 'https://github.com/mayalin-cs'
      },
      {
        id: 'sk-math',
        name: 'Calculus & Discrete Mathematics',
        category: 'Academic & STEM',
        level: 'Advanced',
        verificationStatus: 'community_certified',
        endorsementsCount: 16
      }
    ],
    skillsWanted: ['Acoustic Guitar & Music Basics', 'Conversational Spanish', 'Ceramics Basics'],
    availability: [
      { day: 'Tue', slots: ['Evening'] },
      { day: 'Wed', slots: ['Evening'] },
      { day: 'Thu', slots: ['Afternoon', 'Evening'] },
      { day: 'Sat', slots: ['Afternoon'] }
    ],
    reputationScore: 5.0,
    totalExchanges: 31,
    responseRatePct: 100,
    isIdVerified: true,
    creditsBalance: 80,
    reviews: [
      {
        id: 'rev-3',
        reviewerId: 'user-aarav',
        reviewerName: 'Aarav Chen',
        reviewerAvatar: devAvatar,
        rating: 5,
        date: '2026-09-20',
        skillExchanged: 'Python Recursion & Big-O',
        comment: 'Maya is hands-down the best tutor on campus. She visually diagrammed recursion trees on a whiteboard until it finally clicked.',
        tags: ['Master Explainer', 'Inspiring', 'Always On Time']
      }
    ]
  },
  {
    id: 'user-liam',
    name: 'Liam Keller',
    headline: 'Community Maker, Cyclist & Hardware DIY Specialist',
    bio: 'Mechanical engineering enthusiast. I fix road bikes, tune derailleurs, and do custom soldering for electronics. Eager to swap for web design or Spanish practice.',
    avatar: makerAvatar,
    role: 'Local Craftsman',
    locationZoneId: 'zone-downtown-hub',
    locationName: 'Innovation Hub · Downtown Tech District',
    coordinates: { lat: 37.7690, lng: -122.4110 },
    modePreference: 'In-Person',
    skillsOffered: [
      {
        id: 'sk-bike',
        name: 'Bicycle Maintenance & Brake Tuning',
        category: 'Practical & Repair',
        level: 'Expert',
        verificationStatus: 'verified',
        endorsementsCount: 22
      },
      {
        id: 'sk-solder',
        name: 'Hardware Soldering & Electronics Repair',
        category: 'Tech & Programming',
        level: 'Advanced',
        verificationStatus: 'peer_endorsed',
        endorsementsCount: 11
      }
    ],
    skillsWanted: ['UI/UX Design', 'Portfolio Website Help', 'German Language'],
    availability: [
      { day: 'Mon', slots: ['Morning', 'Afternoon'] },
      { day: 'Fri', slots: ['Afternoon', 'Evening'] },
      { day: 'Sat', slots: ['Morning', 'Afternoon'] }
    ],
    reputationScore: 4.8,
    totalExchanges: 19,
    responseRatePct: 92,
    isIdVerified: true,
    creditsBalance: 55,
    reviews: [
      {
        id: 'rev-4',
        reviewerId: 'user-aarav',
        reviewerName: 'Aarav Chen',
        reviewerAvatar: devAvatar,
        rating: 5,
        date: '2026-08-30',
        skillExchanged: 'Bicycle Gear Alignment',
        comment: 'Fixed my rusted shifter cable in 40 minutes and showed me how to maintain it. Genuine community hero!',
        tags: ['Hands-on Expert', 'Super Generous']
      }
    ]
  },
  {
    id: 'user-elena',
    name: 'Elena Rostova',
    headline: 'Product Designer & Multilingual Conversation Lead',
    bio: 'Senior design student specializing in Figma UI design systems, wireframing, and user testing. Native Spanish speaker offering conversation practice for beginners.',
    avatar: tutorAvatar,
    role: 'University Student',
    locationZoneId: 'zone-arts-quarter',
    locationName: 'South Arts & Music Quarter',
    coordinates: { lat: 37.7610, lng: -122.4220 },
    modePreference: 'Hybrid',
    skillsOffered: [
      {
        id: 'sk-uiux',
        name: 'UI/UX Design & Figma Prototyping',
        category: 'Creative & Design',
        level: 'Advanced',
        verificationStatus: 'verified',
        endorsementsCount: 18,
        portfolioUrl: 'https://figma.com/@elena-ux'
      },
      {
        id: 'sk-span',
        name: 'Conversational Spanish',
        category: 'Language & Culture',
        level: 'Expert',
        verificationStatus: 'verified',
        endorsementsCount: 24
      }
    ],
    skillsWanted: ['Bicycle Maintenance', 'Python Basics', 'Resume Review'],
    availability: [
      { day: 'Tue', slots: ['Afternoon'] },
      { day: 'Thu', slots: ['Morning', 'Afternoon'] },
      { day: 'Sun', slots: ['Morning', 'Afternoon'] }
    ],
    reputationScore: 4.95,
    totalExchanges: 27,
    responseRatePct: 97,
    isIdVerified: true,
    creditsBalance: 65,
    reviews: []
  },
  {
    id: 'user-david',
    name: 'David Vance',
    headline: 'Urban Gardener & Organic Plant Care Enthusiast',
    bio: 'Neighborhood garden coordinator with 8 years of soil science and indoor plant propagation experience. Happy to exchange gardening guidance for tech coaching.',
    avatar: makerAvatar,
    role: 'Community Resident',
    locationZoneId: 'zone-riverfront',
    locationName: 'Riverfront Green & Community Garden',
    coordinates: { lat: 37.7830, lng: -122.4050 },
    modePreference: 'In-Person',
    skillsOffered: [
      {
        id: 'sk-garden',
        name: 'Organic Gardening & Houseplant Care',
        category: 'Practical & Repair',
        level: 'Expert',
        verificationStatus: 'community_certified',
        endorsementsCount: 15
      }
    ],
    skillsWanted: ['Social Media Strategy', 'Excel Spreadsheets'],
    availability: [
      { day: 'Sat', slots: ['Morning', 'Afternoon'] },
      { day: 'Sun', slots: ['Morning'] }
    ],
    reputationScore: 4.85,
    totalExchanges: 14,
    responseRatePct: 90,
    isIdVerified: true,
    creditsBalance: 30,
    reviews: []
  }
];

export const INITIAL_REQUESTS: ServiceRequest[] = [
  {
    id: 'req-1',
    seekerId: 'user-aarav',
    seekerName: 'Aarav Chen',
    seekerAvatar: devAvatar,
    seekerZone: 'West Dormitories & Student Village',
    title: 'Need 1-on-1 Help Debugging Python Binary Search Trees',
    description: 'Preparing for my mid-term algorithms project. Looking for an experienced peer tutor to review tree balancing and recursive traversals. Happy to teach guitar or trade time credits!',
    skillCategory: 'Tech & Programming',
    skillRequired: 'Python Tutoring & Algorithm Debugging',
    urgency: 'Within 2-3 Days',
    locationMode: 'In-Person',
    preferredTimeSlot: 'Wed Evening or Sat Afternoon',
    exchangeType: 'skill_barter',
    offeredSkillForBarter: 'Acoustic Guitar & Music Basics',
    createdAt: '2026-10-06T14:30:00Z',
    status: 'open'
  },
  {
    id: 'req-2',
    seekerId: 'user-maya',
    seekerName: 'Maya Lin',
    seekerAvatar: tutorAvatar,
    seekerZone: 'North Campus · Engineering Quad',
    title: 'Seeking Beginner Fingerstyle Acoustic Guitar Coach',
    description: 'Just bought a secondhand acoustic guitar! Looking for someone who can teach me clean fretboard hand placement and basic fingerpicking patterns over 1-2 sessions.',
    skillCategory: 'Music & Arts',
    skillRequired: 'Acoustic Guitar & Music Basics',
    urgency: 'Flexible this Week',
    locationMode: 'In-Person',
    preferredTimeSlot: 'Wed Evening or Sat Afternoon',
    exchangeType: 'skill_barter',
    offeredSkillForBarter: 'Python Tutoring & Algorithm Debugging',
    createdAt: '2026-10-07T09:15:00Z',
    status: 'open'
  },
  {
    id: 'req-3',
    seekerId: 'user-liam',
    seekerName: 'Liam Keller',
    seekerAvatar: makerAvatar,
    seekerZone: 'Innovation Hub · Downtown Tech District',
    title: 'UI Review for Local Bike Repair Workshop Portfolio',
    description: 'Building a simple webpage for our free community bike clinic. Would love 1 hour with a designer to critique layout, mobile buttons, and typography.',
    skillCategory: 'Creative & Design',
    skillRequired: 'UI/UX Design & Figma Prototyping',
    urgency: 'Within 2-3 Days',
    locationMode: 'Flexible',
    preferredTimeSlot: 'Fri Afternoon',
    exchangeType: 'skill_barter',
    offeredSkillForBarter: 'Bicycle Maintenance & Brake Tuning',
    createdAt: '2026-10-05T18:00:00Z',
    status: 'open'
  },
  {
    id: 'req-4',
    seekerId: 'user-elena',
    seekerName: 'Elena Rostova',
    seekerAvatar: tutorAvatar,
    seekerZone: 'South Arts & Music Quarter',
    title: 'Bicycle Tune-Up Needed (Squeaky Brakes & Gear Skip)',
    description: 'My commuter bicycle slips out of 3rd gear when pedaling uphill and the rear brake pads need centering. Can trade Spanish conversation or UI portfolio audit.',
    skillCategory: 'Practical & Repair',
    skillRequired: 'Bicycle Maintenance & Brake Tuning',
    urgency: 'Immediate (Today)',
    locationMode: 'In-Person',
    preferredTimeSlot: 'Thu Morning or Sat Morning',
    exchangeType: 'skill_barter',
    offeredSkillForBarter: 'Conversational Spanish',
    createdAt: '2026-10-07T08:20:00Z',
    status: 'open'
  }
];

export const INITIAL_PROPOSALS: ExchangeProposal[] = [
  {
    id: 'prop-sample-pending',
    requestId: 'req-1',
    seekerId: 'user-aarav',
    seekerName: 'Aarav Chen',
    seekerAvatar: devAvatar,
    providerId: 'user-maya',
    providerName: 'Maya Lin',
    providerAvatar: tutorAvatar,
    skillRequested: 'Python Tutoring & Algorithm Debugging',
    skillOfferedInReturn: 'Acoustic Guitar & Music Basics',
    proposedDate: '2026-10-09',
    proposedTimeSlot: 'Wed Evening (6:30 PM)',
    locationMode: 'In-Person',
    meetingPoint: 'Science Library · Room 304 Collaboration Pod',
    status: 'pending',
    notes: 'Hi Maya! I saw you are looking for acoustic guitar lessons. I would love to trade guitar basics for help debugging binary search tree recursion for my CS project.',
    createdAt: '2026-10-07T12:00:00Z',
    matchScore: 97
  },
  {
    id: 'prop-sample-accepted',
    seekerId: 'user-aarav',
    seekerName: 'Aarav Chen',
    seekerAvatar: devAvatar,
    providerId: 'user-liam',
    providerName: 'Liam Keller',
    providerAvatar: makerAvatar,
    skillRequested: 'Bicycle Maintenance & Brake Tuning',
    skillOfferedInReturn: 'Video Editing & Premiere Pro',
    proposedDate: '2026-10-10',
    proposedTimeSlot: 'Sat Morning (10:00 AM)',
    locationMode: 'In-Person',
    meetingPoint: 'Downtown Maker Hub · Bike Rack Patio',
    status: 'accepted',
    notes: 'Confirmed! Liam will bring his cable tension tools and we will tune up my gravel bike. Ready to mark complete once our session wraps up.',
    createdAt: '2026-10-06T10:15:00Z',
    matchScore: 88
  },
  {
    id: 'prop-sample-completed',
    seekerId: 'user-aarav',
    seekerName: 'Aarav Chen',
    seekerAvatar: devAvatar,
    providerId: 'user-elena',
    providerName: 'Elena Rostova',
    providerAvatar: tutorAvatar,
    skillRequested: 'UI/UX Design & Figma Prototyping',
    skillOfferedInReturn: 'Acoustic Guitar & Music Basics',
    proposedDate: '2026-10-04',
    proposedTimeSlot: 'Sun Afternoon (2:00 PM)',
    locationMode: 'In-Person',
    meetingPoint: 'Arts Commons Café',
    status: 'completed',
    notes: 'Great 90-minute session! Elena reviewed my wireframes and we also went over fingerstyle chord progressions. Ready for final evaluation and rating!',
    createdAt: '2026-10-03T16:00:00Z',
    matchScore: 92
  }
];
