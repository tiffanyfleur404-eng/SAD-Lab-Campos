import React from 'react';
import { Student } from '../types';
import { Users, BookOpen, Award, Layers, Sparkles } from 'lucide-react';

interface DashboardStatsProps {
  students: Student[];
  onSeedData: () => void;
  isSeeding: boolean;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  students,
  onSeedData,
  isSeeding,
}) => {
  const totalStudents = students.length;

  // Unique programs count
  const programs = new Set(students.map((s) => s.program));
  const uniqueProgramsCount = programs.size;

  // Year level breakdown
  const yearLevels = students.reduce((acc, student) => {
    acc[student.year_level] = (acc[student.year_level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topProgram = students.reduce((acc, student) => {
    acc[student.program] = (acc[student.program] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedPrograms = Object.entries(topProgram).sort((a, b) => b[1] - a[1]);
  const leadingProgram = sortedPrograms.length > 0 ? sortedPrograms[0][0] : 'N/A';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-medium border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5" /> SAD Laboratory Exercise · Developer: Jahaziel Joy Campos
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Student Record Management System (EduRecord Pro)
            </h1>
            <p className="text-indigo-200 text-sm max-w-xl">
              Cloud-connected student enrollment and records management system with Supabase PostgreSQL persistence, real-time search, filters, and analytics.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {totalStudents === 0 && (
              <button
                onClick={onSeedData}
                disabled={isSeeding}
                className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-indigo-900 bg-white hover:bg-indigo-50 rounded-xl shadow-lg transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                {isSeeding ? 'Seeding Records...' : 'Seed 5 Sample Records'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Students
            </p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
              {totalStudents}
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              Active enrollments
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Programs Offered
            </p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
              {uniqueProgramsCount}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Active degree paths
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Top Program
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
              {leadingProgram}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Highest student density
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Year Distribution
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
              {Object.keys(yearLevels).length} Levels
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              1st to 4th Year span
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};
