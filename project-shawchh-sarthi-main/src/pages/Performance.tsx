import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { mockPerformanceData, mockLeaderboard } from '../data/mockData';
import { Trophy, TrendingUp, Target, Award, Calendar, Weight, Recycle, Star } from 'lucide-react';

const Performance: React.FC = () => {
  const totalCollections = mockPerformanceData.reduce((sum, day) => sum + day.collections, 0);
  const totalWeight = mockPerformanceData.reduce((sum, day) => sum + day.weight, 0);
  const avgCollections = Math.round(totalCollections / mockPerformanceData.length);
  const avgWeight = Math.round(totalWeight / mockPerformanceData.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Performance & Incentives</h1>
            <p className="text-green-100 mt-1">Track your progress and earn rewards</p>
          </div>
          <div className="hidden sm:block">
            <div className="bg-white bg-opacity-20 p-4 rounded-xl text-center">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-300" />
              <p className="text-sm text-green-100">Current Rank</p>
              <p className="text-xl font-bold">#2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <Recycle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Collections</p>
              <p className="text-2xl font-bold text-gray-900">{totalCollections}</p>
              <p className="text-xs text-green-600 mt-1">+15% from last week</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Weight className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Weight</p>
              <p className="text-2xl font-bold text-gray-900">{totalWeight}kg</p>
              <p className="text-xs text-blue-600 mt-1">+8% from last week</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Daily Average</p>
              <p className="text-2xl font-bold text-gray-900">{avgCollections}</p>
              <p className="text-xs text-purple-600 mt-1">Collections per day</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-full">
              <Award className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Green Coins</p>
              <p className="text-2xl font-bold text-gray-900">1,320</p>
              <p className="text-xs text-orange-600 mt-1">+25 this week</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Performance Chart */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Weekly Collections</h2>
                <p className="text-sm text-gray-500 mt-1">Daily collection performance</p>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-500">Last 7 days</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="day" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="collections" 
                  fill="url(#gradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weight Collected Chart */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Weight Collected</h2>
                <p className="text-sm text-gray-500 mt-1">Daily weight in kilograms</p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Weight className="h-5 w-5" />
                <span>Total: {totalWeight}kg</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="day" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="url(#weightGradient)"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, fill: '#3b82f6' }}
                />
                <defs>
                  <linearGradient id="weightGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Leaderboard */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-100 p-2 rounded-full">
                <Trophy className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Team Leaderboard</h2>
                <p className="text-sm text-gray-500">Top performers this month</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {mockLeaderboard.map((entry, index) => (
                <div 
                  key={entry.rank}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                    index === 1 
                      ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                      entry.rank === 1 
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                        : entry.rank === 2
                          ? 'bg-gradient-to-r from-gray-400 to-gray-600'
                          : 'bg-gradient-to-r from-orange-400 to-red-500'
                    }`}>
                      {entry.rank}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900">{entry.name}</h3>
                      <p className="text-sm text-gray-500">{entry.collections} collections</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-bold text-gray-900">{entry.points}</span>
                    </div>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Incentive Tracking */}
        <div className="space-y-6">
          {/* Monthly Target */}
          <div className="bg-gradient-to-br from-green-400 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-white bg-opacity-20 p-2 rounded-full">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">Monthly Target</h3>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Collections</span>
                  <span>87/100</span>
                </div>
                <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full" style={{ width: '87%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Weight Target</span>
                  <span>680/800 kg</span>
                </div>
                <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white border-opacity-20">
              <p className="text-sm text-green-100">Reward Progress</p>
              <p className="text-lg font-bold">₹1,200 earned this month</p>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-purple-100 p-2 rounded-full">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900">Recent Achievements</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <Trophy className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-gray-900">Waste Warrior</p>
                  <p className="text-sm text-gray-500">Collected 50+ items</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Star className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Consistency King</p>
                  <p className="text-sm text-gray-500">7 days streak</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Award className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Team Player</p>
                  <p className="text-sm text-gray-500">Top 3 in team</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;