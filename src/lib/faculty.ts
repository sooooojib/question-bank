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
  { code: "MOF", fullName: "Dr. Mohammad Omar Faruq" },
];

/**
 * Strips titles like "Prof. Dr.", "Prof.", "Dr.", "Professor" so names are sorted
 * by actual person's name in alphabetical order.
 */
export function getSortableName(name: string): string {
  if (!name) return "";
  return name
    .replace(/^(prof\.\s*dr\.|prof\.|dr\.|professor\s+dr\.|professor|engr\.)\s*/i, "")
    .trim();
}

/**
 * Gets the first initial letter of the person's name (ignoring academic titles).
 */
export function getFacultyInitial(name: string): string {
  const clean = getSortableName(name);
  return clean ? clean.charAt(0).toUpperCase() : "F";
}

/**
 * Sorts faculty names strictly in alphabetical order by their actual name.
 */
export function sortFacultyNames(names: string[]): string[] {
  return [...names].sort((a, b) => {
    const aClean = getSortableName(a);
    const bClean = getSortableName(b);
    return aClean.localeCompare(bClean);
  });
}

/**
 * List of only the full names of all preexisting faculty members sorted alphabetically by real name.
 */
export const PRESET_FACULTY_NAMES: string[] = sortFacultyNames(
  FACULTY_MEMBERS.map((faculty) => faculty.fullName)
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
