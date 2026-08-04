# University Question Bank

A web application designed for university students and department archives to organize, search, and access past examination papers. Question papers are indexed by department batch, semester (1.1 through 4.2), course name, faculty member, and exam type.

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

---

## 🚀 Getting Started Locally

### 1. Clone the Repository
```bash
git clone https://github.com/sooooojib/question-bank.git
cd question-bank
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Set Up the Supabase Database
Run the SQL script provided in `supabase-schema.sql` inside your Supabase SQL Editor. This script creates:
- `batches` table
- `questions` table
- Indexes for fast query performance
- Row Level Security (RLS) policies for read/write access
- `question-bank` public storage bucket

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Free Deployment (Vercel)

1. Push your repository to GitHub.
2. Import your repository into [Vercel](https://vercel.com).
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` under **Environment Variables**.
4. Click **Deploy**. Vercel will build and deploy the application automatically.
