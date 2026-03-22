"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { useSnapshot } from 'valtio';
import Image from 'next/image';

import state from '@/store';
import { CustomButton } from '@/components';
import {
  headContainerAnimation,
  headContentAnimation,
  headTextAnimation,
  slideAnimation
} from '@/config/motion';

const Home = () => {
  const snap = useSnapshot(state);

  return (
    <AnimatePresence>
      {snap.intro && (
        <motion.section className="home" {...slideAnimation('left')}>
          <motion.header {...slideAnimation("down")}>
            <Image 
              src="/threejs.png" 
              alt="logo" 
              width={40} 
              height={40} 
              className="object-contain drop-shadow-md transition-transform duration-500 hover:scale-110 hover:rotate-12" 
            />
          </motion.header>

          <motion.div className="home-content" {...headContainerAnimation}>
            <motion.div {...headTextAnimation}>
              <h1 className="head-text">
                LET&apos;S <br className="xl:block hidden" /> DO IT.
              </h1>
            </motion.div>
            <motion.div
              {...headContentAnimation}
              className="flex flex-col gap-6"
            >
              <p className="max-w-md font-medium text-muted-foreground text-base md:text-lg leading-relaxed">
                Create your unique and exclusive shirt with our brand-new 3D customization tool. <strong className="text-foreground drop-shadow-sm">Unleash your imagination</strong>{" "} and define your own style.
              </p>

              <CustomButton 
                type="filled"
                title="Customize It"
                handleClick={() => state.intro = false}
                customStyles="w-fit px-6 py-3 font-bold text-sm rounded-xl shadow-lg hover:shadow-primary/30 transition-all duration-300 active:scale-95"
              />
            </motion.div>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}

export default Home;
