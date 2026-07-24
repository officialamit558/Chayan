import { PrismaClient, Role, JobType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import slugify from 'slugify';

const prisma = new PrismaClient();

async function main() {
  const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const now = new Date();
  const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000);
  const daysFromNow = (d: number) => new Date(now.getTime() + d * 86400000);

  // ── Categories ──
  if ((await prisma.category.count()) === 0) {
    const catData = [
      'Central Govt','State Govt','Banking','Railways','Defence','Teaching',
      'Engineering','Medical','Police','Judiciary','Public Sector','Research',
    ];
    await prisma.category.createMany({
      data: catData.map(name => ({ name, slug: slug(name), description: `${name} Jobs in India` })),
    });
    console.log('  categories seeded');
  }

  // ── States ──
  if ((await prisma.state.count()) === 0) {
    const names = [
      'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana',
      'Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur',
      'Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
      'Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Andaman and Nicobar Islands','Chandigarh',
      'Dadra and Nagar Haveli and Daman and Diu','Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry',
    ];
    await prisma.state.createMany({ data: names.map(n => ({ name: n, slug: slug(n) })) });
    console.log('  states seeded');
  }

  // ── Departments ──
  if ((await prisma.department.count()) === 0) {
    await prisma.department.createMany({
      data: [
        { name: 'Staff Selection Commission', slug: 'staff-selection-commission', description: 'SSC - Conducts CGL, CHSL, MTS, CPO exams' },
        { name: 'Union Public Service Commission', slug: 'union-public-service-commission', description: 'UPSC - Conducts Civil Services, NDA, CDS exams' },
        { name: 'Railway Recruitment Board', slug: 'railway-recruitment-board', description: 'RRB - Conducts NTPC, ALP, Group D exams' },
        { name: 'Institute of Banking Personnel Selection', slug: 'institute-of-banking-personnel-selection', description: 'IBPS - Conducts PO, Clerk, SO, RRB exams' },
        { name: 'Reserve Bank of India', slug: 'reserve-bank-of-india', description: 'RBI - Conducts Grade B, Assistant exams' },
        { name: 'Securities and Exchange Board of India', slug: 'securities-and-exchange-board-of-india', description: 'SEBI - Conducts Grade A exams' },
        { name: 'NABARD', slug: 'nabard', description: 'National Bank for Agriculture and Rural Development' },
        { name: 'Food Corporation of India', slug: 'food-corporation-of-india', description: 'FCI - Conducts Manager, Watchman exams' },
        { name: 'Defence Research and Development Organisation', slug: 'defence-research-and-development-organisation', description: 'DRDO - Scientist and Technical jobs' },
        { name: 'Indian Space Research Organisation', slug: 'indian-space-research-organisation', description: 'ISRO - Scientist and Engineer jobs' },
        { name: 'All India Institute of Medical Sciences', slug: 'all-india-institute-of-medical-sciences', description: 'AIIMS - Medical and Nursing jobs' },
        { name: 'Bharat Sanchar Nigam Limited', slug: 'bharat-sanchar-nigam-limited', description: 'BSNL - Telecom and Engineering jobs' },
        { name: 'Oil and Natural Gas Corporation', slug: 'oil-and-natural-gas-corporation', description: 'ONGC - Oil & Gas sector jobs' },
        { name: 'National Thermal Power Corporation', slug: 'national-thermal-power-corporation', description: 'NTPC - Power sector jobs' },
        { name: 'Steel Authority of India Limited', slug: 'steel-authority-of-india-limited', description: 'SAIL - Steel sector jobs' },
        { name: 'Hindustan Aeronautics Limited', slug: 'hindustan-aeronautics-limited', description: 'HAL - Aerospace jobs' },
        { name: 'Bharat Heavy Electricals Limited', slug: 'bharat-heavy-electricals-limited', description: 'BHEL - Heavy Electricals jobs' },
        { name: 'Central Board of Secondary Education', slug: 'central-board-of-secondary-education', description: 'CBSE - Teaching and academic jobs' },
      ],
    });
    console.log('  departments seeded');
  }

  // ── Tags ──
  if ((await prisma.tag.count()) === 0) {
    await prisma.tag.createMany({
      data: [
        'government-jobs','ssc','upsc','banking','railways','defence','teaching','engineering','medical',
        'police','judiciary','public-sector','research','admit-card','result','answer-key','syllabus','admission',
      ].map(n => ({ name: n, slug: n })),
    });
    console.log('  tags seeded');
  }

  // ── Admin User ──
  if ((await prisma.user.count()) === 0) {
    const pw = await bcrypt.hash('Admin@123', 12);
    await prisma.user.create({ data: { name: 'Admin', email: 'admin@chayan.com', password: pw, role: Role.ADMIN, emailVerified: new Date() } });
    await prisma.adminUser.create({ data: { name: 'Super Admin', email: 'admin@chayan.com', password: pw, role: 'ADMIN' } });
    console.log('  admin user seeded');
  }

  // ── Government Jobs ──
  if ((await prisma.job.count()) === 0) {
    const cat = Object.fromEntries((await prisma.category.findMany()).map(c => [c.name, c.id]));
    const st = Object.fromEntries((await prisma.state.findMany()).map(s => [s.name, s.id]));
    const dep = Object.fromEntries((await prisma.department.findMany()).map(d => [d.name.replace(/^(Staff Selection Commission|Union Public|Railway Recruitment|Institute of Banking|Reserve Bank of India|Securities and Exchange Board of India|NABARD|Food Corporation of India|Defence Research|Indian Space Research|All India Institute of Medical Sciences|Bharat Sanchar|Oil and Natural Gas|National Thermal Power|Steel Authority of India|Hindustan Aeronautics|Bharat Heavy|Central Board of Secondary Education).*$/, '$1'), d.id]));

    const deptMap: Record<string, string> = {};
    const allDepts = await prisma.department.findMany();
    deptMap['SSC'] = allDepts.find(d => d.name.startsWith('Staff Selection Commission'))!.id;
    deptMap['UPSC'] = allDepts.find(d => d.name.startsWith('Union Public'))!.id;
    deptMap['IBPS'] = allDepts.find(d => d.name.startsWith('Institute of Banking'))!.id;
    deptMap['RRB'] = allDepts.find(d => d.name.startsWith('Railway'))!.id;
    deptMap['RBI'] = allDepts.find(d => d.name.startsWith('Reserve Bank'))!.id;
    deptMap['SEBI'] = allDepts.find(d => d.name.startsWith('Securities'))!.id;
    deptMap['DRDO'] = allDepts.find(d => d.name.startsWith('Defence Research'))!.id;
    deptMap['ISRO'] = allDepts.find(d => d.name.startsWith('Indian Space'))!.id;
    deptMap['AIIMS'] = allDepts.find(d => d.name.startsWith('All India Institute'))!.id;
    deptMap['ONGC'] = allDepts.find(d => d.name.startsWith('Oil and Natural'))!.id;
    deptMap['FCI'] = allDepts.find(d => d.name.startsWith('Food Corporation'))!.id;
    deptMap['BSNL'] = allDepts.find(d => d.name.startsWith('Bharat Sanchar'))!.id;
    deptMap['CBSE'] = allDepts.find(d => d.name.startsWith('Central Board'))!.id;

    await prisma.job.createMany({
      data: [
        { title: 'SSC Combined Graduate Level Exam 2026', slug: 'ssc-cgl-2026', departmentId: deptMap['SSC'], categoryId: cat['Central Govt'], stateId: st['Delhi'], advertisementNo: 'SSC/CGL/2026/01', totalVacancies: 7500, salary: 'Rs. 35,400 - 1,12,400/-', location: 'Across India', ageLimit: '18-32 years', education: "Bachelor's Degree", applicationFee: 'Rs. 100 (General), SC/ST/PH/Ex-Servicemen: Nil', status: 'ACTIVE', startDate: daysAgo(5), lastDate: daysFromNow(45) },
        { title: 'UPSC Civil Services Examination 2026', slug: 'upsc-civil-services-2026', departmentId: deptMap['UPSC'], categoryId: cat['Central Govt'], stateId: st['Delhi'], advertisementNo: 'UPSC/CSE/2026/01', totalVacancies: 1100, salary: 'Rs. 56,100 - 2,50,000/-', location: 'Across India', ageLimit: '21-32 years', education: "Bachelor's Degree", applicationFee: 'Rs. 100 (General), SC/ST/PH/Female: Nil', status: 'UPCOMING', startDate: daysFromNow(20), lastDate: daysFromNow(60) },
        { title: 'IBPS Probationary Officers 2026', slug: 'ibps-po-2026', departmentId: deptMap['IBPS'], categoryId: cat['Banking'], stateId: st['Delhi'], advertisementNo: 'IBPS/PO/2026/01', totalVacancies: 4500, salary: 'Rs. 36,000 - 63,840/-', location: 'Across India', ageLimit: '20-30 years', education: 'Graduation in any discipline', applicationFee: 'Rs. 850 (General), SC/ST/PH: Rs. 175', status: 'UPCOMING', startDate: daysFromNow(90), lastDate: daysFromNow(120) },
        { title: 'RRB NTPC Graduate Level Recruitment 2026', slug: 'rrb-ntpc-2026', departmentId: deptMap['RRB'], categoryId: cat['Railways'], stateId: st['Delhi'], advertisementNo: 'RRB/NTPC/2026/01', totalVacancies: 12000, salary: 'Rs. 19,900 - 1,42,400/-', location: 'Across India', ageLimit: '18-33 years', education: "Bachelor's Degree", applicationFee: 'Rs. 500 (General/OBC), SC/ST/PH: Rs. 250', status: 'ACTIVE', startDate: daysAgo(1), lastDate: daysFromNow(30) },
        { title: 'RBI Grade B Officers 2026', slug: 'rbi-grade-b-2026', departmentId: deptMap['RBI'], categoryId: cat['Banking'], stateId: st['Delhi'], advertisementNo: 'RBI/GR-B/2026/01', totalVacancies: 350, salary: 'Rs. 55,200 - 1,17,500/-', location: 'Across India', ageLimit: '21-30 years', education: "Bachelor's Degree with 60% marks", applicationFee: 'Rs. 850 (General/OBC), SC/ST/PH: Rs. 100', status: 'UPCOMING', startDate: daysFromNow(10), lastDate: daysFromNow(40) },
        { title: 'DRDO Scientist Recruitment 2026', slug: 'drdo-scientist-2026', departmentId: deptMap['DRDO'], categoryId: cat['Research'], stateId: st['Delhi'], advertisementNo: 'DRDO/SCIENTIST/2026/01', totalVacancies: 250, salary: 'Rs. 56,100 - 1,77,500/-', location: 'Across India', ageLimit: '18-35 years', education: 'ME/M.Tech or PhD', applicationFee: 'Rs. 100 (General), SC/ST/PH: Nil', status: 'ACTIVE', startDate: daysAgo(10), lastDate: daysFromNow(20) },
        { title: 'ISRO Scientist/Engineer Recruitment 2026', slug: 'isro-scientist-2026', departmentId: deptMap['ISRO'], categoryId: cat['Engineering'], stateId: st['Karnataka'], advertisementNo: 'ISRO/SC/2026/01', totalVacancies: 400, salary: 'Rs. 56,100 - 1,77,500/-', location: 'Bangalore, Trivandrum, Ahmedabad', ageLimit: '18-35 years', education: 'BE/B.Tech with 65% marks', applicationFee: 'Rs. 100 (General), SC/ST/PH/Female: Nil', status: 'UPCOMING', startDate: daysFromNow(30), lastDate: daysFromNow(60) },
        { title: 'AIIMS Nursing Officer Recruitment 2026', slug: 'aiims-nursing-officer-2026', departmentId: deptMap['AIIMS'], categoryId: cat['Medical'], stateId: st['Delhi'], advertisementNo: 'AIIMS/NO/2026/01', totalVacancies: 1800, salary: 'Rs. 44,900 - 1,42,400/-', location: 'Across AIIMS Institutions', ageLimit: '18-35 years', education: 'B.Sc Nursing or GNM', applicationFee: 'Rs. 1500 (General/OBC), SC/ST: Rs. 1000', status: 'ACTIVE', startDate: daysAgo(3), lastDate: daysFromNow(25) },
        { title: 'ONGC Executive Trainee Recruitment 2026', slug: 'ongc-executive-trainee-2026', departmentId: deptMap['ONGC'], categoryId: cat['Public Sector'], stateId: st['Delhi'], advertisementNo: 'ONGC/ET/2026/01', totalVacancies: 600, salary: 'Rs. 60,000 - 1,80,000/-', location: 'Across India', ageLimit: '18-30 years', education: 'BE/B.Tech with GATE score', applicationFee: 'Rs. 500 (General/OBC), SC/ST/PH: Nil', status: 'ACTIVE', startDate: daysAgo(7), lastDate: daysFromNow(18) },
        { title: 'SEBI Grade A Assistant Manager 2026', slug: 'sebi-grade-a-2026', departmentId: deptMap['SEBI'], categoryId: cat['Banking'], stateId: st['Delhi'], advertisementNo: 'SEBI/GR-A/2026/01', totalVacancies: 100, salary: 'Rs. 44,500 - 1,41,500/-', location: 'Mumbai, Delhi, Chennai, Kolkata', ageLimit: '21-30 years', education: "Bachelor's Degree", applicationFee: 'Rs. 1000 (General/OBC), SC/ST/PH: Rs. 100', status: 'UPCOMING', startDate: daysFromNow(15), lastDate: daysFromNow(45) },
        { title: 'FCI Manager Recruitment 2026', slug: 'fci-manager-2026', departmentId: deptMap['FCI'], categoryId: cat['Central Govt'], stateId: st['Delhi'], advertisementNo: 'FCI/MGR/2026/01', totalVacancies: 900, salary: 'Rs. 44,900 - 1,42,400/-', location: 'Across India', ageLimit: '18-35 years', education: "Bachelor's Degree", applicationFee: 'Rs. 800 (General/OBC), SC/ST/PH: Nil', status: 'UPCOMING', startDate: daysFromNow(60), lastDate: daysFromNow(90) },
        { title: 'BSNL Junior Engineer Recruitment 2026', slug: 'bsnl-je-2026', departmentId: deptMap['BSNL'], categoryId: cat['Engineering'], stateId: st['Delhi'], advertisementNo: 'BSNL/JE/2026/01', totalVacancies: 2000, salary: 'Rs. 25,000 - 55,000/-', location: 'Across India', ageLimit: '18-30 years', education: "Diploma or Bachelor's in Engineering", applicationFee: 'Rs. 1000 (General/OBC), SC/ST/PH: Rs. 500', status: 'UPCOMING', startDate: daysFromNow(45), lastDate: daysFromNow(75) },
      ],
    });
    console.log('  government jobs seeded');

    const allJobs = await prisma.job.findMany({ orderBy: { createdAt: 'desc' } });
    const j = (slug: string) => allJobs.find(j => j.slug === slug)!;

    await prisma.result.createMany({
      data: [
        { title: 'SSC CGL 2025 Tier I Result', slug: 'ssc-cgl-2025-tier1-result', departmentId: deptMap['SSC'], categoryId: cat['Central Govt'], jobId: j('ssc-cgl-2026').id, pdfUrl: 'https://ssc.nic.in/results/ssc-cgl-2025-tier1.pdf', resultDate: daysAgo(15), status: 'Published' },
        { title: 'UPSC Civil Services Prelims 2025 Result', slug: 'upsc-cse-2025-prelims-result', departmentId: deptMap['UPSC'], categoryId: cat['Central Govt'], jobId: j('upsc-civil-services-2026').id, pdfUrl: 'https://upsc.gov.in/results/upsc-cse-2025-prelims.pdf', resultDate: daysAgo(30), status: 'Published' },
        { title: 'IBPS PO 2025 Main Result', slug: 'ibps-po-2025-main-result', departmentId: deptMap['IBPS'], categoryId: cat['Banking'], jobId: j('ibps-po-2026').id, pdfUrl: 'https://ibps.in/results/ibps-po-2025-main.pdf', resultDate: daysAgo(45), status: 'Published' },
        { title: 'RRB ALP 2025 Result', slug: 'rrb-alp-2025-result', departmentId: deptMap['RRB'], categoryId: cat['Railways'], jobId: j('rrb-ntpc-2026').id, pdfUrl: 'https://rrb.gov.in/results/rrb-alp-2025.pdf', resultDate: daysAgo(10), status: 'Published' },
        { title: 'RBI Assistant 2025 Final Result', slug: 'rbi-assistant-2025-result', departmentId: deptMap['RBI'], categoryId: cat['Banking'], jobId: j('rbi-grade-b-2026').id, pdfUrl: 'https://rbi.org.in/results/rbi-assistant-2025.pdf', resultDate: daysAgo(60), status: 'Published' },
      ],
    });
    console.log('  results seeded');

    await prisma.admitCard.createMany({
      data: [
        { title: 'SSC CHSL 2026 Tier I Admit Card', slug: 'ssc-chsl-2026-admit-card', departmentId: deptMap['SSC'], categoryId: cat['Central Govt'], jobId: j('ssc-cgl-2026').id, examDate: daysFromNow(15), downloadUrl: 'https://ssc.nic.in/admitcards/ssc-chsl-2026.pdf', status: 'Available' },
        { title: 'UPSC NDA 2026 Admit Card', slug: 'upsc-nda-2026-admit-card', departmentId: deptMap['UPSC'], categoryId: cat['Defence'], jobId: j('upsc-civil-services-2026').id, examDate: daysFromNow(20), downloadUrl: 'https://upsc.gov.in/admitcards/upsc-nda-2026.pdf', status: 'Available' },
        { title: 'IBPS Clerk 2026 Prelims Admit Card', slug: 'ibps-clerk-2026-admit-card', departmentId: deptMap['IBPS'], categoryId: cat['Banking'], jobId: j('ibps-po-2026').id, examDate: daysFromNow(10), downloadUrl: 'https://ibps.in/admitcards/ibps-clerk-2026.pdf', status: 'Available' },
        { title: 'RRB Group D 2026 Admit Card', slug: 'rrb-group-d-2026-admit-card', departmentId: deptMap['RRB'], categoryId: cat['Railways'], jobId: j('rrb-ntpc-2026').id, examDate: daysFromNow(25), downloadUrl: 'https://rrb.gov.in/admitcards/rrb-group-d-2026.pdf', status: 'Available' },
        { title: 'CTET 2026 Admit Card', slug: 'ctet-2026-admit-card', departmentId: deptMap['CBSE'], categoryId: cat['Teaching'], examDate: daysFromNow(30), downloadUrl: 'https://ctet.nic.in/admitcards/ctet-2026.pdf', status: 'Available' },
      ],
    });
    console.log('  admit cards seeded');

    await prisma.answerKey.createMany({
      data: [
        { title: 'SSC CPO 2025 Paper I Answer Key', slug: 'ssc-cpo-2025-answer-key', departmentId: deptMap['SSC'], categoryId: cat['Central Govt'], jobId: j('ssc-cgl-2026').id, pdfUrl: 'https://ssc.nic.in/answerkeys/ssc-cpo-2025.pdf', status: 'Published' },
        { title: 'UPSC EPFO 2025 Answer Key', slug: 'upsc-epfo-2025-answer-key', departmentId: deptMap['UPSC'], categoryId: cat['Central Govt'], jobId: j('upsc-civil-services-2026').id, pdfUrl: 'https://upsc.gov.in/answerkeys/upsc-epfo-2025.pdf', status: 'Published' },
        { title: 'IBPS RRB 2025 Officer Scale I Answer Key', slug: 'ibps-rrb-2025-answer-key', departmentId: deptMap['IBPS'], categoryId: cat['Banking'], jobId: j('ibps-po-2026').id, pdfUrl: 'https://ibps.in/answerkeys/ibps-rrb-2025.pdf', status: 'Published' },
      ],
    });
    console.log('  answer keys seeded');

    await prisma.admission.createMany({
      data: [
        { title: 'IGNOU June 2026 Admission Open', slug: 'ignou-june-2026-admission', departmentId: deptMap['SSC'], categoryId: cat['Teaching'], startDate: daysAgo(10), lastDate: daysFromNow(20), applicationFee: 'Rs. 200 - 1000 depending on programme', status: 'Open' },
        { title: 'JNU PG Admission 2026', slug: 'jnu-pg-admission-2026', departmentId: deptMap['UPSC'], categoryId: cat['Teaching'], startDate: daysAgo(5), lastDate: daysFromNow(35), applicationFee: 'Rs. 1000 (General), Rs. 500 (SC/ST)', status: 'Open' },
        { title: 'DU UG Admission 2026', slug: 'du-ug-admission-2026', departmentId: deptMap['CBSE'], categoryId: cat['Teaching'], startDate: daysAgo(20), lastDate: daysFromNow(40), applicationFee: 'Rs. 750 (General), Rs. 350 (SC/ST)', status: 'Open' },
      ],
    });
    console.log('  admissions seeded');

    await prisma.syllabus.createMany({
      data: [
        { title: 'SSC CGL Syllabus 2026', slug: 'ssc-cgl-syllabus-2026', departmentId: deptMap['SSC'], categoryId: cat['Central Govt'], jobId: j('ssc-cgl-2026').id, subjects: 'General Intelligence & Reasoning, General Awareness, Quantitative Aptitude, English Comprehension', status: 'Published' },
        { title: 'UPSC Civil Services Syllabus 2026', slug: 'upsc-civil-services-syllabus-2026', departmentId: deptMap['UPSC'], categoryId: cat['Central Govt'], jobId: j('upsc-civil-services-2026').id, subjects: 'Prelims: GS I, CSAT. Mains: Essay, GS I-IV, Optional', status: 'Published' },
        { title: 'IBPS PO Syllabus 2026', slug: 'ibps-po-syllabus-2026', departmentId: deptMap['IBPS'], categoryId: cat['Banking'], jobId: j('ibps-po-2026').id, subjects: 'Reasoning, Quantitative Aptitude, English, General Awareness, Computer Knowledge', status: 'Published' },
      ],
    });
    console.log('  syllabus seeded');

    await prisma.notification.createMany({
      data: [
        { title: 'SSC Calendar 2026 Released: Exam Dates Announced', slug: 'ssc-calendar-2026-released', content: 'SSC has released the official calendar for 2026 including dates for CGL, CHSL, MTS, CPO.', categoryId: cat['Central Govt'], type: 'Breaking', isTrending: true, views: 15200 },
        { title: 'UPSC Civil Services 2026 Notification Out', slug: 'upsc-civil-services-2026-notification', content: 'UPSC released notification for CSE 2026. 1100 vacancies announced.', categoryId: cat['Central Govt'], type: 'Job Alert', isTrending: true, views: 28400 },
        { title: 'IBPS PO 2026 Notification in July', slug: 'ibps-po-2026-notification-july', content: 'IBPS PO 2026 prelims scheduled for September 2026.', categoryId: cat['Banking'], type: 'Update', isTrending: false, views: 8900 },
        { title: 'Railway Recruitment 2026: RRB NTPC Open', slug: 'railway-recruitment-2026-rrb-ntpc', content: 'RRB started NTPC Graduate Level recruitment with 12,000 vacancies.', categoryId: cat['Railways'], type: 'Job Alert', isTrending: true, views: 32100 },
        { title: 'CBSE CTET 2026 Application Begins', slug: 'cbse-ctet-2026-application-begins', content: 'CTET 2026 applications open. Computer-based test at centres across India.', categoryId: cat['Teaching'], type: 'Update', isTrending: false, views: 12500 },
      ],
    });
    console.log('  notifications seeded');

    await prisma.jobView.createMany({
      data: allJobs.slice(0, 12).map((j, i) => ({ jobId: j.id, views: [45000, 52000, 38000, 41000, 28000, 15000, 22000, 18000, 12000, 9500, 8000, 6500][i] || 5000, date: i < 8 ? daysAgo(1) : daysAgo(2) })),
    });
    console.log('  job views seeded');
  }

  // ── Private Jobs (idempotent) ──
  if ((await prisma.company.count()) === 0) {
    const companyData = [
      { name: 'Google', slug: 'google', website: 'https://careers.google.com', description: 'Google is an American multinational technology company.' },
      { name: 'Microsoft', slug: 'microsoft', website: 'https://careers.microsoft.com', description: 'Microsoft Corporation is an American multinational technology corporation.' },
      { name: 'Amazon', slug: 'amazon', website: 'https://amazon.jobs', description: 'Amazon is an American multinational technology company.' },
      { name: 'Flipkart', slug: 'flipkart', website: 'https://www.flipkartcareers.com', description: 'Flipkart is an Indian e-commerce company.' },
      { name: 'Swiggy', slug: 'swiggy', website: 'https://careers.swiggy.com', description: 'Swiggy is an Indian online food ordering and delivery platform.' },
      { name: 'Tata Consultancy Services', slug: 'tcs', website: 'https://www.tcs.com/careers', description: 'TCS is an Indian multinational IT services company.' },
      { name: 'Infosys', slug: 'infosys', website: 'https://www.infosys.com/careers', description: 'Infosys is an Indian multinational IT company.' },
      { name: 'Zomato', slug: 'zomato', website: 'https://www.zomato.com/careers', description: 'Zomato is an Indian restaurant aggregator and food delivery company.' },
      { name: 'Paytm', slug: 'paytm', website: 'https://paytm.com/careers', description: 'Paytm is an Indian fintech company.' },
      { name: "BYJU's", slug: 'byjus', website: 'https://byjus.com/careers', description: "BYJU's is an Indian educational technology company." },
    ];
    for (const c of companyData) {
      await prisma.company.create({ data: c });
    }
    console.log('  companies seeded');

    const comp = Object.fromEntries((await prisma.company.findMany()).map(c => [c.name, c.id]));
    const now = new Date();

    await prisma.privateJob.createMany({
      data: [
        { title: 'Software Engineer III', slug: 'google-software-engineer-iii-2026', companyId: comp['Google'], type: JobType.FULL_TIME, category: 'Engineering', description: '<h2>About the Job</h2><p>Google is looking for experienced Software Engineers to build next-generation technologies.</p>', location: 'Bangalore, Karnataka', salary: '₹30,00,000 - ₹50,00,000 / year', experience: '3-6 years', applicationUrl: 'https://careers.google.com/jobs', lastDate: daysFromNow(60), status: 'ACTIVE' },
        { title: 'Senior Software Engineer - Azure Cloud', slug: 'microsoft-senior-software-engineer-azure-2026', companyId: comp['Microsoft'], type: JobType.FULL_TIME, category: 'Engineering', description: '<h2>About the Role</h2><p>Microsoft Azure is seeking a Senior Software Engineer to design and build scalable cloud services.</p>', location: 'Hyderabad, Telangana', salary: '₹35,00,000 - ₹60,00,000 / year', experience: '5-8 years', applicationUrl: 'https://careers.microsoft.com', lastDate: daysFromNow(45), status: 'ACTIVE' },
        { title: 'Operations Manager - Fulfillment Center', slug: 'amazon-operations-manager-2026', companyId: comp['Amazon'], type: JobType.FULL_TIME, category: 'Operations', description: '<h2>About the Role</h2><p>Amazon is seeking an Operations Manager to lead and manage a team in our Fulfillment Center.</p>', location: 'Mumbai, Maharashtra', salary: '₹18,00,000 - ₹28,00,000 / year', experience: '5-10 years', applicationUrl: 'https://amazon.jobs', lastDate: daysFromNow(30), status: 'ACTIVE' },
        { title: 'Product Manager - Marketplace', slug: 'flipkart-product-manager-2026', companyId: comp['Flipkart'], type: JobType.FULL_TIME, category: 'Product', description: '<h2>About the Role</h2><p>Flipkart is looking for a Product Manager to drive our marketplace platform.</p>', location: 'Bangalore, Karnataka', salary: '₹25,00,000 - ₹40,00,000 / year', experience: '3-5 years', applicationUrl: 'https://www.flipkartcareers.com', lastDate: daysFromNow(45), status: 'ACTIVE' },
        { title: 'Data Scientist - Recommendations', slug: 'swiggy-data-scientist-2026', companyId: comp['Swiggy'], type: JobType.FULL_TIME, category: 'Data Science', description: '<h2>About the Role</h2><p>Swiggy is seeking a Data Scientist to build ML models for personalized recommendations.</p>', location: 'Bangalore, Karnataka', salary: '₹22,00,000 - ₹38,00,000 / year', experience: '2-5 years', applicationUrl: 'https://careers.swiggy.com', lastDate: daysFromNow(35), status: 'ACTIVE' },
        { title: 'Cloud Engineer - GCP', slug: 'tcs-cloud-engineer-gcp-2026', companyId: comp['Tata Consultancy Services'], type: JobType.FULL_TIME, category: 'Engineering', description: '<h2>About the Role</h2><p>TCS is hiring Cloud Engineers with GCP expertise for our cloud transformation practice.</p>', location: 'Multiple Locations, India', salary: '₹12,00,000 - ₹22,00,000 / year', experience: '3-7 years', applicationUrl: 'https://www.tcs.com/careers', lastDate: daysFromNow(50), status: 'ACTIVE' },
        { title: 'Business Analyst - Financial Services', slug: 'infosys-business-analyst-2026', companyId: comp['Infosys'], type: JobType.FULL_TIME, category: 'Consulting', description: '<h2>About the Role</h2><p>Infosys is seeking a Business Analyst for our Financial Services practice.</p>', location: 'Pune, Maharashtra', salary: '₹10,00,000 - ₹18,00,000 / year', experience: '2-4 years', applicationUrl: 'https://www.infosys.com/careers', lastDate: daysFromNow(40), status: 'ACTIVE' },
        { title: 'Software Engineer Intern', slug: 'zomato-software-engineer-intern-2026', companyId: comp['Zomato'], type: JobType.INTERNSHIP, category: 'Engineering', description: '<h2>About the Internship</h2><p>Zomato is looking for Software Engineer Interns for a 3-month paid program.</p>', location: 'Gurgaon, Haryana', salary: '₹50,000 / month stipend', experience: '0-1 years', applicationUrl: 'https://www.zomato.com/careers', lastDate: daysFromNow(25), status: 'ACTIVE' },
        { title: 'UI/UX Designer - Contract', slug: 'paytm-ui-ux-designer-contract-2026', companyId: comp['Paytm'], type: JobType.CONTRACT, category: 'Design', description: '<h2>About the Role</h2><p>Paytm is hiring a UI/UX Designer on a 6-month contract for our consumer mobile apps.</p>', location: 'Noida, Uttar Pradesh', salary: '₹8,00,000 - ₹12,00,000 / year (contract)', experience: '2-4 years', applicationUrl: 'https://paytm.com/careers', lastDate: daysFromNow(20), status: 'ACTIVE' },
        { title: 'Content Developer - Part Time', slug: 'byjus-content-developer-part-time-2026', companyId: comp["BYJU's"], type: JobType.PART_TIME, category: 'Content', description: '<h2>About the Role</h2><p>BYJU\'s is looking for part-time Content Developers for K-12 educational content. Work from home.</p>', location: 'Remote / Bangalore, Karnataka', salary: '₹4,00,000 - ₹7,00,000 / year (part-time)', experience: '1-3 years', applicationUrl: 'https://byjus.com/careers', lastDate: daysFromNow(30), status: 'ACTIVE' },
      ],
    });
    console.log('  private jobs seeded');
  }

  const counts = {
    jobs: await prisma.job.count(),
    results: await prisma.result.count(),
    admitCards: await prisma.admitCard.count(),
    answerKeys: await prisma.answerKey.count(),
    admissions: await prisma.admission.count(),
    syllabus: await prisma.syllabus.count(),
    notifications: await prisma.notification.count(),
    categories: await prisma.category.count(),
    departments: await prisma.department.count(),
    states: await prisma.state.count(),
    privateJobs: await prisma.privateJob.count(),
    companies: await prisma.company.count(),
  };
  console.log('Seed complete:', counts);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });