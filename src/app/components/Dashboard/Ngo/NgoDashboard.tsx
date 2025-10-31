// src/app/components/ngo-dashboard/NGODashboard.tsx

import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { NgoNavbar } from "@/app/components/Navbar/NgoNavbar/NgoNavbar";
import { Campaign, Donation, ImpactUpdate, DonorFeedback, CommunityProblem, TeamMember } from "./types";
import { DashboardTab } from "./DashboardTab";
import { CampaignsTab } from "./CampaignsTab";
import { DonorsTab } from "./DonorsTab";
import { CommunityTab } from "./CommunityTab";
import { AnalyticsTab } from "./AnalyticsTab";
export function NGODashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);
  const [isEditCampaignOpen, setIsEditCampaignOpen] = useState(false);
  const [isNewUpdateOpen, setIsNewUpdateOpen] = useState(false);
  const [isEditUpdateOpen, setIsEditUpdateOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<number | null>(null);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [isFeedbackReplyOpen, setIsFeedbackReplyOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [selectedUpdate, setSelectedUpdate] = useState<ImpactUpdate | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<DonorFeedback | null>(null);
  const [isThankYouDialogOpen, setIsThankYouDialogOpen] = useState(false);
  const [isTeamMemberDialogOpen, setIsTeamMemberDialogOpen] = useState(false);
  const [isEmailCampaignDialogOpen, setIsEmailCampaignDialogOpen] = useState(false);
  const [isFinancialReportDialogOpen, setIsFinancialReportDialogOpen] = useState(false);
  const [newCampaignTitle, setNewCampaignTitle] = useState("");
  const [newCampaignGoal, setNewCampaignGoal] = useState("");
  const [newCampaignDescription, setNewCampaignDescription] = useState("");
  const [newUpdateTitle, setNewUpdateTitle] = useState("");
  const [newUpdateDescription, setNewUpdateDescription] = useState("");
  const [donationFilter, setDonationFilter] = useState("all");
  const [dateRange, setDateRange] = useState("month");
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 1,
      title: "Clean Water Initiative - Phase 2",
      goal: 50000,
      raised: 38500,
      donors: 124,
      status: "Active",
      lastUpdate: "2 wells completed using $15,000",
      description: "Building wells to provide clean drinking water to rural communities",
      startDate: "2025-09-01",
      endDate: "2025-12-31"
    },
    {
      id: 2,
      title: "Emergency Medical Supplies",
      goal: 25000,
      raised: 25000,
      donors: 89,
      status: "Completed",
      lastUpdate: "Medicines distributed to 300 families",
      description: "Emergency medical supplies for disaster-affected areas",
      startDate: "2025-08-01",
      endDate: "2025-10-15"
    },
  ]);

  const [recentDonations, setRecentDonations] = useState<Donation[]>([
    { id: 1, donor: "Anonymous", amount: 500, date: "2025-10-18", message: "Great work!", anonymous: true },
    { id: 2, donor: "John Smith", amount: 250, date: "2025-10-17", anonymous: false },
    { id: 3, donor: "Sarah Johnson", amount: 1000, date: "2025-10-16", message: "Keep up the good work!", anonymous: false },
    { id: 4, donor: "Michael Brown", amount: 150, date: "2025-10-15", anonymous: false },
    { id: 5, donor: "Anonymous", amount: 750, date: "2025-10-14", message: "Making a difference!", anonymous: true },
  ]);

  const [impactUpdates, setImpactUpdates] = useState<ImpactUpdate[]>([
    {
      id: 1,
      title: "Water Well Complete!",
      description: "Funds from Phase 2 campaign built two wells serving 400 villagers. Receipts uploaded.",
      date: "2025-10-18",
      image: "/images/well_complete.jpg",
      file: "/uploads/receipt-phase2.pdf",
      views: 245,
      likes: 67
    },
    {
      id: 2,
      title: "Medical Supplies Distributed",
      description: "Emergency campaign provided supplies to 300 families.",
      date: "2025-10-16",
      image: "/images/med_supplies.jpg",
      views: 189,
      likes: 52
    },
  ]);

  const [donorFeedback, setDonorFeedback] = useState<DonorFeedback[]>([
    { id: 1, donor: "Priya Sinha", comment: "Loved seeing updates and pictures. Keep posting!", date: "Today", replied: false, rating: 5 },
    { id: 2, donor: "Arjun Patel", comment: "Can you share a breakdown of medical fund usage?", date: "Yesterday", replied: false, rating: 4 },
    { id: 3, donor: "Meera Kapoor", comment: "Fantastic transparency! This is how all NGOs should operate.", date: "2 days ago", replied: true, rating: 5 },
  ]);

  const [communityProblems, setCommunityProblems] = useState<CommunityProblem[]>([
    {
      id: 1,
      title: "No Clean Water in Village Rampur",
      description: "Our village of 500 families has no access to clean drinking water. We have to walk 5km daily to fetch water from a contaminated well.",
      category: "Water & Sanitation",
      postedBy: "Rajesh Kumar",
      date: "2025-10-12",
      location: "Rampur, Bihar",
      relevantToUs: true,
      responded: false
    },
    {
      id: 2,
      title: "Children Without School Supplies",
      description: "30+ children in our area cannot afford notebooks, pens, and bags for school. Many are dropping out.",
      category: "Education",
      postedBy: "Priya Sharma",
      date: "2025-10-10",
      location: "Dharavi, Mumbai",
      relevantToUs: false,
      responded: false
    },
    {
      id: 3,
      title: "Contaminated Water Source Affecting 200 Families",
      description: "Our community's only water well has been contaminated. We urgently need a new water source or filtration system.",
      category: "Water & Sanitation",
      postedBy: "Amit Verma",
      date: "2025-10-15",
      location: "Jaipur, Rajasthan",
      relevantToUs: true,
      responded: false
    },
  ]);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: 1, name: "Rahul Sharma", email: "rahul@cleanwater.org", role: "Administrator", joinedDate: "2023-01-15", status: "active" },
    { id: 2, name: "Anjali Gupta", email: "anjali@cleanwater.org", role: "Campaign Manager", joinedDate: "2023-06-20", status: "active" },
    { id: 3, name: "Vikram Singh", email: "vikram@cleanwater.org", role: "Finance Officer", joinedDate: "2024-02-10", status: "active" },
  ]);

  const navLinks = [
    { label: "Dashboard", href: "#dashboard" },
    { label: "Campaigns", href: "#campaigns" },
    { label: "Donors", href: "#donors" },
    { label: "Community", href: "#community" },
    { label: "Analytics", href: "#analytics" },
  ];
  const handleCreateCampaign = () => {
    if (!newCampaignTitle || !newCampaignGoal) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const newCampaign: Campaign = {
      id: campaigns.length + 1,
      title: newCampaignTitle,
      goal: parseInt(newCampaignGoal),
      raised: 0,
      donors: 0,
      status: "Active",
      lastUpdate: "Campaign just started!",
      description: newCampaignDescription,
      startDate: new Date().toISOString().split('T')[0]
    };
    
    setCampaigns([...campaigns, newCampaign]);
    toast.success("Campaign created successfully!");
    setIsNewCampaignOpen(false);
    setNewCampaignTitle("");
    setNewCampaignGoal("");
    setNewCampaignDescription("");
  };
  const handleEditCampaign = () => {
    if (!selectedCampaign) return;
    
    setCampaigns(campaigns.map(c => 
      c.id === selectedCampaign.id ? selectedCampaign : c
    ));
    toast.success("Campaign updated successfully!");
    setIsEditCampaignOpen(false);
    setSelectedCampaign(null);
  };
  const handleDeleteCampaign = (id: number) => {
    setCampaigns(campaigns.filter(c => c.id !== id));
    toast.success("Campaign deleted successfully!");
  };
  const handleCreateUpdate = () => {
    if (!newUpdateTitle || !newUpdateDescription) {
      toast.error("Please fill in all required fields");
      return;
    }
    const newUpdate: ImpactUpdate = {
      id: impactUpdates.length + 1,
      title: newUpdateTitle,
      description: newUpdateDescription,
      date: new Date().toLocaleDateString(),
      views: 0,
      likes: 0
    };
    setImpactUpdates([newUpdate, ...impactUpdates]);
    toast.success("Impact update posted successfully!");
    setIsNewUpdateOpen(false);
    setNewUpdateTitle("");
    setNewUpdateDescription("");
  };
  const handleEditUpdate = () => {
    if (!selectedUpdate) return;
    setImpactUpdates(impactUpdates.map(u => 
      u.id === selectedUpdate.id ? selectedUpdate : u
    ));
    toast.success("Update edited successfully!");
    setIsEditUpdateOpen(false);
    setSelectedUpdate(null);
  };
  const handleDeleteUpdate = (id: number) => {
    setImpactUpdates(impactUpdates.filter(u => u.id !== id));
    toast.success("Update deleted successfully!");
  };
  const handleRespondToProblem = (problemId: number) => {
    setCommunityProblems(communityProblems.map(p => 
      p.id === problemId ? { ...p, responded: true } : p
    ));
    toast.success("Response submitted successfully!");
    setIsResponseDialogOpen(false);
    setSelectedProblem(null);
  };
  const handleReplyToFeedback = (feedbackId: number) => {
    setDonorFeedback(donorFeedback.map(f => 
      f.id === feedbackId ? { ...f, replied: true } : f
    ));
    toast.success("Reply sent successfully!");
    setIsFeedbackReplyOpen(false);
    setSelectedFeedback(null);
  };
  const handleSendThankYou = () => {
    toast.success("Thank you message sent to all recent donors!");
    setIsThankYouDialogOpen(false);
  };
  const handleAddTeamMember = () => {
    toast.success("Team member invitation sent!");
    setIsTeamMemberDialogOpen(false);
  };
  const handleSendEmailCampaign = () => {
    toast.success("Email campaign sent to all donors!");
    setIsEmailCampaignDialogOpen(false);
  };
  const handleUploadFinancialReport = () => {
    toast.success("Financial report uploaded successfully!");
    setIsFinancialReportDialogOpen(false);
  };
  const totalRaised = campaigns.reduce((sum, c) => sum + c.raised, 0);
  const activeCampaignsCount = campaigns.filter(c => c.status === "Active").length;
  const totalDonors = campaigns.reduce((sum, c) => sum + c.donors, 0);
  const averageRating = donorFeedback.reduce((sum, f) => sum + f.rating, 0) / donorFeedback.length;
  const filteredDonations = recentDonations.filter(d => {
    if (donationFilter === "all") return true;
    if (donationFilter === "anonymous") return d.anonymous;
    if (donationFilter === "named") return !d.anonymous;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      < NgoNavbar links={navLinks} userName="Clean Water Initiative" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 dark:bg-gray-800">
            <TabsTrigger value="dashboard" className="dark:data-[state=active]:bg-gray-700">Dashboard</TabsTrigger>
            <TabsTrigger value="campaigns" className="dark:data-[state=active]:bg-gray-700">Campaigns</TabsTrigger>
            <TabsTrigger value="donors" className="dark:data-[state=active]:bg-gray-700">Donors</TabsTrigger>
            <TabsTrigger value="community" className="dark:data-[state=active]:bg-gray-700">Community</TabsTrigger>
            <TabsTrigger value="analytics" className="dark:data-[state=active]:bg-gray-700">Analytics</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <DashboardTab
              totalRaised={totalRaised}
              activeCampaignsCount={activeCampaignsCount}
              totalDonors={totalDonors}
              averageRating={averageRating}
              recentDonations={recentDonations}
              communityProblems={communityProblems}
              donorFeedback={donorFeedback}
              isNewUpdateOpen={isNewUpdateOpen}
              setIsNewUpdateOpen={setIsNewUpdateOpen}
              isNewCampaignOpen={isNewCampaignOpen}
              setIsNewCampaignOpen={setIsNewCampaignOpen}
              isThankYouDialogOpen={isThankYouDialogOpen}
              setIsThankYouDialogOpen={setIsThankYouDialogOpen}
              isEmailCampaignDialogOpen={isEmailCampaignDialogOpen}
              setIsEmailCampaignDialogOpen={setIsEmailCampaignDialogOpen}
              isFinancialReportDialogOpen={isFinancialReportDialogOpen}
              setIsFinancialReportDialogOpen={setIsFinancialReportDialogOpen}
              isTeamMemberDialogOpen={isTeamMemberDialogOpen}
              setIsTeamMemberDialogOpen={setIsTeamMemberDialogOpen}
              newUpdateTitle={newUpdateTitle}
              setNewUpdateTitle={setNewUpdateTitle}
              newUpdateDescription={newUpdateDescription}
              setNewUpdateDescription={setNewUpdateDescription}
              newCampaignTitle={newCampaignTitle}
              setNewCampaignTitle={setNewCampaignTitle}
              newCampaignGoal={newCampaignGoal}
              setNewCampaignGoal={setNewCampaignGoal}
              newCampaignDescription={newCampaignDescription}
              setNewCampaignDescription={setNewCampaignDescription}
              handleCreateUpdate={handleCreateUpdate}
              handleCreateCampaign={handleCreateCampaign}
              handleSendThankYou={handleSendThankYou}
              handleSendEmailCampaign={handleSendEmailCampaign}
              handleUploadFinancialReport={handleUploadFinancialReport}
              handleAddTeamMember={handleAddTeamMember}
              setActiveTab={setActiveTab}
            />
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <CampaignsTab
              campaigns={campaigns}
              isEditCampaignOpen={isEditCampaignOpen}
              setIsEditCampaignOpen={setIsEditCampaignOpen}
              selectedCampaign={selectedCampaign}
              setSelectedCampaign={setSelectedCampaign}
              handleEditCampaign={handleEditCampaign}
              handleDeleteCampaign={handleDeleteCampaign}
            />
          </TabsContent>

          {/* Donors Tab */}
          <TabsContent value="donors" className="space-y-6">
            <DonorsTab
              donationFilter={donationFilter}
              setDonationFilter={setDonationFilter}
              filteredDonations={filteredDonations}
              donorFeedback={donorFeedback}
              isFeedbackReplyOpen={isFeedbackReplyOpen}
              setIsFeedbackReplyOpen={setIsFeedbackReplyOpen}
              selectedFeedback={selectedFeedback}
              setSelectedFeedback={setSelectedFeedback}
              handleReplyToFeedback={handleReplyToFeedback}
            />
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="space-y-6">
            <CommunityTab
              communityProblems={communityProblems}
              isResponseDialogOpen={isResponseDialogOpen}
              setIsResponseDialogOpen={setIsResponseDialogOpen}
              selectedProblem={selectedProblem}
              setSelectedProblem={setSelectedProblem}
              handleRespondToProblem={handleRespondToProblem}
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsTab
              dateRange={dateRange}
              setDateRange={setDateRange}
              impactUpdates={impactUpdates}
              teamMembers={teamMembers}
              isEditUpdateOpen={isEditUpdateOpen}
              setIsEditUpdateOpen={setIsEditUpdateOpen}
              selectedUpdate={selectedUpdate}
              setSelectedUpdate={setSelectedUpdate}
              handleEditUpdate={handleEditUpdate}
              handleDeleteUpdate={handleDeleteUpdate}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* All Dialog JSX has been moved into their respective tab components.
        For example, EditCampaignDialog is now inside CampaignsTab.tsx.
        NewCampaignDialog is now inside DashboardTab.tsx.
        This keeps the main component file clean.
      */}
    </div>
  );
}