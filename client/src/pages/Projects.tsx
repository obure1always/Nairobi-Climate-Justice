import { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CarbonCalculator, type CarbonAuditResult } from '../components/CarbonCalculator';
import { 
  FileCheck, 
  UploadCloud, 
  Award, 
  Calculator, 
  CheckCircle, 
  Send, 
  X, 
  FileText
} from 'lucide-react';

interface ProjectBrief {
  id: string;
  title: string;
  category: string;
  durationWeeks: number;
  expectedDeliverables: string[];
  rubric: {
    criteria: string;
    points: number;
    description: string;
  }[];
  briefMarkdown: string;
}

interface ProjectSubmission {
  id: string;
  projectId: string;
  title: string;
  summary: string;
  deliverables: any;
  methodology: string;
  localAssumptions: string;
  calculatedEmissionsOrSizing?: string;
  fileAttachmentUrl?: string;
  status: 'submitted' | 'under_review' | 'graded' | 'revision_requested';
  gradeScore?: number;
  rubricScores?: Record<string, number>;
  instructorFeedback?: string;
  gradedBy?: string;
  createdAt: string;
}

export default function Projects() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isSwahili = language === 'sw';

  const [activeTab, setActiveTab] = useState<'briefs' | 'calculator' | 'submissions'>('briefs');
  const [projects, setProjects] = useState<ProjectBrief[]>([]);
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectBrief | null>(null);

  // Submission Form State
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submittingProjectId, setSubmittingProjectId] = useState<string>('proj-carbon-footprint');
  const [subTitle, setSubTitle] = useState('');
  const [subSummary, setSubSummary] = useState('');
  const [subMethodology, setSubMethodology] = useState('');
  const [subAssumptions, setSubAssumptions] = useState('');
  const [subCalculations, setSubCalculations] = useState('');
  const [subFileUrl, setSubFileUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch project briefs from backend
  useEffect(() => {
    fetch('/api/v1/projects')
      .then(res => res.ok ? res.json() : { projects: [] })
      .then(data => {
        if (data && data.projects) {
          setProjects(data.projects);
          if (data.projects.length > 0) {
            setSelectedProject(data.projects[0]);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Fetch learner's submissions if logged in
  useEffect(() => {
    const token = sessionStorage.getItem('climate_justice_token') || localStorage.getItem('climate_justice_token') || localStorage.getItem('auth_token');
    if (!token) return;

    fetch('/api/v1/projects/my-submissions', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : { submissions: [] })
      .then(data => {
        if (data && data.submissions) {
          setSubmissions(data.submissions);
        }
      })
      .catch(() => {});
  }, [submitSuccess]);

  const handleOpenSubmit = (projectId: string) => {
    if (!user) {
      navigate('/login', { state: { from: '/projects' } });
      return;
    }
    setSubmittingProjectId(projectId);
    const p = projects.find(pr => pr.id === projectId);
    setSubTitle(p ? `${p.title} - Proposal` : 'Applied Project Submission');
    setShowSubmitModal(true);
  };

  const handleCarbonAuditExport = (audit: CarbonAuditResult) => {
    setSubCalculations(
      `Total Annual Emissions: ${audit.totalAnnualTonnes} tCO2e (${audit.totalAnnualKg} kg CO2e)\n` +
      `Breakdown: Cooking Fuel: ${audit.cookingFuelKg}kg | Transport: ${audit.transportKg}kg | Electricity: ${audit.electricityKg}kg | Waste: ${audit.wasteKg}kg\n` +
      `Comparison: ${audit.nationalComparisonFactor}x Kenya National Average\n` +
      `Mitigation Plan: ${audit.mitigationPlan.map(m => `${m.action} (-${m.reductionKg}kg)`).join('; ')}`
    );
    setSubmittingProjectId('proj-carbon-footprint');
    setSubTitle('Household & Micro-Enterprise Carbon Footprint Assessment');
    setShowSubmitModal(true);
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = sessionStorage.getItem('climate_justice_token') || localStorage.getItem('climate_justice_token') || localStorage.getItem('auth_token');
    if (!token) {
      setSubmitError('You must be signed in to submit applied projects.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/v1/projects/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          projectId: submittingProjectId,
          title: subTitle,
          summary: subSummary,
          deliverables: { primaryFormat: 'Report & Calculations' },
          methodology: subMethodology,
          localAssumptions: subAssumptions,
          calculatedEmissionsOrSizing: subCalculations,
          fileUrl: subFileUrl?.trim() || null,
          calculatorData: {
            methodology: subMethodology,
            localAssumptions: subAssumptions,
            calculatedEmissionsOrSizing: subCalculations
          }
        })
      });

      if (res.ok) {
        await res.json();
        setSubmitSuccess('Project proposal submitted successfully for instructor rubric grading!');
        setTimeout(() => {
          setShowSubmitModal(false);
          setActiveTab('submissions');
          setSubmitSuccess(null);
        }, 1500);
      } else {
        const err = await res.json();
        setSubmitError(err.message || 'Submission failed.');
      }
    } catch {
      setSubmitError('Network error. Could not connect to the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-full pb-20 bg-gray-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-forest-green to-teal-900 rounded-3xl p-8 md:p-10 text-white shadow-lg mb-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
              <FileCheck className="w-4 h-4" />
              {isSwahili ? 'Miradi ya Vitendo ya Mazingira' : 'Applied Climate Projects'}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3">
              {isSwahili ? 'Miradi 5 ya Vitendo na Tathmini ya Rubriki' : '5 Applied Climate Projects & Rubric Grading'}
            </h1>
            <p className="text-emerald-100 text-sm md:text-base leading-relaxed">
              {isSwahili
                ? 'Wanafunzi wanatakiwa kutumia maarifa yao, si tu kutazama video. Fanya tathmini ya kaboni, andaa mradi wa umeme wa jua, au buni mpango wa kuzuia mafuriko ya mto Nairobi.'
                : 'Learners apply their climate knowledge through practical field proposals. Conduct a carbon footprint audit, size an off-grid clinic solar system, or design a Nairobi riparian flood-risk reduction plan for rubric evaluation.'}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-white rounded-2xl px-4 pt-2 shadow-sm mb-8">
          <button
            onClick={() => setActiveTab('briefs')}
            className={`flex items-center gap-2 py-3 px-5 font-bold text-xs md:text-sm border-b-2 transition ${
              activeTab === 'briefs'
                ? 'border-forest-green text-forest-green'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{isSwahili ? 'Miongozo ya Miradi' : 'Project Briefs & Rubrics'}</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-2 py-3 px-5 font-bold text-xs md:text-sm border-b-2 transition ${
              activeTab === 'calculator'
                ? 'border-forest-green text-forest-green'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>{isSwahili ? 'Kikokotoo cha Carbon' : 'Carbon Footprint Tool'}</span>
          </button>

          <button
            onClick={() => setActiveTab('submissions')}
            className={`flex items-center gap-2 py-3 px-5 font-bold text-xs md:text-sm border-b-2 transition ${
              activeTab === 'submissions'
                ? 'border-forest-green text-forest-green'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>{isSwahili ? 'Mawasilisho Yangu' : 'My Submissions & Feedback'}</span>
            {submissions.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-emerald-100 text-forest-green rounded-full text-[10px] font-bold">
                {submissions.length}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: PROJECT BRIEFS & RUBRICS */}
        {activeTab === 'briefs' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Project Selector List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Select Applied Project (5 Available)
              </h3>
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => setSelectedProject(proj)}
                  className={`p-4 rounded-2xl border transition cursor-pointer ${
                    selectedProject?.id === proj.id
                      ? 'border-forest-green bg-emerald-50/70 shadow-sm'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase text-forest-green block mb-1">
                    {proj.category} • {proj.durationWeeks} Weeks
                  </span>
                  <h4 className="text-sm font-bold text-gray-900 leading-snug">{proj.title}</h4>
                </div>
              ))}
            </div>

            {/* Right Column: Selected Project Detail & Rubric */}
            {selectedProject && (
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
                  <div>
                    <span className="text-xs font-bold text-forest-green bg-emerald-100/60 px-3 py-1 rounded-full uppercase tracking-wider">
                      {selectedProject.category}
                    </span>
                    <h2 className="text-xl md:text-2xl font-black text-gray-900 mt-2">
                      {selectedProject.title}
                    </h2>
                  </div>

                  <button
                    onClick={() => handleOpenSubmit(selectedProject.id)}
                    className="px-6 py-3 bg-forest-green hover:bg-forest-green/90 text-white rounded-2xl font-bold text-xs shadow-sm transition flex items-center gap-1.5 shrink-0"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Submit Proposal</span>
                  </button>
                </div>

                {/* Expected Deliverables */}
                <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-200/70">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Expected Deliverables:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-gray-700">
                    {selectedProject.expectedDeliverables.map((del, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-forest-green shrink-0 mt-0.5" />
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Rubric Breakdown */}
                <div className="mb-6">
                  <h4 className="text-sm font-extrabold text-gray-900 mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    Official Grading Rubric (100 Points Total)
                  </h4>
                  <div className="space-y-3">
                    {selectedProject.rubric.map((r, i) => (
                      <div key={i} className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 flex items-start justify-between gap-4">
                        <div>
                          <span className="font-bold text-xs text-gray-900 block">{r.criteria}</span>
                          <span className="text-[11px] text-gray-600 block mt-0.5">{r.description}</span>
                        </div>
                        <span className="text-xs font-black text-forest-green bg-emerald-50 px-2.5 py-1 rounded-lg shrink-0">
                          {r.points} pts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Brief Narrative */}
                <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-100 text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selectedProject.briefMarkdown}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INTERACTIVE CARBON FOOTPRINT CALCULATOR */}
        {activeTab === 'calculator' && (
          <div>
            <CarbonCalculator onExportAudit={handleCarbonAuditExport} />
          </div>
        )}

        {/* TAB 3: MY SUBMISSIONS & INSTRUCTOR FEEDBACK */}
        {activeTab === 'submissions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                {isSwahili ? 'Mawasilisho Yangu na Tathmini' : 'Submitted Applied Projects'}
              </h3>
              <span className="text-xs text-gray-500">{submissions.length} Total</span>
            </div>

            {submissions.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-gray-300 text-gray-500">
                <UploadCloud className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h4 className="font-bold text-gray-700 text-base mb-1">No Project Submissions Yet</h4>
                <p className="text-xs text-gray-500 max-w-md mx-auto mb-4">
                  Select a project from the briefs tab, conduct your field assessment or sizing, and submit your proposal for instructor rubric grading.
                </p>
                <button
                  onClick={() => setActiveTab('briefs')}
                  className="px-5 py-2.5 bg-forest-green text-white rounded-xl text-xs font-bold hover:bg-forest-green/90 transition"
                >
                  View Project Briefs
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((sub) => {
                  const statusColors = {
                    submitted: 'bg-blue-100 text-blue-800 border-blue-200',
                    under_review: 'bg-amber-100 text-amber-800 border-amber-200',
                    graded: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                    revision_requested: 'bg-red-100 text-red-800 border-red-200'
                  };

                  return (
                    <div key={sub.id} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                        <div>
                          <span className={`text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full border ${statusColors[sub.status]}`}>
                            {sub.status.replace('_', ' ')}
                          </span>
                          <h4 className="text-base font-bold text-gray-900 mt-1">{sub.title}</h4>
                          <span className="text-xs text-gray-400">
                            Project: {sub.projectId} • Submitted on {new Date(sub.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {sub.gradeScore !== undefined && (
                          <div className="text-right">
                            <span className="text-3xl font-black text-forest-green">{sub.gradeScore}/100</span>
                            <span className="text-[10px] text-gray-500 block">Graded by Review Board</span>
                          </div>
                        )}
                      </div>

                      <div className="text-xs text-gray-700 leading-relaxed">
                        <strong className="text-gray-900">Summary: </strong>{sub.summary}
                      </div>

                      {sub.calculatedEmissionsOrSizing && (
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 font-mono text-xs text-gray-800 whitespace-pre-wrap">
                          {sub.calculatedEmissionsOrSizing}
                        </div>
                      )}

                      {/* Instructor Written Feedback */}
                      {sub.instructorFeedback && (
                        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950">
                          <span className="font-bold text-forest-green block mb-1 flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-forest-green" />
                            Official Review & Written Feedback:
                          </span>
                          <p className="leading-relaxed">{sub.instructorFeedback}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Submission Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative my-8">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-forest-green" />
                Submit Applied Project
              </h2>
              <p className="text-xs text-gray-500 mb-6">
                Fill in your project methodology, field assumptions, and calculations for faculty evaluation.
              </p>

              {submitSuccess && (
                <div className="mb-4 p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold">
                  {submitSuccess}
                </div>
              )}

              {submitError && (
                <div className="mb-4 p-3 bg-red-100 text-red-900 rounded-xl text-xs font-bold">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmitProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Proposal Title</label>
                  <input
                    type="text"
                    required
                    value={subTitle}
                    onChange={(e) => setSubTitle(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-forest-green/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Executive Summary</label>
                  <textarea
                    rows={2}
                    required
                    value={subSummary}
                    onChange={(e) => setSubSummary(e.target.value)}
                    placeholder="Brief description of the community, facility, or farm being assessed..."
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-forest-green/20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Methodology & Framework</label>
                    <input
                      type="text"
                      required
                      value={subMethodology}
                      onChange={(e) => setSubMethodology(e.target.value)}
                      placeholder="e.g. IPCC Tier-1, EPRA solar PV sizing"
                      className="w-full p-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-forest-green/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Local Assumptions & Location</label>
                    <input
                      type="text"
                      required
                      value={subAssumptions}
                      onChange={(e) => setSubAssumptions(e.target.value)}
                      placeholder="e.g. Mathare 4A, 5.2 PSH, 24°C"
                      className="w-full p-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-forest-green/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Calculated Emissions, Sizing, or Metrics</label>
                  <textarea
                    rows={3}
                    value={subCalculations}
                    onChange={(e) => setSubCalculations(e.target.value)}
                    placeholder="Provide your quantitative calculation results (or copy from the Carbon Footprint Tool)..."
                    className="w-full p-2.5 text-xs font-mono rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-forest-green/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Supporting Document / Report Link</label>
                  <input
                    type="url"
                    value={subFileUrl}
                    onChange={(e) => setSubFileUrl(e.target.value)}
                    placeholder="https://drive.google.com/your-project-report.pdf"
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-forest-green/20"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-forest-green hover:bg-forest-green/90 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Submitting...' : 'Submit to Faculty'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
