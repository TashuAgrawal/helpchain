// src/app/components/user-dashboard/tabs/ImpactTab.tsx
import React, { JSX } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../ui/card";
import { Button } from "../../../ui/button";
// import { DialogTrigger } from "../../../ui/dialog"; // <-- REMOVED THIS LINE
import { toast } from "sonner";
import { Target, DollarSign, Users, Heart, Award, TrendingUp, Gift, Share2 } from "lucide-react";
import { MyDonation, UserBadge } from '../types';

interface ImpactTabProps {
  totalDonated: number;
  myDonations: MyDonation[];
  userBadges: UserBadge[]; // This is the full list of available badges
  earnedBadges: UserBadge[]; // This is the filtered list of earned badges
  setIsDonationGoalDialogOpen: (open: boolean) => void;
}

export function ImpactTab({
  totalDonated, myDonations,
  userBadges, earnedBadges,
  setIsDonationGoalDialogOpen
}: ImpactTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-white mb-2">My Impact</h1>
          <p className="text-gray-600 dark:text-gray-300">See the difference you're making</p>
        </div>
        {/* --- FIX IS HERE --- */}
        {/* Removed the <DialogTrigger asChild> wrapper */}
        <Button 
          variant="outline" 
          className="rounded-lg dark:border-gray-600 dark:hover:bg-gray-700"
          onClick={() => setIsDonationGoalDialogOpen(true)}
        >
          <Target className="w-4 h-4 mr-2" />
          Set Donation Goal
        </Button>
        {/* --- END FIX --- */}
      </div>

      {/* Impact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-xl border-none shadow-sm bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Total Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-gray-900 dark:text-white mb-2">${totalDonated}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Across {myDonations.length} donations</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-none shadow-sm bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              Lives Impacted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-gray-900 dark:text-white mb-2">~500</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Estimated beneficiaries</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-none shadow-sm bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
              NGOs Helped
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-gray-900 dark:text-white mb-2">{new Set(myDonations.map(d => d.ngoName)).size}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Organizations supported</p>
          </CardContent>
        </Card>
      </div>

      {/* Badges Showcase */}
      <Card className="rounded-xl border-none shadow-sm bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
        <CardHeader>
          <CardTitle className="dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            Your Achievement Badges
          </CardTitle>
          <CardDescription className="dark:text-gray-400">
            Earned {earnedBadges.length} of {userBadges.length} badges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userBadges.map((badge) => {
              const earned = earnedBadges.some(b => b.id === badge.id);
              return (
                <div 
                  key={badge.id} 
                  className={`p-4 rounded-lg text-center transition-all ${
                    earned 
                      ? 'bg-white dark:bg-gray-800 shadow-md' 
                      : 'bg-gray-100 dark:bg-gray-700/50 opacity-50'
                  }`}
                >
                  <div className={`inline-flex p-3 rounded-full mb-2 ${
                    earned 
                      ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30' 
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`}>
                    <div className={earned ? badge.colorClass : 'text-gray-400 dark:text-gray-500'}>
                      {badge.icon}
                    </div>
                  </div>
                  <h4 className={`text-sm mb-1 ${earned ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                    {badge.name}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{badge.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Impact Timeline */}
      <Card className="rounded-xl border-none shadow-sm bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-white">Impact Timeline</CardTitle>
          <CardDescription className="dark:text-gray-400">See how your donations created real change</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myDonations.filter(d => d.impact).map((donation, idx) => (
              <div key={donation.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-teal-600 dark:bg-teal-400 rounded-full"></div>
                  {idx < myDonations.filter(d => d.impact).length - 1 && (
                    <div className="w-0.5 h-full bg-teal-300 dark:bg-teal-700 my-1"></div>
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-gray-900 dark:text-white">{donation.ngoName}</h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{donation.date}</span>
                    </div>
                    <p className="text-sm text-teal-600 dark:text-teal-400 mb-1">
                      <TrendingUp className="w-3 h-3 inline mr-1" />
                      {donation.impact}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Your ${donation.amount} donation</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Referral Program */}
      <Card className="rounded-xl border-none shadow-sm bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20">
        <CardHeader>
          <CardTitle className="dark:text-white flex items-center gap-2">
            <Gift className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Referral Program
          </CardTitle>
          <CardDescription className="dark:text-gray-400">
            Invite friends and earn rewards for both of you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <code className="text-sm text-gray-900 dark:text-white">JOHNDOE2025</code>
            </div>
            <Button 
              variant="outline" 
              className="rounded-lg dark:border-gray-600 dark:hover:bg-gray-700"
              onClick={() => {
                navigator.clipboard.writeText("JOHNDOE2025");
                toast.success("Referral code copied!");
              }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
            Friends referred: <span className="text-gray-900 dark:text-white">0</span> • 
            Bonus earned: <span className="text-teal-600 dark:text-teal-400">$0</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}