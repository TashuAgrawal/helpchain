// src/app/components/user-dashboard/tabs/DonationsTab.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import { Download, DollarSign, Heart, FileText, TrendingUp } from "lucide-react";
import { MyDonation } from '../types';

interface DonationsTabProps {
  totalDonated: number;
  myDonations: MyDonation[];
  handleExportDonations: () => void;
  handleGenerateCertificate: (id: number) => void;
}

export function DonationsTab({
  totalDonated, myDonations,
  handleExportDonations, handleGenerateCertificate
}: DonationsTabProps) {
  return (
    <div className="space-y-6">
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
    </div>
  );
}