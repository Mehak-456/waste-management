import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Task } from '../types';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapComponentProps {
  tasks: Task[];
  onTaskSelect: (taskId: string) => void;
  selectedTaskId: string | null;
}

const MapComponent: React.FC<MapComponentProps> = ({ tasks, onTaskSelect, selectedTaskId }) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  useEffect(() => {
    const container = document.getElementById('map');
    if (container && !mapRef.current) {
      // Initialize map with default center (New Delhi / Municipal HQ)
      mapRef.current = L.map('map').setView([28.5494, 77.2066], 13);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(mapRef.current);
    }

    if (!mapRef.current) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => {
      mapRef.current?.removeLayer(marker);
    });
    markersRef.current = {};

    // Safely filter tasks with valid geographic coordinates
    const validTasks = tasks.filter(task => 
      task &&
      typeof task.lat === 'number' &&
      typeof task.lng === 'number' &&
      !isNaN(task.lat) &&
      !isNaN(task.lng) &&
      task.lat >= -90 && task.lat <= 90 &&
      task.lng >= -180 && task.lng <= 180
    );

    // Add markers for each valid task
    validTasks.forEach(task => {
      const isSelected = task.id === selectedTaskId;
      const isCompleted = task.status === 'completed';

      const icon = L.divIcon({
        html: `
          <div class="w-7 h-7 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-bold transition-transform hover:scale-110 ${
            isCompleted 
              ? 'bg-green-600' 
              : isSelected 
                ? 'bg-indigo-600 ring-2 ring-indigo-300' 
                : 'bg-red-500'
          }">
            ${isCompleted ? '✓' : '!'}
          </div>
        `,
        className: 'custom-div-icon',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([task.lat, task.lng], { icon })
        .addTo(mapRef.current!)
        .bindPopup(`
          <div style="font-family: sans-serif; min-width: 160px; padding: 2px;">
            <p style="font-size: 10px; font-weight: bold; color: #6366f1; text-transform: uppercase; margin: 0 0 2px 0;">
              ${task.routeName || 'Collection Route'}
            </p>
            <h4 style="font-size: 13px; font-weight: 700; color: #111827; margin: 0 0 4px 0;">
              ${task.location}
            </h4>
            <div style="font-size: 11px; color: #4b5563; margin-bottom: 4px;">
              <span>Status: <strong style="color: ${isCompleted ? '#16a34a' : '#dc2626'}; text-transform: capitalize;">${task.status}</strong></span>
              ${task.weight ? `<br /><span>Weight: <strong>${task.weight} kg</strong></span>` : ''}
            </div>
            <p style="font-size: 10px; color: #9ca3af; margin: 0;">
              Click to select stop
            </p>
          </div>
        `)
        .on('click', () => {
          onTaskSelect(task.id);
        });

      markersRef.current[task.id] = marker;
    });

    // Safely fit map to show all markers if any exist
    const markerList = Object.values(markersRef.current);
    if (markerList.length > 0) {
      try {
        const group = new L.FeatureGroup(markerList);
        mapRef.current.fitBounds(group.getBounds().pad(0.15));
      } catch (err) {
        console.warn('[MapComponent] Could not fit bounds:', err);
      }
    }

    return () => {
      // Keep map instance alive or clean markers
    };
  }, [tasks, selectedTaskId, onTaskSelect]);

  return (
    <div className="relative">
      <div 
        id="map" 
        className="w-full h-64 sm:h-80 lg:h-96 rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
        style={{ minHeight: '300px' }}
      />
      <div className="absolute bottom-2 left-2 z-[400] bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-gray-200 text-[10px] text-gray-600 flex items-center space-x-2 shadow-sm pointer-events-none">
        <span className="inline-block w-2 h-2 rounded-full bg-indigo-500"></span>
        <span>Stored Geo-Coordinates (Location-Based Route Mapping)</span>
      </div>
    </div>
  );
};

export default MapComponent;