export const adsenseConfig = {
  publisherId: process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || "",
  enabled: !!process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID,
}

export const siteConfig = {
  name: "Chayan",
  description: "Select right. serve right. Your trusted government job portal. Latest notifications, results, admit cards, answer keys and more.",
  url: (process.env.NEXT_PUBLIC_APP_URL || "https://chayan.in").replace(/\/+$/, ""),
  ogImage: `${(process.env.NEXT_PUBLIC_APP_URL || "https://chayan.in").replace(/\/+$/, "")}/og.png`,
  links: {
    twitter: "https://twitter.com/chayan",
    facebook: "https://facebook.com/chayan",
    youtube: "https://youtube.com/@chayan",
  },
}

export const mainNav = [
  { title: "Home", href: "/" },
  { title: "Jobs", href: "/jobs" },
  { title: "Results", href: "/results" },
  { title: "Admit Cards", href: "/admit-cards" },
  { title: "Answer Keys", href: "/answer-keys" },
  { title: "Admissions", href: "/admissions" },
  { title: "Syllabus", href: "/syllabus" },
  { title: "Notifications", href: "/notifications" },
  { title: "Blog", href: "/blog" },
]

export const footerLinks = [
  {
    title: "Quick Links",
    links: [
      { label: "Latest Jobs", href: "/jobs" },
      { label: "Exam Results", href: "/results" },
      { label: "Admit Cards", href: "/admit-cards" },
      { label: "Answer Keys", href: "/answer-keys" },
      { label: "Admissions", href: "/admissions" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Syllabus", href: "/syllabus" },
      { label: "Notifications", href: "/notifications" },
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
  {
    title: "Categories",
    links: [
      { label: "Central Govt Jobs", href: "/category/central" },
      { label: "State Govt Jobs", href: "/category/state" },
      { label: "Bank Jobs", href: "/category/bank" },
      { label: "Railway Jobs", href: "/category/railway" },
      { label: "Defence Jobs", href: "/category/defence" },
    ],
  },
]

export const qualificationOptions = [
  { label: "10th Pass", value: "10th" },
  { label: "12th Pass", value: "12th" },
  { label: "ITI", value: "iti" },
  { label: "Diploma", value: "diploma" },
  { label: "Graduate", value: "graduate" },
  { label: "Post Graduate", value: "post_graduate" },
  { label: "Engineering", value: "engineering" },
  { label: "Medical", value: "medical" },
  { label: "Law", value: "law" },
  { label: "PhD", value: "phd" },
  { label: "CA", value: "ca" },
  { label: "Any", value: "any" },
]

export const salaryRanges = [
  { label: "Up to ₹25,000", value: "0-25000" },
  { label: "₹25,000 - ₹50,000", value: "25000-50000" },
  { label: "₹50,000 - ₹1,00,000", value: "50000-100000" },
  { label: "₹1,00,000 - ₹2,00,000", value: "100000-200000" },
  { label: "Above ₹2,00,000", value: "200000+" },
]

export const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
]

export const categoryTypes = [
  { label: "Central Govt Jobs", value: "central" },
  { label: "State Govt Jobs", value: "state" },
  { label: "Bank Jobs", value: "bank" },
  { label: "Railway Jobs", value: "railway" },
  { label: "Defence Jobs", value: "defence" },
  { label: "Teaching Jobs", value: "teaching" },
  { label: "Police Jobs", value: "police" },
  { label: "Engineering Jobs", value: "engineering" },
  { label: "Medical Jobs", value: "medical" },
  { label: "Post Office Jobs", value: "post_office" },
  { label: "Forest Jobs", value: "forest" },
  { label: "Public Sector", value: "public_sector" },
  { label: "Judiciary", value: "judiciary" },
  { label: "Legislative Assembly", value: "legislative_assembly" },
]

export const jobStatusOptions = [
  { label: "Active", value: "ACTIVE" },
  { label: "Expired", value: "EXPIRED" },
  { label: "Upcoming", value: "UPCOMING" },
]

export const sortOptions = [
  { label: "Latest First", value: "latest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Last Date (Earliest)", value: "last_date_asc" },
  { label: "Last Date (Latest)", value: "last_date_desc" },
  { label: "Most Viewed", value: "most_viewed" },
  { label: "A-Z", value: "name_asc" },
  { label: "Z-A", value: "name_desc" },
]
