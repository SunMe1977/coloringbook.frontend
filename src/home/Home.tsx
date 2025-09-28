import React from 'react';
import fundraisingAI from '../img/fundraisingAI.png'; // Import the new image

const Home: React.FC = () => {
  return (
    <div className="container text-center" style={{ minHeight: 'calc(100vh - 60px)', paddingTop: '60px' }}>
      <section className="bg-gradient-to-r from-purple-900 via-blue-900 to-black text-white py-16 text-center relative overflow-hidden">
        {/* Futuristic Glow Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="w-[800px] h-[800px] bg-purple-500 blur-3xl rounded-full absolute -top-40 -left-40"></div>
          <div className="w-[600px] h-[600px] bg-blue-500 blur-3xl rounded-full absolute bottom-0 right-0"></div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold mb-6">🚀 Fund the Future of AI Publishing</h2>
          <p className="text-lg mb-8 leading-relaxed">
            AI SelfPub ColoringBook Studio is creating the <span className="text-purple-300">next evolution</span> 
            of publishing tools. With your support, we can expand features, keep it free for indie authors, 
            and make self-publishing faster than ever.
          </p>

          {/* Button */}
          <a href="https://www.indiegogo.com/projects/ai-selfpub-coloringbook-studio/x/38788543#/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-xl shadow-lg text-lg font-bold hover:scale-105 transform transition">
            ✨ Support Us on Indiegogo ✨
          </a>
        </div>
      </section>

      {/* New Fundraising Image */}
      <div style={{ marginTop: '40px', marginBottom: '40px' }}>
        <img 
          src={fundraisingAI} 
          alt="Fundraising for AI capabilities" 
          style={{ width: '40%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'block', margin: '0 auto' }} 
          className="mx-auto"
        />
      </div>
    </div>
  );
};

export default Home;