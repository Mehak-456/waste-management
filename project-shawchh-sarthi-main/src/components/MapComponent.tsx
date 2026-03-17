import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Task } from '../types';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
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
    if (!mapRef.current) {
      // Initialize map
      mapRef.current = L.map('map').setView([28.5494, 77.2066], 14);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);
    }

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => {
      mapRef.current?.removeLayer(marker);
    });
    markersRef.current = {};

    // Add markers for each task
    tasks.forEach(task => {
      const icon = L.divIcon({
        html: `
          <div class="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold ${
            task.status === 'completed' 
              ? 'bg-green-500' 
              : task.id === selectedTaskId 
                ? 'bg-blue-500' 
                : 'bg-red-500'
          }">
            ${task.status === 'completed' ? '✓' : '!'}
          </div>
        `,
        className: 'custom-div-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([task.lat, task.lng], { icon })
        .addTo(mapRef.current!)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-semibold text-sm">${task.location}</h3>
            <p class="text-xs text-gray-600">Status: ${task.status}</p>
            ${task.weight ? `<p class="text-xs text-gray-600">Weight: ${task.weight}kg</p>` : ''}
          </div>
        `)
        .on('click', () => {
          onTaskSelect(task.id);
        });

      markersRef.current[task.id] = marker;
    });

    // Fit map to show all markers
    if (tasks.length > 0) {
      const group = new L.FeatureGroup(Object.values(markersRef.current));
      mapRef.current.fitBounds(group.getBounds().pad(0.1));
    }

  }, [tasks, selectedTaskId, onTaskSelect]);

  return (
    <div 
      id="map" 
      className="w-full h-64 sm:h-80 lg:h-96 rounded-lg shadow-lg border border-gray-200"
      style={{ minHeight: '300px' }}
    />
  );
};

export default MapComponent;