// src/app/components/user-dashboard/UserDashboard.tsx
import { JSX, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { toast } from "sonner";
import { UserNavbar } from "@/app/components/Navbar/UserNavbar/UserNavbar";

// Import Types
import { NGO, MyDonation, CommunityProblem, UserBadge } from "./types";

// Import Tab Content Components
import { ExploreTab } from "./tabs/ExploreTab";
import { DonationsTab } from "./tabs/DonationsTab";
import { CommunityTab } from "./tabs/CommunityTab";
import { ImpactTab } from "./tabs/ImpactTab";

// Import Dialog Components
import { DonateDialog } from "./dialogs/DonateDialog";
import { RecurringDialog } from "./dialogs/RecurringDialog";
import { CompareDialog } from "./dialogs/CompareDialog";
import { PostProblemDialog } from "./dialogs/PostProblemDialog";
import { DonationGoalDialog } from "./dialogs/DonationGoalDialog";

// Define badge data (could also be in types.ts or a separate data file)
const userBadgesList: UserBadge[] = [
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
  const [isReferralDialogOpen, setIsReferralDialogOpen] = useState(false); // This state seems unused, but kept it
  const [isDonationGoalDialogOpen, setIsDonationGoalDialogOpen] = useState(false);
  const [donationGoalAmount, setDonationGoalAmount] = useState("");
  const [donationGoalDeadline, setDonationGoalDeadline] = useState("");

  // Data State
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
    // ... other NGOs
  ]);

  const [myDonations, setMyDonations] = useState<MyDonation[]>([
    { id: 1, ngoName: "Clean Water Initiative", amount: 500, date: "2025-10-01", status: "Impact Reported", impact: "Helped build 0.5 wells", category: "Water & Sanitation" },
    { id: 2, ngoName: "Education for All", amount: 1000, date: "2025-09-15", status: "Impact Reported", impact: "Provided supplies for 10 students", category: "Education" },
    // ... other donations
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
    // ... other problems
  ]);

  // Derived State
  const totalDonated = myDonations.reduce((sum, d) => sum + d.amount, 0);
  const earnedBadges = userBadgesList.filter((b) => totalDonated >= b.threshold);
  const favoriteNGOs = ngos.filter(ngo => ngo.isFavorite);

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

  const navLinks = [
    { label: "Explore NGOs", href: "#explore" },
    { label: "My Donations", href: "#donations" },
    { label: "Community", href: "#community" },
    { label: "My Impact", href: "#impact" },
  ];

  // --- Handlers ---

  const handleDonateClick = (ngo: NGO) => {
    setSelectedNGO(ngo);
    setIsDonateDialogOpen(true);
  };

  const handleSetRecurringClick = () => {
    // selectedNGO is already set from handleDonateClick
    setIsDonateDialogOpen(false);
    setIsRecurringDialogOpen(true);
  };

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
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
        toast.error("Please enter a valid donation amount");
        return;
    }
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

          <TabsContent value="explore">
            <ExploreTab
              sortedNGOs={sortedNGOs}
              favoriteNGOs={favoriteNGOs}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              compareNGOs={compareNGOs}
              setIsCompareDialogOpen={setIsCompareDialogOpen}
              onDonate={handleDonateClick}
              onToggleFavorite={handleToggleFavorite}
              onAddToCompare={handleAddToCompare}
            />
          </TabsContent>

          <TabsContent value="donations">
            <DonationsTab
              totalDonated={totalDonated}
              myDonations={myDonations}
              handleExportDonations={handleExportDonations}
              handleGenerateCertificate={handleGenerateCertificate}
            />
          </TabsContent>

          <TabsContent value="community">
            <CommunityTab
              communityProblems={communityProblems}
              setIsProblemDialogOpen={setIsProblemDialogOpen}
              handleVoteProblem={handleVoteProblem}
            />
          </TabsContent>

          <TabsContent value="impact">
            <ImpactTab
              totalDonated={totalDonated}
              myDonations={myDonations}
              userBadges={userBadgesList}
              earnedBadges={earnedBadges}
              setIsDonationGoalDialogOpen={setIsDonationGoalDialogOpen}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* --- All Dialogs --- */}
      {/* They live here at the top level, controlled by state */}

      <DonateDialog
        isOpen={isDonateDialogOpen}
        onOpenChange={setIsDonateDialogOpen}
        selectedNGO={selectedNGO}
        donationAmount={donationAmount}
        setDonationAmount={setDonationAmount}
        isAnonymous={isAnonymous}
        setIsAnonymous={setIsAnonymous}
        handleDonate={handleDonate}
        onSetRecurring={handleSetRecurringClick}
      />

      <RecurringDialog
        isOpen={isRecurringDialogOpen}
        onOpenChange={setIsRecurringDialogOpen}
        selectedNGO={selectedNGO}
        donationAmount={donationAmount}
        setDonationAmount={setDonationAmount}
        recurringFrequency={recurringFrequency}
        setRecurringFrequency={setRecurringFrequency}
        handleRecurringDonation={handleRecurringDonation}
      />

      <CompareDialog
        isOpen={isCompareDialogOpen}
        onOpenChange={setIsCompareDialogOpen}
        compareNGOs={compareNGOs}
        handleAddToCompare={handleAddToCompare}
        onDonate={handleDonateClick}
      />

      <PostProblemDialog
        isOpen={isProblemDialogOpen}
        onOpenChange={setIsProblemDialogOpen}
        newProblemTitle={newProblemTitle}
        setNewProblemTitle={setNewProblemTitle}
        newProblemDescription={newProblemDescription}
        setNewProblemDescription={setNewProblemDescription}
        newProblemCategory={newProblemCategory}
        setNewProblemCategory={setNewProblemCategory}
        newProblemLocation={newProblemLocation}
        setNewProblemLocation={setNewProblemLocation}
        handlePostProblem={handlePostProblem}
      />

      <DonationGoalDialog
        isOpen={isDonationGoalDialogOpen}
        onOpenChange={setIsDonationGoalDialogOpen}
        donationGoalAmount={donationGoalAmount}
        setDonationGoalAmount={setDonationGoalAmount}
        donationGoalDeadline={donationGoalDeadline}
        setDonationGoalDeadline={setDonationGoalDeadline}
        handleSetDonationGoal={handleSetDonationGoal}
      />
    </div>
  );
}

export default UserDashboard;