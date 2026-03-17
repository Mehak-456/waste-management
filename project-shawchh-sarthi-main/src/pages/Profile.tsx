import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  MapPin, 
  Calendar, 
  Phone, 
  Shield, 
  Award, 
  Heart,
  Edit3,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Activity
} from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  if (!user) return null;

  const handleEdit = () => {
    setEditedUser(user);
    setIsEditing(true);
  };

  const handleSave = () => {
    // In a real app, this would update the user in the database
    setIsEditing(false);
    // You would call an update function here
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'Good':
        return 'text-green-600 bg-green-100';
      case 'Needs Follow-up':
        return 'text-yellow-600 bg-yellow-100';
      case 'Critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const healthTips = [
    "Stay hydrated throughout your shift - carry a water bottle",
    "Use proper lifting techniques to protect your back",
    "Take regular breaks to prevent fatigue",
    "Ensure all safety equipment is worn correctly",
    "Report any health concerns immediately to your supervisor"
  ];

  const achievements = [
    { id: 1, title: 'Waste Warrior', description: 'Completed 100+ collections', icon: Award, color: 'text-yellow-600' },
    { id: 2, title: 'Safety First', description: 'Zero incidents for 6 months', icon: Shield, color: 'text-green-600' },
    { id: 3, title: 'Team Player', description: 'Top performer in team', icon: User, color: 'text-blue-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">My Profile</h1>
            <p className="text-green-100 mt-1">Manage your personal information and track your progress</p>
          </div>
          <div className="hidden sm:block">
            <div className="bg-white bg-opacity-20 p-4 rounded-xl text-center">
              <User className="h-8 w-8 mx-auto mb-2 text-green-200" />
              <p className="text-sm text-green-100">Worker ID</p>
              <p className="text-xl font-bold">{user.workerId}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                  <span className="text-sm font-medium">Edit</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span className="text-sm">Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span className="text-sm">Cancel</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser?.fullName || ''}
                    onChange={(e) => setEditedUser(prev => prev ? {...prev, fullName: e.target.value} : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <User className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">{user.fullName}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Worker ID
                </label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900 font-mono">{user.workerId}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedUser?.mobile || ''}
                    onChange={(e) => setEditedUser(prev => prev ? {...prev, mobile: e.target.value} : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">{user.mobile}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Join Date
                </label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{new Date(user.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Work Details */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Details</h3>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Assignment
                  </label>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-900 font-medium">{user.team}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned Zone
                  </label>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <span className="text-gray-900 font-medium">{user.zone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Health Status & Achievements */}
        <div className="space-y-6">
          {/* Health Status */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Health Status</h2>
                  <p className="text-sm text-gray-500">Your health and safety information</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Check-up Date
                </label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{new Date(user.lastCheckup).toLocaleDateString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Condition
                </label>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getHealthStatusColor(user.healthStatus)}`}>
                    {user.healthStatus === 'Good' ? (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <AlertCircle className="h-4 w-4 mr-1" />
                    )}
                    {user.healthStatus}
                  </span>
                </div>
              </div>

              {/* Daily Health Tip */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-1 rounded-full flex-shrink-0">
                    <Activity className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-900 mb-1">Today's Safety Tip</h4>
                    <p className="text-sm text-green-700">
                      {healthTips[Math.floor(Math.random() * healthTips.length)]}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Award className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Achievements</h2>
                  <p className="text-sm text-gray-500">Your earned badges and milestones</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className={`p-2 rounded-full bg-opacity-20 ${achievement.color.replace('text-', 'bg-')}`}>
                      <achievement.icon className={`h-5 w-5 ${achievement.color}`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                      <p className="text-sm text-gray-500">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Total Achievements</span>
                  <span className="font-semibold">{achievements.length}/10</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full" 
                    style={{ width: `${(achievements.length / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;