import { Calendar, Users, Clock, Shield, ArrowRight, Star } from 'lucide-react';
import { specialties } from '../data/mockData';
import { useAppointments } from '../context/AppointmentContext';

interface HomeProps {
  onViewChange: (view: string) => void;
  onSpecialtySelect: (specialtyId: string) => void;
}

export default function Home({ onViewChange, onSpecialtySelect }: HomeProps) {
  const { getUpcomingAppointments } = useAppointments();
  const upcomingAppointments = getUpcomingAppointments();

  const features = [
    {
      icon: Users,
      title: 'Expert Doctors',
      description: 'Access to highly qualified medical professionals'
    },
    {
      icon: Calendar,
      title: 'Easy Booking',
      description: 'Schedule appointments with just a few clicks'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock assistance for your healthcare needs'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your health data is always protected and confidential'
    }
  ];

  const iconMap: Record<string, any> = {
    heart: '❤️',
    sparkles: '✨',
    baby: '👶',
    bone: '🦴',
    brain: '🧠',
    stethoscope: '🩺'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Your Health,
              <span className="block bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                Our Priority
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Book appointments with top healthcare professionals. Get expert medical care when you need it most.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => onViewChange('doctors')}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/30"
              >
                Find a Doctor
                <ArrowRight className="w-5 h-5" />
              </button>
              {upcomingAppointments.length > 0 && (
                <button
                  onClick={() => onViewChange('appointments')}
                  className="bg-white text-gray-900 px-8 py-4 rounded-xl font-medium hover:bg-gray-50 transition-all border-2 border-gray-200"
                >
                  View Appointments
                </button>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 shadow-2xl">
              <img
                src="https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Healthcare Professional"
                className="rounded-2xl w-full h-auto shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <Star className="w-8 h-8 text-green-600 fill-green-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">4.9</p>
                    <p className="text-sm text-gray-600">Average Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
            >
              <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Browse by Specialty</h2>
            <p className="text-xl text-gray-600">Find the right specialist for your health needs</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialties.map((specialty) => (
              <button
                key={specialty.id}
                onClick={() => {
                  onSpecialtySelect(specialty.id);
                  onViewChange('doctors');
                }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 text-left group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {iconMap[specialty.icon]}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {specialty.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{specialty.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
