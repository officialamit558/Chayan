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
import { AdBanner } from "@/components/ads/AdBanner"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <QuickLinks />
      <AdBanner format="horizontal" />
      <LatestJobs />
      <AdBanner format="horizontal" />
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-16">
            <LatestResults />
            <AdBanner format="horizontal" />
            <LatestAdmitCards />
          </div>
          <div className="space-y-8">
            <TrendingNotifications />
            <AdBanner format="rectangle" />
          </div>
        </div>
      </div>
      <JobsByQualification />
      <AdBanner format="horizontal" />
      <JobsByState />
      <JobsByDepartment />
      <AdBanner format="horizontal" />
      <PopularExams />
      <FAQ />
      <Newsletter />
    </>
  )
}
