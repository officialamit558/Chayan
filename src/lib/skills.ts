export const SKILLS = [
  // Programming Languages
  "JavaScript", "TypeScript", "Python", "Java", "C#", "C++", "C", "Go", "Rust", "Swift", "Kotlin",
  "Ruby", "PHP", "Perl", "Scala", "Dart", "R", "MATLAB", "Shell", "Bash",
  // Web Technologies
  "React", "Angular", "Vue", "Next.js", "Nuxt", "Svelte", "Node.js", "Express", "Django", "Flask",
  "Spring Boot", "ASP.NET", "Laravel", "Ruby on Rails", "jQuery", "HTML", "CSS", "SASS", "Tailwind",
  "Bootstrap", "Webpack", "Vite", "GraphQL", "REST API", "gRPC",
  // Mobile
  "React Native", "Flutter", "SwiftUI", "UIKit", "Android SDK", "Xamarin", "Ionic",
  // Cloud & DevOps
  "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "Ansible", "Jenkins", "CI/CD",
  "GitHub Actions", "GitLab CI", "CircleCI", "Nginx", "Linux", "Unix",
  // Databases
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "Cassandra", "DynamoDB",
  "SQLite", "Oracle", "SQL Server", "Firebase", "Supabase",
  // Data & ML
  "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "TensorFlow", "PyTorch",
  "Scikit-learn", "Pandas", "NumPy", "Apache Spark", "Hadoop", "Tableau", "Power BI",
  // Testing
  "Jest", "Mocha", "Cypress", "Playwright", "Selenium", "JUnit", "pytest",
  // Tools & Methodologies
  "Git", "Agile", "Scrum", "JIRA", "Confluence", "Figma", "Adobe XD", "Sketch",
  "Postman", "Swagger", "Kafka", "RabbitMQ", "GraphQL",
  // Soft Skills
  "Team Leadership", "Project Management", "Communication", "Problem Solving",
  // Domain Specific
  "Blockchain", "IoT", "Cybersecurity", "DevOps", "SRE", "Data Engineering",
  // Business & Management
  "Sales", "Marketing", "Business Development", "Operations", "Supply Chain",
  "Logistics", "Procurement", "Inventory Management", "Quality Assurance",
  "Customer Service", "Customer Support", "Account Management", "Key Account Management",
  "Business Analysis", "Management Consulting", "Strategy", "Corporate Strategy",
  "Risk Management", "Compliance", "Audit", "Internal Audit",
  // Finance & Accounting
  "Financial Analysis", "Financial Planning", "Budgeting", "Forecasting",
  "Accounting", "Taxation", "GST", "Tally", "QuickBooks", "SAP",
  "Investment Banking", "Equity Research", "Portfolio Management",
  "Insurance", "Underwriting", "Claims Management",
  // Human Resources
  "Recruitment", "Talent Acquisition", "HR Operations", "Payroll",
  "Performance Management", "Employee Relations", "Learning & Development",
  "Compensation & Benefits", "HR Analytics",
  // Marketing & Communications
  "Digital Marketing", "SEO", "SEM", "Content Marketing", "Social Media",
  "Email Marketing", "Brand Management", "Public Relations", "Media Planning",
  "Market Research", "Product Marketing", "Growth Hacking",
  // Design & Creative
  "UI Design", "UX Design", "Graphic Design", "Motion Design", "Illustration",
  "Video Editing", "Photography", "Copywriting", "Content Writing",
  // Healthcare & Pharma
  "Nursing", "Pharmacy", "Clinical Research", "Medical Coding", "Healthcare Management",
  "Biotechnology", "Lab Testing", "Quality Control",
  // Education & Training
  "Teaching", "Curriculum Development", "Instructional Design", "Training & Development",
  "Academic Research", "E-Learning",
  // Legal
  "Legal Research", "Contract Management", "Corporate Law", "Litigation",
  "Intellectual Property", "Legal Compliance",
  // Others
  "Data Entry", "Administration", "Office Management", "Executive Assistant",
  "Receptionist", "Front Desk", "Security", "Housekeeping",
  "Driving", "Transportation", "Warehouse Operations",
  // Education keywords
  "B.Tech", "M.Tech", "BCA", "MCA", "MBA", "B.Sc", "M.Sc", "PhD", "BE", "ME",
  "Bachelor", "Master", "Diploma", "Graduate", "Post Graduate",
  // Experience
  "Fresher", "Entry Level", "Junior", "Senior", "Lead", "Architect", "Manager",
]

export const EXPERIENCE_PATTERNS = [
  { regex: /(\d+)\+?\s*years?\s*(of\s*)?experience/i, weight: 1 },
  { regex: /experience\s*:?\s*(\d+)\s*[-–to]+\s*(\d+)\s*years?/i, weight: 1 },
  { regex: /(\d+)\s*yr/i, weight: 1 },
]

export const EDUCATION_PATTERNS = [
  { regex: /B\.?\s*Tech|Bachelor\s*of\s*Technology/i, level: "bachelor" },
  { regex: /M\.?\s*Tech|Master\s*of\s*Technology/i, level: "master" },
  { regex: /B\.?\s*Sc|Bachelor\s*of\s*Science/i, level: "bachelor" },
  { regex: /M\.?\s*Sc|Master\s*of\s*Science/i, level: "master" },
  { regex: /BCA|Bachelor\s*of\s*Computer\s*Applications/i, level: "bachelor" },
  { regex: /MCA|Master\s*of\s*Computer\s*Applications/i, level: "master" },
  { regex: /MBA|Master\s*of\s*Business\s*Administration/i, level: "master" },
  { regex: /PhD|Doctorate/i, level: "phd" },
  { regex: /B\.?\s*A\.?|Bachelor\s*of\s*Arts/i, level: "bachelor" },
  { regex: /M\.?\s*A\.?|Master\s*of\s*Arts/i, level: "master" },
  { regex: /BE|Bachelor\s*of\s*Engineering/i, level: "bachelor" },
  { regex: /ME|Master\s*of\s*Engineering/i, level: "master" },
  { regex: /Diploma/i, level: "diploma" },
  { regex: /12th|Higher\s*Secondary|Intermediate/i, level: "12th" },
  { regex: /10th|Matriculation/i, level: "10th" },
]

export function extractSkills(text: string): string[] {
  const found = new Set<string>()
  const lower = text.toLowerCase()
  for (const skill of SKILLS) {
    if (lower.includes(skill.toLowerCase())) {
      found.add(skill)
    }
  }
  return Array.from(found).sort()
}

export function extractExperienceYears(text: string): number {
  for (const pattern of EXPERIENCE_PATTERNS) {
    const match = text.match(pattern.regex)
    if (match) {
      const years = parseInt(match[1])
      if (!isNaN(years)) return years
    }
  }
  return 0
}

export function extractEducationLevel(text: string): string {
  for (const pattern of EDUCATION_PATTERNS) {
    if (pattern.regex.test(text)) {
      return pattern.level
    }
  }
  return "unknown"
}

export function extractLocations(text: string): string[] {
  const cities = [
    "Bangalore", "Bengaluru", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Kolkata",
    "Pune", "Ahmedabad", "Jaipur", "Noida", "Gurgaon", "Gurugram", "Lucknow",
    "Remote", "Work from Home", "Wfh",
  ]
  const found: string[] = []
  const lower = text.toLowerCase()
  for (const city of cities) {
    if (lower.includes(city.toLowerCase())) {
      found.push(city === "Bengaluru" ? "Bangalore" : city === "Gurugram" ? "Gurgaon" : city === "Wfh" || city === "Work from Home" ? "Remote" : city)
    }
  }
  return [...new Set(found)]
}

export function computeMatchScore(
  resumeSkills: string[],
  resumeExperience: number,
  resumeEducation: string,
  resumeLocations: string[],
  job: { title: string; description: string | null; category: string | null; location: string | null; experience: string | null; salary: string | null }
): { score: number; matchedSkills: string[]; details: string[] } {
  const details: string[] = []
  const jobText = `${job.title} ${job.description || ""} ${job.category || ""}`.toLowerCase()
  const matchedSkills = resumeSkills.filter(s => jobText.includes(s.toLowerCase()))
  const skillScore = resumeSkills.length > 0 ? (matchedSkills.length / Math.max(resumeSkills.length, 1)) * 50 : 0
  if (matchedSkills.length > 0) {
    details.push(`Matched ${matchedSkills.length} skills`)
  }

  let expScore = 0
  if (job.experience) {
    const expMatch = job.experience.match(/(\d+)/)
    if (expMatch) {
      const requiredExp = parseInt(expMatch[1])
      if (resumeExperience >= requiredExp) {
        expScore = 20
        details.push(`Experience meets requirements (${resumeExperience}yrs)`)
      } else if (resumeExperience > 0) {
        expScore = Math.round((resumeExperience / requiredExp) * 10)
        details.push(`Experience: ${resumeExperience}yrs (need ${requiredExp}yrs)`)
      }
    }
  } else {
    expScore = resumeExperience > 0 ? 20 : 10
  }

  let eduScore = 0
  if (resumeEducation !== "unknown") {
    const eduLevels = ["10th", "12th", "diploma", "bachelor", "master", "phd"]
    const eduIndex = eduLevels.indexOf(resumeEducation)
    const jobEduMatch = jobText.match(/(bachelor|master|phd|diploma|graduate|post\s*graduate|m\.?\s*tech|b\.?\s*tech|mca|bca)/i)
    if (!jobEduMatch || eduIndex >= 0) {
      eduScore = 15
      details.push("Education matches requirements")
    } else {
      eduScore = 5
    }
  } else {
    eduScore = 10
  }

  let locScore = 0
  if (resumeLocations.length > 0 && job.location) {
    const jobLocLower = job.location.toLowerCase()
    const matchedLoc = resumeLocations.some(l => jobLocLower.includes(l.toLowerCase()))
    if (matchedLoc || jobLocLower.includes("remote") || jobLocLower.includes("multiple") || jobLocLower.includes("across india")) {
      locScore = 15
      details.push("Location compatible")
    }
  } else {
    locScore = 10
  }

  const score = Math.min(100, Math.round(skillScore + expScore + eduScore + locScore))
  return { score, matchedSkills, details }
}

export function generateImprovementTips(score: number, matchedSkills: string[], resumeSkills: string[], job: { title: string; description: string | null; category: string | null; experience: string | null; salary: string | null }): string[] {
  const tips: string[] = []
  if (score < 40) {
    tips.push("Your profile needs significant improvement to match this role")
  }
  const jobText = `${job.title} ${job.description || ""} ${job.category || ""}`.toLowerCase()
  const missingSkills = resumeSkills.filter(s => !jobText.includes(s.toLowerCase()))
  if (missingSkills.length > 0 && matchedSkills.length < 3) {
    tips.push("Add more relevant skills from your experience to your resume")
  }
  if (job.experience) {
    const expMatch = job.experience.match(/(\d+)/)
    if (expMatch) {
      tips.push(`Gain ${expMatch[1]}+ years of experience in this domain`)
    }
  }
  if (score >= 70) {
    tips.push("You are a strong candidate! Highlight your achievements in the application")
  } else if (score >= 50) {
    tips.push("You have a good profile. Tailor your resume to emphasize matching skills")
  }
  return tips
}