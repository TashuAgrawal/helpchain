// src/app/components/ngo-dashboard/NGODashboard.tsx

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { NgoNavbar } from "@/app/components/Navbar/NgoNavbar/NgoNavbar";
import { Campaign, Donation, ImpactUpdate, DonorFeedback, CommunityProblem, TeamMember } from "./types";
import { DashboardTab } from "./DashboardTab";
import { CampaignsTab } from "./CampaignsTab";
import { DonorsTab } from "./DonorsTab";
import { CommunityTab } from "./CommunityTab";
import { AnalyticsTab } from "./AnalyticsTab";
import addCampaign from "@/Helper/NgoServices/AddCampaign"
import fetchCampaignsByNgo from "@/Helper/NgoServices/GetMyCampaign"
import fetchTransactionsByNgoId from "@/Helper/NgoServices/GetMyTransations"
import fetchAllCommunityProblems from "@/Helper/NgoServices/GetAllProblems"
import fetchAvgRating from "@/Helper/NgoServices/GetAvgRating"
import { getUserById } from "@/Helper/NgoServices/GetUser";
import { fetchFeedbackByNgo } from "@/Helper/NgoServices/GetAllFeedback";

export function NGODashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);
  const [isEditCampaignOpen, setIsEditCampaignOpen] = useState(false);
  const [isNewUpdateOpen, setIsNewUpdateOpen] = useState(false);
  const [isEditUpdateOpen, setIsEditUpdateOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
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
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);
  const [communityProblems, setCommunityProblems] = useState<CommunityProblem[]>([]);
  const [averageRating, setaverageRating] = useState(0);

  const [donorFeedback, setDonorFeedback] = useState<DonorFeedback[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {

        const formatDate = (isoDate: string) => {
          const date = new Date(isoDate);
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0'); // +1 because months are 0-indexed
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        };
        let ngoId;
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const userObj = JSON.parse(userStr);
          ngoId = userObj?.user.mongoId;
        }

        // Fetch campaigns
        const result = await fetchCampaignsByNgo(ngoId);
        const mappedCampaigns: Campaign[] = result.map((item: any) => ({
          id: item._id,
          title: item.title,
          goal: item.goal,
          raised: item.raised,
          donors: item.donors,
          status: item.status,
          lastUpdate: item.lastUpdate,
          description: item.description,
          startDate: formatDate(item.startDate),
          ngoId: item.ngoId,
          endDate: item.endDate,
        }));
        setCampaigns(mappedCampaigns);

        


        // Fetch transactions
        const result2 = await fetchTransactionsByNgoId(ngoId);

        const mappedDonationsWithNames: Donation[] = await Promise.all(
          result2.map(async (txn: any) => {
            let donorName = "Anonymous";
            if (txn.donor && !txn.anonymous) {
              try {
                const userResponse = await getUserById(txn.donor);
                donorName = userResponse.data.user.name;
              } catch (error) {
                donorName = "Unknown Donor";
              }
            }

            return {
              id: txn._id,
              donor: donorName,  // ✅ Now shows actual name!
              donorId: txn.donor, // Keep original ID if needed
              amount: txn.amount,
              date: formatDate(txn.date),
              message: txn.message ?? "",
              anonymous: txn.anonymous ?? false,
            };
          })
        );

        setRecentDonations(mappedDonationsWithNames);

        // Fetch community problems
        const result3 = await fetchAllCommunityProblems();
        const mappedProblems: CommunityProblem[] = result3.map((problem: any) => ({
          id: problem._id,
          title: problem.title,
          description: problem.description,
          category: problem.category,
          postedBy: problem.postedBy,
          date: formatDate(problem.date),
          location: problem.location,
          responses: problem.responses,
          upvotes: problem.upvotes,
          userVoted: problem.userVoted ?? false,
        }));
        setCommunityProblems(mappedProblems);

        // Fetch average rating
        const avgrate = await fetchAvgRating(ngoId);
        setaverageRating(avgrate.averageRating);

        const feedbackResult = await fetchFeedbackByNgo(ngoId);
        console.log("Feedback result:", feedbackResult);

        const mappedFeedback: DonorFeedback[] = feedbackResult.data.feedback.map((fb: any, index: number) => ({
          id: index + 1,
          donor: fb.donor,
          comment: fb.comment,
          date: fb.date,
          replied: fb.replied || false,
          rating: fb.rating || 5
        }));

        setDonorFeedback(mappedFeedback);

      } catch (err) {
        console.error("Error fetching NGOs:", err);
        toast.error("Failed to load dashboard data");
      }
    }
    fetchData();
  }, []);



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
  const handleCreateCampaign = async () => {
    if (!newCampaignTitle || !newCampaignGoal) {
      toast.error("Please fill in all required fields");
      return;
    }

    let ngoId;
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userObj = JSON.parse(userStr);
      ngoId = userObj?.user.mongoId;
    }

    const newCampaign: Campaign = {
      id: "",
      title: newCampaignTitle,
      goal: parseInt(newCampaignGoal),
      raised: 0,
      donors: 0,
      status: "Active",
      lastUpdate: "Campaign just started!",
      description: newCampaignDescription,
      startDate: new Date().toISOString().split('T')[0],
      ngoId: ngoId
    };
    try {
      const result = await addCampaign(newCampaign);
      const mappedCampaigns = {
        id: result.campaign._id,
        title: result.campaign.title,
        goal: result.campaign.goal,
        raised: result.campaign.raised,
        donors: result.campaign.donors,
        status: result.campaign.status,
        lastUpdate: result.campaign.lastUpdate,
        description: result.campaign.description,
        startDate: result.campaign.startDate,
        ngoId: result.campaign.ngoId,
        endDate: result.campaign.endDate,
      };
      setCampaigns([...campaigns, mappedCampaigns]);

    } catch (error) {

    }

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
  const handleDeleteCampaign = (id: string) => {
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
  const handleRespondToProblem = (problemId: string) => {
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
  const totalRaised = recentDonations.reduce((sum, donation) => sum + donation.amount, 0);
  const activeCampaignsCount = campaigns.filter(c => c.status === "Active").length;
  const allDonors = campaigns.flatMap(c => c.donors);
  const uniqueDonors = new Set(allDonors);
  const totalDonors = uniqueDonors.size;
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
    </div>
  );
}