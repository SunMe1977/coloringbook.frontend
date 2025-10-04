import React from 'react';
import fundraisingAI from '../img/fundraisingAI.jpg';
import Copilot_1 from '../img/Copilot_20250827_085847.png';
import Copilot_2 from '../img/Copilot_20250827_091303.png';
import Copilot_3 from '../img/Copilot_20250827_094145.png';
import Copilot_4 from '../img/Copilot_20251003_094323.png';
import Copilot_5 from '../img/Copilot_20251003_091303.png';
import Copilot_6 from '../img/Copilot_20251003_093409.png';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const { t } = useTranslation('home');

  return (
    <div className="container text-center" style={{ minHeight: 'calc(100vh - 60px)' }}>
      {}
      <div className="copilot-images-section" style={{ marginTop: '40px', marginBottom: '40px' }}>
        <div className="copilot-image-gallery">
          <div className="copilot-image-wrapper">
            <img src={Copilot_4} alt="Copilot Image 4" className="copilot-image" />
          </div>
          <div className="copilot-image-wrapper">
            <img src={Copilot_5} alt="Copilot Image 5" className="copilot-image" />
          </div>
          <div className="copilot-image-wrapper">
            <img src={Copilot_6} alt="Copilot Image 6" className="copilot-image" />
          </div>
        </div>
      </div>
      
            {/* Button */}
        <a href="https://www.indiegogo.com/projects/ai-selfpub-coloringbook-studio/x/38788543#/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-xl shadow-lg text-lg font-bold hover:scale-105 transform transition"
          style={{ position: 'relative', zIndex: 1, marginTop: '2rem' }}>
          {t('home.support_button_text')}
        </a>

      <section className="bg-gradient-to-r from-purple-900 via-blue-900 to-black text-white py-16 text-center relative overflow-hidden">
        {/* Futuristic Glow Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="w-[800px] h-[800px] bg-purple-500 blur-3xl rounded-full absolute -top-40 -left-40"></div>
          <div className="w-[600px] h-[600px] bg-blue-500 blur-3xl rounded-full absolute bottom-0 right-0"></div>
        </div>

        {/* Main content from translation */}
        <div dangerouslySetInnerHTML={{ __html: t('home.main_content') }} style={{ position: 'relative', zIndex: 1, fontFamily: 'sans-serif', maxWidth: '700px', margin: 'auto', padding: '2rem' }}></div>

        {/* Button */}
        <a href="https://www.indiegogo.com/projects/ai-selfpub-coloringbook-studio/x/38788543#/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-xl shadow-lg text-lg font-bold hover:scale-105 transform transition"
          style={{ position: 'relative', zIndex: 1, marginTop: '2rem' }}>
          {t('home.support_button_text')}
        </a>
      </section>

      {/* Existing Copilot Images Section */}
      <div className="copilot-images-section">
        <div className="copilot-image-gallery">
          <div className="copilot-image-wrapper">
            <img src={Copilot_1} alt="Copilot Image 1" className="copilot-image" />
          </div>
          <div className="copilot-image-wrapper">
            <img src={Copilot_2} alt="Copilot Image 2" className="copilot-image" />
          </div>
          <div className="copilot-image-wrapper">
            <img src={Copilot_3} alt="Copilot Image 3" className="copilot-image" />
          </div>
        </div>
      </div>

      {/* Existing Fundraising Image */}
      <div style={{ marginTop: '40px', marginBottom: '40px' }}>
        <img
          src={fundraisingAI}
          alt={t('home.fundraising_image_alt')}
          style={{ width: '40%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'block', margin: '0 auto' }}
          className="mx-auto"
        />
      </div>
    </div>
  );
};

export default Home;