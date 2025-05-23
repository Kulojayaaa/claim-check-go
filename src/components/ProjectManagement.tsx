
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

// Sample initial projects
const initialProjects = [
  "Project A",
  "Project B",
  "Project C",
  "Project D",
  "Head Office",
];

const ProjectManagement = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<string[]>(initialProjects);
  const [newProject, setNewProject] = useState("");

  const handleAddProject = () => {
    if (!newProject.trim()) {
      toast({
        title: "Error",
        description: "Project name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    if (projects.includes(newProject)) {
      toast({
        title: "Error",
        description: "Project already exists",
        variant: "destructive",
      });
      return;
    }

    setProjects([...projects, newProject]);
    setNewProject("");
    
    toast({
      title: "Success",
      description: "Project added successfully",
    });
  };

  const handleDeleteProject = (projectToDelete: string) => {
    setProjects(projects.filter(project => project !== projectToDelete));
    toast({
      title: "Project Deleted",
      description: "The project has been removed",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Management</CardTitle>
        <CardDescription>
          Add or remove projects from the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-6">
          <Input
            placeholder="Enter new project name"
            value={newProject}
            onChange={(e) => setNewProject(e.target.value)}
          />
          <Button onClick={handleAddProject} className="whitespace-nowrap">
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project}>
                  <TableCell>{project}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-status-error border-status-error hover:bg-status-error hover:text-white"
                      onClick={() => handleDeleteProject(project)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectManagement;
