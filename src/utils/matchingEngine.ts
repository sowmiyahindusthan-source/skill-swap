import { UserProfile, MatchScoreBreakdown, LocationCoordinates } from '../types/exchange';

/**
 * Calculates geographic distance in kilometers using the Haversine formula
 */
export function calculateDistanceKm(coord1: LocationCoordinates, coord2: LocationCoordinates): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Intelligent Matching Engine
 * Computes multi-factor compatibility between a seeker request/profile and a potential provider.
 * Weights:
 * - Skill Relevance: 40%
 * - Geographic Proximity: 25%
 * - Schedule Availability: 20%
 * - Trust & Reputation: 15%
 */
export function computeMatchScore(
  seeker: UserProfile,
  provider: UserProfile,
  targetSkillQuery: string,
  preferredTimeSlot?: string,
  preferredMode: 'In-Person' | 'Remote' | 'Flexible' = 'Flexible'
): MatchScoreBreakdown {
  const reasons: string[] = [];

  // 1. Skill Fit Score (0-40)
  let skillFit = 0;
  const normalizedQuery = targetSkillQuery.toLowerCase().trim();

  // Find best matching skill in provider's offered skills
  const matchedSkill = provider.skillsOffered.find(s => 
    s.name.toLowerCase().includes(normalizedQuery) ||
    normalizedQuery.includes(s.name.toLowerCase()) ||
    s.category.toLowerCase().includes(normalizedQuery)
  );

  if (matchedSkill) {
    if (matchedSkill.name.toLowerCase().includes(normalizedQuery) || normalizedQuery.includes(matchedSkill.name.toLowerCase())) {
      skillFit += 32;
      reasons.push(`Direct skill mastery in ${matchedSkill.name} (${matchedSkill.level} tier)`);
    } else {
      skillFit += 22;
      reasons.push(`Category match in ${matchedSkill.category}`);
    }

    if (matchedSkill.verificationStatus === 'verified') {
      skillFit += 8;
      reasons.push('Verified skill credential with portfolio evidence');
    } else if (matchedSkill.verificationStatus === 'community_certified') {
      skillFit += 6;
      reasons.push('Community certified skill endorsement');
    } else if (matchedSkill.verificationStatus === 'peer_endorsed') {
      skillFit += 4;
      reasons.push(`Peer-endorsed with ${matchedSkill.endorsementsCount} recommendations`);
    }
  } else {
    // Partial fuzzy match across all skills
    const partial = provider.skillsOffered.some(s => 
      s.name.toLowerCase().split(' ').some(w => w.length > 3 && normalizedQuery.includes(w))
    );
    if (partial) {
      skillFit = 16;
      reasons.push('Relevant adjacent skill expertise');
    } else {
      skillFit = 8;
    }
  }
  skillFit = Math.min(40, skillFit);

  // 2. Proximity Score (0-25)
  const distKm = calculateDistanceKm(seeker.coordinates, provider.coordinates);
  let proximityScore = 0;

  if (preferredMode === 'Remote' || provider.modePreference === 'Remote') {
    proximityScore = 25;
    reasons.push('Remote mode compatible with zero commute');
  } else {
    if (distKm <= 1.0) {
      proximityScore = 25;
      reasons.push(`Under 1 km away (${distKm} km) · Immediate walkable proximity`);
    } else if (distKm <= 2.5) {
      proximityScore = 22;
      reasons.push(`${distKm} km away · Short campus walk or bike ride`);
    } else if (distKm <= 5.0) {
      proximityScore = 18;
      reasons.push(`${distKm} km away · Within local campus radius`);
    } else if (distKm <= 10.0) {
      proximityScore = 12;
      reasons.push(`${distKm} km away · Local transit accessible`);
    } else {
      proximityScore = 7;
      reasons.push(`${distKm} km away · Greater metropolitan zone`);
    }
  }

  // 3. Availability Overlap (0-20)
  let availabilityScore = 0;
  // Count overlapping slots between seeker and provider
  let overlappingSlotsCount = 0;
  seeker.availability.forEach(sDay => {
    const pDay = provider.availability.find(p => p.day === sDay.day);
    if (pDay) {
      const commonSlots = sDay.slots.filter(slot => pDay.slots.includes(slot));
      overlappingSlotsCount += commonSlots.length;
    }
  });

  if (overlappingSlotsCount >= 3) {
    availabilityScore = 20;
    reasons.push(`Multiple schedule overlaps (${overlappingSlotsCount} shared weekly time slots)`);
  } else if (overlappingSlotsCount >= 1) {
    availabilityScore = 15;
    reasons.push('Compatible overlapping schedule this week');
  } else {
    // Check general flexible weekend/evening presence
    const hasWeekend = provider.availability.some(d => d.day === 'Sat' || d.day === 'Sun');
    availabilityScore = hasWeekend ? 10 : 8;
    reasons.push('Flexible scheduling by appointment');
  }

  // 4. Trust & Reputation (0-15)
  let trustScore = 0;
  // Rating component (up to 8 pts)
  trustScore += Math.round((provider.reputationScore / 5.0) * 8);

  // ID verification (up to 4 pts)
  if (provider.isIdVerified) {
    trustScore += 4;
    reasons.push('Verified Student/Community Identity check passed');
  }

  // Response rate (up to 3 pts)
  if (provider.responseRatePct >= 95) {
    trustScore += 3;
    reasons.push(`High responsiveness (${provider.responseRatePct}% response rate)`);
  } else if (provider.responseRatePct >= 85) {
    trustScore += 2;
  }
  trustScore = Math.min(15, trustScore);

  // 5. Two-Way Barter Reciprocal Detection
  // Check if provider wants any skill offered by the seeker
  const isTwoWayBarter = seeker.skillsOffered.some(offered => 
    provider.skillsWanted.some(wanted => 
      wanted.toLowerCase().includes(offered.name.toLowerCase()) ||
      offered.name.toLowerCase().includes(wanted.toLowerCase())
    )
  );

  if (isTwoWayBarter) {
    reasons.unshift('Two-way barter synergy: Provider is looking for a skill you teach!');
  }

  const overallScore = Math.min(100, Math.round(skillFit + proximityScore + availabilityScore + trustScore));

  return {
    overallScore,
    skillFitScore: Math.round(skillFit),
    proximityScore: Math.round(proximityScore),
    distanceKm: distKm,
    availabilityScore: Math.round(availabilityScore),
    trustReputationScore: Math.round(trustScore),
    reasons,
    isTwoWayBarter
  };
}
