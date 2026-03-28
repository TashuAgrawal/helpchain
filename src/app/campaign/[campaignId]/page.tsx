// src/app/campaign/[id]/page.tsx
"use client"
import React, { useEffect } from 'react';

import { Calendar, DollarSign, Users, FileText, ArrowDown, ArrowUp } from "lucide-react";
import { format, parseISO } from 'date-fns';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { useParams } from "next/navigation";


interface Campaign {
  id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  status: string;
  startDate: string;
  endDate?: string;
  donors: number;
  lastUpdate: string;
  image?: string;
}

interface Transaction {
  id: string;
  amount: number;
  donorName: string;
  donorEmail: string;
  date: string;
  message?: string;
  type: 'donation' | 'refund';
}

const CampaignDetailPage = () => {

    const { campaignId } = useParams() as { campaignId: string };
  const [campaign, setCampaign] = React.useState<Campaign | null>(null);
  const [transactions] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        setLoading(true);

        // Fetch campaign details
        const campaignRes = await fetch(`/api/campaigns/${campaignId}`);
        if (!campaignRes.ok) throw new Error('Campaign not found');
        
        const campaignData = await campaignRes.json();
        setCampaign(campaignData);

        // Fetch transactions for this campaign
        const transactionsRes = await fetch(`/api/campaigns/${campaignId}/transactions`);
        console.log(transactionsRes);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load campaign');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignData();
  }, [campaignId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 p-8">
        <div className="max-w-6xl mx-auto flex items-center justify-center h-64">
          <div className="text-lg text-gray-600 dark:text-gray-400 animate-pulse">
            Loading campaign details...
          </div>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 p-8">
        <div className="max-w-4xl mx-auto text-center py-24">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Campaign Not Found</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">{error}</p>
          <Button
            onClick={() => window.history.back()}
            className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-3 rounded-xl"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const progress = (campaign.raised / campaign.goal) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Campaign Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-6">
            {campaign.title}
          </h1>
          <div className="max-w-2xl mx-auto">
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
              {campaign.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Campaign Card */}
          <div className="lg:col-span-2">
            <Card className="rounded-2xl border-none shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <Badge
                      className={
                        campaign.status === "Active"
                          ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      }
                    >
                      {campaign.status}
                    </Badge>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Started {format(parseISO(campaign.startDate), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{campaign.donors} supporters</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-baseline text-3xl font-bold text-gray-900 dark:text-white">
                    <span>${campaign.raised.toLocaleString()}</span>
                    <span className="text-xl font-normal text-gray-500">/ ${campaign.goal.toLocaleString()}</span>
                  </div>
                  <Progress value={progress} className="h-3 rounded-full" />
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {progress.toFixed(1)}% of goal reached
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl">
                  <div>
                    <DollarSign className="w-8 h-8 mx-auto text-green-600 mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{campaign.donors}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Donors</div>
                  </div>
                  <div>
                    <FileText className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {transactions.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Transactions</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card className="rounded-2xl border-none shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Next Milestone</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  ${((Math.floor(progress / 25) + 1) * 25).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">25% increments</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Transactions Table */}
        <Card className="rounded-2xl border-none shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Recent Transactions
              <Badge variant="outline" className="ml-auto">
                {transactions.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No transactions yet</p>
                <p className="text-sm mt-1">Be this the first to support campaign!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-4 px-2 font-semibold text-gray-900 dark:text-white text-sm">Donor</th>
                      <th className="text-left py-4 px-2 font-semibold text-gray-900 dark:text-white text-sm">Amount</th>
                      <th className="text-left py-4 px-2 font-semibold text-gray-900 dark:text-white text-sm">Date</th>
                      <th className="text-left py-4 px-2 font-semibold text-gray-900 dark:text-white text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.slice(0, 10).map((transaction) => (
                      <tr key={transaction.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="py-4 px-2">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {transaction.donorName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {transaction.donorEmail}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-xl font-bold ${
                              transaction.type === 'donation' 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              {transaction.type === 'donation' ? <ArrowDown className="w-5 h-5" /> : <ArrowUp className="w-5 h-5" />}
                            </span>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                              ${transaction.amount.toLocaleString()}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-2 text-sm text-gray-600 dark:text-gray-400">
                          {format(parseISO(transaction.date), 'MMM dd, yyyy')}
                        </td>
                        <td className="py-4 px-2">
                          <Badge 
                            className={`${
                              transaction.type === 'donation'
                                ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200'
                                : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'
                            }`}
                          >
                            {transaction.type === 'donation' ? 'Donation' : 'Refund'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CampaignDetailPage;
