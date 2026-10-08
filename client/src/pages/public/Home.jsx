import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PublicLayout from '../../components/layout/PublicLayout';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function PublicHome() {
  return (
    <PublicLayout>
      <div style={{ fontFamily: 'Outfit, sans-serif', color: '#0f172a', background: '#fafafa', paddingTop: '80px' }}>
        
        {/* HERO SECTION */}
        <section style={{ 
          minHeight: '90vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'relative',
          padding: '4rem 5%',
          overflow: 'hidden'
        }}>
          {/* Subtle background blob */}
          <div style={{
            position: 'absolute', top: '10%', right: '-10%', width: '600px', height: '600px',
            background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, rgba(255,255,255,0) 70%)',
            borderRadius: '50%', filter: 'blur(40px)', zIndex: 0
          }} />
          <div style={{
            position: 'absolute', bottom: '10%', left: '-5%', width: '500px', height: '500px',
            background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, rgba(255,255,255,0) 70%)',
            borderRadius: '50%', filter: 'blur(40px)', zIndex: 0
          }} />

          <motion.div 
            variants={staggerContainer} initial="hidden" animate="visible"
            style={{ maxWidth: '1000px', textAlign: 'center', zIndex: 1 }}
          >
            <motion.div variants={fadeIn} style={{ marginBottom: '1.5rem' }}>
              <span style={{
                display: 'inline-block', padding: '0.4rem 1rem', background: '#eff6ff', 
                color: '#2563eb', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '600'
              }}>
                The New Standard in Digital Finance
              </span>
            </motion.div>
            
            <motion.h1 variants={fadeIn} style={{
              fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: '800', lineHeight: '1.1',
              marginBottom: '1.5rem', letterSpacing: '-0.03em', color: '#0f172a'
            }}>
              Trade Crypto & Get Paid in <span style={{ color: '#2563eb' }}>Naira</span> Instantly.
            </motion.h1>
            
            <motion.p variants={fadeIn} style={{
              fontSize: 'clamp(1.1rem, 2vw, 1.25rem)', color: '#475569', maxWidth: '650px',
              margin: '0 auto 3rem auto', lineHeight: '1.6', fontWeight: '400'
            }}>
              Cradera is the fastest and most secure way to convert your digital assets. No hidden fees, instant payouts, and bank-grade security.
            </motion.p>
            
            <motion.div variants={fadeIn} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: '#2563eb', color: 'white', border: 'none', padding: '1rem 2.5rem',
                  borderRadius: '9999px', fontSize: '1.125rem', fontWeight: '600', cursor: 'pointer',
                  boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.4)', transition: 'transform 0.2s, background 0.2s',
                  fontFamily: 'Outfit, sans-serif'
                }}
                onMouseOver={(e) => e.target.style.background = '#1d4ed8'}
                onMouseOut={(e) => e.target.style.background = '#2563eb'}
                >
                  Create Free Account
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" style={{ padding: '6rem 5%', background: '#ffffff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>Why Choose Cradera?</h2>
              <p style={{ color: '#64748b', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>Everything you need to manage your digital assets, built into one seamless platform.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {[
                { title: 'Lightning Fast Payouts', desc: 'Get your funds in your local bank account within minutes, not days.', icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: '#f59e0b', bg: '#fef3c7' },
                { title: 'Bank-Grade Security', desc: 'Your assets are protected by industry-leading encryption and secure vaults.', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', color: '#10b981', bg: '#d1fae5' },
                { title: 'Zero Hidden Fees', desc: 'What you see is what you get. We offer transparent rates with no surprises.', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: '#3b82f6', bg: '#dbeafe' }
              ].map((feature, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                  style={{
                    padding: '2.5rem', background: '#fafafa', borderRadius: '24px', border: '1px solid #f1f5f9',
                    transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'default'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0,0,0,0.05)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: feature.bg, color: feature.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={feature.icon}/></svg>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem' }}>{feature.title}</h3>
                  <p style={{ color: '#64748b', lineHeight: '1.6' }}>{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" style={{ padding: '6rem 5%', background: '#f8fafc' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '4rem' }}>How It Works</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
              {[
                { step: '1', title: 'Create Account', desc: 'Sign up in less than 2 minutes.' },
                { step: '2', title: 'Complete KYC', desc: 'Verify your identity securely.' },
                { step: '3', title: 'Deposit Crypto', desc: 'Send assets to your unique wallet.' },
                { step: '4', title: 'Get Paid', desc: 'Receive Naira in your bank account.' }
              ].map((item, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%', background: '#2563eb', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: '700',
                    margin: '0 auto 1.5rem auto'
                  }}>
                    {item.step}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>{item.title}</h3>
                  <p style={{ color: '#64748b' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT CTA SECTION */}
        <section id="about" style={{ padding: '6rem 5%', background: '#ffffff' }}>
          <div style={{ 
            maxWidth: '1200px', margin: '0 auto', background: '#0f172a', borderRadius: '32px',
            padding: '5rem 2rem', textAlign: 'center', color: 'white', position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '100%', height: '200%', background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, rgba(0,0,0,0) 60%)', zIndex: 0 }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '700', marginBottom: '1.5rem' }}>Ready to get started?</h2>
              <p style={{ color: '#94a3b8', fontSize: '1.125rem', maxWidth: '500px', margin: '0 auto 2.5rem auto' }}>
                Join thousands of users who trust Cradera for their digital asset conversions.
              </p>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'white', color: '#0f172a', border: 'none', padding: '1rem 2.5rem',
                  borderRadius: '9999px', fontSize: '1.125rem', fontWeight: '700', cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)', fontFamily: 'Outfit, sans-serif'
                }}>
                  Join Cradera Today
                </button>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </PublicLayout>
  );
}