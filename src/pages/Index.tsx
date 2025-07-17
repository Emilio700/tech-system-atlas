
import { useState, useEffect } from "react";
import { Plus, Search, Filter, Grid, List, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectForm } from "@/components/ProjectForm";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectDetail } from "@/components/ProjectDetail";

export interface SystemConnection {
  id: string;
  name: string;
  description: string;
  dataFlow: {
    sends: string;
    receives: string;
  };
}

export interface Project {
  id: string;
  name: string;
  purpose: string;
  connections: SystemConnection[];
  developmentType: 'web' | 'desktop' | 'legacy';
  language: string;
  databaseType: string;
  diagramUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSaveProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingProject) {
      setProjects(prev => prev.map(p => 
        p.id === editingProject.id 
          ? { ...projectData, id: editingProject.id, createdAt: editingProject.createdAt, updatedAt: new Date() }
          : p
      ));
      setEditingProject(null);
    } else {
      const newProject: Project = {
        ...projectData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setProjects(prev => [...prev, newProject]);
    }
    setShowForm(false);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
    setSelectedProject(null);
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setSelectedProject(null);
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || project.developmentType === filterType;
    return matchesSearch && matchesFilter;
  });

  const developmentTypes = [
    { value: 'all', label: 'Todos los tipos' },
    { value: 'web', label: 'Web' },
    { value: 'desktop', label: 'Escritorio' },
    { value: 'legacy', label: 'Legado' }
  ];

  if (selectedProject) {
    return (
      <ProjectDetail 
        project={selectedProject} 
        onBack={() => setSelectedProject(null)}
        onEdit={() => handleEditProject(selectedProject)}
        onDelete={() => handleDeleteProject(selectedProject.id)}
      />
    );
  }

  if (showForm) {
    return (
      <ProjectForm 
        project={editingProject}
        onSave={handleSaveProject}
        onCancel={() => {
          setShowForm(false);
          setEditingProject(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              Gestión de Proyectos TI
            </h1>
            <p className="text-slate-600">
              Administra y documenta todos los sistemas de tu organización
            </p>
          </div>
          
          {/* User Menu */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm">
              <User className="h-4 w-4 text-slate-600" />
              <span className="text-sm text-slate-700">{user.email}</span>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-blue-600">
                {projects.length}
              </CardTitle>
              <CardDescription>Total de Sistemas</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-green-600">
                {projects.filter(p => p.developmentType === 'web').length}
              </CardTitle>
              <CardDescription>Aplicaciones Web</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-orange-600">
                {projects.filter(p => p.developmentType === 'desktop').length}
              </CardTitle>
              <CardDescription>Apps de Escritorio</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-red-600">
                {projects.filter(p => p.developmentType === 'legacy').length}
              </CardTitle>
              <CardDescription>Sistemas Legados</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Buscar proyectos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {developmentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-2 items-center">
              <div className="flex border border-slate-200 rounded-md overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Proyecto
              </Button>
            </div>
          </div>
        </div>

        {/* Projects Grid/List */}
        {filteredProjects.length === 0 ? (
          <Card className="bg-white shadow-sm">
            <CardContent className="text-center py-12">
              <div className="text-slate-400 mb-4">
                <Grid className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-600 mb-2">
                  {projects.length === 0 ? 'No hay proyectos aún' : 'No se encontraron proyectos'}
                </h3>
                <p className="text-slate-500">
                  {projects.length === 0 
                    ? 'Comienza agregando tu primer sistema de TI'
                    : 'Intenta con otros términos de búsqueda o filtros'
                  }
                </p>
              </div>
              {projects.length === 0 && (
                <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primer Proyecto
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            : "space-y-4"
          }>
            {filteredProjects.map(project => (
              <ProjectCard 
                key={project.id}
                project={project}
                viewMode={viewMode}
                onView={() => setSelectedProject(project)}
                onEdit={() => handleEditProject(project)}
                onDelete={() => handleDeleteProject(project.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
