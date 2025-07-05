"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
// Dynamically import react-calendar and recharts for client-side rendering
const Calendar = dynamic(() => import("react-calendar"), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then(m => m.ResponsiveContainer), { ssr: false });
const BarChart = dynamic(() => import("recharts").then(m => m.BarChart), { ssr: false });
const Bar = dynamic(() => import("recharts").then(m => m.Bar), { ssr: false });
const LineChart = dynamic(() => import("recharts").then(m => m.LineChart), { ssr: false });
const Line = dynamic(() => import("recharts").then(m => m.Line), { ssr: false });
const XAxis = dynamic(() => import("recharts").then(m => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then(m => m.YAxis), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then(m => m.Tooltip), { ssr: false });

import "react-calendar/dist/Calendar.css";

export default function Dashboard() {
    const [journalDates, setJournalDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState([]);
    const [chartType, setChartType] = useState("bar");
    const router = useRouter();

    const [streak, setStreak] = useState(0);
    const [recordStreak, setRecordStreak] = useState(0);
    useEffect(() => {
        const fetchJournals = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }
            try {
                const res = await fetch("/api/journals", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Failed to fetch journals");
                const data = await res.json();
                // Handle both array and object response for backward compatibility
                const journals = Array.isArray(data) ? data : data.journals;
                if (!Array.isArray(journals)) throw new Error("Malformed journals response");
                // Extract journal dates
                const dates = journals.map(j => new Date(j.createdAt));
                setJournalDates(dates);
                // Prepare chart data (frequency per day)
                const freq = {};
                dates.forEach(date => {
                    const key = date.toISOString().slice(0, 10);
                    freq[key] = (freq[key] || 0) + 1;
                });
                // Last 30 days
                const today = new Date();
                const chartArr = [];
                for (let i = 29; i >= 0; i--) {
                    const d = new Date(today);
                    d.setDate(today.getDate() - i);
                    const key = d.toISOString().slice(0, 10);
                    chartArr.push({
                        date: key.slice(5),
                        count: freq[key] || 0,
                    });
                }
                setChartData(chartArr);
                // Set streaks from backend if available
                if (data.streak !== undefined) setStreak(data.streak);
                if (data.recordStreak !== undefined) setRecordStreak(data.recordStreak);
            } catch (err) {
                alert("Error loading dashboard: " + err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchJournals();
    }, [router]);

    // Highlight days with journals
    const tileClassName = ({ date, view }) => {
        if (view === "month") {
            const found = journalDates.some(jd =>
                jd.getFullYear() === date.getFullYear() &&
                jd.getMonth() === date.getMonth() &&
                jd.getDate() === date.getDate()
            );
            return found ? "bg-violet-400 text-white rounded-full font-bold" : null;
        }
        return null;
    };



    return (
        <>
        <div className="min-h-screen w-full p-4 md:p-6 bg-neutral-900">
            <div className="mt-10 mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center text-violet-400">Journal Dashboard</h1>
                {loading ? (
                    <div className="text-center text-gray-300">Loading...</div>
                ) : (
                    <>
                        {/* Calendar Section */}
                        <section className="bg-neutral-800 rounded-2xl shadow-lg p-6 mb-8">
                            <h2 className="text-2xl font-bold mb-6 text-violet-300 text-center">Your Journal Calendar</h2>
                            <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
                                <div className="flex-shrink-0">
                                        <div className="w-96	">
                                        <Calendar
                                            onChange={async (date) => {
                                                setSelectedDate(date);
                                                // If journal exists for this day, go to journals and open it
                                                const found = journalDates.find(jd =>
                                                    jd.getFullYear() === date.getFullYear() &&
                                                    jd.getMonth() === date.getMonth() &&
                                                    jd.getDate() === date.getDate()
                                                );
                                                if (found) {
                                                    // Pass the date as a query param to /journals
                                                    router.push(`/journals?date=${date.toISOString().slice(0,10)}`);
                                                }
                                            }}
                                            value={selectedDate}
                                            tileClassName={({ date, view }) => {
                                                if (view !== "month") return null;
                                                const today = new Date();
                                                const isToday =
                                                    date.getFullYear() === today.getFullYear() &&
                                                    date.getMonth() === today.getMonth() &&
                                                    date.getDate() === today.getDate();
                                                const isJournalDay = journalDates.some(jd =>
                                                    jd.getFullYear() === date.getFullYear() &&
                                                    jd.getMonth() === date.getMonth() &&
                                                    jd.getDate() === date.getDate()
                                                );
                                                const isPast = date < today.setHours(0,0,0,0);
                                                if (isToday) return "today-tile";
                                                if (isJournalDay) return "journal-tile";
                                                if (isPast) return "missed-tile";
                                                return null;
                                            }}
                                            className="custom-calendar"
                                        />
                                                <div className="mt-6 text-center text-base text-gray-400 w-50">
                                                    {selectedDate &&
                                                        (journalDates.some(jd =>
                                                            jd.getFullYear() === selectedDate.getFullYear() &&
                                                            jd.getMonth() === selectedDate.getMonth() &&
                                                            jd.getDate() === selectedDate.getDate()
                                                        ) ? (
                                                            <span>🎉 You wrote a journal on this day!</span>
                                                        ) : (
                                                            <span>No journal entry for this day.</span>
                                                        ))}
                                                </div>
                                    </div>
                                </div>
                                <div className="flex-1 lg:ml-8 w-full">
                                    <div className="bg-neutral-700 rounded-xl p-8 h-full flex flex-col justify-center min-h-80">
                                        <div className="text-center lg:text-left">
                                            <h3 className="text-3xl font-bold text-violet-300 mb-6">Your Streak 🔥</h3>
                                            <div className="space-y-6">
                                            <div className="text-4xl font-bold text-violet-400">
                                                {streak} days
                                            </div>
                                            <div className="text-xl text-gray-400">
                                                {streak > 1 ? "Keep it up! You're on fire!" : "Start journaling daily to build your streak!"}
                                            </div>
                                            <div className="border-t border-neutral-600 pt-6 mt-6">
                                                <div className="text-lg text-gray-500 mb-2">Previous Record Streak:</div>
                                                <div className="text-4xl font-semibold text-violet-300">
                                                    {recordStreak} days
                                                </div>
                                                <div className="text-sm text-gray-400 mt-2">
                                                    {streak >= recordStreak ? "🎉 New record!" : `${recordStreak - streak} days to beat your record!`}
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </section>

                        {/* Chart Section */}
                        <section className="bg-neutral-800 rounded-2xl shadow-lg p-6 mb-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-violet-300">Last 30 Days</h2>
                                <button
                                    className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 duration-200 text-sm"
                                    onClick={() => setChartType(chartType === 'bar' ? 'line' : 'bar')}
                                >
                                    Toggle to {chartType === 'bar' ? 'Line' : 'Bar'} Chart
                                </button>
                            </div>
                            <div className="w-full h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    {chartType === 'bar' ? (
                                        <BarChart data={chartData}>
                                            <XAxis dataKey="date" tick={{ fontSize: 14, fill: '#a78bfa' }} />
                                            <YAxis allowDecimals={false} tick={{ fontSize: 14, fill: '#a78bfa' }} />
                                            <Tooltip contentStyle={{ background: '#18181b', border: 'none', color: '#fff' }} />
                                            <Bar dataKey="count" fill="#a78bfa" radius={[6, 6, 0, 0]} />
                                        </BarChart>
                                    ) : (
                                        <LineChart data={chartData}>
                                            <XAxis dataKey="date" tick={{ fontSize: 14, fill: '#a78bfa' }} />
                                            <YAxis allowDecimals={false} tick={{ fontSize: 14, fill: '#a78bfa' }} />
                                            <Tooltip contentStyle={{ background: '#18181b', border: 'none', color: '#fff' }} />
                                            <Line type="monotone" dataKey="count" stroke="#a78bfa" strokeWidth={3} dot={{ r: 5, fill: '#a78bfa' }} />
                                        </LineChart>
                                    )}
                                </ResponsiveContainer>
                            </div>
                        </section>

                        {/* Full-width chart option - uncomment if you want the chart to span full width */}
                        {/*
            <section className="bg-neutral-800 rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-violet-300">Last 30 Days - Full Width</h2>
                <button
                  className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 duration-200 text-sm"
                  onClick={() => setChartType(chartType === 'bar' ? 'line' : 'bar')}
                >
                  Toggle to {chartType === 'bar' ? 'Line' : 'Bar'} Chart
                </button>
              </div>
              <div className="w-full h-96">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'bar' ? (
                    <BarChart data={chartData}>
                      <XAxis dataKey="date" tick={{ fontSize: 14, fill: '#a78bfa' }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 14, fill: '#a78bfa' }} />
                      <Tooltip contentStyle={{ background: '#18181b', border: 'none', color: '#fff' }} />
                      <Bar dataKey="count" fill="#a78bfa" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  ) : (
                    <LineChart data={chartData}>
                      <XAxis dataKey="date" tick={{ fontSize: 14, fill: '#a78bfa' }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 14, fill: '#a78bfa' }} />
                      <Tooltip contentStyle={{ background: '#18181b', border: 'none', color: '#fff' }} />
                      <Line type="monotone" dataKey="count" stroke="#a78bfa" strokeWidth={3} dot={{ r: 5, fill: '#a78bfa' }} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </section>
            */}

                        <div className="text-center mt-8">
                            <button
                                className="px-6 py-3 bg-violet-500 text-white rounded-lg hover:bg-violet-600 duration-300 font-medium"
                                onClick={() => router.push("/journals")}
                            >
                                Go to Journals
                            </button>
                        </div>
                    </>
                )}
            </div>

            <style jsx global>{`
        .custom-calendar {
          border-radius: 1rem;
          background: #18181b;
          border: none;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          padding: 1rem;
          width: 100%;
        }
        .custom-calendar .journal-tile {
          background: #a78bfa !important;
          color: #fff !important;
        }
        .custom-calendar .today-tile {
          background: #fff !important;
          color: #18181b !important;
          font-weight: 700;
        }
        .custom-calendar .missed-tile {
          background: #27272a !important;
          color: #a1a1aa !important;
          opacity: 0.5;
        }
        .custom-calendar .react-calendar__tile--active {
          background: #a78bfa !important;
          color: #fff !important;
        }
        .custom-calendar .react-calendar__tile {
          border-radius: 0.5rem;
          font-weight: 500;
          transition: all 0.2s ease;
          margin: 2px;
          height: 40px;
        }
        .custom-calendar .react-calendar__tile:enabled:hover {
          background: #c4b5fd !important;
          color: #18181b !important;
        }
        .custom-calendar .react-calendar__month-view__days__day--weekend {
          color: #f87171 !important;
        }
        .custom-calendar .react-calendar__navigation button {
          color: #a78bfa;
          font-weight: 600;
          font-size: 16px;
        }
        .custom-calendar .react-calendar__navigation button:enabled:hover {
          background: rgba(167, 139, 250, 0.1);
        }
        .custom-calendar .react-calendar__month-view__weekdays {
          color: #a78bfa;
          font-weight: 600;
        }
      `}</style>
            </div></>
    );
}