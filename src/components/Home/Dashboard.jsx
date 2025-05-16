import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        {/* Navigation */}

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Master <span className="text-blue-400">Backend Development</span>{" "}
            Like a Pro
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Learn backend technologies from industry experts with hands-on
            projects and real-world scenarios.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-md font-medium text-lg transition">
              Start Learning Now
            </button>
            <button className="border border-blue-400 text-blue-400 hover:bg-blue-900 px-8 py-3 rounded-md font-medium text-lg transition">
              Explore Courses
            </button>
          </div>
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-blue-500 rounded-xl opacity-20 blur-3xl -z-10"></div>
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-700 rounded-xl p-1 inline-block">
              <img
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Code editor"
                className="rounded-lg w-full max-w-4xl"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-center mb-16">
            Why Learn With Us
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: "💻",
                title: "Hands-on Projects",
                desc: "Build real-world applications with guided projects that reinforce learning.",
              },
              {
                icon: "👨‍🏫",
                title: "Expert Instructors",
                desc: "Learn from industry professionals with years of backend development experience.",
              },
              {
                icon: "📈",
                title: "Career Growth",
                desc: "Get career guidance and interview preparation to land your dream job.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800 p-8 rounded-xl hover:bg-gray-700 transition"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Technologies Section */}
        <section className="bg-gray-800 py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-16">
              Technologies You'll Master
            </h2>
            <div className="flex flex-wrap justify-center gap-8">
              {[
                "Node.js",
                "Express",
                "Django",
                "Flask",
                "Spring Boot",
                "Ruby on Rails",
                "SQL",
                "MongoDB",
                "Redis",
                "Docker",
                "AWS",
                "GraphQL",
              ].map((tech) => (
                <div
                  key={tech}
                  className="bg-gray-700 px-6 py-3 rounded-full hover:bg-blue-600 transition"
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="container mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-center mb-16">
            What Our Students Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                quote:
                  "This platform transformed my career. I went from zero to backend developer in 6 months!",
                name: "Sarah Johnson",
                role: "Backend Engineer at TechCorp",
              },
              {
                quote:
                  "The project-based approach helped me understand concepts I struggled with for years.",
                name: "Michael Chen",
                role: "Full Stack Developer",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-800 p-8 rounded-xl">
                <div className="text-yellow-400 text-2xl mb-4">"</div>
                <p className="text-lg mb-6">{testimonial.quote}</p>
                <div>
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Become a Backend Expert?
            </h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto">
              Join thousands of students who've transformed their careers with
              our backend courses.
            </p>
            <button className="bg-white text-blue-800 hover:bg-gray-100 px-10 py-4 rounded-md font-bold text-lg transition">
              Enroll Now
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
