import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  getAreas, 
  getCitizenReports, 
  getWorkerAudits, 
  updateCitizenReportStatus, 
  updateWorkerAuditStatus,
  mockUsers
} from '../data/mockData';
import { AreaCleanliness, CitizenReport, WorkerAuditRecord } from '../types';
import { 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  HardHat, 
  Scale, 
  FileCheck, 
  Award, 
  TrendingUp, 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Printer, 
  ShieldAlert,
  Send,
  Check,
  XCircle,
  ThumbsUp,
  BarChart2
} from 'lucide-react';

const AuthorityPortal: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'workforce' | 'audit' | 'grievances'>('overview');
  const [areas, setAreas] = useState<AreaCleanliness[]>(getAreas());
  const [reports, setReports] = useState<CitizenReport[]>(getCitizenReports());
  const [audits, setAudits] = useState<WorkerAuditRecord[]>(getWorkerAudits());
  const [inspectAudit, setInspectAudit] = useState<WorkerAuditRecord | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [alertSuccess, setAlertSuccess] = useState<string | null>(null);

  const workers = mockUsers.filter(u => u.role === 'worker');

  // Overall City Stats
  const avgCleanliness = Math.round(
    areas.reduce((acc, curr) => acc + curr.cleanlinessScore, 0) / (areas.length || 1)
  );
  const totalWasteKg = audits.reduce((acc, curr) => acc + curr.totalWeightKg, 0);
  const pendingReports = reports.filter(r => r.status !== 'resolved').length;
  const resolvedReports = reports.filter(r => r.status === 'resolved').length;
  const approvedAudits = audits.filter(a => a.auditStatus === 'approved').length;

  const handleAuditAction = (workerId: string, status: 'approved' | 'flagged') => {
    updateWorkerAuditStatus(workerId, status);
    setAudits([...getWorkerAudits()]);
    setAlertSuccess(`Worker audit for ${workerId} marked as ${status.toUpperCase()}!`);
    setTimeout(() => setAlertSuccess(null), 3000);
  };

  const handleResolveGrievance = (reportId: string) => {
    updateCitizenReportStatus(
      reportId, 
      'resolved', 
      resolutionNote || 'Inspected by Municipal Authority and resolved by Rapid Field Unit.'
    );
    setReports([...getCitizenReports()]);
    setSelectedReportId(null);
    setResolutionNote('');
    setAlertSuccess(`Grievance ${reportId} marked as RESOLVED!`);
    setTimeout(() => setAlertSuccess(null), 3000);
  };

  const handleDispatchTeam = (reportId: string) => {
    updateCitizenReportStatus(reportId, 'in-progress', 'Emergency Rapid Sanitation Vehicle Dispatched.');
    setReports([...getCitizenReports()]);
    setAlertSuccess(`Rapid Cleanup Unit dispatched for ${reportId}!`);
    setTimeout(() => setAlertSuccess(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Official Municipal Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md mb-3 text-indigo-300">
              <Building2 className="h-3.5 w-3.5 text-indigo-400" />
              <span>Municipal Directorate of Solid Waste Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Executive Oversight & Regular Monitoring Portal
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              Official command dashboard for {user?.fullName || 'Municipal Officer'} ({user?.designation || 'Zonal Sanitary Authority'}). Real-time field inspections, photo audits, and citizen complaint redressal.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-4 text-xs font-medium text-slate-300">
              <span className="flex items-center bg-white/10 px-3 py-1.5 rounded-lg">
                <MapPin className="h-4 w-4 mr-1.5 text-teal-400" />
                Jurisdiction: {user?.zone || 'Zone 1 (All Sectors A-E)'}
              </span>
              <span className="flex items-center bg-white/10 px-3 py-1.5 rounded-lg">
                <Clock className="h-4 w-4 mr-1.5 text-yellow-400" />
                Shift: Day Inspection (07:00 - 18:00)
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition"
            >
              <Printer className="h-4 w-4" />
              <span>Print Daily Report</span>
            </button>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Success Notification Alert */}
      {alertSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-900 rounded-2xl flex items-center space-x-3 text-sm font-semibold shadow-sm animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
          <span>{alertSuccess}</span>
        </div>
      )}

      {/* Top Municipal Executive KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">City Cleanliness</span>
            <div className="p-2 bg-green-50 rounded-xl">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">{avgCleanliness}%</p>
          <p className="text-[11px] text-green-700 font-medium mt-1">★ Above 85% Municipal Benchmark</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Waste Lifted Today</span>
            <div className="p-2 bg-blue-50 rounded-xl">
              <Scale className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">{totalWasteKg} <span className="text-sm font-semibold">kg</span></p>
          <p className="text-[11px] text-blue-700 font-medium mt-1">Across 5 active sector routes</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Active Workforce</span>
            <div className="p-2 bg-teal-50 rounded-xl">
              <HardHat className="h-4 w-4 text-teal-600" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">5 / 5 <span className="text-sm font-semibold">On Duty</span></p>
          <p className="text-[11px] text-teal-700 font-medium mt-1">100% daily morning attendance</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Citizen Complaints</span>
            <div className="p-2 bg-red-50 rounded-xl">
              <ShieldAlert className="h-4 w-4 text-red-600" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">{pendingReports} <span className="text-xs font-semibold text-gray-500">Pending</span></p>
          <p className="text-[11px] text-gray-500 font-medium mt-1">{resolvedReports} resolved today</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 overflow-x-auto space-x-2 sm:space-x-4">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-4 font-semibold text-sm border-b-2 flex items-center space-x-2 transition-all whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <BarChart2 className="h-4 w-4" />
          <span>Zone Cleanliness Status</span>
        </button>

        <button
          onClick={() => setActiveTab('workforce')}
          className={`py-3 px-4 font-semibold text-sm border-b-2 flex items-center space-x-2 transition-all whitespace-nowrap ${
            activeTab === 'workforce'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <HardHat className="h-4 w-4" />
          <span>Sanitation Workers Roster</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`py-3 px-4 font-semibold text-sm border-b-2 flex items-center space-x-2 transition-all whitespace-nowrap ${
            activeTab === 'audit'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <FileCheck className="h-4 w-4" />
          <span>Photo Verification & Wage Audit</span>
        </button>

        <button
          onClick={() => setActiveTab('grievances')}
          className={`py-3 px-4 font-semibold text-sm border-b-2 flex items-center space-x-2 transition-all whitespace-nowrap ${
            activeTab === 'grievances'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Citizen Grievance Redressal ({pendingReports})</span>
        </button>
      </div>

      {/* TAB 1: ZONE CLEANLINESS OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Ward & Sector Inspection Scorecard</h2>
                <p className="text-xs text-gray-500">Live monitoring of neighborhood cleanliness indices and field ratings</p>
              </div>
              <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-full border border-indigo-200">
                City Average: {avgCleanliness}% Cleanliness Index
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">
                    <th className="py-3 px-4 font-bold">Zone / Ward</th>
                    <th className="py-3 px-4 font-bold">Area Location</th>
                    <th className="py-3 px-4 font-bold">Cleanliness Score</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 font-bold">Assigned Crew</th>
                    <th className="py-3 px-4 font-bold">Citizen Verified</th>
                    <th className="py-3 px-4 font-bold">Next Collection</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {areas.map((area) => (
                    <tr key={area.id} className="hover:bg-gray-50/80 transition">
                      <td className="py-3.5 px-4 font-bold text-indigo-700">
                        {area.zone} <span className="text-gray-500 font-normal">({area.ward})</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-900">
                        {area.name}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-gray-900 w-8">{area.cleanlinessScore}%</span>
                          <div className="w-24 bg-gray-100 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
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
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold capitalize text-[11px] ${
                          area.status === 'clean' 
                            ? 'bg-green-100 text-green-800' 
                            : area.status === 'needs-attention' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {area.status.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-gray-700">
                        {area.assignedWorkerName} <span className="text-gray-400 font-mono">({area.assignedWorkerId})</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-green-700">
                        {area.verifiedByCitizenCount} Citizens
                      </td>
                      <td className="py-3.5 px-4 text-gray-500">
                        {area.nextScheduledCollection}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WORKFORCE MONITORING */}
      {activeTab === 'workforce' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Sanitation Field Workers Roster</h2>
                <p className="text-xs text-gray-500">Real-time attendance, route assignment, and health certification</p>
              </div>
              <span className="text-xs bg-teal-50 text-teal-700 font-bold px-3 py-1 rounded-full border border-teal-200">
                5 Active Staff
              </span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {workers.map((worker) => (
                <div key={worker.id} className="p-5 rounded-2xl border border-gray-200 shadow-sm bg-slate-50/50 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        {worker.workerId} • {worker.team}
                      </span>
                      <h3 className="text-base font-bold text-gray-900 mt-1">{worker.fullName}</h3>
                      <p className="text-xs text-gray-500">{worker.mobile}</p>
                    </div>
                    <span className="text-[11px] font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      ● Active Duty
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs bg-white p-3 rounded-xl border border-gray-100">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Assigned Zone:</span>
                      <span className="font-semibold text-gray-800">{worker.zone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Health Status:</span>
                      <span className="font-semibold text-green-700">{worker.healthStatus || 'Good'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Last Medical Checkup:</span>
                      <span className="text-gray-600">{worker.lastCheckup || '2024-08-15'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-200/60">
                    <span className="text-gray-500">Joined: {worker.joinDate}</span>
                    <button
                      onClick={() => setActiveTab('audit')}
                      className="font-bold text-indigo-600 hover:text-indigo-800"
                    >
                      Audit Proofs →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PHOTO AUDIT & WAGE INCENTIVE APPROVAL */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Worker Photo Verification & Wage Incentive Audit</h2>
                <p className="text-xs text-gray-500">Review GPS-stamped before & after photos to authorize wage bonuses</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-green-50 text-green-700 font-bold px-3 py-1 rounded-full border border-green-200">
                  {approvedAudits} / {audits.length} Audits Approved
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">
                    <th className="py-3 px-4 font-bold">Worker</th>
                    <th className="py-3 px-4 font-bold">Zone</th>
                    <th className="py-3 px-4 font-bold">Tasks Done</th>
                    <th className="py-3 px-4 font-bold">Total Weight</th>
                    <th className="py-3 px-4 font-bold">Photo Accuracy</th>
                    <th className="py-3 px-4 font-bold">Calculated Incentive</th>
                    <th className="py-3 px-4 font-bold">Audit Status</th>
                    <th className="py-3 px-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {audits.map((audit) => (
                    <tr key={audit.workerId} className="hover:bg-gray-50 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        {audit.workerName} <span className="text-gray-400 font-mono">({audit.workerId})</span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-700 font-medium">
                        {audit.zone}
                      </td>
                      <td className="py-3.5 px-4 font-semibold">
                        {audit.tasksCompleted} / {audit.tasksAssigned} Completed
                      </td>
                      <td className="py-3.5 px-4 font-bold text-gray-800">
                        {audit.totalWeightKg} kg
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-green-700 font-bold">{audit.photoComplianceScore}% GPS Valid</span>
                      </td>
                      <td className="py-3.5 px-4 font-black text-indigo-700">
                        ₹{audit.calculatedIncentive}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold capitalize text-[11px] ${
                          audit.auditStatus === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : audit.auditStatus === 'flagged'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {audit.auditStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => setInspectAudit(audit)}
                          className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition"
                        >
                          View Photos
                        </button>
                        {audit.auditStatus !== 'approved' && (
                          <button
                            onClick={() => handleAuditAction(audit.workerId, 'approved')}
                            className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-sm transition"
                          >
                            Approve Pay
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CITIZEN GRIEVANCES REDRESSAL */}
      {activeTab === 'grievances' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Citizen Cleanliness Grievance Redressal Desk</h2>
                <p className="text-xs text-gray-500">Live feed of public complaints, photo verification, and rapid team dispatch</p>
              </div>
              <span className="text-xs bg-red-50 text-red-700 font-bold px-3 py-1 rounded-full border border-red-200">
                {pendingReports} Action Items Pending
              </span>
            </div>

            <div className="space-y-4">
              {reports.map((report) => {
                const isResolved = report.status === 'resolved';

                return (
                  <div 
                    key={report.id} 
                    className="p-5 rounded-2xl border border-gray-200 shadow-sm bg-white hover:border-indigo-300 transition-all flex flex-col md:flex-row gap-5 justify-between items-start"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                          {report.id}
                        </span>
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          {report.zone}
                        </span>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${
                          isResolved 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {report.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-gray-900">
                        {report.location}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {report.description}
                      </p>

                      <div className="text-xs text-gray-500 flex flex-wrap gap-4 pt-1">
                        <span><strong>Resident:</strong> {report.citizenName} ({report.citizenMobile})</span>
                        {report.assignedToWorker && <span><strong>Assigned Crew:</strong> {report.assignedToWorker}</span>}
                      </div>

                      {report.resolutionNotes && (
                        <div className="bg-green-50 p-2.5 rounded-xl text-xs text-green-900 border border-green-200">
                          <strong>Official Resolution:</strong> {report.resolutionNotes}
                        </div>
                      )}
                    </div>

                    {/* Proof Photos Side-by-Side */}
                    <div className="flex gap-2">
                      {report.photo && (
                        <div className="text-center">
                          <p className="text-[10px] font-bold text-gray-500 mb-1">Citizen Photo</p>
                          <img 
                            src={report.photo} 
                            alt="Issue" 
                            className="w-24 h-24 object-cover rounded-xl border border-gray-200"
                          />
                        </div>
                      )}
                      {report.resolvedPhoto && (
                        <div className="text-center">
                          <p className="text-[10px] font-bold text-green-700 mb-1">Cleaned Proof</p>
                          <img 
                            src={report.resolvedPhoto} 
                            alt="Cleaned" 
                            className="w-24 h-24 object-cover rounded-xl border-2 border-green-500"
                          />
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {!isResolved && (
                      <div className="flex flex-col gap-2 min-w-[160px] self-stretch md:self-center">
                        <button
                          onClick={() => handleDispatchTeam(report.id)}
                          className="py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
                        >
                          Dispatch Van DL-1WA
                        </button>
                        <button
                          onClick={() => setSelectedReportId(report.id)}
                          className="py-2 px-3 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
                        >
                          Mark as Resolved
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* RESOLVE GRIEVANCE MODAL */}
      {selectedReportId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in">
            <h3 className="text-lg font-bold text-gray-900">Complete Grievance {selectedReportId}</h3>
            <p className="text-xs text-gray-500">
              Provide the municipal resolution note. An automated notification with proof of sanitation will be sent to the resident.
            </p>
            <textarea
              rows={3}
              placeholder="e.g., Cleaned, cleared bin and sprayed disinfectant by Sector A Rapid Unit."
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedReportId(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleResolveGrievance(selectedReportId)}
                className="px-4 py-2 text-xs font-bold text-white bg-green-600 rounded-xl hover:bg-green-700 shadow"
              >
                Confirm Resolution
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHOTO INSPECTION MODAL FOR AUDIT */}
      {inspectAudit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in">
            <div className="flex justify-between items-start border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {inspectAudit.workerId} • {inspectAudit.zone}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-1">Photo Evidence Audit: {inspectAudit.workerName}</h3>
                <p className="text-xs text-gray-500">Tasks Completed: {inspectAudit.tasksCompleted} | Weight Lifted: {inspectAudit.totalWeightKg} kg</p>
              </div>
              <button
                onClick={() => setInspectAudit(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-center">
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-md inline-block">
                  Before Collection (GPS Stamped)
                </span>
                <img 
                  src="https://ik.imagekit.io/sihhackstone/greater_noida_door_to_door_waste-collection_1631556299135_1631556299453.jpeg" 
                  alt="Before" 
                  className="w-full h-52 object-cover rounded-2xl border border-gray-200" 
                />
              </div>

              <div className="space-y-1.5 text-center">
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-md inline-block">
                  After Cleaned & Weighed (Proof Photo)
                </span>
                <img 
                  src="https://ik.imagekit.io/sihhackstone/unnamed.png" 
                  alt="After" 
                  className="w-full h-52 object-cover rounded-2xl border-2 border-green-500 shadow-sm" 
                />
              </div>
            </div>

            <div className="p-3 bg-indigo-50 rounded-xl text-xs text-indigo-900 flex justify-between items-center">
              <span>Automatic Incentive Calculation: <strong>₹{inspectAudit.calculatedIncentive}</strong></span>
              <span className="font-bold text-green-700">Photo Accuracy: {inspectAudit.photoComplianceScore}%</span>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  handleAuditAction(inspectAudit.workerId, 'flagged');
                  setInspectAudit(null);
                }}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl transition"
              >
                Flag for Re-inspection
              </button>
              <button
                onClick={() => {
                  handleAuditAction(inspectAudit.workerId, 'approved');
                  setInspectAudit(null);
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Authorize Incentive & Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorityPortal;
