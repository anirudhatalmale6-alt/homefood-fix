import { Hero } from '../components/Hero'
import { HomeFeaturedMenu } from '../components/HomeFeaturedMenu'
import { About } from '../components/About'
import { WhyChooseUs } from '../components/WhyChooseUs'
import { HowItWorks } from '../components/HowItWorks'
import { Testimonials } from '../components/Testimonials'

/** Home — story, trust, and CTAs; services/menu/catering/contact live on their own routes */
export default function HomePage() {
  return (
    <>
      <Hero />
      <HomeFeaturedMenu />
      <About />
      <WhyChooseUs />
      <HowItWorks />
      <Testimonials />
    </>
  )
}
