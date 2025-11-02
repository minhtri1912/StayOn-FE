import {
  useCreateDailyTip,
  useUpdateDailyTip,
  useDeleteDailyTip,
  useCreateLibraryTip,
  useUpdateLibraryTip,
  useDeleteLibraryTip,
  useAdminDailyTips,
  useAdminLibraryTips
} from '@/queries/admin.query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Sparkles, Plus, Edit, Trash2 } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminTips() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('daily');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dailyFormData, setDailyFormData] = useState({
    title: '',
    content: '',
    tags: '',
    author: '',
    isActive: true
  });
  const [libraryFormData, setLibraryFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    author: '',
    isActive: true
  });

  const { data: dailyTips, isLoading: isLoadingDaily } = useAdminDailyTips();
  const { data: libraryTips, isLoading: isLoadingLibrary } =
    useAdminLibraryTips();

  const createDailyMutation = useCreateDailyTip();
  const updateDailyMutation = useUpdateDailyTip();
  const deleteDailyMutation = useDeleteDailyTip();
  const createLibraryMutation = useCreateLibraryTip();
  const updateLibraryMutation = useUpdateLibraryTip();
  const deleteLibraryMutation = useDeleteLibraryTip();

  const handleCreateDaily = async () => {
    try {
      await createDailyMutation.mutateAsync(dailyFormData);
      setIsDialogOpen(false);
      resetDailyForm();
    } catch (error: any) {
      console.error('Create daily tip failed:', error);
      alert(
        error?.response?.data?.message ||
          'Failed to create daily tip. Please try again.'
      );
    }
  };

  const handleUpdateDaily = async (id: string) => {
    try {
      await updateDailyMutation.mutateAsync({ id, data: dailyFormData });
      setIsDialogOpen(false);
      setEditingId(null);
      resetDailyForm();
    } catch (error: any) {
      console.error('Update daily tip failed:', error);
      alert(
        error?.response?.data?.message ||
          'Failed to update daily tip. Please try again.'
      );
    }
  };

  const handleDeleteDaily = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this daily tip?')) {
      await deleteDailyMutation.mutateAsync(id);
    }
  };

  const handleCreateLibrary = async () => {
    try {
      await createLibraryMutation.mutateAsync(libraryFormData);
      setIsDialogOpen(false);
      resetLibraryForm();
    } catch (error: any) {
      console.error('Create library item failed:', error);
      alert(
        error?.response?.data?.message ||
          'Failed to create library item. Please try again.'
      );
    }
  };

  const handleUpdateLibrary = async (id: string) => {
    try {
      await updateLibraryMutation.mutateAsync({ id, data: libraryFormData });
      setIsDialogOpen(false);
      setEditingId(null);
      resetLibraryForm();
    } catch (error: any) {
      console.error('Update library item failed:', error);
      alert(
        error?.response?.data?.message ||
          'Failed to update library item. Please try again.'
      );
    }
  };

  const handleDeleteLibrary = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this library item?')) {
      await deleteLibraryMutation.mutateAsync(id);
    }
  };

  const resetDailyForm = () => {
    setEditingId(null);
    setDailyFormData({
      title: '',
      content: '',
      tags: '',
      author: '',
      isActive: true
    });
  };

  const resetLibraryForm = () => {
    setEditingId(null);
    setLibraryFormData({
      title: '',
      content: '',
      category: '',
      tags: '',
      author: '',
      isActive: true
    });
  };

  const openEditDailyDialog = (tip: any) => {
    setEditingId(tip.id);
    setDailyFormData({
      title: tip.title || '',
      content: tip.content || '',
      tags: tip.tags || '',
      author: tip.author || '',
      isActive: tip.isActive !== undefined ? tip.isActive : true
    });
    setIsDialogOpen(true);
  };

  const openEditLibraryDialog = (tip: any) => {
    setEditingId(tip.id);
    setLibraryFormData({
      title: tip.title || '',
      content: tip.content || '',
      category: tip.category || '',
      tags: tip.tags || '',
      author: tip.author || '',
      isActive: tip.isActive !== undefined ? tip.isActive : true
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/admin')}
            className="text-gray-600 transition-colors hover:text-gray-900"
          >
            ← Back to Dashboard
          </button>
          <h1 className="flex-1 text-center text-4xl font-extrabold tracking-tight">
            Tips Management
          </h1>
          <div className="w-40" />
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);
            setIsDialogOpen(false);
            setEditingId(null);
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="daily">Daily Tips</TabsTrigger>
            <TabsTrigger value="library">Library Items</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="mt-6">
            <div className="mb-4 flex justify-end">
              <Dialog
                open={isDialogOpen && activeTab === 'daily'}
                onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) {
                    setEditingId(null);
                    resetDailyForm();
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={resetDailyForm}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingId ? 'Edit Daily Tip' : 'Create Daily Tip'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 space-y-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={dailyFormData.title}
                        onChange={(e) =>
                          setDailyFormData({
                            ...dailyFormData,
                            title: e.target.value
                          })
                        }
                        placeholder="Tip title"
                      />
                    </div>
                    <div>
                      <Label>Content</Label>
                      <Textarea
                        value={dailyFormData.content}
                        onChange={(e) =>
                          setDailyFormData({
                            ...dailyFormData,
                            content: e.target.value
                          })
                        }
                        placeholder="Tip content"
                        rows={6}
                      />
                    </div>
                    <div>
                      <Label>Tags (comma-separated)</Label>
                      <Input
                        value={dailyFormData.tags}
                        onChange={(e) =>
                          setDailyFormData({
                            ...dailyFormData,
                            tags: e.target.value
                          })
                        }
                        placeholder="tag1, tag2"
                      />
                    </div>
                    <div>
                      <Label>Author</Label>
                      <Input
                        value={dailyFormData.author}
                        onChange={(e) =>
                          setDailyFormData({
                            ...dailyFormData,
                            author: e.target.value
                          })
                        }
                        placeholder="Author name"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Active</Label>
                      <Switch
                        checked={dailyFormData.isActive}
                        onCheckedChange={(checked) =>
                          setDailyFormData({
                            ...dailyFormData,
                            isActive: checked
                          })
                        }
                      />
                    </div>
                    <Button
                      onClick={() =>
                        editingId
                          ? handleUpdateDaily(editingId)
                          : handleCreateDaily()
                      }
                      disabled={
                        createDailyMutation.isPending ||
                        updateDailyMutation.isPending
                      }
                      className="w-full"
                    >
                      {createDailyMutation.isPending ||
                      updateDailyMutation.isPending
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
            <div className="rounded-lg border border-black/5 bg-white p-6 shadow-sm">
              {isLoadingDaily ? (
                <div className="py-12 text-center">
                  <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
                  <p className="mt-4 text-gray-600">Loading daily tips...</p>
                </div>
              ) : !dailyTips ||
                (Array.isArray(dailyTips) && dailyTips.length === 0) ? (
                <div className="py-12 text-center">
                  <Sparkles className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <p className="text-gray-600">No daily tips found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {(dailyTips as any[]).map((tip: any) => (
                    <div
                      key={tip.id}
                      className="rounded-lg border border-gray-200 p-4 transition-shadow duration-300 hover:shadow-md"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="text-lg font-semibold">{tip.title}</h3>
                        <span
                          className={`rounded px-2 py-1 text-xs ${tip.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
                        >
                          {tip.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="mb-3 line-clamp-3 text-sm text-gray-600">
                        {tip.content}
                      </p>
                      <div className="mb-3 flex items-center gap-2 text-xs text-gray-500">
                        {tip.tags && (
                          <div className="flex flex-wrap gap-1">
                            {tip.tags
                              .split(',')
                              .map((tag: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="rounded bg-gray-100 px-2 py-1"
                                >
                                  {tag.trim()}
                                </span>
                              ))}
                          </div>
                        )}
                        {tip.author && <span>• {tip.author}</span>}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => openEditDailyDialog(tip)}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <Edit className="mr-1 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteDaily(tip.id)}
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
          </TabsContent>

          <TabsContent value="library" className="mt-6">
            <div className="mb-4 flex justify-end">
              <Dialog
                open={isDialogOpen && activeTab === 'library'}
                onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) {
                    setEditingId(null);
                    resetLibraryForm();
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={resetLibraryForm}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingId ? 'Edit Library Item' : 'Create Library Item'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 space-y-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={libraryFormData.title}
                        onChange={(e) =>
                          setLibraryFormData({
                            ...libraryFormData,
                            title: e.target.value
                          })
                        }
                        placeholder="Item title"
                      />
                    </div>
                    <div>
                      <Label>Content</Label>
                      <Textarea
                        value={libraryFormData.content}
                        onChange={(e) =>
                          setLibraryFormData({
                            ...libraryFormData,
                            content: e.target.value
                          })
                        }
                        placeholder="Item content"
                        rows={6}
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Input
                        value={libraryFormData.category}
                        onChange={(e) =>
                          setLibraryFormData({
                            ...libraryFormData,
                            category: e.target.value
                          })
                        }
                        placeholder="Category (e.g., ADHD)"
                      />
                    </div>
                    <div>
                      <Label>Tags (comma-separated)</Label>
                      <Input
                        value={libraryFormData.tags}
                        onChange={(e) =>
                          setLibraryFormData({
                            ...libraryFormData,
                            tags: e.target.value
                          })
                        }
                        placeholder="tag1, tag2"
                      />
                    </div>
                    <div>
                      <Label>Author</Label>
                      <Input
                        value={libraryFormData.author}
                        onChange={(e) =>
                          setLibraryFormData({
                            ...libraryFormData,
                            author: e.target.value
                          })
                        }
                        placeholder="Author name"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Active</Label>
                      <Switch
                        checked={libraryFormData.isActive}
                        onCheckedChange={(checked) =>
                          setLibraryFormData({
                            ...libraryFormData,
                            isActive: checked
                          })
                        }
                      />
                    </div>
                    <Button
                      onClick={() =>
                        editingId
                          ? handleUpdateLibrary(editingId)
                          : handleCreateLibrary()
                      }
                      disabled={
                        createLibraryMutation.isPending ||
                        updateLibraryMutation.isPending
                      }
                      className="w-full"
                    >
                      {createLibraryMutation.isPending ||
                      updateLibraryMutation.isPending
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
            <div className="rounded-lg border border-black/5 bg-white p-6 shadow-sm">
              {isLoadingLibrary ? (
                <div className="py-12 text-center">
                  <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
                  <p className="mt-4 text-gray-600">Loading library items...</p>
                </div>
              ) : !libraryTips ||
                (Array.isArray(libraryTips) && libraryTips.length === 0) ? (
                <div className="py-12 text-center">
                  <Sparkles className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <p className="text-gray-600">No library items found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {(libraryTips as any[]).map((tip: any) => (
                    <div
                      key={tip.id}
                      className="rounded-lg border border-gray-200 p-4 transition-shadow duration-300 hover:shadow-md"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="text-lg font-semibold">{tip.title}</h3>
                        <span
                          className={`rounded px-2 py-1 text-xs ${tip.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
                        >
                          {tip.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      {tip.category && (
                        <span className="bg-blue-100 text-blue-600 mb-2 inline-block rounded px-2 py-1 text-xs">
                          {tip.category}
                        </span>
                      )}
                      <p className="mb-3 line-clamp-3 text-sm text-gray-600">
                        {tip.content}
                      </p>
                      <div className="mb-3 flex items-center gap-2 text-xs text-gray-500">
                        {tip.tags && (
                          <div className="flex flex-wrap gap-1">
                            {tip.tags
                              .split(',')
                              .map((tag: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="rounded bg-gray-100 px-2 py-1"
                                >
                                  {tag.trim()}
                                </span>
                              ))}
                          </div>
                        )}
                        {tip.author && <span>• {tip.author}</span>}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => openEditLibraryDialog(tip)}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <Edit className="mr-1 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteLibrary(tip.id)}
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
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
