import { PrismaClient, Role, JobStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import slugify from 'slugify';

const prisma = new PrismaClient();

async function main() {
  await prisma.jobView.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.log.deleteMany();
  await prisma.newsletter.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.answerKey.deleteMany();
  await prisma.admitCard.deleteMany();
  await prisma.result.deleteMany();
  await prisma.syllabus.deleteMany();
  await prisma.admission.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.job.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.state.deleteMany();
  await prisma.department.deleteMany();
  await prisma.category.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('Admin@123', 12);

  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@chayan.com',
      password: hashedPassword,
      role: Role.ADMIN,
      emailVerified: new Date(),
    },
  });

  await prisma.adminUser.create({
    data: {
      name: 'Super Admin',
      email: 'admin@chayan.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Central Govt', slug: slugify('Central Govt', { lower: true }), description: 'Central Government Jobs in India' } }),
    prisma.category.create({ data: { name: 'State Govt', slug: slugify('State Govt', { lower: true }), description: 'State Government Jobs in India' } }),
    prisma.category.create({ data: { name: 'Banking', slug: slugify('Banking', { lower: true }), description: 'Banking Sector Jobs in India' } }),
    prisma.category.create({ data: { name: 'Railways', slug: slugify('Railways', { lower: true }), description: 'Indian Railway Jobs' } }),
    prisma.category.create({ data: { name: 'Defence', slug: slugify('Defence', { lower: true }), description: 'Defence Sector Jobs in India' } }),
    prisma.category.create({ data: { name: 'Teaching', slug: slugify('Teaching', { lower: true }), description: 'Teaching Jobs in India' } }),
    prisma.category.create({ data: { name: 'Engineering', slug: slugify('Engineering', { lower: true }), description: 'Engineering Jobs in India' } }),
    prisma.category.create({ data: { name: 'Medical', slug: slugify('Medical', { lower: true }), description: 'Medical & Healthcare Jobs in India' } }),
    prisma.category.create({ data: { name: 'Police', slug: slugify('Police', { lower: true }), description: 'Police & Paramilitary Jobs in India' } }),
    prisma.category.create({ data: { name: 'Judiciary', slug: slugify('Judiciary', { lower: true }), description: 'Judiciary Jobs in India' } }),
    prisma.category.create({ data: { name: 'Public Sector', slug: slugify('Public Sector', { lower: true }), description: 'Public Sector Undertaking Jobs' } }),
    prisma.category.create({ data: { name: 'Research', slug: slugify('Research', { lower: true }), description: 'Research & Development Jobs' } }),
  ]);

  const states = await Promise.all([
    prisma.state.create({ data: { name: 'Andhra Pradesh', slug: 'andhra-pradesh' } }),
    prisma.state.create({ data: { name: 'Arunachal Pradesh', slug: 'arunachal-pradesh' } }),
    prisma.state.create({ data: { name: 'Assam', slug: 'assam' } }),
    prisma.state.create({ data: { name: 'Bihar', slug: 'bihar' } }),
    prisma.state.create({ data: { name: 'Chhattisgarh', slug: 'chhattisgarh' } }),
    prisma.state.create({ data: { name: 'Goa', slug: 'goa' } }),
    prisma.state.create({ data: { name: 'Gujarat', slug: 'gujarat' } }),
    prisma.state.create({ data: { name: 'Haryana', slug: 'haryana' } }),
    prisma.state.create({ data: { name: 'Himachal Pradesh', slug: 'himachal-pradesh' } }),
    prisma.state.create({ data: { name: 'Jharkhand', slug: 'jharkhand' } }),
    prisma.state.create({ data: { name: 'Karnataka', slug: 'karnataka' } }),
    prisma.state.create({ data: { name: 'Kerala', slug: 'kerala' } }),
    prisma.state.create({ data: { name: 'Madhya Pradesh', slug: 'madhya-pradesh' } }),
    prisma.state.create({ data: { name: 'Maharashtra', slug: 'maharashtra' } }),
    prisma.state.create({ data: { name: 'Manipur', slug: 'manipur' } }),
    prisma.state.create({ data: { name: 'Meghalaya', slug: 'meghalaya' } }),
    prisma.state.create({ data: { name: 'Mizoram', slug: 'mizoram' } }),
    prisma.state.create({ data: { name: 'Nagaland', slug: 'nagaland' } }),
    prisma.state.create({ data: { name: 'Odisha', slug: 'odisha' } }),
    prisma.state.create({ data: { name: 'Punjab', slug: 'punjab' } }),
    prisma.state.create({ data: { name: 'Rajasthan', slug: 'rajasthan' } }),
    prisma.state.create({ data: { name: 'Sikkim', slug: 'sikkim' } }),
    prisma.state.create({ data: { name: 'Tamil Nadu', slug: 'tamil-nadu' } }),
    prisma.state.create({ data: { name: 'Telangana', slug: 'telangana' } }),
    prisma.state.create({ data: { name: 'Tripura', slug: 'tripura' } }),
    prisma.state.create({ data: { name: 'Uttar Pradesh', slug: 'uttar-pradesh' } }),
    prisma.state.create({ data: { name: 'Uttarakhand', slug: 'uttarakhand' } }),
    prisma.state.create({ data: { name: 'West Bengal', slug: 'west-bengal' } }),
    prisma.state.create({ data: { name: 'Andaman and Nicobar Islands', slug: 'andaman-and-nicobar-islands' } }),
    prisma.state.create({ data: { name: 'Chandigarh', slug: 'chandigarh' } }),
    prisma.state.create({ data: { name: 'Dadra and Nagar Haveli and Daman and Diu', slug: 'dadra-and-nagar-haveli-and-daman-and-diu' } }),
    prisma.state.create({ data: { name: 'Delhi', slug: 'delhi' } }),
    prisma.state.create({ data: { name: 'Jammu and Kashmir', slug: 'jammu-and-kashmir' } }),
    prisma.state.create({ data: { name: 'Ladakh', slug: 'ladakh' } }),
    prisma.state.create({ data: { name: 'Lakshadweep', slug: 'lakshadweep' } }),
    prisma.state.create({ data: { name: 'Puducherry', slug: 'puducherry' } }),
  ]);

  const departments = await Promise.all([
    prisma.department.create({ data: { name: 'Staff Selection Commission', slug: 'staff-selection-commission', description: 'SSC - Conducts CGL, CHSL, MTS, CPO exams' } }),
    prisma.department.create({ data: { name: 'Union Public Service Commission', slug: 'union-public-service-commission', description: 'UPSC - Conducts Civil Services, NDA, CDS exams' } }),
    prisma.department.create({ data: { name: 'Railway Recruitment Board', slug: 'railway-recruitment-board', description: 'RRB - Conducts NTPC, ALP, Group D exams' } }),
    prisma.department.create({ data: { name: 'Institute of Banking Personnel Selection', slug: 'institute-of-banking-personnel-selection', description: 'IBPS - Conducts PO, Clerk, SO, RRB exams' } }),
    prisma.department.create({ data: { name: 'Reserve Bank of India', slug: 'reserve-bank-of-india', description: 'RBI - Conducts Grade B, Assistant exams' } }),
    prisma.department.create({ data: { name: 'Securities and Exchange Board of India', slug: 'securities-and-exchange-board-of-india', description: 'SEBI - Conducts Grade A exams' } }),
    prisma.department.create({ data: { name: 'NABARD', slug: 'nabard', description: 'National Bank for Agriculture and Rural Development' } }),
    prisma.department.create({ data: { name: 'Food Corporation of India', slug: 'food-corporation-of-india', description: 'FCI - Conducts Manager, Watchman exams' } }),
    prisma.department.create({ data: { name: 'Defence Research and Development Organisation', slug: 'defence-research-and-development-organisation', description: 'DRDO - Scientist and Technical jobs' } }),
    prisma.department.create({ data: { name: 'Indian Space Research Organisation', slug: 'indian-space-research-organisation', description: 'ISRO - Scientist and Engineer jobs' } }),
    prisma.department.create({ data: { name: 'All India Institute of Medical Sciences', slug: 'all-india-institute-of-medical-sciences', description: 'AIIMS - Medical and Nursing jobs' } }),
    prisma.department.create({ data: { name: 'Bharat Sanchar Nigam Limited', slug: 'bharat-sanchar-nigam-limited', description: 'BSNL - Telecom and Engineering jobs' } }),
    prisma.department.create({ data: { name: 'Oil and Natural Gas Corporation', slug: 'oil-and-natural-gas-corporation', description: 'ONGC - Oil & Gas sector jobs' } }),
    prisma.department.create({ data: { name: 'National Thermal Power Corporation', slug: 'national-thermal-power-corporation', description: 'NTPC - Power sector jobs' } }),
    prisma.department.create({ data: { name: 'Steel Authority of India Limited', slug: 'steel-authority-of-india-limited', description: 'SAIL - Steel sector jobs' } }),
    prisma.department.create({ data: { name: 'Hindustan Aeronautics Limited', slug: 'hindustan-aeronautics-limited', description: 'HAL - Aerospace jobs' } }),
    prisma.department.create({ data: { name: 'Bharat Heavy Electricals Limited', slug: 'bharat-heavy-electricals-limited', description: 'BHEL - Heavy Electricals jobs' } }),
    prisma.department.create({ data: { name: 'Central Board of Secondary Education', slug: 'central-board-of-secondary-education', description: 'CBSE - Teaching and academic jobs' } }),
  ]);

  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'government-jobs', slug: 'government-jobs' } }),
    prisma.tag.create({ data: { name: 'ssc', slug: 'ssc' } }),
    prisma.tag.create({ data: { name: 'upsc', slug: 'upsc' } }),
    prisma.tag.create({ data: { name: 'banking', slug: 'banking' } }),
    prisma.tag.create({ data: { name: 'railways', slug: 'railways' } }),
    prisma.tag.create({ data: { name: 'defence', slug: 'defence' } }),
    prisma.tag.create({ data: { name: 'teaching', slug: 'teaching' } }),
    prisma.tag.create({ data: { name: 'engineering', slug: 'engineering' } }),
    prisma.tag.create({ data: { name: 'medical', slug: 'medical' } }),
    prisma.tag.create({ data: { name: 'police', slug: 'police' } }),
    prisma.tag.create({ data: { name: 'judiciary', slug: 'judiciary' } }),
    prisma.tag.create({ data: { name: 'public-sector', slug: 'public-sector' } }),
    prisma.tag.create({ data: { name: 'research', slug: 'research' } }),
    prisma.tag.create({ data: { name: 'admit-card', slug: 'admit-card' } }),
    prisma.tag.create({ data: { name: 'result', slug: 'result' } }),
    prisma.tag.create({ data: { name: 'answer-key', slug: 'answer-key' } }),
    prisma.tag.create({ data: { name: 'syllabus', slug: 'syllabus' } }),
    prisma.tag.create({ data: { name: 'admission', slug: 'admission' } }),
  ]);

  const centralGovt = categories[0];
  const stateGovt = categories[1];
  const banking = categories[2];
  const railways = categories[3];
  const defence = categories[4];
  const teaching = categories[5];
  const engineering = categories[6];
  const medical = categories[7];
  const police = categories[8];
  const judiciary = categories[9];
  const publicSector = categories[10];
  const research = categories[11];

  const ssc = departments[0];
  const upsc = departments[1];
  const rrb = departments[2];
  const ibps = departments[3];
  const rbi = departments[4];
  const sebi = departments[5];
  const nabard = departments[6];
  const fci = departments[7];
  const drdo = departments[8];
  const isro = departments[9];
  const aiims = departments[10];
  const bsnl = departments[11];
  const ongc = departments[12];
  const ntpc = departments[13];

  const delhi = states[32];

  const now = new Date();
  const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000);
  const daysFromNow = (d: number) => new Date(now.getTime() + d * 86400000);

  await prisma.job.createMany({
    data: [
      {
        title: 'SSC Combined Graduate Level Exam 2026',
        slug: 'ssc-cgl-2026',
        departmentId: ssc.id,
        categoryId: centralGovt.id,
        stateId: delhi.id,
        advertisementNo: 'SSC/CGL/2026/01',
        totalVacancies: 7500,
        salary: 'Rs. 35,400 - 1,12,400/-',
        location: 'Across India',
        ageLimit: '18-32 years',
        ageRelaxation: 'SC/ST: 5 years, OBC: 3 years',
        education: 'Bachelor\'s Degree from a recognized university',
        selectionProcess: 'Tier I (CBT), Tier II (CBT), Tier III (Descriptive), Tier IV (Skill Test/CE)',
        applicationFee: 'Rs. 100 (General), SC/ST/PH/Ex-Servicemen: Nil',
        importantDates: { notificationDate: '2026-02-15', startDate: '2026-02-20', lastDate: '2026-03-20', examDate: '2026-05-15' },
        documentsRequired: 'Educational certificates, ID proof, Photograph, Signature, Category certificate',
        howToApply: 'Apply online through SSC official website ssc.nic.in',
        officialNotification: 'https://ssc.nic.in/notification',
        officialWebsite: 'https://ssc.nic.in',
        applyLink: 'https://ssc.nic.in/apply',
        status: JobStatus.ACTIVE,
        experience: 'Nil',
        startDate: daysAgo(5),
        lastDate: daysFromNow(45),
      },
      {
        title: 'UPSC Civil Services Examination 2026',
        slug: 'upsc-civil-services-2026',
        departmentId: upsc.id,
        categoryId: centralGovt.id,
        stateId: delhi.id,
        advertisementNo: 'UPSC/CSE/2026/01',
        totalVacancies: 1100,
        salary: 'Rs. 56,100 - 2,50,000/-',
        location: 'Across India',
        ageLimit: '21-32 years',
        ageRelaxation: 'SC/ST: 5 years, OBC: 3 years, PwD: 10 years',
        education: 'Bachelor\'s Degree from a recognized university',
        selectionProcess: 'Prelims (CBT), Mains (Descriptive), Interview',
        applicationFee: 'Rs. 100 (General), SC/ST/PH/Female: Nil',
        importantDates: { notificationDate: '2026-02-01', startDate: '2026-02-05', lastDate: '2026-03-05', prelimsDate: '2026-06-01', mainsDate: '2026-09-15' },
        documentsRequired: 'Educational certificates, ID proof, Photograph, Signature, Category certificate',
        howToApply: 'Apply online through UPSC official website upsc.gov.in',
        officialNotification: 'https://upsc.gov.in/notification',
        officialWebsite: 'https://upsc.gov.in',
        applyLink: 'https://upsc.gov.in/apply',
        status: JobStatus.UPCOMING,
        experience: 'Nil',
        startDate: daysFromNow(20),
        lastDate: daysFromNow(60),
      },
      {
        title: 'IBPS Probationary Officers 2026',
        slug: 'ibps-po-2026',
        departmentId: ibps.id,
        categoryId: banking.id,
        stateId: delhi.id,
        advertisementNo: 'IBPS/PO/2026/01',
        totalVacancies: 4500,
        salary: 'Rs. 36,000 - 63,840/-',
        location: 'Across India',
        ageLimit: '20-30 years',
        ageRelaxation: 'SC/ST: 5 years, OBC: 3 years',
        education: 'Graduation in any discipline from a recognized university',
        selectionProcess: 'Prelims (CBT), Mains (CBT), Interview',
        applicationFee: 'Rs. 850 (General), SC/ST/PH: Rs. 175',
        importantDates: { notificationDate: '2026-07-01', startDate: '2026-07-05', lastDate: '2026-07-25', prelimsDate: '2026-09-15', mainsDate: '2026-11-15' },
        documentsRequired: 'Educational certificates, ID proof, Photograph, Signature, Category certificate',
        howToApply: 'Apply online through IBPS official website ibps.in',
        officialNotification: 'https://ibps.in/notification',
        officialWebsite: 'https://ibps.in',
        applyLink: 'https://ibps.in/apply',
        status: JobStatus.UPCOMING,
        experience: 'Nil',
        startDate: daysFromNow(90),
        lastDate: daysFromNow(120),
      },
      {
        title: 'RRB NTPC Graduate Level Recruitment 2026',
        slug: 'rrb-ntpc-2026',
        departmentId: rrb.id,
        categoryId: railways.id,
        stateId: delhi.id,
        advertisementNo: 'RRB/NTPC/2026/01',
        totalVacancies: 12000,
        salary: 'Rs. 19,900 - 1,42,400/-',
        location: 'Across India',
        ageLimit: '18-33 years',
        ageRelaxation: 'SC/ST: 5 years, OBC: 3 years',
        education: 'Bachelor\'s Degree from a recognized university',
        selectionProcess: 'CBT I, CBT II, Typing Skill Test (if applicable), Document Verification',
        applicationFee: 'Rs. 500 (General), OBC: Rs. 500, SC/ST/PH/Ex-Servicemen: Rs. 250',
        importantDates: { notificationDate: '2026-03-01', startDate: '2026-03-10', lastDate: '2026-04-10', cbt1Date: '2026-06-15', cbt2Date: '2026-08-20' },
        documentsRequired: 'Educational certificates, ID proof, Photograph, Signature, Category certificate',
        howToApply: 'Apply online through RRB official websites',
        officialNotification: 'https://rrb.gov.in/notification',
        officialWebsite: 'https://rrb.gov.in',
        applyLink: 'https://rrb.gov.in/apply',
        status: JobStatus.ACTIVE,
        experience: 'Nil',
        startDate: daysAgo(1),
        lastDate: daysFromNow(30),
      },
      {
        title: 'RBI Grade B Officers 2026',
        slug: 'rbi-grade-b-2026',
        departmentId: rbi.id,
        categoryId: banking.id,
        stateId: delhi.id,
        advertisementNo: 'RBI/GR-B/2026/01',
        totalVacancies: 350,
        salary: 'Rs. 55,200 - 1,17,500/-',
        location: 'Across India',
        ageLimit: '21-30 years',
        ageRelaxation: 'SC/ST: 5 years, OBC: 3 years',
        education: 'Bachelor\'s Degree with minimum 60% marks (55% for SC/ST)',
        selectionProcess: 'Phase I (CBT), Phase II (CBT), Interview',
        applicationFee: 'Rs. 850 (General), OBC: Rs. 850, SC/ST/PH: Rs. 100',
        importantDates: { notificationDate: '2026-04-01', startDate: '2026-04-05', lastDate: '2026-04-25', phase1Date: '2026-06-01', phase2Date: '2026-07-15' },
        documentsRequired: 'Educational certificates, ID proof, Photograph, Signature, Category certificate',
        howToApply: 'Apply online through RBI official website rbi.org.in',
        officialNotification: 'https://rbi.org.in/notification',
        officialWebsite: 'https://rbi.org.in',
        applyLink: 'https://rbi.org.in/apply',
        status: JobStatus.UPCOMING,
        experience: 'Nil',
        startDate: daysFromNow(10),
        lastDate: daysFromNow(40),
      },
      {
        title: 'DRDO Scientist Recruitment 2026',
        slug: 'drdo-scientist-2026',
        departmentId: drdo.id,
        categoryId: research.id,
        stateId: delhi.id,
        advertisementNo: 'DRDO/SCIENTIST/2026/01',
        totalVacancies: 250,
        salary: 'Rs. 56,100 - 1,77,500/-',
        location: 'Across India',
        ageLimit: '18-35 years',
        ageRelaxation: 'SC/ST: 5 years, OBC: 3 years',
        education: 'ME/M.Tech or PhD in relevant engineering discipline',
        selectionProcess: 'Shortlisting (GATE Score), Interview',
        applicationFee: 'Rs. 100 (General), SC/ST/PH: Nil',
        importantDates: { notificationDate: '2026-05-01', startDate: '2026-05-05', lastDate: '2026-06-05' },
        documentsRequired: 'Educational certificates, GATE score card, ID proof, Photograph, Signature',
        howToApply: 'Apply online through DRDO official website drdo.gov.in',
        officialNotification: 'https://drdo.gov.in/notification',
        officialWebsite: 'https://drdo.gov.in',
        applyLink: 'https://drdo.gov.in/apply',
        status: JobStatus.ACTIVE,
        experience: 'Nil',
        startDate: daysAgo(10),
        lastDate: daysFromNow(20),
      },
      {
        title: 'ISRO Scientist/Engineer Recruitment 2026',
        slug: 'isro-scientist-2026',
        departmentId: isro.id,
        categoryId: engineering.id,
        stateId: states.find(s => s.slug === 'karnataka')!.id,
        advertisementNo: 'ISRO/SC/2026/01',
        totalVacancies: 400,
        salary: 'Rs. 56,100 - 1,77,500/-',
        location: 'Bangalore, Trivandrum, Ahmedabad',
        ageLimit: '18-35 years',
        ageRelaxation: 'SC/ST: 5 years, OBC: 3 years',
        education: 'BE/B.Tech in relevant engineering discipline with minimum 65% marks',
        selectionProcess: 'Written Test, Interview',
        applicationFee: 'Rs. 100 (General), SC/ST/PH/Female: Nil',
        importantDates: { notificationDate: '2026-06-15', startDate: '2026-06-20', lastDate: '2026-07-20', examDate: '2026-09-15' },
        documentsRequired: 'Educational certificates, ID proof, Photograph, Signature, Category certificate',
        howToApply: 'Apply online through ISRO official website isro.gov.in',
        officialNotification: 'https://isro.gov.in/notification',
        officialWebsite: 'https://isro.gov.in',
        applyLink: 'https://isro.gov.in/apply',
        status: JobStatus.UPCOMING,
        experience: 'Nil',
        startDate: daysFromNow(30),
        lastDate: daysFromNow(60),
      },
      {
        title: 'AIIMS Nursing Officer Recruitment 2026',
        slug: 'aiims-nursing-officer-2026',
        departmentId: aiims.id,
        categoryId: medical.id,
        stateId: delhi.id,
        advertisementNo: 'AIIMS/NO/2026/01',
        totalVacancies: 1800,
        salary: 'Rs. 44,900 - 1,42,400/-',
        location: 'Across AIIMS Institutions in India',
        ageLimit: '18-35 years',
        ageRelaxation: 'SC/ST: 5 years, OBC: 3 years',
        education: 'B.Sc Nursing or GNM with relevant experience',
        selectionProcess: 'CBT, Skill Test, Document Verification',
        applicationFee: 'Rs. 1500 (General), OBC: Rs. 1500, SC/ST: Rs. 1000',
        importantDates: { notificationDate: '2026-04-01', startDate: '2026-04-05', lastDate: '2026-04-30', examDate: '2026-06-20' },
        documentsRequired: 'Educational certificates, Nursing registration, ID proof, Photograph, Signature',
        howToApply: 'Apply online through AIIMS official website aiims.edu',
        officialNotification: 'https://aiims.edu/notification',
        officialWebsite: 'https://aiims.edu',
        applyLink: 'https://aiims.edu/apply',
        status: JobStatus.ACTIVE,
        experience: 'Minimum 1 year experience',
        startDate: daysAgo(3),
        lastDate: daysFromNow(25),
      },
      {
        title: 'ONGC Executive Trainee Recruitment 2026',
        slug: 'ongc-executive-trainee-2026',
        departmentId: ongc.id,
        categoryId: publicSector.id,
        stateId: delhi.id,
        advertisementNo: 'ONGC/ET/2026/01',
        totalVacancies: 600,
        salary: 'Rs. 60,000 - 1,80,000/-',
        location: 'Across India',
        ageLimit: '18-30 years',
        ageRelaxation: 'SC/ST: 5 years, OBC: 3 years',
        education: 'BE/B.Tech in relevant engineering discipline with GATE score',
        selectionProcess: 'GATE Score Shortlisting, Group Discussion, Interview',
        applicationFee: 'Rs. 500 (General), OBC: Rs. 500, SC/ST/PH: Nil',
        importantDates: { notificationDate: '2026-03-01', startDate: '2026-03-05', lastDate: '2026-03-31', interviewDate: '2026-05-15' },
        documentsRequired: 'Educational certificates, GATE score card, ID proof, Photograph, Signature',
        howToApply: 'Apply online through ONGC official website ongcindia.com',
        officialNotification: 'https://ongcindia.com/notification',
        officialWebsite: 'https://ongcindia.com',
        applyLink: 'https://ongcindia.com/apply',
        status: JobStatus.ACTIVE,
        experience: 'Nil',
        startDate: daysAgo(7),
        lastDate: daysFromNow(18),
      },
      {
        title: 'SEBI Grade A Assistant Manager 2026',
        slug: 'sebi-grade-a-2026',
        departmentId: sebi.id,
        categoryId: banking.id,
        stateId: delhi.id,
        advertisementNo: 'SEBI/GR-A/2026/01',
        totalVacancies: 100,
        salary: 'Rs. 44,500 - 1,41,500/-',
        location: 'Mumbai, Delhi, Chennai, Kolkata',
        ageLimit: '21-30 years',
        ageRelaxation: 'SC/ST: 5 years, OBC: 3 years',
        education: 'Bachelor\'s Degree in relevant discipline',
        selectionProcess: 'Phase I (CBT), Phase II (CBT), Interview',
        applicationFee: 'Rs. 1000 (General), OBC: Rs. 1000, SC/ST/PH: Rs. 100',
        importantDates: { notificationDate: '2026-05-15', startDate: '2026-05-20', lastDate: '2026-06-10', phase1Date: '2026-07-20', phase2Date: '2026-08-25' },
        documentsRequired: 'Educational certificates, ID proof, Photograph, Signature, Category certificate',
        howToApply: 'Apply online through SEBI official website sebi.gov.in',
        officialNotification: 'https://sebi.gov.in/notification',
        officialWebsite: 'https://sebi.gov.in',
        applyLink: 'https://sebi.gov.in/apply',
        status: JobStatus.UPCOMING,
        experience: 'Nil',
        startDate: daysFromNow(15),
        lastDate: daysFromNow(45),
      },
      {
        title: 'FCI Manager Recruitment 2026',
        slug: 'fci-manager-2026',
        departmentId: fci.id,
        categoryId: centralGovt.id,
        stateId: delhi.id,
        advertisementNo: 'FCI/MGR/2026/01',
        totalVacancies: 900,
        salary: 'Rs. 44,900 - 1,42,400/-',
        location: 'Across India',
        ageLimit: '18-35 years',
        ageRelaxation: 'SC/ST: 5 years, OBC: 3 years',
        education: 'Bachelor\'s Degree with relevant specialization',
        selectionProcess: 'CBT, Interview, Document Verification',
        applicationFee: 'Rs. 800 (General), OBC: Rs. 800, SC/ST/PH: Nil',
        importantDates: { notificationDate: '2026-07-01', startDate: '2026-07-05', lastDate: '2026-07-30', examDate: '2026-09-15' },
        documentsRequired: 'Educational certificates, ID proof, Photograph, Signature, Category certificate',
        howToApply: 'Apply online through FCI official website fci.gov.in',
        officialNotification: 'https://fci.gov.in/notification',
        officialWebsite: 'https://fci.gov.in',
        applyLink: 'https://fci.gov.in/apply',
        status: JobStatus.UPCOMING,
        experience: 'Nil',
        startDate: daysFromNow(60),
        lastDate: daysFromNow(90),
      },
      {
        title: 'BSNL Junior Engineer Recruitment 2026',
        slug: 'bsnl-je-2026',
        departmentId: bsnl.id,
        categoryId: engineering.id,
        stateId: delhi.id,
        advertisementNo: 'BSNL/JE/2026/01',
        totalVacancies: 2000,
        salary: 'Rs. 25,000 - 55,000/-',
        location: 'Across India',
        ageLimit: '18-30 years',
        ageRelaxation: 'SC/ST: 5 years, OBC: 3 years',
        education: 'Diploma or Bachelor\'s Degree in relevant engineering discipline',
        selectionProcess: 'CBT, Document Verification',
        applicationFee: 'Rs. 1000 (General), OBC: Rs. 1000, SC/ST/PH: Rs. 500',
        importantDates: { notificationDate: '2026-08-01', startDate: '2026-08-05', lastDate: '2026-08-31', examDate: '2026-10-20' },
        documentsRequired: 'Educational certificates, ID proof, Photograph, Signature, Category certificate',
        howToApply: 'Apply online through BSNL official website bsnl.co.in',
        officialNotification: 'https://bsnl.co.in/notification',
        officialWebsite: 'https://bsnl.co.in',
        applyLink: 'https://bsnl.co.in/apply',
        status: JobStatus.UPCOMING,
        experience: 'Nil',
        startDate: daysFromNow(45),
        lastDate: daysFromNow(75),
      },
    ],
  });

  const allJobs = await prisma.job.findMany({ orderBy: { createdAt: 'desc' } });

  const job1 = allJobs[0];
  const job2 = allJobs[1];
  const job3 = allJobs[2];
  const job4 = allJobs[3];
  const job5 = allJobs[4];
  const job6 = allJobs[5];
  const job7 = allJobs[6];
  const job8 = allJobs[7];
  const job9 = allJobs[8];
  const job10 = allJobs[9];
  const job11 = allJobs[10];
  const job12 = allJobs[11];

  await prisma.result.createMany({
    data: [
      {
        title: 'SSC CGL 2025 Tier I Result',
        slug: 'ssc-cgl-2025-tier1-result',
        departmentId: ssc.id,
        categoryId: centralGovt.id,
        jobId: job1!.id,
        pdfUrl: 'https://ssc.nic.in/results/ssc-cgl-2025-tier1.pdf',
        resultDate: daysAgo(15),
        status: 'Published',
      },
      {
        title: 'UPSC Civil Services Prelims 2025 Result',
        slug: 'upsc-cse-2025-prelims-result',
        departmentId: upsc.id,
        categoryId: centralGovt.id,
        jobId: job2!.id,
        pdfUrl: 'https://upsc.gov.in/results/upsc-cse-2025-prelims.pdf',
        resultDate: daysAgo(30),
        status: 'Published',
      },
      {
        title: 'IBPS PO 2025 Main Result',
        slug: 'ibps-po-2025-main-result',
        departmentId: ibps.id,
        categoryId: banking.id,
        jobId: job3!.id,
        pdfUrl: 'https://ibps.in/results/ibps-po-2025-main.pdf',
        resultDate: daysAgo(45),
        status: 'Published',
      },
      {
        title: 'RRB ALP 2025 Result',
        slug: 'rrb-alp-2025-result',
        departmentId: rrb.id,
        categoryId: railways.id,
        jobId: job4!.id,
        pdfUrl: 'https://rrb.gov.in/results/rrb-alp-2025.pdf',
        resultDate: daysAgo(10),
        status: 'Published',
      },
      {
        title: 'RBI Assistant 2025 Final Result',
        slug: 'rbi-assistant-2025-result',
        departmentId: rbi.id,
        categoryId: banking.id,
        jobId: job5!.id,
        pdfUrl: 'https://rbi.org.in/results/rbi-assistant-2025.pdf',
        resultDate: daysAgo(60),
        status: 'Published',
      },
    ],
  });

  await prisma.admitCard.createMany({
    data: [
      {
        title: 'SSC CHSL 2026 Tier I Admit Card',
        slug: 'ssc-chsl-2026-admit-card',
        departmentId: ssc.id,
        categoryId: centralGovt.id,
        jobId: job1!.id,
        examDate: daysFromNow(15),
        downloadUrl: 'https://ssc.nic.in/admitcards/ssc-chsl-2026.pdf',
        status: 'Available',
      },
      {
        title: 'UPSC NDA 2026 Admit Card',
        slug: 'upsc-nda-2026-admit-card',
        departmentId: upsc.id,
        categoryId: defence.id,
        jobId: job2!.id,
        examDate: daysFromNow(20),
        downloadUrl: 'https://upsc.gov.in/admitcards/upsc-nda-2026.pdf',
        status: 'Available',
      },
      {
        title: 'IBPS Clerk 2026 Prelims Admit Card',
        slug: 'ibps-clerk-2026-admit-card',
        departmentId: ibps.id,
        categoryId: banking.id,
        jobId: job3!.id,
        examDate: daysFromNow(10),
        downloadUrl: 'https://ibps.in/admitcards/ibps-clerk-2026.pdf',
        status: 'Available',
      },
      {
        title: 'RRB Group D 2026 Admit Card',
        slug: 'rrb-group-d-2026-admit-card',
        departmentId: rrb.id,
        categoryId: railways.id,
        jobId: job4!.id,
        examDate: daysFromNow(25),
        downloadUrl: 'https://rrb.gov.in/admitcards/rrb-group-d-2026.pdf',
        status: 'Available',
      },
      {
        title: 'CTET 2026 Admit Card',
        slug: 'ctet-2026-admit-card',
        departmentId: departments[17].id,
        categoryId: teaching.id,
        examDate: daysFromNow(30),
        downloadUrl: 'https://ctet.nic.in/admitcards/ctet-2026.pdf',
        status: 'Available',
      },
    ],
  });

  await prisma.answerKey.createMany({
    data: [
      {
        title: 'SSC CPO 2025 Paper I Answer Key',
        slug: 'ssc-cpo-2025-answer-key',
        departmentId: ssc.id,
        categoryId: centralGovt.id,
        jobId: job1!.id,
        pdfUrl: 'https://ssc.nic.in/answerkeys/ssc-cpo-2025.pdf',
        status: 'Published',
      },
      {
        title: 'UPSC EPFO 2025 Enforcement Officer Answer Key',
        slug: 'upsc-epfo-2025-answer-key',
        departmentId: upsc.id,
        categoryId: centralGovt.id,
        jobId: job2!.id,
        pdfUrl: 'https://upsc.gov.in/answerkeys/upsc-epfo-2025.pdf',
        status: 'Published',
      },
      {
        title: 'IBPS RRB 2025 Officer Scale I Answer Key',
        slug: 'ibps-rrb-2025-answer-key',
        departmentId: ibps.id,
        categoryId: banking.id,
        jobId: job3!.id,
        pdfUrl: 'https://ibps.in/answerkeys/ibps-rrb-2025.pdf',
        status: 'Published',
      },
    ],
  });

  await prisma.admission.createMany({
    data: [
      {
        title: 'IGNOU June 2026 Admission Open',
        slug: 'ignou-june-2026-admission',
        departmentId: ssc.id,
        categoryId: teaching.id,
        startDate: daysAgo(10),
        lastDate: daysFromNow(20),
        applicationFee: 'Rs. 200 - 1000 depending on programme',
        pdfUrl: 'https://ignou.ac.in/admissions/june-2026.pdf',
        status: 'Open',
      },
      {
        title: 'JNU PG Admission 2026',
        slug: 'jnu-pg-admission-2026',
        departmentId: upsc.id,
        categoryId: teaching.id,
        startDate: daysAgo(5),
        lastDate: daysFromNow(35),
        applicationFee: 'Rs. 1000 (General), Rs. 500 (SC/ST)',
        pdfUrl: 'https://jnu.ac.in/admissions/pg-2026.pdf',
        status: 'Open',
      },
      {
        title: 'DU UG Admission 2026',
        slug: 'du-ug-admission-2026',
        departmentId: departments[17].id,
        categoryId: teaching.id,
        startDate: daysAgo(20),
        lastDate: daysFromNow(40),
        applicationFee: 'Rs. 750 (General), Rs. 350 (SC/ST)',
        pdfUrl: 'https://du.ac.in/admissions/ug-2026.pdf',
        status: 'Open',
      },
    ],
  });

  await prisma.syllabus.createMany({
    data: [
      {
        title: 'SSC CGL Syllabus 2026',
        slug: 'ssc-cgl-syllabus-2026',
        departmentId: ssc.id,
        categoryId: centralGovt.id,
        jobId: job1!.id,
        pdfUrl: 'https://ssc.nic.in/syllabus/ssc-cgl-2026.pdf',
        subjects: 'General Intelligence & Reasoning, General Awareness, Quantitative Aptitude, English Comprehension',
        status: 'Published',
      },
      {
        title: 'UPSC Civil Services Syllabus 2026',
        slug: 'upsc-civil-services-syllabus-2026',
        departmentId: upsc.id,
        categoryId: centralGovt.id,
        jobId: job2!.id,
        pdfUrl: 'https://upsc.gov.in/syllabus/cse-2026.pdf',
        subjects: 'Prelims: GS I, CSAT. Mains: Essay, GS I-IV, Optional Subject I & II',
        status: 'Published',
      },
      {
        title: 'IBPS PO Syllabus 2026',
        slug: 'ibps-po-syllabus-2026',
        departmentId: ibps.id,
        categoryId: banking.id,
        jobId: job3!.id,
        pdfUrl: 'https://ibps.in/syllabus/ibps-po-2026.pdf',
        subjects: 'Reasoning, Quantitative Aptitude, English Language, General Awareness, Computer Knowledge',
        status: 'Published',
      },
    ],
  });

  await prisma.notification.createMany({
    data: [
      {
        title: 'SSC Calendar 2026 Released: Exam Dates Announced',
        slug: 'ssc-calendar-2026-released',
        content: 'Staff Selection Commission has released the official calendar for the year 2026. The calendar includes tentative dates for all major SSC exams including CGL, CHSL, MTS, CPO, and Selection Posts. Candidates can download the calendar from the official SSC website.',
        categoryId: centralGovt.id,
        type: 'Breaking',
        isTrending: true,
        views: 15200,
      },
      {
        title: 'UPSC Civil Services 2026 Notification Out: Apply Now',
        slug: 'upsc-civil-services-2026-notification',
        content: 'Union Public Service Commission has released the notification for Civil Services Examination 2026. A total of 1100 vacancies have been announced for various services including IAS, IPS, IFS, and Central Services. The online application process has started.',
        categoryId: centralGovt.id,
        type: 'Job Alert',
        isTrending: true,
        views: 28400,
      },
      {
        title: 'IBPS PO 2026 Notification to be Released in July',
        slug: 'ibps-po-2026-notification-july',
        content: 'Institute of Banking Personnel Selection is expected to release the notification for Probationary Officers recruitment 2026 in July 2026. As per the official calendar, IBPS PO 2026 prelims exam is scheduled for September 2026.',
        categoryId: banking.id,
        type: 'Update',
        isTrending: false,
        views: 8900,
      },
      {
        title: 'Railway Recruitment 2026: RRB NTPC Applications Open',
        slug: 'railway-recruitment-2026-rrb-ntpc',
        content: 'Railway Recruitment Board has started the online application process for NTPC Graduate Level recruitment 2026. This is one of the largest recruitment drives with over 12,000 vacancies across various posts.',
        categoryId: railways.id,
        type: 'Job Alert',
        isTrending: true,
        views: 32100,
      },
      {
        title: 'CBSE CTET 2026 Application Process Begins',
        slug: 'cbse-ctet-2026-application-begins',
        content: 'Central Board of Secondary Education has started the online application process for CTET 2026. The exam will be conducted in computer-based mode at various centres across the country. Eligible candidates can apply online.',
        categoryId: teaching.id,
        type: 'Update',
        isTrending: false,
        views: 12500,
      },
    ],
  });

  await prisma.exam.createMany({
    data: [
      { name: 'SSC CGL', slug: 'ssc-cgl', description: 'Combined Graduate Level Examination', categoryId: centralGovt.id },
      { name: 'UPSC CSE', slug: 'upsc-cse', description: 'Civil Services Examination', categoryId: centralGovt.id },
      { name: 'IBPS PO', slug: 'ibps-po', description: 'Probationary Officers Exam', categoryId: banking.id },
      { name: 'RRB NTPC', slug: 'rrb-ntpc', description: 'Non-Technical Popular Categories Exam', categoryId: railways.id },
      { name: 'RBI Grade B', slug: 'rbi-grade-b', description: 'Reserve Bank of India Grade B Exam', categoryId: banking.id },
    ],
  });

  await prisma.jobView.createMany({
    data: [
      { jobId: job1!.id, views: 45000, date: daysAgo(1) },
      { jobId: job2!.id, views: 52000, date: daysAgo(1) },
      { jobId: job3!.id, views: 38000, date: daysAgo(1) },
      { jobId: job4!.id, views: 41000, date: daysAgo(1) },
      { jobId: job5!.id, views: 28000, date: daysAgo(1) },
      { jobId: job6!.id, views: 15000, date: daysAgo(1) },
      { jobId: job7!.id, views: 22000, date: daysAgo(1) },
      { jobId: job8!.id, views: 18000, date: daysAgo(1) },
      { jobId: job9!.id, views: 12000, date: daysAgo(2) },
      { jobId: job10!.id, views: 9500, date: daysAgo(2) },
      { jobId: job11!.id, views: 8000, date: daysAgo(2) },
      { jobId: job12!.id, views: 6500, date: daysAgo(2) },
    ],
  });

  const blogPosts = [
    {
      title: "How to Prepare for SSC CGL 2026 – A Complete Guide",
      slug: "how-to-prepare-for-ssc-cgl-2026",
      excerpt: "A step-by-step guide to cracking SSC CGL 2026. Learn about the exam pattern, syllabus, best books, and study strategies to score high in Tier 1 and Tier 2.",
      content: "<h2>Overview of SSC CGL 2026</h2><p>The Staff Selection Commission (SSC) conducts the Combined Graduate Level (CGL) examination every year to recruit candidates for various Group B and Group C posts in government ministries and departments. SSC CGL 2026 is expected to be one of the most competitive exams with over 25 lakh applicants.</p><h2>Exam Pattern</h2><p>SSC CGL 2026 will be conducted in four tiers:<br/>Tier 1: Computer-Based Examination (objective)<br/>Tier 2: Computer-Based Examination (advanced level)<br/>Tier 3: Descriptive Paper<br/>Tier 4: Skill Test / Computer Proficiency Test</p><h2>Preparation Strategy</h2><p>Start your preparation at least 6 months before the exam. Focus on understanding the basics first, then move to advanced topics. Practice previous year papers and take mock tests regularly to improve speed and accuracy.</p><h2>Recommended Books</h2><ul><li>Quantitative Aptitude – R.S. Aggarwal</li><li>English – SP Bakshi</li><li>Reasoning – R.S. Aggarwal</li><li>General Awareness – Lucent's GK</li></ul>",
      author: "Chayan Expert",
      tags: "ssc-cgl, exam-preparation, govt-jobs, competitive-exams",
      published: true,
    },
    {
      title: "Top 10 Government Exams in India You Should Know About",
      slug: "top-10-government-exams-in-india",
      excerpt: "Discover the most popular government exams in India including UPSC, SSC, Banking, Railways, and State PSC exams. Know the eligibility, exam pattern, and key dates.",
      content: "<h2>1. UPSC Civil Services Examination</h2><p>The most prestigious exam in India, conducted by the Union Public Service Commission. It selects officers for IAS, IPS, IFS, and other central services.</p><h2>2. SSC CGL</h2><p>The Staff Selection Commission Combined Graduate Level exam recruits for various Group B and Group C posts across government departments.</p><h2>3. Banking Exams (IBPS PO, IBPS Clerk, SBI PO)</h2><p>IBPS and SBI conduct exams for probationary officers and clerical positions in public sector banks.</p><h2>4. Railway Recruitment Board (RRB) Exams</h2><p>RRB conducts exams for various technical and non-technical positions in Indian Railways.</p><h2>5. State Public Service Commission (PSC) Exams</h2><p>Each state has its own PSC that conducts exams for state government services.</p><h2>6. Defence Exams (NDA, CDS, AFCAT)</h2><p>For those interested in joining the Indian Armed Forces.</p><h2>7. Teaching Exams (CTET, UGC NET, State TET)</h2><p>For those looking to build a career in teaching at various levels.</p><h2>8. SSC CHSL</h2><p>For 10+2 pass candidates, conducted by Staff Selection Commission.</p><h2>9. Insurance Exams</h2><p>LIC, NIACL, and other insurance companies conduct exams for officers and assistants.</p><h2>10. Group B & C Departmental Exams</h2><p>Various government departments conduct their own exams for specific positions.</p>",
      author: "Chayan Team",
      tags: "govt-exams, upsc, ssc, banking, railways, career-guidance",
      published: true,
    },
    {
      title: "How to Apply for Government Jobs Online – Step by Step Guide",
      slug: "how-to-apply-for-government-jobs-online",
      excerpt: "Learn the complete process of applying for government jobs online. From registration to document upload and fee payment, we cover everything you need to know.",
      content: "<h2>Step 1: Find the Right Job Notification</h2><p>Visit Chayan regularly to get the latest government job notifications. We curate jobs from all official sources so you never miss an opportunity.</p><h2>Step 2: Check Eligibility</h2><p>Before applying, carefully check the eligibility criteria including educational qualification, age limit, and experience requirements.</p><h2>Step 3: Register on the Official Portal</h2><p>Most government recruitment portals require you to create an account. Use a valid email ID and phone number for registration.</p><h2>Step 4: Fill the Application Form</h2><p>Enter your personal details, educational qualifications, work experience, and other required information carefully.</p><h2>Step 5: Upload Documents</h2><p>Upload scanned copies of your photograph, signature, educational certificates, and other required documents in the specified format.</p><h2>Step 6: Pay Application Fee</h2><p>Pay the application fee online through debit card, credit card, net banking, or UPI. Some candidates may be eligible for fee exemption.</p><h2>Step 7: Submit and Print</h2><p>After submission, take a printout of the application form and fee receipt for future reference.</p>",
      author: "Chayan Expert",
      tags: "application-guide, how-to-apply, govt-jobs, job-application",
      published: true,
    },
    {
      title: "SSC CHSL 2026 – Exam Dates, Pattern, and Preparation Tips",
      slug: "ssc-chsl-2026-exam-dates-pattern-preparation",
      excerpt: "Everything you need to know about SSC CHSL 2026 – important dates, exam pattern, syllabus, and expert preparation tips to crack the exam.",
      content: "<h2>SSC CHSL 2026 Overview</h2><p>The Staff Selection Commission conducts the Combined Higher Secondary Level (CHSL) exam for recruitment to posts like Lower Division Clerk (LDC), Junior Secretariat Assistant (JSA), Postal Assistant (PA), and Data Entry Operator (DEO).</p><h2>Important Dates</h2><p>While official dates are yet to be announced, based on previous trends: Tier 1 exam is expected in March-April 2026, and Tier 2 in June-July 2026.</p><h2>Exam Pattern</h2><p>Tier 1: Computer-Based Exam (100 questions, 100 marks, 60 minutes)<br/>Tier 2: Descriptive Paper (letter writing and essay)<br/>Tier 3: Skill Test / Typing Test</p><h2>Preparation Strategy</h2><p>Focus on General Intelligence, English Language, Quantitative Aptitude, and General Awareness. Practice mock tests daily and revise current affairs regularly.</p>",
      author: "Chayan Team",
      tags: "ssc-chsl, exam-dates, preparation, govt-jobs",
      published: true,
    },
    {
      title: "Common Mistakes to Avoid While Applying for Government Jobs",
      slug: "common-mistakes-govt-job-applications",
      excerpt: "Avoid these common mistakes that lead to application rejection – wrong document format, incorrect details, missing deadlines, and more.",
      content: "<h2>1. Applying at the Last Minute</h2><p>Server congestion is common during the last few days. Apply at least 3-4 days before the deadline to avoid technical issues.</p><h2>2. Incorrect Document Uploads</h2><p>Upload documents in the specified format (PDF/JPG) and size. Many applications get rejected due to blurry photos or large file sizes.</p><h2>3. Wrong Personal Details</h2><p>Double-check your name, date of birth, and contact information. Minor errors can lead to rejection during document verification.</p><h2>4. Ignoring Eligibility Criteria</h2><p>Don't apply for a job if you don't meet the educational or age requirements. It wastes your time and application fee.</p><h2>5. Not Keeping a Printout</h2><p>Always save and print the application confirmation. You'll need it for future reference.</p>",
      author: "Chayan Expert",
      tags: "application-tips, common-mistakes, govt-jobs, job-application",
      published: true,
    },
    {
      title: "Government Job Salary Structure – Pay Matrix Explained",
      slug: "government-job-salary-structure-pay-matrix",
      excerpt: "Understand the 7th Pay Commission pay matrix and salary structure for various government job levels. Learn about basic pay, allowances, deductions, and in-hand salary.",
      content: "<h2>What is the Pay Matrix?</h2><p>The 7th Central Pay Commission introduced a simplified pay matrix for central government employees. It replaced the earlier system of pay bands and grade pay.</p><h2>Pay Levels</h2><p>The pay matrix has 18 levels (Level 1 to Level 18). Entry-level positions typically start at Level 3 to Level 10.</p><h2>Components of Salary</h2><ul><li>Basic Pay – The fixed component based on pay level</li><li>Dearness Allowance (DA) – Revised quarterly based on inflation</li><li>House Rent Allowance (HRA) – Varies by city category (X, Y, Z)</li><li>Transport Allowance – For commuting expenses</li><li>Medical Allowance – For healthcare expenses</li></ul><h2>Example: SSC CGL Salary</h2><p>An SSC CGL officer at Level 7 gets a basic pay of approximately Rs. 44,900. With allowances, the gross salary is around Rs. 55,000-60,000 per month.</p>",
      author: "Chayan Team",
      tags: "salary, pay-matrix, 7th-pay-commission, govt-job-benefits",
      published: true,
    },
  ]

  for (const post of blogPosts) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: post.slug } })
    if (!existing) {
      await prisma.blogPost.create({ data: post })
    }
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
