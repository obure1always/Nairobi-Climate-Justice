import { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SupportInquiryForm from '../components/SupportInquiryForm';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../LanguageContext';

const sections = [
  {
    id: 'account-and-learning',
    en: {
      title: 'Account and learning records',
      paragraphs: [
        'We use your name or nickname, email address or phone number, and any profile details you add to run your account and help you recover access. Account registration requires an email address or a phone number. A recovery email is optional for phone accounts. Passwords and recovery codes are stored as salted hashes.',
        'We save lesson progress, quiz answers and scores, and work you choose to submit so you can continue learning and qualify for a certificate. The server grades quizzes and checks saved results before issuing a certificate. You can contact us if you think a result is wrong.',
        'We use the information needed to provide the learning service you request. We also use session and activity records to protect accounts and resolve technical problems.',
      ],
    },
    sw: {
      title: 'Akaunti na rekodi za masomo',
      paragraphs: [
        'Tunatumia jina lako au lakabu, barua pepe au nambari ya simu, na maelezo unayoongeza kwenye wasifu wako ili kuendesha akaunti na kukusaidia kuirejesha. Usajili unahitaji barua pepe au nambari ya simu. Kwa akaunti ya simu, barua pepe ya kurejesha akaunti ni ya hiari. Tunahifadhi nywila na misimbo ya kurejesha akaunti katika mfumo wa hashi wenye thamani nasibu.',
        'Tunahifadhi maendeleo yako, majibu na alama za majaribio, pamoja na kazi unayochagua kuwasilisha, ili uendelee kujifunza na uweze kufuzu kupata cheti. Seva hukagua majibu na matokeo yaliyohifadhiwa kabla ya kutoa cheti. Unaweza kuwasiliana nasi ukiona matokeo yana makosa.',
        'Tunatumia taarifa zinazohitajika kutoa huduma ya kujifunza unayoomba. Pia tunatumia rekodi za vipindi vya kuingia na za matumizi ili kulinda akaunti na kutatua matatizo ya kiufundi.',
      ],
    },
  },
  {
    id: 'shared-information',
    en: {
      title: 'Who can see your information',
      paragraphs: [
        'Platform administrators use account and support records to operate the service and answer requests. Instructors can review submitted projects. Lesson questions can be viewed with the name on your account. Keep private details out of lesson questions and shared project links.',
        'Anyone with a valid certificate ID or verification link can see the learner name, course, issue date and other certificate details. Share your certificate link only with people you want to see those details.',
        'Render hosts the app and its database. If you use Google sign-in when it is available, we receive your Google account identifier, name, email and profile picture. When certificate email is enabled, Resend receives the recipient’s address and the certificate PDF. Some assets, such as fonts or profile images, may load from external websites.',
        'These external services may process information outside Kenya.',
      ],
    },
    sw: {
      title: 'Wanaoweza kuona taarifa zako',
      paragraphs: [
        'Wasimamizi wa jukwaa hutumia rekodi za akaunti na maombi ya msaada kuendesha huduma na kujibu maombi. Wakufunzi wanaweza kukagua miradi iliyowasilishwa. Maswali ya masomo yanaweza kuonekana pamoja na jina la akaunti yako. Epuka kuweka taarifa binafsi katika maswali ya masomo au viungo vya miradi unayoshiriki.',
        'Mtu yeyote mwenye nambari halali ya cheti au kiungo cha kukihakiki anaweza kuona jina la mwanafunzi, kozi, tarehe ya kutolewa na maelezo mengine ya cheti. Shiriki kiungo hicho tu na watu unaotaka waone maelezo hayo.',
        'Render huhifadhi jukwaa na hifadhidata yake. Ukitumia Google kuingia inapopatikana, tunapokea kitambulisho cha akaunti yako ya Google, jina, barua pepe na picha ya wasifu. Huduma ya kutuma vyeti kwa barua pepe ikiwashwa, Resend hupokea anwani ya mpokeaji na PDF ya cheti. Baadhi ya rasilimali, kama fonti na picha za wasifu, zinaweza kupakiwa kutoka tovuti nyingine.',
        'Huduma hizi za nje zinaweza kuchakata taarifa nje ya Kenya.',
      ],
    },
  },
  {
    id: 'climate-buddy',
    en: {
      title: 'Climate Buddy',
      paragraphs: [
        'When you use online chat, your prompt and recent messages may be sent to the active provider, Groq, OpenAI or Pollinations. If cloud speech is enabled, text you choose to play may be sent to OpenAI. If you report a response, your report can include the original question and answer in our server logs. Keep names, contact details and other private information out of chat and reports.',
      ],
    },
    sw: {
      title: 'Climate Buddy',
      paragraphs: [
        'Ukitumia mazungumzo ya mtandaoni, swali lako na jumbe za hivi karibuni zinaweza kutumwa kwa mtoa huduma anayefanya kazi, Groq, OpenAI au Pollinations. Huduma ya sauti ya mtandaoni ikiwashwa, maandishi unayochagua kusikiliza yanaweza kutumwa kwa OpenAI. Ukiripoti jibu, swali la awali na jibu lake vinaweza kuingia kwenye kumbukumbu za seva. Epuka kuweka majina, anwani za mawasiliano au taarifa nyingine binafsi katika mazungumzo na ripoti.',
      ],
    },
  },
  {
    id: 'devices-and-deletion',
    en: {
      title: 'Shared devices and account deletion',
      paragraphs: [
        'Your browser keeps sign-in information, settings, cached lessons and pending work so the app can remember your session and support offline learning. The server checks your session and the account on each synced event before saving it. Sign out when you finish on a shared device. Clearing this site’s data in your browser removes local copies and can discard work that has yet to sync.',
        'The deletion control in Profile removes your account, active sessions and module progress records. Other records, including quizzes, certificates and support tickets, may remain. Some records have no automatic deletion schedule. Use the request form below to ask what we still hold and to request removal of specific records.',
      ],
    },
    sw: {
      title: 'Vifaa vya pamoja na kufuta akaunti',
      paragraphs: [
        'Kivinjari huhifadhi taarifa za kuingia, mipangilio, masomo yaliyopakuliwa na kazi inayosubiri kutumwa ili uweze kuendelea kujifunza hata bila mtandao. Seva hukagua kipindi chako cha kuingia na akaunti inayohusishwa na kila tukio kabla ya kulihifadhi. Ondoka kwenye akaunti ukimaliza kutumia kifaa cha pamoja. Kufuta data ya tovuti katika kivinjari huondoa nakala za kifaa hicho na kunaweza kufuta kazi ambayo haijatumwa kwenye seva.',
        'Chaguo la kufuta akaunti kwenye wasifu huondoa akaunti, vipindi vya kuingia na rekodi za maendeleo ya moduli. Rekodi nyingine, ikiwemo majaribio, vyeti na maombi ya msaada, zinaweza kubaki. Baadhi ya rekodi hazifutwi kwa ratiba ya kiotomatiki. Tumia fomu iliyo hapa chini kuuliza taarifa tulizo nazo au kuomba rekodi fulani zifutwe.',
      ],
    },
  },
  {
    id: 'children-and-research',
    en: {
      title: 'Learners under 18 and research',
      paragraphs: [
        'If you’re under 18, ask a parent or guardian to contact us before creating an account or sharing personal information. The current sign-up form has no age check or way to record guardian permission.',
        'Research participation is voluntary and requires separate consent. If invited, you’ll receive information about the study and, where required, your parent or guardian will be asked for permission.',
        'The optional Learning Survey records climate knowledge answers, confidence and intention ratings, language, consent and submission times under your account. This allows before-course and after-course responses to be matched. Authorised administrators can view summaries and export coded responses for educational evaluation. Recalled ratings are identified separately. The survey does not affect grades or certificates. Draft answers are kept in this browser under your account until submitted or withdrawn. You can withdraw saved survey responses from the survey page. Previously exported copies may remain; contact us about those copies.',
      ],
    },
    sw: {
      title: 'Wanafunzi walio chini ya miaka 18 na utafiti',
      paragraphs: [
        'Ikiwa una umri wa chini ya miaka 18, mwombe mzazi au mlezi awasiliane nasi kabla hujafungua akaunti au kutoa taarifa binafsi. Fomu ya sasa ya usajili haihakiki umri wala kurekodi idhini ya mzazi au mlezi.',
        'Kushiriki katika utafiti ni kwa hiari na kunahitaji idhini tofauti. Ukialikwa kushiriki, utapokea maelezo kuhusu utafiti. Inapohitajika, mzazi au mlezi wako ataombwa kutoa idhini.',
        'Utafiti wa Mafunzo wa hiari huhifadhi majibu ya maarifa ya tabianchi, viwango vya ujasiri na nia, lugha, idhini na nyakati za kuwasilisha chini ya akaunti yako. Hii hutuwezesha kulinganisha majibu ya kabla na baada ya kozi. Wasimamizi walioidhinishwa wanaweza kuona muhtasari na kupakua majibu yenye misimbo kwa tathmini ya elimu. Viwango vinavyokumbukwa huonyeshwa tofauti. Utafiti hauathiri alama au vyeti. Rasimu huhifadhiwa kwenye kivinjari chini ya akaunti yako hadi ziwasilishwe au ziondolewe. Unaweza kuondoa majibu yaliyohifadhiwa kwenye ukurasa wa utafiti. Nakala zilizopakuliwa awali zinaweza kubaki; wasiliana nasi kuhusu nakala hizo.',
      ],
    },
  },
];

export default function PrivacyPolicy() {
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();
  const { hash, search } = useLocation();
  const navigate = useNavigate();
  const requestSection = useRef<HTMLElement>(null);
  const isSwahili = language === 'sw' || new URLSearchParams(search).get('lang') === 'sw';
  const policyLanguage = isSwahili ? 'sw' : 'en';
  const title = isSwahili ? 'Sera ya Faragha' : 'Privacy Policy';

  useEffect(() => {
    const previousTitle = document.title;
    const previousLanguage = document.documentElement.lang;
    document.title = title + ' | Nairobi Climate Justice';
    document.documentElement.lang = policyLanguage;
    return () => {
      document.title = previousTitle;
      document.documentElement.lang = previousLanguage;
    };
  }, [title, policyLanguage]);

  useEffect(() => {
    if (new URLSearchParams(search).get('lang') === 'sw') setLanguage('sw');
  }, [search, setLanguage]);

  const switchLanguage = () => {
    const nextLanguage = isSwahili ? 'en' : 'sw';
    setLanguage(nextLanguage);
    if (search) navigate({ search: '', hash }, { replace: true });
  };

  useEffect(() => {
    if (hash === '#privacy-request') {
      requestSection.current?.focus();
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <div lang={policyLanguage} className="min-h-screen bg-canvas-bg px-4 py-6 font-inter text-gray-900 sm:px-8 sm:py-10">
      <header className="mx-auto mb-8 flex max-w-3xl flex-wrap items-center justify-between gap-4">
        <Link
          to={user ? '/profile#privacy-settings' : '/login'}
          className="inline-flex items-center gap-2 text-sm font-semibold text-forest-green underline underline-offset-4"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          {user ? (isSwahili ? 'Rudi kwenye akaunti' : 'Back to account') : (isSwahili ? 'Rudi kwenye ukurasa wa kuingia' : 'Back to sign-in')}
        </Link>
        <button
          type="button"
          lang={isSwahili ? 'en' : 'sw'}
          onClick={switchLanguage}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium hover:border-forest-green"
        >
          {isSwahili ? 'English' : 'Kiswahili'}
        </button>
      </header>

      <main className="mx-auto max-w-3xl space-y-8">
        <article className="rounded-2xl border border-gray-200 bg-white px-5 py-8 sm:px-10 sm:py-10" aria-labelledby="privacy-title">
          <div className="border-b border-gray-200 pb-6">
            <p className="mb-2 text-sm font-semibold text-forest-green">Nairobi Climate Justice</p>
            <h1 id="privacy-title" className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
            <p className="mt-4 leading-relaxed text-gray-700">
              {isSwahili
                ? 'John Obure anaendesha Nairobi Climate Justice. Sera hii inaeleza taarifa tunazokusanya ili kutoa huduma, wanaoweza kuziona na jinsi ya kuomba msaada kuhusu taarifa zako.'
                : 'John Obure operates Nairobi Climate Justice. This policy explains what we collect to run the learning platform, who can see it and how to make a request about your information.'}
            </p>
            <Link to={{ search, hash: '#privacy-request' }} className="mt-4 inline-block text-sm font-semibold text-forest-green underline underline-offset-4">
              {isSwahili ? 'Tuma ombi kuhusu faragha' : 'Make a privacy request'}
            </Link>
          </div>

          <div className="space-y-7 pt-7">
            {sections.map(section => (
              <section key={section.id} aria-labelledby={section.id} className="space-y-3">
                <h2 id={section.id} className="text-xl font-semibold tracking-tight">{section[policyLanguage].title}</h2>
                {section[policyLanguage].paragraphs.map(paragraph => (
                  <p key={paragraph} className="leading-relaxed text-gray-700">{paragraph}</p>
                ))}
              </section>
            ))}

            <section aria-labelledby="privacy-rights" className="space-y-3 border-t border-gray-200 pt-6">
              <h2 id="privacy-rights" className="text-xl font-semibold tracking-tight">
                {isSwahili ? 'Haki zako na mawasiliano' : 'Your rights and how to contact us'}
              </h2>
              <p className="leading-relaxed text-gray-700">
                {isSwahili
                  ? 'Tumia fomu iliyo hapa chini kupata taarifa kuhusu data yako, kuomba nakala, kusahihisha taarifa, kupinga matumizi fulani au kuomba taarifa zifutwe inapowezekana chini ya sheria ya Kenya. Unaweza kuitumia hata bila akaunti.'
                  : 'Use the form below to ask about your data, request access or a copy, correct information, object to its use or request deletion where Kenyan law allows. You can use it without an account.'}
              </p>
              {user && (
                <p className="leading-relaxed text-gray-700">
                  {isSwahili ? 'Unaweza kusoma majibu katika Maombi Yangu ya Msaada kwenye ukurasa wa ' : 'You can read replies under My Support Inquiries in '}
                  <Link to="/help" className="font-semibold text-forest-green underline underline-offset-4">
                    {isSwahili ? 'Msaada' : 'Help'}
                  </Link>.
                </p>
              )}
              <p className="leading-relaxed text-gray-700">
                {isSwahili ? 'Unaweza pia kuwasilisha malalamiko kwa ' : 'You can also file a complaint with the '}
                <a href="https://www.odpc.go.ke/file-a-complaint/" className="font-semibold text-forest-green underline underline-offset-4">
                  {isSwahili ? 'Ofisi ya Kamishna wa Ulinzi wa Data ya Kenya' : 'Office of the Data Protection Commissioner of Kenya'}
                </a>.
              </p>
            </section>
          </div>
        </article>

        <section id="privacy-request" ref={requestSection} tabIndex={-1} aria-label={isSwahili ? 'Ombi kuhusu faragha' : 'Privacy request'}>
          <SupportInquiryForm key={user?.id ?? 'guest'} privacyRequest />
        </section>
      </main>
    </div>
  );
}
