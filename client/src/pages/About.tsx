import { useLanguage } from '../LanguageContext';

export default function About() {
  const { language } = useLanguage();
  const isSwahili = language === 'sw';

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto pb-24 prose prose-green">
      <h1>{isSwahili ? 'Kuhusu Mradi' : 'About the Project'}</h1>
      <p>
        {isSwahili 
          ? 'Climate Justice Nairobi ni jukwaa la elimu linalolenga kujenga uelewa kuhusu mabadiliko ya tabianchi na haki za kimazingira katika mitaa ya Nairobi.' 
          : 'Climate Justice Nairobi is an educational platform aimed at building awareness about climate change and environmental justice in Nairobi\'s neighborhoods.'}
      </p>
      <h2>{isSwahili ? 'Lengo Letu' : 'Our Goal'}</h2>
      <p>
        {isSwahili 
          ? 'Tunatoa elimu inayopatikana kwa urahisi kuhusu hatari za hali ya hewa, kama vile mafuriko na joto kali, na jinsi jamii zinaweza kushiriki katika kupunguza athari hizi.' 
          : 'We provide accessible education regarding climate risks, such as urban flooding and extreme heat, and how communities can participate in mitigating these impacts.'}
      </p>
      <h2>{isSwahili ? 'Utafiti na Elimu' : 'Research and Education'}</h2>
      <p>
        {isSwahili 
          ? 'Maudhui haya yanategemea utafiti na mapendekezo ya jinsi ya kuboresha ushiriki wa kiraia katika masuala ya hali ya hewa, bila kuegemea upande wowote wa kisiasa.' 
          : 'This content is based on research and recommendations on how to improve civic participation in climate issues, maintaining a non-partisan and educational focus.'}
      </p>
    </div>
  );
}
