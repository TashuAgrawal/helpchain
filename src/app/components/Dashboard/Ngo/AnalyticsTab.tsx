// src/app/components/ngo-dashboard/AnalyticsTab.tsx

import React from 'react';
import { TrendingUp, Users, Eye, Calendar, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card"; 
import { Button } from "../../ui/button"; 
import { Badge } from "../../ui/badge"; 
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog"; 
import { Input } from "../../ui/input"; 
import { Label } from "../../ui/label"; 
import { Textarea } from "../../ui/textarea"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"; 
import { ImpactUpdate, TeamMember } from './types';

interface AnalyticsTabProps {
  dateRange: string;
  setDateRange: (range: string) => void;
  impactUpdates: ImpactUpdate[];
  teamMembers: TeamMember[];
  isEditUpdateOpen: boolean;
  setIsEditUpdateOpen: (open: boolean) => void;
  selectedUpdate: ImpactUpdate | null;
  setSelectedUpdate: (update: ImpactUpdate | null) => void;
  handleEditUpdate: () => void;
  handleDeleteUpdate: (id: number) => void;
}

export function AnalyticsTab({
  dateRange, setDateRange,
  impactUpdates, teamMembers,
  isEditUpdateOpen, setIsEditUpdateOpen,
  selectedUpdate, setSelectedUpdate,
  handleEditUpdate, handleDeleteUpdate
}: AnalyticsTabProps) {

  const totalViews = impactUpdates.reduce((sum, u) => sum + u.views, 0);

  return (
    <>
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
            <h2 className="text-gray-900 dark:text-white mb-1">{totalViews}</h2>
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
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-lg dark:border-gray-600 dark:hover:bg-gray-700"
                      onClick={() => {
                        setSelectedUpdate({...update});
                        setIsEditUpdateOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-lg text-red-600 border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                      onClick={() => handleDeleteUpdate(update.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
    </>
  );
}