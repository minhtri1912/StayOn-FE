import {
  useAdminConfessionsPending,
  useApproveConfession,
  useRejectConfession
} from '@/queries/admin.query';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { MessageSquare, Check, X } from 'lucide-react';
import { formatVietnamDateTime } from '@/helpers/date';

export default function AdminConfessions() {
  const { data: confessions, isLoading } = useAdminConfessionsPending();
  const approveMutation = useApproveConfession();
  const rejectMutation = useRejectConfession();
  const navigate = useNavigate();
  const authState = useSelector((state: RootState) => state.auth);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    if (!authState.userId) return;
    setProcessingId(id);
    try {
      await approveMutation.mutateAsync({ id, moderatorId: authState.userId });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!authState.userId) return;
    setProcessingId(id);
    try {
      await rejectMutation.mutateAsync({ id, moderatorId: authState.userId });
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading confessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="text-gray-600 transition-colors hover:text-gray-900"
            >
              ← Back to Dashboard
            </button>
          </div>
          <h1 className="flex-1 text-center text-4xl font-extrabold tracking-tight">
            Confessions Management
          </h1>
          <div className="w-40" />
        </div>

        <div className="rounded-lg border border-black/5 bg-white p-6 shadow-sm">
          {!confessions ||
          (Array.isArray(confessions) && confessions.length === 0) ? (
            <div className="py-12 text-center">
              <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-600">No pending confessions</p>
            </div>
          ) : (
            <div className="space-y-4">
              {(confessions as any[]).map((confession: any) => (
                <div
                  key={confession.id}
                  className="rounded-lg border border-gray-200 p-4 transition-shadow duration-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        {confession.isAnonymous ? (
                          <span className="rounded bg-gray-100 px-2 py-1 text-xs">
                            Anonymous
                          </span>
                        ) : (
                          <span className="bg-blue-100 rounded px-2 py-1 text-xs">
                            Identified
                          </span>
                        )}
                        {confession.reportCount > 0 && (
                          <span className="bg-red-100 text-red-600 rounded px-2 py-1 text-xs">
                            {confession.reportCount} reports
                          </span>
                        )}
                      </div>
                      <p className="mb-2 text-gray-800">{confession.content}</p>
                      <p className="text-xs text-gray-500">
                        Created: {formatVietnamDateTime(confession.createdAt)}
                      </p>
                    </div>
                    <div className="ml-4 flex gap-2">
                      <Button
                        onClick={() => handleApprove(confession.id)}
                        disabled={processingId === confession.id}
                        className="bg-green-600 text-white hover:bg-green-700"
                        size="sm"
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(confession.id)}
                        disabled={processingId === confession.id}
                        variant="destructive"
                        size="sm"
                      >
                        <X className="mr-1 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
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
