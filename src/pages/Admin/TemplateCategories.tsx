import {
  useAdminTemplateCategories,
  useCreateTemplateCategory,
  useUpdateTemplateCategory,
  useDeleteTemplateCategory
} from '@/queries/admin.query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FolderOpen, Plus, Edit, Trash2 } from 'lucide-react';
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

export default function AdminTemplateCategories() {
  const { data: categories, isLoading } = useAdminTemplateCategories();
  const createMutation = useCreateTemplateCategory();
  const updateMutation = useUpdateTemplateCategory();
  const deleteMutation = useDeleteTemplateCategory();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync(formData);
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      console.error('Create category failed:', error);
      alert(
        error?.response?.data?.message ||
          'Failed to create category. Please try again.'
      );
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await updateMutation.mutateAsync({ id, data: formData });
      setIsDialogOpen(false);
      setEditingId(null);
      resetForm();
    } catch (error: any) {
      console.error('Update category failed:', error);
      alert(
        error?.response?.data?.message ||
          'Failed to update category. Please try again.'
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      isActive: true
    });
  };

  const openEditDialog = (category: any) => {
    setEditingId(category.id);
    setFormData({
      name: category.name || '',
      description: category.description || '',
      isActive: category.isActive !== undefined ? category.isActive : true
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
              Template Categories
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
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? 'Edit Category' : 'Create Category'}
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
                      placeholder="Category name"
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
                      placeholder="Category description"
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
          {!categories ||
          (Array.isArray(categories) && categories.length === 0) ? (
            <div className="py-12 text-center">
              <FolderOpen className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-600">No categories found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {(categories as any[]).map((category: any) => (
                <div
                  key={category.id}
                  className="rounded-lg border border-gray-200 p-4 transition-shadow duration-300 hover:shadow-md"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <span
                      className={`rounded px-2 py-1 text-xs ${category.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="mb-4 text-sm text-gray-600">
                    {category.description}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => openEditDialog(category)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Edit className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(category.id)}
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
