import React from "react";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import homeImage from "../../src/assets/home.png";

const Home = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col-reverse lg:flex-row items-center justify-between px-8 lg:px-20 py-16">
        {/* Left Side */}
        <motion.div
          className="max-w-lg"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Discover Dream Job in One Place
          </h1>
          <div className="inline-block bg-orange-100 border-l-4 border-orange-500 mt-3 px-2 py-1">
            <span className="text-orange-600 text-2xl font-bold">WorkFinder</span>
          </div>
          <p className="text-gray-500 mt-4">
            Professionally enable open-source leadership skills without front-end scenarios.
            Continually reconceptualize intermandated intellectual capital.
          </p>
          <div className="flex space-x-4 mt-6">
            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition">
              Find Now
            </button>
            <button className="border border-purple-600 text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition">
              Talk To Us
            </button>
          </div>
          <p className="mt-8 text-gray-400">Leading companies that love Join Up</p>
          <div className="flex space-x-6 mt-4 opacity-60">
            <img src="/airbnb.png" alt="airbnb" className="h-6" />
            <img src="/google.png" alt="google" className="h-6" />
            <img src="/skype.png" alt="skype" className="h-6" />
          </div>
        </motion.div>

        {/* Right Side */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <img
            src={homeImage}
            alt="Happy Woman"
            className="w-[400px] rounded-lg object-cover"
          />

          {/* Skill Test Badge */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white shadow-md px-4 py-2 rounded-lg flex items-center space-x-2">
            <span className="text-sm font-semibold">Skill Ability Test</span>
          </div>

          {/* Applicants Badge */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white shadow-md px-4 py-2 rounded-lg flex items-center space-x-2">
            <div className="flex -space-x-2">
              <FaUserCircle className="w-8 h-8 text-gray-400" />
              <FaUserCircle className="w-8 h-8 text-gray-400" />
              <FaUserCircle className="w-8 h-8 text-gray-400" />
            </div>
            <span className="text-sm font-medium">Applicants</span>
          </div>
        </motion.div>
      </section>

      {/* About Platform */}
      <motion.section
        className="bg-white px-8 lg:px-20 py-16"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold text-center text-gray-900">About Our Platform</h2>
        <p className="text-gray-500 text-center mt-4 max-w-2xl mx-auto">
          Our platform allows students to directly apply for jobs, take skill tests, and manage all their career steps in one place.
          HR professionals can post jobs, review applications, and schedule interviews seamlessly.
        </p>
      </motion.section>

      {/* Services */}
      <motion.section
        className="px-8 lg:px-20 py-16 bg-gray-50"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold text-center text-gray-900">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          {[
            { title: "Job Search", desc: "Find jobs that match your skills and career goals." },
            { title: "Skill Tests", desc: "Take assessments to showcase your abilities to employers." },
            { title: "HR Tools", desc: "Post jobs, review candidates, and schedule interviews." }
          ].map((service, idx) => (
            <motion.div
              key={idx}
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold text-gray-800">{service.title}</h3>
              <p className="text-gray-500 mt-2">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      
    </div>
  );
};

export default Home;
