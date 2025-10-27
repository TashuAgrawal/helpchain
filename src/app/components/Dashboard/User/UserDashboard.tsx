import { JSX, useState } from "react";
import { Heart, TrendingUp, Users, Calendar, DollarSign, FileText, MessageCircle, AlertCircle, Plus, Download, Share2, Star, Filter, Search, Target, Gift, Bell, BarChart3, Award, ChevronDown, Bookmark, BookmarkCheck, TrendingDown, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Progress } from "../../ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Switch } from "../../ui/switch";
import { toast } from "sonner";
import { Separator } from "../../ui/separator";
import { UserNavbar } from "@/app/components/Navbar/UserNavbar/UserNavbar";


interface UserBadge {
  id: number;
  name: string;
  icon: JSX.Element;
  threshold: number;
  description: string;
  colorClass: string;
}

interface NGO {
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

interface MyDonation {
  id: number;
  ngoName: string;
  amount: number;
  date: string;
  status: string;
  impact?: string;
  category: string;
}

interface CommunityProblem {
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

const userBadges: UserBadge[] = [
  {
    id: 1,
    name: "Bronze Supporter",
    icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.392 4.278a1 1 0 00.95.69h4.505c.969 0 1.371 1.24.588 1.81l-3.647 2.64a1 1 0 00-.364 1.118l1.392 4.278c.3.92-.755 1.688-1.538 1.118l-3.647-2.64a1 1 0 00-1.176 0l-3.647 2.64c-.783.57-1.838-.197-1.538-1.118l1.392-4.278a1 1 0 00-.364-1.118L2.623 9.705c-.783-.57-.38-1.81.588-1.81h4.505a1 1 0 00.95-.69l1.392-4.278z"/></svg>,
    threshold: 100,
    description: "Donated at least ₹100",
    colorClass: "text-orange-600 dark:text-orange-400",
  },
  {
    id: 2,
    name: "Silver Supporter",
    icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.392 4.278a1 1 0 00.95.69h4.505c.969 0 1.371 1.24.588 1.81l-3.647 2.64a1 1 0 00-.364 1.118l1.392 4.278c.3.92-.755 1.688-1.538 1.118l-3.647-2.64a1 1 0 00-1.176 0l-3.647 2.64c-.783.57-1.838-.197-1.538-1.118l1.392-4.278a1 1 0 00-.364-1.118L2.623 9.705c-.783-.57-.38-1.81.588-1.81h4.505a1 1 0 00.95-.69l1.392-4.278z"/></svg>,
    threshold: 500,
    description: "Donated at least ₹500",
    colorClass: "text-gray-500 dark:text-gray-400",
  },
  {
    id: 3,
    name: "Gold Supporter",
    icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.392 4.278a1 1 0 00.95.69h4.505c.969 0 1.371 1.24.588 1.81l-3.647 2.64a1 1 0 00-.364 1.118l1.392 4.278c.3.92-.755 1.688-1.538 1.118l-3.647-2.64a1 1 0 00-1.176 0l-3.647 2.64c-.783.57-1.838-.197-1.538-1.118l1.392-4.278a1 1 0 00-.364-1.118L2.623 9.705c-.783-.57-.38-1.81.588-1.81h4.505a1 1 0 00.95-.69l1.392-4.278z"/></svg>,
    threshold: 1000,
    description: "Donated ₹1000 or more",
    colorClass: "text-yellow-500 dark:text-yellow-400",
  },
  {
    id: 4,
    name: "Platinum Supporter",
    icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.392 4.278a1 1 0 00.95.69h4.505c.969 0 1.371 1.24.588 1.81l-3.647 2.64a1 1 0 00-.364 1.118l1.392 4.278c.3.92-.755 1.688-1.538 1.118l-3.647-2.64a1 1 0 00-1.176 0l-3.647 2.64c-.783.57-1.838-.197-1.538-1.118l1.392-4.278a1 1 0 00-.364-1.118L2.623 9.705c-.783-.57-.38-1.81.588-1.81h4.505a1 1 0 00.95-.69l1.392-4.278z"/></svg>,
    threshold: 5000,
    description: "Donated ₹5000 or more - Elite Donor!",
    colorClass: "text-purple-600 dark:text-purple-400",
  },
];

export function BadgeSystem({ totalDonated }: { totalDonated: number }) {
  const earnedBadges = userBadges.filter((b) => totalDonated >= b.threshold);
  const highestBadge = earnedBadges.length > 0 ? earnedBadges[earnedBadges.length - 1] : null;
  
  return (
    <div className="mt-3">
      {!highestBadge ? (
        <p className="text-xs text-gray-500 dark:text-gray-400">Donate ₹100 to earn your first badge!</p>
      ) : (
        <div className="flex items-center gap-2" title={highestBadge.description}>
          <div className={`p-1.5 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 ${highestBadge.colorClass} transition-colors duration-300`}>
            {highestBadge.icon}
          </div>
          <span className="text-xs text-gray-700 dark:text-gray-300">
            {highestBadge.name}
          </span>
        </div>
      )}
    </div>
  );
}


// NGO Card Component
function NGOCard({ 
  ngo, 
  onDonate, 
  onToggleFavorite, 
  onAddToCompare,
  isInCompare 
}: { 
  ngo: NGO; 
  onDonate: (ngo: NGO) => void; 
  onToggleFavorite: (id: number) => void;
  onAddToCompare: (ngo: NGO) => void;
  isInCompare: boolean;
}) {
  const progress = (ngo.raised / ngo.goal) * 100;
  
  return (
    <Card className="rounded-xl border-none shadow-sm hover:shadow-md transition-all bg-white dark:bg-gray-800">
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700 rounded-t-xl overflow-hidden">
        {/* <ImageWithFallback 
          src={ngo.image} 
          alt={ngo.name} 
          className="w-full h-full object-cover"
        /> */}
        <div className="absolute top-3 right-3 flex gap-2">
          {ngo.verified && (
            <Badge className="bg-blue-600 text-white">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Verified
            </Badge>
          )}
        </div>
        <div className="absolute top-3 left-3 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-full h-8 w-8 p-0"
            onClick={() => onToggleFavorite(ngo.id)}
          >
            {ngo.isFavorite ? (
              <BookmarkCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            ) : (
              <Bookmark className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            )}
          </Button>
        </div>
      </div>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-gray-900 dark:text-white mb-2">{ngo.name}</CardTitle>
            <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300 mb-2">{ngo.cause}</Badge>
            <p className="text-sm text-gray-600 dark:text-gray-400">{ngo.description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-300">Progress</span>
            <span className="text-gray-900 dark:text-white">
              ${ngo.raised.toLocaleString()} / ${ngo.goal.toLocaleString()}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-300">{ngo.donors} donors</span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-gray-900 dark:text-white">{ngo.transparencyScore}/100</span>
          </div>
        </div>
        <div className="text-sm bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
          <p className="text-green-700 dark:text-green-400">
            <FileText className="w-3 h-3 inline mr-1" />
            {ngo.lastUpdate}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg"
            onClick={() => onDonate(ngo)}
          >
            <Heart className="w-4 h-4 mr-2" />
            Donate
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`rounded-lg ${isInCompare ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-600 dark:border-blue-400' : 'dark:border-gray-600 dark:hover:bg-gray-700'}`}
            onClick={() => onAddToCompare(ngo)}
          >
            <BarChart3 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const UserDashboard = () => {

  const [selectedTab, setSelectedTab] = useState("explore");
  const [isDonateDialogOpen, setIsDonateDialogOpen] = useState(false);
  const [selectedNGO, setSelectedNGO] = useState<NGO | null>(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [isProblemDialogOpen, setIsProblemDialogOpen] = useState(false);
  const [newProblemTitle, setNewProblemTitle] = useState("");
  const [newProblemDescription, setNewProblemDescription] = useState("");
  const [newProblemCategory, setNewProblemCategory] = useState("");
  const [newProblemLocation, setNewProblemLocation] = useState("");
  const [isRecurringDialogOpen, setIsRecurringDialogOpen] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState("monthly");
  const [isCompareDialogOpen, setIsCompareDialogOpen] = useState(false);
  const [compareNGOs, setCompareNGOs] = useState<NGO[]>([]);
  const [isReferralDialogOpen, setIsReferralDialogOpen] = useState(false);
  const [isDonationGoalDialogOpen, setIsDonationGoalDialogOpen] = useState(false);
  const [donationGoalAmount, setDonationGoalAmount] = useState("");
  const [donationGoalDeadline, setDonationGoalDeadline] = useState("");

  const [ngos, setNGOs] = useState<NGO[]>([
    {
      id: 1,
      name: "Clean Water Initiative",
      cause: "Water & Sanitation",
      description: "Providing clean drinking water to rural communities",
      goal: 50000,
      raised: 38500,
      image: "https://images.unsplash.com/photo-1547751550-50f3f7125b8e?w=400",
      lastUpdate: "2 wells completed with $15,000",
      transparency: "Receipts and photos uploaded",
      transparencyScore: 98,
      donors: 124,
      verified: true,
      isFavorite: false
    },
    {
      id: 2,
      name: "Education for All",
      cause: "Education",
      description: "Empowering children through quality education",
      goal: 30000,
      raised: 22000,
      image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400",
      lastUpdate: "Distributed supplies to 100 students",
      transparency: "Monthly financial reports",
      transparencyScore: 95,
      donors: 89,
      verified: true,
      isFavorite: true
    },
    {
      id: 3,
      name: "Healthcare Access",
      cause: "Healthcare",
      description: "Medical camps and healthcare services for rural areas",
      goal: 40000,
      raised: 28000,
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400",
      lastUpdate: "Hosted medical camp for 500 villagers",
      transparency: "Detailed expense reports",
      transparencyScore: 92,
      donors: 156,
      verified: true,
      isFavorite: false
    },
    {
      id: 4,
      name: "Green Earth Initiative",
      cause: "Environment",
      description: "Environmental conservation and tree plantation",
      goal: 25000,
      raised: 18500,
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400",
      lastUpdate: "Planted 5000 trees this month",
      transparency: "GPS-tagged tree locations",
      transparencyScore: 97,
      donors: 203,
      verified: true,
      isFavorite: false
    },
  ]);

  const [myDonations, setMyDonations] = useState<MyDonation[]>([
    { id: 1, ngoName: "Clean Water Initiative", amount: 500, date: "2025-10-01", status: "Impact Reported", impact: "Helped build 0.5 wells", category: "Water & Sanitation" },
    { id: 2, ngoName: "Education for All", amount: 1000, date: "2025-09-15", status: "Impact Reported", impact: "Provided supplies for 10 students", category: "Education" },
    { id: 3, ngoName: "Healthcare Access", amount: 250, date: "2025-08-20", status: "In Progress", category: "Healthcare" },
    { id: 4, ngoName: "Green Earth Initiative", amount: 750, date: "2025-07-10", status: "Completed", impact: "Planted 75 trees", category: "Environment" },
  ]);

  const [communityProblems, setCommunityProblems] = useState<CommunityProblem[]>([
    {
      id: 1,
      title: "No Clean Water in Village Rampur",
      description: "Our village of 500 families has no access to clean drinking water. We have to walk 5km daily.",
      category: "Water & Sanitation",
      postedBy: "Rajesh Kumar",
      date: "2025-10-12",
      location: "Rampur, Bihar",
      responses: 3,
      upvotes: 45,
      userVoted: false
    },
    {
      id: 2,
      title: "Children Without School Supplies",
      description: "30+ children in our area cannot afford notebooks, pens, and bags for school.",
      category: "Education",
      postedBy: "Priya Sharma",
      date: "2025-10-10",
      location: "Dharavi, Mumbai",
      responses: 5,
      upvotes: 67,
      userVoted: true
    },
    {
      id: 3,
      title: "No Medical Facility in Remote Area",
      description: "Our tribal community of 200 families has no access to basic healthcare.",
      category: "Healthcare",
      postedBy: "Amit Verma",
      date: "2025-10-08",
      location: "Gadchiroli, Maharashtra",
      responses: 2,
      upvotes: 38,
      userVoted: false
    },
  ]);

  const totalDonated = myDonations.reduce((sum, d) => sum + d.amount, 0);
  const earnedBadges = userBadges.filter((b) => totalDonated >= b.threshold);

  const navLinks = [
    { label: "Explore NGOs", href: "#explore" },
    { label: "My Donations", href: "#donations" },
    { label: "Community", href: "#community" },
    { label: "My Impact", href: "#impact" },
  ];

  const handleDonate = () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      toast.error("Please enter a valid donation amount");
      return;
    }

    const newDonation: MyDonation = {
      id: myDonations.length + 1,
      ngoName: selectedNGO?.name || "",
      amount: parseFloat(donationAmount),
      date: new Date().toISOString().split('T')[0],
      status: "Processing",
      category: selectedNGO?.cause || ""
    };

    setMyDonations([newDonation, ...myDonations]);
    toast.success(`Successfully donated $${donationAmount} to ${selectedNGO?.name}!`);
    setIsDonateDialogOpen(false);
    setDonationAmount("");
    setIsAnonymous(false);
  };

  const handleRecurringDonation = () => {
    toast.success(`Recurring ${recurringFrequency} donation of $${donationAmount} set up successfully!`);
    setIsRecurringDialogOpen(false);
    setDonationAmount("");
  };

  const handleToggleFavorite = (ngoId: number) => {
    setNGOs(ngos.map(ngo => 
      ngo.id === ngoId ? { ...ngo, isFavorite: !ngo.isFavorite } : ngo
    ));
    const ngo = ngos.find(n => n.id === ngoId);
    toast.success(ngo?.isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  const handlePostProblem = () => {
    if (!newProblemTitle || !newProblemDescription || !newProblemCategory || !newProblemLocation) {
      toast.error("Please fill in all fields");
      return;
    }

    const newProblem: CommunityProblem = {
      id: communityProblems.length + 1,
      title: newProblemTitle,
      description: newProblemDescription,
      category: newProblemCategory,
      postedBy: "You",
      date: new Date().toLocaleDateString(),
      location: newProblemLocation,
      responses: 0,
      upvotes: 0,
      userVoted: false
    };

    setCommunityProblems([newProblem, ...communityProblems]);
    toast.success("Problem posted successfully! NGOs can now respond.");
    setIsProblemDialogOpen(false);
    setNewProblemTitle("");
    setNewProblemDescription("");
    setNewProblemCategory("");
    setNewProblemLocation("");
  };

  const handleVoteProblem = (problemId: number) => {
    setCommunityProblems(communityProblems.map(p => 
      p.id === problemId 
        ? { ...p, upvotes: p.userVoted ? p.upvotes - 1 : p.upvotes + 1, userVoted: !p.userVoted }
        : p
    ));
  };

  const handleAddToCompare = (ngo: NGO) => {
    if (compareNGOs.find(n => n.id === ngo.id)) {
      setCompareNGOs(compareNGOs.filter(n => n.id !== ngo.id));
      toast.success("Removed from comparison");
    } else if (compareNGOs.length >= 3) {
      toast.error("You can compare maximum 3 NGOs");
    } else {
      setCompareNGOs([...compareNGOs, ngo]);
      toast.success("Added to comparison");
    }
  };

  const handleExportDonations = () => {
    toast.success("Donation history exported successfully!");
  };

  const handleGenerateCertificate = (donationId: number) => {
    toast.success("Tax certificate generated and downloaded!");
  };

  const handleSetDonationGoal = () => {
    if (!donationGoalAmount || !donationGoalDeadline) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success(`Donation goal of $${donationGoalAmount} set successfully!`);
    setIsDonationGoalDialogOpen(false);
  };

  const filteredNGOs = ngos.filter(ngo => {
    const matchesSearch = ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ngo.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || ngo.cause === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const sortedNGOs = [...filteredNGOs].sort((a, b) => {
    if (sortBy === "transparency") return b.transparencyScore - a.transparencyScore;
    if (sortBy === "raised") return b.raised - a.raised;
    if (sortBy === "donors") return b.donors - a.donors;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <UserNavbar links={navLinks} userName="John Doe" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 dark:bg-gray-800">
            <TabsTrigger value="explore" className="dark:data-[state=active]:bg-gray-700">Explore NGOs</TabsTrigger>
            <TabsTrigger value="donations" className="dark:data-[state=active]:bg-gray-700">My Donations</TabsTrigger>
            <TabsTrigger value="community" className="dark:data-[state=active]:bg-gray-700">Community</TabsTrigger>
            <TabsTrigger value="impact" className="dark:data-[state=active]:bg-gray-700">My Impact</TabsTrigger>
          </TabsList>

          {/* Explore NGOs Tab */}
          <TabsContent value="explore" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-gray-900 dark:text-white mb-2">Explore NGOs</h1>
                <p className="text-gray-600 dark:text-gray-300">Discover verified NGOs and make a transparent donation</p>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="rounded-lg dark:border-gray-600 dark:hover:bg-gray-700"
                  onClick={() => setIsCompareDialogOpen(true)}
                  disabled={compareNGOs.length === 0}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Compare ({compareNGOs.length})
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex gap-4 flex-wrap">
              <div className="relative flex-1 min-w-[250px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input 
                  placeholder="Search NGOs..." 
                  className="pl-10 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Water & Sanitation">Water & Sanitation</SelectItem>
                  <SelectItem value="Environment">Environment</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="transparency">Transparency Score</SelectItem>
                  <SelectItem value="raised">Funds Raised</SelectItem>
                  <SelectItem value="donors">Most Donors</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Favorites Section */}
            {ngos.filter(ngo => ngo.isFavorite).length > 0 && (
              <div className="mb-6">
                <h3 className="text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <BookmarkCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Your Favorites
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ngos.filter(ngo => ngo.isFavorite).map((ngo) => (
                    <NGOCard 
                      key={ngo.id} 
                      ngo={ngo} 
                      onDonate={(ngo) => {
                        setSelectedNGO(ngo);
                        setIsDonateDialogOpen(true);
                      }}
                      onToggleFavorite={handleToggleFavorite}
                      onAddToCompare={handleAddToCompare}
                      isInCompare={compareNGOs.some(n => n.id === ngo.id)}
                    />
                  ))}
                </div>
                <Separator className="my-6 dark:bg-gray-700" />
              </div>
            )}

            {/* All NGOs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedNGOs.map((ngo) => (
                <NGOCard 
                  key={ngo.id} 
                  ngo={ngo} 
                  onDonate={(ngo) => {
                    setSelectedNGO(ngo);
                    setIsDonateDialogOpen(true);
                  }}
                  onToggleFavorite={handleToggleFavorite}
                  onAddToCompare={handleAddToCompare}
                  isInCompare={compareNGOs.some(n => n.id === ngo.id)}
                />
              ))}
            </div>
          </TabsContent>

          {/* My Donations Tab */}
          <TabsContent value="donations" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-gray-900 dark:text-white mb-2">My Donations</h1>
                <p className="text-gray-600 dark:text-gray-300">Track your contributions and their impact</p>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="rounded-lg dark:border-gray-600 dark:hover:bg-gray-700"
                  onClick={handleExportDonations}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export History
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="rounded-xl border-none shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-700 dark:text-blue-300 text-sm">Total Donated</p>
                      <h3 className="text-blue-900 dark:text-blue-100 mt-1">${totalDonated}</h3>
                    </div>
                    <DollarSign className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-xl border-none shadow-sm bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-teal-700 dark:text-teal-300 text-sm">NGOs Supported</p>
                      <h3 className="text-teal-900 dark:text-teal-100 mt-1">{new Set(myDonations.map(d => d.ngoName)).size}</h3>
                    </div>
                    <Heart className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-xl border-none shadow-sm bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-700 dark:text-purple-300 text-sm">Donations</p>
                      <h3 className="text-purple-900 dark:text-purple-100 mt-1">{myDonations.length}</h3>
                    </div>
                    <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-xl border-none shadow-sm bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-700 dark:text-orange-300 text-sm">Impact Reports</p>
                      <h3 className="text-orange-900 dark:text-orange-100 mt-1">{myDonations.filter(d => d.impact).length}</h3>
                    </div>
                    <TrendingUp className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Donation History */}
            <Card className="rounded-xl border-none shadow-sm bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="dark:text-white">Donation History</CardTitle>
                <CardDescription className="dark:text-gray-400">Complete record of your contributions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myDonations.map((donation) => (
                    <div key={donation.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-gray-900 dark:text-white">{donation.ngoName}</h4>
                          <Badge variant="secondary" className="dark:bg-gray-600 dark:text-gray-300">{donation.category}</Badge>
                          <Badge 
                            className={
                              donation.status === "Impact Reported" 
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                : donation.status === "In Progress"
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                : "bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                            }
                          >
                            {donation.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{donation.date}</p>
                        {donation.impact && (
                          <p className="text-sm text-teal-600 dark:text-teal-400 mt-1">
                            <TrendingUp className="w-3 h-3 inline mr-1" />
                            {donation.impact}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <h4 className="text-teal-600 dark:text-teal-400">${donation.amount}</h4>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="mt-2 rounded-lg dark:border-gray-600 dark:hover:bg-gray-600"
                          onClick={() => handleGenerateCertificate(donation.id)}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Certificate
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-gray-900 dark:text-white mb-2">Community Problems</h1>
                <p className="text-gray-600 dark:text-gray-300">Post problems and connect with NGOs who can help</p>
              </div>
              <Dialog open={isProblemDialogOpen} onOpenChange={setIsProblemDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg gap-2">
                    <Plus className="w-4 h-4" />
                    Post Problem
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-xl dark:bg-gray-800 dark:border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="dark:text-white">Post a Community Problem</DialogTitle>
                    <DialogDescription className="dark:text-gray-400">
                      Share a problem and NGOs can propose solutions
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="problem-title" className="dark:text-gray-300">Problem Title</Label>
                      <Input 
                        id="problem-title" 
                        placeholder="Brief description of the problem" 
                        className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={newProblemTitle}
                        onChange={(e) => setNewProblemTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="problem-category" className="dark:text-gray-300">Category</Label>
                      <Select value={newProblemCategory} onValueChange={setNewProblemCategory}>
                        <SelectTrigger className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                          <SelectItem value="Water & Sanitation">Water & Sanitation</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Environment">Environment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="problem-location" className="dark:text-gray-300">Location</Label>
                      <Input 
                        id="problem-location" 
                        placeholder="City, State" 
                        className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={newProblemLocation}
                        onChange={(e) => setNewProblemLocation(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="problem-description" className="dark:text-gray-300">Detailed Description</Label>
                      <Textarea
                        id="problem-description"
                        placeholder="Explain the problem in detail..."
                        rows={5}
                        className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={newProblemDescription}
                        onChange={(e) => setNewProblemDescription(e.target.value)}
                      />
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg"
                      onClick={handlePostProblem}
                    >
                      Post Problem
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Community Problems List */}
            <div className="space-y-4">
              {communityProblems.map((problem) => (
                <Card key={problem.id} className="rounded-xl border-none shadow-sm bg-white dark:bg-gray-800">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                          <CardTitle className="dark:text-white">{problem.title}</CardTitle>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">{problem.category}</Badge>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{problem.location}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Posted by {problem.postedBy}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{problem.date}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`flex items-center gap-2 ${problem.userVoted ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                        onClick={() => handleVoteProblem(problem.id)}
                      >
                        <TrendingUp className="w-4 h-4" />
                        <span>{problem.upvotes}</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{problem.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{problem.responses} NGO responses</span>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-lg dark:border-gray-600 dark:hover:bg-gray-700">
                        View Responses
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Impact Tab */}
          <TabsContent value="impact" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-gray-900 dark:text-white mb-2">My Impact</h1>
                <p className="text-gray-600 dark:text-gray-300">See the difference you're making</p>
              </div>
              <Dialog open={isDonationGoalDialogOpen} onOpenChange={setIsDonationGoalDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="rounded-lg dark:border-gray-600 dark:hover:bg-gray-700">
                    <Target className="w-4 h-4 mr-2" />
                    Set Donation Goal
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-xl dark:bg-gray-800 dark:border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="dark:text-white">Set Your Donation Goal</DialogTitle>
                    <DialogDescription className="dark:text-gray-400">
                      Challenge yourself to make more impact
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="goal-amount" className="dark:text-gray-300">Goal Amount ($)</Label>
                      <Input 
                        id="goal-amount" 
                        type="number"
                        placeholder="1000" 
                        className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={donationGoalAmount}
                        onChange={(e) => setDonationGoalAmount(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="goal-deadline" className="dark:text-gray-300">Deadline</Label>
                      <Input 
                        id="goal-deadline" 
                        type="date"
                        className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={donationGoalDeadline}
                        onChange={(e) => setDonationGoalDeadline(e.target.value)}
                      />
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg"
                      onClick={handleSetDonationGoal}
                    >
                      Set Goal
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
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
          </TabsContent>
        </Tabs>
      </main>

      {/* Donation Dialog */}
      <Dialog open={isDonateDialogOpen} onOpenChange={setIsDonateDialogOpen}>
        <DialogContent className="rounded-xl dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Donate to {selectedNGO?.name}</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Your donation will make a real difference
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="dark:text-gray-300">Donation Amount ($)</Label>
              <Input 
                id="amount" 
                type="number" 
                placeholder="100" 
                className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Label htmlFor="anonymous" className="dark:text-gray-300">Donate anonymously</Label>
              <Switch 
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
              />
            </div>
            <div className="flex gap-3">
              <Button 
                className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg"
                onClick={handleDonate}
              >
                Donate Now
              </Button>
              <Button 
                variant="outline"
                className="flex-1 rounded-lg dark:border-gray-600 dark:hover:bg-gray-700"
                onClick={() => {
                  setSelectedNGO(selectedNGO);
                  setIsDonateDialogOpen(false);
                  setIsRecurringDialogOpen(true);
                }}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Set Recurring
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Recurring Donation Dialog */}
      <Dialog open={isRecurringDialogOpen} onOpenChange={setIsRecurringDialogOpen}>
        <DialogContent className="rounded-xl dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Set Up Recurring Donation</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Support {selectedNGO?.name} regularly
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="recurring-amount" className="dark:text-gray-300">Amount ($)</Label>
              <Input 
                id="recurring-amount" 
                type="number" 
                placeholder="50" 
                className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="dark:text-gray-300">Frequency</Label>
              <Select value={recurringFrequency} onValueChange={setRecurringFrequency}>
                <SelectTrigger className="rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg"
              onClick={handleRecurringDonation}
            >
              Set Up Recurring Donation
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Compare NGOs Dialog */}
      <Dialog open={isCompareDialogOpen} onOpenChange={setIsCompareDialogOpen}>
        <DialogContent className="rounded-xl dark:bg-gray-800 dark:border-gray-700 max-w-4xl">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Compare NGOs</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Side-by-side comparison of selected NGOs
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div className="grid grid-cols-3 gap-4">
              {compareNGOs.map((ngo) => (
                <Card key={ngo.id} className="rounded-xl border-none shadow-sm bg-white dark:bg-gray-800">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-sm dark:text-white">{ngo.name}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAddToCompare(ngo)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Transparency Score</p>
                      <p className="text-lg text-gray-900 dark:text-white">{ngo.transparencyScore}/100</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Funds Raised</p>
                      <p className="text-lg text-gray-900 dark:text-white">${ngo.raised.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Total Donors</p>
                      <p className="text-lg text-gray-900 dark:text-white">{ngo.donors}</p>
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg"
                      onClick={() => {
                        setSelectedNGO(ngo);
                        setIsCompareDialogOpen(false);
                        setIsDonateDialogOpen(true);
                      }}
                    >
                      Donate
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}






export default UserDashboard
