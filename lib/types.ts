export type TrialType = "adult" | "child" | null;

export interface Child {
  firstName: string;
  lastName: string;
  age: string;
  dateOfBirth: string;
  experience: string;
  school: string;
  selectedTime?: string;
}

export interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  location: string;
  trialType: TrialType;
  howHeard: string;
  children: Child[];
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  emergencyContactEmail: string;
}

export const LOCATIONS = [
  "NY - DOWNTOWN BROOKLYN",
  "NY - LONG ISLAND CITY, QUEENS",
  "NY - FIDI, MANHATTAN",
  "NY - RIDGE HILL, YONKERS",
  "PA - FISHTOWN, PHILADELPHIA",
  "MA - NEWTON, MASSACHUSETTS",
  "MA - ALLSTON, BOSTON",
];

export const HOW_HEARD_OPTIONS = [
  "Instagram",
  "Google",
  "Facebook",
  "TikTok",
  "Friend or family",
  "Yelp",
  "Other",
];

export const AGE_OPTIONS = [
  "6-8",
  "9-11",
  "12-14",
  "15-17",
  "18+",
];

export const EXPERIENCE_OPTIONS = [
  "Never played",
  "Beginner",
  "Intermediate",
  "Advanced",
];

export const MOCK_TIME_SLOTS = [
  { id: "1", day: "Tuesday", time: "7:00 PM - 8:00 PM", coach: "Coach Ellis" },
  { id: "2", day: "Wednesday", time: "4:00 PM - 4:45 PM", coach: "Coach Donovan" },
  { id: "3", day: "Thursday", time: "6:30 PM - 7:30 PM", coach: "Coach Park" },
  { id: "4", day: "Saturday", time: "10:00 AM - 10:30 AM", coach: "Coach Misol" },
  { id: "5", day: "Saturday", time: "11:00 AM - 11:45 AM", coach: "Coach Ellis" },
  { id: "6", day: "Sunday", time: "9:00 AM - 9:45 AM", coach: "Coach Donovan" },
];
