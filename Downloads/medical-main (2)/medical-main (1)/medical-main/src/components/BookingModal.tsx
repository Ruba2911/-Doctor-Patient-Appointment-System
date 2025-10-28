import { useState } from "react";
import {
  X,
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  Smartphone,
  QrCode,
  Lock,
} from "lucide-react";
import QRCode from "react-qr-code";
import { Doctor } from "../types";
import { useAppointments } from "../context/AppointmentContext";
import { useAuth } from "../context/AuthContext";

interface BookingModalProps {
  doctor: Doctor;
  onClose: () => void;
}

export default function BookingModal({ doctor, onClose }: BookingModalProps) {
  const { addAppointment } = useAppointments();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState<
    "details" | "payment" | "upi-form" | "gpay-scan" | "success"
  >("details");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "gpay" | null>(
    null
  );
  const [upiId, setUpiId] = useState("");
  const [upiPin, setUpiPin] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [ngrokUrl, setNgrokUrl] = useState("");

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      if (doctor.availableDays.includes(dayName)) {
        dates.push({
          value: date.toISOString().split("T")[0],
          label: date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          }),
        });
      }
    }
    return dates;
  };

  const availableTimes = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    // Move to payment step instead of directly booking
    setStep("payment");
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    if (paymentMethod === "upi") {
      setStep("upi-form");
    } else if (paymentMethod === "gpay") {
      initiateGpayPayment();
    }
  };

  const initiateGpayPayment = async () => {
    const uniquePaymentId = `payment_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    setPaymentId(uniquePaymentId);

    const appointmentData = {
      patientId: user!.id,
      doctorId: doctor.id,
      doctorName: doctor.fullName,
      doctorSpecialty: doctor.specialty,
      doctorImage: doctor.imageUrl,
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
      reason,
      amount: doctor.consultationFee,
    };

    try {
      const response = await fetch("http://localhost:5000/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentId: uniquePaymentId,
          appointmentData,
        }),
      });

      if (response.ok) {
        // For demo purposes, using a placeholder ngrok URL. In real implementation, this would be fetched from backend
        const demoNgrokUrl = "https://demo-ngrok-url.ngrok.io";
        setNgrokUrl(demoNgrokUrl);
        setStep("gpay-scan");
        pollPaymentStatus(uniquePaymentId);
      } else {
        console.error("Failed to create payment");
      }
    } catch (error) {
      console.error("Error creating payment:", error);
    }
  };

  const pollPaymentStatus = (paymentId: string) => {
    // Simulate automatic payment completion after 3 seconds
    setTimeout(async () => {
      try {
        // Update payment status to completed
        const response = await fetch(`http://localhost:5000/api/payment/${paymentId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "completed" }),
        });

        if (response.ok) {
          if (!user) return;
          // Add appointment to backend and local state
          await addAppointment({
            patientId: user.id,
            doctorId: doctor.id,
            doctorName: doctor.fullName,
            doctorSpecialty: doctor.specialty,
            doctorImage: doctor.imageUrl,
            appointmentDate: selectedDate,
            appointmentTime: selectedTime,
            status: "scheduled",
            reason,
          });
          setPaymentSuccess(true);
          setStep("success");
        }
      } catch (error) {
        console.error("Error completing payment:", error);
      }
    }, 3000); // 3 seconds delay
  };

  const handleUpiPayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    // Simulate UPI payment processing
    setPaymentSuccess(true);
    setTimeout(() => {
      addAppointment({
        patientId: user.id,
        doctorId: doctor.id,
        doctorName: doctor.fullName,
        doctorSpecialty: doctor.specialty,
        doctorImage: doctor.imageUrl,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        status: "scheduled",
        reason,
      });
      setStep("success");
    }, 3000);
  };

  const generatePaymentQR = () => {
    return `${ngrokUrl}/api/payment/page/${paymentId}`;
  };

  if (step === "payment") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Payment</h2>
              <p className="text-gray-600">Complete your appointment booking</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="p-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Appointment Summary
              </h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-600">{doctor.fullName}</p>
                  <p className="text-sm text-gray-500">
                    {selectedDate} at {selectedTime}
                  </p>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  ${doctor.consultationFee}
                </p>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={`p-4 border-2 rounded-xl text-center transition-all ${
                      paymentMethod === "upi"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Smartphone className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <p className="font-medium">UPI</p>
                    <p className="text-sm text-gray-500">
                      Paytm, PhonePe, etc.
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("gpay")}
                    className={`p-4 border-2 rounded-xl text-center transition-all ${
                      paymentMethod === "gpay"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <QrCode className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <p className="font-medium">Google Pay</p>
                    <p className="text-sm text-gray-500">Scan QR Code</p>
                  </button>
                </div>
              </div>

              {paymentMethod === "upi" && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="yourname@paytm"
                    required
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={
                    !paymentMethod || (paymentMethod === "upi" && !upiId)
                  }
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                  {paymentMethod === "gpay"
                    ? "Generate QR Code"
                    : `Pay $${doctor.consultationFee}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (step === "gpay-scan") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full my-8">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Google Pay</h2>
              <p className="text-gray-600">Scan QR Code to Pay</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="p-6 text-center">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 mb-6">
              <QRCode
                value={generatePaymentQR()}
                size={200}
                className="mx-auto mb-4"
              />
              <p className="text-sm text-gray-600 font-medium">
                Scan this QR code with your phone
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Opens payment page in your mobile browser
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-600">Amount</p>
                  <p className="font-semibold text-gray-900">Medical App</p>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  ${doctor.consultationFee}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Waiting for payment confirmation...
              </p>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              </div>
            </div>

            <button
              onClick={() => setStep("payment")}
              className="w-full mt-6 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
            >
              Back to Payment Options
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "upi-form") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full my-8">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">UPI Payment</h2>
              <p className="text-gray-600">Enter your payment details</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleUpiPayment} className="p-6 space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-600">Paying to</p>
                  <p className="font-semibold text-gray-900">Medical App</p>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  ${doctor.consultationFee}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Select Bank
              </label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Choose your bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
                <option value="pnb">Punjab National Bank</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                UPI PIN
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={upiPin}
                  onChange={(e) => setUpiPin(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter 4-6 digit PIN"
                  maxLength={6}
                  required
                />
                <Lock className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Your UPI PIN is required for this transaction
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep("payment")}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!selectedBank || !upiPin || paymentSuccess}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                {paymentSuccess
                  ? "Processing..."
                  : `Pay $${doctor.consultationFee}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center relative overflow-hidden">
          {/* Confetti Animation */}
          {paymentSuccess && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 50 }, (_, i) => (
                <div
                  key={i}
                  className="absolute animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'][Math.floor(Math.random() * 5)],
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Credited Successfully!
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Your payment has been processed and credited to your account. Your appointment with {doctor.fullName} has been successfully scheduled.
          </p>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-semibold text-gray-900">{selectedTime}</p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-lg"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Book Appointment
            </h2>
            <p className="text-gray-600">
              {doctor.fullName} - {doctor.specialty}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex gap-4 mb-6 pb-6 border-b">
            <img
              src={doctor.imageUrl}
              alt={doctor.fullName}
              className="w-20 h-20 rounded-xl object-cover shadow-md"
            />
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {doctor.fullName}
              </h3>
              <p className="text-blue-600 mb-2">{doctor.specialty}</p>
              <p className="text-gray-600 text-sm">
                {doctor.experienceYears} years experience
              </p>
              <p className="text-gray-900 font-semibold mt-1">
                Fee: ${doctor.consultationFee}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                <Calendar className="w-4 h-4" />
                Select Date
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {getAvailableDates().map((date) => (
                  <button
                    key={date.value}
                    type="button"
                    onClick={() => setSelectedDate(date.value)}
                    className={`py-3 px-2 rounded-xl text-sm font-medium transition-all ${
                      selectedDate === date.value
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {date.label}
                  </button>
                ))}
              </div>
            </div>

            {selectedDate && (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  <Clock className="w-4 h-4" />
                  Select Time
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedTime === time
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4" />
                Reason for Visit
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g., Routine checkup, Follow-up consultation"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Additional Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Any specific concerns or information..."
              />
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedDate || !selectedTime || !reason}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
