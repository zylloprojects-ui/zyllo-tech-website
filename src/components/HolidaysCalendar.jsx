// HolidaysCalendar.jsx - High-fidelity Holidays & Calendar component matching E:\zyllotech
import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info,
  CalendarDays,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
} from "lucide-react";

export const OFFICIAL_HOLIDAYS = [
  { date: "01 Jan 2026", name: "New Year Day", title: "New Year Day", day: "Thursday", type: "Public Holiday" },
  { date: "15 Jan 2026", name: "Makar Sankranti / Pongal", title: "Makar Sankranti / Pongal", day: "Thursday", type: "Public Holiday" },
  { date: "26 Jan 2026", name: "Republic Day", title: "Republic Day", day: "Monday", type: "National Holiday" },
  { date: "04 Mar 2026", name: "Holi", title: "Holi", day: "Wednesday", type: "Public Holiday" },
  { date: "20 Mar 2026", name: "Eid-ul-Fitr", title: "Eid-ul-Fitr", day: "Friday", type: "Public Holiday" },
  { date: "03 Apr 2026", name: "Good Friday", title: "Good Friday", day: "Friday", type: "Public Holiday" },
  { date: "14 Apr 2026", name: "Dr. B.R. Ambedkar Jayanti", title: "Dr. B.R. Ambedkar Jayanti", day: "Tuesday", type: "Public Holiday" },
  { date: "01 May 2026", name: "International Workers Day", title: "International Workers Day", day: "Friday", type: "Public Holiday" },
  { date: "15 Aug 2026", name: "Independence Day", title: "Independence Day", day: "Saturday", type: "National Holiday" },
  { date: "02 Oct 2026", name: "Mahatma Gandhi Jayanti", title: "Mahatma Gandhi Jayanti", day: "Friday", type: "National Holiday" },
  { date: "20 Oct 2026", name: "Vijaya Dashami (Dussehra)", title: "Vijaya Dashami (Dussehra)", day: "Tuesday", type: "Public Holiday" },
  { date: "08 Nov 2026", name: "Diwali", title: "Diwali", day: "Sunday", type: "Festival · Verify with actual HR" },
  { date: "09 Nov 2026", name: "Govardhan Puja", title: "Govardhan Puja", day: "Monday", type: "Festival Holiday" },
  { date: "24 Nov 2026", name: "Guru Nanak Jayanti", title: "Guru Nanak Jayanti", day: "Tuesday", type: "Public Holiday" },
  { date: "25 Dec 2026", name: "Christmas Day", title: "Christmas Day", day: "Friday", type: "Public Holiday" },
  { date: "01 Jan 2027", name: "New Year Day", title: "New Year Day", day: "Friday", type: "Public Holiday" },
  { date: "14 Jan 2027", name: "Makar Sankranti / Pongal", title: "Makar Sankranti / Pongal", day: "Thursday", type: "Public Holiday" },
  { date: "26 Jan 2027", name: "Republic Day", title: "Republic Day", day: "Tuesday", type: "National Holiday" },
];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function HolidaysCalendar({
  initialYear = 2026,
  initialMonth = 10, // 10 = November (0-indexed) matching photo
  onAskHr,
  onDateClick,
  userRole = "employee",
}) {
  const [calYear, setCalYear] = useState(initialYear);
  const [calMonth, setCalMonth] = useState(initialMonth); // 0-indexed
  const [selectedFestival, setSelectedFestival] = useState(null);

  function changeMonth(delta) {
    let nextM = calMonth + delta;
    let nextY = calYear;
    if (nextM < 0) {
      nextM = 11;
      nextY -= 1;
    } else if (nextM > 11) {
      nextM = 0;
      nextY += 1;
    }
    setCalMonth(nextM);
    setCalYear(nextY);
  }

  function goToToday() {
    const now = new Date();
    setCalYear(now.getFullYear());
    setCalMonth(now.getMonth());
  }

  // Calculate calendar days
  const calendarData = useMemo(() => {
    const totalDays = new Date(calYear, calMonth + 1, 0).getDate();
    const firstDay = new Date(calYear, calMonth, 1).getDay(); // 0 is Sunday
    const startOffset = (firstDay + 6) % 7; // Monday = 0, Sunday = 6

    const now = new Date();
    const isRealCurrentMonth = now.getFullYear() === calYear && now.getMonth() === calMonth;
    const realTodayDate = now.getDate();

    const shortM = SHORT_MONTHS[calMonth].toLowerCase();

    // Find holidays for current selected month
    const monthHolidays = OFFICIAL_HOLIDAYS.filter((h) => {
      if (!h.date) return false;
      const d = h.date.trim();
      const parts = d.split(/\s+/);
      if (parts.length >= 3) {
        return (
          parts[1].toLowerCase().startsWith(shortM) &&
          parseInt(parts[2], 10) === calYear
        );
      }
      return false;
    });

    return {
      totalDays,
      startOffset,
      isRealCurrentMonth,
      realTodayDate,
      monthHolidays,
    };
  }, [calYear, calMonth]);

  function getHoliday(day) {
    const padDay = String(day).padStart(2, "0");
    const shortM = SHORT_MONTHS[calMonth].toLowerCase();

    return OFFICIAL_HOLIDAYS.find((h) => {
      if (!h.date) return false;
      const d = h.date.trim();
      const parts = d.split(/\s+/);
      if (parts.length >= 3) {
        return (
          parseInt(parts[0], 10) === day &&
          parts[1].toLowerCase().startsWith(shortM) &&
          parseInt(parts[2], 10) === calYear
        );
      }
      return d === `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${padDay}`;
    });
  }

  function handleCellClick(day) {
    const hol = getHoliday(day);
    if (hol) {
      setSelectedFestival(hol);
    }
    if (onDateClick) {
      const padM = String(calMonth + 1).padStart(2, "0");
      const padD = String(day).padStart(2, "0");
      onDateClick({
        year: calYear,
        month: calMonth,
        day,
        dateStr: `${calYear}-${padM}-${padD}`,
        formatted: `${padD} ${SHORT_MONTHS[calMonth]} ${calYear}`,
        holiday: hol,
      });
    }
  }

  function handleAskHrClick(holiday) {
    if (onAskHr) {
      onAskHr(holiday.name || holiday.title, holiday);
    }
  }

  return (
    <div className="space-y-6 font-sans">
      {/* ================= MAIN CALENDAR WHITE CARD ================= */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm text-slate-900">
        {/* Header with Title and Month Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <span className="text-xs sm:text-sm font-extrabold text-[#f96706] tracking-[0.08em] uppercase block">
              PLAN AHEAD
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Holidays &amp; calendar
            </h3>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              India holiday calendar preview · confirm dates with your actual HR team.
            </p>
          </div>

          {/* Month Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-2xs"
              title="Previous Month"
              aria-label="Previous Month"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="min-w-[160px] text-center font-extrabold text-slate-900 text-base sm:text-lg select-none">
              {MONTH_NAMES[calMonth]} {calYear}
            </div>

            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-2xs"
              title="Next Month"
              aria-label="Next Month"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={goToToday}
              className="ml-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-2xs"
            >
              Today
            </button>
          </div>
        </div>

        {/* Weekday Headers (Mon - Sun, starts on Monday) */}
        <div className="grid grid-cols-7 gap-2 mt-4 text-center">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((w) => (
            <div key={w} className="py-2 text-xs sm:text-sm font-extrabold text-slate-600">
              {w}
            </div>
          ))}
        </div>

        {/* 7-column Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-2 mt-2">
          {/* Empty padding cells before start of month */}
          {Array.from({ length: calendarData.startOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[58px] rounded-xl bg-transparent" />
          ))}

          {/* Day Cells */}
          {Array.from({ length: calendarData.totalDays }).map((_, i) => {
            const day = i + 1;
            const colIndex = (calendarData.startOffset + i) % 7;
            const isWeekend = colIndex === 5 || colIndex === 6; // Saturday or Sunday
            const hol = getHoliday(day);
            const isToday =
              calendarData.isRealCurrentMonth && day === calendarData.realTodayDate;

            let cellClass =
              "min-h-[58px] rounded-xl border flex flex-col items-center justify-center relative cursor-pointer font-bold text-base transition-all select-none ";

            if (hol) {
              // Company Holiday: Peach background, vibrant orange border, bold text, orange dot
              cellClass +=
                "bg-[#fff8f2] border-[#ff9c68] text-[#16133d] font-extrabold shadow-sm hover:bg-[#fde8dc] hover:scale-[1.02] ";
            } else if (isWeekend) {
              // Weekend: Light muted background
              cellClass +=
                "bg-slate-50/80 border-slate-200 text-slate-600 hover:bg-[#fff9f5] hover:border-[#ff9c68] ";
            } else {
              // Regular Weekday
              cellClass +=
                "bg-white border-slate-200 text-slate-800 hover:bg-[#fff9f5] hover:border-[#ff9c68] hover:scale-[1.01] ";
            }

            if (isToday) {
              cellClass += "ring-2 ring-[#f96706] ring-offset-1 font-extrabold text-[#f96706] ";
            }

            return (
              <div
                key={`day-${day}`}
                onClick={() => handleCellClick(day)}
                className={cellClass}
                title={hol ? `${hol.name} (${hol.type})` : isWeekend ? "Weekend" : `Working Day (${day} ${SHORT_MONTHS[calMonth]})`}
              >
                <span>{day}</span>
                {hol && <span className="h-2 w-2 rounded-full bg-[#f96706] mt-1" />}
              </div>
            );
          })}
        </div>

        {/* Legend & Helper Note */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-5 border-t border-slate-100 text-sm text-slate-600">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded border border-[#ff9c68] bg-[#fff8f2]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#f96706]" />
              </span>
              <span className="font-bold text-slate-800">Company holiday</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded border border-slate-200 bg-slate-50" />
              <span className="font-bold text-slate-800">Weekend</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-500 text-xs sm:text-sm">
            <Info className="h-4 w-4 shrink-0 text-slate-400" />
            <span>Click any date to apply for leave or view festival details.</span>
          </div>
        </div>

        {/* ================= UPCOMING HOLIDAYS SECTION ================= */}
        <div className="mt-7 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base sm:text-lg font-extrabold text-slate-900">Upcoming holidays</h4>
            <span className="text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              {MONTH_NAMES[calMonth]} {calYear}
            </span>
          </div>

          {calendarData.monthHolidays.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center text-sm text-slate-500">
              <Calendar className="h-5 w-5 mx-auto mb-1 text-slate-400" />
              No corporate holidays scheduled in {MONTH_NAMES[calMonth]} {calYear}.
            </div>
          ) : (
            <div className="space-y-3">
              {calendarData.monthHolidays.map((h) => {
                const parts = h.date.trim().split(/\s+/);
                const datePill = `${parts[0]} ${parts[1]}`;
                return (
                  <div
                    key={h.date + h.name}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs hover:border-[#ff9c68] hover:bg-[#fffdfb] transition-all"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="rounded-xl border border-indigo-100 bg-[#f8fafc] px-3.5 py-1.5 font-extrabold text-slate-800 text-sm shadow-2xs whitespace-nowrap">
                        {datePill}
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900 text-base">{h.name || h.title}</p>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{h.type || "Official Holiday"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleAskHrClick(h)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#1e2538] hover:bg-[#2b344d] text-white px-4 py-1.5 text-xs sm:text-sm font-bold shadow-xs transition-colors"
                      >
                        <Sparkles className="h-4 w-4 text-amber-400" />
                        Ask HR
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ================= ANNUAL OFFICIAL HOLIDAYS SCHEDULE TABLE ================= */}
      <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h4 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-[#f96706]" />
              Official Company Holidays &amp; Calendar (2026 – 2027)
            </h4>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Zyllo Tech observed national and state public holidays for all engineering pods.
            </p>
          </div>
          <span className="text-xs sm:text-sm font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3.5 py-1.5">
            {OFFICIAL_HOLIDAYS.length} Annual Holidays
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm sm:text-base text-slate-700">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-b border-slate-200 text-xs sm:text-sm">
              <tr>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Festival / Occasion</th>
                <th className="py-3.5 px-4">Day of Week</th>
                <th className="py-3.5 px-4">Classification</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {OFFICIAL_HOLIDAYS.map((hol) => (
                <tr key={hol.date + hol.name} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-indigo-700">{hol.date}</td>
                  <td className="py-4 px-4 font-bold text-slate-900">{hol.name || hol.title}</td>
                  <td className="py-4 px-4 text-slate-600">{hol.day}</td>
                  <td className="py-4 px-4">
                    <span className="rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs sm:text-sm font-semibold text-slate-700">
                      {hol.type}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 rounded-full px-3 py-1">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Approved
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Festival Quick Detail Popup Modal */}
      {selectedFestival && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl text-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#f96706]" />
                <h4 className="text-lg font-extrabold text-slate-900">Holiday Detail</h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFestival(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="p-5 rounded-xl border border-[#ff9c68]/30 bg-[#fff8f2] text-slate-900">
              <span className="text-xs sm:text-sm font-extrabold text-[#f96706] uppercase tracking-wider block">
                {selectedFestival.type}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">{selectedFestival.name}</h3>
              <p className="text-sm sm:text-base text-slate-700 mt-1.5">
                Date: <strong className="text-slate-900">{selectedFestival.date}</strong> ({selectedFestival.day})
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  handleAskHrClick(selectedFestival);
                  setSelectedFestival(null);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f96706] to-[#ea580c] hover:opacity-95 text-white px-5 py-2.5 text-sm font-bold shadow-md transition-opacity"
              >
                <Sparkles className="h-4 w-4" />
                Ask HR About This Date
              </button>
              <button
                type="button"
                onClick={() => setSelectedFestival(null)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
