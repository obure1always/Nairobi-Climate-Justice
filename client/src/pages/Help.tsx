import { useLanguage } from '../LanguageContext';

export default function Help() {
  const { language } = useLanguage();
  const isSwahili = language === 'sw';

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto pb-24">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {isSwahili ? 'Msaada na Maswali' : 'Help & FAQ'}
      </h1>

      <div className="space-y-4">
        {[
          {
            q: isSwahili ? 'Je, ninaweza kutumia jukwaa hili bila intaneti?' : 'Can I use this platform offline?',
            a: isSwahili 
              ? 'Ndiyo! Baada ya kufungua mara ya kwanza, masomo yanahifadhiwa kwenye kifaa chako na unaweza kujifunza bila intaneti.' 
              : 'Yes! After your first visit, the lessons are cached on your device so you can continue learning offline.'
          },
          {
            q: isSwahili ? 'Maendeleo yangu yanahifadhiwa wapi?' : 'Where is my progress saved?',
            a: isSwahili 
              ? 'Maendeleo yanahifadhiwa kwenye kifaa unachotumia (kama simu au kompyuta yako).' 
              : 'Your progress is securely saved locally on the device you are currently using.'
          },
          {
            q: isSwahili ? 'Ninawezaje kubadilisha lugha?' : 'How do I change the language?',
            a: isSwahili 
              ? 'Unaweza kubadilisha lugha kati ya Kiingereza na Kiswahili kwenye ukurasa wa Profaili.' 
              : 'You can switch between English and Kiswahili at any time from the Profile page.'
          }
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 mb-2">{item.q}</h3>
            <p className="text-gray-600">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
