import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAreas } from '../services/areaService';
import { getComplaints, updateComplaint, assignComplaintWorker } from '../services/complaintService';
import { getRegisteredWorkers, getWorkerAudits, updateAuditStatus } from '../services/workerService';
import { getTasks, createTask, updateTask, deleteTask } from '../services/taskService';
import { getAuthorityCityStats, AuthorityCityStats } from '../services/statsService';
import { AreaCleanliness, CitizenReport, WorkerAuditRecord, User, Task } from '../types';
import { 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  HardHat, 
  Scale, 
  FileCheck, 
  TrendingUp, 
  Printer, 
  ShieldAlert,
  XCircle,
  BarChart2,
  Plus,
  Loader2,
  Route,
  UserCheck,
  Inbox,
  X
} from 'lucide-react';

const AuthorityPortal: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'workforce' | 'audit' | 'grievances'>('overview');
  const [areas, setAreas] = useState<AreaCleanliness[]>([]);
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [workers, setWorkers] = useState<User[]>([]);
  const [audits, setAudits] = useState<WorkerAuditRecord[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [cityStats, setCityStats] = useState<AuthorityCityStats | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [alertSuccess, setAlertSuccess] = useState<string | null>(null);
  const [alertError, setAlertError] = useState<string | null>(null);

  // Modals & form states
  const [inspectAudit, setInspectAudit] = useState<WorkerAuditRecord | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [assignWorkerReport, setAssignWorkerReport] = useState<CitizenReport | null>(null);
  const [selectedWorkerForAssignment, setSelectedWorkerForAssignment] = useState('');

  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({
    routeName: '',
    location: '',
    zone: 'Sector A',
    lat: 28.5494,
    lng: 77.2066,
    scheduledDate: new Date().toISOString().split('T')[0],
    assignedWorkerId: '',
    wasteCategory: 'Dry Waste, Wet Waste'
  });

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [areasRes, reportsRes, workersRes, auditsRes, tasksRes, statsRes] = await Promise.all([
        getAreas(),
        getComplaints(),
        getRegisteredWorkers(),
        getWorkerAudits(),
        getTasks(),
        getAuthorityCityStats()
      ]);

      setAreas(areasRes.data || []);
      setReports(reportsRes.data || []);
      setWorkers(workersRes.data || []);
      setAudits(auditsRes.data || []);
      setTasks(tasksRes.data || []);
      setCityStats(statsRes);
    } catch (err: unknown) {
      console.error('Error loading municipal authority data:', err);
      setAlertError('Failed to load some municipal data. Retrying with cached view.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const showNotification = (msg: string, isError = false) => {
    if (isError) {
      setAlertError(msg);
      setTimeout(() => setAlertError(null), 4000);
    } else {
      setAlertSuccess(msg);
      setTimeout(() => setAlertSuccess(null), 4000);
    }
  };

  // KPIs
  const avgCleanliness = cityStats?.avgCleanlinessScore ?? Math.round(
    areas.reduce((acc, curr) => acc + curr.cleanlinessScore, 0) / (areas.length || 1)
  );
  const totalWasteKg = cityStats?.totalWasteWeightKg ?? audits.reduce((acc, curr) => acc + curr.totalWeightKg, 0);
  const pendingReports = cityStats?.pendingComplaints ?? reports.filter(r => r.status !== 'resolved').length;
  const resolvedReports = cityStats?.resolvedComplaints ?? reports.filter(r => r.status === 'resolved').length;
  const approvedAudits = audits.filter(a => a.auditStatus === 'approved').length;

  const handleAuditAction = async (workerId: string, status: 'approved' | 'flagged') => {
    const res = await updateAuditStatus(workerId, status);
    if (res.success) {
      const { data } = await getWorkerAudits();
      setAudits(data);
      showNotification(`Worker audit for ${workerId} marked as ${status.toUpperCase()}!`);
    } else {
      showNotification(res.error || 'Failed to update audit status', true);
    }
  };

  const handleResolveGrievance = async (reportId: string) => {
    const res = await updateComplaint(
      reportId, 
      'resolved', 
      resolutionNote || 'Inspected by Municipal Authority and resolved by Rapid Field Unit.',
      'https://ik.imagekit.io/sihhackstone/unnamed.png'
    );
    if (res.success) {
      const { data } = await getComplaints();
      setReports(data);
      setSelectedReportId(null);
      setResolutionNote('');
      showNotification(`Grievance ${reportId} marked as RESOLVED!`);
    } else {
      showNotification(res.error || 'Failed to resolve grievance', true);
    }
  };

  const handleDispatchTeam = async (reportId: string) => {
    const res = await updateComplaint(reportId, 'in-progress', 'Emergency Rapid Sanitation Vehicle Dispatched.');
    if (res.success) {
      const { data } = await getComplaints();
      setReports(data);
      showNotification(`Rapid Cleanup Unit dispatched for grievance ${reportId}!`);
    } else {
      showNotification(res.error || 'Failed to dispatch team', true);
    }
  };

  const handleAssignWorkerToComplaint = async () => {
    if (!assignWorkerReport || !selectedWorkerForAssignment) {
      showNotification('Please select a sanitation worker to assign.', true);
      return;
    }
    const worker = workers.find(w => w.id === selectedWorkerForAssignment || w.workerId === selectedWorkerForAssignment);
    const workerName = worker?.fullName || 'Assigned Field Staff';

    const res = await assignComplaintWorker(assignWorkerReport.id, selectedWorkerForAssignment, workerName);
    if (res.success) {
      const { data } = await getComplaints();
      setReports(data);
      setAssignWorkerReport(null);
      setSelectedWorkerForAssignment('');
      showNotification(`Assigned grievance to ${workerName}!`);
    } else {
      showNotification(res.error || 'Failed to assign worker', true);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskForm.routeName || !newTaskForm.location) {
      showNotification('Route name and location are required.', true);
      return;
    }

    setIsSubmittingTask(true);
    try {
      const res = await createTask({
        routeName: newTaskForm.routeName,
        location: newTaskForm.location,
        zone: newTaskForm.zone,
        lat: Number(newTaskForm.lat) || 28.5494,
        lng: Number(newTaskForm.lng) || 77.2066,
        scheduledDate: newTaskForm.scheduledDate,
        assignedWorkerId: newTaskForm.assignedWorkerId || null,
        wasteCategory: newTaskForm.wasteCategory.split(',').map(s => s.trim()),
      });

      if (res.success && res.data) {
        setTasks(prev => [res.data!, ...prev]);
        setShowCreateTaskModal(false);
        setNewTaskForm({
          routeName: '',
          location: '',
          zone: 'Sector A',
          lat: 28.5494,
          lng: 77.2066,
          scheduledDate: new Date().toISOString().split('T')[0],
          assignedWorkerId: '',
          wasteCategory: 'Dry Waste, Wet Waste'
        });
        showNotification('New collection route task created and scheduled successfully!');
      } else {
        showNotification(res.error || 'Failed to create collection task', true);
      }
    } catch (err: unknown) {
      showNotification((err as Error)?.message || 'Error creating collection task', true);
    } finally {
      setIsSubmittingTask(false);
    }
  };

  const handleDeleteTask = async (taskId: string, routeName: string) => {
    const confirmed = window.confirm(`Are you sure you want to cancel and delete the collection task "${routeName}"?`);
    if (!confirmed) return;

    const res = await deleteTask(taskId);
    if (res.success) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
      showNotification(`Task "${routeName}" cancelled and removed.`);
    } else {
      showNotification(res.error || 'Failed to delete task', true);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: 'pending' | 'in-progress' | 'completed') => {
    const res = await updateTask(taskId, newStatus);
    if (res.success) {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      showNotification(`Task status updated to ${newStatus.toUpperCase()}`);
    } else {
      showNotification(res.error || 'Failed to update task', true);
    }
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

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowCreateTaskModal(true)}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition"
            >
              <Plus className="h-4 w-4" />
              <span>Create Collection Task</span>
            </button>

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

      {/* Notifications */}
      {alertSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-900 rounded-2xl flex items-center space-x-3 text-sm font-semibold shadow-sm animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
          <span>{alertSuccess}</span>
        </div>
      )}
      {alertError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-900 rounded-2xl flex items-center space-x-3 text-sm font-semibold shadow-sm animate-in fade-in">
          <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <span>{alertError}</span>
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
          <p className="text-[11px] text-green-700 font-medium mt-1">★ Live Municipal Scorecard</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Waste Lifted Today</span>
            <div className="p-2 bg-blue-50 rounded-xl">
              <Scale className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">{totalWasteKg} <span className="text-sm font-semibold">kg</span></p>
          <p className="text-[11px] text-blue-700 font-medium mt-1">Across all active sector routes</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Active Workforce</span>
            <div className="p-2 bg-teal-50 rounded-xl">
              <HardHat className="h-4 w-4 text-teal-600" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">{workers.length} <span className="text-sm font-semibold">Registered</span></p>
          <p className="text-[11px] text-teal-700 font-medium mt-1">Field staff on assigned duties</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Citizen Complaints</span>
            <div className="p-2 bg-red-50 rounded-xl">
              <ShieldAlert className="h-4 w-4 text-red-600" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">{pendingReports} <span className="text-xs font-semibold text-gray-500">Pending</span></p>
          <p className="text-[11px] text-gray-500 font-medium mt-1">{resolvedReports} resolved</p>
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
          onClick={() => setActiveTab('tasks')}
          className={`py-3 px-4 font-semibold text-sm border-b-2 flex items-center space-x-2 transition-all whitespace-nowrap ${
            activeTab === 'tasks'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Route className="h-4 w-4" />
          <span>Collection Tasks & Routes ({tasks.length})</span>
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
          <span>Sanitation Workers Roster ({workers.length})</span>
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

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-gray-500 text-sm">Syncing municipal records with database...</p>
        </div>
      )}

      {/* TAB 1: ZONE CLEANLINESS OVERVIEW */}
      {!isLoading && activeTab === 'overview' && (
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

      {/* TAB 2: COLLECTION TASKS & ROUTES MANAGEMENT */}
      {!isLoading && activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Municipal Collection Tasks & Routes</h2>
                <p className="text-xs text-gray-500">Create, schedule, reassign, or cancel daily waste pickup operations</p>
              </div>
              <button
                onClick={() => setShowCreateTaskModal(true)}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition"
              >
                <Plus className="h-4 w-4" />
                <span>Schedule New Task</span>
              </button>
            </div>

            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Inbox className="w-12 h-12 text-gray-300 mb-2" />
                <p className="text-gray-700 font-bold text-sm">No Collection Tasks Scheduled</p>
                <p className="text-xs text-gray-500 max-w-sm mt-1">
                  Click "Schedule New Task" to create a collection route for your field sanitation staff.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 uppercase tracking-wider text-[11px] border-b border-gray-200">
                      <th className="py-3 px-4 font-bold">Route Name</th>
                      <th className="py-3 px-4 font-bold">Location</th>
                      <th className="py-3 px-4 font-bold">Coordinates</th>
                      <th className="py-3 px-4 font-bold">Status</th>
                      <th className="py-3 px-4 font-bold">Weight Lifted</th>
                      <th className="py-3 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {tasks.map((task) => (
                      <tr key={task.id} className="hover:bg-gray-50 transition">
                        <td className="py-3.5 px-4 font-bold text-indigo-700">
                          {task.routeName || 'Standard Route'}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-gray-900">
                          {task.location}
                        </td>
                        <td className="py-3.5 px-4 text-gray-500 font-mono text-[11px]">
                          {task.lat.toFixed(4)}, {task.lng.toFixed(4)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold capitalize text-[11px] ${
                            task.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : task.status === 'in-progress'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-gray-800">
                          {task.weight ? `${task.weight} kg` : '—'}
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          {task.status !== 'completed' && (
                            <button
                              onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                              className="px-2.5 py-1 bg-green-50 hover:bg-green-100 text-green-700 font-bold rounded-lg transition"
                            >
                              Mark Done
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteTask(task.id, task.routeName || task.location)}
                            className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-lg transition"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: WORKFORCE MONITORING */}
      {!isLoading && activeTab === 'workforce' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Sanitation Field Workers Roster</h2>
                <p className="text-xs text-gray-500">Real-time attendance, route assignment, and health certification</p>
              </div>
              <span className="text-xs bg-teal-50 text-teal-700 font-bold px-3 py-1 rounded-full border border-teal-200">
                {workers.length} Active Staff
              </span>
            </div>

            {workers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Inbox className="w-12 h-12 text-gray-300 mb-2" />
                <p className="text-gray-700 font-bold text-sm">No Sanitation Workers Registered</p>
                <p className="text-xs text-gray-500 mt-1">Staff registration is managed through authentication.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {workers.map((worker) => (
                  <div key={worker.id} className="p-5 rounded-2xl border border-gray-200 shadow-sm bg-slate-50/50 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          {worker.workerId || 'WORKER'} • {worker.team || 'Municipal Squad'}
                        </span>
                        <h3 className="text-base font-bold text-gray-900 mt-1">{worker.fullName}</h3>
                        <p className="text-xs text-gray-500">{worker.mobile || 'No contact specified'}</p>
                      </div>
                      <span className="text-[11px] font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        ● Active Duty
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs bg-white p-3 rounded-xl border border-gray-100">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Assigned Zone:</span>
                        <span className="font-semibold text-gray-800">{worker.zone || 'Sector A'}</span>
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
                      <span className="text-gray-500">Joined: {worker.joinDate || '2023-01-10'}</span>
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
            )}
          </div>
        </div>
      )}

      {/* TAB 4: PHOTO AUDIT & WAGE INCENTIVE APPROVAL */}
      {!isLoading && activeTab === 'audit' && (
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

      {/* TAB 5: CITIZEN GRIEVANCES REDRESSAL */}
      {!isLoading && activeTab === 'grievances' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Citizen Cleanliness Grievance Redressal Desk</h2>
                <p className="text-xs text-gray-500">Live feed of public complaints, photo verification, worker assignment, and rapid team dispatch</p>
              </div>
              <span className="text-xs bg-red-50 text-red-700 font-bold px-3 py-1 rounded-full border border-red-200">
                {pendingReports} Action Items Pending
              </span>
            </div>

            {reports.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Inbox className="w-12 h-12 text-gray-300 mb-2" />
                <p className="text-gray-700 font-bold text-sm">No Citizen Grievances Logged</p>
                <p className="text-xs text-gray-500 mt-1">All sector waste complaints have been redressed.</p>
              </div>
            ) : (
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
                          {report.assignedToWorker && (
                            <span className="text-indigo-700 font-semibold">
                              <strong>Assigned Crew:</strong> {report.assignedToWorker}
                            </span>
                          )}
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
                        <div className="flex flex-col gap-2 min-w-[170px] self-stretch md:self-center">
                          <button
                            onClick={() => {
                              setAssignWorkerReport(report);
                              setSelectedWorkerForAssignment(report.assignedToWorkerId || '');
                            }}
                            className="py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center space-x-1"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>{report.assignedToWorker ? 'Reassign Worker' : 'Assign to Worker'}</span>
                          </button>

                          <button
                            onClick={() => handleDispatchTeam(report.id)}
                            className="py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
                          >
                            Dispatch Rapid Unit
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
            )}
          </div>
        </div>
      )}

      {/* CREATE COLLECTION TASK MODAL */}
      {showCreateTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Schedule Collection Task</h3>
                <p className="text-xs text-gray-500">Dispatch waste collection vehicle and assign field personnel</p>
              </div>
              <button
                onClick={() => setShowCreateTaskModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Route Identifier *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Route A-3: Market Complex Daily Collection"
                  value={newTaskForm.routeName}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, routeName: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Collection Location / Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Sector 4 Commercial Market & Resident Gate 2"
                  value={newTaskForm.location}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, location: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Sector Zone *</label>
                  <select
                    value={newTaskForm.zone}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, zone: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                  >
                    <option value="Sector A">Sector A</option>
                    <option value="Sector B">Sector B</option>
                    <option value="Sector C">Sector C</option>
                    <option value="Sector D">Sector D</option>
                    <option value="Sector E">Sector E</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Scheduled Date *</label>
                  <input
                    type="date"
                    required
                    value={newTaskForm.scheduledDate}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, scheduledDate: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newTaskForm.lat}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, lat: parseFloat(e.target.value) || 28.5494 })}
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newTaskForm.lng}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, lng: parseFloat(e.target.value) || 77.2066 })}
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Assign to Sanitation Worker (Optional)</label>
                <select
                  value={newTaskForm.assignedWorkerId}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, assignedWorkerId: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">-- Unassigned / Pool Task --</option>
                  {workers.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.fullName} ({w.workerId || 'Worker'} - {w.zone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCreateTaskModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingTask}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow transition flex items-center space-x-1.5 disabled:opacity-50"
                >
                  {isSubmittingTask ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create & Schedule</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN GRIEVANCE WORKER MODAL */}
      {assignWorkerReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Assign Grievance to Worker</h3>
                <p className="text-xs text-gray-500">Complaint {assignWorkerReport.id}: {assignWorkerReport.location}</p>
              </div>
              <button
                onClick={() => setAssignWorkerReport(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <label className="block font-bold text-gray-700">Select Field Worker</label>
              <select
                value={selectedWorkerForAssignment}
                onChange={(e) => setSelectedWorkerForAssignment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="">-- Choose registered worker --</option>
                {workers.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.fullName} • {w.workerId || 'Worker'} • {w.zone}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setAssignWorkerReport(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAssignWorkerToComplaint}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow transition"
                >
                  Confirm Assignment
                </button>
              </div>
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
              Provide the municipal resolution note. An automated notification with proof of sanitation will be recorded.
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
                  Before Collection (Field Photo)
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
