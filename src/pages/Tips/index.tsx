import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useDailyTips, useLibraryTips } from '@/queries/tips.query';
import LikeButton from '@/components/Tips/LikeButton';
import { formatVietnamDateTime } from '@/helpers/date';
import { Search, BookOpen, Calendar } from 'lucide-react';
import Footer from '@/components/shared/footer';

export default function TipsPage() {
  const [dailySearch, setDailySearch] = useState('');
  const [librarySearch, setLibrarySearch] = useState('');
  const [libraryCategory, setLibraryCategory] = useState<string | undefined>(
    undefined
  );

  const { data: dailyTips, isLoading: isLoadingDaily } = useDailyTips(
    dailySearch || undefined
  );
  const { data: libraryTips, isLoading: isLoadingLibrary } = useLibraryTips(
    libraryCategory,
    librarySearch || undefined
  );

  // Extract unique categories from library tips
  const categories = libraryTips
    ? Array.from(
        new Set(
          (libraryTips as any[]).map((tip: any) => tip.category).filter(Boolean)
        )
      )
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-extrabold tracking-tight">
            Tips & Resources
          </h1>
          <p className="text-gray-600">
            Khám phá các mẹo hữu ích và tài nguyên cho bạn
          </p>
        </div>

        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2">
            <TabsTrigger value="daily" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Daily Tips
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Library
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-4">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm daily tips..."
                value={dailySearch}
                onChange={(e) => setDailySearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {isLoadingDaily ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
              </div>
            ) : !dailyTips ||
              (Array.isArray(dailyTips) && dailyTips.length === 0) ? (
              <div className="py-12 text-center text-gray-500">
                Không có daily tips nào
              </div>
            ) : (
              <div className="space-y-4">
                {(dailyTips as any[]).map((tip: any) => (
                  <div
                    key={tip.id}
                    className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="mb-2 text-xl font-semibold text-gray-900">
                          {tip.title}
                        </h3>
                        <div className="mb-4 whitespace-pre-wrap text-gray-700">
                          {tip.content}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {tip.author && (
                            <span>
                              <span className="font-medium">Tác giả:</span>{' '}
                              {tip.author}
                            </span>
                          )}
                          {tip.tags && (
                            <span>
                              <span className="font-medium">Tags:</span>{' '}
                              {tip.tags}
                            </span>
                          )}
                          <span>{formatVietnamDateTime(tip.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end border-t border-gray-100 pt-4">
                      <LikeButton
                        tipId={tip.id}
                        tipType="Daily"
                        initialLikeCount={tip.likeCount || 0}
                        initialIsLiked={false} // You might want to track this from backend
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="library" className="space-y-4">
            <div className="mb-6 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm library items..."
                  value={librarySearch}
                  onChange={(e) => setLibrarySearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              {categories.length > 0 && (
                <select
                  value={libraryCategory || ''}
                  onChange={(e) =>
                    setLibraryCategory(e.target.value || undefined)
                  }
                  className="rounded-md border border-gray-300 bg-white px-4 py-2"
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map((cat: string) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {isLoadingLibrary ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
              </div>
            ) : !libraryTips ||
              (Array.isArray(libraryTips) && libraryTips.length === 0) ? (
              <div className="py-12 text-center text-gray-500">
                Không có library items nào
              </div>
            ) : (
              <div className="space-y-4">
                {(libraryTips as any[]).map((tip: any) => (
                  <div
                    key={tip.id}
                    className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {tip.title}
                          </h3>
                          {tip.category && (
                            <span className="bg-blue-100 text-blue-700 rounded px-2 py-1 text-xs font-medium">
                              {tip.category}
                            </span>
                          )}
                        </div>
                        <div className="mb-4 whitespace-pre-wrap text-gray-700">
                          {tip.content}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {tip.author && (
                            <span>
                              <span className="font-medium">Tác giả:</span>{' '}
                              {tip.author}
                            </span>
                          )}
                          {tip.tags && (
                            <span>
                              <span className="font-medium">Tags:</span>{' '}
                              {tip.tags}
                            </span>
                          )}
                          <span>{formatVietnamDateTime(tip.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end border-t border-gray-100 pt-4">
                      <LikeButton
                        tipId={tip.id}
                        tipType="Library"
                        initialLikeCount={tip.likeCount || 0}
                        initialIsLiked={false} // You might want to track this from backend
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
