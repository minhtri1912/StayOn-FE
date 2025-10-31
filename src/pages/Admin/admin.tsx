import Footer from '@/components/shared/footer';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function AdminHome() {
  // The `admin` slice may be missing in some branches (the slice or store registration
  // was undone). Use a permissive selector here to avoid a TypeScript error when
  // `RootState` doesn't include `admin`. Restore the strongly-typed selector after
  // the `admin` reducer is added back to the store.
  const admin = useSelector((s: any) => s?.admin);



  const metrics = admin?.metrics ?? [];


  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-10 px-6">
        {/* Top header */}
        <div className="flex items-center justify-between mb-8">

          <h1 className="text-4xl font-extrabold tracking-tight text-center flex-1">DASHBOARD</h1>

          <div className="w-40" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left / Main area */}
          <div className="lg:col-span-9 space-y-6">
            {/* Metric summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {metrics.map((m) => (
                <div key={m.label} className="bg-white p-4 rounded-lg shadow-sm border border-black/5">
                  <div className="text-sm text-gray-500">{m.label}</div>
                  <div className="text-2xl font-semibold mt-2">{m.value}</div>
                  <div className="text-xs text-green-600 mt-1">{m.delta}</div>
                </div>
              ))}
            </div>

            {/* Large chart placeholder */}
            <div className="bg-white rounded-lg shadow-sm border border-black/5 p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-lg font-semibold">Total Users</h2>
                <div className="text-sm text-gray-500">This year vs Last year</div>
              </div>

              <div className="flex gap-6">
                {/* Line chart area */}
                <div className="flex-1">
                  <ChartLines {...(admin?.chart ?? undefined)} />
                </div>

                {/* Right mini legend/list */}
                <div className="w-48 bg-white">
                  <div className="text-sm font-medium mb-3">Traffic by Website</div>
                  <ul className="space-y-3 text-sm text-gray-700">
                    {[
                      ['Google', 80],
                      ['YouTube', 60],
                      ['Instagram', 50],
                      ['Pinterest', 40],
                      ['Facebook', 30],
                      ['Twitter', 20]
                    ].map(([name, pct]) => (
                      <li key={String(name)} className="flex items-center justify-between">
                        <span>{name}</span>
                        <div className="w-24 h-2 bg-gray-200 rounded overflow-hidden ml-2">
                          <div style={{ width: `${pct}%` }} className="h-full bg-black/70" />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Smaller cards row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-black/5 p-4">
                <div className="text-sm text-gray-500">Traffic by Device</div>
                <div className="h-28 mt-3 bg-gray-50 rounded-md flex items-center justify-center text-gray-400">Bar chart</div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-black/5 p-4">
                <div className="text-sm text-gray-500">Traffic by Location</div>
                <div className="h-28 mt-3 bg-gray-50 rounded-md flex items-center justify-center text-gray-400">Pie chart</div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-black/5 p-4">
                <div className="text-sm text-gray-500">Marketing & SEO</div>
                <div className="h-28 mt-3 bg-gray-50 rounded-md flex items-center justify-center text-gray-400">Trends</div>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-black/5 p-4 mb-4">
              <h3 className="text-sm font-semibold mb-3">Notifications</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-red-400 mt-2" /> You fixed a bug.</li>
                <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-green-400 mt-2" /> New user registered.</li>
                <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-yellow-400 mt-2" /> New resource added.</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-black/5 p-4 mb-4">
              <h3 className="text-sm font-semibold mb-3">Recent activity</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li>Changed the style.</li>
                <li>Submitted a new version.</li>
                <li>Deleted a page in Project X.</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-black/5 p-4">
              <h3 className="text-sm font-semibold mb-3">Contacts</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>Natalie Craig</li>
                <li>Drew Cano</li>
                <li>Andi Lane</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ChartLines(props?: { months?: string[]; thisYear?: number[]; lastYear?: number[] }) {
  const months = props?.months ?? ['Jan','Feb','Mar','Apr','May','Jun','Jul'];
  const thisYear = props?.thisYear ?? [11000,9000,12000,25000,23000,18000,24000];
  const lastYear = props?.lastYear ?? [5000,15000,8000,7000,10000,22000,30000];

  const w = 520;
  const h = 180;
  const pad = 20;
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;

  const max = Math.max(...thisYear, ...lastYear) * 1.1;
  const toX = (i: number) => pad + (innerW * i) / (months.length - 1);
  const toY = (v: number) => pad + innerH - (innerH * v) / max;

  const points = (arr: number[]) => arr.map((v, i) => `${toX(i)},${toY(v)}`).join(' ');
  const polyThis = points(thisYear);
  const polyLast = points(lastYear);

  const areaPath = `M ${toX(0)} ${toY(0)} L ${thisYear.map((v,i)=>`${toX(i)} ${toY(v)}`).join(' L ')} L ${toX(months.length-1)} ${toY(0)} Z`;

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="220">
        <defs>
          <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#F8FAFC" stopOpacity="1" />
            <stop offset="100%" stopColor="#F8FAFC" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* background grid */}
        <rect x={0} y={0} width={w} height={h} rx={12} fill="#fff" />

        {/* area under this year */}
        <path d={areaPath} fill="url(#areaGrad)" />

        {/* last year dotted */}
        <polyline points={polyLast} fill="none" stroke="#93C5FD" strokeWidth={2} strokeDasharray="6 6" strokeLinecap="round" strokeLinejoin="round" />

        {/* this year solid */}
        <polyline points={polyThis} fill="none" stroke="#111827" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

        {/* month labels */}
        {months.map((m, i) => (
          <text key={m} x={toX(i)} y={h - 4} textAnchor="middle" fontSize={10} fill="#9CA3AF">{m}</text>
        ))}
      </svg>
    </div>
  );
}
