// src/app/components/ngo-dashboard/CampaignsTab.tsx

import React, { useState } from 'react';
import { FileText, Edit, Trash2, Calendar, Eye, Users, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";  
import { Button } from "../../ui/button";  
import { Badge } from "../../ui/badge";  
import { Progress } from "../../ui/progress";  
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";  
import { Input } from "../../ui/input";  
import { Label } from "../../ui/label";  
import { Textarea } from "../../ui/textarea";  
import { Campaign } from './types';
import { useRouter } from 'next/navigation'; // Add this import


interface CampaignsTabProps {
  campaigns: Campaign[];
  isEditCampaignOpen: boolean;
  setIsEditCampaignOpen: (open: boolean) => void;
  selectedCampaign: Campaign | null;
  setSelectedCampaign: (campaign: Campaign | null) => void;
  handleEditCampaign: () => void;
  handleDeleteCampaign: (id: string) => void;
}


export function CampaignsTab({
  campaigns,
  isEditCampaignOpen, setIsEditCampaignOpen,
  selectedCampaign, setSelectedCampaign,
  handleEditCampaign, handleDeleteCampaign
}: CampaignsTabProps) {
  
  const router = useRouter(); 
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [attendanceCampaign, setAttendanceCampaign] = useState<Campaign | null>(null);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loadingVolunteers, setLoadingVolunteers] = useState(false);

  const handleOpenAttendance = async (campaign: Campaign) => {
    setAttendanceCampaign(campaign);
    setIsAttendanceOpen(true);
    setLoadingVolunteers(true);
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}/volunteers`);
      const data = await res.json();
      setVolunteers(data.volunteers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingVolunteers(false);
    }
  };

  const setAttendanceStatus = async (volunteerId: string, newAttended: boolean) => {
    if (!attendanceCampaign) return;
    
    const vol = volunteers.find(v => v.volunteerId === volunteerId);
    if (vol?.attended === newAttended) return;

    setVolunteers(prev => prev.map(v => v.volunteerId === volunteerId ? { ...v, attended: newAttended } : v));
    
    try {
      const res = await fetch('/api/notifications/volunteer-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: volunteerId,
          campaignid: attendanceCampaign.id,
          attended: newAttended
        })
      });
      if (!res.ok) throw new Error("Failed to update");
    } catch (err) {
      setVolunteers(prev => prev.map(v => v.volunteerId === volunteerId ? { ...v, attended: vol?.attended } : v));
      console.error(err);
    }
  };

  return (
    <>
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
                <div className="grid grid-cols-2 gap-2">
                  {/* New Show Details Button */}
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="rounded-lg bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                    onClick={() => router.push(`/campaign/${campaign.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Details
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-lg dark:border-gray-600 dark:hover:bg-gray-700"
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
                    className="rounded-lg text-purple-600 border-purple-300 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-800 dark:hover:bg-purple-900/20"
                    onClick={() => handleOpenAttendance(campaign)}
                  >
                    <Users className="w-4 h-4 mr-1" />
                    Attendance
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-lg text-red-600 border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
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

      {/* Attendance Dialog */}
      <Dialog open={isAttendanceOpen} onOpenChange={setIsAttendanceOpen}>
        <DialogContent className="rounded-xl dark:bg-gray-800 dark:border-gray-700 max-w-md">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Manage Attendance</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              {attendanceCampaign?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2 max-h-[60vh] overflow-y-auto pr-2">
            {loadingVolunteers ? (
              <p className="text-center text-sm text-gray-500">Loading volunteers...</p>
            ) : volunteers.length === 0 ? (
              <p className="text-center text-sm text-gray-500">No accepted volunteers found for this campaign.</p>
            ) : (
              volunteers.map(vol => (
                <div key={vol.volunteerId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{vol.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{vol.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={vol.attended === true ? "default" : "outline"}
                      className={vol.attended === true ? "bg-green-600 hover:bg-green-700 text-white" : "dark:border-gray-600 dark:text-gray-300"}
                      onClick={() => setAttendanceStatus(vol.volunteerId, true)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" /> Present
                    </Button>
                    <Button
                      size="sm"
                      variant={vol.attended === false ? "default" : "outline"}
                      className={vol.attended === false ? "bg-red-600 hover:bg-red-700 text-white" : "dark:border-gray-600 dark:text-gray-300"}
                      onClick={() => setAttendanceStatus(vol.volunteerId, false)}
                    >
                      <XCircle className="w-4 h-4 mr-1" /> Absent
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
