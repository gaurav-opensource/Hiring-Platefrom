import React from "react";
import { Link } from "react-router-dom";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white">HireSmart</h2>
          <p className="mt-3 text-sm">
            A platform connecting Students and HRs for smarter hiring and career growth.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        {/* Role-specific Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Join Us</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/signup?role=student" className="hover:text-white">
                Student Signup
              </Link>
            </li>
            <li>
              <Link to="/signup?role=hr" className="hover:text-white">
                HR Signup
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white">
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 my-6"></div>

      {/* Social & Copyright */}
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm">
        <p>© {new Date().getFullYear()} HireSmart. All rights reserved.</p>
        <div className="flex space-x-5 mt-3 md:mt-0">
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white">
            <FaLinkedin size={20} />
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white">
            <FaGithub size={20} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white">
            <FaTwitter size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
