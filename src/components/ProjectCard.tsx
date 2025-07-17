
import { MoreVertical, Eye, Edit, Trash2, Database, Code, Monitor, Globe, Server } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Project } from "@/pages/Index";

interface ProjectCardProps {
  project: Project;
  viewMode: 'grid' | 'list';
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const getDevelopmentTypeConfig = (type: string) => {
  switch (type) {
    case 'web':
      return { icon: Globe, label: 'Web', color: 'bg-green-100 text-green-800' };
    case 'desktop':
      return { icon: Monitor, label: 'Escritorio', color: 'bg-blue-100 text-blue-800' };
    case 'legacy':
      return { icon: Server, label: 'Legado', color: 'bg-red-100 text-red-800' };
    default:
      return { icon: Code, label: 'Otro', color: 'bg-gray-100 text-gray-800' };
  }
};

export const ProjectCard = ({ project, viewMode, onView, onEdit, onDelete }: ProjectCardProps) => {
  const typeConfig = getDevelopmentTypeConfig(project.developmentType);
  const TypeIcon = typeConfig.icon;

  if (viewMode === 'list') {
    return (
      <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                <TypeIcon className="h-6 w-6 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 truncate">{project.name}</h3>
                <p className="text-sm text-slate-600 truncate">{project.purpose}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className={typeConfig.color}>
                    {typeConfig.label}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {project.language}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Database className="h-3 w-3 mr-1" />
                    {project.databaseType}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {project.connections.length} conexiones
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onView}>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver detalles
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onDelete} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-3">
            <TypeIcon className="h-6 w-6 text-slate-600" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onView}>
                <Eye className="h-4 w-4 mr-2" />
                Ver detalles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <CardTitle className="text-lg font-semibold text-slate-800 mb-2" onClick={onView}>
            {project.name}
          </CardTitle>
          <CardDescription className="text-sm text-slate-600 line-clamp-2">
            {project.purpose}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge className={typeConfig.color}>
              {typeConfig.label}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {project.language}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm text-slate-500">
            <div className="flex items-center">
              <Database className="h-4 w-4 mr-1" />
              {project.databaseType}
            </div>
            <div className="text-xs">
              {project.connections.length} conexiones
            </div>
          </div>
          
          {project.diagramUrl && (
            <div className="mt-3">
              <img 
                src={project.diagramUrl} 
                alt="Diagrama del proyecto"
                className="w-full h-32 object-cover rounded-md bg-slate-100"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
