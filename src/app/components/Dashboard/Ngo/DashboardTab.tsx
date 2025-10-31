// src/app/components/ngo-dashboard/DashboardTab.tsx

import React from 'react';
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
  setNewCampaignDescription: (desc: string) => void;
  handleCreateUpdate: () => void;
  handleCreateCampaign: () => void;
  handleSendThankYou: () => void;
  handleSendEmailCampaign: () => void;
  handleUploadFinancialReport: () => void;
  handleAddTeamMember: () => void;
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
  setActiveTab
}: DashboardTabProps) {

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-white mb-2">NGO Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Track campaigns, donations & post transparency updates</p>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-xl border-none shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 transition-colors duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 dark:text-blue-300 text-sm">Total Raised</p>
                <h3 className="text-blue-900 dark:text-blue-100 mt-1">${totalRaised.toLocaleString()}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-none shadow-sm bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30 transition-colors duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-700 dark:text-teal-300 text-sm">Active Campaigns</p>
                <h3 className="text-teal-900 dark:text-teal-100 mt-1">{activeCampaignsCount}</h3>
              </div>
              <div className="w-12 h-12 bg-teal-600 dark:bg-teal-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-none shadow-sm bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 transition-colors duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-700 dark:text-purple-300 text-sm">Total Donors</p>
                <h3 className="text-purple-900 dark:text-purple-100 mt-1">{totalDonors}</h3>
              </div>
              <div className="w-12 h-12 bg-purple-600 dark:bg-purple-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-none shadow-sm bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 transition-colors duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-700 dark:text-orange-300 text-sm">Avg Rating</p>
                <h3 className="text-orange-900 dark:text-orange-100 mt-1">{averageRating.toFixed(1)}/5</h3>
              </div>
              <div className="w-12 h-12 bg-orange-600 dark:bg-orange-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="rounded-xl border-none shadow-sm bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-white">Quick Actions</CardTitle>
          <CardDescription className="dark:text-gray-400">Frequently used actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 p-4 rounded-lg dark:border-gray-600 dark:hover:bg-gray-700"
              onClick={() => setIsThankYouDialogOpen(true)}
            >
              <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="text-sm">Thank Donors</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 p-4 rounded-lg dark:border-gray-600 dark:hover:bg-gray-700"
              onClick={() => setIsEmailCampaignDialogOpen(true)}
            >
              <Send className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              <span className="text-sm">Email Campaign</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 p-4 rounded-lg dark:border-gray-600 dark:hover:bg-gray-700"
              onClick={() => setIsFinancialReportDialogOpen(true)}
            >
              <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <span className="text-sm">Upload Report</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 p-4 rounded-lg dark:border-gray-600 dark:hover:bg-gray-700"
              onClick={() => setIsTeamMemberDialogOpen(true)}
            >
              <UserPlus className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              <span className="text-sm">Add Team Member</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-xl border-none shadow-sm bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">Recent Donations</CardTitle>
            <CardDescription className="dark:text-gray-400">Latest contributions from donors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDonations.slice(0, 5).map((donation) => (
                <div key={donation.id} className="flex items-center justify-between pb-3 border-b dark:border-gray-700 last:border-b-0">
                  <div className="flex-1">
                    <h4 className="text-gray-900 dark:text-white">{donation.donor}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{donation.date}</p>
                    {donation.message && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 italic mt-1">"{donation.message}"</p>
                    )}
                  </div>
                  <div className="text-right">
                    <h4 className="text-teal-600 dark:text-teal-400">${donation.amount}</h4>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-none shadow-sm bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">Pending Responses</CardTitle>
            <CardDescription className="dark:text-gray-400">Community problems and donor feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">Community Problems</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Awaiting response</p>
                  </div>
                </div>
                <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">
                  {communityProblems.filter(p => p.relevantToUs && !p.responded).length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">Donor Feedback</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Needs reply</p>
                  </div>
                </div>
                <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                  {donorFeedback.filter(f => !f.replied).length}
                </Badge>
              </div>
              <Button 
                variant="outline" 
                className="w-full rounded-lg dark:border-gray-600 dark:hover:bg-gray-700"
                onClick={() => setActiveTab("community")}
              >
                View All
              </Button>
            </div>
          </CardContent>
        </Card>
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="member-role" className="dark:text-gray-300">Role</Label>
              <Select>
                <SelectTrigger className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="campaign">Campaign Manager</SelectItem>
                  <SelectItem value="finance">Finance Officer</SelectItem>
                  <SelectItem value="content">Content Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg"
              onClick={handleAddTeamMember}
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