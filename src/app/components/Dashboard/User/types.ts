// src/app/components/user-dashboard/types.ts
import { JSX } from "react";

export interface UserBadge {
  id: number;
  name: string;
  icon: JSX.Element;
  threshold: number;
  description: string;
  colorClass: string;
}

export interface NGO {
  id: number;
  name: string;
  cause: string;
  description: string;
  goal: number;
  raised: number;
  image: string;
  lastUpdate: string;
  transparency: string;
  transparencyScore: number;
  donors: number;
  verified: boolean;
  isFavorite?: boolean;
}

export interface MyDonation {
  id: number;
  ngoName: string;
  amount: number;
  date: string;
  status: string;
  impact?: string;
  category: string;
}

export interface CommunityProblem {
  id: number;
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