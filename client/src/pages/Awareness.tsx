import { useState, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import { awarenessVideos, type VideoCategory, type AwarenessVideo } from '../data/awarenessVideos';
import { audioCoordinator } from '../lib/audioCoordinator';
import { 
  Tv, 
  ExternalLink, 
  Play, 
  Pause,
  ShieldCheck, 
  Volume2, 
  VolumeX,
  Sparkles,
  MapPin,
  Globe2,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Awareness() {
  const { language } = useLanguage();
  const isSwahili = language === 'sw';

  const [activeCategory, setActiveCategory] = useState<VideoCategory>('all');
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [videoSpeeds, setVideoSpeeds] = useState<Record<string, number>>({});
  const [videoMuted, setVideoMuted] = useState<Record<string, boolean>>({});
  const [videoProgress, setVideoProgress] = useState<Record<string, { current: number; duration: number }>>({});

  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const categories: { id: VideoCategory; label: string; count: number }[] = [
    { 
      id: 'all', 
      label: isSwahili ? 'Video Zote' : 'All Videos', 
      count: awarenessVideos.length 
    },
    { 
      id: 'kenya-impacts', 
      label: isSwahili ? 'Kenya na Afrika Mashariki' : 'Kenya & East Africa', 
      count: awarenessVideos.filter(v => v.category === 'kenya-impacts').length 
    },
    { 
      id: 'global-impacts', 
      label: isSwahili ? 'Sayansi ya Tabianchi Duniani' : 'Global Climate Science', 
      count: awarenessVideos.filter(v => v.category === 'global-impacts').length 
    },
    { 
      id: 'community-action', 
      label: isSwahili ? 'Nishati na Hatua za Jamii' : 'Energy & Community Action', 
      count: awarenessVideos.filter(v => v.category === 'community-action').length 
    }
  ];

  const filteredVideos = activeCategory === 'all'
    ? awarenessVideos
    : awarenessVideos.filter(v => v.category === activeCategory);

  const togglePlay = (video: AwarenessVideo) => {
    const el = videoRefs.current[video.id];
    if (!el) return;

    if (playingVideoId === video.id && !el.paused) {
      el.pause();
      setPlayingVideoId(null);
    } else {
      // Pause any previously playing video
      if (playingVideoId && videoRefs.current[playingVideoId]) {
        videoRefs.current[playingVideoId]?.pause();
      }
      audioCoordinator.requestPlayback(`awareness-${video.id}`, 'video');
      el.play().then(() => {
        setPlayingVideoId(video.id);
      }).catch((err) => {
        console.warn('Playback error:', err);
      });
    }
  };

  const handleSeek = (videoId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const el = videoRefs.current[videoId];
    if (!el) return;
    const target = parseFloat(e.target.value);
    el.currentTime = target;
    setVideoProgress(prev => ({
      ...prev,
      [videoId]: { ...prev[videoId], current: target }
    }));
  };

  const handleSpeedChange = (videoId: string, speed: number) => {
    const el = videoRefs.current[videoId];
    if (el) {
      el.playbackRate = speed;
      setVideoSpeeds(prev => ({ ...prev, [videoId]: speed }));
    }
  };

  const toggleMute = (videoId: string) => {
    const el = videoRefs.current[videoId];
    if (el) {
      const nextMuted = !el.muted;
      el.muted = nextMuted;
      setVideoMuted(prev => ({ ...prev, [videoId]: nextMuted }));
    }
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 pb-28 max-w-5xl mx-auto font-inter">
      {/* Header Banner */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-green/10 text-forest-green">
            <Tv className="w-3.5 h-3.5" />
            {isSwahili ? 'Uelewa wa Tabianchi' : 'Climate Awareness'}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            {isSwahili ? 'Maudhui Yaliyothibitishwa' : 'Source-Backed Media'}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          {isSwahili 
            ? 'Ushahidi wa Kisayansi na Makala za Tabianchi' 
            : 'Climate Awareness & Scientific Media'}
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
          {isSwahili
            ? 'Mkusanyiko wa video halisi na michoro ya kisayansi kutoka taasisi zinazoaminika (kama Stockholm Environment Institute, NASA, na VOA News) zikionyesha ukame wa Afrika Mashariki, upanuzi wa nishati ya jotoardhi Kenya, na mabadiliko ya joto duniani.'
            : 'Curated video documentation and satellite visualizations from verified reporting organizations and research institutions (Stockholm Environment Institute, NASA Scientific Visualization Studio, and VOA News) documenting East African drought anomalies, geothermal clean energy transitions in Kenya, and global temperature baselines.'}
        </p>
      </header>

      {/* Category Filter Pills */}
      <div 
        className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar"
        role="tablist"
        aria-label="Filter videos by category"
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            role="tab"
            aria-selected={activeCategory === cat.id}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeCategory === cat.id
                ? 'bg-forest-green text-white shadow-sm ring-2 ring-forest-green/20'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <span>{cat.label}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
            }`}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredVideos.map((video) => {
          const isPlaying = playingVideoId === video.id;
          const currentProgress = videoProgress[video.id] || { current: 0, duration: video.durationSeconds };
          const currentSpeed = videoSpeeds[video.id] || 1;
          const isMuted = videoMuted[video.id] || false;

          return (
            <article 
              key={video.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md"
              aria-labelledby={`video-title-${video.id}`}
            >
              {/* Native HTML5 Video Player */}
              <div className="relative aspect-video bg-gray-950 w-full overflow-hidden">
                <video
                  ref={el => { videoRefs.current[video.id] = el; }}
                  src={video.videoSource}
                  className="w-full h-full object-cover"
                  playsInline
                  preload="metadata"
                  onTimeUpdate={() => {
                    const el = videoRefs.current[video.id];
                    if (el) {
                      setVideoProgress(prev => ({
                        ...prev,
                        [video.id]: { current: el.currentTime, duration: el.duration || video.durationSeconds }
                      }));
                    }
                  }}
                  onLoadedMetadata={() => {
                    const el = videoRefs.current[video.id];
                    if (el && el.duration) {
                      setVideoProgress(prev => ({
                        ...prev,
                        [video.id]: { current: 0, duration: el.duration }
                      }));
                    }
                  }}
                  onPlay={() => setPlayingVideoId(video.id)}
                  onPause={() => {
                    if (playingVideoId === video.id) setPlayingVideoId(null);
                  }}
                  onEnded={() => {
                    if (playingVideoId === video.id) setPlayingVideoId(null);
                  }}
                />

                {/* Overlaid Badge */}
                <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 uppercase tracking-wider z-10">
                  {video.category === 'kenya-impacts' ? (
                    <>
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      Kenya & East Africa
                    </>
                  ) : video.category === 'community-action' ? (
                    <>
                      <Zap className="w-3 h-3 text-amber-400" />
                      Clean Energy Action
                    </>
                  ) : (
                    <>
                      <Globe2 className="w-3 h-3 text-blue-400" />
                      Global Science
                    </>
                  )}
                </div>

                {/* Media Type Indicator */}
                <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md text-gray-200 text-[10px] font-medium px-2 py-1 rounded-md z-10 flex items-center gap-1">
                  {video.hasAudio ? (
                    <Volume2 className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <VolumeX className="w-3 h-3 text-gray-400" />
                  )}
                  <span>{video.hasAudio ? 'Spoken Audio' : 'Silent Data Visual'}</span>
                </div>

                {/* Large Center Play Button (when paused) */}
                {!isPlaying && (
                  <button
                    onClick={() => togglePlay(video)}
                    className="absolute inset-0 m-auto w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-forest-green/90 hover:bg-forest-green text-white flex items-center justify-center shadow-xl transition-transform hover:scale-110 active:scale-95 z-10"
                    aria-label={`${isSwahili ? 'Cheza' : 'Play'}: ${video.title[language]}`}
                  >
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 ml-1 fill-white" />
                  </button>
                )}
              </div>

              {/* Player Controls Bar */}
              <div className="bg-gray-900 text-white px-4 py-2.5 text-xs flex flex-col gap-2">
                {/* Scrubber Slider */}
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-gray-300 w-10 text-right">
                    {formatSeconds(currentProgress.current)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={currentProgress.duration || video.durationSeconds}
                    step="0.1"
                    value={currentProgress.current}
                    onChange={(e) => handleSeek(video.id, e)}
                    className="flex-1 accent-emerald-500 h-1.5 bg-gray-700 rounded-lg cursor-pointer"
                    aria-label="Seek video position"
                  />
                  <span className="font-mono text-[11px] text-gray-400 w-10">
                    {formatSeconds(currentProgress.duration || video.durationSeconds)}
                  </span>
                </div>

                {/* Secondary Controls (Play/Pause, Mute, Speed) */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => togglePlay(video)}
                      className="p-1 rounded hover:bg-gray-800 text-emerald-400 transition"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-emerald-400" /> : <Play className="w-4 h-4 fill-emerald-400" />}
                    </button>

                    {video.hasAudio && (
                      <button
                        onClick={() => toggleMute(video.id)}
                        className="p-1 rounded hover:bg-gray-800 text-gray-300 transition"
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    )}

                    <span className="text-[11px] text-gray-400 hidden sm:inline">
                      {video.mediaType}
                    </span>
                  </div>

                  {/* Speed Controls */}
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-gray-400 mr-1">Speed:</span>
                    {[1, 1.25, 1.5].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => handleSpeedChange(video.id, spd)}
                        className={`text-[10px] px-1.5 py-0.5 rounded transition ${
                          currentSpeed === spd
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Video Information */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span className="font-semibold text-forest-green">{video.publisher}</span>
                    <span className="font-mono">{video.year} • {video.duration}</span>
                  </div>

                  <h2 
                    id={`video-title-${video.id}`}
                    className="text-base sm:text-lg font-bold text-gray-900 leading-snug mb-2"
                  >
                    {video.title[language]}
                  </h2>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {video.description[language]}
                  </p>
                </div>

                {/* Key Takeaways */}
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                  <span className="font-bold text-gray-900 block mb-1.5 uppercase tracking-wider text-[10px]">
                    {isSwahili ? 'Mambo Muhimu Yaliyorekodiwa' : 'Key Documented Findings'}
                  </span>
                  <ul className="space-y-1 text-gray-600 list-disc list-inside">
                    {video.keyTakeaways[language].map((pt, idx) => (
                      <li key={idx} className="leading-relaxed">{pt}</li>
                    ))}
                  </ul>
                </div>

                {/* Practical Community Action */}
                <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs text-emerald-950">
                  <span className="font-bold text-emerald-900 block mb-1 text-[10px] uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    {isSwahili ? 'Hatua Inayopendekezwa Mtaani' : 'Practical Community Action'}
                  </span>
                  <p className="leading-relaxed text-emerald-800">
                    {video.communityAction[language]}
                  </p>
                </div>

                {/* Provenance & Attribution Bar */}
                <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-[11px] text-gray-500 gap-2">
                  <span className="truncate max-w-[280px]">
                    License: <strong>{video.license}</strong>
                  </span>
                  <a
                    href={video.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-forest-green hover:underline flex items-center gap-1"
                  >
                    <span>{isSwahili ? 'Chanzo Rasmi cha Faili' : 'Original Source Asset'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Cross-Link to Curriculum */}
      <div className="mt-12 p-6 rounded-2xl bg-forest-green text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold">
            {isSwahili ? 'Tayari Kujifunza kwa Undani Zaidi?' : 'Ready for In-Depth Structured Learning?'}
          </h3>
          <p className="text-xs text-emerald-100 mt-1 max-w-xl">
            {isSwahili 
              ? 'Mtaala wetu wa masomo unaeleza sayansi ya hali ya hewa Nairobi, hatua za kupunguza mafuriko, na haki za mazingira kwa vitendo.'
              : 'Our structured course modules break down Nairobi climate hazards, drainage adaptation, and environmental rights with interactive assessments.'}
          </p>
        </div>
        <Link
          to="/learn"
          className="whitespace-nowrap px-5 py-2.5 rounded-xl bg-white text-forest-green font-bold text-xs hover:bg-emerald-50 transition shadow-sm"
        >
          {isSwahili ? 'Tazama Masomo Yote' : 'Explore Course Catalog'}
        </Link>
      </div>
    </div>
  );
}
