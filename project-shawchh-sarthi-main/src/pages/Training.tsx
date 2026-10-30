import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTrainingResources, createTrainingResource, deleteTrainingResource } from '../services/trainingService';
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
  Plus,
  Trash2,
  Loader2,
  Inbox,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

const Training: React.FC = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<TrainingVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<TrainingVideo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Safety',
    url: '',
    duration: '',
    thumbnail: '',
  });

  const loadVideos = async () => {
    setIsLoading(true);
    try {
      const { data } = await getTrainingResources();
      setVideos(data);
    } catch (err) {
      console.error('Error fetching training resources:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.url || !form.duration) {
      showAlert('error', 'Please fill in all required training fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createTrainingResource({
        title: form.title,
        description: form.description,
        category: form.category as TrainingVideo['category'],
        url: form.url,
        duration: form.duration,
        thumbnail: form.thumbnail || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
      });

      if (res.success && res.data) {
        setVideos(prev => [res.data!, ...prev]);
        setIsPublishModalOpen(false);
        setForm({ title: '', description: '', category: 'Safety', url: '', duration: '', thumbnail: '' });
        showAlert('success', 'Training module published successfully to the workforce library!');
      } else {
        showAlert('error', res.error || 'Failed to create training resource.');
      }
    } catch (err: unknown) {
      showAlert('error', (err as Error)?.message || 'Unexpected error creating training module.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteResource = async (e: React.MouseEvent, videoId: string, title: string) => {
    e.stopPropagation();
    const confirmed = window.confirm(`Are you sure you want to delete the training resource "${title}"?`);
    if (!confirmed) return;

    try {
      const res = await deleteTrainingResource(videoId);
      if (res.success) {
        setVideos(prev => prev.filter(v => v.id !== videoId));
        showAlert('success', 'Training resource removed.');
      } else {
        showAlert('error', res.error || 'Failed to delete resource.');
      }
    } catch (err: unknown) {
      showAlert('error', (err as Error)?.message || 'Error deleting training module.');
    }
  };

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
      ? videos
      : videos.filter((video) => video.category === selectedCategory);

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
      {/* Alert Notification */}
      {alert && (
        <div className={`p-4 rounded-xl flex items-center space-x-3 text-sm font-semibold shadow-sm transition-all ${
          alert.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {alert.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
          ) : (
            <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          )}
          <span>{alert.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-600 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Training & Sanitation Safety</h1>
            <p className="text-green-100 mt-1">
              Field standard operating procedures, safety guidelines, and efficiency certifications
            </p>
          </div>

          <div className="flex items-center gap-3">
            {user?.role === 'authority' && (
              <button
                onClick={() => setIsPublishModalOpen(true)}
                className="flex items-center space-x-2 bg-white text-indigo-700 hover:bg-slate-50 font-bold px-4 py-2.5 rounded-xl shadow transition"
              >
                <Plus className="h-4 w-4" />
                <span>Publish Training Module</span>
              </button>
            )}

            <div className="hidden sm:block">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-3 rounded-xl text-center border border-white/20">
                <p className="text-xs text-green-100 font-semibold uppercase tracking-wider">Active Modules</p>
                <p className="text-2xl font-black">{videos.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Training Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedCategory(id)}
              className={`flex items-center space-x-3 p-4 rounded-xl border transition-all duration-200 ${
                selectedCategory === id
                  ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white border-transparent shadow-md'
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Curriculum Video Library</h2>
            <p className="text-sm text-gray-500 mt-1">
              {selectedCategory === 'all'
                ? 'All published municipal training modules'
                : `${selectedCategory} category modules`}
            </p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded-full">
            {filteredVideos.length} Available
          </span>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-green-600" />
              <p className="text-gray-500 text-sm">Loading training library...</p>
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Inbox className="w-12 h-12 text-gray-300 mb-2" />
              <p className="text-gray-700 font-bold text-sm">No Training Modules Found</p>
              <p className="text-xs text-gray-500 mt-1 max-w-sm">
                No video modules are currently published under this category.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  className="group cursor-pointer bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-green-300 relative flex flex-col justify-between"
                  onClick={() => handleVideoClick(video)}
                >
                  <div>
                    {/* Video Thumbnail */}
                    <div className="relative">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-35 flex items-center justify-center group-hover:bg-opacity-25 transition-all duration-300">
                        <div className="bg-white/90 p-3 rounded-full group-hover:scale-110 transition-transform shadow-md">
                          <Play className="h-6 w-6 text-green-600" />
                        </div>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 text-gray-800 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">
                          {video.category}
                        </span>
                      </div>

                      {/* Duration */}
                      <div className="absolute bottom-3 right-3">
                        <div className="bg-black/80 text-white px-2 py-0.5 rounded text-xs flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{video.duration}</span>
                        </div>
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 group-hover:text-green-700 transition-colors duration-200 line-clamp-1">
                        {video.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
                        {video.description}
                      </p>
                    </div>
                  </div>

                  {/* Authority Management Action */}
                  {user?.role === 'authority' && (
                    <div className="p-3 bg-white border-t border-gray-100 flex justify-end">
                      <button
                        onClick={(e) => handleDeleteResource(e, video.id, video.title)}
                        className="flex items-center space-x-1 text-xs text-red-600 hover:text-red-800 font-semibold px-2 py-1 rounded hover:bg-red-50 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
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

      {/* Authority: Publish Resource Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Publish Field Training Module</h3>
                <p className="text-xs text-gray-500">Official Municipal Solid Waste Management Curriculum</p>
              </div>
              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateResource} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Module Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Safe Handling of Bio-medical & Sharp Waste"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                  >
                    <option value="Safety">Safety</option>
                    <option value="Efficiency">Efficiency</option>
                    <option value="Emergency">Emergency</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Duration *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 14:20"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Video Stream URL (YouTube or MP4) *</label>
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Thumbnail Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={form.thumbnail}
                  onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description & Learning Outcomes</label>
                <textarea
                  rows={3}
                  placeholder="Summary of safety protocols, PPE requirements, and procedure demonstrated in this module."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow transition flex items-center space-x-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <span>Publish Module</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Training;
