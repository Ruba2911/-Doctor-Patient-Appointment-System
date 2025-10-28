import { Calendar, Clock, XCircle, CheckCircle2 } from 'lucide-react';
import { useAppointments } from '../context/AppointmentContext';
import { useState } from 'react';

export default function Appointments() {
  const { getUpcomingAppointments, getPastAppointments, cancelAppointment, fetchAppointments } = useAppointments();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const upcomingAppointments = getUpcomingAppointments();
  const pastAppointments = getPastAppointments();

  const handleCancel = async (id: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await cancelAppointment(id);
        // Refresh appointments from backend after cancellation
        await fetchAppointments();
      } catch {
        alert('Failed to cancel appointment. Please try again.');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">My Appointments</h1>
          <p className="text-blue-100 text-lg">Manage and view all your healthcare appointments</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 py-4 px-6 font-medium transition-all ${
                activeTab === 'upcoming'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Upcoming ({upcomingAppointments.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 py-4 px-6 font-medium transition-all ${
                activeTab === 'past'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Past & Cancelled ({pastAppointments.length})
            </button>
          </div>
        </div>

        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            {upcomingAppointments.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Upcoming Appointments</h3>
                <p className="text-gray-600">You don't have any scheduled appointments at the moment.</p>
              </div>
            ) : (
              upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <img
                        src={appointment.doctorImage}
                        alt={appointment.doctorName}
                        className="w-full lg:w-32 h-48 lg:h-32 object-cover rounded-xl shadow-md"
                      />

                      <div className="flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {appointment.doctorName}
                            </h3>
                            <p className="text-blue-600 font-medium">{appointment.doctorSpecialty}</p>
                          </div>
                          <span
                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                              appointment.status
                            )}`}
                          >
                            {getStatusIcon(appointment.status)}
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-3 text-gray-700">
                            <div className="bg-blue-50 p-2 rounded-lg">
                              <Calendar className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Date</p>
                              <p className="font-semibold">
                                {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-gray-700">
                            <div className="bg-blue-50 p-2 rounded-lg">
                              <Clock className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Time</p>
                              <p className="font-semibold">{appointment.appointmentTime}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 mb-4">
                          <p className="text-sm text-gray-600 mb-1">Reason for Visit</p>
                          <p className="font-medium text-gray-900">{appointment.reason}</p>
                        </div>

                        {appointment.status === 'scheduled' && (
                          <button
                            onClick={() => handleCancel(appointment.id)}
                            className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-medium transition-all"
                          >
                            Cancel Appointment
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'past' && (
          <div className="space-y-4">
            {pastAppointments.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Past Appointments</h3>
                <p className="text-gray-600">Your appointment history will appear here.</p>
              </div>
            ) : (
              pastAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden opacity-75"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <img
                        src={appointment.doctorImage}
                        alt={appointment.doctorName}
                        className="w-full lg:w-32 h-48 lg:h-32 object-cover rounded-xl shadow-md grayscale"
                      />

                      <div className="flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {appointment.doctorName}
                            </h3>
                            <p className="text-blue-600 font-medium">{appointment.doctorSpecialty}</p>
                          </div>
                          <span
                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                              appointment.status
                            )}`}
                          >
                            {getStatusIcon(appointment.status)}
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-3 text-gray-700">
                            <div className="bg-gray-100 p-2 rounded-lg">
                              <Calendar className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Date</p>
                              <p className="font-semibold">
                                {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-gray-700">
                            <div className="bg-gray-100 p-2 rounded-lg">
                              <Clock className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Time</p>
                              <p className="font-semibold">{appointment.appointmentTime}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-sm text-gray-600 mb-1">Reason for Visit</p>
                          <p className="font-medium text-gray-900">{appointment.reason}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
