import { useState, useMemo } from 'react';
import { Search, Star, DollarSign, Briefcase, Calendar } from 'lucide-react';
import { doctors, specialties } from '../data/mockData';
import { Doctor } from '../types';

interface DoctorListProps {
  selectedSpecialtyId?: string;
  onBookAppointment: (doctor: Doctor) => void;
}

export default function DoctorList({ selectedSpecialtyId, onBookAppointment }: DoctorListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(selectedSpecialtyId || 'all');
  const [sortBy, setSortBy] = useState<'rating' | 'fee' | 'experience'>('rating');

  const filteredAndSortedDoctors = useMemo(() => {
    let filtered = doctors.filter((doctor) => {
      const matchesSearch =
        doctor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.bio.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSpecialty =
        selectedSpecialty === 'all' || doctor.specialtyId === selectedSpecialty;

      return matchesSearch && matchesSpecialty;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'fee':
          return a.consultationFee - b.consultationFee;
        case 'experience':
          return b.experienceYears - a.experienceYears;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedSpecialty, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Find Your Doctor</h1>
          <p className="text-blue-100 text-lg">Browse our network of experienced healthcare professionals</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctors by name, specialty, or expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="all">All Specialties</option>
              {specialties.map((specialty) => (
                <option key={specialty.id} value={specialty.id}>
                  {specialty.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setSortBy('rating')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sortBy === 'rating'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Highest Rated
            </button>
            <button
              onClick={() => setSortBy('fee')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sortBy === 'fee'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Lowest Fee
            </button>
            <button
              onClick={() => setSortBy('experience')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sortBy === 'experience'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Most Experienced
            </button>
          </div>
        </div>

        {filteredAndSortedDoctors.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <p className="text-gray-500 text-lg">No doctors found matching your criteria</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredAndSortedDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex gap-4 mb-4">
                    <img
                      src={doctor.imageUrl}
                      alt={doctor.fullName}
                      className="w-24 h-24 rounded-2xl object-cover shadow-md"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.fullName}</h3>
                      <p className="text-blue-600 font-medium mb-2">{doctor.specialty}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold text-gray-900">{doctor.rating}</span>
                        <span className="text-sm text-gray-500">/5.0</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                    {doctor.bio}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase className="w-4 h-4" />
                      <span>{doctor.experienceYears} years exp.</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span>${doctor.consultationFee}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {doctor.availableDays.slice(0, 3).map((day, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-lg font-medium"
                      >
                        {day}
                      </span>
                    ))}
                    {doctor.availableDays.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-lg font-medium">
                        +{doctor.availableDays.length - 3} more
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onBookAppointment(doctor)}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40"
                  >
                    <Calendar className="w-5 h-5" />
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
