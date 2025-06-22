import React, { useEffect } from 'react';
import './Lnadingpage.css';
import { Link } from 'react-router-dom';


const App = () => {

  useEffect(() => {
    // Smooth scrolling for navigation links
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Animate elements on scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });

    // Header background change on scroll
    const handleScroll = () => {
      const header = document.querySelector('header');
      if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
      } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      {/* Header */}
      <header>
        <nav className="container">
          <div className="logo">Student MindCare</div>
          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <div className="auth-buttons">
            <Link to="/login" className="btn btn-secondary">Login</Link>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
          </div>
          <button className="mobile-menu">☰</button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Your Mental Health Journey Starts <span className="highlight">Here</span></h1>
              <p>Connect with professional therapists, get 24/7 AI support, and access personalized resources designed specifically for university students.</p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <Link to="/register" className="btn btn-primary" style={{ background: 'white', color: '#764ba2', fontSize: '1.1rem' }}>Start your Journey</Link>
                <a href="#learn-more" className="btn btn-secondary" style={{ borderColor: 'white', color: 'white' }}>Learn More</a>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-card">
                <div className="chat-bubble bot">
                  <strong>MindCare Bot:</strong> Hi! How are you feeling today? 😊
                </div>
                <div className="chat-bubble user">
                  I'm feeling stressed about my exams...
                </div>
                <div className="chat-bubble bot">
                  I understand. Let me help you connect with a counselor and share some stress management techniques.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>24/7</h3>
              <p>AI Support Available</p>
            </div>
            <div className="stat-item">
              <h3>95%</h3>
              <p>Student Satisfaction</p>
            </div>
            <div className="stat-item">
              <h3>500+</h3>
              <p>Students Helped</p>
            </div>
            <div className="stat-item">
              <h3>50+</h3>
              <p>Licensed Therapists</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-title animate-on-scroll">
            <h2>Comprehensive Mental Health Support</h2>
            <p>Everything you need to maintain your mental wellness throughout your academic journey</p>
          </div>
          <div className="features-grid">
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">🤖</div>
              <h3>24/7 AI Chatbot</h3>
              <p>Get instant support anytime with our intelligent chatbot that can detect crisis situations and provide immediate assistance.</p>
            </div>
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">👩‍⚕️</div>
              <h3>Licensed Therapists</h3>
              <p>Connect with professional therapists who specialize in student mental health and understand your unique challenges.</p>
            </div>
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">🚨</div>
              <h3>Crisis Detection</h3>
              <p>Advanced AI monitoring for early detection of mental health crises with immediate alert systems for professional intervention.</p>
            </div>
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">📚</div>
              <h3>Resource Library</h3>
              <p>Access curated mental health resources, articles, and tools recommended by therapists for your specific needs.</p>
            </div>
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">🔒</div>
              <h3>Private & Secure</h3>
              <p>Your privacy matters. All conversations and data are encrypted and protected with the highest security standards.</p>
            </div>
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">📱</div>
              <h3>Mobile Friendly</h3>
              <p>Access support from anywhere on any device. Our platform is optimized for mobile and desktop use.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <div className="section-title animate-on-scroll">
            <h2>How Student MindCare Works</h2>
            <p>Simple steps to get the mental health support you need</p>
          </div>
          <div className="steps">
            <div className="step animate-on-scroll">
              <div className="step-number">1</div>
              <h3>Sign Up</h3>
              <p>Create your secure account and complete a brief mental health assessment to personalize your experience.</p>
            </div>
            <div className="step animate-on-scroll">
              <div className="step-number">2</div>
              <h3>Chat with AI</h3>
              <p>Start by talking to our AI chatbot that's available 24/7 to provide immediate support and assess your needs.</p>
            </div>
            <div className="step animate-on-scroll">
              <div className="step-number">3</div>
              <h3>Connect with Therapist</h3>
              <p>Get matched with a licensed therapist who specializes in student mental health for professional support.</p>
            </div>
            <div className="step animate-on-scroll">
              <div className="step-number">4</div>
              <h3>Access Resources</h3>
              <p>Use personalized resources, track your progress, and maintain your mental wellness with ongoing support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="animate-on-scroll">
            <h2>Ready to Prioritize Your Mental Health?</h2>
            <p>Join thousands of students who have transformed their mental wellness journey with Student MindCare. Your mental health matters, and we're here to support you every step of the way.</p>
            <a href="#signup" className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}>Get Started Today - It's Free</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Student MindCare</h3>
              <p>Empowering students with accessible, professional mental health support through innovative technology and compassionate care.</p>
            </div>
            <div className="footer-section">
              <h3>Quick Links</h3>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
            </div>
            <div className="footer-section">
              <h3>Support</h3>
              <a href="#help">Help Center</a>
              <a href="#contact">Contact Us</a>
              <a href="#crisis">Crisis Resources</a>
              <a href="#faq">FAQ</a>
            </div>
            <div className="footer-section">
              <h3>Emergency</h3>
              <p>If you're in crisis, please contact:</p>
              <a href="tel:988" style={{ color: '#ffd700', fontWeight: 'bold' }}>988 - Suicide & Crisis Lifeline</a>
              <a href="tel:999" style={{ color: '#ffd700', fontWeight: 'bold' }}>999 - Emergency Services</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Student MindCare. All rights reserved. Developed by Mary Queenvine Muthoni & Louis Muiyuro - Strathmore University</p>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      <a href="#signup" className="fab" title="Get Help Now">💬</a>
    </div>
  );
};

export default App;
