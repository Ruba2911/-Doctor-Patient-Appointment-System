import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppointmentProvider } from './context/AppointmentContext';
import AuthForm from './components/AuthForm';
import Header from './components/Header';
import Home from './components/Home';
import DoctorList from './components/DoctorList';
import Appointments from './components/Appointments';
import BookingModal from './components/BookingModal';
import AdminDashboard from './components/AdminDashboard';
import { Doctor } from './types';

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const [currentView, setCurrentView] = useState<'home' | 'doctors' | 'appointments' | 'admin'>('home');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | undefined>();
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);

  const handleSpecialtySelect = (specialtyId: string) => {
    setSelectedSpecialty(specialtyId);
  };

  const handleBookAppointment = (doctor: Doctor) => {
    setBookingDoctor(doctor);
  };

  const handleCloseBooking = () => {
    setBookingDoctor(null);
  };

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={setCurrentView} />

      {currentView === 'home' && (
        <Home onViewChange={setCurrentView} onSpecialtySelect={handleSpecialtySelect} />
      )}

      {currentView === 'doctors' && (
        <DoctorList
          selectedSpecialtyId={selectedSpecialty}
          onBookAppointment={handleBookAppointment}
        />
      )}

      {currentView === 'appointments' && <Appointments />}

      {currentView === 'admin' && user?.role === 'admin' && <AdminDashboard />}

      {bookingDoctor && (
        <BookingModal doctor={bookingDoctor} onClose={handleCloseBooking} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppointmentProvider>
        <AppContent />
      </AppointmentProvider>
    </AuthProvider>
  );
}
