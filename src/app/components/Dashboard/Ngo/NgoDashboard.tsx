import { useState } from "react";
import { Plus, TrendingUp, DollarSign, Users, Upload, FileText, MessageCircle, AlertCircle, Heart, Edit, Trash2, Eye, Send, BarChart3, Download, Clock, CheckCircle, XCircle, Target, Award, Mail, UserPlus, Calendar, Filter, Search, Bell, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Progress } from "../../ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { NgoNavbar } from "@/app/components/Navbar/NgoNavbar/NgoNavbar";

interface Campaign {
  id: number;
  title: string;
  goal: number;
  raised: number;
  donors: number;
  status: string;
  lastUpdate: string;
  description?: string;
  startDate: string;
  endDate?: string;
}

interface Donation {
  id: number;
  donor: string;
  amount: number;
  date: string;
  message?: string;
  anonymous: boolean;
}

interface ImpactUpdate {
  id: number;
  title: string;
  description: string;
  date: string;
  image?: string;
  file?: string;
  views: number;
  likes: number;
}

interface DonorFeedback {
  id: number;
  donor: string;
  comment: string;
  date: string;
  replied?: boolean;
  rating: number;
}

interface CommunityProblem {
  id: number;
  title: string;
  description: string;
  category: string;
  postedBy: string;
  date: string;
  location: string;
  relevantToUs: boolean;
  responded?: boolean;
}

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  joinedDate: string;
  status: string;
}

export function NGODashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Dialog states
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

  // Form states for new campaign
  const [newCampaignTitle, setNewCampaignTitle] = useState("");
  const [newCampaignGoal, setNewCampaignGoal] = useState("");
  const [newCampaignDescription, setNewCampaignDescription] = useState("");

  // Form states for new update
  const [newUpdateTitle, setNewUpdateTitle] = useState("");
  const [newUpdateDescription, setNewUpdateDescription] = useState("");

  // Filter states
  const [donationFilter, setDonationFilter] = useState("all");
  const [dateRange, setDateRange] = useState("month");

  // Data states
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

  // Handle create new campaign
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

  // Handle edit campaign
  const handleEditCampaign = () => {
    if (!selectedCampaign) return;
    
    setCampaigns(campaigns.map(c => 
      c.id === selectedCampaign.id ? selectedCampaign : c
    ));
    toast.success("Campaign updated successfully!");
    setIsEditCampaignOpen(false);
    setSelectedCampaign(null);
  };

  // Handle delete campaign
  const handleDeleteCampaign = (id: number) => {
    setCampaigns(campaigns.filter(c => c.id !== id));
    toast.success("Campaign deleted successfully!");
  };

  // Handle create new update
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

  // Handle edit update
  const handleEditUpdate = () => {
    if (!selectedUpdate) return;
    
    setImpactUpdates(impactUpdates.map(u => 
      u.id === selectedUpdate.id ? selectedUpdate : u
    ));
    toast.success("Update edited successfully!");
    setIsEditUpdateOpen(false);
    setSelectedUpdate(null);
  };

  // Handle delete update
  const handleDeleteUpdate = (id: number) => {
    setImpactUpdates(impactUpdates.filter(u => u.id !== id));
    toast.success("Update deleted successfully!");
  };

  // Handle respond to problem
  const handleRespondToProblem = (problemId: number) => {
    setCommunityProblems(communityProblems.map(p => 
      p.id === problemId ? { ...p, responded: true } : p
    ));
    toast.success("Response submitted successfully!");
    setIsResponseDialogOpen(false);
    setSelectedProblem(null);
  };

  // Handle reply to feedback
  const handleReplyToFeedback = (feedbackId: number) => {
    setDonorFeedback(donorFeedback.map(f => 
      f.id === feedbackId ? { ...f, replied: true } : f
    ));
    toast.success("Reply sent successfully!");
    setIsFeedbackReplyOpen(false);
    setSelectedFeedback(null);
  };

  // Handle send thank you
  const handleSendThankYou = () => {
    toast.success("Thank you message sent to all recent donors!");
    setIsThankYouDialogOpen(false);
  };

  // Handle add team member
  const handleAddTeamMember = () => {
    toast.success("Team member invitation sent!");
    setIsTeamMemberDialogOpen(false);
  };

  // Handle send email campaign
  const handleSendEmailCampaign = () => {
    toast.success("Email campaign sent to all donors!");
    setIsEmailCampaignDialogOpen(false);
  };

  // Handle upload financial report
  const handleUploadFinancialReport = () => {
    toast.success("Financial report uploaded successfully!");
    setIsFinancialReportDialogOpen(false);
  };

  // Calculate total stats
  const totalRaised = campaigns.reduce((sum, c) => sum + c.raised, 0);
  const activeCampaignsCount = campaigns.filter(c => c.status === "Active").length;
  const totalDonors = campaigns.reduce((sum, c) => sum + c.donors, 0);
  const averageRating = donorFeedback.reduce((sum, f) => sum + f.rating, 0) / donorFeedback.length;

  // Filter donations
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
                      <Award className="w-6 h-6 text-white" />
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
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-gray-900 dark:text-white mb-2">My Campaigns</h1>
                <p className="text-gray-600 dark:text-gray-300">Manage your fundraising campaigns</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {campaigns.map((campaign) => {
                const progress = (campaign.raised / campaign.goal) * 100;
                return (
                  <Card key={campaign.id} className="rounded-xl border-none shadow-sm bg-white dark:bg-gray-800 transition-colors duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-gray-900 dark:text-white mb-2">{campaign.title}</CardTitle>
                          <div className="flex gap-2 mb-2">
                            <Badge
                              variant="secondary"
                              className={
                                campaign.status === "Active"
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                              }
                            >
                              {campaign.status}
                            </Badge>
                            <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">
                              <Calendar className="w-3 h-3 mr-1" />
                              {campaign.startDate}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600 dark:text-gray-300">Progress</span>
                          <span className="text-gray-900 dark:text-white">
                            ${campaign.raised.toLocaleString()} / ${campaign.goal.toLocaleString()}
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>{progress.toFixed(1)}% raised</span>
                          <span>{campaign.donors} donors</span>
                        </div>
                      </div>
                      <div className="text-sm bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                        <p className="text-green-700 dark:text-green-400">
                          <FileText className="w-3 h-3 inline mr-1" />
                          Latest: {campaign.lastUpdate}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 rounded-lg dark:border-gray-600 dark:hover:bg-gray-700"
                          onClick={() => {
                            setSelectedCampaign({...campaign});
                            setIsEditCampaignOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 rounded-lg text-red-600 border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                          onClick={() => handleDeleteCampaign(campaign.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Donors Tab */}
          <TabsContent value="donors" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-gray-900 dark:text-white mb-2">Donor Management</h1>
                <p className="text-gray-600 dark:text-gray-300">View and engage with your donors</p>
              </div>
              <div className="flex gap-3">
                <Select value={donationFilter} onValueChange={setDonationFilter}>
                  <SelectTrigger className="w-48 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    <SelectItem value="all">All Donations</SelectItem>
                    <SelectItem value="anonymous">Anonymous</SelectItem>
                    <SelectItem value="named">Named Donors</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  className="rounded-lg dark:border-gray-600 dark:hover:bg-gray-700"
                  onClick={() => toast.success("Donor data exported successfully!")}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Donor List */}
              <Card className="rounded-xl border-none shadow-sm bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="dark:text-white">Recent Donors</CardTitle>
                  <CardDescription className="dark:text-gray-400">All donations received</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredDonations.map((donation) => (
                      <div key={donation.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-gray-900 dark:text-white">{donation.donor}</h4>
                            {donation.anonymous && (
                              <Badge variant="secondary" className="text-xs dark:bg-gray-600 dark:text-gray-300">Anonymous</Badge>
                            )}
                          </div>
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

              {/* Donor Feedback */}
              <Card className="rounded-xl border-none shadow-sm bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="dark:text-white">Donor Feedback</CardTitle>
                  <CardDescription className="dark:text-gray-400">Comments and ratings from donors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {donorFeedback.map((fb) => (
                      <div key={fb.id} className="pb-3 border-b dark:border-gray-700 last:border-b-0 last:pb-0">
                        <div className="flex items-start gap-2">
                          <MessageCircle className="w-5 h-5 text-teal-600 dark:text-teal-400 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-gray-900 dark:text-white text-sm">{fb.donor}</p>
                              <div className="flex gap-0.5">
                                {Array(fb.rating).fill(0).map((_, i) => (
                                  <Award key={i} className="w-3 h-3 text-yellow-500 fill-current" />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{fb.comment}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500 dark:text-gray-400">{fb.date}</span>
                              {fb.replied ? (
                                <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Replied
                                </Badge>
                              ) : (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="rounded-lg dark:border-gray-600 dark:hover:bg-gray-700 h-7 text-xs"
                                  onClick={() => {
                                    setSelectedFeedback(fb);
                                    setIsFeedbackReplyOpen(true);
                                  }}
                                >
                                  <Send className="w-3 h-3 mr-1" />Reply
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="space-y-6">
            <div className="mb-6">
              <h1 className="text-gray-900 dark:text-white mb-2">Community Problems</h1>
              <p className="text-gray-600 dark:text-gray-300">Browse problems and provide solutions</p>
            </div>

            <div className="space-y-4">
              {communityProblems
                .filter((p) => p.relevantToUs)
                .map((problem) => (
                  <Card key={problem.id} className="rounded-xl border-none shadow-sm border-l-4 border-l-teal-500 dark:border-l-teal-400 bg-white dark:bg-gray-800 transition-colors duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            <CardTitle className="text-gray-900 dark:text-white">{problem.title}</CardTitle>
                          </div>
                          <div className="flex items-center gap-3 flex-wrap mb-3">
                            <Badge variant="secondary" className="bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400">
                              {problem.category}
                            </Badge>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{problem.location}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Posted by {problem.postedBy}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{problem.date}</span>
                            {problem.responded && (
                              <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Responded
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="dark:text-gray-300">{problem.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Dialog 
                        open={isResponseDialogOpen && selectedProblem === problem.id} 
                        onOpenChange={(open) => {
                          setIsResponseDialogOpen(open);
                          if (!open) setSelectedProblem(null);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => setSelectedProblem(problem.id)}
                            className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg"
                            disabled={problem.responded}
                          >
                            {problem.responded ? "Response Submitted" : "Propose Solution"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-xl dark:bg-gray-800 dark:border-gray-700">
                          <DialogHeader>
                            <DialogTitle className="dark:text-white">Propose Your Solution</DialogTitle>
                            <DialogDescription className="dark:text-gray-400">
                              Explain how your NGO can help solve this problem
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                              <h4 className="text-sm text-gray-900 dark:text-white mb-1">{problem.title}</h4>
                              <p className="text-xs text-gray-600 dark:text-gray-300">{problem.location}</p>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="solution-response" className="dark:text-gray-300">Your Proposed Solution</Label>
                              <Textarea
                                id="solution-response"
                                placeholder="Describe how your NGO can solve this problem..."
                                rows={5}
                                className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="estimated-cost" className="dark:text-gray-300">Estimated Cost (₹)</Label>
                              <Input
                                id="estimated-cost"
                                type="number"
                                placeholder="e.g., 80000"
                                className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="timeline" className="dark:text-gray-300">Timeline</Label>
                              <Input
                                id="timeline"
                                placeholder="e.g., 2-3 months"
                                className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              />
                            </div>
                            <Button 
                              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg"
                              onClick={() => handleRespondToProblem(problem.id)}
                            >
                              Submit Response
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-gray-900 dark:text-white mb-2">Analytics & Reports</h1>
                <p className="text-gray-600 dark:text-gray-300">Comprehensive insights and performance metrics</p>
              </div>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-48 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="rounded-xl border-none shadow-sm bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="dark:text-white flex items-center gap-2 text-base">
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                    Donation Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h2 className="text-gray-900 dark:text-white mb-1">+34.5%</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">vs previous period</p>
                </CardContent>
              </Card>
              <Card className="rounded-xl border-none shadow-sm bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="dark:text-white flex items-center gap-2 text-base">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    New Donors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h2 className="text-gray-900 dark:text-white mb-1">45</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">This month</p>
                </CardContent>
              </Card>
              <Card className="rounded-xl border-none shadow-sm bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="dark:text-white flex items-center gap-2 text-base">
                    <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    Update Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h2 className="text-gray-900 dark:text-white mb-1">{impactUpdates.reduce((sum, u) => sum + u.views, 0)}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total impact views</p>
                </CardContent>
              </Card>
            </div>

            {/* Impact Updates Performance */}
            <Card className="rounded-xl border-none shadow-sm bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="dark:text-white">Impact Updates Performance</CardTitle>
                <CardDescription className="dark:text-gray-400">Engagement with your transparency posts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {impactUpdates.map((update) => (
                    <div key={update.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <h4 className="text-gray-900 dark:text-white mb-1">{update.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{update.date}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Views</p>
                          <p className="text-lg text-gray-900 dark:text-white">{update.views}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Likes</p>
                          <p className="text-lg text-teal-600 dark:text-teal-400">{update.likes}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Team Management */}
            <Card className="rounded-xl border-none shadow-sm bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="dark:text-white">Team Members</CardTitle>
                <CardDescription className="dark:text-gray-400">Manage your NGO team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-gray-900 dark:text-white">{member.name}</h4>
                          <Badge variant="secondary" className="dark:bg-gray-600 dark:text-gray-300">{member.role}</Badge>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Joined {member.joinedDate}</p>
                      </div>
                      <Badge 
                        className={member.status === "active" 
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : "bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300"}
                      >
                        {member.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* All Dialog Components */}
      {/* Edit Campaign Dialog */}
      <Dialog open={isEditCampaignOpen} onOpenChange={setIsEditCampaignOpen}>
        <DialogContent className="rounded-xl dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Edit Campaign</DialogTitle>
            <DialogDescription className="dark:text-gray-400">Update campaign details</DialogDescription>
          </DialogHeader>
          {selectedCampaign && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-campaign-title" className="dark:text-gray-300">Campaign Title</Label>
                <Input 
                  id="edit-campaign-title" 
                  value={selectedCampaign.title}
                  onChange={(e) => setSelectedCampaign({...selectedCampaign, title: e.target.value})}
                  className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-campaign-goal" className="dark:text-gray-300">Funding Goal ($)</Label>
                <Input 
                  id="edit-campaign-goal" 
                  type="number"
                  value={selectedCampaign.goal}
                  onChange={(e) => setSelectedCampaign({...selectedCampaign, goal: parseInt(e.target.value)})}
                  className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-campaign-description" className="dark:text-gray-300">Description</Label>
                <Textarea
                  id="edit-campaign-description"
                  value={selectedCampaign.description || ""}
                  onChange={(e) => setSelectedCampaign({...selectedCampaign, description: e.target.value})}
                  rows={4}
                  className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg"
                onClick={handleEditCampaign}
              >
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Update Dialog */}
      <Dialog open={isEditUpdateOpen} onOpenChange={setIsEditUpdateOpen}>
        <DialogContent className="rounded-xl dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Edit Impact Update</DialogTitle>
            <DialogDescription className="dark:text-gray-400">Update the details of your impact post</DialogDescription>
          </DialogHeader>
          {selectedUpdate && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-update-title" className="dark:text-gray-300">Update Title</Label>
                <Input 
                  id="edit-update-title" 
                  value={selectedUpdate.title}
                  onChange={(e) => setSelectedUpdate({...selectedUpdate, title: e.target.value})}
                  className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-update-description" className="dark:text-gray-300">Description</Label>
                <Textarea
                  id="edit-update-description"
                  value={selectedUpdate.description}
                  onChange={(e) => setSelectedUpdate({...selectedUpdate, description: e.target.value})}
                  rows={4}
                  className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg"
                onClick={handleEditUpdate}
              >
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reply to Feedback Dialog */}
      <Dialog open={isFeedbackReplyOpen} onOpenChange={setIsFeedbackReplyOpen}>
        <DialogContent className="rounded-xl dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Reply to Feedback</DialogTitle>
            <DialogDescription className="dark:text-gray-400">Respond to donor's comment</DialogDescription>
          </DialogHeader>
          {selectedFeedback && (
            <div className="space-y-4 mt-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-900 dark:text-white mb-1">"{selectedFeedback.comment}"</p>
                <span className="text-xs text-gray-600 dark:text-gray-400">- {selectedFeedback.donor}</span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedback-reply" className="dark:text-gray-300">Your Reply</Label>
                <Textarea
                  id="feedback-reply"
                  placeholder="Type your response to the donor..."
                  rows={4}
                  className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg"
                onClick={() => handleReplyToFeedback(selectedFeedback.id)}
              >
                <Send className="w-4 h-4 mr-2" />Send Reply
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Thank You Dialog */}
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

      {/* Team Member Dialog */}
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

      {/* Email Campaign Dialog */}
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

      {/* Financial Report Dialog */}
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
    </div>
  );
}
