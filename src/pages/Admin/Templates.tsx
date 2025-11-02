import {
  useAdminTemplates,
  useCreateTemplate,
  useUpdateTemplate,
  useDeleteTemplate
} from '@/queries/admin.query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FileText, Plus, Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useAdminTemplateCategories } from '@/queries/admin.query';

export default function AdminTemplates() {
  const { data: templates, isLoading } = useAdminTemplates();
  const { data: categories } = useAdminTemplateCategories();
  const createMutation = useCreateTemplate();
  const updateMutation = useUpdateTemplate();
  const deleteMutation = useDeleteTemplate();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    isFree: false,
    price: 0,
    tags: '',
    templateData: '{}',
    isActive: true,
    previewImage: null as File | null
  });

  const handleCreate = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('categoryId', formData.categoryId);
      formDataToSend.append('isFree', formData.isFree.toString());
      formDataToSend.append('price', formData.price.toString());
      formDataToSend.append('tags', formData.tags);
      formDataToSend.append('templateData', formData.templateData);
      formDataToSend.append('isActive', formData.isActive.toString());
      if (formData.previewImage) {
        formDataToSend.append('previewImage', formData.previewImage);
      }
      await createMutation.mutateAsync(formDataToSend);
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      console.error('Create template failed:', error);
      alert(
        error?.response?.data?.message ||
          'Failed to create template. Please try again.'
      );
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      if (formData.categoryId)
        formDataToSend.append('categoryId', formData.categoryId);
      formDataToSend.append('isFree', formData.isFree.toString());
      formDataToSend.append('price', formData.price.toString());
      formDataToSend.append('tags', formData.tags);
      formDataToSend.append('templateData', formData.templateData);
      formDataToSend.append('isActive', formData.isActive.toString());
      if (formData.previewImage) {
        formDataToSend.append('previewImage', formData.previewImage);
      }
      await updateMutation.mutateAsync({ id, formData: formDataToSend });
      setIsDialogOpen(false);
      setEditingId(null);
      resetForm();
    } catch (error: any) {
      console.error('Update template failed:', error);
      alert(
        error?.response?.data?.message ||
          'Failed to update template. Please try again.'
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      categoryId: '',
      isFree: false,
      price: 0,
      tags: '',
      templateData: '{}',
      isActive: true,
      previewImage: null
    });
  };

  const openEditDialog = (template: any) => {
    setEditingId(template.id);
    setFormData({
      name: template.name || '',
      description: template.description || '',
      categoryId: template.categoryId || '',
      isFree: template.isFree || false,
      price: template.price || 0,
      tags: template.tags || '',
      templateData:
        typeof template.templateData === 'string'
          ? template.templateData
          : JSON.stringify(template.templateData || {}),
      isActive: template.isActive !== undefined ? template.isActive : true,
      previewImage: null
    });
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => navigate('/admin')}
              className="text-gray-600 transition-colors hover:text-gray-900"
            >
              ← Back to Dashboard
            </button>
            <h1 className="flex-1 text-center text-4xl font-extrabold tracking-tight">
              Templates
            </h1>
            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) {
                  setEditingId(null);
                  resetForm();
                }
              }}
            >
              <DialogTrigger asChild>
                <div className="flex w-32 justify-end">
                  <Button
                    onClick={resetForm}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </div>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? 'Edit Template' : 'Create Template'}
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Template name"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value
                        })
                      }
                      placeholder="Template description"
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) =>
                        setFormData({ ...formData, categoryId: e.target.value })
                      }
                      className="w-full rounded-md border border-gray-300 p-2"
                    >
                      <option value="">Select category</option>
                      {categories &&
                        Array.isArray(categories) &&
                        (categories as any[]).map((cat: any) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Free Template</Label>
                    <Switch
                      checked={formData.isFree}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isFree: checked })
                      }
                    />
                  </div>
                  {!formData.isFree && (
                    <div>
                      <Label>Price (VND)</Label>
                      <Input
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price: parseFloat(e.target.value) || 0
                          })
                        }
                        placeholder="0"
                      />
                    </div>
                  )}
                  <div>
                    <Label>Tags (comma-separated)</Label>
                    <Input
                      value={formData.tags}
                      onChange={(e) =>
                        setFormData({ ...formData, tags: e.target.value })
                      }
                      placeholder="tag1, tag2"
                    />
                  </div>
                  <div>
                    <Label>Template Data (JSON)</Label>
                    <Textarea
                      value={formData.templateData}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          templateData: e.target.value
                        })
                      }
                      placeholder='{"key": "value"}'
                      rows={5}
                    />
                  </div>
                  <div>
                    <Label>Preview Image</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          previewImage: e.target.files?.[0] || null
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Active</Label>
                    <Switch
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isActive: checked })
                      }
                    />
                  </div>
                  <Button
                    onClick={() =>
                      editingId ? handleUpdate(editingId) : handleCreate()
                    }
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
                    className="w-full"
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? editingId
                        ? 'Updating...'
                        : 'Creating...'
                      : editingId
                        ? 'Update'
                        : 'Create'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="rounded-lg border border-black/5 bg-white p-6 shadow-sm">
          {!templates ||
          (Array.isArray(templates) && templates.length === 0) ? (
            <div className="py-12 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-600">No templates found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {(templates as any[]).map((template: any) => (
                <div
                  key={template.id}
                  className="rounded-lg border border-gray-200 p-4 transition-shadow duration-300 hover:shadow-md"
                >
                  {template.previewImage && (
                    <img
                      src={template.previewImage}
                      alt={template.name}
                      className="mb-2 h-32 w-full rounded object-cover"
                    />
                  )}
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="text-lg font-semibold">{template.name}</h3>
                    <span
                      className={`rounded px-2 py-1 text-xs ${template.isFree ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}
                    >
                      {template.isFree
                        ? 'Free'
                        : `₫${template.price?.toLocaleString()}`}
                    </span>
                  </div>
                  <p className="mb-2 text-sm text-gray-600">
                    {template.description}
                  </p>
                  {template.tags && (
                    <div className="mb-2 flex flex-wrap gap-1">
                      {template.tags
                        .split(',')
                        .map((tag: string, idx: number) => (
                          <span
                            key={idx}
                            className="rounded bg-gray-100 px-2 py-1 text-xs"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                    </div>
                  )}
                  <div className="mt-4 flex gap-2">
                    <Button
                      onClick={() => openEditDialog(template)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Edit className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(template.id)}
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
