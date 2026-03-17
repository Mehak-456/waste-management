import React, { useState } from 'react';
import { mockTrainingVideos } from '../data/mockData';
import { TrainingVideo } from '../types';
import {
  Play,
  Clock,
  BookOpen,
  Shield,
  AlertTriangle,
  CheckCircle,
  X,
  Zap,
  Users,
  FileText,
} from 'lucide-react';

const Training: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<TrainingVideo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Videos', icon: BookOpen },
    { id: 'Safety', label: 'Safety', icon: Shield },
    { id: 'Efficiency', label: 'Efficiency', icon: Zap },
    { id: 'Emergency', label: 'Emergency', icon: AlertTriangle },
  ];

  const safetyGuidelines = [
    {
      title: 'Personal Protective Equipment',
      description: 'Always wear gloves, safety vest, and appropriate footwear',
      icon: Shield,
    },
    {
      title: 'Proper Lifting Techniques',
      description: 'Bend your knees, keep your back straight, and lift with your legs',
      icon: Users,
    },
    {
      title: 'Chemical Handling',
      description: 'Never mix chemicals and always read labels before handling',
      icon: AlertTriangle,
    },
    {
      title: 'Emergency Procedures',
      description: 'Know the location of emergency exits and first aid stations',
      icon: CheckCircle,
    },
    {
      title: 'Vehicle Safety',
      description: 'Perform daily vehicle inspections and follow traffic rules',
      icon: Zap,
    },
    {
      title: 'Communication Protocol',
      description: 'Report incidents immediately and maintain radio contact',
      icon: FileText,
    },
  ];

  const filteredVideos =
    selectedCategory === 'all'
      ? mockTrainingVideos
      : mockTrainingVideos.filter((video) => video.category === selectedCategory);

  const handleVideoClick = (video: TrainingVideo) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Training & Resources</h1>
            <p className="text-green-100 mt-1">
              Enhance your skills and stay safe on the job
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="bg-white bg-opacity-20 p-4 rounded-xl text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-green-200" />
              <p className="text-sm text-green-100">Modules</p>
              <p className="text-xl font-bold">{mockTrainingVideos.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Training Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedCategory(id)}
              className={`flex items-center space-x-3 p-4 rounded-xl border transition-all duration-200 ${
                selectedCategory === id
                  ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white border-transparent shadow-lg'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium text-sm">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Training Videos */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Training Videos</h2>
          <p className="text-sm text-gray-500 mt-1">
            {selectedCategory === 'all'
              ? 'All available training modules'
              : `${selectedCategory} training modules`}
          </p>
        </div>

        <div className="p-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="group cursor-pointer bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-green-200"
                onClick={() => handleVideoClick(video)}
              >
                {/* Video Thumbnail */}
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-30 transition-all duration-300">
                    <div className="bg-white bg-opacity-90 p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
                      <Play className="h-6 w-6 text-green-600" />
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-white bg-opacity-90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                      {video.category}
                    </span>
                  </div>

                  {/* Duration */}
                  <div className="absolute bottom-3 right-3">
                    <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{video.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-200">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {video.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Safety Guidelines */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-full">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Safety Guidelines</h2>
              <p className="text-sm text-gray-500">
                Essential safety rules for waste collection workers
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {safetyGuidelines.map((guideline, index) => {
              const Icon = guideline.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-r from-green-100 to-blue-100 p-3 rounded-full flex-shrink-0">
                      <Icon className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {guideline.title}
                      </h3>
                      <p className="text-sm text-gray-600">{guideline.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isModalOpen && selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedVideo.title}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Actual Video Player */}
            <div className="p-6">
              <div className="rounded-xl overflow-hidden aspect-video mb-6">
                <iframe
                  className="w-full h-full"
                  src={selectedVideo.url.replace('watch?v=', 'embed/')}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Video Description */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">About this video</h4>
                  <p className="text-gray-600">{selectedVideo.description}</p>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{selectedVideo.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{selectedVideo.category}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Training;
