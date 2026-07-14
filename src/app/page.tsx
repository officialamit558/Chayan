import { HeroSection } from "@/components/home/HeroSection"
import { QuickLinks } from "@/components/home/QuickLinks"
import { LatestJobs } from "@/components/home/LatestJobs"
import { LatestResults } from "@/components/home/LatestResults"
import { LatestAdmitCards } from "@/components/home/LatestAdmitCards"
import { TrendingNotifications } from "@/components/home/TrendingNotifications"
import { JobsByQualification } from "@/components/home/JobsByQualification"
import { JobsByState } from "@/components/home/JobsByState"
import { JobsByDepartment } from "@/components/home/JobsByDepartment"
import { PopularExams } from "@/components/home/PopularExams"
import { FAQ } from "@/components/home/FAQ"
import { Newsletter } from "@/components/layout/Newsletter"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <QuickLinks />
      <LatestJobs />
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-16">
            <LatestResults />
            <LatestAdmitCards />
          </div>
          <div className="space-y-8">
            <TrendingNotifications />
          </div>
        </div>
      </div>
      <JobsByQualification />
      <JobsByState />
      <JobsByDepartment />
      <PopularExams />
      <FAQ />
      <Newsletter />
    </>
  )
}
