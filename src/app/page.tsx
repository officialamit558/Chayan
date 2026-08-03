import dynamic from "next/dynamic"
import { HeroSlider } from "@/components/home/HeroSlider"
import { SearchBar } from "@/components/home/SearchBar"
import { QuickLinks } from "@/components/home/QuickLinks"
import { LatestJobs } from "@/components/home/LatestJobs"
import { AdBanner } from "@/components/ads/AdBanner"

const LatestResults = dynamic(() => import("@/components/home/LatestResults").then(m => ({ default: m.LatestResults })))
const LatestAdmitCards = dynamic(() => import("@/components/home/LatestAdmitCards").then(m => ({ default: m.LatestAdmitCards })))
const TrendingNotifications = dynamic(() => import("@/components/home/TrendingNotifications").then(m => ({ default: m.TrendingNotifications })))
const JobsByQualification = dynamic(() => import("@/components/home/JobsByQualification").then(m => ({ default: m.JobsByQualification })))
const JobsByState = dynamic(() => import("@/components/home/JobsByState").then(m => ({ default: m.JobsByState })))
const LatestPrivateJobs = dynamic(() => import("@/components/home/LatestPrivateJobs").then(m => ({ default: m.LatestPrivateJobs })))
const PopularExams = dynamic(() => import("@/components/home/PopularExams").then(m => ({ default: m.PopularExams })))
const FAQ = dynamic(() => import("@/components/home/FAQ").then(m => ({ default: m.FAQ })))
const LatestBlog = dynamic(() => import("@/components/home/LatestBlog").then(m => ({ default: m.LatestBlog })))
const Newsletter = dynamic(() => import("@/components/layout/Newsletter").then(m => ({ default: m.Newsletter })))

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <SearchBar />
      <QuickLinks />
      <AdBanner slot="homeTop" format="horizontal" />
      <LatestJobs />
      <AdBanner slot="homeMid" format="horizontal" />
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-16">
            <LatestResults />
            <AdBanner slot="homeMid" format="horizontal" />
            <LatestAdmitCards />
          </div>
          <div className="space-y-8">
            <TrendingNotifications />
            <AdBanner slot="sidebar" format="rectangle" />
          </div>
        </div>
      </div>
      <JobsByQualification />
      <AdBanner slot="homeBottom" format="horizontal" />
      <JobsByState />
      <LatestPrivateJobs />
      <AdBanner slot="homeBottom" format="horizontal" />
      <PopularExams />
      <FAQ />
      <LatestBlog />
      <Newsletter />
    </>
  )
}
