"use client";
import React, { useEffect, useState } from "react";
import {
  Calendar,
  DollarSign,
  Users,
  FileText,
  TrendingUp,
  ChevronRight,
  Clock,
  ArrowLeft,
  Download,
  Share2,
  ExternalLink,
  MoreVertical
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Progress } from "@/app/components/ui/progress";
import { useParams, useRouter } from "next/navigation";

// --- Interfaces ---

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
}

interface Transaction {
  id: string;
  amount: number;
  donorName: string;
  donorEmail: string;
  date: string;
  type: "donation" | "refund";
}

// --- Main Page Component ---

const CampaignDetailPage = () => {
  const { campaignId } = useParams() as { campaignId: string };
  const router = useRouter();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!campaignId) return;

    const fetchCampaignData = async () => {
      try {
        setLoading(true);

        // Fetch Campaign
        const campaignRes = await fetch(`/api/campaigns/${campaignId}`);
        if (!campaignRes.ok) throw new Error("Campaign not found");
        const campaignData = await campaignRes.json();
        const cleanCampaign = campaignData._doc || campaignData;

        setCampaign({
          id: cleanCampaign._id || cleanCampaign.id,
          title: cleanCampaign.title,
          description: cleanCampaign.description,
          goal: cleanCampaign.goal,
          raised: cleanCampaign.raised,
          status: cleanCampaign.status,
          startDate: cleanCampaign.startDate,
          endDate: cleanCampaign.endDate,
          donors: cleanCampaign.donors,
          lastUpdate: cleanCampaign.lastUpdate,
        });

        // Fetch Transactions
        const transactionsRes = await fetch(`/api/campaigns/${campaignId}/transactions`);
        if (transactionsRes.ok) {
          const data = await transactionsRes.json();
          const txnArray = Array.isArray(data) ? data : data.transactions || [];
          const formatted = txnArray.map((t: any) => ({
            id: t._id || t.id,
            amount: t.amount,
            donorName: t.donorName,
            donorEmail: t.donorEmail,
            date: t.date,
            type: t.type,
          }));
          setTransactions(formatted);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load campaign");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignData();
  }, [campaignId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 animate-pulse font-medium">Crunching analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] dark:bg-[#0a0a0a] px-4">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">!</div>
          <h1 className="text-2xl font-bold mb-2">Campaign Not Found</h1>
          <p className="text-slate-500 mb-6">{error || "The campaign you're looking for doesn't exist or has been moved."}</p>
          <Button className="w-full rounded-xl" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  const progress = (campaign.raised / campaign.goal) * 100;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-100 pb-20">
      
      {/* 🚀 Header Section */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-12 pb-8 px-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <button 
                onClick={() => router.back()}
                className="flex items-center text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest"
              >
                <ArrowLeft className="w-3 h-3 mr-1" /> Dashboard
              </button>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {campaign.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <div className={`w-2 h-2 rounded-full ${campaign.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
                  {campaign.status}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />{(campaign.lastUpdate)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="rounded-xl border-slate-200 dark:border-slate-700">
                <Share2 className="w-4 h-4 mr-2" /> Share
              </Button>
              <Button size="sm" className="rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 hover:opacity-90">
                Manage Campaign
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        {/* 📊 High-Level Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard 
            title="Total Raised" 
            value={`₹${campaign.raised.toLocaleString()}`} 
            icon={<DollarSign className="text-emerald-500" />} 
            trend="+12% from last week"
            trendType="up"
          />
          <MetricCard 
            title="Supporters" 
            value={campaign.donors.toLocaleString()} 
            icon={<Users className="text-blue-500" />} 
          />
          <MetricCard 
            title="Avg. Donation" 
            value={`₹${campaign.donors > 0 ? (campaign.raised / campaign.donors).toFixed(0) : 0}`} 
            icon={<TrendingUp className="text-violet-500" />} 
          />
          <MetricCard 
            title="Days Active" 
            value="24" 
            icon={<Calendar className="text-orange-500" />} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Analytics Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Funding Progress Card */}
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden rounded-3xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-400">Funding Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <span className="text-4xl font-black">₹{campaign.raised.toLocaleString()}</span>
                      <span className="text-slate-400 ml-2 font-medium">/ ₹{campaign.goal.toLocaleString()}</span>
                    </div>
                    <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-none px-3 py-1 text-sm font-bold">
                      {progress.toFixed(1)}% Goal
                    </Badge>
                  </div>
                  <Progress value={progress} className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden" />
                </div>
                
                <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between text-sm">
                  <p className="text-slate-500 italic">“Great job! You are in the top 10% of similar campaigns this month.”</p>
                  <Button variant="ghost" size="sm" className="text-blue-600 font-bold hover:bg-blue-50">Details</Button>
                </div>
              </CardContent>
            </Card>

            {/* Transactions Activity Card */}
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 dark:border-slate-800 py-6">
                <CardTitle className="text-lg font-bold">Recent Transactions</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg"><Download className="w-3 h-3 mr-1" /> Export</Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {transactions.length === 0 ? (
                  <div className="py-20 text-center">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="text-slate-300 w-8 h-8" />
                    </div>
                    <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">No records found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                        <tr className="text-[11px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-800">
                          <th className="px-6 py-4">Contributor</th>
                          <th className="px-6 py-4">Amount</th>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                        {transactions.map((t) => (
                          <tr key={t.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors">{t.donorName}</div>
                              <div className="text-xs text-slate-400">{t.donorEmail}</div>
                            </td>
                            <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                              ₹{t.amount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500">
                              {format(parseISO(t.date), "dd MMM yyyy")}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
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

          {/* Sidebar Area */}
          <div className="space-y-6">
            
            {/* Milestone Card */}
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-950 text-white border-none shadow-xl rounded-3xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[60px] rounded-full -mr-16 -mt-16"></div>
              <CardContent className="p-8 relative z-10">
                <h3 className="text-blue-400 text-xs font-black uppercase tracking-[0.2em] mb-4">Upcoming Milestone</h3>
                <div className="text-5xl font-black mb-2 tracking-tighter">
                  {((Math.floor(progress / 25) + 1) * 25)}%
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">You are currently on track to hit your next funding milestone by the end of the month.</p>
                <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-2xl py-6">
                  Set New Goal <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>

            {/* Support/Resource Card */}
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl p-6">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-blue-600" /> Resources
              </h4>
              <div className="space-y-3">
                <ResourceItem label="Download Marketing Kit" />
                <ResourceItem label="Donor Communication Templates" />
                <ResourceItem label="Tax Compliance Guide" />
              </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-components (Stateless) ---

const MetricCard = ({ title, value, icon, trend, trendType }: any) => (
  <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl">{icon}</div>
        {trend && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${trendType === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
        <h3 className="text-2xl font-black mt-1 tracking-tight">{value}</h3>
      </div>
    </CardContent>
  </Card>
);

const ResourceItem = ({ label }: { label: string }) => (
  <button className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm font-medium group">
    <span className="text-slate-600 dark:text-slate-400 group-hover:text-blue-600 transition-colors">{label}</span>
    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600" />
  </button>
);

export default CampaignDetailPage;