
import { ArrowLeft, Edit, Trash2, Database, Code, Globe, Monitor, Server, Calendar, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Project } from "@/pages/Index";

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const getDevelopmentTypeConfig = (type: string) => {
  switch (type) {
    case 'web':
      return { icon: Globe, label: 'Aplicación Web', color: 'bg-green-100 text-green-800' };
    case 'desktop':
      return { icon: Monitor, label: 'Aplicación de Escritorio', color: 'bg-blue-100 text-blue-800' };
    case 'legacy':
      return { icon: Server, label: 'Sistema Legado', color: 'bg-red-100 text-red-800' };
    default:
      return { icon: Code, label: 'Otro', color: 'bg-gray-100 text-gray-800' };
  }
};

export const ProjectDetail = ({ project, onBack, onEdit, onDelete }: ProjectDetailProps) => {
  const typeConfig = getDevelopmentTypeConfig(project.developmentType);
  const TypeIcon = typeConfig.icon;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center">
                <TypeIcon className="h-8 w-8 text-slate-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">{project.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={typeConfig.color}>
                    {typeConfig.label}
                  </Badge>
                  <Badge variant="outline">
                    {project.language}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={onEdit} variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button onClick={onDelete} variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Propósito */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Propósito del Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed">{project.purpose}</p>
              </CardContent>
            </Card>

            {/* Diagrama */}
            {project.diagramUrl && (
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Diagrama de Arquitectura</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <img
                      src={project.diagramUrl}
                      alt="Diagrama del proyecto"
                      className="w-full h-auto rounded-md"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Conexiones */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRightLeft className="h-5 w-5" />
                  Conexiones con Otros Sistemas
                  <Badge variant="secondary" className="ml-2">
                    {project.connections.length}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Sistemas relacionados y flujo de datos
                </CardDescription>
              </CardHeader>
              <CardContent>
                {project.connections.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <ArrowRightLeft className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay conexiones configuradas</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {project.connections.map((connection, index) => (
                      <div key={connection.id}>
                        <div className="border border-slate-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold text-slate-800">{connection.name}</h4>
                          </div>
                          
                          {connection.description && (
                            <p className="text-sm text-slate-600 mb-3">{connection.description}</p>
                          )}
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {connection.dataFlow.sends && (
                              <div className="bg-green-50 p-3 rounded-md">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="text-sm font-medium text-green-800">Datos que Envía</span>
                                </div>
                                <p className="text-sm text-green-700">{connection.dataFlow.sends}</p>
                              </div>
                            )}
                            
                            {connection.dataFlow.receives && (
                              <div className="bg-blue-50 p-3 rounded-md">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span className="text-sm font-medium text-blue-800">Datos que Recibe</span>
                                </div>
                                <p className="text-sm text-blue-700">{connection.dataFlow.receives}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        {index < project.connections.length - 1 && (
                          <Separator className="my-4" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Información Técnica */}
          <div className="space-y-6">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Información Técnica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-600 mb-1">Tipo de Desarrollo</h4>
                  <Badge className={typeConfig.color}>
                    {typeConfig.label}
                  </Badge>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium text-slate-600 mb-1">Lenguaje</h4>
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-slate-500" />
                    <span className="font-medium">{project.language}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium text-slate-600 mb-1">Base de Datos</h4>
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-slate-500" />
                    <span className="font-medium">{project.databaseType}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Fechas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-slate-600 mb-1">Creado</h4>
                  <p className="text-sm text-slate-700">{formatDate(project.createdAt)}</p>
                </div>
                
                {project.updatedAt.getTime() !== project.createdAt.getTime() && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium text-slate-600 mb-1">Última Actualización</h4>
                      <p className="text-sm text-slate-700">{formatDate(project.updatedAt)}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Conexiones</span>
                  <Badge variant="secondary">{project.connections.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Tipo</span>
                  <Badge variant="outline">{typeConfig.label}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
