import express from "express";

const router = express.Router();

// Mock doctor data
const mockDoctors = [
  {
    id: "1",
    fullName: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    experienceYears: 12,
    consultationFee: 150,
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    rating: 4.8,
    totalReviews: 156,
    education: "MD from Harvard Medical School",
    languages: ["English", "Spanish"],
    about: "Dr. Sarah Johnson is a board-certified cardiologist with over 12 years of experience in treating heart conditions. She specializes in preventive cardiology and heart disease management."
  },
  {
    id: "2",
    fullName: "Dr. Michael Chen",
    specialty: "Dermatology",
    experienceYears: 8,
    consultationFee: 120,
    imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    availableDays: ["Monday", "Wednesday", "Thursday", "Friday", "Saturday"],
    rating: 4.9,
    totalReviews: 203,
    education: "MD from Johns Hopkins University",
    languages: ["English", "Mandarin"],
    about: "Dr. Michael Chen is a dermatologist specializing in medical and cosmetic dermatology. He has extensive experience in treating skin conditions and performing cosmetic procedures."
  },
  {
    id: "3",
    fullName: "Dr. Emily Rodriguez",
    specialty: "Pediatrics",
    experienceYears: 15,
    consultationFee: 100,
    imageUrl: "https://images.unsplash.com/photo-1594824804732-ca8db723f8fa?w=400&h=400&fit=crop&crop=face",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    rating: 4.7,
    totalReviews: 189,
    education: "MD from Stanford University",
    languages: ["English", "Spanish"],
    about: "Dr. Emily Rodriguez is a pediatrician dedicated to providing comprehensive healthcare for children from infancy through adolescence."
  },
  {
    id: "4",
    fullName: "Dr. James Wilson",
    specialty: "Orthopedics",
    experienceYears: 20,
    consultationFee: 180,
    imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face",
    availableDays: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    rating: 4.6,
    totalReviews: 142,
    education: "MD from University of Pennsylvania",
    languages: ["English"],
    about: "Dr. James Wilson is an orthopedic surgeon specializing in sports medicine and joint replacement surgery with over 20 years of experience."
  },
  {
    id: "5",
    fullName: "Dr. Lisa Park",
    specialty: "Gynecology",
    experienceYears: 10,
    consultationFee: 130,
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday"],
    rating: 4.8,
    totalReviews: 167,
    education: "MD from UCLA Medical School",
    languages: ["English", "Korean"],
    about: "Dr. Lisa Park is a gynecologist providing comprehensive women's health services including preventive care, family planning, and gynecological surgery."
  },
  {
    id: "6",
    fullName: "Dr. Robert Thompson",
    specialty: "Neurology",
    experienceYears: 18,
    consultationFee: 200,
    imageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=face",
    availableDays: ["Monday", "Tuesday", "Thursday", "Friday"],
    rating: 4.9,
    totalReviews: 98,
    education: "MD from Mayo Clinic College of Medicine",
    languages: ["English"],
    about: "Dr. Robert Thompson is a neurologist specializing in the diagnosis and treatment of neurological disorders including epilepsy, Parkinson's disease, and multiple sclerosis."
  }
];

// Mock specialties data
const mockSpecialties = [
  { id: "1", name: "Cardiology", description: "Heart and cardiovascular system" },
  { id: "2", name: "Dermatology", description: "Skin, hair, and nails" },
  { id: "3", name: "Pediatrics", description: "Medical care for children" },
  { id: "4", name: "Orthopedics", description: "Bones, joints, and muscles" },
  { id: "5", name: "Gynecology", description: "Women's reproductive health" },
  { id: "6", name: "Neurology", description: "Brain and nervous system" },
  { id: "7", name: "Dentistry", description: "Oral health and teeth" },
  { id: "8", name: "Ophthalmology", description: "Eye care and vision" }
];

// Get all doctors
router.get("/", async (req, res) => {
  try {
    res.json({ doctors: mockDoctors });
  } catch (error) {
    console.error("Get doctors error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get doctor by ID
router.get("/:id", async (req, res) => {
  try {
    const doctor = mockDoctors.find(d => d.id === req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json({ doctor });
  } catch (error) {
    console.error("Get doctor error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all specialties
router.get("/specialties/all", async (req, res) => {
  try {
    res.json({ specialties: mockSpecialties });
  } catch (error) {
    console.error("Get specialties error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
