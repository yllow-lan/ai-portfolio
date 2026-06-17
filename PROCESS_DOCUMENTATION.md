# Caarya Innovative · Practice School - I
## Phase 02 · Process Documentation & Knowledge Cards

**Candidate:** Arnav Gupta (Mathematics & Computing, BITS Pilani K.K. Birla Goa Campus)  
**Project:** AI Portfolio Copilot & HPC Systems Representation  
**Allotted Track:** AI Track  
**Submission Location:** `#proof-of-work` Discord channel  

---

## 1. Work Unit Definition

The core objective of this work unit was to design, develop, and deploy a responsive, glassmorphic, single-page professional portfolio website with a hybrid server-side and client-side grounded AI Career Copilot assistant. The project seeks to solve the representation problem of high-performance computing (HPC) skills alongside web development capabilities. Through this work unit, we created the following **Atomic Values**:

1. **Unified Career Representation:** Re-contextualized low-level systems engineering (CUDA GEMM optimizations) and machine learning study into a single cohesive, high-fidelity user interface.
2. **Zero-Dependency Accessibility:** Enabled full chatbot availability under strict local browser runtime restrictions (CORS-free execution) and server-less states by establishing an offline backup matching system.
3. **Intellectual Property Discretion:** Grounded all public text and interactive components to describe conceptual systems and architectural learning outcomes rather than exposing proprietary or ongoing research data from BITS Goa's DASH Lab.
4. **Resilient Communication Handshakes:** Integrated serverless email routing fallback protocols that handle static hosting environments gracefully without losing prospective recruiter queries.

---

## 2. Knowledge Cards

Here are the structured **Knowledge Cards** detailing five critical moments, friction points, and lessons learned during the lifecycle of building this project.

### Card 01: Client-Side Hybrid AI Engine (Technical Decision)

* **Atomic Value Tag:** Reduced API vulnerability and minimized hosting costs.
* **Situation / Context:** We needed a conversational AI assistant that could answer recruiters' questions. However, embedding raw Gemini API keys in the client-side JavaScript exposes them to theft, while hosting a dedicated 24/7 Node.js backend server introduces hosting overhead and potential downtime.
* **The Friction:** We faced a trade-off between user experience (recruiter convenience) and operational security/cost. If we required recruiters to enter their own API keys, nobody would use the chatbot. If we forced all queries through a dedicated server, we would incur server maintenance effort and potential hosting charges.
* **What Failed:** Attempting to force client-side browser API calls by obfuscating the API key in the source code (easily extractable by inspection) or demanding an API key on page load (caused high visitor dropout).
* **What Worked:** Implementing a **Hybrid AI Engine**. By default, it operates in **Offline Mode** utilizing a local keyword search and Jaccard similarity matcher on the browser-resident `portfolioData.js` object. When deployed to Vercel, it queries a secure serverless endpoint proxy (`/api/chat` serverless function) to retrieve answers from Gemini 2.5 Flash using system-level environment variables.
* **The Principle:** *Progressive Degradation & Zero-Cost Serverless Proxies*. Build systems that fall back to static local heuristics when external services are offline or keys are absent, and leverage serverless endpoints to perform secure operations without dedicated runtime cost.
* **When This Applies:** When building public portfolios or client-facing showcase websites that require LLM interactions without exposing backend resources or paying for dedicated server runtimes.
* **AI Prompts Used:** 
  > *"How can I design a lightweight, zero-dependency keyword matcher in JavaScript that handles user search queries by calculating simple token overlap against a predefined JSON schema without using npm libraries?"*

---

### Card 02: Persona-Bound Grounding Rules (Prompt Engineering)

* **Atomic Value Tag:** Guided recruiter engagement and restricted token usage.
* **Situation / Context:** We needed to configure the Gemini 2.5 Flash system prompt to represent Arnav Gupta professionally and discuss *only* topics grounded in his resume (education, CUDA projects, BITS Goa coursework).
* **The Friction:** Out-of-the-box LLMs are helpful generalists. If a visitor asks the portfolio chatbot to write a Python script, solve general physics problems, or write a poem, the model will comply. This consumes API quota, dilutes the professional context, and presents a branding risk.
* **What Failed:** Writing a basic positive system prompt: *"You are Arnav's career assistant. Use this resume data to answer questions about him."* The model still happily answered off-topic math questions, solved generic coding exercises, and occasionally hallucinated details not found in the resume.
* **What Worked:** Designing a strict system instruction structure with explicit negative constraints and boundary enforcement:
  1. *Persona Lock:* "You are strictly Arnav's Career Copilot, representing him professionally."
  2. *Strict Grounding:* "Answer ONLY using the provided context. If a detail is missing, say: 'I don't have information on that in Arnav's profile records. You can ask him directly via the contact links.'"
  3. *Unrelated Query Blocks:* "If the user asks about unrelated topics (e.g. general news, coding exercises, cooking recipes, math tasks not related to Arnav's research, writing poems), say: 'I am only trained to answer questions about Arnav Gupta's professional career, skills, and background.'"
* **The Principle:** *Boundary-Enforced Scoping*. Grounding RAG systems requires defining strict negative boundaries (what the model *must not* answer) rather than only specifying what it *should* reference.
* **When This Applies:** When deploying user-facing AI chat widgets where query scopes must be strictly controlled to prevent misuse or brand dilution.
* **AI Prompts Used:**
  > *"Refactor this system prompt to enforce strict negative guardrails on Gemini 2.5 Flash so that it rejects any queries that are not directly related to the candidate's resume, without sounding overly robotic or hostile to recruiters."*

---

### Card 03: Third-Party Form Handshakes (Debugging / What Broke)

* **Atomic Value Tag:** Confirmed client lead delivery and resolved silent failures.
* **Situation / Context:** We hooked up the "Get in Touch" contact form to forward visitor messages directly to Arnav's BITS Pilani email (`f20240843@goa.bits-pilani.ac.in`).
* **The Friction:** In local development, the contact form simulated a success state, but on the live Vercel site, submissions failed to deliver or ended up silent because form processors (like FormSubmit.co) check requesting domains and origins to prevent spam and verify ownership.
* **What Failed:** Submitting form data via AJAX without specifying the proper HTTP headers, resulting in silent spam blocks or CORS rejections on the production site, while the local fallback incorrectly assumed delivery.
* **What Worked:** Refactoring the backend API request to explicitly pass domain origin parameters (`Origin` and `Referer` headers) to mock the verified domain handshake, and implementing a serverless Node.js route `/api/contact` that handles environment validation and returns a clean 200 fallback when writing backup logs to a read-only serverless disk fails.
* **The Principle:** *Environment-Specific Handshake Verification*. Zero-backend third-party integrations (like email submitters) must be audited across different origin states (localhost vs. production domains) to verify CORS and origin filtering rules.
* **When This Applies:** When building serverless or static portfolios that require contact forms with automated email delivery without dedicated SMTP backends.
* **AI Prompts Used:**
  > *"Why does FormSubmit.co return a CORS error or fail to deliver when called via an AJAX fetch in a Node.js Express server acting as a proxy, and how do I configure the Referer and Origin headers to bypass this?"*

---

### Card 04: Visual Space Hierarchy (UI/UX Refactoring)

* **Atomic Value Tag:** Improved layout readability and restored viewport constraints.
* **Situation / Context:** Designing the layout for Arnav's resume and HPC project cards. The initial design used a 50/50 split-screen layout (portfolio on the left, chat box on the right).
* **The Friction:** On standard viewports (especially laptops), both columns competed for width. This caused structural squishing: text overflowed, scrollbars appeared inside tiny panels, and critical elements (like BITS Pilani tags) were cropped. The main page scrollbar was stuck in the middle of the screen instead of the edge.
* **What Failed:** Attempting to use CSS media queries to resize the split panes on medium screens, which still looked extremely cramped and squashed the resume content.
* **What Worked:** Changing the layout. The main portfolio content was refactored into a single full-width column centered on the screen, letting it scroll naturally with the browser's scrollbar on the far right. The chat box was rebuilt as a floating, collapsible widget in the bottom-right corner that can be opened or closed at will.
* **The Principle:** *Visual Layout Dominance*. Primary content should occupy the center stage, while conversational assistants and conversational interfaces should float on a separate presentation layer to prevent layout competition.
* **When This Applies:** When designing dashboards or information-heavy layouts that feature complementary AI chat assistance.
* **AI Prompts Used:**
  > *"How can I transition a two-column split-pane web app where the right pane is a chat interface into a single-column layout with a floating, collapsible chat widget in the bottom-right corner using CSS flex/grid and fixed positioning?"*

---

### Card 05: Research Discretion & Intellectual Property (Information Privacy)

* **Atomic Value Tag:** Protected research confidentiality while demonstrating technical competency.
* **Situation / Context:** Displaying Arnav's research on LLM inference systems at BITS Goa's DASH Lab.
* **The Friction:** Presenting impressive metrics (KV cache hit rates, predictive caching policies) while keeping academic research confidential. Putting too many specific metrics or live charts on the portfolio could expose intellectual property.
* **What Failed:** Designing an interactive KV Cache simulator widget on the website with live hit-rate charts. This made the implementation details too specific, potentially exposing ongoing academic study.
* **What Worked:** Stripping the interactive caching metrics charts out of the UI. Redesigning the copy to focus on high-level learnings: LLM inference architectures, and simulation workload concepts for cost-effective systems.
* **The Principle:** *Conceptual Competence over Metric Disclosure*. In portfolios showcasing ongoing research, highlight methodological expertise and architectural understanding rather than specific performance numbers or implementation details.
* **When This Applies:** When building portfolios while working inside academic labs or industry settings with strict IP or NDA guidelines.
* **AI Prompts Used:**
  > *"Rewrite a research description about optimizing KV caches using reinforcement learning to be high-level and conceptual, focusing on learning Large Language Model architectures and simulation workloads rather than disclosing performance metrics or experimental results."*

---

## 3. Video Walkthrough Script

Arnav, use this guide and talking points to record your 5-to-8 minute video walkthrough. You can use Loom or any screen recording tool.

### Video Outline & Talking Points

#### Part 1: Introduction (~30 seconds)
* **Visual:** Show your portfolio main page centered, with the neural background active.
* **What to say:** 
  > *"Hi everyone, this is Arnav Gupta. I am an undergraduate studying Mathematics & Computing at BITS Pilani Goa Campus. Today I am walking through my Phase 02 Work Order for my Practice School - I internship at Caarya Innovative, showing the AI Portfolio Copilot site I built and the technical decisions behind it."*

#### Part 2: Layout Refactoring & Visual Space (~1.5 minutes)
* **Visual:** Scroll down through the page. Show how clean the single column looks, hover over the CUDA GEMM optimizer card and show the BITS Goa chips. Show the floating chat widget in the bottom-right corner.
* **What to say:**
  > *"Initially, I implemented a 50/50 split-screen layout where the chat was on the right. However, on standard viewports, it squashed the content, cutting off my name and BITS Pilani tags. I refactored the layout to give the portfolio full width and centered breathing space. Now, the main page scrolls naturally with the browser scrollbar, and the AI Copilot sits as a floating, collapsible widget in the bottom-right, keeping the interface clean."*

#### Part 3: The Hybrid AI Engine (~2 minutes)
* **Visual:** Open the chat widget. Type a question (e.g., *"What is your CUDA project?"*).
* **What to say:**
  > *"For the AI engine, I faced a challenge: client-side API keys are insecure, and running a full-time server is expensive. To solve this, I built a hybrid engine. By default, if the server is offline or no API key is set, it runs in 'Offline Mode' using a client-side keyword and Jaccard similarity matcher over my structured data in `portfolioData.js`. On Vercel, it queries a secure backend serverless function `/api/chat` which acts as a proxy to Gemini 2.5 Flash, keeping the API key completely hidden and running serverless at zero hosting cost."*

#### Part 4: Persona Grounding Live Test (~1.5 minutes)
* **Visual:** Type an off-topic question in the chat widget (e.g., *"Can you write a python script to reverse a list?"* or *"What is the capital of Japan?"*). Show the grounded response.
* **What to say:**
  > *"To ensure safety and protect my API quota, I designed strict system instructions. If you ask it general questions, like writing a python script or trivia, the model rejects it politely and directs you to talk to me directly. This boundaries the chatbot's persona to my career records."*

#### Part 5: Contact Form & Conclusion (~1 minute)
* **Visual:** Scroll to the contact form on the left, type a mock message, and send it. Show the success message.
* **What to say:**
  > *"Lastly, I integrated the contact form. To avoid writing a custom SMTP server, I routed it through FormSubmit.co via my backend proxy, manually passing referrer headers to bypass security checks. This routes all messages directly to my BITS Pilani email. That wraps up my Phase 02 presentation. The code is fully pushed to GitHub and running on Vercel. Thank you!"*
