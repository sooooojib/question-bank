export interface Course {
  code: string;
  title: string;
  semester: '1.1' | '1.2' | '2.1' | '2.2' | '3.1' | '3.2' | '4.1' | '4.2';
}

export const COURSE_LIST: Course[] = [
  // 1.1 Semester (1st Year 1st Semester)
  { code: "CSE-1101",  title: "Structured Programming Language",             semester: "1.1" },
  { code: "CSEL-1102", title: "Structured Programming Language Lab",         semester: "1.1" },
  { code: "CSER-1103", title: "Math-I (Calculus)",                           semester: "1.1" },
  { code: "CSER-1105", title: "Physics",                                     semester: "1.1" },
  { code: "CSE-1107",  title: "Electrical Circuit Analysis",                 semester: "1.1" },
  { code: "CSEL-1108", title: "Electrical Circuit Analysis Lab",             semester: "1.1" },
  { code: "CSER-1109", title: "English",                                     semester: "1.1" },
  { code: "CSER-1111", title: "History of the Liberation War of Bangladesh", semester: "1.1" },

  // 1.2 Semester (1st Year 2nd Semester)
  { code: "CSE-1201",  title: "Object Oriented Programming-I",               semester: "1.2" },
  { code: "CSEL-1202", title: "Object Oriented Programming-I Lab",           semester: "1.2" },
  { code: "CSE-1203",  title: "Data structure",                              semester: "1.2" },
  { code: "CSEL-1204", title: "Data structure Lab",                          semester: "1.2" },
  { code: "CSE-1205",  title: "Basic Electronics",                           semester: "1.2" },
  { code: "CSEL-1206", title: "Basic Electronics Lab",                       semester: "1.2" },
  { code: "CSER-1207", title: "Math- II (Linear Algebra)",                   semester: "1.2" },
  { code: "CSE-1209",  title: "Discrete Mathematics",                        semester: "1.2" },
  { code: "CSER-1211", title: "Economics",                                   semester: "1.2" },

  // 2.1 Semester (2nd Year 1st Semester)
  { code: "CSE-2101",  title: "Object Oriented Programming-II",              semester: "2.1" },
  { code: "CSEL-2102", title: "Object Oriented Programming-II Lab",          semester: "2.1" },
  { code: "CSE-2103",  title: "Digital Logic Design",                        semester: "2.1" },
  { code: "CSEL-2104", title: "Digital Logic Design Lab",                    semester: "2.1" },
  { code: "CSER-2105", title: "Math- III (Ordinary differential Equation)",  semester: "2.1" },
  { code: "CSER-2106", title: "Introduction to Statistic and Probability",   semester: "2.1" },
  { code: "CSE-2107",  title: "Data Communication",                          semester: "2.1" },
  { code: "CSEL-2108", title: "Data Communication Lab",                      semester: "2.1" },
  { code: "CSER-2109", title: "Financial and Managerial Accounting",         semester: "2.1" },

  // 2.2 Semester (2nd Year 2nd Semester)
  { code: "CSE-2201",  title: "Computer Architecture",                                         semester: "2.2" },
  { code: "CSE-2202",  title: "Computer Architecture Lab",                                     semester: "2.2" },
  { code: "CSE-2203",  title: "Database Management System",                                    semester: "2.2" },
  { code: "CSEL-2204", title: "Database Management System Lab",                                semester: "2.2" },
  { code: "CSER-2205", title: "Math-IV (Complex Variable, Fourier and Laplace Transform)",     semester: "2.2" },
  { code: "CSER-2207", title: "Numerical Analysis",                                            semester: "2.2" },
  { code: "CSEL-2208", title: "Numerical Analysis Lab",                                        semester: "2.2" },
  { code: "CSE-2209",  title: "Design and Analysis of Algorithm",                              semester: "2.2" },
  { code: "CSEL-2210", title: "Design and Analysis of Algorithm Lab",                          semester: "2.2" },

  // 3.1 Semester (3rd Year 1st Semester)
  { code: "CSE-3101",  title: "Theory of Computation",                       semester: "3.1" },
  { code: "CSE-3103",  title: "Mathematical Analysis for Computer Science",  semester: "3.1" },
  { code: "CSE-3105",  title: "Operating Systems",                           semester: "3.1" },
  { code: "CSEL-3106", title: "Operating Systems Lab",                       semester: "3.1" },
  { code: "CSE-3107",  title: "Microprocessor and Assembly Language",        semester: "3.1" },
  { code: "CSEL-3108", title: "Microprocessor and Assembly Language Lab",    semester: "3.1" },
  { code: "CSE-3109",  title: "Computer Networks",                           semester: "3.1" },
  { code: "CSEL-3110", title: "Computer Networks Lab",                       semester: "3.1" },
  { code: "CSEP-3111", title: "Internet and Web Programming (Project)",      semester: "3.1" },

  // 3.2 Semester (3rd Year 2nd Semester)
  { code: "CSE-3201",  title: "Compiler Design and Construction",            semester: "3.2" },
  { code: "CSEL-3202", title: "Compiler Design and Construction Lab",        semester: "3.2" },
  { code: "CSE-3203",  title: "Digital Signal Processing",                   semester: "3.2" },
  { code: "CSEL-3204", title: "Digital Signal Processing Lab",               semester: "3.2" },
  { code: "CSE-3205",  title: "Software Engineering",                        semester: "3.2" },
  { code: "CSEL-3206", title: "Software Engineering Lab",                    semester: "3.2" },
  { code: "CSE-3207",  title: "Computer Peripherals and Interfacing",        semester: "3.2" },
  { code: "CSEL-3208", title: "Computer Peripherals and Interfacing Lab",    semester: "3.2" },
  { code: "CSEP-3209", title: "Application Design and Development (Project)",semester: "3.2" },

  // 4.1 Semester (4th Year 1st Semester)
  { code: "CSE-4101",  title: "Artificial Intelligence",                     semester: "4.1" },
  { code: "CSEL-4102", title: "Artificial Intelligence Lab",                 semester: "4.1" },
  { code: "CSE-4103",  title: "Digital Image Processing",                    semester: "4.1" },
  { code: "CSEL-4104", title: "Digital Image Processing Lab",                semester: "4.1" },
  { code: "CSE-4105",  title: "Computer Graphics and Animation",             semester: "4.1" },
  { code: "CSEL-4106", title: "Computer Graphics and Animation Lab",         semester: "4.1" },
  { code: "CSE-4107",  title: "Data Mining and Data Warehousing",            semester: "4.1" },
  { code: "CSEL-4108", title: "Data Mining and Data Warehousing Lab",        semester: "4.1" },
  { code: "CSE-4109",  title: "Cryptography and Information Security",       semester: "4.1" },
  { code: "CSEL-4110", title: "Cryptography and Information Security Lab",   semester: "4.1" },

  // 4.2 Semester (4th Year 2nd Semester)
  { code: "CSET-4201", title: "Thesis",   semester: "4.2" },
  { code: "CSEP-4201", title: "Project",  semester: "4.2" },
];

/** Helper: human-readable semester label from code */
export const SEMESTER_LABELS: Record<Course['semester'], string> = {
  '1.1': '1st Year 1st Semester',
  '1.2': '1st Year 2nd Semester',
  '2.1': '2nd Year 1st Semester',
  '2.2': '2nd Year 2nd Semester',
  '3.1': '3rd Year 1st Semester',
  '3.2': '3rd Year 2nd Semester',
  '4.1': '4th Year 1st Semester',
  '4.2': '4th Year 2nd Semester',
};
