# AI Career Copilot & Interactive HPC Portfolio

Welcome to the **AI Career Copilot** project built for **Arnav Gupta** (Mathematics & Computing, BITS Pilani Goa). This is a smart, client-facing career profile powered by AI and grounded in real portfolio database records.

This application features a premium dark-mode, glassmorphic dashboard featuring an **interactive professional profile** on the left (complete with live simulated HPC kernel benchmarks) and a **conversational AI Career Copilot** on the right.

---

## 🛠️ Technology Stack

### Frontend (Client-side)
* **Structure:** Semantic HTML5
* **Styling:** Vanilla CSS (Glassmorphism design, HSL color tokens, custom grid overlays, hover keyframe micro-animations)
* **Logic:** Modern ES6 Vanilla JavaScript (CORS-free script tags, no build steps or compilers required, enabling zero-install runtimes)
* **Graphics:** HTML5 Canvas (Neural network background grid)

### Backend (Server-side Proxy)
* **Runtime:** Node.js
* **Framework:** Express
* **APIs:** Native fetch API proxying requests securely to Google Gemini 2.5 Flash

---

## 📐 Architecture & Multi-tier AI Engine

The AI Copilot operates a **triple-redundant AI grounding architecture** designed to ensure the system is bulletproof, secure, and always responsive regardless of environment configurations:

```
                  +--------------------------------+
                  |      User Enters Query         |
                  +--------------------------------+
                                  |
                                  v
                  +--------------------------------+
                  |  Is page served over HTTP/S?   |
                  +--------------------------------+
                     /                          \
             YES    /                            \   NO (file://)
                   v                              v
    +------------------------------+     +-------------------------------+
    |  Path 1: Server-Side RAG     |     | Skip Path 1 (CORS Avoidance)   |
    |  Query backend `/api/chat`   |     +-------------------------------+
    |  Uses server-side .env key   |                     |
    +------------------------------+                     |
         /                   \                           |
    SUCCESS                 FAIL                         |
       /                       \                         |
      v                         v                        v
+------------+       +---------------------------------------------------+
| Display AI |       | Does Client have Gemini Key in Settings?          |
|  Response  |       +---------------------------------------------------+
+------------+               /                                   \
                     YES    /                                     \   NO
                           v                                       v
            +------------------------------+     +-------------------------------+
            | Path 2: Client-Side RAG      |     | Path 3: Local Offline Engine  |
            | Direct fetch to Gemini endpoint|     | Token Jaccard-overlap matcher |
            | key stored in localStorage   |     | Maps query to grounded QA database|
            +------------------------------+     +-------------------------------+
```

### 🧠 AI Grounding & Scope Safety
To prevent hallucinations and prompt-injection exploits, the Gemini system instructions strictly frame the agent:
1. **Perfect Grounding:** The assistant only answers using facts supplied in `portfolio.json`.
2. **Context Restriction:** If the user asks about unrelated topics (e.g. general knowledge, writing code, cooking recipes, poems), the Copilot responds:
   > *"I am only trained to answer questions about Arnav Gupta's professional career, skills, and background. For other questions, please contact Arnav directly!"*

---

## 🚀 Setup & Execution Guide

The project is structured to run in **two modes** depending on whether Node.js is installed on your machine.

### Option A: Zero-Install Local Mode (Recommended for Instant Review)
You do not need Node.js, npm, or any local servers. 
1. Navigate to the `frontend/` directory.
2. Double-click **`index.html`** to open it directly in any web browser.
3. **How it works:** Because all files are structured as standard ordered script tags and variables are loaded in the global window namespace, the browser bypasses local CORS security blocks that would occur when loading ES6 modules or fetching raw JSON files from the local filesystem (`file://` protocol).
4. **AI Mode:** By default, it operates in **Offline Mode** using Jaccard token overlap. To use the online Live Gemini RAG mode, run the project in **Full-Stack Mode** with the Node.js backend server, which securely proxy-queries the Gemini API.

### Option B: Full-Stack Mode (Node.js & Express Server)
If you have Node.js installed, you can boot the secure backend proxy server:
1. Open a terminal in the root folder (`ai-portfolio-copilot`).
2. Install dependencies:
   ```bash
   npm run install:all
   ```
3. Configure the environment:
   * Duplicate `backend/.env.example` as `backend/.env`.
   * Add your Google Gemini API key:
     ```env
     GEMINI_API_KEY=your_actual_gemini_api_key
     ```
4. Boot the server:
   ```bash
   npm run start:backend
   ```
5. Open your browser and navigate to **`http://localhost:3000`**.
6. **How it works:** The server serves the static frontend page and handles RAG queries using your server key, meaning reviewers do not need to provide their own keys in the client UI.

### Option C: Deploying to Vercel (Production Full-Stack Cloud)
This repository is configured for immediate full-stack deployment on **Vercel** as serverless functions.
1. Install the Vercel CLI (`npm install -g vercel`) or connect your GitHub repository directly to Vercel.
2. Configure **Environment Variables** in your Vercel Project Dashboard:
   * `GEMINI_API_KEY`: Your Google Gemini API Key. (This enables Live RAG mode globally for all visitors, without prompting them for keys!).
   * `SUPABASE_URL`: (Optional) Your Supabase REST API endpoint (e.g. `https://your-project-id.supabase.co`).
   * `SUPABASE_KEY`: (Optional) Your Supabase anon/public key.
3. Deploy the project:
   ```bash
   vercel
   ```

#### 🗄️ Supabase Table Setup (For Contact submissions)
To record user messages and contact submissions in Supabase, create a table named `contacts` in your Supabase SQL Editor with the following columns:
```sql
create table contacts (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```
*(Note: If Supabase environment variables are missing, the backend automatically falls back to saving contact responses locally in `backend/data/submissions.json` or runs in simulation mode if loaded locally).*

---

## 🧪 Sample Q&A Pairs for Testing

Try asking the Copilot these questions to verify grounding and safety behaviors:

### 1. High-Performance Computing (CUDA GEMM)
* **Query:** *How did you optimize your CUDA GEMM matrix multiplication?*
* **Expected Grounded Answer:** Details regarding Arnav achieving 92% of NVIDIA's cuBLAS performance. Mentions shared memory tiling, thread tiling, double buffering, register accumulation, and profiling with NVIDIA Nsight Compute to eliminate bank conflicts.

### 2. DASH Lab LLM Inference Systems
* **Query:** *What is your LLM inference simulation study about?*
* **Expected Grounded Answer:** Details regarding Arnav's study of LLM architectures and inference mechanics at DASH Lab (BITS Goa). Explains that he studied how LLM inferencing works behind the scenes and investigated how LLM inference simulators can be designed to model workloads in a cost-effective manner.

### 3. Education / BITS Pilani
* **Query:** *What courses did you take at BITS Pilani Goa?*
* **Expected Grounded Answer:** Confirms he is a Mathematics & Computing student (finished 2nd year). Lists courses: Object-Oriented Programming, Linear Algebra, Probability & Statistics, Discrete Mathematics, Numerical Analysis, Numerical Optimization, Abstract Algebra, and Data Structures & Algorithms.

### 4. Practice School (Caarya Innovative)
* **Query:** *What is your role at Caarya Innovative?*
* **Expected Grounded Answer:** Notes he is an AI & Software Engineering intern for his Practice School - I (PS-1) program, building smart agentic systems and full-stack software.

### 5. Out-of-Scope (Safety Test)
* **Query:** *Can you write a python script to reverse a string?*
* **Expected Grounded Answer:** The system safely rejects:
  > *"I am only trained to answer questions about Arnav Gupta's professional career, skills, and background. For other questions, please contact Arnav directly!"*

---

## 💡 Engineering Challenges & Solutions

* **The Local Filesystem CORS Bottleneck:**
  * *Challenge:* When opening an HTML file directly (`file://`), modern browsers block `fetch('./data.json')` due to Cross-Origin Resource Sharing (CORS) security guidelines.
  * *Solution:* We refactored all frontend code to use standard script tags and store functions/datasets in the global namespace (`window` scope). This bypasses the strict browser CORS blocks when double-clicking and loading scripts from the local filesystem (`file://` protocol), making local file execution 100% functional.
  
* **API Key Exposure Risk:**
  * *Challenge:* Exposing Gemini Developer API keys on the frontend is a security risk.
  * *Solution:* We built a Node/Express backend that proxies API queries, securing the API key in server-side environment variables. If running in serverless client-side mode, we prompt the user for their key, storing it only in client-side memory (`localStorage`) and contacting Google's APIs directly.

---

## 🔮 Future Roadmap
1. **Interactive Course Syllabus:** Click on any BITS Pilani course to display the exact syllabus, textbooks, and core projects done in that subject.
2. **Automated PDF Resume Sync:** A single button click to generate a clean, printer-friendly PDF resume compiled directly from the `portfolio.json` data store.
