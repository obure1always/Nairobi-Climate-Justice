import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  GraduationCap, 
  FileCheck, 
  BarChart3, 
  CheckCircle, 
  Award, 
  Download, 
  AlertTriangle,
  Edit
} from 'lucide-react';

interface ProjectSubmissionItem {
  id: string;
  userId: string;
  projectId: string;
  title: string;
  summary: string;
  methodology: string;
  localAssumptions: string;
  calculatedEmissionsOrSizing?: string;
  fileAttachmentUrl?: string;
  status: 'submitted' | 'under_review' | 'graded' | 'revision_requested';
  gradeScore?: number;
  instructorFeedback?: string;
  createdAt: string;
}

interface AnalyticsData {
  totalLearners: number;
  totalEnrollments: number;
  avgCompletionRate: number;
  totalCertificatesIssued: number;
  dropOutRiskLearners: number;
  moduleStats: { moduleId: string; title: string; completions: number }[];
  pathwayEnrollments: { pathwayId: string; title: string; count: number }[];
}

export default function InstructorStudio() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'grading' | 'analytics' | 'qa' | 'curriculum'>('grading');
  
  // Grading State
  const [submissions, setSubmissions] = useState<ProjectSubmissionItem[]>([]);
  const [selectedSub, setSelectedSub] = useState<ProjectSubmissionItem | null>(null);
  const [rubricMethodology, setRubricMethodology] = useState<number>(25);
  const [rubricCalculations, setRubricCalculations] = useState<number>(25);
  const [rubricImpact, setRubricImpact] = useState<number>(20);
  const [rubricFeasibility, setRubricFeasibility] = useState<number>(15);
  const [instructorFeedback, setInstructorFeedback] = useState<string>('');
  const [isGrading, setIsGrading] = useState<boolean>(false);
  const [gradeSuccess, setGradeSuccess] = useState<string | null>(null);

  // Analytics State
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const isInstructor = user?.role === 'instructor' || user?.role === 'admin';

  // Fetch pending submissions for instructor
  const fetchSubmissions = () => {
    const token = sessionStorage.getItem('climate_justice_token') || localStorage.getItem('climate_justice_token') || localStorage.getItem('auth_token');
    if (!token) return;

    fetch('/api/v1/instructor/projects', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : { submissions: [] })
      .then(data => {
        if (data?.submissions) {
          setSubmissions(data.submissions);
          if (data.submissions.length > 0 && !selectedSub) {
            setSelectedSub(data.submissions[0]);
          }
        }
      })
      .catch(() => {});
  };

  // Fetch institutional analytics
  const fetchAnalytics = () => {
    const token = sessionStorage.getItem('climate_justice_token') || localStorage.getItem('climate_justice_token') || localStorage.getItem('auth_token');
    if (!token) return;

    fetch('/api/v1/instructor/analytics', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setAnalytics(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (isInstructor) {
      fetchSubmissions();
      fetchAnalytics();
    }
  }, [isInstructor]);

  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    const token = localStorage.getItem('auth_token');
    if (!token) return;

    setIsGrading(true);
    setGradeSuccess(null);

    const calculatedTotal = rubricMethodology + rubricCalculations + rubricImpact + rubricFeasibility;

    try {
      const res = await fetch(`/api/v1/instructor/projects/${selectedSub.id}/grade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          gradeScore: calculatedTotal,
          rubricScores: {
            methodology: rubricMethodology,
            calculations: rubricCalculations,
            impact: rubricImpact,
            feasibility: rubricFeasibility
          },
          instructorFeedback
        })
      });

      if (res.ok) {
        setGradeSuccess(`Grade of ${calculatedTotal}/100 and written feedback recorded!`);
        fetchSubmissions();
        setTimeout(() => setGradeSuccess(null), 3000);
      }
    } catch {
      // error handling
    } finally {
      setIsGrading(false);
    }
  };

  const handleExportCohortCSV = async () => {
    const token = sessionStorage.getItem('climate_justice_token') || localStorage.getItem('climate_justice_token') || localStorage.getItem('auth_token');
    if (!token) return;

    setIsExporting(true);
    try {
      const res = await fetch('/api/v1/instructor/cohort-export', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Convert to CSV
        const headers = ['Learner ID', 'Name', 'Email', 'Role', 'Completed Lessons', 'Certificates Earned'];
        const rows = (data.learnerRecords || []).map((r: any) => [
          r.userId,
          `"${r.name}"`,
          r.email,
          r.role,
          r.completedLessonsCount,
          r.certificatesEarned
        ]);
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e: any) => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `alu_cohort_progress_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch {
      // error
    } finally {
      setIsExporting(false);
    }
  };

  // If user is not instructor, display honest access restriction
  if (!isInstructor) {
    return (
      <div className="min-h-full pb-20 bg-gray-50/60 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 max-w-lg w-full border border-gray-200 shadow-xl text-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Instructor Access Required</h2>
          <p className="text-xs text-gray-600 mb-6 leading-relaxed">
            This workspace enables rubric-based project evaluation, cohort analytics, and curriculum moderation for authorized instructors. Please sign in with your instructor credentials to proceed.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/login"
              className="flex-1 py-3 px-4 bg-forest-green hover:bg-forest-green/90 text-white rounded-xl font-bold text-xs shadow-md transition text-center"
            >
              Sign In to Your Account
            </Link>
            <Link
              to="/modules"
              className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs transition text-center"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full pb-20 bg-gray-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-gray-900 via-[#00331e] to-teal-950 rounded-3xl p-8 text-white shadow-lg mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              <GraduationCap className="w-4 h-4" />
              Instructor & Review Portal
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Instructor Studio & Institutional Dashboard
            </h1>
            <p className="text-xs md:text-sm text-gray-300 mt-1">
              Logged in as: <strong>{user?.displayName || user?.name || user?.email}</strong> (Role: <span className="uppercase text-emerald-400 font-bold">{user?.role}</span>)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCohortCSV}
              disabled={isExporting}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Exporting...' : 'Export Cohort (CSV)'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-white rounded-2xl px-4 pt-2 shadow-sm mb-8">
          <button
            onClick={() => setActiveTab('grading')}
            className={`flex items-center gap-2 py-3 px-5 font-bold text-xs md:text-sm border-b-2 transition ${
              activeTab === 'grading'
                ? 'border-forest-green text-forest-green'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Assignment Grading ({submissions.filter(s => s.status !== 'graded').length} Pending)</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 py-3 px-5 font-bold text-xs md:text-sm border-b-2 transition ${
              activeTab === 'analytics'
                ? 'border-forest-green text-forest-green'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Institutional Cohort Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('curriculum')}
            className={`flex items-center gap-2 py-3 px-5 font-bold text-xs md:text-sm border-b-2 transition ${
              activeTab === 'curriculum'
                ? 'border-forest-green text-forest-green'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Edit className="w-4 h-4" />
            <span>Curriculum Editorial Review</span>
          </button>
        </div>

        {/* TAB 1: ASSIGNMENT GRADING STUDIO */}
        {activeTab === 'grading' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Submissions List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Learner Proposals for Review ({submissions.length})
              </h3>

              {submissions.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-gray-200 text-xs text-gray-500">
                  No submissions currently awaiting grading.
                </div>
              ) : (
                submissions.map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSub(sub)}
                    className={`p-4 rounded-2xl border transition cursor-pointer ${
                      selectedSub?.id === sub.id
                        ? 'border-forest-green bg-emerald-50/70 shadow-sm'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">
                        {sub.projectId}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        sub.status === 'graded' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sub.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-gray-900 truncate">{sub.title}</h4>
                    <span className="text-[10px] text-gray-400 block mt-0.5">
                      Submitted on {new Date(sub.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Selected Submission & Rubric Grading Form */}
            {selectedSub ? (
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-forest-green bg-emerald-50 px-2 py-0.5 rounded-full">
                      Project: {selectedSub.projectId}
                    </span>
                    <h2 className="text-lg font-black text-gray-900 mt-1">{selectedSub.title}</h2>
                  </div>
                  <span className="text-xs text-gray-400">
                    ID: {selectedSub.id.slice(0, 8)}...
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                    <strong className="text-gray-900 block mb-0.5">Executive Summary:</strong>
                    <p className="text-gray-700 leading-relaxed">{selectedSub.summary}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <strong className="text-gray-900 block mb-0.5">Methodology:</strong>
                      <p className="text-gray-700">{selectedSub.methodology}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <strong className="text-gray-900 block mb-0.5">Assumptions & Location:</strong>
                      <p className="text-gray-700">{selectedSub.localAssumptions}</p>
                    </div>
                  </div>

                  {selectedSub.calculatedEmissionsOrSizing && (
                    <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 font-mono text-xs text-emerald-950 whitespace-pre-wrap">
                      <strong className="font-sans font-bold block mb-1">Quantitative Calculations & Sizing:</strong>
                      {selectedSub.calculatedEmissionsOrSizing}
                    </div>
                  )}
                </div>

                {/* Rubric Scoring Form */}
                <form onSubmit={handleGradeSubmission} className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-500" />
                      Faculty Rubric Evaluation
                    </h4>
                    <span className="text-sm font-black text-forest-green">
                      Total: {rubricMethodology + rubricCalculations + rubricImpact + rubricFeasibility} / 100
                    </span>
                  </div>

                  {gradeSuccess && (
                    <div className="p-2.5 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold">
                      {gradeSuccess}
                    </div>
                  )}

                  {/* 4 Rubric Criteria Sliders */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                        <span>1. Methodology & Accuracy (Max 30)</span>
                        <strong>{rubricMethodology} pts</strong>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        value={rubricMethodology}
                        onChange={(e) => setRubricMethodology(parseInt(e.target.value))}
                        className="w-full accent-forest-green"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                        <span>2. Calculations & Sizing (Max 30)</span>
                        <strong>{rubricCalculations} pts</strong>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        value={rubricCalculations}
                        onChange={(e) => setRubricCalculations(parseInt(e.target.value))}
                        className="w-full accent-forest-green"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                        <span>3. Community Climate Impact (Max 20)</span>
                        <strong>{rubricImpact} pts</strong>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={rubricImpact}
                        onChange={(e) => setRubricImpact(parseInt(e.target.value))}
                        className="w-full accent-forest-green"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                        <span>4. Field Feasibility & Budget (Max 20)</span>
                        <strong>{rubricFeasibility} pts</strong>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={rubricFeasibility}
                        onChange={(e) => setRubricFeasibility(parseInt(e.target.value))}
                        className="w-full accent-forest-green"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      Faculty Written Feedback & Revision Notes:
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={instructorFeedback}
                      onChange={(e) => setInstructorFeedback(e.target.value)}
                      placeholder="e.g. Excellent calculation of Kenyan grid factors. For rural field deployment, specify inverter surge capacity for inductive medical refrigeration loads."
                      className="w-full p-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-forest-green/20"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isGrading}
                      className="px-6 py-2.5 bg-forest-green hover:bg-forest-green/90 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{isGrading ? 'Submitting Grade...' : 'Publish Rubric Grade & Feedback'}</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="lg:col-span-2 bg-white rounded-3xl p-12 text-center border border-gray-200 text-gray-500 text-xs">
                Select a project from the left to view learner submission and rubric form.
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INSTITUTIONAL COHORT ANALYTICS */}
        {activeTab === 'analytics' && analytics && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs text-gray-500 font-semibold block">Total Enrolled Learners</span>
                <span className="text-3xl font-black text-gray-900 mt-1 block">{analytics.totalLearners}</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs text-gray-500 font-semibold block">Average Completion Rate</span>
                <span className="text-3xl font-black text-forest-green mt-1 block">{analytics.avgCompletionRate}%</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs text-gray-500 font-semibold block">Verifiable Certificates</span>
                <span className="text-3xl font-black text-amber-600 mt-1 block">{analytics.totalCertificatesIssued}</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs text-gray-500 font-semibold block flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  Dropout Risk Indicator
                </span>
                <span className="text-3xl font-black text-red-600 mt-1 block">{analytics.dropOutRiskLearners}</span>
              </div>
            </div>

            {/* Module Completion Distribution */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm">
              <h3 className="text-base font-extrabold text-gray-900 mb-4">
                Module Completion Distribution Across Cohort
              </h3>
              <div className="space-y-3">
                {analytics.moduleStats.map((ms) => (
                  <div key={ms.moduleId} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-800">{ms.title}</span>
                    <span className="font-bold text-forest-green">{ms.completions} completions</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CURRICULUM EDITORIAL REVIEW */}
        {activeTab === 'curriculum' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Curriculum Editorial & Climate Accuracy Workflow
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                All lessons undergo editorial peer-review ensuring alignment with Kenya Meteorological Department (KMD) baseline records and IPCC 6th Assessment Report.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { title: 'Module 1: Nairobi Climate Risk', status: 'Published', reviewer: 'Dr. Wanjiku Muthoni', date: '2026-10-20' },
                { title: 'Module 2: Urban Flooding & Drainage', status: 'Published', reviewer: 'Eng. Beatrice Ndwiga', date: '2026-10-21' },
                { title: 'Module 3: Heat Stress & Public Health', status: 'Published', reviewer: 'Dr. Jane Mwangi', date: '2026-10-22' },
                { title: 'Module 4: Water Stress & Disease Prevention', status: 'Published', reviewer: 'Eng. Paul Kilonzo', date: '2026-10-23' },
                { title: 'Module 5: Climate Justice & African Equity', status: 'Published', reviewer: 'Faith Aluso', date: '2026-10-24' },
                { title: 'Module 6: Green Claims & Carbon Integrity', status: 'Published', reviewer: 'David Njoroge', date: '2026-10-25' },
                { title: 'Module 7: Safe Civic Participation', status: 'Published', reviewer: 'Faith Aluso', date: '2026-10-26' }
              ].map((m, i) => (
                <div key={i} className="p-4 rounded-2xl border border-gray-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{m.title}</h4>
                    <span className="text-[10px] text-gray-500">
                      Editorial Reviewer: <strong>{m.reviewer}</strong> • Verified: {m.date}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
