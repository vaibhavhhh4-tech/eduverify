import { Hero } from '@/components/landing/hero'
import { About, Features, HowItWorks, Workflow } from '@/components/landing/sections'
import { Contact, SiteFooter } from '@/components/landing/footer'
import { SiteHeader } from '@/components/landing/site-header'

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Workflow />
        <About />
        <Features />
        <HowItWorks />
        <Contact />
      </main>
      <SiteFooter />
    </>
  )
}
