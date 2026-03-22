import { motion, AnimatePresence } from 'framer-motion';
import { useSnapshot } from 'valtio';

import state from '../store';
import { CustomButton } from '../components';
import {
  headContainerAnimation,
  headContentAnimation,
  headTextAnimation,
  slideAnimation
} from '../config/motion';

const Home = () => {
  const snap = useSnapshot(state);

  return (
    <AnimatePresence>
      {snap.intro && (
        <motion.section className="home" {...slideAnimation('left')}>
          <motion.header {...slideAnimation("down")}>
            <img 
              src='./threejs.png'
              alt="logo"
              // Premium Touch: Made it slightly larger, added a drop shadow, and a smooth hover scale
              className="w-10 h-10 object-contain drop-shadow-md transition-transform duration-300 hover:scale-110"
            />
          </motion.header>

          <motion.div className="home-content" {...headContainerAnimation}>
            <motion.div {...headTextAnimation}>
              {/* This relies on your updated index.css which already handles light/dark mode! */}
              <h1 className="head-text">
                LET'S <br className="xl:block hidden" /> DO IT.
              </h1>
            </motion.div>
            <motion.div
              {...headContentAnimation}
              // Premium Touch: Increased the gap from 5 to 6 for slightly better breathing room
              className="flex flex-col gap-6" 
            >
              {/* Advanced Theme: Swapped 'text-gray-600' for 'text-muted-foreground'.
                Premium Touch: Increased line-height (leading-relaxed) and made the strong tag use the main foreground color so it pops.
              */}
              <p className="max-w-md font-medium text-muted-foreground text-base md:text-lg leading-relaxed">
                Create your unique and exclusive shirt with our brand-new 3D customization tool. <strong className="text-foreground drop-shadow-sm">Unleash your imagination</strong>{" "} and define your own style.
              </p>

              <CustomButton 
                type="filled"
                title="Customize It"
                handleClick={() => state.intro = false}
                // Premium Touch: Added rounded-xl, deeper padding, and dynamic shadows to the button
                customStyles="w-fit px-6 py-3 font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
              />
            </motion.div>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}

export default Home;