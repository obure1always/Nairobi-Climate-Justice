import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Award, 
  CheckCircle, 
  AlertTriangle, 
  ArrowLeft, 
  Printer
} from 'lucide-react';

interface VerifiedCert {
  certificateId: string;
  studentName: string;
  courseTitle: string;
  issueDate: string;
  issuingOrganization: string;
  instructorName: string;
  instructorTitle: string;
  skillsAcquired: string[];
  status: string;
  verificationUrl: string;
}

export default function VerifyCertificate() {
  const { certId } = useParams<{ certId: string }>();
  const [cert, setCert] = useState<VerifiedCert | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!certId) {
      setError('No certificate ID provided in verification URL.');
      setIsLoading(false);
      return;
    }

    fetch(`/api/v1/certificates/verify/${certId}`)
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Certificate not found or invalid.');
        }
        return res.json();
      })
      .then((data) => {
        setCert(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [certId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-forest-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-semibold text-gray-600">Verifying credential on Climate Justice Ledger...</p>
        </div>
      </div>
    );
  }

  if (error || !cert) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-lg border border-red-100 text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid Certificate</h2>
          <p className="text-xs text-gray-600 mb-6 leading-relaxed">
            {error || 'This credential could not be verified in the Climate Justice Nairobi certification registry.'}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-forest-green text-white text-xs font-bold rounded-xl hover:bg-forest-green/90 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Platform</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100/70 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Verification Success Badge */}
        <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-sm mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-wide uppercase">
                Authentic & Verified Credential
              </h1>
              <p className="text-xs text-emerald-100">
                Issued by Climate Justice Nairobi
              </p>
            </div>
          </div>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-white text-forest-green rounded-xl text-xs font-bold hover:bg-emerald-50 transition flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>

        {/* Certificate Display Canvas */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border-8 border-[#00331e] relative overflow-hidden">
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-2 left-2 w-12 h-12 border-t-2 border-l-2 border-amber-500" />
          <div className="absolute top-2 right-2 w-12 h-12 border-t-2 border-r-2 border-amber-500" />
          <div className="absolute bottom-2 left-2 w-12 h-12 border-b-2 border-l-2 border-amber-500" />
          <div className="absolute bottom-2 right-2 w-12 h-12 border-b-2 border-r-2 border-amber-500" />

          {/* Certificate Header */}
          <div className="text-center mb-8">
            <span className="text-[11px] font-black tracking-widest text-emerald-800 uppercase block mb-1">
              Climate Justice Nairobi • Professional Credential
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-black text-gray-900 tracking-tight">
              CERTIFICATE OF DEMONSTRATED COMPETENCE
            </h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto mt-3 rounded-full" />
          </div>

          {/* Presented To */}
          <div className="text-center mb-6">
            <p className="text-xs font-serif uppercase tracking-widest text-gray-500 mb-2">
              This is to certify that
            </p>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#00331e]">
              {cert.studentName}
            </h3>
            <p className="text-xs text-gray-600 mt-2 max-w-lg mx-auto leading-relaxed">
              has successfully satisfied all rigorous theoretical assessments, practical fieldwork analyses, and rubric criteria for:
            </p>
          </div>

          {/* Course Title */}
          <div className="text-center mb-8 p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100">
            <h4 className="text-xl md:text-2xl font-bold text-gray-900">
              {cert.courseTitle}
            </h4>
          </div>

          {/* Skills / Outcomes Grid */}
          {cert.skillsAcquired && cert.skillsAcquired.length > 0 && (
            <div className="mb-8">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block text-center mb-3">
                Verified Demonstrated Competencies:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {cert.skillsAcquired.map((skill, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-xs text-gray-800">
                    <CheckCircle className="w-3.5 h-3.5 text-forest-green shrink-0" />
                    <span className="font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Signatures & Seal Footer */}
          <div className="pt-8 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-center">
            {/* Founder Sign-off (Supervisor Requirement #9) */}
            <div className="text-left sm:text-left">
              <div className="font-serif italic text-2xl text-gray-900 border-b-2 border-gray-400 pb-1 mb-1 font-bold">
                John Obure
              </div>
              <p className="text-xs font-black text-gray-950">John Obure</p>
              <p className="text-[11px] font-semibold text-emerald-800">Climate Activist and Founder</p>
              <p className="text-[9px] text-gray-400">Climate Justice Nairobi</p>
            </div>

            {/* Gold Verified Seal */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-amber-500 bg-amber-50 flex flex-col items-center justify-center shadow-inner">
                <Award className="w-8 h-8 text-amber-600 mb-0.5" />
                <span className="text-[8px] font-black tracking-widest text-amber-800 uppercase">OFFICIAL SEAL</span>
              </div>
              <span className="text-[9px] font-mono text-gray-400 mt-1">Climate Justice Nairobi</span>
            </div>

            {/* Official Verification Details */}
            <div className="text-center sm:text-right text-xs">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Registry Verification
              </span>
              <p className="font-mono text-xs font-bold text-emerald-900 mb-0.5">{cert.certificateId}</p>
              <p className="text-[10px] text-gray-500">Issued: {cert.issueDate}</p>
              <p className="text-[10px] text-emerald-700 font-bold mt-1">Status: Active & Validated</p>
            </div>
          </div>

          {/* Certificate Metadata Bar */}
          <div className="mt-8 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between text-[10px] text-gray-400 font-mono">
            <span>Certificate ID: <strong>{cert.certificateId}</strong></span>
            <span>Issued Date: <strong>{cert.issueDate}</strong></span>
            <span>Registry: <strong>CJN-LEDGER-V1</strong></span>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            to="/dashboard"
            className="text-xs font-bold text-forest-green hover:underline inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Learner Dashboard</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
