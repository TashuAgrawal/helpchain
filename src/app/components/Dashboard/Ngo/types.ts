// src/app/components/ngo-dashboard/types.ts

export interface Campaign {
  id: string;
  title: string;
  goal: number;
  raised: number;
  donors: number;
  status: string;
  lastUpdate: string;
  description?: string;
  startDate: string;
  endDate?: string;
  ngoId:string;
}

export interface Donation {
  id: string;
  donor: string;
  amount: number;
  date: string;
  message?: string;
  anonymous: boolean;
}

export interface ImpactUpdate {
  id: number;
  title: string;
  description: string;
  date: string;
  image?: string;
  file?: string;
  views: number;
  likes: number;
}

export interface DonorFeedback {
  id: number;
  donor: string;
  comment: string;
  date: string;
  replied?: boolean;
  rating: number;
}

export interface CommunityProblem {
  id: string;
  title: string;
  description: string;
  category: string;
  postedBy: string;
  date: string;
  location: string;
  responses: number;
  upvotes: number;
  userVoted?: boolean;
}

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  joinedDate: string;
  status: string;
}