// src/app/ngos/[ngoid]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Campaign } from "@/app/components/Dashboard/Ngo/types";
import { FileText, Heart, Calendar, Star, UserPlus, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Progress } from "@/app/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Textarea } from "@/app/components/ui/textarea";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import fetchCampaignsByNgo from "@/Helper/NgoServices/GetMyCampaign";
import addFeedback from "@/Helper/UserServices/addFeedback";
import { UserNavbar } from "@/app/components/Navbar/UserNavbar/UserNavbar";
import getUserRating from "@/Helper/UserServices/GetUserRating";
import addRating from "@/Helper/UserServices/AddRating";
import { toast } from "sonner";
import addTransaction from "@/Helper/UserServices/AddTransactions";
import toggleFollowNGO from "@/Helper/UserServices/ToggleFollowing";
import UpdateRaisedAmount from "@/Helper/NgoServices/UpdateRaised";
import CheckFollowing from "@/Helper/UserServices/CheckFollowing"

export default function NGOPage() {
    const { ngoid } = useParams() as { ngoid: string };

    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [isDonateOpen, setIsDonateOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const [donationAmount, setDonationAmount] = useState("");
    const [rating, setRating] = useState(0);
    const [feedbackText, setFeedbackText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDonating, setIsDonating] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followerCount, setFollowerCount] = useState(1247);

    const navLinks = [
        { label: "Explore NGOs", href: "#explore" },
        { label: "My Donations", href: "#donations" },
        { label: "Community", href: "#community" },
        { label: "My Impact", href: "#impact" },
    ];

    useEffect(() => {
        if (!ngoid) return;

        async function load() {
            const campaignsData = await fetchCampaignsByNgo(ngoid);
            const formatted = campaignsData.map((c: any) => ({
                id: c._id,
                title: c.title,
                goal: c.goal,
                raised: c.raised,
                donors: c.donors,
                status: c.status,
                lastUpdate: c.lastUpdate,
                description: c.description,
                startDate: c.startDate,
                ngoId: c.ngoId,
                endDate: c.endDate,
            }));

            setCampaigns(formatted);

            const userStr = localStorage.getItem("user");
            if (!userStr) return;

            const userId = JSON.parse(userStr)?.user?.mongoId;
            if (!userId) return;

            const fetchedRating = await getUserRating(ngoid, userId);
            const previousRating = fetchedRating?.rating?.rating || 0;

            localStorage.setItem("addedRating", String(previousRating));
            setRating(previousRating);

            const followresult = await CheckFollowing(userId , ngoid);
            console.log(followresult);

            setFollowerCount(followresult.followerCount);
            setIsFollowing(followresult.isFollowing)
            
        }

        load();
    }, [ngoid]);

    // ✅ FOLLOW/UNFOLLOW TOGGLE FUNCTION
    const handleFollowToggle = async () => {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
            toast.error("User not found");
            return;
        }

        const userId = JSON.parse(userStr)?.user?.mongoId;
        if (!userId) {
            toast.error("User not found");
            return;
        }

        try {
            const response = await toggleFollowNGO(userId, ngoid);


            if (isFollowing) {
                setIsFollowing(!isFollowing);
                setFollowerCount(followerCount - 1);
            } else {
                setIsFollowing(!isFollowing);
                setFollowerCount(followerCount + 1);
            }
            console.log(response);

            toast.success(
                response.data.action === 'followed'
                    ? 'Following NGO!'
                    : 'Unfollowed NGO'
            );
        } catch (error) {
            console.error("Toggle error:", error);
            toast.error("Failed to update follow status");
        }
    };

    const handleSubmitFeedback = async () => {
        setIsSubmitting(true);

        const userStr = localStorage.getItem("user");
        if (!userStr) return alert("User not found");

        const userId = JSON.parse(userStr)?.user?.mongoId;
        if (!userId) return alert("User not found");

        if (feedbackText) {
            await addFeedback({
                text: feedbackText,
                userId: userId,
                ngoId: ngoid,
            });
        }

        const storedRating = localStorage.getItem("addedRating");

        if (storedRating !== String(rating)) {
            await addRating({
                rating: rating,
                userId: userId,
                ngoId: ngoid,
            });

            localStorage.setItem("addedRating", String(rating));
        }

        alert("Feedback submitted");
        setIsFeedbackOpen(false);
        setFeedbackText("");
        setIsSubmitting(false);
    };

    const handleDonate = (campaign: Campaign) => {
        setSelectedCampaign(campaign);
        setDonationAmount("");
        setIsDonateOpen(true);
    };

    const handleSubmitDonation = async () => {
        if (!selectedCampaign || !donationAmount || parseInt(donationAmount) <= 0) {
            toast.error("Please enter a valid donation amount");
            return;
        }

        setIsDonating(true);

        try {
            let userId;
            const userStr = localStorage.getItem("user");
            if (userStr) {
                const userObj = JSON.parse(userStr);
                userId = userObj?.user.mongoId;
            }

            if (!userId) {
                toast.error("User not found");
                return;
            }

            const remaining = selectedCampaign.goal - selectedCampaign.raised;
            if (parseInt(donationAmount) > remaining) {
                toast.error(`Maximum donation allowed is $${remaining}`);
                return;
            }

            const amount = parseInt(donationAmount);
            const result = await addTransaction({
                donor: userId,
                ngo: ngoid,
                campaignid: selectedCampaign.id,
                amount: amount,
            });

            const temp = await UpdateRaisedAmount({
                campaignId:selectedCampaign.id, amount:amount
            });

            console.log(temp);

            console.log(result);

            // ✅ UPDATE LOCAL CAMPAIGN STATE (no refetch)
            setCampaigns((prevCampaigns) =>
                prevCampaigns.map((campaign) =>
                    campaign.id === selectedCampaign.id
                        ? {
                            ...campaign,
                            raised: campaign.raised + amount,
                            donors: campaign.donors + 1,
                        }
                        : campaign
                )
            );

            toast.success(`Successfully donated $${donationAmount} to ${selectedCampaign.title}!`);
        } catch (error) {
            console.error("Donation error:", error);
            toast.error("Donation failed. Please try again.");
        } finally {
            setIsDonating(false);
            setIsDonateOpen(false);
            setDonationAmount("");
            setSelectedCampaign(null);
        }
    };

    const handleStarClick = (value: number) => setRating(value);
    const progress = (raised: number, goal: number) => (raised / goal) * 100;

    return (
        <div className="dark:bg-gray-900 min-h-screen">
            <UserNavbar links={navLinks} userName="User" />

            <div className="max-w-6xl mx-auto py-8 px-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 text-white">NGO Campaigns</h1>
                        <p className="text-xl text-gray-300">Support their important causes</p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl px-6"
                            onClick={() => setIsFeedbackOpen(true)}
                        >
                            <Star className="w-4 h-4 mr-2" />
                            Give Feedback
                        </Button>
                        {/* ✅ FUNCTIONAL FOLLOW BUTTON */}
                        <Button
                            variant="outline"
                            className={`rounded-xl px-6 border-gray-600 text-gray-200 hover:bg-gray-700 hover:text-white transition-all ${isFollowing
                                    ? 'bg-green-600 border-green-500 text-white hover:bg-green-500 shadow-md'
                                    : 'border-gray-600'
                                }`}
                            onClick={handleFollowToggle}
                            disabled={isDonating || isSubmitting}
                        >
                            <UserPlus className={`w-4 h-4 mr-2 ${isFollowing ? 'text-white' : 'text-gray-300'}`} />
                            <span className={isFollowing ? 'font-medium' : ''}>
                                {isFollowing ? 'Following' : 'Follow'} ({followerCount.toLocaleString()})
                            </span>
                        </Button>
                    </div>
                </div>

                {/* Feedback Dialog */}
                <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
                    <DialogContent className="rounded-xl max-w-md bg-gray-800 border-gray-700">
                        <DialogHeader>
                            <DialogTitle className="text-white">Give Feedback & Rating</DialogTitle>
                            <DialogDescription className="text-gray-400">
                                Share your experience
                            </DialogDescription>
                        </DialogHeader>

                        <div className="mt-4 space-y-4">
                            <div>
                                <Label className="text-gray-200">Rating</Label>
                                <div className="flex gap-1 mt-1">
                                    {[5, 4, 3, 2, 1].map((v) => (
                                        <button
                                            key={v}
                                            type="button"
                                            disabled={isSubmitting}
                                            onClick={() => handleStarClick(v)}
                                            className={`p-1 ${rating >= v ? "text-yellow-400" : "text-gray-500"}`}
                                        >
                                            <Star className={`w-7 h-7 ${rating >= v ? "fill-current" : ""}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Label className="text-gray-200">Feedback (Optional)</Label>
                                <Textarea
                                    value={feedbackText}
                                    onChange={(e) => setFeedbackText(e.target.value)}
                                    rows={4}
                                    className="bg-gray-700 border-gray-600 text-white"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    className="flex-1 border-gray-600 text-gray-200"
                                    onClick={() => setIsFeedbackOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600"
                                    disabled={rating === 0 || isSubmitting}
                                    onClick={handleSubmitFeedback}
                                >
                                    {isSubmitting ? "Submitting..." : "Submit"}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Donate Dialog - UNCHANGED */}
                <Dialog open={isDonateOpen} onOpenChange={setIsDonateOpen}>
                    <DialogContent className="rounded-xl max-w-md bg-gray-800 border-gray-700">
                        <DialogHeader>
                            <DialogTitle className="text-white">
                                <DollarSign className="w-6 h-6 inline mr-2 text-green-400" />
                                Donate to {selectedCampaign?.title}
                            </DialogTitle>
                            <DialogDescription className="text-gray-400">
                                Enter the amount you wish to contribute
                            </DialogDescription>
                        </DialogHeader>

                        <div className="mt-4 space-y-4">
                            <div>
                                <Label className="text-gray-200">Amount</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg font-mono">$</span>
                                    <Input
                                        type="number"
                                        step="1"
                                        min="1"
                                        max={selectedCampaign ? (selectedCampaign.goal - selectedCampaign.raised) : undefined}
                                        placeholder="0"
                                        value={donationAmount}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d*$/.test(value)) {
                                                setDonationAmount(value);
                                            }
                                        }}
                                        className="bg-gray-700 border-gray-600 text-white text-lg pl-8 pr-4"
                                    />
                                </div>
                            </div>

                            {selectedCampaign && (
                                <div className="text-xs text-gray-400 p-3 bg-gray-900/50 rounded-lg border border-gray-600">
                                    <div className="flex justify-between">
                                        <span>Campaign goal:</span>
                                        <span className="font-mono">${selectedCampaign.goal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between mt-1">
                                        <span>Raised:</span>
                                        <span className="font-mono">${selectedCampaign.raised.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between font-semibold text-green-400 mt-1">
                                        <span>Remaining:</span>
                                        <span className="font-mono">${(selectedCampaign.goal - selectedCampaign.raised).toLocaleString()}</span>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    className="flex-1 border-gray-600 text-gray-200"
                                    onClick={() => setIsDonateOpen(false)}
                                    disabled={isDonating}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
                                    disabled={!donationAmount || isDonating}
                                    onClick={handleSubmitDonation}
                                >
                                    {isDonating ? (
                                        <>
                                            <DollarSign className="w-4 h-4 mr-2 animate-pulse" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Heart className="w-4 h-4 mr-2" />
                                            Donate Now
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {campaigns.map((c) => {
                        const p = progress(c.raised, c.goal);

                        return (
                            <Card
                                key={c.id}
                                className="rounded-xl bg-gray-800 border-gray-700 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-gray-700/30"
                            >
                                <CardHeader>
                                    <CardTitle className="text-white">{c.title}</CardTitle>
                                    <div className="flex gap-2 mt-2">
                                        <Badge className={c.status === "Active" ? "bg-green-800" : "bg-gray-600"}>
                                            {c.status}
                                        </Badge>
                                        <Badge className="bg-gray-700">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            {c.startDate}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-300">Progress</span>
                                            <span className="text-white">
                                                ${c.raised} / ${c.goal}
                                            </span>
                                        </div>
                                        <Progress
                                            value={p}
                                            className="h-2 bg-gray-700 [&>div]:from-blue-600 [&>div]:to-teal-600"
                                        />
                                        <div className="flex justify-between text-xs mt-1 text-gray-400">
                                            <span>{p.toFixed(1)}%</span>
                                            <span>{c.donors} donors</span>
                                        </div>
                                    </div>

                                    <div className="text-sm bg-green-900/20 p-2 rounded-lg border border-green-900/40">
                                        <p className="text-green-400">
                                            <FileText className="w-3 h-3 inline mr-1" />
                                            Latest: {c.lastUpdate}
                                        </p>
                                    </div>

                                    <Button
                                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
                                        onClick={() => handleDonate(c)}
                                    >
                                        <Heart className="w-4 h-4 mr-1" />
                                        Donate Now
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}

                    {campaigns.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-400 text-lg">
                            No campaigns available
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
