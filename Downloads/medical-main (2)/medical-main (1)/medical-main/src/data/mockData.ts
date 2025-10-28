import { Specialty, Doctor } from '../types';

export const specialties: Specialty[] = [
  {
    id: '1',
    name: 'Cardiology',
    description: 'Heart and cardiovascular system specialists',
    icon: 'heart'
  },
  {
    id: '2',
    name: 'Dermatology',
    description: 'Skin, hair, and nail treatment',
    icon: 'sparkles'
  },
  {
    id: '3',
    name: 'Pediatrics',
    description: 'Healthcare for infants, children, and adolescents',
    icon: 'baby'
  },
  {
    id: '4',
    name: 'Orthopedics',
    description: 'Musculoskeletal system and bone specialists',
    icon: 'bone'
  },
  {
    id: '5',
    name: 'Neurology',
    description: 'Brain and nervous system specialists',
    icon: 'brain'
  },
  {
    id: '6',
    name: 'General Practice',
    description: 'Primary care and general health',
    icon: 'stethoscope'
  }
];

export const doctors: Doctor[] = [
  {
    id: '1',
    fullName: 'Dr. Sarah Johnson',
    specialtyId: '1',
    specialty: 'Cardiology',
    email: 'sarah.johnson@healthcare.com',
    phone: '+1 (555) 123-4567',
    bio: 'Board-certified cardiologist with expertise in preventive cardiology and heart disease management.',
    experienceYears: 15,
    rating: 4.8,
    consultationFee: 150,
    imageUrl: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=400',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday']
  },
  {
    id: '2',
    fullName: 'Dr. Michael Chen',
    specialtyId: '2',
    specialty: 'Dermatology',
    email: 'michael.chen@healthcare.com',
    phone: '+1 (555) 234-5678',
    bio: 'Specializing in cosmetic and medical dermatology with a focus on innovative treatments.',
    experienceYears: 12,
    rating: 4.9,
    consultationFee: 120,
    imageUrl: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=400',
    availableDays: ['Monday', 'Wednesday', 'Thursday', 'Friday']
  },
  {
    id: '3',
    fullName: 'Dr. Emily Rodriguez',
    specialtyId: '3',
    specialty: 'Pediatrics',
    email: 'emily.rodriguez@healthcare.com',
    phone: '+1 (555) 345-6789',
    bio: 'Compassionate pediatrician dedicated to providing comprehensive care for children of all ages.',
    experienceYears: 10,
    rating: 5.0,
    consultationFee: 100,
    imageUrl: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=400',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  {
    id: '4',
    fullName: 'Dr. James Wilson',
    specialtyId: '4',
    specialty: 'Orthopedics',
    email: 'james.wilson@healthcare.com',
    phone: '+1 (555) 456-7890',
    bio: 'Expert in sports medicine and orthopedic surgery with minimally invasive techniques.',
    experienceYears: 18,
    rating: 4.7,
    consultationFee: 180,
    imageUrl: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=400',
    availableDays: ['Tuesday', 'Wednesday', 'Thursday']
  },
  {
    id: '5',
    fullName: 'Dr. Lisa Park',
    specialtyId: '5',
    specialty: 'Neurology',
    email: 'lisa.park@healthcare.com',
    phone: '+1 (555) 567-8901',
    bio: 'Neurologist specializing in migraine treatment and neurological disorders.',
    experienceYears: 14,
    rating: 4.8,
    consultationFee: 160,
    imageUrl: 'https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=400',
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday']
  },
  {
    id: '6',
    fullName: 'Dr. Robert Thompson',
    specialtyId: '6',
    specialty: 'General Practice',
    email: 'robert.thompson@healthcare.com',
    phone: '+1 (555) 678-9012',
    bio: 'Family medicine physician providing comprehensive primary care for patients of all ages.',
    experienceYears: 20,
    rating: 4.9,
    consultationFee: 80,
    imageUrl: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=400',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  }
];
