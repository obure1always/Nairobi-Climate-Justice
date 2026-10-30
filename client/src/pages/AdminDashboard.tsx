import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Database, 
  Users, 
  BookOpen, 
  GraduationCap, 
  FileCheck, 
  Award, 
  Activity, 
  RefreshCw, 
  Search, 
  Download, 
  ExternalLink,
  CheckCircle,
  Clock,
  UserCheck,
  AlertCircle
} from 'lucide-react';

interface AdminUser {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  phoneVerified: boolean;
  role: 'learner' | 'instructor' | 'admin' | 'researcher';
  authProvider: string;
  title: string | null;
  institution: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ModuleItem {
  id: string;
  order: number;
  title: string;
  description: string;
}

interface ModuleProgressItem {
  id: string;
  participantId?: string;
  userId?: string;
  moduleId: string;
  completedLessons: any;
  completed: boolean;
  lastAccessed: string;
  createdAt: string;
}

interface LessonProgressItem {
  id: string;
  userId: string;
  moduleId: string;
  lessonId: string;
  completed: boolean;
  playbackSeconds: number;
  notes: string | null;
  lastAccessedAt: string;
}

interface CertificateItem {
  id: string;
  userId: string;
  learnerName: string;
  courseTitle: string;
  pathwayId: string;
  issuingOrg: string;
  issueDate: string;
  verificationUrl: string;
  distinction: string | null;
  createdAt: string;
}

interface ProjectSubmissionItem {
  id: string;
  userId: string;
  projectId: string;
  projectType: string;
  title: string;
  summary: string;
  status: string;
  score: number | null;
  createdAt: string;
}

interface ActivityEvent {
  id: string;
  type: 'registration' | 'lesson_completed' | 'certificate_earned' | 'project_submitted';
  title: string;
  description: string;
  userName: string;
  userEmail: string;
  timestamp: string;
}

interface DashboardData {
  stats: {
    totalUsers: number;
    totalParticipants: number;
    totalLessonCompletions: number;
    totalCertificates: number;
    totalProjectSubmissions: number;
    totalActiveSessions: number;
    rolesCount: {
      learner: number;
      instructor: number;
      admin: number;
      researcher?: number;
    };
  };
  database: {
    dialect: string;
    storage: string;
    connected: boolean;
    tableCount: number;
  };
  users: AdminUser[];
  modules: ModuleItem[];
  moduleProgresses: ModuleProgressItem[];
  lessonProgresses: LessonProgressItem[];
  certificates: CertificateItem[];
  projectSubmissions: ProjectSubmissionItem[];
  recentActivity: ActivityEvent[];
}

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'users' | 'courses' | 'progress' | 'certificates' | 'activity'>('users');
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'learner' | 'instructor' | 'admin'>('all');

  // Role Management Modal
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [newRole, setNewRole] = useState<'learner' | 'instructor' | 'admin'>('learner');
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [roleMessage, setRoleMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchDashboardData = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    else setLoading(true);
    setError(null);

    const authToken = token || localStorage.getItem('climate_justice_token') || sessionStorage.getItem('climate_justice_token');
    if (!authToken) {
      setError('Missing authentication token. Please sign in as an administrator.');
      setLoading(false);
      setIsRefreshing(false);
      return;
    }

    try {
      const res = await fetch('/api/v1/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (res.status === 403) {
        setError('Forbidden: This endpoint is restricted to authorized platform administrators.');
        setLoading(false);
        setIsRefreshing(false);
        return;
      }

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${res.status}`);
      }

      const result = await res.json();
      setData(result);
    } catch (err: any) {
      console.error('fetchDashboardData caught:', err);
      setError(err?.message || 'Failed to load administration dataset from SQLite database.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchDashboardData();
    }
  }, [user]);

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setIsUpdatingRole(true);
    setRoleMessage(null);
    const token = localStorage.getItem('climate_justice_token') || sessionStorage.getItem('climate_justice_token');

    try {
      const res = await fetch(`/api/v1/admin/users/${selectedUser.id}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Failed to update user role');
      }

      setRoleMessage({ type: 'success', text: `Role for ${selectedUser.name || selectedUser.email} updated to ${newRole}.` });
      
      // Update local state
      if (data) {
        setData({
          ...data,
          users: data.users.map(u => u.id === selectedUser.id ? { ...u, role: newRole } : u)
        });
      }

      setTimeout(() => {
        setSelectedUser(null);
        setRoleMessage(null);
      }, 1500);
    } catch (err: any) {
      setRoleMessage({ type: 'error', text: err?.message || 'Failed to update role' });
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const handleDownloadAuditJson = async () => {
    const token = localStorage.getItem('climate_justice_token') || sessionStorage.getItem('climate_justice_token');
    try {
      const res = await fetch('/api/v1/admin/export', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cjn-admin-audit-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      alert('Failed to generate export file.');
    }
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    if (!data?.users) return [];
    return data.users.filter(u => {
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || 
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.phone && u.phone.includes(q)) ||
        u.id.toLowerCase().includes(q);
      return matchesRole && matchesSearch;
    });
  }, [data?.users, searchQuery, roleFilter]);

  // Non-admin / Unauthorized View
  if (user && user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Administrator Access Restricted
          </h1>
          <p className="text-xs text-gray-600 leading-relaxed mb-6">
            You are signed in as <span className="font-semibold text-gray-900">{user.name || user.email}</span> with the role <span className="px-2 py-0.5 rounded-full bg-gray-100 font-bold uppercase text-[10px] text-gray-700">{user.role}</span>. The administration dashboard requires verified platform administrator credentials.
          </p>
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => navigate('/')}
              className="w-full py-2.5 px-4 bg-forest-green hover:bg-forest-green/90 text-white font-bold rounded-xl text-xs transition cursor-pointer"
            >
              Return to Learning Dashboard
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition cursor-pointer"
            >
              Sign In with Administrator Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas-bg font-inter pb-20">
      {/* Top Banner / Breadcrumb */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                    Administrator Command Console
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live SQLite Synced
                  </span>
                </div>
                <h1 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">
                  Platform Administration & Audit
                </h1>
              </div>
            </div>

            {/* Top Action Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => fetchDashboardData(true)}
                disabled={isRefreshing}
                className="px-3.5 py-2 bg-white border border-gray-200 hover:border-forest-green hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-forest-green ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh Live Data'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadAuditJson}
                className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-purple-700" />
                <span>Export Audit JSON</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs text-rose-800">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Database Query Notice</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Database Connectivity Info Banner */}
        <div className="mb-6 p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-forest-green/10 text-forest-green flex items-center justify-center shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">
                Connected Database: <span className="font-mono text-forest-green font-semibold">server/database.sqlite</span>
              </p>
              <p className="text-[11px] text-gray-500">
                In-process SQLite 3 relational storage • 21 schema tables • Sequelize ORM active
              </p>
            </div>
          </div>
          <div className="text-[11px] text-gray-600 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
            Admin Session: <span className="font-semibold text-gray-900">{user?.email || user?.name || 'admin@climatejustice.ke'}</span>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-6">
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Registered</span>
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-gray-900">
              {loading ? '...' : (data?.stats.totalUsers ?? 0)}
            </div>
            <div className="text-[10px] text-gray-500 mt-1 font-medium">
              {data?.stats.rolesCount.learner ?? 0} learners • {data?.stats.rolesCount.admin ?? 0} admins
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Sessions</span>
              <UserCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-gray-900">
              {loading ? '...' : (data?.stats.totalActiveSessions ?? 0)}
            </div>
            <div className="text-[10px] text-emerald-700 mt-1 font-medium">
              Active tokens in DB
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Participants</span>
              <BookOpen className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-gray-900">
              {loading ? '...' : (data?.stats.totalParticipants ?? 0)}
            </div>
            <div className="text-[10px] text-gray-500 mt-1 font-medium">
              Enrolled cohort records
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Lessons Done</span>
              <CheckCircle className="w-4 h-4 text-forest-green" />
            </div>
            <div className="text-2xl font-black text-gray-900">
              {loading ? '...' : (data?.stats.totalLessonCompletions ?? 0)}
            </div>
            <div className="text-[10px] text-gray-500 mt-1 font-medium">
              Recorded completions
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Certificates</span>
              <Award className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-gray-900">
              {loading ? '...' : (data?.stats.totalCertificates ?? 0)}
            </div>
            <div className="text-[10px] text-gray-500 mt-1 font-medium">
              Issued credentials
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Projects</span>
              <FileCheck className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-gray-900">
              {loading ? '...' : (data?.stats.totalProjectSubmissions ?? 0)}
            </div>
            <div className="text-[10px] text-gray-500 mt-1 font-medium">
              Applied submissions
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-white rounded-2xl p-1.5 border border-gray-200/80 shadow-xs mb-6 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Registered Users ({data?.users.length ?? 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('courses')}
            className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'courses'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Courses & Modules ({data?.modules.length ?? 7})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('progress')}
            className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'progress'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Learner Progress ({data?.lessonProgresses.length ?? 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('certificates')}
            className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'certificates'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Certificates & Projects</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('activity')}
            className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'activity'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Live Activity Feed</span>
          </button>
        </div>

        {/* ---------------------------------------------------- */}
        {/* TAB 1: USERS DIRECTORY */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
            {/* Table Header Filter Toolbar */}
            <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone, or UUID..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-semibold">Filter Role:</span>
                <select
                  value={roleFilter}
                  onChange={e => setRoleFilter(e.target.value as any)}
                  className="py-1.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="all">All Roles ({data?.users.length ?? 0})</option>
                  <option value="learner">Learners ({data?.stats.rolesCount.learner ?? 0})</option>
                  <option value="instructor">Instructors ({data?.stats.rolesCount.instructor ?? 0})</option>
                  <option value="admin">Administrators ({data?.stats.rolesCount.admin ?? 0})</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/70 border-b border-gray-200/60 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">User / Name</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Provider</th>
                    <th className="py-3 px-4">Registered Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500">
                        <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        Loading registered user accounts from SQLite...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500">
                        No user accounts matched the filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-forest-green/10 text-forest-green font-bold text-xs flex items-center justify-center shrink-0">
                              {(u.name || u.email || 'U')[0].toUpperCase()}
                            </div>
                            <div className="font-bold text-gray-900 truncate max-w-[160px]">
                              {u.name || 'Learner'}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-gray-600 text-[11px]">
                          {u.email || <span className="text-gray-400 italic">No email</span>}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-gray-600 text-[11px]">
                          {u.phone || <span className="text-gray-400 italic">None</span>}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                            u.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                              : u.role === 'instructor' 
                              ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-500 capitalize">
                          {u.authProvider}
                        </td>
                        <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                          {new Date(u.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUser(u);
                              setNewRole(u.role === 'researcher' ? 'learner' : u.role);
                              setRoleMessage(null);
                            }}
                            className="px-2.5 py-1 bg-gray-100 hover:bg-purple-50 hover:text-purple-700 text-gray-700 rounded-lg font-bold text-[11px] transition cursor-pointer"
                          >
                            Manage Role
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 2: COURSES & CURRICULUM */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.modules && data.modules.length > 0 ? (
              data.modules.map(mod => {
                const completionsForModule = data.lessonProgresses.filter(lp => lp.moduleId === mod.id && lp.completed).length;
                const enrollmentsForModule = data.moduleProgresses.filter(mp => mp.moduleId === mod.id).length;

                return (
                  <div key={mod.id || mod.order} className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest-green/10 text-forest-green">
                          Module {mod.order}
                        </span>
                        <span className="text-xs font-semibold text-gray-400">
                          {enrollmentsForModule} enrolled
                        </span>
                      </div>
                      <h3 className="font-extrabold text-gray-900 text-base mb-1">
                        {mod.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {mod.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="text-gray-500 font-medium">Completed Lessons</span>
                      <span className="font-bold text-forest-green bg-forest-green/5 px-2 py-0.5 rounded-md">
                        {completionsForModule} records
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full bg-white p-8 rounded-3xl text-center text-gray-500">
                Loading curriculum modules from SQLite...
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 3: LEARNER PROGRESS */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'progress' && (
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-gray-100">
              <h2 className="font-bold text-sm text-gray-900">
                Real-Time Lesson Progress Records ({data?.lessonProgresses.length ?? 0})
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Every completed lesson and interactive step recorded in SQLite table <code className="bg-gray-100 px-1 py-0.5 rounded">lesson_progresses</code>.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/70 border-b border-gray-200/60 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Learner UUID</th>
                    <th className="py-3 px-4">Module</th>
                    <th className="py-3 px-4">Lesson ID</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Playback (Sec)</th>
                    <th className="py-3 px-4">Last Accessed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data?.lessonProgresses && data.lessonProgresses.length > 0 ? (
                    data.lessonProgresses.map(lp => (
                      <tr key={lp.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono text-[11px] text-gray-700">
                          {lp.userId}
                        </td>
                        <td className="py-3 px-4 font-bold text-forest-green">
                          {lp.moduleId}
                        </td>
                        <td className="py-3 px-4 font-mono text-gray-600">
                          {lp.lessonId}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            lp.completed 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {lp.completed ? 'Completed' : 'In Progress'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {lp.playbackSeconds}s
                        </td>
                        <td className="py-3 px-4 text-gray-500 text-[11px]">
                          {new Date(lp.lastAccessedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500">
                        No lesson progress records found in SQLite database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 4: CERTIFICATES & SUBMISSIONS */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            {/* Certificates Table */}
            <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-sm text-gray-900">
                    Issued Certificates ({data?.certificates.length ?? 0})
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Tamper-evident verification records from SQLite table <code className="bg-gray-100 px-1 py-0.5 rounded">certificates</code>.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50/70 border-b border-gray-200/60 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Certificate ID</th>
                      <th className="py-3 px-4">Learner Name</th>
                      <th className="py-3 px-4">Course Title</th>
                      <th className="py-3 px-4">Distinction</th>
                      <th className="py-3 px-4">Issue Date</th>
                      <th className="py-3 px-4 text-right">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data?.certificates && data.certificates.length > 0 ? (
                      data.certificates.map(cert => (
                        <tr key={cert.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-purple-700">
                            {cert.id}
                          </td>
                          <td className="py-3 px-4 font-bold text-gray-900">
                            {cert.learnerName}
                          </td>
                          <td className="py-3 px-4 text-gray-700">
                            {cert.courseTitle}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[10px]">
                              {cert.distinction || 'Honors'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-500 text-[11px]">
                            {new Date(cert.issueDate).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Link
                              to={cert.verificationUrl}
                              target="_blank"
                              className="inline-flex items-center gap-1 text-forest-green hover:underline font-bold text-[11px]"
                            >
                              <span>Verify</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500">
                          No certificates issued yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Project Submissions Table */}
            <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-gray-100">
                <h2 className="font-bold text-sm text-gray-900">
                  Applied Project Submissions ({data?.projectSubmissions.length ?? 0})
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Community resilience action projects submitted by learners.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50/70 border-b border-gray-200/60 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Project Title</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Score</th>
                      <th className="py-3 px-4">Submitted At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data?.projectSubmissions && data.projectSubmissions.length > 0 ? (
                      data.projectSubmissions.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-3 px-4 font-bold text-gray-900">
                            {p.title}
                          </td>
                          <td className="py-3 px-4 text-gray-600 capitalize">
                            {p.projectType}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-bold text-[10px] capitalize">
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-gray-800">
                            {p.score !== null ? `${p.score}/100` : 'Pending'}
                          </td>
                          <td className="py-3 px-4 text-gray-500 text-[11px]">
                            {new Date(p.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">
                          No project submissions yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 5: LIVE ACTIVITY FEED */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'activity' && (
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs p-5 sm:p-6">
            <h2 className="font-bold text-sm text-gray-900 mb-1">
              Chronological Platform Activity ({data?.recentActivity.length ?? 0})
            </h2>
            <p className="text-xs text-gray-500 mb-5">
              Live events generated directly from authentic user registrations and database completions.
            </p>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
              {data?.recentActivity && data.recentActivity.length > 0 ? (
                data.recentActivity.map(act => (
                  <div key={act.id} className="relative group">
                    <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-purple-600 ring-4 ring-white" />
                    <div className="bg-gray-50/70 group-hover:bg-gray-100/70 p-3.5 rounded-2xl border border-gray-200/60 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-gray-900">
                          {act.title}
                        </span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {new Date(act.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">
                        {act.description}
                      </p>
                      <div className="text-[11px] text-purple-700 font-semibold flex items-center gap-1">
                        <span>{act.userName}</span>
                        {act.userEmail && <span className="text-gray-400 font-normal">({act.userEmail})</span>}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 text-xs">
                  No activity events recorded yet.
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Role Management Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100">
            <h3 className="font-extrabold text-gray-900 text-base mb-1">
              Manage User Role
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Update platform access for <span className="font-bold text-gray-800">{selectedUser.name || selectedUser.email}</span>.
            </p>

            {roleMessage && (
              <div className={`p-3 rounded-xl mb-4 text-xs font-semibold ${
                roleMessage.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {roleMessage.text}
              </div>
            )}

            <form onSubmit={handleUpdateRole} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Assign Platform Role
                </label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value as any)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="learner">Learner (Standard course enrollment)</option>
                  <option value="instructor">Instructor (Rubric grading & cohort export)</option>
                  <option value="admin">Administrator (Full console & database access)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingRole}
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition cursor-pointer disabled:opacity-50"
                >
                  {isUpdatingRole ? 'Updating...' : 'Save Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
