# University Question Bank

A web application designed for university students and department archives to organize, search, and access past examination papers. Question papers are indexed by department batch, semester (1.1 through 4.2), course name, faculty member, and exam type.

🌐 **Live Website**: [https://question-bank-seven-mu.vercel.app](https://question-bank-seven-mu.vercel.app)

---

## 🌟 Key Features

- **Batch Management**: Browse questions organized by department batches (e.g., `CSE 14th Batch`, `CSE 15th Batch`). Easily create new batches with automatic ordinal formatting.
- **Semester & Course Indexing**: Covers all 8 undergraduate semesters (`1.1` to `4.2`) with pre-configured course lists and course code mapping.
- **Exam Type Filtering**: Categorize and filter question papers by exam type (`Mid 1`, `Mid 2`, `Mid 3`, `Final Term`, `Quiz`, `Other`).
- **Real-Time Search**: Search papers instantly by course name or course code right from the homepage.
- **Inline Document Previewer**: Interactive modal viewer for PDF papers and images directly inside the browser.
- **Direct Blob Download**: Download PDF and image files directly to your device without opening unwanted external browser tabs.
- **Upload Validation & Storage Protection**: Enforces a 1MB file size limit with built-in compression warnings and direct integration with PDF compression tools.
- **Responsive Dark Theme**: Fully optimized for mobile screens, tablets, and desktop devices.
- **Page Loading Indicator**: Smooth red top progress bar during page navigation powered by `nextjs-toploader`.

---

## 🌐 Live Website

Access the live university question bank archive here:  
👉 **[https://question-bank-seven-mu.vercel.app](https://question-bank-seven-mu.vercel.app)**

---

## 📥 How to Upload a Question Paper

1. Navigate to the **Upload Question** page from the top navigation bar.
2. Enter the **Secret Access Key** (used to prevent unauthorized uploads).
3. Select an existing **Batch Name** (e.g., `CSE 16th Batch`).
4. Select the **Semester** (e.g., `3.1`). This automatically filters the **Course Name** dropdown to show relevant courses for that semester.
5. Select the **Course Name** from the list.
6. Enter the **Teacher / Faculty Name** (or faculty code, e.g., `UKA`) and the **Exam Year**.
7. Choose the **Exam Type** (`Mid 1`, `Mid 2`, `Mid 3`, `Final Term`, `Quiz`, or `Other`).
8. Select the question file (PDF, PNG, JPG, or DOCX). 
   - *Note: Files must be under 1MB. If your file exceeds 1MB, a warning dialog will prompt you to compress the PDF.*
9. Click **Upload Question Paper**. Upon success, the paper will immediately appear under the batch archive.

---

## ➕ How to Create a New Batch

1. On the homepage, click the **+ Add Batch** button.
2. Enter the batch number (e.g., `18`).
3. The system will auto-format the name to **`CSE 18th Batch`**.
4. Click **Create Batch**.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & Storage**: [Supabase](https://supabase.com/) (PostgreSQL & Storage Buckets)
- **Icons**: [Lucide React](https://lucide.dev/)
- **UI Components**: Shadcn UI primitives, Sonner (Toast notifications)
- **Top Loader**: `nextjs-toploader`
- **Hosting**: [Vercel](https://vercel.com)
