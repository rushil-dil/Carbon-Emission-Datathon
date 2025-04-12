"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { HeroHighlight, Highlight } from "../components/hero";

export default function Home() {
  const router = useRouter();

  const navigateToForm = () => {
    router.push("/form");
  };

  return (
    <div className="flex flex-col w-full">
      {/* Full screen hero section */}
      <HeroHighlight containerClassName="h-screen">
        <div className="flex flex-col items-center justify-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: [20, -5, 0] }}
            transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
            className="text-2xl md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto"
          >
            Discover your{" "}
            <Highlight className="text-green-600 dark:text-green-300">
              Environmental Footprint
            </Highlight>{" "}
            and make sustainable choices.
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <button
              onClick={navigateToForm}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium shadow-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Calculate Your Footprint
            </button>
          </motion.div>
        </div>
      </HeroHighlight>

      {/* Content below hero section */}
      <section className="py-16 px-4 bg-white dark:bg-neutral-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-neutral-800 dark:text-white">
            About Our Environmental Footprint App
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-green-700 dark:text-green-300">Track Your Impact</h3>
              <p className="text-neutral-700 dark:text-neutral-300">
                Our app helps you understand your personal environmental impact through easy-to-use tracking tools and personalized recommendations.
              </p>
            </div>
            
            <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-green-700 dark:text-green-300">Make Informed Choices</h3>
              <p className="text-neutral-700 dark:text-neutral-300">
                Learn how your daily decisions affect the planet and discover simple ways to reduce your carbon footprint while saving money.
              </p>
            </div>
            
            <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-green-700 dark:text-green-300">Join a Community</h3>
              <p className="text-neutral-700 dark:text-neutral-300">
                Connect with like-minded individuals who are committed to making a positive impact on our environment through sustainable living.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <button
              onClick={navigateToForm}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium shadow-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}