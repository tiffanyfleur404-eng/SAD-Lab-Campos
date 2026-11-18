import React from 'react';
import { Student } from '../types';
import { BarChart3, PieChart, Users, Award, BookOpen } from 'lucide-react';

interface AnalyticsViewProps {
  students: Student[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ students }) => {
  // Calculate program breakdown
  const programCounts = students.reduce((acc, student) => {
    acc[student.program] = (acc[student.program] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate year level breakdown
  const yearCounts = students.reduce((acc, student) => {
    acc[student.year_level] = (acc[student.year_level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = students.length || 1;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Program & Enrollment Analytics</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Distribution of student enrollment across academic programs and year levels
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Programs Breakdown */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" /> Enrollment by Program
            </h3>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {Object.keys(programCounts).length} Programs
            </span>
          </div>

          <div className="space-y-4">
            {Object.keys(programCounts).length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">No student records available yet.</p>
            ) : (
              Object.entries(programCounts).map(([prog, count]) => {
                const percentage = Math.round((count / total) * 100);
                return (
                  <div key={prog} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{prog}</span>
                      <span className="text-slate-500 dark:text-slate-400 font-mono">
                        {count} students ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Year Level Breakdown */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" /> Enrollment by Year Level
            </h3>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              4 Academic Tiers
            </span>
          </div>

          <div className="space-y-4">
            {Object.keys(yearCounts).length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">No student records available yet.</p>
            ) : (
              ['1st Year', '2nd Year', '3rd Year', '4th Year'].map((year) => {
                const count = yearCounts[year] || 0;
                const percentage = Math.round((count / total) * 100);
                return (
                  <div key={year} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{year}</span>
                      <span className="text-slate-500 dark:text-slate-400 font-mono">
                        {count} students ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
