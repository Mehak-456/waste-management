import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTasksForUser, updateTaskStatus } from '../data/mockData';
import { Task } from '../types';
import MapComponent from '../components/MapComponent';
import { 
  MapPin, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Award,
  Target,
  Users,
  Zap
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const loadTasks = () => {
      const userTasks = getTasksForUser();
      setTasks(userTasks);
    };

    loadTasks();
  }, []);

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const totalWeight = tasks.reduce((sum, task) => sum + (task.weight || 0), 0);

  // ------------------ Camera + GPS + Proof Capture ------------------
  const handleCaptureAndComplete = async (taskId: string, step: "before" | "after") => {
    setLoading(prev => ({ ...prev, [taskId]: true }));

    try {
      // 1. Ask for camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      await video.play();

      // 2. Draw current frame
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 3. Get GPS location
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        const timestamp = new Date().toLocaleString();

        // Overlay text on the image
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText(`Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`, 20, canvas.height - 40);
        ctx.fillText(`Time: ${timestamp}`, 20, canvas.height - 15);

        // 4. Convert to base64 image
        const proofImage = canvas.toDataURL("image/png");

        // Stop camera
        stream.getTracks().forEach(track => track.stop());

        if (step === "before") {
          // First capture
          updateTaskStatus(taskId, "in-progress", undefined, proofImage);
          setTasks(prev =>
            prev.map(task =>
              task.id === taskId
                ? { ...task, status: "in-progress", proofBefore: proofImage }
                : task
            )
          );
        } else {
          // Final capture
          const weight = Math.floor(Math.random() * 30) + 10;
          updateTaskStatus(taskId, "completed", weight, undefined, proofImage);
          setTasks(prev =>
            prev.map(task =>
              task.id === taskId
                ? { ...task, status: "completed", weight, proofAfter: proofImage }
                : task
            )
          );
        }

        setLoading(prev => ({ ...prev, [taskId]: false }));
      });
    } catch (err) {
      console.error("Camera/Location error:", err);
      alert("Please allow camera & location access to complete task.");
      setLoading(prev => ({ ...prev, [taskId]: false }));
    }
  };
  // ------------------------------------------------------------------

  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Hello, {user.fullName}!</h1>
            <p className="text-green-100 mt-1">Ready to make a difference today?</p>
            <div className="flex items-center space-x-4 mt-4">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-yellow-300" />
                <span className="text-sm">150 Green Coins</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-200" />
                <span className="text-sm">Level 3</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="bg-white bg-opacity-20 p-4 rounded-xl text-center">
              <p className="text-sm text-green-100">This Week</p>
              <p className="text-2xl font-bold">+25 Coins</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-lg font-bold text-gray-900">{completedTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Remaining</p>
              <p className="text-lg font-bold text-gray-900">{totalTasks - completedTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Target className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Progress</p>
              <p className="text-lg font-bold text-gray-900">{completionPercentage}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Zap className="h-5 w-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Weight</p>
              <p className="text-lg font-bold text-gray-900">{totalWeight}kg</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Route Map */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Today's Route</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                <span>Route 1: Sector A Collection</span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{completedTasks} of {totalTasks} completed</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <MapComponent
              tasks={tasks}
              onTaskSelect={handleTaskSelect}
              selectedTaskId={selectedTaskId}
            />
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Collection Points</h2>
            <p className="text-sm text-gray-500 mt-1">Tap to view on map, complete tasks to earn rewards</p>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {tasks.map((task) => (
              <div 
                key={task.id}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedTaskId === task.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
                onClick={() => handleTaskSelect(task.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{task.location}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        task.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : task.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {task.status === 'completed'
                          ? 'Completed'
                          : task.status === 'in-progress'
                          ? 'In Progress'
                          : 'Pending'}
                      </span>
                      {task.weight && task.weight > 0 && (
                        <span className="text-xs text-gray-500">{task.weight}kg collected</span>
                      )}
                    </div>

                    {/* Show proof images */}
                    <div className="flex space-x-2 mt-2">
                      {task.proofBefore && (
                        <img src={task.proofBefore} alt="Before" className="rounded-lg w-32 border" />
                      )}
                      {task.proofAfter && (
                        <img src={task.proofAfter} alt="After" className="rounded-lg w-32 border" />
                      )}
                    </div>
                  </div>

                  <div className="ml-4">
                    {task.status === 'pending' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCaptureAndComplete(task.id, "before");
                        }}
                        disabled={loading[task.id]}
                        className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-green-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {loading[task.id] ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                        <span>{loading[task.id] ? 'Capturing...' : 'Capture Before'}</span>
                      </button>
                    )}

                    {task.status === 'in-progress' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCaptureAndComplete(task.id, "after");
                        }}
                        disabled={loading[task.id]}
                        className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {loading[task.id] ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                        <span>{loading[task.id] ? 'Completing...' : 'Capture After'}</span>
                      </button>
                    )}
                    
                    {task.status === 'completed' && (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">Done</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievement Section */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">Weekly Target</h3>
              <p className="text-sm text-green-100">Complete 100 collections</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>87/100</span>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
              <div className="bg-white h-2 rounded-full" style={{ width: '87%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">Team Ranking</h3>
              <p className="text-sm text-purple-100">You're #2 in Team Alpha</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold">1,320 <span className="text-sm font-normal">points</span></p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-xl p-6 text-white sm:col-span-2 lg:col-span-1">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">This Month</h3>
              <p className="text-sm text-orange-100">Total waste collected</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold">2.4 <span className="text-sm font-normal">tons</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
