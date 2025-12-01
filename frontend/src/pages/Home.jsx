import { motion } from "framer-motion";
import { FaUserCircle, FaBriefcase, FaGraduationCap, FaHandshake } from "react-icons/fa";
import homeImage from "../../src/assets/home.png";

const Home = () => {

  const darkGradientStyle = {
    background: "linear-gradient(135deg, #0A0F1F 0%, #1B2540 50%, #2E1A47 100%)",
  };

  const cardGlass = "bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl";

  return (
    <div className="min-h-screen bg-[#0A0E19] text-gray-200">

      {/* Decorative Background Glows */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-600/20 blur-[140px]"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/20 blur-[150px]"></div>
      </div>


      {/* HERO SECTION */}
      <div style={darkGradientStyle}>
        <section className="flex flex-col-reverse lg:flex-row items-center justify-between px-8 lg:px-20 py-20">

          {/* LEFT SIDE */}
          <motion.div
            className="max-w-lg"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
              Discover Your Dream Job
            </h1>

            <div className="inline-block bg-purple-700/20 border border-purple-400/30 mt-4 px-3 py-1 rounded-lg shadow-md backdrop-blur-lg">
              <span className="text-purple-300 text-2xl font-bold tracking-wide">WorkFinder</span>
            </div>

            <p className="text-gray-300 mt-4 text-lg leading-relaxed">
              Empowering careers with modern hiring tools, AI-driven skill tests, 
              and seamless job search tailored for students & companies.
            </p>

            <div className="flex space-x-4 mt-6">
              <button className="bg-purple-600 hover:bg-purple-700 px-8 py-3 font-semibold rounded-xl transition shadow-lg">
                Find Now
              </button>
              <button className="border border-purple-300 text-purple-300 px-8 py-3 rounded-xl hover:bg-purple-300 hover:text-[#1A1D2E] transition shadow-lg">
                Talk To Us
              </button>
            </div>

            <p className="mt-8 text-gray-400">Leading companies that trust us</p>

            <div className="flex space-x-8 mt-4 opacity-80">
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Bélo.svg" className="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" className="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" className="h-6" />
            </div>
          </motion.div>


          {/* RIGHT SIDE */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <img src={homeImage} className="w-[420px] rounded-2xl shadow-2xl border border-white/10" />

            <div className={`${cardGlass} absolute -top-6 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-xl flex items-center space-x-2`}>
              <span className="text-sm font-semibold text-purple-200">Skill Ability Test</span>
            </div>

            <div className={`${cardGlass} absolute bottom-0 left-1/2 transform -translate-x-1/2 px-5 py-2 rounded-xl flex items-center space-x-3`}>
              <FaUserCircle className="w-7 h-7 text-gray-300" />
              <FaUserCircle className="w-7 h-7 text-gray-300" />
              <FaUserCircle className="w-7 h-7 text-gray-300" />
              <span className="text-sm font-medium text-purple-200">Applicants</span>
            </div>
          </motion.div>

        </section>
      </div>


      {/* ABOUT PLATFORM */}
      <motion.section
        className="px-8 lg:px-20 py-20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-center text-white">About Our Platform</h2>
        <p className="text-gray-400 text-center mt-5 max-w-2xl mx-auto text-lg">
          A complete career management system where students apply for jobs, take tests,
          and build portfolios — while companies post jobs, evaluate talent, and hire faster.
        </p>
      </motion.section>


      {/* SERVICES */}
      <motion.section
        className="px-8 lg:px-20 py-20 bg-[#111827]"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-center text-white">Our Services</h2>

        <div className="grid md:grid-cols-3 gap-10 mt-12">
          {[ 
            { title: "Job Search", desc: "Find jobs that match your skills.", icon: <FaBriefcase className="text-purple-400 w-10 h-10" /> },
            { title: "Skill Tests", desc: "Prove your abilities to employers.", icon: <FaGraduationCap className="text-purple-400 w-10 h-10" /> },
            { title: "HR Tools", desc: "Manage hiring, candidates & interviews.", icon: <FaHandshake className="text-purple-400 w-10 h-10" /> }
          ].map((s, i) => (
            <motion.div
              key={i}
              className={`${cardGlass} p-8 rounded-2xl flex flex-col items-center text-center hover:scale-105 transition-transform`}
            >
              {s.icon}
              <h3 className="text-xl text-white font-semibold mt-4">{s.title}</h3>
              <p className="text-gray-400 mt-2">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>


      {/* STUDENTS SECTION */}
      <motion.section
        className="px-8 lg:px-20 py-20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-center text-white">For Students</h2>

        <div className="grid md:grid-cols-2 gap-12 mt-12 items-center">
          <motion.img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
            className="rounded-2xl shadow-2xl border border-white/10"
          />
          <div>
            <h3 className="text-2xl text-white font-semibold">Empowering Your Career</h3>
            <p className="text-gray-400 mt-4 text-lg">
              Discover job opportunities, take skill assessments, and build a professional profile for recruiters.
            </p>
            <button className="mt-6 bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-xl font-semibold shadow-lg">
              Get Started
            </button>
          </div>
        </div>
      </motion.section>


      {/* COMPANIES */}
      <motion.section
        className="px-8 lg:px-20 py-20 bg-[#111827]"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-center text-white">For Companies</h2>

        <div className="grid md:grid-cols-2 gap-12 mt-12 items-center">
          <div>
            <h3 className="text-2xl text-white font-semibold">Hire The Best Talent</h3>
            <p className="text-gray-400 mt-4 text-lg">
              Post jobs, evaluate candidates through tests, and manage hiring easily.
            </p>
            <button className="mt-6 border border-purple-400 text-purple-300 px-8 py-3 rounded-xl hover:bg-purple-300 hover:text-[#111827] transition font-semibold">
              Post a Job
            </button>
          </div>

          <motion.img
            src="https://images.unsplash.com/photo-1598257006626-48b0c252070d"
            className="rounded-2xl shadow-2xl border border-white/10"
          />
        </div>
      </motion.section>


      {/* CALL TO ACTION */}
      <motion.section
        className="bg-gradient-to-r from-purple-700 to-purple-500 text-white text-center px-8 lg:px-20 py-20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold">Ready to Start Your Journey?</h2>
        <p className="mt-4 text-lg max-w-xl mx-auto text-purple-100">
          Whether you are a student or a company, WorkFinder helps you grow faster.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
          <button className="bg-white text-purple-700 font-semibold px-10 py-3 rounded-xl hover:bg-gray-200 transition shadow-lg">
            Join as Student
          </button>
          <button className="border border-white px-10 py-3 rounded-xl hover:bg-white hover:text-purple-700 transition font-semibold shadow-lg">
            Join as Company
          </button>
        </div>
      </motion.section>

    </div>
  );
};

export default Home;
