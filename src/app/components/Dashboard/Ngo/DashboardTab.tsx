// src/app/components/ngo-dashboard/DashboardTab.tsx
"use client"
import React, { useState } from 'react';
import { Plus, TrendingUp, DollarSign, Users, Upload, FileText, MessageCircle, AlertCircle, Mail, Send, UserPlus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button"; 
import { Badge } from "../../ui/badge"; 
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog"; 
import { Input } from "../../ui/input"; 
import { Label } from "../../ui/label"; 
import { Textarea } from "../../ui/textarea"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"; 
import { CommunityProblem, DonorFeedback, Donation } from './types';


interface DashboardTabProps {
  totalRaised: number;
  activeCampaignsCount: number;
  totalDonors: number;
  averageRating: number;
  recentDonations: Donation[];
  communityProblems: CommunityProblem[];
  donorFeedback: DonorFeedback[];
  isNewUpdateOpen: boolean;
  setIsNewUpdateOpen: (open: boolean) => void;
  isNewCampaignOpen: boolean;
  setIsNewCampaignOpen: (open: boolean) => void;
  isThankYouDialogOpen: boolean;
  setIsThankYouDialogOpen: (open: boolean) => void;
  isEmailCampaignDialogOpen: boolean;
  setIsEmailCampaignDialogOpen: (open: boolean) => void;
  isFinancialReportDialogOpen: boolean;
  setIsFinancialReportDialogOpen: (open: boolean) => void;
  isTeamMemberDialogOpen: boolean;
  setIsTeamMemberDialogOpen: (open: boolean) => void;
  newUpdateTitle: string;
  setNewUpdateTitle: (title: string) => void;
  newUpdateDescription: string;
  setNewUpdateDescription: (desc: string) => void;
  newCampaignTitle: string;
  setNewCampaignTitle: (title: string) => void;
  newCampaignGoal: string;
  setNewCampaignGoal: (goal: string) => void;
  newCampaignDescription: string;
  newCampaignPincode: string;
  setNewCampaignPincode: (pincode: string) => void;
  setNewCampaignDescription: (desc: string) => void;
  handleCreateUpdate: () => void;
  handleCreateCampaign: () => void;
  handleSendThankYou: () => void;
  handleSendEmailCampaign: () => void;
  handleUploadFinancialReport: () => void;
  handleAddTeamMember: (email:string , role:string ) => void;
  setActiveTab: (tab: string) => void;
}

export function DashboardTab({
  totalRaised, activeCampaignsCount, totalDonors, averageRating,
  recentDonations, communityProblems, donorFeedback,
  isNewUpdateOpen, setIsNewUpdateOpen,
  isNewCampaignOpen, setIsNewCampaignOpen,
  isThankYouDialogOpen, setIsThankYouDialogOpen,
  isEmailCampaignDialogOpen, setIsEmailCampaignDialogOpen,
  isFinancialReportDialogOpen, setIsFinancialReportDialogOpen,
  isTeamMemberDialogOpen, setIsTeamMemberDialogOpen,
  newUpdateTitle, setNewUpdateTitle, newUpdateDescription, setNewUpdateDescription,
  newCampaignTitle, setNewCampaignTitle, newCampaignGoal, setNewCampaignGoal, newCampaignDescription, setNewCampaignDescription,
  handleCreateUpdate, handleCreateCampaign,
  handleSendThankYou, handleSendEmailCampaign, handleUploadFinancialReport, handleAddTeamMember,
  setActiveTab , newCampaignPincode, setNewCampaignPincode
}: DashboardTabProps) {


  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState('');

  const onInvitationClick = () => {
    if (!memberEmail || !memberRole) {
      alert("Please fill in both email and role");
      return;
    }
    
    // Calling the handler with the local state data
    handleAddTeamMember(memberEmail, memberRole);
    
    // Optional: Clear fields after sending
    setMemberEmail('');
    setMemberRole('');
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">NGO Dashboard</h1>
          <p className="text-gray-400 text-sm">Track campaigns, donations &amp; transparency updates</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isNewUpdateOpen} onOpenChange={setIsNewUpdateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700 rounded-lg gap-2">
                <Upload className="w-4 h-4" />
                Post Update
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-xl dark:bg-gray-800 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="dark:text-white">Post Impact/Transparency Update</DialogTitle>
                <DialogDescription className="dark:text-gray-400">Show donors exactly how their money was used</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="update-title" className="dark:text-gray-300">Update Title</Label>
                  <Input 
                    id="update-title" 
                    placeholder="e.g., New well completed" 
                    className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={newUpdateTitle}
                    onChange={(e) => setNewUpdateTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="update-description" className="dark:text-gray-300">Description</Label>
                  <Textarea
                    id="update-description"
                    placeholder="Describe the impact, attach receipts or photos..."
                    rows={4}
                    className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={newUpdateDescription}
                    onChange={(e) => setNewUpdateDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="update-image" className="dark:text-gray-300">Upload Image</Label>
                  <Input 
                    id="update-image" 
                    type="file" 
                    accept="image/*" 
                    className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="update-file" className="dark:text-gray-300">Upload Receipt/PDF</Label>
                  <Input 
                    id="update-file" 
                    type="file" 
                    accept=".pdf,.jpg,.png" 
                    className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                  />
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg"
                  onClick={handleCreateUpdate}
                >
                  Post Update
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isNewCampaignOpen} onOpenChange={setIsNewCampaignOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg gap-2">
                <Plus className="w-4 h-4" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-xl dark:bg-gray-800 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="dark:text-white">Create New Campaign</DialogTitle>
                <DialogDescription className="dark:text-gray-400">
                  Start a new fundraising campaign for your cause
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-title" className="dark:text-gray-300">Campaign Title</Label>
                  <Input 
                    id="campaign-title" 
                    placeholder="e.g., Build 10 Schools" 
                    className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={newCampaignTitle}
                    onChange={(e) => setNewCampaignTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-goal" className="dark:text-gray-300">Funding Goal ($)</Label>
                  <Input 
                    id="campaign-goal" 
                    type="number" 
                    placeholder="50000" 
                    className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={newCampaignGoal}
                    onChange={(e) => setNewCampaignGoal(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="campaign-description" className="dark:text-gray-300">Description</Label>
                  <Textarea
                    id="campaign-description"
                    placeholder="Describe your campaign objectives..."
                    rows={4}
                    className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={newCampaignDescription}
                    onChange={(e) => setNewCampaignDescription(e.target.value)}
                  />
                </div>

                 <div className="space-y-2">
                  <Label htmlFor="campaign-pincode" className="dark:text-gray-300">Pincode</Label>
                  <Input
                    id="campaign-pincode"
                    placeholder="Enter pincode"
                    className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={newCampaignPincode}
                    onChange={(e) => setNewCampaignPincode(e.target.value)}
                  />
                </div>

                
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg"
                  onClick={handleCreateCampaign}
                >
                  Create Campaign
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {[
          { label: 'Total Raised',       value: `$${totalRaised.toLocaleString()}`,   icon: DollarSign, g: 'from-indigo-500/20 to-indigo-600/10', ib: 'bg-indigo-500/20', ic: 'text-indigo-400', vc: 'text-indigo-300', b: 'border-indigo-500/20' },
          { label: 'Active Campaigns',   value: activeCampaignsCount,                  icon: TrendingUp,  g: 'from-emerald-500/20 to-emerald-600/10', ib: 'bg-emerald-500/20', ic: 'text-emerald-400', vc: 'text-emerald-300', b: 'border-emerald-500/20' },
          { label: 'Total Donors',       value: totalDonors,                            icon: Users,       g: 'from-violet-500/20 to-violet-600/10', ib: 'bg-violet-500/20', ic: 'text-violet-400', vc: 'text-violet-300', b: 'border-violet-500/20' },
          { label: 'Avg Rating',         value: `${averageRating.toFixed(1)}/5`,        icon: TrendingUp,  g: 'from-amber-500/20 to-amber-600/10', ib: 'bg-amber-500/20', ic: 'text-amber-400', vc: 'text-amber-300', b: 'border-amber-500/20' },
        ].map((s) => (
          <div key={s.label} className={`stagger-card relative overflow-hidden rounded-2xl bg-gradient-to-br ${s.g} border ${s.b} p-6 group hover:-translate-y-1 hover:shadow-lg transition-all duration-300`}>
            <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full ${s.ib} blur-2xl opacity-50 group-hover:opacity-80 transition-opacity`} />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-1">{s.label}</p>
                <p className={`text-3xl font-bold ${s.vc} tabular-nums`}>{s.value}</p>
              </div>
              <div className={`w-11 h-11 ${s.ib} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <s.icon className={`w-5 h-5 ${s.ic}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl bg-[#1c2233] border border-white/[0.06] p-6">
        <h3 className="text-white font-semibold mb-1">Quick Actions</h3>
        <p className="text-gray-400 text-sm mb-4">Frequently used actions</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Thank Donors',   icon: Mail,     color: 'text-indigo-400', bg: 'bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/20', fn: () => setIsThankYouDialogOpen(true) },
            { label: 'Email Campaign', icon: Send,     color: 'text-emerald-400', bg: 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20', fn: () => setIsEmailCampaignDialogOpen(true) },
            { label: 'Upload Report',  icon: FileText, color: 'text-violet-400',  bg: 'bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/20',  fn: () => setIsFinancialReportDialogOpen(true) },
            { label: 'Add Member',     icon: UserPlus, color: 'text-amber-400',   bg: 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20',   fn: () => setIsTeamMemberDialogOpen(true) },
          ].map((a) => (
            <button key={a.label} onClick={a.fn} className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border transition-all duration-200 ${a.bg}`}>
              <a.icon className={`w-5 h-5 ${a.color}`} />
              <span className="text-xs font-medium text-gray-300">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl bg-[#1c2233] border border-white/[0.06] p-6">
          <h3 className="text-white font-semibold mb-1">Recent Donations</h3>
          <p className="text-gray-400 text-sm mb-4">Latest contributions from donors</p>
          <div className="space-y-3">
            {recentDonations.slice(0, 5).map((donation) => (
              <div key={donation.id} className="flex items-center justify-between py-2.5 border-b border-white/[0.05] last:border-b-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{donation.donor}</p>
                  <p className="text-xs text-gray-500">{donation.date}</p>
                  {donation.message && <p className="text-xs text-gray-400 italic mt-0.5 truncate">&ldquo;{donation.message}&rdquo;</p>}
                </div>
                <span className="text-emerald-400 font-semibold text-sm ml-4 flex-shrink-0">${donation.amount}</span>
              </div>
            ))}
            {recentDonations.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No donations yet</p>}
          </div>
        </div>

        <div className="rounded-2xl bg-[#1c2233] border border-white/[0.06] p-6">
          <h3 className="text-white font-semibold mb-1">Pending Responses</h3>
          <p className="text-gray-400 text-sm mb-4">Community problems and donor feedback</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/[0.07] border border-amber-500/20">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="text-sm text-white font-medium">Community Problems</p>
                  <p className="text-xs text-gray-400">Awaiting response</p>
                </div>
              </div>
              <span className="badge-warning">{communityProblems.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-500/[0.07] border border-indigo-500/20">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-indigo-400" />
                <div>
                  <p className="text-sm text-white font-medium">Donor Feedback</p>
                  <p className="text-xs text-gray-400">Needs reply</p>
                </div>
              </div>
              <span className="badge-info">{donorFeedback.filter(f => !f.replied).length}</span>
            </div>
            <button
              className="w-full mt-2 py-2.5 rounded-xl text-sm font-medium text-gray-300 border border-white/[0.08] hover:bg-white/[0.04] transition-colors"
              onClick={() => setActiveTab('community')}
            >
              View All
            </button>
          </div>
        </div>
      </div>

      {/* Dialogs triggered from this tab */}
      <Dialog open={isThankYouDialogOpen} onOpenChange={setIsThankYouDialogOpen}>
        <DialogContent className="rounded-xl dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Send Thank You Message</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Show appreciation to your donors
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="thank-you-message" className="dark:text-gray-300">Message</Label>
              <Textarea
                id="thank-you-message"
                placeholder="Dear donors, thank you for your generous support..."
                rows={5}
                className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                defaultValue="Dear donors, thank you for your generous support! Your contributions are making a real difference in our community."
              />
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg"
              onClick={handleSendThankYou}
            >
              <Mail className="w-4 h-4 mr-2" />
              Send to All Recent Donors
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isTeamMemberDialogOpen} onOpenChange={setIsTeamMemberDialogOpen}>
        <DialogContent className="rounded-xl dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Add Team Member</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Invite someone to join your NGO team
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="member-name" className="dark:text-gray-300">Name</Label>
              <Input 
                id="member-name" 
                placeholder="John Doe" 
                className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="member-email" className="dark:text-gray-300">Email</Label>
              <Input 
                id="member-email" 
                type="email"
                placeholder="john@example.com" 
                className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="member-role" className="dark:text-gray-300">Role</Label>
              <Select onValueChange={(value) => setMemberRole(value)} value={memberRole}>
                <SelectTrigger className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="administrator">Administrator</SelectItem>
                  <SelectItem value="campaign">Campaign Manager</SelectItem>
                  <SelectItem value="finance">Finance Officer</SelectItem>
                  <SelectItem value="content">Content Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg"
              onClick={onInvitationClick}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Send Invitation
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEmailCampaignDialogOpen} onOpenChange={setIsEmailCampaignDialogOpen}>
        <DialogContent className="rounded-xl dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Send Email Campaign</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Send newsletter to all donors
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="email-subject" className="dark:text-gray-300">Subject</Label>
              <Input 
                id="email-subject" 
                placeholder="Monthly Update - October 2025" 
                className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-body" className="dark:text-gray-300">Email Content</Label>
              <Textarea
                id="email-body"
                placeholder="Dear supporters,..."
                rows={6}
                className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg"
              onClick={handleSendEmailCampaign}
            >
              <Send className="w-4 h-4 mr-2" />
              Send to All Donors
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isFinancialReportDialogOpen} onOpenChange={setIsFinancialReportDialogOpen}>
        <DialogContent className="rounded-xl dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Upload Financial Report</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Share your financial transparency report
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="report-title" className="dark:text-gray-300">Report Title</Label>
              <Input 
                id="report-title" 
                placeholder="Q3 2025 Financial Report" 
                className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="report-file" className="dark:text-gray-300">Upload PDF Report</Label>
              <Input 
                id="report-file" 
                type="file"
                accept=".pdf"
                className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="report-summary" className="dark:text-gray-300">Summary</Label>
              <Textarea
                id="report-summary"
                placeholder="Brief summary of the report..."
                rows={3}
                className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg"
              onClick={handleUploadFinancialReport}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}