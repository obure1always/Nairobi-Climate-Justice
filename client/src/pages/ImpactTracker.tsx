import { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { 
  TreePine, 
  Zap, 
  Users, 
  Droplets, 
  Clock, 
  ShieldCheck, 
  Plus, 
  Send,
  X,
  Award
} from 'lucide-react';

interface ImpactActionItem {
  id: string;
  userId: string;
  actionType: 'trees_planted' | 'energy_saved_kwh' | 'emissions_reduced_kg' | 'people_reached' | 'adaptation_project';
  quantity: number;
  unit: string;
  description: string;
  location: string;
  evidenceUrl?: string;
  verificationStatus: 'self_reported' | 'independently_verified' | 'rejected';
  verifierNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
}

export default function ImpactTracker() {
  const { language } = useLanguage();
  const isSwahili = language === 'sw';

  const [actions, setActions] = useState<ImpactActionItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [actionType, setActionType] = useState<ImpactActionItem['actionType']>('trees_planted');
  const [quantity, setQuantity] = useState<number>(10);
  const [location, setLocation] = useState<string>('Mathare 4A, Nairobi');
  const [description, setDescription] = useState<string>('');
  const [evidenceUrl, setEvidenceUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchActions = () => {
    fetch('/api/v1/impact/actions')
      .then(res => res.ok ? res.json() : { actions: [] })
      .then(data => {
        if (data?.actions) setActions(data.actions);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchActions();
  }, []);

  const handleSubmitAction = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = sessionStorage.getItem('climate_justice_token') || localStorage.getItem('climate_justice_token') || localStorage.getItem('auth_token');
    if (!token) {
      setStatusMessage('Please sign in to document climate impact actions.');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    const unitMap = {
      trees_planted: 'indigenous seedlings',
      energy_saved_kwh: 'kWh saved',
      emissions_reduced_kg: 'kg CO₂e avoided',
      people_reached: 'community members engaged',
      adaptation_project: 'projects completed'
    };

    try {
      const res = await fetch('/api/v1/impact/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          actionType,
          quantity,
          unit: unitMap[actionType],
          description,
          location,
          evidenceUrl
        })
      });

      if (res.ok) {
        setStatusMessage('Action recorded as Self-Reported! Faculty reviewers will verify evidence.');
        fetchActions();
        setTimeout(() => {
          setShowModal(false);
          setStatusMessage(null);
        }, 1500);
      }
    } catch {
      setStatusMessage('Network error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cumulative verified totals
  const verifiedActions = actions.filter(a => a.verificationStatus === 'independently_verified');
  const totalTrees = verifiedActions.filter(a => a.actionType === 'trees_planted').reduce((s, a) => s + a.quantity, 0);
  const totalEnergy = verifiedActions.filter(a => a.actionType === 'energy_saved_kwh').reduce((s, a) => s + a.quantity, 0);
  const totalEmissions = verifiedActions.filter(a => a.actionType === 'emissions_reduced_kg').reduce((s, a) => s + a.quantity, 0);
  const totalPeople = verifiedActions.filter(a => a.actionType === 'people_reached').reduce((s, a) => s + a.quantity, 0);

  return (
    <div className="min-h-full pb-20 bg-gray-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        {/* Header */}
        <div className="bg-gradient-to-r from-forest-green to-emerald-900 rounded-3xl p-8 text-white shadow-lg mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Award className="w-4 h-4" />
              Verified Community Outcomes
            </span>
            <h1 className="text-3xl font-extrabold text-white mb-2">
              {isSwahili ? 'Ufuatiliaji wa Athari Halisi za Tabianchi' : 'Real-World Climate Impact Tracker'}
            </h1>
            <p className="text-emerald-100 text-xs md:text-sm leading-relaxed">
              Transparently document environmental actions. In accordance with rigorous verification standards, self-reported claims are clearly separated from independently verified outcomes.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-white text-forest-green hover:bg-emerald-50 rounded-2xl text-xs font-bold shadow-lg transition flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Document New Action</span>
          </button>
        </div>

        {/* 4 Impact Stat Cards (Independently Verified) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <TreePine className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-gray-900">{totalTrees}</span>
              <span className="text-[11px] text-gray-500 font-semibold block">Trees Verified Alive</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-gray-900">{totalEnergy} kWh</span>
              <span className="text-[11px] text-gray-500 font-semibold block">Clean Solar Generated</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-gray-900">{totalEmissions} kg</span>
              <span className="text-[11px] text-gray-500 font-semibold block">CO₂e Avoided</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-gray-900">{totalPeople}</span>
              <span className="text-[11px] text-gray-500 font-semibold block">Community Members Reached</span>
            </div>
          </div>
        </div>

        {/* Actions Feed */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              Community Climate Action Ledger ({actions.length} Entries)
            </h3>
            <span className="text-xs text-gray-400">
              Audited by Independent Review Board
            </span>
          </div>

          <div className="space-y-4">
            {actions.map((act) => {
              const isVerified = act.verificationStatus === 'independently_verified';

              return (
                <div key={act.id} className="p-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50/50 transition space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1 ${
                        isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isVerified ? <ShieldCheck className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {isVerified ? 'Independently Verified' : 'Self-Reported Claim'}
                      </span>
                      <span className="text-xs font-bold text-gray-800">
                        {act.quantity} {act.unit}
                      </span>
                    </div>

                    <span className="text-[11px] text-gray-400">
                      📍 {act.location} • {new Date(act.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed">
                    {act.description}
                  </p>

                  {/* Auditor Notes if verified */}
                  {isVerified && act.verifierNotes && (
                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 text-[11px] text-emerald-950">
                      <strong>Audit Note ({act.verifiedBy || 'Review Board'}): </strong>{act.verifierNotes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal: Document Action */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold text-gray-900 mb-1">Document Real-World Climate Action</h2>
              <p className="text-xs text-gray-500 mb-6">
                Record measurable environmental impact. Include photos or report links for independent audit.
              </p>

              {statusMessage && (
                <div className="mb-4 p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold">
                  {statusMessage}
                </div>
              )}

              <form onSubmit={handleSubmitAction} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Action Category</label>
                  <select
                    value={actionType}
                    onChange={(e) => setActionType(e.target.value as any)}
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-forest-green/20"
                  >
                    <option value="trees_planted">Trees Planted (Indigenous Seedlings)</option>
                    <option value="energy_saved_kwh">Clean Solar Energy Generated (kWh)</option>
                    <option value="emissions_reduced_kg">Emissions Reduced (kg CO₂e)</option>
                    <option value="people_reached">Community Members Trained / Reached</option>
                    <option value="adaptation_project">Completed Local Adaptation Project</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                      className="w-full p-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Location / Ward</label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Kibera, Nairobi"
                      className="w-full p-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Action Description & Method</label>
                  <textarea
                    rows={2}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe tree species, survival monitoring, or solar sizing details..."
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Supporting Photographic / Audit Link</label>
                  <input
                    type="url"
                    value={evidenceUrl}
                    onChange={(e) => setEvidenceUrl(e.target.value)}
                    placeholder="https://drive.google.com/your-geo-tagged-photo.jpg"
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
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
                    <span>{isSubmitting ? 'Recording...' : 'Record Impact'}</span>
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
