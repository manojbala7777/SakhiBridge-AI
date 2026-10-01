import type { Lang } from "./types";

export const T = {
  ta: {
    tagline: "பேசுங்கள். புரிந்துகொள்ளுங்கள். பெறுங்கள்.",
    hero: "உங்களுக்கு தேவையான அரசாங்க உதவியை எளிதாக கண்டுபிடிக்க நான் உதவுகிறேன்.",
    speak: "பேசுங்கள்", write: "எழுதுங்கள்", listen: "கேளுங்கள்", stop: "நிறுத்து",
    simple: "எளிய முறை", on: "ஆம்", off: "இல்லை", retry: "மீண்டும் முயற்சி", home: "முகப்பு",
    send: "அனுப்புங்கள்", placeholder: "இங்கே எழுதுங்கள்", listening: "கேட்கிறேன்…",
    micFail: "மைக்ரோஃபோனை பயன்படுத்த முடியவில்லை. நீங்கள் எழுதிப் பயன்படுத்தலாம்.",
    apiFail: "மன்னிக்கவும். இப்போது ஒரு சிறிய சிக்கல் ஏற்பட்டுள்ளது.",
    working: "உங்கள் கேள்வியைப் புரிந்துகொள்கிறேன்…",
    steps: ["கண்டறிதல்", "புரிதல்", "தகுதி", "ஆவணங்கள்", "விண்ணப்ப வழி"],
    suggestions: ["எனக்கு அரசாங்கத்திலிருந்து கேஸ் சிலிண்டர் உதவி கிடைக்குமா?", "உஜ்வலா திட்டம் என்ன?", "நான் தகுதியானவரா?"],
    docsTitle: "தேவையான ஆவணங்கள்", have: "என்னிடம் உள்ளது", missing: "இல்லை", verify: "சரிபார்க்க வேண்டும்",
    guideTitle: "விண்ணப்ப வழிகாட்டி", official: "அதிகாரப்பூர்வ நடைமுறை", demo: "டெமோ வழிகாட்டி",
    openSite: "அதிகாரப்பூர்வ PMUY தளத்தைத் திறக்கவும்",
    notOfficial: "இது AI வழிகாட்டுதல் மட்டுமே. இது அரசு முடிவு அல்ல.",
    eligTitle: "உங்கள் முடிவு", youWho: "நீங்கள் தந்த தகவல்",
    status: {
      POTENTIALLY_ELIGIBLE: "பொருந்த வாய்ப்பு உள்ளது", NOT_ELIGIBLE: "ஒரு நிபந்தனை பொருந்தவில்லை",
      MISSING_INFORMATION: "மேலும் தகவல் தேவை", REQUIRES_OFFICIAL_VERIFICATION: "அதிகாரப்பூர்வ சரிபார்ப்பு தேவை",
    } as Record<string, string>,
    helpTitle: "உதவி மற்றும் அணுகல்தன்மை",
    helpBody: ["மைக் பொத்தானை அழுத்தி தமிழில் பேசலாம்.", "பேச முடியாவிட்டால் எழுதலாம்.", "ஒவ்வொரு பதிலையும் “கேளுங்கள்” பொத்தானால் கேட்கலாம்.", "“எளிய முறை” பெரிய எழுத்துகளைக் காட்டும்."],
    schemeBadge: "திட்டக் குறிப்பு",
    schemeNotes: [
      "PMUY: பெண்களுக்கான இலவச LPG சமையல் எரிவாயு இணைப்பு திட்டம்",
      "வைப்புத் தொகையற்ற இணைப்பு + முதல் சிலிண்டர் & அடுப்பு முற்றிலும் இலவசம்",
      "தேவையான 3 ஆவணங்கள்: ஆதார் அட்டை, ரேஷன் அட்டை, வங்கிக் கணக்கு",
      "18 வயது நிரம்பிய ஏழைக் குடும்பப் பெண்கள் விண்ணப்பிக்கலாம்",
      "அதிகாரப்பூர்வ தளம்: pmuy.gov.in வழியாக விண்ணப்பிக்கவும்",
    ],
    schemeModal: {
      title: "திட்டத்தின் முழு விவரங்கள்",
      badge: "மத்திய அரசுத் திட்டம்",
      name: "பிரதான் மந்திரி உஜ்வலா திட்டம் (PMUY)",
      desc: "ஏழைக் குடும்பப் பெண்களுக்கு இலவச சமையல் எரிவாயு (LPG) இணைப்பு வழங்கி, புகையில்லா சமையல் மூலம் பெண்களின் ஆரோக்கியத்தைப் பாதுகாக்கும் இந்திய அரசின் முன்னணித் திட்டம்.",
      benefitsTitle: "திட்டத்தின் சிறப்பம்சங்கள் & நன்மைகள்",
      benefits: [
        "முழு வைப்புத் தொகையற்ற (Deposit-free) புதிய கேஸ் இணைப்பு",
        "முதல் 14.2 கிலோ ரீஃபில் சிலிண்டர் முற்றிலும் இலவசம்",
        "இரண்டு பர்னர் கொண்ட புதிய கேஸ் அடுப்பு இலவசமாக வழங்கப்படும்",
        "மானியம் நேரடியாக பயனாளி பெண்களின் வங்கிக் கணக்கில் வரவு"
      ],
      eligTitle: "யாரெல்லாம் தகுதியானவர்கள்?",
      eligList: [
        "18 வயது நிரம்பிய பெண் விண்ணப்பதாரராக இருக்க வேண்டும்",
        "விண்ணப்பதாரர் குடும்பத்தில் வேறு எந்த LPG இணைப்பும் இருக்கக்கூடாது",
        "BPL / ஏழைக் குடும்பம் / அந்த்யோதயா அட்டைதாரராக இருக்க வேண்டும்",
        "இந்தியக் குடிமகளாக இருத்தல் வேண்டும்"
      ],
      docsTitle: "தேவையான 3 ஆவணங்கள்",
      docsList: [
        { name: "ஆதார் அட்டை", desc: "விண்ணப்பதாரர் மற்றும் குடும்ப உறுப்பினர்களின் அடையாள மற்றும் முகவரிச் சான்று" },
        { name: "குடும்ப அட்டை (Ration Card)", desc: "மாநில அரசால் வழங்கப்பட்ட ரேஷன் அட்டை அல்லது குடும்பப் பட்டியல்" },
        { name: "வங்கிக் கணக்கு விவரம்", desc: "மானியம் பெற ஆதார் இணைக்கப்பட்ட வங்கிக் கணக்குப் புத்தகம் மற்றும் IFSC" }
      ],
      stepsTitle: "எவ்வாறு விண்ணப்பிப்பது?",
      stepsList: [
        "1. ஆதார், ரேஷன் அட்டை, வங்கிக் கணக்கு நகல்களைத் தயார் செய்யுங்கள்",
        "2. அருகிலுள்ள LPG கேஸ் ஏஜென்சியை (Indane / BharatGas / HP Gas) அணுகவும்",
        "3. அல்லது pmuy.gov.in இணையதளத்தில் ஆன்லைனில் விண்ணப்பிக்கவும்",
        "4. பயோமெட்ரிக் / e-KYC சரிபார்ப்பை முடித்து புதிய இணைப்பைப் பெறுங்கள்"
      ],
      openOfficial: "அதிகாரப்பூர்வ PMUY தளத்திற்குச் செல்க",
      close: "மூடுக",
      clickForMore: "முழு விவரத்தைக் காண கிளிக் செய்க",
    },
  },
  en: {
    tagline: "Speak. Understand. Access.",
    hero: "I help you find the government support you need, in simple steps.",
    speak: "Speak", write: "Type", listen: "Listen", stop: "Stop",
    simple: "Simple mode", on: "On", off: "Off", retry: "Try again", home: "Home",
    send: "Send", placeholder: "Type here", listening: "Listening…",
    micFail: "The microphone could not be used. You can type instead.",
    apiFail: "Something went wrong. Please try again.",
    working: "Understanding your question…",
    steps: ["Discover", "Understand", "Eligibility", "Documents", "How to apply"],
    suggestions: ["Can I get gas cylinder help from the government?", "What is the Ujjwala scheme?", "Am I eligible?"],
    docsTitle: "Documents you need", have: "I have it", missing: "I don't", verify: "Need to check",
    guideTitle: "How to apply", official: "Official process", demo: "Demo guidance",
    openSite: "Open the official PMUY website",
    notOfficial: "This is AI guidance only. It is not a government decision.",
    eligTitle: "Your result", youWho: "What you told me",
    status: {
      POTENTIALLY_ELIGIBLE: "You may meet the criteria", NOT_ELIGIBLE: "One criterion is not met",
      MISSING_INFORMATION: "More information needed", REQUIRES_OFFICIAL_VERIFICATION: "Needs official verification",
    } as Record<string, string>,
    helpTitle: "Help and accessibility",
    helpBody: ["Press the mic button and speak.", "If you cannot speak, type instead.", "Every answer has a Listen button.", "Simple mode shows larger text."],
    schemeBadge: "Scheme Info",
    schemeNotes: [
      "PMUY: Deposit-free LPG cooking gas connection for eligible women",
      "First LPG refill cylinder and hotplate (stove) provided free of cost",
      "Only 3 documents needed: Aadhaar card, Ration card & Bank account",
      "Eligibility: Adult women (18+) from poor households with no LPG connection",
      "Official portal: Apply directly through pmuy.gov.in",
    ],
    schemeModal: {
      title: "Complete Scheme Details",
      badge: "Central Government Initiative",
      name: "Pradhan Mantri Ujjwala Yojana (PMUY)",
      desc: "A flagship Government of India scheme aimed at safeguarding the health of women and children by providing clean cooking gas (LPG) connections to impoverished households.",
      benefitsTitle: "Key Benefits & Subsidies",
      benefits: [
        "100% deposit-free new LPG cooking gas connection",
        "First 14.2 kg LPG refill cylinder provided completely free",
        "Free two-burner domestic LPG hotplate (stove) included",
        "Targeted government subsidies deposited directly into bank account"
      ],
      eligTitle: "Eligibility Criteria",
      eligList: [
        "Applicant must be an adult woman (aged 18 or above)",
        "No existing LPG connection in the entire household",
        "Belong to poor / BPL / SECC / eligible marginalized categories",
        "Must be a resident Indian citizen"
      ],
      docsTitle: "Required Documents (Only 3 Needed)",
      docsList: [
        { name: "Aadhaar Card", desc: "Proof of identity and residential address for applicant and adult family members" },
        { name: "Ration Card", desc: "State-issued family ration card or official family composition document" },
        { name: "Bank Account Passbook", desc: "Aadhaar-linked active bank account with IFSC code for direct subsidy" }
      ],
      stepsTitle: "How to Apply (Offline / Online)",
      stepsList: [
        "1. Gather photocopies of Aadhaar, Ration Card, and Bank passbook",
        "2. Visit your nearest LPG distributor (Indane, BharatGas, or HP Gas)",
        "3. Or apply online through the official portal pmuy.gov.in",
        "4. Complete biometric / e-KYC verification to receive stove & cylinder"
      ],
      openOfficial: "Open Official pmuy.gov.in Portal",
      close: "Close",
      clickForMore: "Click to view full scheme details",
    },
  },
} satisfies Record<Lang, unknown>;

export const speechLocale: Record<Lang, string> = { ta: "ta-IN", en: "en-IN" };
