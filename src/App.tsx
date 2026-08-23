import { Navbar } from './components/ui/Navbar'
import { WhatsAppCTA } from './components/ui/WhatsAppCTA'
import { ScrollStory } from './components/sections/ScrollStory'
import { ReelsGrid } from './components/sections/ReelsGrid'
import { MembershipConfigurator } from './components/sections/MembershipConfigurator'
import { Footer } from './components/sections/Footer'

function App() {
  return (
    <div id="top" className="relative bg-obsidian">
      <Navbar />
      <ScrollStory />
      <ReelsGrid />
      <MembershipConfigurator />
      <Footer />
      <WhatsAppCTA />
    </div>
  )
}

export default App
