export type SkillCategory = 
  | 'Academic & STEM'
  | 'Creative & Design'
  | 'Tech & Programming'
  | 'Music & Arts'
  | 'Practical & Repair'
  | 'Language & Culture'
  | 'Wellness & Fitness';

export type VerificationTier = 'verified' | 'peer_endorsed' | 'community_certified' | 'unverified';

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  verificationStatus: VerificationTier;
  endorsementsCount: number;
  portfolioUrl?: string;
}

export interface DayAvailability {
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  slots: ('Morning' | 'Afternoon' | 'Evening')[];
}

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface LocationZone {
  id: string;
  name: string;
  type: 'Campus' | 'Neighborhood' | 'Community Center';
  coordinates: LocationCoordinates;
  description: string;
}

export interface ReviewItem {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number; // 1 to 5
  date: string;
  skillExchanged: string;
  comment: string;
  tags: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  headline: string;
  bio: string;
  avatar: string;
  role: 'University Student' | 'Community Resident' | 'Campus Mentor' | 'Local Craftsman';
  locationZoneId: string;
  locationName: string;
  coordinates: LocationCoordinates;
  modePreference: 'In-Person' | 'Remote' | 'Hybrid';
  skillsOffered: SkillItem[];
  skillsWanted: string[]; // for barter matching
  availability: DayAvailability[];
  reputationScore: number; // e.g. 4.9
  totalExchanges: number;
  responseRatePct: number; // e.g. 96
  isIdVerified: boolean;
  reviews: ReviewItem[];
  creditsBalance: number;
}

export type ExchangeStatus = 
  | 'pending'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'rated'
  | 'declined';

export type ExchangeType = 'direct_exchange' | 'skill_barter' | 'community_help';

export interface ServiceRequest {
  id: string;
  seekerId: string;
  seekerName: string;
  seekerAvatar: string;
  seekerZone: string;
  title: string;
  description: string;
  skillCategory: SkillCategory;
  skillRequired: string;
  urgency: 'Immediate (Today)' | 'Within 2-3 Days' | 'Flexible this Week';
  locationMode: 'In-Person' | 'Remote' | 'Flexible';
  preferredTimeSlot: string;
  exchangeType: ExchangeType;
  offeredSkillForBarter?: string;
  createdAt: string;
  status: 'open' | 'matched' | 'fulfilled';
}

export interface ExchangeProposal {
  id: string;
  requestId?: string;
  seekerId: string;
  seekerName: string;
  seekerAvatar: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  skillRequested: string;
  skillOfferedInReturn?: string;
  proposedDate: string;
  proposedTimeSlot: string;
  locationMode: 'In-Person' | 'Remote';
  meetingPoint: string;
  status: ExchangeStatus;
  notes: string;
  createdAt: string;
  matchScore: number;
  seekerRating?: {
    stars: number;
    feedback: string;
    submittedAt: string;
  };
}

export interface MatchScoreBreakdown {
  overallScore: number; // 0 - 100
  skillFitScore: number; // 0 - 40
  proximityScore: number; // 0 - 25
  distanceKm: number;
  availabilityScore: number; // 0 - 20
  trustReputationScore: number; // 0 - 15
  reasons: string[];
  isTwoWayBarter: boolean;
}
