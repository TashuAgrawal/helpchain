// src/app/components/user-dashboard/UserDashboard.tsx
import { JSX, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { toast } from "sonner";
import { UserNavbar } from "@/app/components/Navbar/UserNavbar/UserNavbar";
import { NGO, MyDonation, CommunityProblem, UserBadge } from "./types";
import { ExploreTab } from "./tabs/ExploreTab";
import { DonationsTab } from "./tabs/DonationsTab";
import { CommunityTab } from "./tabs/CommunityTab";
import { ImpactTab } from "./tabs/ImpactTab";
import { DonateDialog } from "./dialogs/DonateDialog";
import { RecurringDialog } from "./dialogs/RecurringDialog";
import { CompareDialog } from "./dialogs/CompareDialog";
import { PostProblemDialog } from "./dialogs/PostProblemDialog";
import { DonationGoalDialog } from "./dialogs/DonationGoalDialog";
import fetchAllCampaigns from "@/Helper/UserServices/GetAllCampaigns"
import fetchApprovedNgos from "@/Helper/AdminServices/Approvedngos"
import postCommunityProblem from "@/Helper/UserServices/PostProblem"
import fetchAllCommunityProblems from "@/Helper/NgoServices/GetAllProblems"
import toggleBookmark from "@/Helper/UserServices/ToggleBookmark"
import addTransaction from "@/Helper/UserServices/AddTransactions"
import fetchUserTransactionsById from "@/Helper/UserServices/GetMyTransactions"

const userBadgesList: UserBadge[] = [
  {
    id: 1,
    name: "Bronze Supporter",
    icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.392 4.278a1 1 0 00.95.69h4.505c.969 0 1.371 1.24.588 1.81l-3.647 2.64a1 1 0 00-.364 1.118l1.392 4.278c.3.92-.755 1.688-1.538 1.118l-3.647-2.64a1 1 0 00-1.176 0l-3.647 2.64c-.783.57-1.838-.197-1.538-1.118l1.392-4.278a1 1 0 00-.364-1.118L2.623 9.705c-.783-.57-.38-1.81.588-1.81h4.505a1 1 0 00.95-.69l1.392-4.278z" /></svg>,
    threshold: 100,
    description: "Donated at least ₹100",
    colorClass: "text-orange-600 dark:text-orange-400",
  },
  {
    id: 2,
    name: "Silver Supporter",
    icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.392 4.278a1 1 0 00.95.69h4.505c.969 0 1.371 1.24.588 1.81l-3.647 2.64a1 1 0 00-.364 1.118l1.392 4.278c.3.92-.755 1.688-1.538 1.118l-3.647-2.64a1 1 0 00-1.176 0l-3.647 2.64c-.783.57-1.838-.197-1.538-1.118l1.392-4.278a1 1 0 00-.364-1.118L2.623 9.705c-.783-.57-.38-1.81.588-1.81h4.505a1 1 0 00.95-.69l1.392-4.278z" /></svg>,
    threshold: 500,
    description: "Donated at least ₹500",
    colorClass: "text-gray-500 dark:text-gray-400",
  },
  {
    id: 3,
    name: "Gold Supporter",
    icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.392 4.278a1 1 0 00.95.69h4.505c.969 0 1.371 1.24.588 1.81l-3.647 2.64a1 1 0 00-.364 1.118l1.392 4.278c.3.92-.755 1.688-1.538 1.118l-3.647-2.64a1 1 0 00-1.176 0l-3.647 2.64c-.783.57-1.838-.197-1.538-1.118l1.392-4.278a1 1 0 00-.364-1.118L2.623 9.705c-.783-.57-.38-1.81.588-1.81h4.505a1 1 0 00.95-.69l1.392-4.278z" /></svg>,
    threshold: 1000,
    description: "Donated ₹1000 or more",
    colorClass: "text-yellow-500 dark:text-yellow-400",
  },
  {
    id: 4,
    name: "Platinum Supporter",
    icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.392 4.278a1 1 0 00.95.69h4.505c.969 0 1.371 1.24.588 1.81l-3.647 2.64a1 1 0 00-.364 1.118l1.392 4.278c.3.92-.755 1.688-1.538 1.118l-3.647-2.64a1 1 0 00-1.176 0l-3.647 2.64c-.783.57-1.838-.197-1.538-1.118l1.392-4.278a1 1 0 00-.364-1.118L2.623 9.705c-.783-.57-.38-1.81.588-1.81h4.505a1 1 0 00.95-.69l1.392-4.278z" /></svg>,
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
  const [isDonationGoalDialogOpen, setIsDonationGoalDialogOpen] = useState(false);
  const [donationGoalAmount, setDonationGoalAmount] = useState("");
  const [donationGoalDeadline, setDonationGoalDeadline] = useState("");
  const [activeNGOs, setActiveNGOs] = useState<NGO[]>([]);
  const [communityProblems, setCommunityProblems] = useState<CommunityProblem[]>([]);
  const [myDonations, setMyDonations] = useState<MyDonation[]>([]);
  const totalDonated = myDonations.reduce((sum, d) => sum + d.amount, 0);
  const earnedBadges = userBadgesList.filter((b) => totalDonated >= b.threshold);
  const favoriteNGOs = activeNGOs.filter(ngo => ngo.isFavorite);

  useEffect(() => {
    async function fetchData() {
      try {

        let userId;
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const userObj = JSON.parse(userStr);
          userId = userObj?.user.mongoId;
        }

        const result = await fetchApprovedNgos();
        const mappedActiveNgos: NGO[] = result.map((ngo: any) => ({
          id: ngo._id,
          name: ngo.name,
          cause: ngo.cause,
          donationsReceived: ngo.totalDonations ?? 0,
          updates: ngo.updates ?? [],
          email: ngo.email,
          status: ngo.status,
          address: ngo.address,
          isFavorite: false,
          description: ngo.description
        }));
        setActiveNGOs(mappedActiveNgos);
        const result2 = await fetchAllCommunityProblems();
        const mappedProblems: CommunityProblem[] = result2.map((problem: any) => ({
          id: problem._id,
          title: problem.title,
          description: problem.description,
          category: problem.category,
          postedBy: problem.postedBy,
          date: problem.date,
          location: problem.location,
          responses: problem.responses,
          upvotes: problem.upvotes,
          userVoted: problem.userVoted,
        }));
        setCommunityProblems(mappedProblems);

        const result3 = await fetchUserTransactionsById(userId);
        console.log(result3);
        const mappedTransactions: MyDonation[] = result3.map((txn:any) => ({
          id: txn._id, 
          ngoName: "<Fetch NGO Name>",
          amount: txn.amount,
          date: txn.date,
          status: "completed",       
          category: "<Fetch Category>", 
          impact: undefined,         
        }));

        setMyDonations(mappedTransactions)


      } catch (err) {
        console.error("Error fetching NGOs:", err);
      }
    }
    fetchData();
  }, []);



  

  const navLinks = [
    { label: "Explore NGOs", href: "#explore" },
    { label: "My Donations", href: "#donations" },
    { label: "Community", href: "#community" },
    { label: "My Impact", href: "#impact" },
  ];
  const handleDonateClick = (ngo: NGO) => {
    setSelectedNGO(ngo);
    setIsDonateDialogOpen(true);
  };

  const handleSetRecurringClick = () => {
    setIsDonateDialogOpen(false);
    setIsRecurringDialogOpen(true);
  };

  const handleDonate = async () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      toast.error("Please enter a valid donation amount");
      return;
    }

    console.log(selectedNGO);

    try {
      let userId;
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const userObj = JSON.parse(userStr);
        userId = userObj?.user.mongoId;
      }

      const result = await addTransaction({
        donor: userId,
        ngo: selectedNGO?.id,
        amount: parseInt(donationAmount),
      })

      console.log(result);
      const mappedDonation: MyDonation = {
        id: result.transaction._id,
        ngoName: selectedNGO?.name || "",
        amount: result.transaction.amount,
        date: result.transaction.date,
        status: "completed",
        category: "",
        impact: undefined,
      };


      setMyDonations([mappedDonation, ...myDonations]);


    } catch (error) {

    }
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

  const handleToggleFavorite = async (ngoId: string) => {
    try {

      let userId;
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const userObj = JSON.parse(userStr);
        userId = userObj?.user.mongoId;
      }
      const result = await toggleBookmark(userId, ngoId);
      console.log(result);
      setActiveNGOs((prevNgos) =>
        prevNgos.map((ngo) =>
          ngo.id === ngoId ? { ...ngo, isFavorite: result.bookmarked } : ngo
        )
      );
    } catch (error) {

    }
  };

  const handlePostProblem = async () => {
    if (
      !newProblemTitle ||
      !newProblemDescription ||
      !newProblemCategory ||
      !newProblemLocation
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    let userId;
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userObj = JSON.parse(userStr);
      userId = userObj?.user.mongoId;
    }

    const newProblem: Omit<CommunityProblem, "id"> = {
      title: newProblemTitle,
      description: newProblemDescription,
      category: newProblemCategory,
      postedBy: userId,
      date: new Date().toISOString(),
      location: newProblemLocation,
      responses: 0,
      upvotes: 0,
      userVoted: false,
    };

    try {
      const savedProblem = await postCommunityProblem(newProblem);
      const mappedProblem: CommunityProblem = {
        id: savedProblem.problem._id,
        title: savedProblem.problem.title,
        description: savedProblem.problem.description,
        category: savedProblem.problem.category,
        postedBy: savedProblem.problem.postedBy,
        date: savedProblem.problem.date,
        location: savedProblem.problem.location,
        responses: savedProblem.problem.responses,
        upvotes: savedProblem.problem.upvotes,
        userVoted: savedProblem.problem.userVoted,
      };
      setCommunityProblems([mappedProblem, ...communityProblems]);
      toast.success("Problem posted successfully! NGOs can now respond.");
      setIsProblemDialogOpen(false);
      setNewProblemTitle("");
      setNewProblemDescription("");
      setNewProblemCategory("");
      setNewProblemLocation("");
    } catch (error) {
      console.error("Failed to post community problem:", error);
      toast.error("Failed to post problem. Please try again.");
    }
  };

  const handleVoteProblem = (problemId: string) => {
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
              sortedNGOs={activeNGOs}
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