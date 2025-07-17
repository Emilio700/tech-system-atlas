
import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Project, SystemConnection } from "@/pages/Index";

interface ProjectFormProps {
  project?: Project | null;
  onSave: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const ProjectForm = ({ project, onSave, onCancel }: ProjectFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    purpose: '',
    developmentType: 'web' as 'web' | 'desktop' | 'legacy',
    language: '',
    databaseType: '',
    diagramUrl: ''
  });

  const [connections, setConnections] = useState<SystemConnection[]>([]);
  const [newConnection, setNewConnection] = useState({
    name: '',
    description: '',
    sends: '',
    receives: ''
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        purpose: project.purpose,
        developmentType: project.developmentType,
        language: project.language,
        databaseType: project.databaseType,
        diagramUrl: project.diagramUrl || ''
      });
      setConnections(project.connections);
    }
  }, [project]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddConnection = () => {
    if (newConnection.name.trim()) {
      const connection: SystemConnection = {
        id: Date.now().toString(),
        name: newConnection.name,
        description: newConnection.description,
        dataFlow: {
          sends: newConnection.sends,
          receives: newConnection.receives
        }
      };
      setConnections(prev => [...prev, connection]);
      setNewConnection({ name: '', description: '', sends: '', receives: '' });
    }
  };

  const handleRemoveConnection = (connectionId: string) => {
    setConnections(prev => prev.filter(c => c.id !== connectionId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      connections
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData(prev => ({
          ...prev,
          diagramUrl: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={onCancel} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              {project ? 'Editar Proyecto' : 'Nuevo Proyecto'}
            </h1>
            <p className="text-slate-600">
              {project ? 'Modifica la información del sistema' : 'Agrega un nuevo sistema a tu inventario'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
              <CardDescription>
                Datos principales del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre del Sistema *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ej: Sistema de Inventario"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="language">Lenguaje de Desarrollo *</Label>
                  <Input
                    id="language"
                    value={formData.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    placeholder="Ej: Java, Python, C#, JavaScript"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="purpose">Propósito del Sistema *</Label>
                <Textarea
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => handleInputChange('purpose', e.target.value)}
                  placeholder="Describe el objetivo y funcionalidad principal del sistema..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="developmentType">Tipo de Desarrollo *</Label>
                  <select
                    id="developmentType"
                    value={formData.developmentType}
                    onChange={(e) => handleInputChange('developmentType', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="web">Aplicación Web</option>
                    <option value="desktop">Aplicación de Escritorio</option>
                    <option value="legacy">Sistema Legado</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="databaseType">Tipo de Base de Datos *</Label>
                  <Input
                    id="databaseType"
                    value={formData.databaseType}
                    onChange={(e) => handleInputChange('databaseType', e.target.value)}
                    placeholder="Ej: MySQL, PostgreSQL, MongoDB, Oracle"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Diagrama de Flujo */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Diagrama de Flujo</CardTitle>
              <CardDescription>
                Sube una imagen del diagrama de arquitectura o flujo del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="diagram-upload"
                  />
                  <Label htmlFor="diagram-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
                      <Upload className="h-4 w-4" />
                      Subir Imagen
                    </div>
                  </Label>
                  {formData.diagramUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, diagramUrl: '' }))}
                    >
                      <X className="h-4 w-4" />
                      Remover
                    </Button>
                  )}
                </div>
                
                {formData.diagramUrl && (
                  <div className="border border-slate-200 rounded-lg p-4">
                    <img
                      src={formData.diagramUrl}
                      alt="Diagrama del proyecto"
                      className="max-w-full h-auto max-h-64 rounded-md"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Conexiones con Otros Sistemas */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Conexiones con Otros Sistemas</CardTitle>
              <CardDescription>
                Define las relaciones y dependencias con otros sistemas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Lista de conexiones existentes */}
              {connections.length > 0 && (
                <div className="space-y-3">
                  {connections.map((connection) => (
                    <div key={connection.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-slate-800">{connection.name}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveConnection(connection.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {connection.description && (
                        <p className="text-sm text-slate-600 mb-2">{connection.description}</p>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        {connection.dataFlow.sends && (
                          <div>
                            <Badge variant="outline" className="text-xs mb-1">Envía</Badge>
                            <p className="text-slate-600">{connection.dataFlow.sends}</p>
                          </div>
                        )}
                        {connection.dataFlow.receives && (
                          <div>
                            <Badge variant="outline" className="text-xs mb-1">Recibe</Badge>
                            <p className="text-slate-600">{connection.dataFlow.receives}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Formulario para nueva conexión */}
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-slate-700">Agregar Nueva Conexión</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Nombre del sistema"
                    value={newConnection.name}
                    onChange={(e) => setNewConnection(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Input
                    placeholder="Descripción de la relación"
                    value={newConnection.description}
                    onChange={(e) => setNewConnection(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Qué datos envía"
                    value={newConnection.sends}
                    onChange={(e) => setNewConnection(prev => ({ ...prev, sends: e.target.value }))}
                  />
                  <Input
                    placeholder="Qué datos recibe"
                    value={newConnection.receives}
                    onChange={(e) => setNewConnection(prev => ({ ...prev, receives: e.target.value }))}
                  />
                </div>
                <Button type="button" onClick={handleAddConnection} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Conexión
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {project ? 'Actualizar Proyecto' : 'Crear Proyecto'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
