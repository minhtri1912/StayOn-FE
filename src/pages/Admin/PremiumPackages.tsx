import {
  useAdminPremiumPackages,
  useCreatePremiumPackage,
  useUpdatePremiumPackage,
  useDeletePremiumPackage
} from '@/queries/admin.query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Package, Plus, Edit, Trash2 } from 'lucide-react';
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

export default function AdminPremiumPackages() {
  const { data: packages, isLoading } = useAdminPremiumPackages();
  const createMutation = useCreatePremiumPackage();
  const updateMutation = useUpdatePremiumPackage();
  const deleteMutation = useDeletePremiumPackage();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    durationDays: 30,
    isActive: true
  });

  const handleCreate = async () => {
    // Validate required fields
    if (!formData.name || formData.name.trim().length === 0) {
      alert('Name is required');
      return;
    }
    const trimmedName = formData.name.trim();
    if (trimmedName.length > 50) {
      alert('Name must be 50 characters or less');
      return;
    }
    if (formData.price < 0) {
      alert('Price must be 0 or greater');
      return;
    }

    // Validate description max length (255 characters)
    const description = formData.description?.trim() || null;
    if (description && description.length > 255) {
      alert('Description must be 255 characters or less');
      return;
    }

    // Validate and parse durationDays
    const durationDaysRaw = parseInt(String(formData.durationDays)) || 30;
    if (isNaN(durationDaysRaw) || durationDaysRaw < 1) {
      alert('Duration must be at least 1 day');
      return;
    }
    if (durationDaysRaw > 365000) {
      alert(
        'Duration cannot exceed 365000 days (approximately 1000 years for lifetime packages)'
      );
      return;
    }
    const durationDays = Math.max(1, Math.min(365000, durationDaysRaw));

    try {
      // Prepare data matching backend model exactly
      const dataToSend = {
        name: trimmedName,
        description: description,
        price: parseInt(String(formData.price)) || 0,
        durationDays: durationDays,
        isActive: formData.isActive !== undefined ? formData.isActive : true
      };
      console.log('Creating package with data:', dataToSend);
      await createMutation.mutateAsync(dataToSend);
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      console.error('Create package failed:', error);
      const errorMsg =
        error?.response?.data?.title ||
        error?.response?.data?.message ||
        JSON.stringify(error?.response?.data);
      alert(`Failed to create package: ${errorMsg}`);
    }
  };

  const handleUpdate = async (id: string) => {
    // Validate required fields
    if (!formData.name || formData.name.trim().length === 0) {
      alert('Name is required');
      return;
    }
    const trimmedName = formData.name.trim();
    if (trimmedName.length > 50) {
      alert('Name must be 50 characters or less');
      return;
    }
    if (formData.price < 0) {
      alert('Price must be 0 or greater');
      return;
    }

    // Validate description max length (255 characters)
    const description = formData.description?.trim() || null;
    if (description && description.length > 255) {
      alert('Description must be 255 characters or less');
      return;
    }

    // Validate and parse durationDays
    const durationDaysRaw = parseInt(String(formData.durationDays)) || 30;
    if (isNaN(durationDaysRaw) || durationDaysRaw < 1) {
      alert('Duration must be at least 1 day');
      return;
    }
    if (durationDaysRaw > 365000) {
      alert(
        'Duration cannot exceed 365000 days (approximately 1000 years for lifetime packages)'
      );
      return;
    }
    const durationDays = Math.max(1, Math.min(365000, durationDaysRaw));

    try {
      // Prepare data matching backend model exactly - do NOT include Id
      const dataToSend = {
        name: trimmedName,
        description: description,
        price: parseInt(String(formData.price)) || 0,
        durationDays: durationDays,
        isActive: formData.isActive !== undefined ? formData.isActive : true
      };
      console.log('Updating package', id, 'with data:', dataToSend);
      await updateMutation.mutateAsync({ id, data: dataToSend });
      setIsDialogOpen(false);
      setEditingId(null);
      resetForm();
    } catch (error: any) {
      console.error('Update package failed:', error);
      const errorMsg =
        error?.response?.data?.title ||
        error?.response?.data?.message ||
        JSON.stringify(error?.response?.data);
      alert(`Failed to update package: ${errorMsg}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      durationDays: 30,
      isActive: true
    });
  };

  const openEditDialog = (pkg: any) => {
    setEditingId(pkg.id);
    setFormData({
      name: pkg.name || '',
      description: pkg.description || '',
      price: pkg.price || 0,
      durationDays: pkg.durationDays || 30,
      isActive: pkg.isActive !== undefined ? pkg.isActive : true
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
              Premium Packages
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
                    {editingId ? 'Edit Package' : 'Create Package'}
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
                      placeholder="Package name"
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
                      placeholder="Package description"
                      maxLength={255}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {formData.description?.length || 0}/255 characters
                      {formData.description &&
                        formData.description.length > 255 && (
                          <span className="text-red-500 ml-2">
                            Exceeds maximum length!
                          </span>
                        )}
                    </p>
                  </div>
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
                  <div>
                    <Label>Duration (Days)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="365000"
                      value={formData.durationDays}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          setFormData({ ...formData, durationDays: 30 });
                        } else {
                          const num = parseInt(value);
                          if (!isNaN(num) && num >= 1) {
                            setFormData({ ...formData, durationDays: num });
                          }
                        }
                      }}
                      placeholder="30"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      30 days = 1 month, 365 days = 1 year (Max: 365000 for
                      lifetime packages)
                    </p>
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
          {!packages || (Array.isArray(packages) && packages.length === 0) ? (
            <div className="py-12 text-center">
              <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-600">No packages found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {(packages as any[]).map((pkg: any) => (
                <div
                  key={pkg.id}
                  className="rounded-lg border border-gray-200 p-4 transition-shadow duration-300 hover:shadow-md"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="text-lg font-semibold">{pkg.name}</h3>
                  </div>
                  <p className="mb-4 text-sm text-gray-600">
                    {pkg.description}
                  </p>
                  <div className="mb-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Price:</span>
                      <span className="font-semibold">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(pkg.price || 0)}
                      </span>
                    </div>
                    {pkg.durationDays && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Duration:</span>
                        <span className="font-semibold">
                          {pkg.durationDays} days
                          {pkg.durationDays >= 30 &&
                            ` (${Math.round(pkg.durationDays / 30)} months)`}
                        </span>
                      </div>
                    )}
                    <div className="mt-1 flex justify-between text-sm">
                      <span className="text-gray-500">Status:</span>
                      <span
                        className={`font-semibold ${pkg.isActive ? 'text-green-600' : 'text-gray-500'}`}
                      >
                        {pkg.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => openEditDialog(pkg)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Edit className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(pkg.id)}
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
