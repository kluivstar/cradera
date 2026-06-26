const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src');

const dirs = [
  'components/layout',
  'components/home',
  'components/about',
  'components/services',
  'components/contact',
  'components/shared',
  'pages/public',
  'Fonts'
];

const files = {
  'components/layout/Navbar.jsx': `import React from 'react';\nexport default function Navbar() { return <nav>Navbar Placeholder</nav>; }`,
  'components/layout/Footer.jsx': `import React from 'react';\nexport default function Footer() { return <footer>Footer Placeholder</footer>; }`,
  'components/layout/PublicLayout.jsx': `import React from 'react';\nimport Navbar from './Navbar';\nimport Footer from './Footer';\n\nexport default function PublicLayout({ children }) {\n  return (\n    <div className="public-layout">\n      <Navbar />\n      <main>{children}</main>\n      <Footer />\n    </div>\n  );\n}`,
  
  'components/home/Hero.jsx': `import React from 'react';\nexport default function Hero() { return <section>Hero Placeholder</section>; }`,
  'components/home/TrustSection.jsx': `import React from 'react';\nexport default function TrustSection() { return <section>TrustSection Placeholder</section>; }`,
  'components/home/Features.jsx': `import React from 'react';\nexport default function Features() { return <section>Features Placeholder</section>; }`,
  'components/home/ServicesPreview.jsx': `import React from 'react';\nexport default function ServicesPreview() { return <section>ServicesPreview Placeholder</section>; }`,
  'components/home/HowItWorks.jsx': `import React from 'react';\nexport default function HowItWorks() { return <section>HowItWorks Placeholder</section>; }`,
  'components/home/Testimonials.jsx': `import React from 'react';\nexport default function Testimonials() { return <section>Testimonials Placeholder</section>; }`,
  'components/home/FAQPreview.jsx': `import React from 'react';\nexport default function FAQPreview() { return <section>FAQPreview Placeholder</section>; }`,
  'components/home/CTASection.jsx': `import React from 'react';\nexport default function CTASection() { return <section>CTASection Placeholder</section>; }`,
  
  'components/about/MissionSection.jsx': `import React from 'react';\nexport default function MissionSection() { return <section>MissionSection Placeholder</section>; }`,
  'components/about/ValuesSection.jsx': `import React from 'react';\nexport default function ValuesSection() { return <section>ValuesSection Placeholder</section>; }`,
  'components/about/WhyCradera.jsx': `import React from 'react';\nexport default function WhyCradera() { return <section>WhyCradera Placeholder</section>; }`,
  
  'components/services/ServiceHero.jsx': `import React from 'react';\nexport default function ServiceHero() { return <section>ServiceHero Placeholder</section>; }`,
  'components/services/CryptoService.jsx': `import React from 'react';\nexport default function CryptoService() { return <section>CryptoService Placeholder</section>; }`,
  'components/services/GiftCardService.jsx': `import React from 'react';\nexport default function GiftCardService() { return <section>GiftCardService Placeholder</section>; }`,
  'components/services/AssetExchangeService.jsx': `import React from 'react';\nexport default function AssetExchangeService() { return <section>AssetExchangeService Placeholder</section>; }`,
  
  'components/contact/ContactForm.jsx': `import React from 'react';\nexport default function ContactForm() { return <section>ContactForm Placeholder</section>; }`,
  'components/contact/ContactInfo.jsx': `import React from 'react';\nexport default function ContactInfo() { return <section>ContactInfo Placeholder</section>; }`,
  
  'pages/public/Home.jsx': `import React from 'react';\nimport PublicLayout from '../../components/layout/PublicLayout';\nimport Hero from '../../components/home/Hero';\n\nexport default function PublicHome() {\n  return (\n    <PublicLayout>\n      <Hero />\n      <div>Public Home Placeholder</div>\n    </PublicLayout>\n  );\n}`,
  'pages/public/About.jsx': `import React from 'react';\nimport PublicLayout from '../../components/layout/PublicLayout';\n\nexport default function About() {\n  return (\n    <PublicLayout>\n      <h1>About Us</h1>\n    </PublicLayout>\n  );\n}`,
  'pages/public/Services.jsx': `import React from 'react';\nimport PublicLayout from '../../components/layout/PublicLayout';\n\nexport default function Services() {\n  return (\n    <PublicLayout>\n      <h1>Our Services</h1>\n    </PublicLayout>\n  );\n}`,
  'pages/public/Contact.jsx': `import React from 'react';\nimport PublicLayout from '../../components/layout/PublicLayout';\n\nexport default function Contact() {\n  return (\n    <PublicLayout>\n      <h1>Contact Us</h1>\n    </PublicLayout>\n  );\n}`,
  'pages/public/FAQ.jsx': `import React from 'react';\nimport PublicLayout from '../../components/layout/PublicLayout';\n\nexport default function FAQ() {\n  return (\n    <PublicLayout>\n      <h1>FAQ</h1>\n    </PublicLayout>\n  );\n}`,
  'pages/public/Privacy.jsx': `import React from 'react';\nimport PublicLayout from '../../components/layout/PublicLayout';\n\nexport default function Privacy() {\n  return (\n    <PublicLayout>\n      <h1>Privacy Policy</h1>\n    </PublicLayout>\n  );\n}`,
  'pages/public/Terms.jsx': `import React from 'react';\nimport PublicLayout from '../../components/layout/PublicLayout';\n\nexport default function Terms() {\n  return (\n    <PublicLayout>\n      <h1>Terms of Service</h1>\n    </PublicLayout>\n  );\n}`
};

dirs.forEach(dir => {
  const fullPath = path.join(baseDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log('Created directory:', fullPath);
  }
});

Object.keys(files).forEach(file => {
  const fullPath = path.join(baseDir, file);
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, files[file]);
    console.log('Created file:', fullPath);
  }
});

console.log('Scaffolding complete!');
