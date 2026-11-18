/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { Student } from './types';
import { Navbar } from './components/Navbar';
import { DashboardStats } from './components/DashboardStats';
import { StudentTable } from './components/StudentTable';
import { StudentModal } from './components/StudentModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { AnalyticsView } from './components/AnalyticsView';
import { Toast, ToastMessage } from './components/Toast';

const SAMPLE_STUDENTS: Omit<Student, 'id' | 'created_at'>[] = [
  {
    student_id: 'STU-2026-001',
    full_name: 'Alexander Wright',
    program: 'BS Computer Science',
    year_level: '3rd Year',
    email: 'alexander.wright@university.edu',
  },
  {
    student_id: 'STU-2026-002',
    full_name: 'Sophia Martinez',
    program: 'BS Information Technology',
    year_level: '2nd Year',
    email: 'sophia.martinez@university.edu',
  },
  {
    student_id: 'STU-2026-003',
    full_name: 'Liam Johnson',
    program: 'BS Computer Engineering',
    year_level: '4th Year',
    email: 'liam.johnson@university.edu',
  },
  {
    student_id: 'STU-2026-004',
    full_name: 'Emma Watson',
    program: 'BS Information Systems',
    year_level: '1st Year',
    email: 'emma.watson@university.edu',
  },
  {
    student_id: 'STU-2026-005',
    full_name: 'Noah Chen',
    program: 'BS Computer Science',
    year_level: '4th Year',
    email: 'noah.chen@university.edu',
  },
];

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useLocalFallback, setUseLocalFallback] = useState<boolean>(() => {
    return localStorage.getItem('use_local_fallback') === 'true';
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch students from Supabase with automatic fallback to localStorage on permission/network error
  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured() && supabase && !useLocalFallback) {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }
        if (data) {
          setStudents(data);
          return;
        }
      }

      // Fallback to localStorage
      loadFromLocalStorage();
    } catch (err: any) {
      console.warn('Supabase query failed, falling back to local mode:', err.message);
      setUseLocalFallback(true);
      localStorage.setItem('use_local_fallback', 'true');
      addToast('Supabase RLS restriction detected. Switched to Local Demo Mode automatically.', 'error');
      loadFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  }, [useLocalFallback, addToast]);

  const loadFromLocalStorage = () => {
    const local = localStorage.getItem('local_students');
    if (local) {
      setStudents(JSON.parse(local));
    } else {
      const defaultStudents: Student[] = SAMPLE_STUDENTS.map((s, index) => ({
        id: index + 1,
        ...s,
        created_at: new Date().toISOString(),
      }));
      setStudents(defaultStudents);
      localStorage.setItem('local_students', JSON.stringify(defaultStudents));
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Save student (Create or Update)
  const handleSaveStudent = async (studentData: Omit<Student, 'id' | 'created_at'>, id?: string | number) => {
    try {
      if (isSupabaseConfigured() && supabase && !useLocalFallback) {
        if (id) {
          const { error } = await supabase
            .from('students')
            .update(studentData)
            .eq('id', id);

          if (error) throw error;
          addToast('Student record updated successfully', 'success');
        } else {
          const { error } = await supabase.from('students').insert([studentData]);

          if (error) throw error;
          addToast('Student added successfully', 'success');
        }
        fetchStudents();
      } else {
        // LocalStorage mode
        let updatedList = [...students];
        if (id) {
          updatedList = updatedList.map((s) => (s.id === id ? { ...s, ...studentData } : s));
          addToast('Student record updated successfully', 'success');
        } else {
          const newStudent: Student = {
            id: Date.now(),
            ...studentData,
            created_at: new Date().toISOString(),
          };
          updatedList = [newStudent, ...updatedList];
          addToast('Student added successfully', 'success');
        }
        setStudents(updatedList);
        localStorage.setItem('local_students', JSON.stringify(updatedList));
      }
    } catch (err: any) {
      console.error('Error saving student:', err.message);
      // Fallback to local on error
      setUseLocalFallback(true);
      localStorage.setItem('use_local_fallback', 'true');
      addToast(`Supabase error (${err.message}). Saved locally.`, 'error');

      let updatedList = [...students];
      if (id) {
        updatedList = updatedList.map((s) => (s.id === id ? { ...s, ...studentData } : s));
      } else {
        const newStudent: Student = {
          id: Date.now(),
          ...studentData,
          created_at: new Date().toISOString(),
        };
        updatedList = [newStudent, ...updatedList];
      }
      setStudents(updatedList);
      localStorage.setItem('local_students', JSON.stringify(updatedList));
    }
  };

  // Delete student
  const handleDeleteStudent = async () => {
    if (!deletingStudent) return;
    try {
      if (isSupabaseConfigured() && supabase && !useLocalFallback) {
        const { error } = await supabase.from('students').delete().eq('id', deletingStudent.id);
        if (error) throw error;
        addToast('Student record deleted permanently', 'success');
        fetchStudents();
      } else {
        const updatedList = students.filter((s) => s.id !== deletingStudent.id);
        setStudents(updatedList);
        localStorage.setItem('local_students', JSON.stringify(updatedList));
        addToast('Student record deleted permanently', 'success');
      }
    } catch (err: any) {
      console.error('Error deleting student:', err.message);
      const updatedList = students.filter((s) => s.id !== deletingStudent.id);
      setStudents(updatedList);
      localStorage.setItem('local_students', JSON.stringify(updatedList));
      addToast('Deleted locally (Supabase error)', 'success');
    }
  };

  // Seed sample records
  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      if (isSupabaseConfigured() && supabase && !useLocalFallback) {
        const { error } = await supabase.from('students').insert(SAMPLE_STUDENTS);
        if (error) throw error;
        addToast('Successfully seeded 5 sample records into Supabase!', 'success');
        fetchStudents();
      } else {
        const seeded: Student[] = SAMPLE_STUDENTS.map((s, index) => ({
          id: Date.now() + index,
          ...s,
          created_at: new Date().toISOString(),
        }));
        const updatedList = [...seeded, ...students];
        setStudents(updatedList);
        localStorage.setItem('local_students', JSON.stringify(updatedList));
        addToast('Successfully seeded 5 sample records locally!', 'success');
      }
    } catch (err: any) {
      console.error('Error seeding records:', err.message);
      setUseLocalFallback(true);
      localStorage.setItem('use_local_fallback', 'true');
      const seeded: Student[] = SAMPLE_STUDENTS.map((s, index) => ({
        id: Date.now() + index,
        ...s,
        created_at: new Date().toISOString(),
      }));
      const updatedList = [...seeded, ...students];
      setStudents(updatedList);
      localStorage.setItem('local_students', JSON.stringify(updatedList));
      addToast('Seeded locally due to Supabase RLS restriction.', 'success');
    } finally {
      setIsSeeding(false);
    }
  };

  const isConnected = isSupabaseConfigured() && !useLocalFallback;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenAddModal={() => {
          setEditingStudent(null);
          setIsAddModalOpen(true);
        }}
        onOpenConfigModal={() => setIsConfigModalOpen(true)}
        isSupabaseConnected={isConnected}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {useLocalFallback && (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200 text-xs flex items-center justify-between">
            <span>
              <strong>Notice:</strong> Running in Local Demo Mode due to Supabase RLS permission restriction. All CRUD operations and search are fully functional locally. Click settings (⚙️) to view instructions for disabling RLS in Supabase.
            </span>
            <button
              onClick={() => {
                localStorage.removeItem('use_local_fallback');
                setUseLocalFallback(false);
                fetchStudents();
              }}
              className="px-3 py-1 font-semibold bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 rounded-lg hover:bg-amber-300 transition-colors shrink-0 ml-4"
            >
              Retry Supabase Connection
            </button>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            <DashboardStats
              students={students}
              onSeedData={handleSeedData}
              isSeeding={isSeeding}
            />
            <StudentTable
              students={students}
              onEdit={(student) => {
                setEditingStudent(student);
                setIsAddModalOpen(true);
              }}
              onDelete={(student) => setDeletingStudent(student)}
              onSeedData={handleSeedData}
              isLoading={isLoading}
              onRefresh={fetchStudents}
            />
          </div>
        )}

        {activeTab === 'students' && (
          <div className="animate-fadeIn">
            <StudentTable
              students={students}
              onEdit={(student) => {
                setEditingStudent(student);
                setIsAddModalOpen(true);
              }}
              onDelete={(student) => setDeletingStudent(student)}
              onSeedData={handleSeedData}
              isLoading={isLoading}
              onRefresh={fetchStudents}
            />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="animate-fadeIn">
            <AnalyticsView students={students} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
        <p>Student Record Management System (EduRecord Pro) · Systems Analysis and Design (SAD) Laboratory Exercise</p>
        <p className="text-indigo-600 dark:text-indigo-400 font-medium">Developed by Jahaziel Joy Campos</p>
      </footer>

      {/* Modals & Toasts */}
      <StudentModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingStudent(null);
        }}
        onSave={handleSaveStudent}
        editingStudent={editingStudent}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingStudent)}
        onClose={() => setDeletingStudent(null)}
        onConfirm={handleDeleteStudent}
        student={deletingStudent}
      />

      <SupabaseConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      />

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
