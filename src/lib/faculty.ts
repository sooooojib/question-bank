export interface Faculty {
  code: string;
  fullName: string;
}

export const FACULTY_MEMBERS: Faculty[] = [
  { code: "UKA", fullName: "Prof. Dr. Uzzal Kumar Acharjee" },
  { code: "MNU", fullName: "Prof. Dr. Md. Nasir Uddin" },
  { code: "AL", fullName: "Dr. Md. Abu Layek" },
  { code: "ZM", fullName: "Dr. Md. Zulfiker Mahmud" },
  { code: "SeS", fullName: "Dr. Selina Sharmin" },
  { code: "MI", fullName: "Dr. Md. Manowarul Islam" },
  { code: "SS", fullName: "Dr. Sajeeb Saha" },
  { code: "DAI", fullName: "Dr. Md. Aminul Islam" },
  { code: "NI", fullName: "Nayeema Islam" },
  { code: "SoC", fullName: "Sonia Corraya" },
  { code: "AA", fullName: "Arnisha Akhter" },
  { code: "ST", fullName: "Dr. Sharaban Tahura (Math)" },
  { code: "ATI", fullName: "Dr. Md. Atiqul Islam" },
  { code: "MSH", fullName: "Dr. Md. Shakawat Hossain" },
  { code: "MAA", fullName: "Dr. Md. Ayub Ali" },
  { code: "GKS", fullName: "Goutam Kumar Saha" },
];

/**
 * List of only the full names of all preexisting faculty members.
 */
export const PRESET_FACULTY_NAMES: string[] = FACULTY_MEMBERS.map(
  (faculty) => faculty.fullName
);

/**
 * Returns the full name for a given faculty acronym code or name.
 * If code is found (case-insensitive), returns the official full name.
 * Otherwise returns the input string trimmed.
 */
export function getFacultyFullName(codeOrName: string): string {
  if (!codeOrName) return "";
  const clean = codeOrName.trim();
  const matched = FACULTY_MEMBERS.find(
    (f) =>
      f.code.toLowerCase() === clean.toLowerCase() ||
      f.fullName.toLowerCase() === clean.toLowerCase()
  );
  return matched ? matched.fullName : clean;
}
