import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  getAreas, 
  voteAreaCleanliness, 
  getCitizenReports, 
  addCitizenReport 
} from '../data/mockData';
import { AreaCleanliness, CitizenReport } from '../types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Camera, 
  Upload, 
  ThumbsUp, 
  Truck, 
  ShieldCheck, 
  Sparkles,
  Info,
  Calendar,
  Layers,
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';

const CitizenPortal: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'cleanliness' | 'report' | 'schedule' | 'my-reports'>('cleanliness');
  const [areas, setAreas] = useState<AreaCleanliness[]>(getAreas());
  const [reports, setReports] = useState<CitizenReport[]>(getCitizenReports());
  const [statusFilter, setStatusFilter] = useState<'all' | 'clean' | 'in-progress' | 'needs-attention'>('all');
  const [inspectArea, setInspectArea] = useState<AreaCleanliness | null>(null);
  const [votedAreas, setVotedAreas] = useState<Record<string, boolean>>({});

  // Report Form State
  const [reportForm, setReportForm] = useState({
    location: '',
    zone: user?.zone || 'Sector A',
    issueType: 'overflowing-bin' as CitizenReport['issueType'],
    description: '',
    photoPreview: ''
  });
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const filteredAreas = areas.filter(area => {
    if (statusFilter === 'all') return true;
    return area.status === statusFilter;
  });

  const handleVote = (areaId: string, isClean: boolean) => {
    voteAreaCleanliness(areaId, isClean);
    setAreas([...getAreas()]);
    setVotedAreas(prev => ({ ...prev, [areaId]: true }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setReportForm(prev => ({
          ...prev,
          photoPreview: event.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportForm.location || !reportForm.description) return;

    const newReport: CitizenReport = {
      id: `CR-${Date.now().toString().slice(-4)}`,
      citizenId: user?.citizenId || 'CZ-GUEST',
      citizenName: user?.fullName || 'Resident',
      citizenMobile: user?.mobile || '+91-9876500000',
      location: reportForm.location,
      zone: reportForm.zone,
      issueType: reportForm.issueType,
      description: reportForm.description,
      photo: reportForm.photoPreview || 'https://ik.imagekit.io/sihhackstone/greater_noida_door_to_door_waste-collection_1631556299135_1631556299453.jpeg',
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    addCitizenReport(newReport);
    setReports([...getCitizenReports()]);
    setReportSubmitted(true);
    setReportForm({
      location: '',
      zone: user?.zone || 'Sector A',
      issueType: 'overflowing-bin',
      description: '',
      photoPreview: ''
    });

    setTimeout(() => {
      setReportSubmitted(false);
      setActiveTab('my-reports');
    }, 1500);
  };

  const userReports = reports.filter(r => r.citizenId === user?.citizenId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md mb-3">
              <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
              <span>Resident Cleanliness Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Namaste, {user?.fullName || 'Citizen'}!
            </h1>
            <p className="text-blue-100 text-sm mt-1 max-w-xl">
              Track real-time cleanliness in your ward, verify sanitation photos submitted by workers, and help keep your neighborhood clean.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-4 text-xs font-medium">
              <span className="flex items-center bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <MapPin className="h-4 w-4 mr-1.5 text-green-300" />
                Assigned Ward: {user?.zone || 'Sector A'} (Ward 14)
              </span>
              <span className="flex items-center bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <Truck className="h-4 w-4 mr-1.5 text-blue-300" />
                Waste Van: In Service today
              </span>
            </div>
          </div>

          <div className="bg-white/10 border border-white/20 p-4 rounded-2xl backdrop-blur-md text-center min-w-[200px]">
            <p className="text-xs text-blue-100 uppercase tracking-wider font-semibold">Your Sector Index</p>
            <p className="text-4xl font-black text-white mt-1">94<span className="text-xl font-normal text-green-300">%</span></p>
            <span className="inline-block mt-1 text-[11px] bg-green-500/80 text-white font-bold px-2 py-0.5 rounded-full">
              ★ Grade A - Clean
            </span>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto space-x-2 sm:space-x-4">
        <button
          onClick={() => setActiveTab('cleanliness')}
          className={`py-3 px-4 font-semibold text-sm border-b-2 flex items-center space-x-2 transition-all whitespace-nowrap ${
            activeTab === 'cleanliness'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Area Cleanliness & Proof</span>
        </button>

        <button
          onClick={() => setActiveTab('report')}
          className={`py-3 px-4 font-semibold text-sm border-b-2 flex items-center space-x-2 transition-all whitespace-nowrap ${
            activeTab === 'report'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Report Garbage / Dirty Spot</span>
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`py-3 px-4 font-semibold text-sm border-b-2 flex items-center space-x-2 transition-all whitespace-nowrap ${
            activeTab === 'schedule'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Truck className="h-4 w-4" />
          <span>Waste Pickup Schedule</span>
        </button>

        <button
          onClick={() => setActiveTab('my-reports')}
          className={`py-3 px-4 font-semibold text-sm border-b-2 flex items-center space-x-2 transition-all whitespace-nowrap ${
            activeTab === 'my-reports'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>My Reports ({userReports.length})</span>
        </button>
      </div>

      {/* TAB 1: AREA CLEANLINESS & PROOF */}
      {activeTab === 'cleanliness' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Neighborhood Cleanliness Status</h2>
              <p className="text-xs text-gray-500">Live field updates verified with worker photo evidence</p>
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-medium text-gray-500 flex items-center mr-1">
                <Filter className="h-3.5 w-3.5 mr-1" /> Filter:
              </span>
              {(['all', 'clean', 'in-progress', 'needs-attention'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium capitalize transition-all ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'All Areas' : status.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Areas Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAreas.map((area) => {
              const isClean = area.status === 'clean';
              const isNeedsAttention = area.status === 'needs-attention';

              return (
                <div 
                  key={area.id} 
                  className="bg-white rounded-2xl shadow-sm border border-gray-200/80 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Card Top */}
                    <div className="p-5 pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                            {area.zone} • {area.ward}
                          </span>
                          <h3 className="text-base font-bold text-gray-900 mt-1.5 line-clamp-1">
                            {area.name}
                          </h3>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                          isClean 
                            ? 'bg-green-100 text-green-800' 
                            : isNeedsAttention 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {isClean ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                          {isClean ? 'Clean' : isNeedsAttention ? 'Action Req.' : 'In Progress'}
                        </span>
                      </div>

                      {/* Score Meter */}
                      <div className="mt-4">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="font-medium text-gray-600">Cleanliness Score</span>
                          <span className="font-extrabold text-gray-900">{area.cleanlinessScore}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className={`h-2.5 rounded-full transition-all duration-500 ${
                              area.cleanlinessScore >= 85 
                                ? 'bg-green-500' 
                                : area.cleanlinessScore >= 70 
                                  ? 'bg-yellow-500' 
                                  : 'bg-red-500'
                            }`}
                            style={{ width: `${area.cleanlinessScore}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Worker info & last cleaned */}
                      <div className="mt-4 space-y-1.5 text-xs text-gray-600 bg-gray-50 p-3 rounded-xl">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Last Cleaned:</span>
                          <span className="font-medium text-gray-800">{area.lastCleanedTime}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Assigned Worker:</span>
                          <span className="font-semibold text-gray-800">{area.assignedWorkerName} ({area.assignedWorkerId})</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Citizen Confirmations:</span>
                          <span className="font-semibold text-green-700">{area.verifiedByCitizenCount} residents verified</span>
                        </div>
                      </div>
                    </div>

                    {/* Proof Photo Preview */}
                    {area.proofAfter && (
                      <div className="px-5 py-2">
                        <button
                          onClick={() => setInspectArea(area)}
                          className="w-full relative rounded-xl overflow-hidden group border border-gray-200"
                        >
                          <img 
                            src={area.proofAfter} 
                            alt="Cleanliness Proof" 
                            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" 
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center text-white">
                            <span className="text-xs font-bold bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur-sm flex items-center gap-1.5">
                              <Camera className="h-3.5 w-3.5 text-green-300" />
                              View Before & After Proof
                            </span>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Citizen Verification Footer Action */}
                  <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleVote(area.id, true)}
                      disabled={votedAreas[area.id]}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                        votedAreas[area.id]
                          ? 'bg-green-100 text-green-800 cursor-default'
                          : 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
                      }`}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      {votedAreas[area.id] ? 'Cleanliness Confirmed' : 'Confirm Spotless'}
                    </button>

                    <button
                      onClick={() => {
                        setReportForm(prev => ({
                          ...prev,
                          location: area.name,
                          zone: area.zone
                        }));
                        setActiveTab('report');
                      }}
                      className="py-2 px-3 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition"
                    >
                      Report Dirty
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: REPORT GARBAGE SPOT */}
      {activeTab === 'report' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded-md">
              Rapid Municipal Grievance Redressal
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mt-2">Report an Unclean Spot or Garbage Dump</h2>
            <p className="text-sm text-gray-500 mt-1">
              Your report is sent directly to the local sanitation inspector and the route team for immediate cleanup.
            </p>
          </div>

          {reportSubmitted ? (
            <div className="p-6 bg-green-50 border border-green-200 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-green-900">Grievance Registered Successfully!</h3>
              <p className="text-sm text-green-800">
                A rapid sanitation crew has been alerted. You can track resolution status in the "My Reports" tab.
              </p>
            </div>
          ) : (
            <form onSubmit={handleReportSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">
                  Select Sector / Zone
                </label>
                <select
                  value={reportForm.zone}
                  onChange={(e) => setReportForm({ ...reportForm, zone: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Sector A">Sector A (Green Park / Market)</option>
                  <option value="Sector B">Sector B (Central Plaza)</option>
                  <option value="Sector C">Sector C (Block 1 - 4)</option>
                  <option value="Sector D">Sector D (School & Sports Complex)</option>
                  <option value="Sector E">Sector E (Industrial & Transit)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">
                  Exact Location / Landmark *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g., Near Main Market ATM or Behind Gate 2"
                    value={reportForm.location}
                    onChange={(e) => setReportForm({ ...reportForm, location: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">
                  Type of Issue
                </label>
                <select
                  value={reportForm.issueType}
                  onChange={(e) => setReportForm({ ...reportForm, issueType: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="overflowing-bin">Overflowing Community Bin</option>
                  <option value="garbage-dump">Roadside Illegal Garbage Dump</option>
                  <option value="blocked-drain">Blocked Drain with Waste</option>
                  <option value="missed-pickup">Missed Morning Door-to-Door Pickup</option>
                  <option value="other">Other Cleanliness Concern</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">
                  Description of Issue *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the condition, smell, or hazards present..."
                  value={reportForm.description}
                  onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">
                  Upload Photo Evidence (Recommended)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-4 text-center hover:border-blue-400 transition cursor-pointer relative bg-slate-50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {reportForm.photoPreview ? (
                    <div className="relative">
                      <img 
                        src={reportForm.photoPreview} 
                        alt="Preview" 
                        className="h-40 mx-auto rounded-lg object-cover shadow" 
                      />
                      <p className="text-xs text-blue-600 mt-2 font-medium">Click to change photo</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                      <p className="text-xs font-semibold text-gray-700">Click to upload or take a photo</p>
                      <p className="text-[11px] text-gray-400">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition"
              >
                Submit Citizen Grievance
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB 3: SCHEDULE & WASTE GUIDE */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-5">
            {/* Today's Schedule Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Door-to-Door Waste Collection Schedule</h3>
                  <p className="text-xs text-gray-500">Live operational timetable for {user?.zone || 'Sector A'}</p>
                </div>
                <span className="text-xs bg-green-100 text-green-800 font-bold px-2.5 py-1 rounded-full">
                  On Schedule
                </span>
              </div>

              <div className="space-y-3 mt-4">
                <div className="flex items-start space-x-3 p-3.5 bg-green-50 rounded-2xl border border-green-100">
                  <div className="bg-green-600 text-white p-2 rounded-xl text-xs font-bold">
                    07:00 AM
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">Wet / Organic Waste Collection</p>
                    <p className="text-xs text-gray-600 mt-0.5">Green Bins - Kitchen waste, fruit & vegetable peels, food scraps</p>
                    <span className="inline-block mt-2 text-[10px] bg-green-200/80 text-green-900 font-semibold px-2 py-0.5 rounded">
                      Completed Today by SW-101
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3.5 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="bg-blue-600 text-white p-2 rounded-xl text-xs font-bold">
                    10:30 AM
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">Dry & Recyclable Waste Collection</p>
                    <p className="text-xs text-gray-600 mt-0.5">Blue Bins - Plastics, paper, cardboard, tin cans, dry bottles</p>
                    <span className="inline-block mt-2 text-[10px] bg-blue-200/80 text-blue-900 font-semibold px-2 py-0.5 rounded">
                      Completed Today by SW-101
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3.5 bg-purple-50 rounded-2xl border border-purple-100">
                  <div className="bg-purple-600 text-white p-2 rounded-xl text-xs font-bold">
                    03:30 PM
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">Commercial & Market Sweeping Round</p>
                    <p className="text-xs text-gray-600 mt-0.5">Secondary clearing of street bins and public commercial areas</p>
                    <span className="inline-block mt-2 text-[10px] bg-yellow-200 text-yellow-900 font-semibold px-2 py-0.5 rounded">
                      En Route (ETA 30 mins)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Waste Segregation Guide */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-sm space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Info className="h-4 w-4 text-teal-400" />
                Segregation Quick Guide
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-white/10 rounded-xl border border-green-500/30">
                  <p className="font-bold text-green-300">🟢 Green Bin (Wet Waste)</p>
                  <p className="text-gray-300 mt-1">Leftover food, tea bags, garden leaves, vegetable waste.</p>
                </div>

                <div className="p-3 bg-white/10 rounded-xl border border-blue-500/30">
                  <p className="font-bold text-blue-300">🔵 Blue Bin (Dry Waste)</p>
                  <p className="text-gray-300 mt-1">Plastic packaging, newspapers, glass bottles, metals.</p>
                </div>

                <div className="p-3 bg-white/10 rounded-xl border border-red-500/30">
                  <p className="font-bold text-red-300">🔴 Red Bin (Hazardous)</p>
                  <p className="text-gray-300 mt-1">Diapers, sanitary pads, expired medicines, batteries.</p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 text-[11px] text-gray-400">
                Help sanitation workers avoid manual sorting by keeping wet and dry waste separate!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MY REPORTS */}
      {activeTab === 'my-reports' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Your Registered Grievances</h2>
              <p className="text-xs text-gray-500">Track resolution progress and inspect after-cleaning photos</p>
            </div>
            <button
              onClick={() => setActiveTab('report')}
              className="text-xs font-bold bg-blue-600 text-white px-3.5 py-2 rounded-xl hover:bg-blue-700 shadow-sm transition"
            >
              + File New Report
            </button>
          </div>

          <div className="grid gap-4">
            {reports.map((report) => (
              <div 
                key={report.id} 
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 flex flex-col md:flex-row gap-5 items-start justify-between"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {report.id}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${
                      report.status === 'resolved'
                        ? 'bg-green-100 text-green-800'
                        : report.status === 'in-progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-orange-100 text-orange-800'
                    }`}>
                      {report.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      • {new Date(report.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900">
                    {report.location} ({report.zone})
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {report.description}
                  </p>

                  {report.resolutionNotes && (
                    <div className="bg-green-50 border border-green-200 p-2.5 rounded-xl text-xs text-green-900">
                      <strong>Resolution Note:</strong> {report.resolutionNotes}
                    </div>
                  )}
                </div>

                {/* Proof Photos Side-by-Side if available */}
                <div className="flex gap-2">
                  {report.photo && (
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-gray-500 mb-1">Citizen Photo</p>
                      <img 
                        src={report.photo} 
                        alt="Reported condition" 
                        className="w-24 h-24 object-cover rounded-xl border border-gray-200"
                      />
                    </div>
                  )}

                  {report.resolvedPhoto && (
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-green-700 mb-1">Cleaned Proof</p>
                      <img 
                        src={report.resolvedPhoto} 
                        alt="Cleaned proof" 
                        className="w-24 h-24 object-cover rounded-xl border-2 border-green-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BEFORE / AFTER INSPECTION MODAL */}
      {inspectArea && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {inspectArea.zone} • {inspectArea.ward}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-1">{inspectArea.name}</h3>
                <p className="text-xs text-gray-500">Cleaned by {inspectArea.assignedWorkerName} ({inspectArea.assignedWorkerId})</p>
              </div>
              <button
                onClick={() => setInspectArea(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-center">
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-md inline-block">
                  Before Collection (Before Photo)
                </span>
                <img 
                  src={inspectArea.proofBefore || 'https://ik.imagekit.io/sihhackstone/greater_noida_door_to_door_waste-collection_1631556299135_1631556299453.jpeg'} 
                  alt="Before cleaning" 
                  className="w-full h-52 object-cover rounded-2xl border border-gray-200" 
                />
              </div>

              <div className="space-y-1.5 text-center">
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-md inline-block">
                  After Sanitization (Proof Photo)
                </span>
                <img 
                  src={inspectArea.proofAfter || 'https://ik.imagekit.io/sihhackstone/unnamed.png'} 
                  alt="After cleaning" 
                  className="w-full h-52 object-cover rounded-2xl border-2 border-green-500 shadow-sm" 
                />
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-600 flex items-center justify-between">
              <span>Timestamp: {inspectArea.lastCleanedTime}</span>
              <span className="text-green-700 font-bold">{inspectArea.verifiedByCitizenCount} Citizens Verified</span>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  handleVote(inspectArea.id, true);
                  setInspectArea(null);
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Confirm Spotless (Upvote)
              </button>
              <button
                onClick={() => setInspectArea(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenPortal;
