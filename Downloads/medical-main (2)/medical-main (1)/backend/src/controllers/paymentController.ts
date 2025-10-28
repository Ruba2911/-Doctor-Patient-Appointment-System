import { Request, Response } from "express";
import Payment from "../models/Payment";

export const createPayment = async (req: Request, res: Response) => {
  try {
    const { paymentId, appointmentData } = req.body;

    const payment = new Payment({
      paymentId,
      appointmentData,
    });

    await payment.save();
    res.status(201).json({ message: "Payment created successfully", payment });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPayment = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findOne({ paymentId });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(payment);
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;
    const { status } = req.body;

    const payment = await Payment.findOneAndUpdate(
      { paymentId },
      { status },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({ message: `Payment ${status} successfully`, payment });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const confirmPayment = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findOneAndUpdate(
      { paymentId },
      { status: "completed" },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({ message: "Payment confirmed successfully", payment });
  } catch (error) {
    console.error("Error confirming payment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const cancelPayment = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findOneAndUpdate(
      { paymentId },
      { status: "cancelled" },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({ message: "Payment cancelled successfully", payment });
  } catch (error) {
    console.error("Error cancelling payment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const renderPaymentPage = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findOne({ paymentId });

    if (!payment) {
      return res.status(404).send("<h1>Payment not found</h1>");
    }

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Confirmation</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        @keyframes confetti {
            0% { transform: translateY(-100vh) rotate(0deg); }
            100% { transform: translateY(100vh) rotate(720deg); }
        }
        .confetti {
            position: absolute;
            width: 10px;
            height: 10px;
            animation: confetti 3s linear infinite;
        }
        .success-animation {
            animation: bounce 0.6s ease-in-out;
        }
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
        }
    </style>
</head>
<body class="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden">
        <!-- Confetti Container -->
        <div id="confettiContainer" class="absolute inset-0 pointer-events-none hidden"></div>

        <!-- Header -->
        <div class="text-center mb-8">
            <div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-mobile-alt text-green-600 text-2xl"></i>
            </div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">Google Pay</h1>
            <p class="text-gray-600">Payment Request</p>
        </div>

        <!-- Appointment Details -->
        <div class="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 class="font-semibold text-gray-900 mb-3">Appointment Details</h3>
            <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                    <span class="text-gray-600">Doctor:</span>
                    <span class="font-medium text-gray-900">${payment.appointmentData.doctorName}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Specialty:</span>
                    <span class="font-medium text-gray-900">${payment.appointmentData.doctorSpecialty}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Date:</span>
                    <span class="font-medium text-gray-900">${payment.appointmentData.appointmentDate}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Time:</span>
                    <span class="font-medium text-gray-900">${payment.appointmentData.appointmentTime}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Reason:</span>
                    <span class="font-medium text-gray-900">${payment.appointmentData.reason}</span>
                </div>
            </div>
        </div>

        <!-- Payment Summary -->
        <div class="bg-blue-50 rounded-xl p-4 mb-6">
            <div class="flex justify-between items-center">
                <div>
                    <p class="text-gray-600">Amount to Pay</p>
                    <p class="font-semibold text-gray-900">Medical App</p>
                </div>
                <p class="text-3xl font-bold text-blue-600">$${payment.appointmentData.amount}</p>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
            <button
                onclick="confirmPayment('${paymentId}')"
                class="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg flex items-center justify-center gap-2"
            >
                <i class="fas fa-check"></i>
                Proceed Payment
            </button>
            <button
                onclick="cancelPayment('${paymentId}')"
                class="w-full border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
                <i class="fas fa-times"></i>
                Cancel
            </button>
        </div>

        <!-- Status Message -->
        <div id="statusMessage" class="mt-4 text-center text-sm text-gray-600 hidden">
            Processing...
        </div>

        <!-- Success Modal -->
        <div id="successModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
            <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center mx-4">
                <div class="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 success-animation">
                    <i class="fas fa-check text-green-600 text-3xl"></i>
                </div>
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Payment Credited Successfully!</h2>
                <p class="text-gray-600 mb-6">Your payment has been processed and credited to your account.</p>
                <button onclick="closeSuccessModal()" class="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg">
                    Close
                </button>
            </div>
        </div>
    </div>

    <script>
        function createConfetti() {
            const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];
            const container = document.getElementById('confettiContainer');
            container.classList.remove('hidden');

            for (let i = 0; i < 50; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 3 + 's';
                container.appendChild(confetti);

                setTimeout(() => {
                    confetti.remove();
                }, 3000);
            }
        }

        async function confirmPayment(paymentId) {
            const statusDiv = document.getElementById('statusMessage');
            statusDiv.textContent = 'Processing payment...';
            statusDiv.classList.remove('hidden');

            try {
                const response = await fetch('/api/payment/confirm/' + paymentId, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    createConfetti();
                    setTimeout(() => {
                        document.getElementById('successModal').classList.remove('hidden');
                    }, 1000);
                } else {
                    throw new Error('Payment failed');
                }
            } catch (error) {
                statusDiv.textContent = 'Payment failed. Please try again.';
                statusDiv.classList.remove('text-gray-600');
                statusDiv.classList.add('text-red-600');
            }
        }

        function closeSuccessModal() {
            document.getElementById('successModal').classList.add('hidden');
            window.close();
        }

        async function cancelPayment(paymentId) {
            const statusDiv = document.getElementById('statusMessage');
            statusDiv.textContent = 'Cancelling payment...';
            statusDiv.classList.remove('hidden');

            try {
                const response = await fetch('/api/payment/cancel/' + paymentId, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    statusDiv.textContent = 'Payment cancelled. You can close this page.';
                    statusDiv.classList.remove('text-gray-600');
                    statusDiv.classList.add('text-orange-600');
                } else {
                    throw new Error('Cancellation failed');
                }
            } catch (error) {
                statusDiv.textContent = 'Cancellation failed. Please try again.';
                statusDiv.classList.remove('text-gray-600');
                statusDiv.classList.add('text-red-600');
            }
        }
    </script>
</body>
</html>
    `;

    res.send(html);
  } catch (error) {
    console.error("Error rendering payment page:", error);
    res.status(500).send("<h1>Internal server error</h1>");
  }
};
