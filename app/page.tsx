"use client";

import React, { useState, useMemo } from "react";

export default function Home() {
  const [weekOffset, setWeekOffset] = useState(0);

  const getWeekDates = (offset: number) => {
    const today = new Date();
    const currentDay = today.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;

    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset + offset * 7);

    return Array.from({ length: 5 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);

      return {
        label: date.toLocaleDateString("en-US", {
          weekday: "long",
        }),
        shortDate: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      };
    });
  };

  const weekDates = getWeekDates(weekOffset);

  const [shifts, setShifts] = useState(
    weekDates.map((day) => ({
      day: day.label,
      planned: "",
      actual: "",
    }))
  );

  const updateShift = (
    index: number,
    field: "planned" | "actual",
    value: string
  ) => {
    const updated = [...shifts];
    updated[index][field] = value;
    setShifts(updated);
  };

  const calculateHours = (timeRange: string) => {
    const regex = /(\d+)(?::(\d+))?\s*(AM|PM)/gi;
    const matches = [...timeRange.matchAll(regex)];

    if (matches.length < 2) return 0;

    const parseTime = (match: RegExpMatchArray) => {
      let hour = parseInt(match[1]);
      const minutes = parseInt(match[2] || "0");
      const period = match[3].toUpperCase();

      if (period === "PM" && hour !== 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;

      return hour + minutes / 60;
    };

    const start = parseTime(matches[0]);
    const end = parseTime(matches[1]);

    return Math.max(end - start, 0);
  };

  const totalPlannedHours = useMemo(() => {
    return shifts
      .reduce((sum, shift) => sum + calculateHours(shift.planned), 0)
      .toFixed(1);
  }, [shifts]);

  const totalActualHours = useMemo(() => {
    return shifts
      .reduce((sum, shift) => sum + calculateHours(shift.actual), 0)
      .toFixed(1);
  }, [shifts]);

  return (
    <main className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8 border border-blue-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-blue-900">
              Internship Shift Tracker
            </h1>

            <p className="text-blue-700">
              Plan your weekly hours and confirm what you actually worked.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setWeekOffset(weekOffset - 1)}
              className="bg-blue-100 text-blue-800 px-4 py-2 rounded-xl font-medium hover:bg-blue-200 transition"
            >
              Previous Week
            </button>

            <button
              onClick={() => setWeekOffset(weekOffset + 1)}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:opacity-90 transition"
            >
              Next Week
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-blue-100 rounded-2xl p-5">
            <p className="text-blue-700 text-sm font-bold">Planned Weekly Hours</p>
            <h2 className="text-3xl font-bold text-blue-900 mt-1">
              {totalPlannedHours} hrs
            </h2>
          </div>

          <div className="bg-blue-600 rounded-2xl p-5">
            <p className="text-blue-100 text-sm font-bold">Actual Weekly Hours</p>
            <h2 className="text-3xl font-bold text-white mt-1">
              {totalActualHours} hrs
            </h2>
          </div>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-blue-100 text-blue-800">
              <th className="py-4">Day</th>
              <th className="py-4">Planned Hours</th>
              <th className="py-4">Actual Hours Worked</th>
            </tr>
          </thead>

          <tbody>
            {shifts.map((shift, index) => (
              <tr key={shift.day} className="border-b border-blue-50">
                <td className="py-4 font-bold text-blue-900 text-xl">
                  <div>{weekDates[index].label}</div>
                  <div className="text-sm text-blue-500 font-normal">
                    {weekDates[index].shortDate}
                  </div>
                </td>

                <td className="py-4 pr-4">
                  <input
                    type="text"
                    placeholder="9 AM - 2 PM"
                    value={shift.planned}
                    onChange={(e) =>
                      updateShift(index, "planned", e.target.value)
                    }
                    className="border border-blue-200 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-900 font-medium"
                  />
                </td>

                <td className="py-4">
                  <input
                    type="text"
                    placeholder="9:10 AM - 2:05 PM"
                    value={shift.actual}
                    onChange={(e) =>
                      updateShift(index, "actual", e.target.value)
                    }
                    className="border border-blue-200 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-900 font-medium"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end mt-12">
          <img
            src="/nerveli-logo.png"
            alt="Nerveli Logo"
            className="h-10 opacity-80"
          />
        </div>
      </div>
    </main>
  );
}