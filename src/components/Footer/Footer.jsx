import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <>
      {/* Footer */}
      <footer className="bg-gray-900 py-12   mx-auto">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold text-blue-400 mb-6 md:mb-0">
              BackendMaster
            </div>
            <div className="flex space-x-6">
              <Link
                to="#"
                className="hover:text-blue-400 text-white transition"
              >
                Terms
              </Link>
              <Link
                to="#"
                className="hover:text-blue-400 text-white transition"
              >
                Privacy
              </Link>
              <Link
                to="#"
                className="hover:text-blue-400 text-white transition"
              >
                Contact
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            © {new Date().getFullYear()} BackendMaster. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
