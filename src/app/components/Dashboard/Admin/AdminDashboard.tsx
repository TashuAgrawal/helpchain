"use client";
import { useState } from "react";
import {
  Check,
  X,
  Download,
  UserX,
  UserCheck,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { toast } from "sonner";
import Sidebar from "./Sidebar";
import StatCards from "./StatCards";
import DonationImpact from "./DonationImpact";
import Leaderboard from "./Leaderboard";
import RecentActivities from "./RecentActivities";
import UserFeedback from "./UserFeedback";
import ActiveNgos from "./ActiveNgos";
import AllUsers from "./AllUsers";
import NgoSearch from "./NgoSearch";
import TransactionsTable from "./TransactionsTable";
import PendingApprovals from "./PendeingApprovals";

interface PendingNGO {
  id: number;
  name: string;
  cause: string;
  submittedDate: string;
  email: string;
  progress: string;
  totalDonations: number;
  description: string;
  registrationNumber: string;
  address: string;
}

interface ActiveNGO {
  id: number;
  name: string;
  cause: string;
  donationsReceived: number;
  updates: { usage: string; date: string }[];
  email: string;
  status: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  totalDonations: number;
  donationCount: number;
  joinedDate: string;
  status: string;
  badge: string;
}

interface Transaction {
  id: number;
  donor: string;
  ngo: string;
  amount: number;
  date: string;
  status: string;
  utilization: string;
  category: string;
}


export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedNGO, setSelectedNGO] = useState<PendingNGO | ActiveNGO | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);

  const [pendingNGOs, setPendingNGOs] = useState<PendingNGO[]>([
    {
      id: 1,
      name: "Hope Foundation",
      cause: "Education",
      submittedDate: "2025-10-15",
      email: "contact@hopefoundation.org",
      progress: "Documents Verified",
      totalDonations: 5000,
      description: "Focused on providing quality education to underprivileged children in rural areas.",
      registrationNumber: "NGO-2024-001234",
      address: "123 Education St, Mumbai, Maharashtra"
    },
    {
      id: 2,
      name: "Green Earth Initiative",
      cause: "Environment",
      submittedDate: "2025-10-17",
      email: "info@greenearth.org",
      progress: "Pending Verification",
      totalDonations: 2800,
      description: "Environmental conservation and tree plantation drives across India.",
      registrationNumber: "NGO-2024-005678",
      address: "456 Green Ave, Bangalore, Karnataka"
    },
  ]);

  const [activeNGOs, setActiveNGOs] = useState<ActiveNGO[]>([
    {
      id: 3,
      name: "Clean Water Initiative",
      cause: "Water Access",
      donationsReceived: 10500,
      updates: [{ usage: "2 Wells constructed", date: "2025-10-18" }],
      email: "info@cleanwater.org",
      status: "active"
    },
    {
      id: 4,
      name: "Education for All",
      cause: "Education",
      donationsReceived: 7500,
      updates: [{ usage: "Distributed supplies to 100 students", date: "2025-10-17" }],
      email: "contact@educationforall.org",
      status: "active"
    },
    {
      id: 5,
      name: "Healthcare Access",
      cause: "Health",
      donationsReceived: 6000,
      updates: [{ usage: "Hosted medical camp for 500 villagers", date: "2025-10-16" }],
      email: "support@healthcareaccess.org",
      status: "active"
    },
  ]);

  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      totalDonations: 2500,
      donationCount: 8,
      joinedDate: "2025-01-15",
      status: "active",
      badge: "Gold Supporter"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      totalDonations: 6000,
      donationCount: 12,
      joinedDate: "2024-11-20",
      status: "active",
      badge: "Platinum Supporter"
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael@example.com",
      totalDonations: 450,
      donationCount: 5,
      joinedDate: "2025-03-10",
      status: "active",
      badge: "Silver Supporter"
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily@example.com",
      totalDonations: 8500,
      donationCount: 20,
      joinedDate: "2024-09-05",
      status: "active",
      badge: "Platinum Supporter"
    },
  ]);

  const [allTransactions, setAllTransactions] = useState<Transaction[]>([
    {
      id: 1,
      donor: "John Doe",
      ngo: "Clean Water Initiative",
      amount: 500,
      date: "2025-10-18",
      status: "Completed",
      utilization: "Used for well construction",
      category: "Water Access"
    },
    {
      id: 2,
      donor: "Sarah Johnson",
      ngo: "Education for All",
      amount: 1000,
      date: "2025-10-18",
      status: "Completed",
      utilization: "Funds used for student supplies",
      category: "Education"
    },
    {
      id: 3,
      donor: "Michael Brown",
      ngo: "Healthcare Access",
      amount: 250,
      date: "2025-10-17",
      status: "Completed",
      utilization: "Medical camp",
      category: "Health"
    },
    {
      id: 4,
      donor: "Emily Davis",
      ngo: "Clean Water Initiative",
      amount: 750,
      date: "2025-10-17",
      status: "Completed",
      utilization: "Well construction phase 2",
      category: "Water Access"
    },
  ]);

  const recentActivities = [
    { id: 1, type: "donation", description: "John Doe donated $500 to Clean Water Initiative", time: "2 hours ago" },
    { id: 2, type: "ngo_post", description: "Education for All posted a new update", time: "5 hours ago" },
    { id: 3, type: "approval", description: "Healthcare Access Program was approved", time: "1 day ago" },
    { id: 4, type: "donation", description: "Sarah Johnson donated $1000 to Healthcare Access", time: "1 day ago" },
    { id: 5, type: "ngo_post", description: "Clean Water Initiative posted campaign update", time: "2 days ago" },
  ];

  const userFeedbacks = [
    { user: "John Doe", feedback: "The donation impact update was great!", time: "1 hour ago", rating: 5 },
    { user: "Priya Sinha", feedback: "Would love more frequent updates from NGOs.", time: "Yesterday", rating: 4 },
  ];

  const totalDonations = allTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalUsers = users.length;
  const totalActiveNGOs = activeNGOs.length;

  const handleApproveNGO = (ngo: PendingNGO) => {
    const newActiveNGO: ActiveNGO = {
      id: ngo.id,
      name: ngo.name,
      cause: ngo.cause,
      donationsReceived: 0,
      updates: [],
      email: ngo.email,
      status: "active"
    };
    setActiveNGOs([...activeNGOs, newActiveNGO]);
    setPendingNGOs(pendingNGOs.filter(n => n.id !== ngo.id));
    toast.success(`${ngo.name} has been approved!`);
  };

  const handleRejectNGO = (ngoId: number) => {
    const ngo = pendingNGOs.find(n => n.id === ngoId);
    setPendingNGOs(pendingNGOs.filter(n => n.id !== ngoId));
    toast.error(`${ngo?.name} application has been rejected`);
  };

  const handleDeactivateNGO = (ngoId: number) => {
    setActiveNGOs(activeNGOs.map(ngo =>
      ngo.id === ngoId ? { ...ngo, status: "suspended" } : ngo
    ));
    toast.success("NGO has been suspended");
    setIsEditDialogOpen(false);
  };

  const handleSuspendUser = (userId: number) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, status: user.status === "active" ? "suspended" : "active" } : user
    ));
    const user = users.find(u => u.id === userId);
    toast.success(`${user?.name} status updated`);
    setIsUserDialogOpen(false);
  };

  const filteredTransactions = allTransactions.filter(transaction => {
    const matchesSearch =
      transaction.donor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.ngo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || transaction.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-300">
      <Sidebar
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        pendingNGOs={pendingNGOs}
      />
      <main className="ml-64 flex-1 p-8">
        {activeTab === "dashboard" && (
          <div>
            <div className="mb-8">
              <h1 className="text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300">Platform statistics plus recent donation impact & user feedback</p>
            </div>
            <StatCards
              totalDonations={totalDonations}
              totalActiveNGOs={totalActiveNGOs}
              totalUsers={totalUsers}
              pendingNGOs={pendingNGOs.length}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <DonationImpact activeNGOs={activeNGOs} />
              <Leaderboard activeNGOs={activeNGOs} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <RecentActivities recentActivities={recentActivities} />
              <UserFeedback userFeedbacks={userFeedbacks} />
            </div>
          </div>
        )}
        {activeTab === "ngos" && (
          <div>
            <div className="mb-8">
              <h1 className="text-gray-900 dark:text-white mb-2">Manage NGOs</h1>
              <p className="text-gray-600 dark:text-gray-300">Review, approve NGOs, and view their performance</p>
            </div>
            <PendingApprovals
              pendingNGOs={pendingNGOs}
              setIsViewDialogOpen={setIsViewDialogOpen}
              setSelectedNGO={setSelectedNGO}
            />
            <ActiveNgos
              activeNGOs={activeNGOs}
              setSelectedNGO={setSelectedNGO}
              setIsEditDialogOpen={setIsEditDialogOpen}
            />
          </div>
        )}
        {activeTab === "users" && (
          <div>
            <div className="mb-8">
              <h1 className="text-gray-900 dark:text-white mb-2">Manage Users</h1>
              <p className="text-gray-600 dark:text-gray-300">View, filter, and manage platform users</p>
            </div>
            <AllUsers
              users={users}
              setSelectedUser={setSelectedUser}
              setIsUserDialogOpen={setIsUserDialogOpen}
            />
          </div>
        )}
        {activeTab === "transactions" && (
          <div>
            <div className="mb-8">
              <h1 className="text-gray-900 dark:text-white mb-2">All Transactions</h1>
              <p className="text-gray-600 dark:text-gray-300">Full donation history with transparency</p>
            </div>
            <NgoSearch
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
            />
            <TransactionsTable filteredTransactions={filteredTransactions} />
          </div>
        )}
        {activeTab === "reports" && (
          <div>
            <div className="mb-8">
              <h1 className="text-gray-900 dark:text-white mb-2">Reports & Analytics</h1>
              <p className="text-gray-600 dark:text-gray-300">Download platform stats, impact, and feedback</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rounded-xl border-none shadow-sm bg-white dark:bg-gray-800 transition-colors duration-300">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Monthly Donation Report</CardTitle>
                  <CardDescription className="dark:text-gray-400">Breakdown of donations by NGO/cause</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg gap-2"
                    onClick={() => toast.success("Report downloaded successfully!")}
                  >
                    <Download className="w-4 h-4" />Download Report
                  </Button>
                </CardContent>
              </Card>
              <Card className="rounded-xl border-none shadow-sm bg-white dark:bg-gray-800 transition-colors duration-300">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Donation Impact Report</CardTitle>
                  <CardDescription className="dark:text-gray-400">Summary of funds utilization and outcomes</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg gap-2"
                    onClick={() => toast.success("Report downloaded successfully!")}
                  >
                    <Download className="w-4 h-4" />Download Report
                  </Button>
                </CardContent>
              </Card>
              <Card className="rounded-xl border-none shadow-sm bg-white dark:bg-gray-800 transition-colors duration-300">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">User Feedback Report</CardTitle>
                  <CardDescription className="dark:text-gray-400">User comments and ratings overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg gap-2"
                    onClick={() => toast.success("Report downloaded successfully!")}
                  >
                    <Download className="w-4 h-4" />Download Report
                  </Button>
                </CardContent>
              </Card>
              <Card className="rounded-xl border-none shadow-sm bg-white dark:bg-gray-800 transition-colors duration-300">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Platform Analytics</CardTitle>
                  <CardDescription className="dark:text-gray-400">Comprehensive statistics and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg gap-2"
                    onClick={() => toast.success("Report downloaded successfully!")}
                  >
                    <Download className="w-4 h-4" />Download Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="rounded-xl dark:bg-gray-800 dark:border-gray-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="dark:text-white">NGO Details</DialogTitle>
            <DialogDescription className="dark:text-gray-400">Complete information about the NGO application</DialogDescription>
          </DialogHeader>
          {selectedNGO && 'registrationNumber' in selectedNGO && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600 dark:text-gray-400">NGO Name</Label>
                  <p className="text-gray-900 dark:text-white mt-1">{selectedNGO.name}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600 dark:text-gray-400">Cause</Label>
                  <p className="text-gray-900 dark:text-white mt-1">{selectedNGO.cause}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600 dark:text-gray-400">Email</Label>
                  <p className="text-gray-900 dark:text-white mt-1">{selectedNGO.email}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600 dark:text-gray-400">Registration Number</Label>
                  <p className="text-gray-900 dark:text-white mt-1">{selectedNGO.registrationNumber}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm text-gray-600 dark:text-gray-400">Address</Label>
                  <p className="text-gray-900 dark:text-white mt-1">{selectedNGO.address}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm text-gray-600 dark:text-gray-400">Description</Label>
                  <p className="text-gray-900 dark:text-white mt-1">{selectedNGO.description}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600 dark:text-gray-400">Submitted Date</Label>
                  <p className="text-gray-900 dark:text-white mt-1">{selectedNGO.submittedDate}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600 dark:text-gray-400">Verification Status</Label>
                  <p className="text-gray-900 dark:text-white mt-1">{selectedNGO.progress}</p>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 rounded-lg"
                  onClick={() => {
                    handleApproveNGO(selectedNGO);
                    setIsViewDialogOpen(false);
                  }}
                >
                  <Check className="w-4 h-4 mr-2" />Approve NGO
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-red-600 border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20 rounded-lg"
                  onClick={() => {
                    handleRejectNGO(selectedNGO.id);
                    setIsViewDialogOpen(false);
                  }}
                >
                  <X className="w-4 h-4 mr-2" />Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="rounded-xl dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Manage NGO</DialogTitle>
            <DialogDescription className="dark:text-gray-400">Update NGO status and settings</DialogDescription>
          </DialogHeader>
          {selectedNGO && 'status' in selectedNGO && (
            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-sm text-gray-600 dark:text-gray-400">NGO Name</Label>
                <p className="text-gray-900 dark:text-white mt-1">{selectedNGO.name}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600 dark:text-gray-400">Email</Label>
                <p className="text-gray-900 dark:text-white mt-1">{selectedNGO.email}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600 dark:text-gray-400">Total Donations</Label>
                <p className="text-gray-900 dark:text-white mt-1">${selectedNGO.donationsReceived.toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600 dark:text-gray-400">Current Status</Label>
                <Badge
                  className={`mt-1 ${selectedNGO.status === "active"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"}`}
                >
                  {selectedNGO.status}
                </Badge>
              </div>
              <div className="pt-4">
                {selectedNGO.status === "active" ? (
                  <Button
                    variant="outline"
                    className="w-full text-red-600 border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20 rounded-lg"
                    onClick={() => handleDeactivateNGO(selectedNGO.id)}
                  >
                    <UserX className="w-4 h-4 mr-2" />Suspend NGO
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 rounded-lg"
                    onClick={() => {
                      setActiveNGOs(activeNGOs.map(ngo =>
                        ngo.id === selectedNGO.id ? { ...ngo, status: "active" } : ngo
                      ));
                      toast.success("NGO reactivated successfully");
                      setIsEditDialogOpen(false);
                    }}
                  >
                    <UserCheck className="w-4 h-4 mr-2" />Reactivate NGO
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="rounded-xl dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">User Details</DialogTitle>
            <DialogDescription className="dark:text-gray-400">View and manage user account</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600 dark:text-gray-400">Name</Label>
                  <p className="text-gray-900 dark:text-white mt-1">{selectedUser.name}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600 dark:text-gray-400">Email</Label>
                  <p className="text-gray-900 dark:text-white mt-1">{selectedUser.email}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600 dark:text-gray-400">Total Donated</Label>
                  <p className="text-teal-600 dark:text-teal-400 mt-1">${selectedUser.totalDonations.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600 dark:text-gray-400">Donation Count</Label>
                  <p className="text-gray-900 dark:text-white mt-1">{selectedUser.donationCount}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600 dark:text-gray-400">Joined Date</Label>
                  <p className="text-gray-900 dark:text-white mt-1">{selectedUser.joinedDate}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600 dark:text-gray-400">Badge</Label>
                  <Badge className="mt-1 dark:bg-gray-700 dark:text-gray-300">{selectedUser.badge}</Badge>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm text-gray-600 dark:text-gray-400">Account Status</Label>
                  <Badge
                    className={`mt-1 ${selectedUser.status === "active"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"}`}
                  >
                    {selectedUser.status}
                  </Badge>
                </div>
              </div>
              <div className="pt-4">
                {selectedUser.status === "active" ? (
                  <Button
                    variant="outline"
                    className="w-full text-red-600 border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20 rounded-lg"
                    onClick={() => handleSuspendUser(selectedUser.id)}
                  >
                    <UserX className="w-4 h-4 mr-2" />Suspend User
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 rounded-lg"
                    onClick={() => handleSuspendUser(selectedUser.id)}
                  >
                    <UserCheck className="w-4 h-4 mr-2" />Reactivate User
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}