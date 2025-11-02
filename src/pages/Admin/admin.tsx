import Footer from '@/components/shared/footer';
import {
  useAdminDashboardStats,
  useAdminMonthlyRevenue
} from '@/queries/admin.query';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Users,
  DollarSign,
  FileText,
  MessageSquare,
  Package,
  FolderOpen,
  Sparkles,
  Activity
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getRoleFromToken } from '@/helpers/jwt';
import helper from '@/helpers/index';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import UserNav from '@/components/shared/user-nav';

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884d8',
  '#82ca9d'
];

export default function AdminHome() {
  const { data: stats, isLoading } = useAdminDashboardStats();
  const navigate = useNavigate();
  const authState = useSelector((state: RootState) => state.auth);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const { data: monthlyRevenueData, isLoading: isLoadingMonthly } =
    useAdminMonthlyRevenue(selectedYear);

  useEffect(() => {
    // Verify role on mount
    const token = helper.cookie_get('AT');
    if (token) {
      const role = getRoleFromToken(token);
      if (role !== 'Admin') {
        navigate('/stayonhome');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Prepare metrics cards
  const metrics = [
    {
      label: 'Total Users',
      value: stats?.users?.total || 0,
      delta: `+${stats?.users?.newToday || 0} today`,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      label: 'Revenue (All Time)',
      value: new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(stats?.revenue?.allTime || 0),
      delta: `${stats?.revenue?.transactions?.successful || 0} successful`,
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      label: 'Total Templates',
      value: stats?.content?.templates?.total || 0,
      delta: `${stats?.content?.templates?.downloads || 0} downloads`,
      icon: FileText,
      color: 'text-purple-600'
    },
    {
      label: 'Total Sessions',
      value: stats?.activity?.sessions?.total || 0,
      delta: `Avg: ${stats?.activity?.sessions?.avgDurationMinutes || 0} min`,
      icon: Activity,
      color: 'text-orange-600'
    }
  ];

  // Prepare user growth chart data (simplified - using available data)
  const userGrowthData = [
    { name: 'Free Users', value: stats?.users?.subscriptions?.free || 0 },
    { name: 'Premium Users', value: stats?.users?.subscriptions?.premium || 0 }
  ];

  // Prepare template revenue chart data
  const templateData = [
    { name: 'Total', value: stats?.content?.templates?.total || 0 },
    { name: 'Paid', value: stats?.content?.templates?.paid || 0 },
    {
      name: 'Free',
      value:
        (stats?.content?.templates?.total || 0) -
        (stats?.content?.templates?.paid || 0)
    }
  ];

  // Prepare revenue breakdown
  const revenueData = [
    { period: 'Today', value: stats?.revenue?.today || 0 },
    { period: 'Week', value: stats?.revenue?.week || 0 },
    { period: 'Month', value: stats?.revenue?.month || 0 },
    { period: 'All Time', value: stats?.revenue?.allTime || 0 }
  ];

  // Prepare monthly revenue data for selected year
  const monthlyRevenueChartData = monthlyRevenueData?.monthlyRevenue
    ? (monthlyRevenueData.monthlyRevenue as any[]).map((item: any) => ({
        month: item.monthName || `Tháng ${item.month}`,
        revenue: item.revenue || 0
      }))
    : Array.from({ length: 12 }, (_, i) => ({
        month: new Date(selectedYear, i, 1).toLocaleDateString('vi-VN', {
          month: 'short'
        }),
        revenue: 0
      }));

  // Generate year options (from 2020 to current year + 1)
  const yearOptions = Array.from(
    { length: currentYear - 2019 },
    (_, i) => currentYear - i
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300">
      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Top header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/stayonhome')}
              className="text-gray-600 transition-colors hover:text-gray-900"
            >
              ← Back
            </button>
          </div>
          <h1 className="flex-1 text-center text-4xl font-extrabold tracking-tight">
            DASHBOARD
          </h1>
          <div className="flex w-40 justify-end">
            <UserNav />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left / Main area */}
          <div className="space-y-6 transition-all duration-300 lg:col-span-9">
            {/* Metric summary */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {metrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div
                    key={metric.label}
                    className="transform rounded-lg border border-black/5 bg-white p-4 shadow-sm transition-shadow duration-300 hover:-translate-y-1 hover:shadow-md"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className={`text-sm text-gray-500 ${metric.color}`}>
                        {metric.label}
                      </div>
                      <Icon className={`h-5 w-5 ${metric.color}`} />
                    </div>
                    <div className="mt-2 text-2xl font-semibold transition-all duration-300">
                      {typeof metric.value === 'string'
                        ? metric.value
                        : metric.value.toLocaleString()}
                    </div>
                    <div className="mt-1 text-xs text-green-600">
                      {metric.delta}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Large chart - Users Overview */}
            <div className="rounded-lg border border-black/5 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="mb-4 flex items-start justify-between">
                <h2 className="text-lg font-semibold">Users Overview</h2>
                <div className="text-sm text-gray-500">
                  Active: {stats?.users?.active30Days || 0} (30 days)
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="w-48 space-y-4">
                  <div>
                    <div className="mb-3 text-sm font-medium">User Types</div>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center justify-between">
                        <span>Free</span>
                        <span className="font-semibold">
                          {stats?.users?.subscriptions?.free || 0}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Premium</span>
                        <span className="font-semibold">
                          {stats?.users?.subscriptions?.premium || 0}
                        </span>
                      </li>
                      <li className="flex items-center justify-between border-t pt-2">
                        <span>Total</span>
                        <span className="font-semibold">
                          {stats?.users?.total || 0}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Revenue Chart - New Large Chart */}
            <div className="rounded-lg border border-black/5 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Monthly Revenue</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Year:</span>
                  <Select
                    value={selectedYear.toString()}
                    onValueChange={(value) => setSelectedYear(parseInt(value))}
                  >
                    <SelectTrigger className="h-9 w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {yearOptions.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {isLoadingMonthly ? (
                <div className="flex h-64 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyRevenueChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) =>
                        new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(value)
                      }
                      labelStyle={{ color: '#333' }}
                    />
                    <Legend />
                    <Bar
                      dataKey="revenue"
                      fill="#00C49F"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Smaller cards row */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Revenue Chart */}
              <div className="rounded-lg border border-black/5 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="mb-3 text-sm text-gray-500">
                  Revenue Breakdown
                </div>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) =>
                        new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(value)
                      }
                    />
                    <Bar dataKey="value" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Templates Chart */}
              <div className="rounded-lg border border-black/5 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="mb-3 text-sm text-gray-500">
                  Templates Distribution
                </div>
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={templateData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={50}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {templateData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Content Stats */}
              <div className="rounded-lg border border-black/5 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="mb-3 text-sm text-gray-500">
                  Content Statistics
                </div>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tips (Daily)</span>
                    <span className="font-semibold">
                      {stats?.content?.tips?.daily || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tips (Library)</span>
                    <span className="font-semibold">
                      {stats?.content?.tips?.library || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-2">
                    <span className="text-sm font-medium">Confessions</span>
                    <span className="font-semibold">
                      {stats?.content?.confessions?.total || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <aside className="space-y-4 lg:col-span-3">
            {/* Alerts */}
            {stats?.alerts && stats.alerts.length > 0 && (
              <div className="rounded-lg border border-black/5 bg-white p-4 shadow-sm transition-all duration-300">
                <h3 className="text-red-600 mb-3 text-sm font-semibold">
                  Alerts
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  {(stats.alerts as any[]).map((alert: any, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="bg-red-400 mt-2 h-2 w-2 flex-shrink-0 rounded-full" />
                      <span>
                        {alert.message ||
                          `${alert.count} ${alert.type} pending`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick Stats */}
            <div className="rounded-lg border border-black/5 bg-white p-4 shadow-sm transition-all duration-300">
              <h3 className="mb-3 text-sm font-semibold">Quick Stats</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center justify-between">
                  <span>Pending Confessions</span>
                  <span className="text-orange-600 font-semibold">
                    {stats?.content?.confessions?.pendingApproval || 0}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Pending Transactions</span>
                  <span className="text-yellow-600 font-semibold">
                    {stats?.revenue?.transactions?.pending || 0}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Refunded</span>
                  <span className="text-red-600 font-semibold">
                    {stats?.revenue?.transactions?.refunded || 0}
                  </span>
                </li>
                <li className="flex items-center justify-between border-t pt-2">
                  <span>Sessions with AI</span>
                  <span className="font-semibold">
                    {stats?.activity?.sessions?.withAI || 0}
                  </span>
                </li>
              </ul>
            </div>

            {/* Navigation */}
            <div className="rounded-lg border border-black/5 bg-white p-4 shadow-sm transition-all duration-300">
              <h3 className="mb-3 text-sm font-semibold">Management</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => navigate('/admin/confessions')}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Confessions
                    {stats?.content?.confessions?.pendingApproval > 0 && (
                      <span className="bg-red-500 ml-auto rounded-full px-2 py-1 text-xs text-white">
                        {stats.content.confessions.pendingApproval}
                      </span>
                    )}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/admin/premium-packages')}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100"
                  >
                    <Package className="h-4 w-4" />
                    Premium Packages
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/admin/template-categories')}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100"
                  >
                    <FolderOpen className="h-4 w-4" />
                    Template Categories
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/admin/templates')}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100"
                  >
                    <FileText className="h-4 w-4" />
                    Templates
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/admin/tips')}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100"
                  >
                    <Sparkles className="h-4 w-4" />
                    Tips
                  </button>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
