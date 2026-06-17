// Portfolio data for Arnav Gupta
// Exported as an ES6 module to allow direct import in local files without CORS issues

window.portfolioData = {
  personal: {
    name: "Arnav Gupta",
    title: "High-Performance Computing & AI Researcher",
    subtitle: "Maths & Computing Student at BITS Pilani Goa",
    email: "f20240843@goa.bits-pilani.ac.in", // BITS Pilani email
    github: "https://github.com/yllow-lan",
    linkedin: "https://www.linkedin.com/in/arnav-gupta-1a6a33320/",
    resumeUrl: "#",
    aboutShort: "Mathematics & Computing undergraduate at BITS Pilani Goa, specializing in GPU acceleration (CUDA), High-Performance Computing (HPC), and LLM inference systems simulation.",
    aboutLong: "I am Arnav Gupta, a Mathematics & Computing student at BITS Pilani, K.K. Birla Goa Campus. I am passionate about bridging the gap between mathematical theory and high-performance system implementation. My work sits at the intersection of GPU kernel optimization, compiler engineering, and deep learning infrastructure. Currently, I am studying how LLMs work behind the scenes and design principles for cost-effective inference simulators at BITS Goa's DASH Lab, alongside optimizing GPU deep-learning primitive kernels in CUDA.",
    location: "Goa, India",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=300&h=300&q=80" // High-quality profile placeholder
  },
  
  education: [
    {
      institution: "BITS Pilani, K.K. Birla Goa Campus",
      degree: "B.Tech. in Mathematics and Computing",
      duration: "2024 - Present (Finished 2nd Year)",
      gpa: "",
      courses: [
        "Object-Oriented Programming",
        "Linear Algebra",
        "Probability & Statistics",
        "Discrete Mathematics",
        "Numerical Analysis",
        "Numerical Optimization",
        "Abstract Algebra",
        "Data Structures & Algorithms"
      ]
    }
  ],

  experience: [
    {
      company: "DASH Lab (HPC Lab, BITS Goa)",
      role: "Research Assistant - LLM Inference Systems",
      duration: "Nov 2025 - Present",
      description: "Gaining a comprehensive understanding of Large Language Model (LLM) architectures and inference mechanics.",
      bullets: [
        "Learned how LLM inferencing works and how LLMs function behind the scenes.",
        "Investigated how LLM inference simulators can be designed to analyze workloads in a cost-effective manner."
      ]
    },
    {
      company: "Caarya Innovative",
      role: "AI & Software Engineering Intern (Practice School - I)",
      duration: "May 2026 - Present",
      description: "",
      bullets: []
    },
    {
      company: "Bitskrieg (BITS Goa Cybersecurity Club)",
      role: "Member",
      duration: "Aug 2024 - 2025",
      description: "Participated in cybersecurity training, challenges, and Capture The Flag (CTF) events.",
      bullets: [
        "Secured 8th rank campus-wide in the BITS Goa initial CTF competition.",
        "Practiced web security, cryptography, and reverse engineering challenge-solving."
      ]
    },
    {
      company: "Culinary Club (BITS Goa)",
      role: "Member",
      duration: "Aug 2025 - Present",
      description: "Participated in culinary arts coordination and campus event management.",
      bullets: [
        "Active member organizing workshops and representing the club campus-wide."
      ]
    }
  ],

  projects: [
    {
      id: "cuda-gemm",
      title: "CUDA General Matrix Multiplication (GEMM) Optimizer",
      tag: "GPU & HPC",
      metrics: "92% cuBLAS Performance",
      description: "Optimized a custom General Matrix Multiplication (GEMM) kernel written in NVIDIA CUDA to achieve near-optimal hardware utilization.",
      bullets: [
        "Implemented shared memory tiling, thread tiling, double buffering, and register accumulation to maximize memory bandwidth and compute intensity.",
        "Resolved bank conflicts and leveraged coalesced global memory access to achieve 92% of the throughput of NVIDIA's industry-standard cuBLAS library.",
        "Analyzed memory layout bottlenecks using NVIDIA Nsight Compute to profile occupancy, warp latency, and arithmetic throughput."
      ],
      github: "https://github.com/yllow-lan/fluffy-spoon"
    },
    {
      id: "llm-inference-simulation",
      title: "LLM Inference & Simulation Study",
      tag: "Systems & Simulation",
      metrics: "Ongoing Study",
      description: "Conducted an exploratory study on Large Language Model (LLM) architectures, inference mechanics, and simulation workloads.",
      bullets: [
        "Learned how LLMs work behind the scenes and how LLM inferencing operates under the hood.",
        "Studied design principles for lightweight simulators to model inference workloads cost-effectively."
      ],
      github: "#"
    }
  ],

  skills: {
    categories: [
      {
        name: "HPC & Systems",
        items: ["CUDA", "C++", "C", "NVIDIA Nsight", "Parallel Programming"]
      },
      {
        name: "AI & Machine Learning",
        items: ["PyTorch", "Deep Learning", "Transformers", "LLM Inference", "RAG Systems", "Python"]
      },
      {
        name: "Mathematics",
        items: ["Linear Algebra", "Numerical Analysis", "Probability & Statistics", "Discrete Maths", "Optimization Theory"]
      },
      {
        name: "Web & Tools",
        items: ["Git", "Node.js / Express", "React", "Vanilla CSS / HTML", "PostgreSQL / SQLite", "REST APIs"]
      }
    ]
  },

  qnaPairs: [
    {
      keywords: ["cuda", "gemm", "matrix", "cublas", "multiply", "kernel", "gpu", "nsight", "tiling"],
      question: "Can you tell me about your CUDA Matrix Multiplication project?",
      answer: "Arnav optimized a custom General Matrix Multiplication (GEMM) kernel in NVIDIA CUDA, achieving 92% of the performance of NVIDIA's industry-standard cuBLAS library. He implemented shared memory tiling, register caching, and double buffering to bypass global memory latency, and used NVIDIA Nsight Compute to diagnose warp stalls and resolve shared memory bank conflicts."
    },
    {
      keywords: ["llm", "inference", "simulator", "dash lab", "transformer"],
      question: "What is your LLM inference simulation study about?",
      answer: "At BITS Goa's DASH Lab, Arnav studied how LLMs work behind the scenes and how LLM inferencing operates. He also investigated how LLM inference simulators can be designed to model workloads in a cost-effective manner."
    },
    {
      keywords: ["bits", "goa", "pilani", "college", "gpa", "degree", "mathematics", "maths and computing", "courses"],
      question: "What do you study at BITS Pilani Goa?",
      answer: "Arnav is pursuing a B.Tech. in Mathematics and Computing at BITS Pilani, Goa Campus. He has completed his 2nd year, with coursework highlights including Object-Oriented Programming, Linear Algebra, Probability & Statistics, Numerical Analysis, Numerical Optimization, and Abstract Algebra."
    },
    {
      keywords: ["caarya", "practice school", "internship", "ps1", "innovative"],
      question: "What are you doing at Caarya Innovative?",
      answer: "Arnav is allotted to Caarya Innovative for his Practice School - I (PS-1) internship, which runs after his 2nd year. He is focused on applying his engineering and AI skillset to build smart, client-facing applications, agentic tools, and full-stack solutions."
    },
    {
      keywords: ["contact", "email", "github", "linkedin", "hire", "resume"],
      question: "How can I contact Arnav?",
      answer: "You can reach Arnav via email at f20240843@goa.bits-pilani.ac.in, view his projects on GitHub (github.com/yllow-lan), or connect with him on LinkedIn (linkedin.com/in/arnav-gupta-1a6a33320)."
    },
    {
      keywords: ["skills", "languages", "cpp", "python", "pytorch", "hpc"],
      question: "What are Arnav's core technical skills?",
      answer: "Arnav's core skills are divided into: 1) HPC & Systems (CUDA, C++, Parallel Programming, Nsight), 2) AI/ML (PyTorch, Deep Learning, LLM Inference), 3) Mathematics (Linear Algebra, Probability, Numerical Analysis), and 4) Web & Tools (Git, Node.js, React)."
    },
    {
      keywords: ["club", "clubs", "bitskrieg", "culinary", "ctf", "extracurricular", "extra-curricular"],
      question: "What clubs are you a member of at BITS Goa?",
      answer: "Arnav is a member of Bitskrieg (BITS Goa's cybersecurity club) from August 2024 to 2025, where he secured 8th rank campus-wide in the initial CTF competition. He is also a member of the BITS Goa Culinary Club from August 2025 onwards."
    }
  ]
};
