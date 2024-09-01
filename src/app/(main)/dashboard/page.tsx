"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BookOpen, Edit, Flag, Star, Trash2, ExternalLink } from "lucide-react";

export default function Dashboard() {
  // Mock data - replace with actual data in a real application
  const stats = {
    reputation: 1250,
    totalReports: 45,
    totalVocabulary: 500,
    totalEditSuggestions: 30,
  };

  const vocabularyList = [
    {
      id: 1,
      word: "Aberration",
      definition: "A departure from what is normal, usual, or expected",
      category: "Noun",
    },
    {
      id: 2,
      word: "Benevolent",
      definition: "Kind, generous, and caring about others",
      category: "Adjective",
    },
    {
      id: 3,
      word: "Cacophony",
      definition: "A harsh, discordant mixture of sounds",
      category: "Noun",
    },
    // Add more vocabulary items as needed
  ];

  const reportsList = [
    {
      id: 1,
      type: "Inappropriate Content",
      status: "Pending",
      reportedBy: "User123",
    },
    { id: 2, type: "Spam", status: "Resolved", reportedBy: "User456" },
    {
      id: 3,
      type: "Copyright Violation",
      status: "Under Review",
      reportedBy: "User789",
    },
    // Add more reports as needed
  ];

  const editSuggestionsList = [
    {
      id: 1,
      word: "Aberration",
      suggestedDefinition: "A deviation from the expected or normal",
      status: "Pending",
    },
    {
      id: 2,
      word: "Benevolent",
      suggestedDefinition: "Showing kindness and good will",
      status: "Approved",
    },
    {
      id: 3,
      word: "Cacophony",
      suggestedDefinition: "A harsh mixture of sounds",
      status: "Rejected",
    },
    // Add more edit suggestions as needed
  ];

  const handleEdit = (id: number) => {
    // In a real app, you would navigate to the edit page or open an edit modal
    console.log(`Edit vocabulary item with id: ${id}`);
  };

  const handleDelete = (id: number) => {
    // In a real app, you would show a confirmation modal and then delete the item
    if (
      window.confirm("Are you sure you want to delete this vocabulary item?")
    ) {
      console.log(`Delete vocabulary item with id: ${id}`);
    }
  };

  const handleViewDetail = (id: number) => {
    // In a real app, you would navigate to the detail page
    console.log(`View details of vocabulary item with id: ${id}`);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reputation</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reputation}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReports}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Vocabulary
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVocabulary}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Edit Suggestions
            </CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalEditSuggestions}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Vocabulary, Reports, and Edit Suggestions */}
      <Tabs defaultValue="vocabulary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="editSuggestions">Edit Suggestions</TabsTrigger>
        </TabsList>

        {/* Vocabulary Table */}
        <TabsContent value="vocabulary">
          <Card>
            <CardHeader>
              <CardTitle>My Vocabulary</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Word</TableHead>
                    <TableHead>Definition</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vocabularyList.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.word}</TableCell>
                      <TableCell>{item.definition}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(item.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewDetail(item.id)}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Details</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports List (for admin) */}
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reports (Admin View)</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {reportsList.map((report) => (
                    <div
                      key={report.id}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <div>
                        <p className="font-medium">{report.type}</p>
                        <p className="text-sm text-muted-foreground">
                          Reported by: {report.reportedBy}
                        </p>
                      </div>
                      <Badge
                        variant={
                          report.status === "Resolved" ? "secondary" : "default"
                        }
                      >
                        {report.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Edit Suggestions List (for user) */}
        <TabsContent value="editSuggestions">
          <Card>
            <CardHeader>
              <CardTitle>Vocabulary Edit Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {editSuggestionsList.map((suggestion) => (
                    <div key={suggestion.id} className="border-b pb-2">
                      <div className="flex justify-between items-center">
                        <p className="font-medium">{suggestion.word}</p>
                        <Badge
                          variant={
                            suggestion.status === "Approved"
                              ? "secondary"
                              : suggestion.status === "Rejected"
                              ? "destructive"
                              : "default"
                          }
                        >
                          {suggestion.status}
                        </Badge>
                      </div>
                      <p className="text-sm mt-1">
                        {suggestion.suggestedDefinition}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
