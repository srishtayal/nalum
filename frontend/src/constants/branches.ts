export const BRANCHES = [
  "Computer Science Engineering",
  "Electronics and Communication Engineering",
  "Information Technology",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "Biotechnology",
  "Instrumentation and Control Engineering",
] as const;

export const CAMPUSES = ["Main Campus", "East Campus", "West Campus"] as const;

export type Branch = (typeof BRANCHES)[number];
export type Campus = (typeof CAMPUSES)[number];