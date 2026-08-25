export interface TirthankarInfo {
  id: string;
  number: number;
  nameHindi: string;
  nameEn: string;
  titleHindi: string;
  subtitleHindi: string;
  symbol: string;
  symbolEmoji: string;
  color: string;
  father: string;
  mother: string;
  birthPlace: string;
  nirvanaPlace: string;
  kevalgyanTree: string;
  yakshaYakshini: string;
  dynasty: string;
  age: string;
  mantra: string;
  chalisaId?: string;
  artiId?: string;
  pujaId?: string;
  bioHindi: string;
  bioEn: string;
  kalyanak: {
    garbha: string;
    janma: string;
    tap: string;
    gyan: string;
    moksha: string;
  };
}

export const TIRTHANKARAS: TirthankarInfo[] = [
  {
    id: "adinath",
    number: 1,
    nameHindi: "श्री आदिनाथ भगवान (ऋषभदेव)",
    nameEn: "Lord Adinath (Rishabhanatha)",
    titleHindi: "प्रथम तीर्थंकर श्री आदिनाथ भगवान",
    subtitleHindi: "युगादि पुरुष, कर्मभूमि के प्रवर्तक एवं प्रथम जिन",
    symbol: "वृषभ (बैल)",
    symbolEmoji: "🐂",
    color: "स्वर्ण वर्ण (Golden)",
    father: "राजा नाभिराज",
    mother: "महारानी मरुदेवी",
    birthPlace: "अयोध्या नगरी",
    nirvanaPlace: "अष्टापद (कैलाश पर्वत)",
    kevalgyanTree: "वट वृक्ष (बरगद)",
    yakshaYakshini: "गोमुख यक्ष / चक्रेश्वरी देवी",
    dynasty: "इक्ष्वाकु वंश",
    age: "८४ लाख पूर्व",
    mantra: "ॐ ह्रीं श्री १००८ ऋषभनाथ जिनेन्द्राय नमः",
    chalisaId: "adinath-chalisa",
    artiId: "adinath-arti",
    pujaId: "chaubis-tirthankar-puja",
    bioHindi: "भगवान आदिनाथ (ऋषभदेव) वर्तमान अवसर्पिणी काल के प्रथम तीर्थंकर हैं। उन्होंने ही मानव सभ्यता को 'भोगभूमि' से 'कर्मभूमि' में प्रवेश कराया और जीवन जीने की छह प्रमुख कलाएं—असि (सुरक्षा), मसि (लेखन), कृषि (खेती), विद्या (ज्ञान), वाणिज्य (व्यापार) और शिल्प (कला-कौशल)—सिखाईं। इंद्र सभा में नीलांजना का नृत्य देखते हुए उसकी क्षणिक मृत्यु को लखकर उन्हें परम वैराग्य हुआ। १ वर्ष के मौन तप के उपरांत हस्तिनापुर में राजा श्रेयांस ने उन्हें इक्षुरस (गन्ने के रस) का प्रथम आहार दिया (अक्षय तृतीया)। कैलाश पर्वत से उन्हें निर्वाण प्राप्त हुआ।",
    bioEn: "Lord Adinath, born as Rishabhadeva, is the first Tirthankara of the current cosmic time cycle. He civilized human society by introducing the six vital skills (Asi, Masi, Krishi, Vidya, Vanijya, Shilpa). Witnessing the transient dance of Nilanjana triggered his deep spiritual renunciation. He attained Nirvana from Mount Kailash (Ashtapada).",
    kalyanak: {
      garbha: "आषाढ़ कृष्ण द्वितीया",
      janma: "चैत्र कृष्ण नवमी",
      tap: "चैत्र कृष्ण नवमी",
      gyan: "फाल्गुन कृष्ण एकादशी",
      moksha: "माघ कृष्ण चतुर्दशी"
    }
  },
  {
    id: "ajitnath",
    number: 2,
    nameHindi: "श्री अजितनाथ भगवान",
    nameEn: "Lord Ajitnath",
    titleHindi: "द्वितीय तीर्थंकर श्री अजितनाथ भगवान",
    subtitleHindi: "अजेय कर्म विजेता",
    symbol: "गज (हाथी)",
    symbolEmoji: "🐘",
    color: "स्वर्ण वर्ण (Golden)",
    father: "महाराजा जितशत्रु",
    mother: "महारानी विजया देवी",
    birthPlace: "अयोध्या नगरी",
    nirvanaPlace: "सम्मेद शिखरजी",
    kevalgyanTree: "सप्तपर्ण वृक्ष",
    yakshaYakshini: "महायाक्ष / रोहिणी देवी",
    dynasty: "इक्ष्वाकु वंश",
    age: "७२ लाख पूर्व",
    mantra: "ॐ ह्रीं श्री १००८ अजितनाथ जिनेन्द्राय नमः",
    chalisaId: "ajitnath-chalisa",
    artiId: "chaubiso-bhagwan-arti",
    pujaId: "chaubis-tirthankar-puja",
    bioHindi: "द्वितीय तीर्थंकर भगवान अजितनाथ का जन्म अयोध्या में हुआ। उनका नाम 'अजित' इसलिए पड़ा क्योंकि वे आंतरिक विकारों (काम, क्रोध, लोभ, मोह) और समस्त कर्म-शत्रुओं से अपराजेय रहे। उनका राजकाल न्याय और धर्म का स्वर्णिम युग था। संसार के नश्वर स्वरूप का चिंतन करते हुए उन्होंने दीक्षा अंगीकार की और सम्मेद शिखरजी से मोक्ष प्राप्त किया।",
    bioEn: "Lord Ajitnath, meaning 'The Invincible', conquered all inner passions and karmas. Born in Ayodhya to King Jitashatru and Queen Vijaya, he attained ultimate liberation from Sammed Shikharji.",
    kalyanak: {
      garbha: "ज्येष्ठ शुक्ल पूर्णिमा",
      janma: "माघ शुक्ल दशमी",
      tap: "माघ शुक्ल दशमी",
      gyan: "पौष शुक्ल एकादशी",
      moksha: "चैत्र शुक्ल पंचमी"
    }
  },
  {
    id: "sambhavnath",
    number: 3,
    nameHindi: "श्री संभवनाथ भगवान",
    nameEn: "Lord Sambhavnath",
    titleHindi: "तृतीय तीर्थंकर श्री संभवनाथ भगवान",
    subtitleHindi: "विश्व कल्याण की संभावना के अग्रदूत",
    symbol: "अश्व (घोड़ा)",
    symbolEmoji: "🐎",
    color: "स्वर्ण वर्ण (Golden)",
    father: "महाराजा जितारी",
    mother: "महारानी सुषेणा देवी",
    birthPlace: "श्रावस्ती नगरी",
    nirvanaPlace: "सम्मेद शिखरजी",
    kevalgyanTree: "शाल वृक्ष",
    yakshaYakshini: "त्रिमुख यक्ष / प्रज्ञप्ति देवी",
    dynasty: "इक्ष्वाकु वंश",
    age: "६० लाख पूर्व",
    mantra: "ॐ ह्रीं श्री १००८ संभवनाथ जिनेन्द्राय नमः",
    chalisaId: "sambhavnath-chalisa",
    artiId: "chaubiso-bhagwan-arti",
    pujaId: "chaubis-tirthankar-puja",
    bioHindi: "तृतीय तीर्थंकर भगवान संभवनाथ का जन्म श्रावस्ती नगरी में हुआ था। जब वे माता के गर्भ में आए, तब राज्य में पड़े भीषण दुर्भिक्ष (अकाल) का निवारण हुआ और चारों ओर समृद्धि तथा शुभ संभावनाओं का संचार हुआ, इसलिए उनका नाम संभवनाथ रखा गया। सम्मेद शिखरजी से उन्होंने निर्वाण प्राप्त किया।",
    bioEn: "Lord Sambhavnath was born in Shravasti. His arrival brought an end to drought and distress in the kingdom, filling the world with auspicious possibilities (Sambhava). He attained liberation from Sammed Shikharji.",
    kalyanak: {
      garbha: "फाल्गुन शुक्ल अष्टमी",
      janma: "कार्तिक शुक्ल पूर्णिमा",
      tap: "कार्तिक शुक्ल पूर्णिमा",
      gyan: "कार्तिक कृष्ण चतुर्थी",
      moksha: "चैत्र शुक्ल षष्ठी"
    }
  },
  {
    id: "abhinandannath",
    number: 4,
    nameHindi: "श्री अभिनंदननाथ भगवान",
    nameEn: "Lord Abhinandannath",
    titleHindi: "चतुर्थ तीर्थंकर श्री अभिनंदननाथ भगवान",
    subtitleHindi: "समस्त लोकों द्वारा वंदित",
    symbol: "कपि (वानर/बंदर)",
    symbolEmoji: "🐒",
    color: "स्वर्ण वर्ण (Golden)",
    father: "महाराजा संवर",
    mother: "महारानी सिद्धार्था देवी",
    birthPlace: "अयोध्या नगरी",
    nirvanaPlace: "सम्मेद शिखरजी",
    kevalgyanTree: "सरल वृक्ष",
    yakshaYakshini: "यक्षेश्वर / वज्रश्रृंखला देवी",
    dynasty: "इक्ष्वाकु वंश",
    age: "५० लाख पूर्व",
    mantra: "ॐ ह्रीं श्री १००८ अभिनंदननाथ जिनेन्द्राय नमः",
    chalisaId: "abhinandannath-chalisa",
    artiId: "chaubiso-bhagwan-arti",
    pujaId: "chaubis-tirthankar-puja",
    bioHindi: "चतुर्थ तीर्थंकर भगवान अभिनंदननाथ अयोध्या में जन्मे। उनके गर्भ में आते ही देवों और मनुष्यों ने उनका भावभीना अभिनंदन किया। उनका प्रतीक वानर चंचलता के निरोध और मन के संयम का संदेश देता है। कठोर तपस्या के पश्चात सम्मेद शिखरजी से उन्हें मोक्ष मिला।",
    bioEn: "Lord Abhinandannath was born in Ayodhya. His conception brought joy and joyous greetings (Abhinandana) from celestial beings and humanity alike. He attained Moksha at Sammed Shikharji.",
    kalyanak: {
      garbha: "वैशाख शुक्ल षष्ठी",
      janma: "माघ शुक्ल द्वादशी",
      tap: "माघ शुक्ल द्वादशी",
      gyan: "पौष शुक्ल चतुर्दशी",
      moksha: "वैशाख शुक्ल सप्तमी"
    }
  },
  {
    id: "sumatinath",
    number: 5,
    nameHindi: "श्री सुमतिनाथ भगवान",
    nameEn: "Lord Sumatinath",
    titleHindi: "पंचम तीर्थंकर श्री सुमतिनाथ भगवान",
    subtitleHindi: "सद्बुद्धि और सम्यग्ज्ञान के दाता",
    symbol: "चकवा (क्रौंच पक्षी)",
    symbolEmoji: "🦆",
    color: "स्वर्ण वर्ण (Golden)",
    father: "महाराजा मेघप्रभ",
    mother: "महारानी मंगला देवी (सुमंगला)",
    birthPlace: "अयोध्या नगरी",
    nirvanaPlace: "सम्मेद शिखरजी",
    kevalgyanTree: "प्रियंगु वृक्ष",
    yakshaYakshini: "तुम्ब्रू यक्ष / वज्रांकुशी देवी",
    dynasty: "इक्ष्वाकु वंश",
    age: "४० लाख पूर्व",
    mantra: "ॐ ह्रीं श्री १००८ सुमतिनाथ जिनेन्द्राय नमः",
    chalisaId: "sumatinath-chalisa",
    artiId: "chaubiso-bhagwan-arti",
    pujaId: "chaubis-tirthankar-puja",
    bioHindi: "पाँचवें तीर्थंकर भगवान सुमतिनाथ का जन्म अयोध्या में हुआ। 'सुमति' का अर्थ है श्रेष्ठ एवं सम्यक बुद्धि। उन्होंने सिखाया कि शुद्ध मति और आत्म-विवेक ही जीव को संसार के दुखों से पार लगाकर अनंत सुख की प्राप्ति करा सकता है।",
    bioEn: "Lord Sumatinath, born in Ayodhya, epitomized pure intellect and right discernment (Sumati). He preached that spiritual awakening begins with righteous wisdom.",
    kalyanak: {
      garbha: "श्रावण शुक्ल द्वितीया",
      janma: "चैत्र शुक्ल एकादशी",
      tap: "चैत्र शुक्ल एकादशी",
      gyan: "चैत्र शुक्ल एकादशी",
      moksha: "चैत्र शुक्ल नवमी"
    }
  },
  {
    id: "padmaprabh",
    number: 6,
    nameHindi: "श्री पद्मप्रभ भगवान",
    nameEn: "Lord Padmaprabha",
    titleHindi: "षष्ठ तीर्थंकर श्री पद्मप्रभ भगवान",
    subtitleHindi: "कमलवत निर्लेप जीवन के आदर्श",
    symbol: "पद्म (लाल कमल)",
    symbolEmoji: "🪷",
    color: "रक्त वर्ण (Red)",
    father: "महाराजा धरण (पद्मोत्तर)",
    mother: "महारानी सुसीमा देवी",
    birthPlace: "कौशाम्बी नगरी",
    nirvanaPlace: "सम्मेद शिखरजी",
    kevalgyanTree: "छत्रपलाश वृक्ष",
    yakshaYakshini: "कुसुम यक्ष / मनोवेगा देवी",
    dynasty: "इक्ष्वाकु वंश",
    age: "३० लाख पूर्व",
    mantra: "ॐ ह्रीं श्री १००८ पद्मप्रभ जिनेन्द्राय नमः",
    chalisaId: "padmaprabh-chalisa",
    artiId: "chaubiso-bhagwan-arti",
    pujaId: "chaubis-tirthankar-puja",
    bioHindi: "छठवें तीर्थंकर भगवान पद्मप्रभ कौशाम्बी में जन्मे। उनका शरीर लाल कमल की भांति कांतियुक्त और सुकोमल था। उन्होंने उपदेश दिया कि जिस प्रकार कमल कीचड़ और जल में रहते हुए भी उनसे अछूता रहता है, उसी प्रकार आत्मा को संसार में रहते हुए भी कर्म-मल से निर्लिप्त रहना चाहिए।",
    bioEn: "Lord Padmaprabha was born in Kaushambi. Resembling the pristine red lotus (Padma), he taught human souls to live unattached amidst worldly mire and attain pure transcendence.",
    kalyanak: {
      garbha: "माघ कृष्ण षष्ठी",
      janma: "कार्तिक कृष्ण द्वादशी",
      tap: "कार्तिक कृष्ण त्रयोदशी",
      gyan: "पौष कृष्ण एकादशी",
      moksha: "फाल्गुन कृष्ण चतुर्थी"
    }
  },
  {
    id: "suparshvanath",
    number: 7,
    nameHindi: "श्री सुपार्श्वनाथ भगवान",
    nameEn: "Lord Suparshvanath",
    titleHindi: "सप्तम तीर्थंकर श्री सुपार्श्वनाथ भगवान",
    subtitleHindi: "परम पावन कल्याणकारी प्रभु",
    symbol: "स्वास्तिक (卐 साथिया)",
    symbolEmoji: "卐",
    color: "स्वर्ण / हरित वर्ण",
    father: "महाराजा सुप्रतिष्ठ",
    mother: "महारानी पृथ्वी देवी",
    birthPlace: "वाराणसी नगरी (काशी)",
    nirvanaPlace: "सम्मेद शिखरजी",
    kevalgyanTree: "शिरीष वृक्ष",
    yakshaYakshini: "मातंग यक्ष / काली देवी",
    dynasty: "इक्ष्वाकु वंश",
    age: "२० लाख पूर्व",
    mantra: "ॐ ह्रीं श्री १००८ सुपार्श्वनाथ जिनेन्द्राय नमः",
    chalisaId: "suparshvanath-chalisa",
    artiId: "chaubiso-bhagwan-arti",
    pujaId: "chaubis-tirthankar-puja",
    bioHindi: "सातवें तीर्थंकर भगवान सुपार्श्वनाथ का जन्म काशी (वाराणसी) में हुआ। उनका मांगलिक चिह्न 'स्वास्तिक' है जो चारों गतियों के बंधनों को तोड़कर पंचम गति (मोक्ष) को प्राप्त करने का प्रतीक है। सम्मेद शिखरजी से उन्होंने निर्वाण प्राप्त किया।",
    bioEn: "Lord Suparshvanath was born in Varanasi. His sacred emblem, the Swastika, symbolizes universal auspiciousness and crossing the four states of mundane existence to attain liberation.",
    kalyanak: {
      garbha: "भाद्रपद शुक्ल षष्ठी",
      janma: "ज्येष्ठ शुक्ल द्वादशी",
      tap: "ज्येष्ठ शुक्ल द्वादशी",
      gyan: "फाल्गुन कृष्ण षष्ठी",
      moksha: "फाल्गुन कृष्ण सप्तमी"
    }
  },
  {
    id: "chandraprabh",
    number: 8,
    nameHindi: "श्री चन्द्रप्रभ भगवान",
    nameEn: "Lord Chandraprabha",
    titleHindi: "अष्टम तीर्थंकर श्री चन्द्रप्रभ भगवान",
    subtitleHindi: "चन्द्रमा सदृश परम शांत व शीतल प्रभु",
    symbol: "चन्द्रमा (अर्धचन्द्र)",
    symbolEmoji: "🌙",
    color: "श्वेत वर्ण (White / Moonlit)",
    father: "महाराजा महासेन",
    mother: "महारानी लक्ष्मणा देवी",
    birthPlace: "चन्द्रपुरी (चन्द्रावती)",
    nirvanaPlace: "सम्मेद शिखरजी",
    kevalgyanTree: "नागवृक्ष",
    yakshaYakshini: "विजय यक्ष / ज्वालामालिनी देवी",
    dynasty: "इक्ष्वाकु वंश",
    age: "१० लाख पूर्व",
    mantra: "ॐ ह्रीं श्री १००८ चन्द्रप्रभ जिनेन्द्राय नमः",
    chalisaId: "chandraprabh-chalisa",
    artiId: "chaubiso-bhagwan-arti",
    pujaId: "chaubis-tirthankar-puja",
    bioHindi: "आठवें तीर्थंकर भगवान चन्द्रप्रभ की जन्मस्थली चन्द्रपुरी है। चन्द्रमा के समान शीतल, शांत और उज्ज्वल होने के कारण वे चन्द्रप्रभ कहलाए। उनके दर्शन और स्मरण मात्र से आत्मा में शांति और कषायों की मंदता उत्पन्न होती है। सम्मेद शिखर से उन्हें मोक्ष मिला।",
    bioEn: "Lord Chandraprabha was born in Chandrapuri. Radiating tranquility and purity akin to the full moon, he pacified the fiery passions of living beings and guided them to spiritual perfection.",
    kalyanak: {
      garbha: "चैत्र कृष्ण पंचमी",
      janma: "पौष कृष्ण एकादशी",
      tap: "पौष कृष्ण एकादशी",
      gyan: "फाल्गुन कृष्ण सप्तमी",
      moksha: "फाल्गुन शुक्ल सप्तमी"
    }
  },
  {
    id: "pushpadant",
    number: 9,
    nameHindi: "श्री पुष्पदंत भगवान (सुविधिनाथ)",
    nameEn: "Lord Pushpadanta (Suvidhinath)",
    titleHindi: "नवम तीर्थंकर श्री पुष्पदंत भगवान",
    subtitleHindi: "सुविधि और धर्म-मार्ग के संस्थापक",
    symbol: "मकर (मगरमच्छ)",
    symbolEmoji: "🐊",
    color: "श्वेत वर्ण (White)",
    father: "महाराजा सुग्रीव",
    mother: "महारानी जयरामा देवी (रामा)",
    birthPlace: "काकंदी नगरी",
    nirvanaPlace: "सम्मेद शिखरजी",
    kevalgyanTree: "सालि वृक्ष",
    yakshaYakshini: "अजित यक्ष / महाकाली देवी",
    dynasty: "इक्ष्वाकु वंश",
    age: "२ लाख पूर्व",
    mantra: "ॐ ह्रीं श्री १००८ पुष्पदंत जिनेन्द्राय नमः",
    chalisaId: "pushpadant-chalisa",
    artiId: "chaubiso-bhagwan-arti",
    pujaId: "chaubis-tirthankar-puja",
    bioHindi: "नौवें तीर्थंकर भगवान पुष्पदंत (सुविधिनाथ) का जन्म काकंदी में हुआ। उनके दांत पुष्प की कलियों के समान सुंदर थे। उन्होंने धर्म की लुप्त होती सु-विधि (सच्ची पद्धति) को पुनः स्थापित किया, इसलिए वे सुविधिनाथ भी कहलाए।",
    bioEn: "Lord Pushpadanta, also venerated as Suvidhinath, restored the correct spiritual methods and rites (Su-vidhi) in human consciousness. He attained Nirvana at Sammed Shikharji.",
    kalyanak: {
      garbha: "फाल्गुन कृष्ण नवमी",
      janma: "मार्गशीर्ष शुक्ल प्रथम",
      tap: "मार्गशीर्ष शुक्ल प्रथम",
      gyan: "कार्तिक शुक्ल द्वितीया",
      moksha: "कार्तिक शुक्ल अष्टमी"
    }
  },
  {
    id: "sheetalnath",
    number: 10,
    nameHindi: "श्री शीतलनाथ भगवान",
    nameEn: "Lord Shitalanatha",
    titleHindi: "दशम तीर्थंकर श्री शीतलनाथ भगवान",
    subtitleHindi: "संसार-ताप को हरने वाले परम शांत प्रभु",
    symbol: "कल्पवृक्ष / श्रीवत्स",
    symbolEmoji: "🌲",
    color: "स्वर्ण वर्ण (Golden)",
    father: "महाराजा दृढ़रथ",
    mother: "महारानी सुनन्दा देवी (नन्दा)",
    birthPlace: "भद्रिकापुरी (भद्दलपुर)",
    nirvanaPlace: "सम्मेद शिखरजी",
    kevalgyanTree: "धूली वृक्ष",
    yakshaYakshini: "ब्रह्मा यक्ष / मानवी देवी",
    dynasty: "इक्ष्वाकु वंश",
    age: "१ लाख पूर्व",
    mantra: "ॐ ह्रीं श्री १००८ शीतलनाथ जिनेन्द्राय नमः",
    chalisaId: "sheetalnath-chalisa",
    artiId: "chaubiso-bhagwan-arti",
    pujaId: "chaubis-tirthankar-puja",
    bioHindi: "दसवें तीर्थंकर भगवान शीतलनाथ का जन्म भद्दलपुर में हुआ। जब वे गर्भ में थे तब उनके प्रभाव से पिता का तीव्र दाह-ज्वर शांत हुआ। कल्पवृक्ष के समान वे भव्य जीवों की सभी आध्यात्मिक अभिलाषाओं को पूर्ण कर भव-ताप को शीतल करते हैं।",
    bioEn: "Lord Shitalanatha brought cooling solace (Sheetalta) to souls tormented by the scorching fires of passions. Born in Bhaddalpur, he attained liberation at Sammed Shikharji.",
    kalyanak: {
      garbha: "चैत्र कृष्ण अष्टमी",
      janma: "माघ कृष्ण द्वादशी",
      tap: "माघ कृष्ण द्वादशी",
      gyan: "पौष कृष्ण चतुर्दशी",
      moksha: "वैशाख कृष्ण द्वितीया"
    }
  },
  {
    id: "shreyansanath",
    number: 11,
    nameHindi: "श्री श्रेयांसनाथ भगवान",
    nameEn: "Lord Shreyansanatha",
    titleHindi: "एकादश तीर्थंकर श्री श्रेयांसनाथ भगवान",
    subtitleHindi: "परम श्रेय (कल्याण) के प्रदाता",
    symbol: "खड्गी (गैंडा)",
    symbolEmoji: "🦏",
    color: "स्वर्ण वर्ण (Golden)",
    father: "महाराजा विष्णुराज",
    mother: "महारानी वेणु देवी (विष्णुश्री)",
    birthPlace: "सिंहपुरी (सारनाथ, वाराणसी)",
    nirvanaPlace: "सम्मेद शिखरजी",
    kevalgyanTree: "तेंदुक वृक्ष",
    yakshaYakshini: "यक्षेश्वर / गौरी देवी",
    dynasty: "इक्ष्वाकु वंश",
    age: "८४ लाख वर्ष",
    mantra: "ॐ ह्रीं श्री १००८ श्रेयांसनाथ जिनेन्द्राय नमः",
    chalisaId: "shreyansanath-chalisa",
    artiId: "chaubiso-bhagwan-arti",
    pujaId: "chaubis-tirthankar-puja",
    bioHindi: "ग्यारहवें तीर्थंकर भगवान श्रेयांसनाथ का जन्म सिंहपुरी में हुआ। 'श्रेयस्' का अर्थ है परम कल्याण। उन्होंने बताया कि बाह्य सुख क्षणभंगुर हैं और केवल आत्म-कल्याण ही शाश्वत श्रेय है। सम्मेद शिखरजी से उन्होंने निर्वाण प्राप्त किया।",
    bioEn: "Lord Shreyansanatha was born in Simhapuri near Sarnath. Guiding souls toward their highest spiritual good (Shreyas), he attained Moksha at Sammed Shikharji.",
    kalyanak: {
      garbha: "ज्येष्ठ कृष्ण षष्ठी",
      janma: "फाल्गुन कृष्ण एकादशी",
      tap: "फाल्गुन कृष्ण एकादशी",
      gyan: "माघ कृष्ण अमावस्या",
      moksha: "श्रावण शुक्ल पूर्णिमा"
    }
  },
  {
    id: "vasupujya",
    number: 12,
    nameHindi: "श्री वासुपूज्य भगवान",
    nameEn: "Lord Vasupujya",
    titleHindi: "द्वादश तीर्थंकर श्री वासुपूज्य भगवान",
    subtitleHindi: "बाल ब्रह्मचारी एवं पंचकल्याणक चम्पापुरी प्रभु",
    symbol: "महिष (भैंसा)",
    symbolEmoji: "🐃",
    color: "रक्त वर्ण (Red)",
    father: "महाराजा वसुपूज्य",
    mother: "महारानी जयावती देवी",
    birthPlace: "चम्पापुरी नगरी",
    nirvanaPlace: "चम्पापुरी नगरी",
    kevalgyanTree: "पाटल वृक्ष",
    yakshaYakshini: "कुमार यक्ष / गांधारी देवी",
    dynasty: "इक्ष्वाकु वंश",
    age: "७२ लाख वर्ष",
    mantra: "ॐ ह्रीं श्री १००८ वासुपूज्य जिनेन्द्राय नमः",
    chalisaId: "vasupujya-chalisa",
    artiId: "chaubiso-bhagwan-arti",
    pujaId: "chaubis-tirthankar-puja",
    bioHindi: "बारहवें तीर्थंकर भगवान वासुपूज्य का जीवन अत्यंत अनुपम है। वे बाल ब्रह्मचारी रहे और राज्य का त्याग कर सीधे मुनि दीक्षा ली। उनकी सबसे बड़ी विशेषता यह है कि उनके पाँचों कल्याणक (गर्भ, जन्म, तप, ज्ञान और मोक्ष) पवित्र चम्पापुरी नगरी में ही संपन्न हुए।",
    bioEn: "Lord Vasupujya is uniquely distinguished as having all five of his auspicious Kalyanakas (Garbha, Janma, Tapa, Jnana, and Moksha) take place in the sacred city of Champapuri.",
    kalyanak: {
      garbha: "आषाढ़ कृष्ण नवमी",
      janma: "फाल्गुन कृष्ण चतुर्दशी",
      tap: "फाल्गुन कृष्ण चतुर्दशी",
      gyan: "माघ कृष्ण द्वितीया",
      moksha: "भाद्रपद शुक्ल चौदस"
    }
  },
  {
    id: "vimalanath",
    number: 13,
    nameHindi: "श्री विमलनाथ भगवान",
    nameEn: "Lord Vimalanatha",
    titleHindi: "त्रयोदश तीर्थंकर श्री विमलनाथ भगवान",
    subtitleHindi: "निर्मल भाव एवं आत्म-विशुद्धि के प्रतीक",
    symbol: "वराह (शूकर/सूअर)",
    symbolEmoji: "🐗",
    color: "स्वर्ण वर्ण (Golden)",
    father: "महाराजा कृतवर्मा",
    mother: "महारानी जयश्यामा देवी",
    birthPlace: "काम्पिल्यजी (कंपिला)",
    nirvanaPlace: "सम्मेद शिखरजी",
    kevalgyanTree: "जामुन वृक्ष",
    yakshaYakshini: "षण्मुख यक्ष / वैरोटी देवी",
    dynasty: "इक्ष्वाकु वंश",
    age: "६० लाख वर्ष",
    mantra: "ॐ ह्रीं श्री १००८ विमलनाथ जिनेन्द्राय नमः",
    chalisaId: "vimalanath-chalisa",
    artiId: "chaubiso-bhagwan-arti",
    pujaId: "chaubis-tirthankar-puja",
    bioHindi: "तेरहवें तीर्थंकर भगवान विमलनाथ काम्पिल्यजी में जन्मे। 'विमल' अर्थात निर्मल और निष्कलंक। उन्होंने सिखाया कि कर्म-मल से ढकी आत्मा को सम्यक चारित्र के जल से धोकर विमल और शुद्ध बनाया जा सकता है।",
    bioEn: "Lord Vimalanatha was born in Kampilaji. Embodiment of pristine purity (Vimalata), he taught the path to cleanse the soul of karmic impurities.",
    kalyanak: {
      garbha: "ज्येष्ठ कृष्ण दशमी",
      janma: "माघ शुक्ल तृतीया",
      tap: "माघ शुक्ल तृतीया",
      gyan: "पौष कृष्ण षष्ठी",
      moksha: "आषाढ़ कृष्ण अष्टमी"
    }
  },
  {
    id: "anantanath",
    number: 14,
    nameHindi: "श्री अनंतनाथ भगवान",
    nameEn: "Lord Anantanatha",
    titleHindi: "चतुर्दश तीर्थंकर श्री अनंतनाथ भगवान",
    subtitleHindi: "अनंत चतुष्टय के धारक प्रभु",
    symbol: "श्येन (बाज पक्षी / भालू)",
    symbolEmoji: "🦅",
    color: "स्वर्ण वर्ण (Golden)",
    father: "महाराजा सिंहसेन",
    mother: "महारानी सुयशा देवी",
    birthPlace: "अयोध्या नगरी",
    nirvanaPlace: "सम्मेद शिखरजी",
    kevalgyanTree: "अशोक वृक्ष",
    yakshaYakshini: "पाताल यक्ष / अनन्तमती देवी",
    dynasty: "इक्ष्वाकु वंश",
    age: "३० लाख वर्ष",
    mantra: "ॐ ह्रीं श्री १००८ अनंतनाथ जिनेन्द्राय नमः",
    chalisaId: "anantanath-chalisa",
    artiId: "chaubiso-bhagwan-arti",
    pujaId: "chaubis-tirthankar-puja",
    bioHindi: "चौदहवें तीर्थंकर भगवान अनंतनाथ अयोध्या में जन्मे। आत्मा के अनंत ज्ञान, अनंत दर्शन, अनंत सुख और अनंत वीर्य रूप 'अनंत चतुष्टय' को प्रकट करने के कारण वे अनंतनाथ कहलाए। सम्मेद शिखरजी से मोक्ष प्राप्त किया।",
    bioEn: "Lord Anantanatha was born in Ayodhya. Manifesting the infinite spiritual attributes (Ananta Chatustaya) of the pure self, he attained Nirvana at Sammed Shikharji.",
    kalyanak: {
      garbha: "कार्तिक कृष्ण प्रथम",
      janma: "ज्येष्ठ कृष्ण द्वादशी",
      tap: "ज्येष्ठ कृष्ण द्वादशी",
      gyan: "वैशाख कृष्ण चतुर्दशी",
      moksha: "चैत्र कृष्ण अमावस्या"
    }
  },
  {
    id: "dharmanath",
    number: 15,
    nameHindi: "श्री धर्मनाथ भगवान",
    nameEn: "Lord Dharmanatha",
    titleHindi: "पंचदश तीर्थंकर श्री धर्मनाथ भगवान",
    subtitleHindi: "दशलक्षण धर्म के महान प्रवर्तक",
    symbol: "वज्र",
    symbolEmoji: "⚡",
    color: "स्वर्ण वर्ण (Golden)",
    father: "महाराजा भानुराज",
    mother: "महारानी सुव्रता देवी",
    birthPlace: "रत्नपुरी नगरी",
    nirvanaPlace: "सम्मेद शिखरजी",
    kevalgyanTree: "दधिपर्ण वृक्ष",
    yakshaYakshini: "किन्नर यक्ष / मानसी देवी",
    dynasty: "इक्ष्वाकु वंश",
    age: "१० लाख वर्ष",
    mantra: "ॐ ह्रीं श्री १००८ धर्मनाथ जिनेन्द्राय नमः",
    chalisaId: "dharmanath-chalisa",
    artiId: "chaubiso-bhagwan-arti",
    pujaId: "chaubis-tirthankar-puja",
    bioHindi: "पंद्रहवें तीर्थंकर भगवान धर्मनाथ का जन्म रत्नपुरी में हुआ। उनका चिह्न 'वज्र' धर्म की दृढ़ता और अटलता का प्रतीक है। उन्होंने उत्तम क्षमादि दशलक्षण धर्म और अहिंसा रूपी परम धर्म का उद्घोष किया।",
    bioEn: "Lord Dharmanatha was born in Ratnapuri. Bearing the invincible Vajra thunderbolt emblem, he revitalized the ten universal virtues of supreme Dharma across the world.",
    kalyanak: {
      garbha: "वैशाख शुक्ल त्रयोदशी",
      janma: "माघ शुक्ल त्रयोदशी",
      tap: "माघ शुक्ल त्रयोदशी",
      gyan: "पौष शुक्ल पूर्णिमा",
      moksha: "ज्येष्ठ शुक्ल पंचमी"
    }
  },
  {
    id: "shantinath",
    number: 16,
    nameHindi: "श्री शांतिनाथ भगवान",
    nameEn: "Lord Shantinatha",
    titleHindi: "षोडश तीर्थंकर श्री शांतिनाथ भगवान",
    subtitleHindi: "पंचम चक्रवर्ती एवं जगत् में शांति के प्रदाता",
    symbol: "मृग (हिरण)",
    symbolEmoji: "🦌",
    color: "स्वर्ण वर्ण (Golden)",
    father: "महाराजा विश्वसेन",
    mother: "महारानी अचिरा देवी",
    birthPlace: "हस्तिनापुर नगरी",
    nirvanaPlace: "सम्मेद शिखरजी",
    kevalgyanTree: "नंदी वृक्ष",
    yakshaYakshini: "गरुड़ यक्ष / महामानसी देवी",
    dynasty: "कुरु वंश / इक्ष्वाकु",
    age: "१ लाख वर्ष",
    mantra: "ॐ ह्रीं श्री १००८ शांतिनाथ जिनेन्द्राय नमः",
    chalisaId: "shantinath-chalisa",
    artiId: "shantinath-arti",
    pujaId: "chaubis-tirthankar-puja",
    bioHindi: "सोलहवें तीर्थंकर भगवान शांतिनाथ कामदेव, चक्रवर्ती और तीर्थंकर—तीनों महान पदों के धारक थे। उनके जन्म से संसार में फैली महामारी और अशांति शांत हुई। आज भी संकट निवारण एवं विश्व शांति हेतु 'शांतिधारा' में उनका स्मरण अग्रगण्य है। हस्तिनापुर में जन्मे प्रभु ने सम्मेद शिखरजी से मोक्ष प्राप्त किया।",
    bioEn: "Lord Shantinatha was the 5th Chakravarti king and 16th Tirthankara, embodying universal peace. His recitation is invoked in the supreme Shantidhara ritual for cosmic peace.",
    kalyanak: {
      garbha: "भाद्रपद कृष्ण सप्तमी",
      janma: "ज्येष्ठ कृष्ण चतुर्दशी",
      tap: "ज्येष्ठ कृष्ण चतुर्दशी",
      gyan: "पौष शुक्ल दशमी",
      moksha: "ज्येष्ठ कृष्ण चतुर्दशी"
    }
  },
  {
    id: "kunthunath",
    number: 17,
    nameHindi: "श्री कुन्थुनाथ भगवान",
    nameEn: "Lord Kunthunatha",
    titleHindi: "सप्तदश तीर्थंकर श्री कुन्थुनाथ भगवान",
    subtitleHindi: "छठवें चक्रवर्ती एवं कामदेव पदधारी जिन",
    symbol: "अज (बकरा)",
    symbolEmoji: "🐐",
    color: "स्वर्ण वर्ण (Golden)",
    father: "महाराजा शूरसेन",
    mother: "महारानी श्रीकांता देवी",
    birthPlace: "हस्तिनापुर नगरी",
    nirvanaPlace: "सम्मेद शिखरजी",
    kevalgyanTree: "तिलक वृक्ष",
    yakshaYakshini: "गंधर्व यक्ष / विजया देवी",
    dynasty: "कुरु वंश",
    age: "९५ हज़ार वर्ष",
    mantra: "ॐ ह्रीं श्री १००८ कुन्थुनाथ जिनेन्द्राय नमः",
    chalisaId: "kunthunath-chalisa",
    artiId: "chaubiso-bhagwan-arti",
    pujaId: "chaubis-tirthankar-puja",
    bioHindi: "सत्रहवें तीर्थंकर भगवान कुन्थुनाथ हस्तिनापुर में जन्मे। वे छठवें चक्रवर्ती राजा थे। चक्रवर्ती साम्राज्य का वैभव और अतुल्य कामदेव रूप पाकर भी उन्होंने उसे तृणवत त्याग दिया और कठोर तपस्या कर सम्मेद शिखरजी से निर्वाण प्राप्त किया।",
    bioEn: "Lord Kunthunatha was the 6th Chakravarti monarch and 17th Tirthankara. Renouncing supreme earthly sovereignty, he took ascetic vows and attained Moksha at Sammed Shikharji.",
    kalyanak: {
      garbha: "श्रावण कृष्ण दशमी",
      janma: "वैशाख शुक्ल प्रथम",
      tap: "वैशाख शुक्ल प्रथम",
      gyan: "चैत्र शुक्ल तृतीया",
      moksha: "वैशाख शुक्ल प्रथम"
    }
  },
  {
    id: "aranath",
    number: 18,
    nameHindi: "श्री अरहनाथ भगवान",
    nameEn: "Lord Aranatha",
    titleHindi: "अष्टादश तीर्थंकर श्री अरहनाथ भगवान",
    subtitleHindi: "सप्तम चक्रवर्ती एवं भव-चक्र नाशक",
    symbol: "मीन (मछली) / नंदावर्त",
    symbolEmoji: "🐟",
    color: "स्वर्ण वर्ण (Golden)",
    father: "महाराजा सुदर्शन",
    mother: "महारानी मित्रावती देवी",
    birthPlace: "हस्तिनापुर नगरी",
    nirvanaPlace: "सम्मेद शिखरजी",
    kevalgyanTree: "आम्र वृक्ष (आम)",
    yakshaYakshini: "यक्षेन्द्र / तारा देवी",
    dynasty: "कुरु वंश",
    age: "८४ हज़ार वर्ष",
    mantra: "ॐ ह्रीं श्री १००८ अरहनाथ जिनेन्द्राय नमः",
    chalisaId: "aranath-chalisa",
    artiId: "chaubiso-bhagwan-arti",
    pujaId: "chaubis-tirthankar-puja",
    bioHindi: "अठारहवें तीर्थंकर भगवान अरहनाथ हस्तिनापुर में जन्मे। वे सातवें चक्रवर्ती राजा थे। 'अरह' अर्थात संसार-चक्र के आरे। उन्होंने जीवों को जन्म-मरण रूपी संसार-चक्र से मुक्त होकर मोक्ष के अनंत सुख को प्राप्त करने का पावन मार्ग दिखाया।",
    bioEn: "Lord Aranatha was the 7th Chakravarti king and 18th Tirthankara. Born in Hastinapur, he taught souls how to shatter the wheel of rebirth (Ara) and attain liberation.",
    kalyanak: {
      garbha: "फाल्गुन शुक्ल तृतीया",
      janma: "मार्गशीर्ष शुक्ल दशमी",
      tap: "मार्गशीर्ष शुक्ल दशमी",
      gyan: "कार्तिक शुक्ल द्वादशी",
      moksha: "मार्गशीर्ष शुक्ल दशमी"
    }
  },
  {
    id: "mallinath",
    number: 19,
    nameHindi: "श्री मल्लिनाथ भगवान",
    nameEn: "Lord Mallinatha",
    titleHindi: "एकोनविंश तीर्थंकर श्री मल्लिनाथ भगवान",
    subtitleHindi: "बाल ब्रह्मचारी एवं मोह-विजेता प्रभु",
    symbol: "कलश (कुंभ)",
    symbolEmoji: "🏺",
    color: "नील / सुवर्ण वर्ण",
    father: "महाराजा कुम्भराज",
    mother: "महारानी प्रजावती देवी (प्रभावती)",
    birthPlace: "मिथिलापुरी",
    nirvanaPlace: "सम्मेद शिखरजी",
    kevalgyanTree: "अशोक वृक्ष",
    yakshaYakshini: "कुबेर यक्ष / अपराजिता देवी",
    dynasty: "इक्ष्वाकु वंश",
    age: "५५ हज़ार वर्ष",
    mantra: "ॐ ह्रीं श्री १००८ मल्लिनाथ जिनेन्द्राय नमः",
    chalisaId: "mallinath-chalisa",
    artiId: "chaubiso-bhagwan-arti",
    pujaId: "chaubis-tirthankar-puja",
    bioHindi: "उन्नीसवें तीर्थंकर भगवान मल्लिनाथ का जन्म मिथिला नगरी में हुआ। उनका पावन चिह्न 'कलश' पूर्णता और आत्म-पावनता का प्रतीक है। उन्होंने राजाओं को देह की क्षणभंगुरता और आत्मा की अमरता का अनुपम बोध कराया। सम्मेद शिखरजी से मोक्ष प्राप्त किया।",
    bioEn: "Lord Mallinatha was born in Mithilapuri. Bearing the sacred Kumbha (Kalash) emblem, he imparted profound teachings on physical detachment and attained liberation at Sammed Shikharji.",
    kalyanak: {
      garbha: "फाल्गुन कृष्ण प्रथम",
      janma: "मार्गशीर्ष शुक्ल एकादशी",
      tap: "मार्गशीर्ष शुक्ल एकादशी",
      gyan: "पौष कृष्ण द्वितीया",
      moksha: "फाल्गुन शुक्ल द्वादशी"
    }
  },
  {
    id: "munisuvrata",
    number: 20,
    nameHindi: "श्री मुनिसुव्रतनाथ भगवान",
    nameEn: "Lord Munisuvratanatha",
    titleHindi: "विंशति तीर्थंकर श्री मुनिसुव्रतनाथ भगवान",
    subtitleHindi: "व्रतों के शिरोमणि एवं मर्यादा पुरुषोत्तम समकालीन",
    symbol: "कच्छप (कछुआ)",
    symbolEmoji: "🐢",
    color: "श्याम वर्ण (Black / Dark Sapphire)",
    father: "महाराजा सुमित्र",
    mother: "महारानी पद्मावती देवी",
    birthPlace: "राजगृह नगरी",
    nirvanaPlace: "सम्मेद शिखरजी",
    kevalgyanTree: "चम्पक वृक्ष",
    yakshaYakshini: "वरुण यक्ष / बहुरूपिणी देवी",
    dynasty: "हरिवंश",
    age: "३० हज़ार वर्ष",
    mantra: "ॐ ह्रीं श्री १००८ मुनिसुव्रतनाथ जिनेन्द्राय नमः",
    chalisaId: "munisuvrata-chalisa",
    artiId: "munisuvratnath-arti",
    pujaId: "chaubis-tirthankar-puja",
    bioHindi: "बीसवें तीर्थंकर भगवान मुनिसुव्रतनाथ का जन्म राजगृह में हुआ। वे भगवान राम के समकालीन थे और हरिवंश के प्रथम तीर्थंकर थे। उनका कछुआ चिह्न इंद्रियों को कछुए की भांति अंतर्मुखी कर आत्म-ध्यान में लीन होने की प्रेरणा देता है। सम्मेद शिखरजी से निर्वाण प्राप्त किया।",
    bioEn: "Lord Munisuvratanatha was born in Rajgir during the era of Lord Rama. His tortoise symbol signifies drawing all senses inward into supreme meditative stillness.",
    kalyanak: {
      garbha: "श्रावण कृष्ण द्वितीया",
      janma: "ज्येष्ठ कृष्ण नवमी",
      tap: "ज्येष्ठ कृष्ण नवमी",
      gyan: "वैशाख कृष्ण नवमी",
      moksha: "फाल्गुन कृष्ण द्वादशी"
    }
  },
  {
    id: "naminath",
    number: 21,
    nameHindi: "श्री नमिनाथ भगवान",
    nameEn: "Lord Naminatha",
    titleHindi: "एकविंश तीर्थंकर श्री नमिनाथ भगवान",
    subtitleHindi: "विनम्रता एवं अहिंसा के अवतार",
    symbol: "नीलकमल (नीलोत्पल)",
    symbolEmoji: "🪷",
    color: "स्वर्ण वर्ण (Golden)",
    father: "महाराजा विजय",
    mother: "महारानी विपिला देवी (वप्पिला)",
    birthPlace: "मिथिला नगरी",
    nirvanaPlace: "सम्मेद शिखरजी",
    kevalgyanTree: "बकुल वृक्ष",
    yakshaYakshini: "भृकुटि यक्ष / चामुण्डा देवी",
    dynasty: "इक्ष्वाकु वंश",
    age: "१० हज़ार वर्ष",
    mantra: "ॐ ह्रीं श्री १००८ नमिनाथ जिनेन्द्राय नमः",
    chalisaId: "naminath-chalisa",
    artiId: "chaubiso-bhagwan-arti",
    pujaId: "chaubis-tirthankar-puja",
    bioHindi: "इक्कीसवें तीर्थंकर भगवान नमिनाथ मिथिला में जन्मे। जब वे गर्भ में थे, तब शत्रु राजाओं ने बिना युद्ध किए ही उनके पिता के चरणों में 'नमन' कर संधि स्वीकार कर ली। उन्होंने विनम्रता, करुणा और आत्म-समर्पण का अमर मार्ग दिखाया।",
    bioEn: "Lord Naminatha was born in Mithila. The moment he was conceived, opposing kings surrendered peacefully (Naman) without bloodshed. He attained Moksha at Sammed Shikharji.",
    kalyanak: {
      garbha: "आश्विन कृष्ण द्वितीया",
      janma: "अषाढ़ कृष्ण दशमी",
      tap: "अषाढ़ कृष्ण दशमी",
      gyan: "मार्गशीर्ष शुक्ल एकादशी",
      moksha: "वैशाख कृष्ण चतुर्दशी"
    }
  },
  {
    id: "neminath",
    number: 22,
    nameHindi: "श्री नेमिनाथ भगवान (अरिष्टनेमि)",
    nameEn: "Lord Neminatha (Arishtanemi)",
    titleHindi: "द्वाविंश तीर्थंकर श्री नेमिनाथ भगवान",
    subtitleHindi: "परम करुणा के सागर एवं गिरनार तीर्थ के अधिपति",
    symbol: "शंख",
    symbolEmoji: "🐚",
    color: "श्याम वर्ण (Black / Sapphire)",
    father: "महाराजा समुद्रविजय",
    mother: "महारानी शिवा देवी",
    birthPlace: "शौरीपुर (बटेश्वर, आगरा / द्वारिका)",
    nirvanaPlace: "ऊर्जयंत पर्वत (गिरनार जी, गुजरात)",
    kevalgyanTree: "मेषश्रृंग वृक्ष",
    yakshaYakshini: "सर्वाह्न यक्ष / कूष्मांडिनी (अम्बिका) देवी",
    dynasty: "हरिवंश (श्रीकृष्ण के चचेरे भाई)",
    age: "१ हज़ार वर्ष",
    mantra: "ॐ ह्रीं श्री १००८ नेमिनाथ जिनेन्द्राय नमः",
    chalisaId: "neminath-chalisa",
    artiId: "chaubiso-bhagwan-arti",
    pujaId: "chaubis-tirthankar-puja",
    bioHindi: "बाईसवें तीर्थंकर भगवान नेमिनाथ शौरीपुर में जन्मे। वे योगेश्वर श्रीकृष्ण के चचेरे भाई थे। जूनागढ़ में राजकुमारी राजुल से विवाह के लिए जाते समय उन्होंने बाड़े में बंद मूक पशुओं का वध हेतु क्रंदन सुना। उनका हृदय परम करुणा से भर गया और वे विवाह का रथ मोड़कर सीधे गिरनार पर्वत पर तपस्या करने चले गए। गिरनार जी से उन्हें मोक्ष मिला।",
    bioEn: "Lord Neminatha was the cousin of Lord Krishna. On the way to his wedding with Princess Rajul, hearing the cries of innocent caged animals destined for slaughter moved him deeply; he renounced princely life instantly and achieved Moksha from Mount Girnar.",
    kalyanak: {
      garbha: "कार्तिक शुक्ल षष्ठी",
      janma: "श्रावण शुक्ल षष्ठी",
      tap: "श्रावण शुक्ल षष्ठी",
      gyan: "आश्विन शुक्ल प्रथम",
      moksha: "आषाढ़ शुक्ल अष्टमी"
    }
  },
  {
    id: "parshvanath",
    number: 23,
    nameHindi: "श्री पार्श्वनाथ भगवान",
    nameEn: "Lord Parshvanath",
    titleHindi: "त्रयोविंश तीर्थंकर श्री पार्श्वनाथ भगवान",
    subtitleHindi: "उपसर्ग विजेता, संकटमोचक एवं चार महाव्रत प्रदाता",
    symbol: "सर्प (नागफणी)",
    symbolEmoji: "🐍",
    color: "नील / हरित वर्ण (Green / Blue)",
    father: "महाराजा अश्वसेन",
    mother: "महारानी वामादेवी",
    birthPlace: "वाराणसी नगरी (काशी)",
    nirvanaPlace: "सम्मेद शिखरजी (पारसनाथ हिल)",
    kevalgyanTree: "धव वृक्ष",
    yakshaYakshini: "धरणेन्द्र यक्ष / पद्मावती देवी",
    dynasty: "उग्रवंश / इक्ष्वाकु",
    age: "१०० वर्ष",
    mantra: "ॐ ह्रीं श्री १००८ पार्श्वनाथ जिनेन्द्राय नमः",
    chalisaId: "parshvanath-chalisa",
    artiId: "chaubiso-bhagwan-arti",
    pujaId: "chaubis-tirthankar-puja",
    bioHindi: "तेइसवें तीर्थंकर भगवान पार्श्वनाथ का जन्म काशी में हुआ। उन्होंने जलती लकड़ी से नाग-नागिन के जोड़े की रक्षा की जो बाद में धरणेन्द्र और पद्मावती बने। तपस्या के समय कमठ के घोर उपसर्ग को समता भाव से सहकर वे 'उपसर्ग विजेता' कहलाए। उन्होंने चार यम (अहिंसा, सत्य, अचौर्य, अपरिग्रह) का उपदेश दिया। १०० वर्ष की आयु में सम्मेद शिखरजी से मोक्ष प्राप्त किया।",
    bioEn: "Lord Parshvanath was born in Varanasi. Patiently enduring ferocious storms caused by the demon Kamatha with absolute equanimity, he triumphed through forgiveness. He attained Nirvana atop Mount Sammed Shikharji (Parasnath Hill).",
    kalyanak: {
      garbha: "वैशाख कृष्ण द्वितीया",
      janma: "पौष कृष्ण एकादशी",
      tap: "पौष कृष्ण एकादशी",
      gyan: "चैत्र कृष्ण चतुर्थी",
      moksha: "श्रावण शुक्ल सप्तमी (मोक्ष सप्तमी)"
    }
  },
  {
    id: "mahavir-swami",
    number: 24,
    nameHindi: "श्री महावीर भगवान (वर्धमान)",
    nameEn: "Lord Mahavira (Vardhamana)",
    titleHindi: "चौबीसवें तीर्थंकर श्री महावीर भगवान",
    subtitleHindi: "वर्तमान शासन नायक, अहिंसा के प्रवर्तक एवं पंचम महाव्रत दाता",
    symbol: "सिंह (शेर)",
    symbolEmoji: "🦁",
    color: "तप्त स्वर्ण वर्ण (Golden)",
    father: "महाराजा सिद्धार्थ",
    mother: "महारानी त्रिशला (प्रियकारिणी)",
    birthPlace: "कुण्डलपुर (वैशाली)",
    nirvanaPlace: "पावापुरी नगरी (बिहार)",
    kevalgyanTree: "शाल वृक्ष (ऋजुकूला नदी तट)",
    yakshaYakshini: "मातंग यक्ष / सिद्धायिका देवी",
    dynasty: "इक्ष्वाकु वंश (ज्ञातृक कुल)",
    age: "७२ वर्ष",
    mantra: "ॐ ह्रीं श्री १००८ महावीर जिनेन्द्राय नमः",
    chalisaId: "mahavir-chalisa",
    artiId: "chaubiso-bhagwan-arti",
    pujaId: "chaubis-tirthankar-puja",
    bioHindi: "चौबीसवें एवं अंतिम तीर्थंकर भगवान महावीर स्वामी का जन्म कुण्डलपुर (वैशाली) में हुआ। उन्होंने १२ वर्ष की मौन कठोर तपस्या के बाद केवलज्ञान प्राप्त किया। उन्होंने 'अहिंसा परमो धर्म:', 'जियो और जीने दो', और 'अनेकांतवाद/स्याद्वाद' का अमर संदेश दिया। उन्होंने ब्रह्मचर्य को पाँचवें महाव्रत के रूप में स्थापित किया। कार्तिक कृष्ण अमावस्या (दीपावली) के दिन पावापुरी से उन्हें निर्वाण प्राप्त हुआ।",
    bioEn: "Lord Mahavira, the 24th and last Tirthankara of this era, preached Ahimsa (Non-violence), Anekantavada (Many-sided reality), and Aparigraha (Non-possessiveness). He attained Nirvana at Pawapuri on Diwali.",
    kalyanak: {
      garbha: "आषाढ़ शुक्ल षष्ठी",
      janma: "चैत्र शुक्ल त्रयोदशी (महावीर जयंती)",
      tap: "मार्गशीर्ष कृष्ण दशमी",
      gyan: "वैशाख शुक्ल दशमी",
      moksha: "कार्तिक कृष्ण अमावस्या (दीपावली)"
    }
  }
];

export const getTirthankarById = (idOrNum: string | number): TirthankarInfo => {
  if (typeof idOrNum === 'number') {
    const found = TIRTHANKARAS.find(t => t.number === idOrNum);
    if (found) return found;
  }
  const cleanId = String(idOrNum).toLowerCase().trim().replace(/^tirthankar-/, '');
  
  // Try exact ID match
  let item = TIRTHANKARAS.find(t => t.id.toLowerCase() === cleanId);
  if (item) return item;

  // Try numeric string
  const num = parseInt(cleanId, 10);
  if (!isNaN(num) && num >= 1 && num <= 24) {
    return TIRTHANKARAS[num - 1];
  }

  // Try alias matches
  if (cleanId === 'rishabhdev' || cleanId === 'rishabhnath') return TIRTHANKARAS[0];
  if (cleanId === 'suvidhinath') return TIRTHANKARAS[8];
  if (cleanId === 'shitalnath') return TIRTHANKARAS[9];
  if (cleanId === 'munisuvrat') return TIRTHANKARAS[19];
  if (cleanId === 'arishtanemi') return TIRTHANKARAS[21];
  if (cleanId === 'mahavir' || cleanId === 'vardhamana') return TIRTHANKARAS[23];

  // Default to Adinath
  return TIRTHANKARAS[0];
};

export interface DravyaItem {
  id: string;
  nameHindi: string;
  emoji: string;
  purpose: string;
  purposeEn: string;
  mantra: string;
  subtext: string;
}

export const getDravyaMantrasForTirthankar = (tirthankar: TirthankarInfo): DravyaItem[] => {
  // Extract clean sacred name, e.g. "श्री आदिनाथ", "श्री महावीर"
  const rawTitle = tirthankar.nameHindi.split(' ')[1] || tirthankar.nameHindi;
  const cleanName = rawTitle.replace(/[()]/g, '');
  const jinName = cleanName.startsWith('श्री') ? cleanName : `श्री ${cleanName}`;

  return [
    {
      id: "jal",
      nameHindi: "१. जल ",
      emoji: "💧",
      purpose: "जन्म-जरा-मृत्यु विनाशाय",
      purposeEn: "To conquer birth, aging, and mortality",
      mantra: `ॐ ह्रीं ${jinName} जिनेन्द्राय जन्म-जरा-मृत्यु-विनाशनाय जलं निर्वपामीति स्वाहा।`,
      subtext: "निर्मल प्रासुक जल समर्पित कर जन्म-मरण के चक्र से मुक्ति की प्रार्थना की जाती है।"
    },
    {
      id: "chandan",
      nameHindi: "२. चन्दन ",
      emoji: "🪵",
      purpose: "संसार-ताप विनाशाय",
      purposeEn: "To pacify the burning heat of worldly suffering",
      mantra: `ॐ ह्रीं ${jinName} जिनेन्द्राय संसार-ताप-विनाशनाय चन्दनं निर्वपामीति स्वाहा।`,
      subtext: "शीतल केसर-चन्दन चढ़ाकर आत्मा के समस्त कषाय व संताप शांत करने की भावना की जाती है।"
    },
    {
      id: "akshat",
      nameHindi: "३. अक्षत (Sacred Rice)",
      emoji: "🍚",
      purpose: "अक्षय-पद प्राप्तये",
      purposeEn: "To attain the imperishable, eternal state of Moksha",
      mantra: `ॐ ह्रीं ${jinName} जिनेन्द्राय अक्षय-पद-प्राप्तये अक्षतान् निर्वपामीति स्वाहा।`,
      subtext: "धौत अखण्ड अक्षत समर्पित कर अविनाशी मोक्ष पद की याचना की जाती है।"
    },
    {
      id: "pushpa",
      nameHindi: "४. पुष्प ",
      emoji: "🌸",
      purpose: "काम-बाण विध्वंसनाय",
      purposeEn: "To destroy the arrows of passion and desire",
      mantra: `ॐ ह्रीं ${jinName} जिनेन्द्राय काम-बाण-विध्वंसनाय पुष्पं निर्वपामीति स्वाहा।`,
      subtext: "पवित्र पुष्प अर्पित कर काम-विकारों और वासनाओं के विनाश की भावना की जाती है।"
    },
    {
      id: "naivedya",
      nameHindi: "५. नैवेद्य (Sweets / Pure Food)",
      emoji: "🍬",
      purpose: "क्षुधा-रोग विनाशाय",
      purposeEn: "To eradicate the disease of insatiable craving",
      mantra: `ॐ ह्रीं ${jinName} जिनेन्द्राय क्षुधा-रोग-विनाशनाय नैवेद्यं निर्वपामीति स्वाहा।`,
      subtext: "उत्तम नैवेद्य समर्पित कर भव-भव की भूख और तृष्णा के नाश की प्रार्थना की जाती है।"
    },
    {
      id: "deep",
      nameHindi: "६. दीप (Sacred Lamp / Light)",
      emoji: "🪔",
      purpose: "मोहान्धकार विनाशाय",
      purposeEn: "To dispel the darkness of delusion and ignorance",
      mantra: `ॐ ह्रीं ${jinName} जिनेन्द्राय मोहान्धकार-विनाशनाय दीपं निर्वपामीति स्वाहा।`,
      subtext: "ज्ञानरूपी दीपक अर्पित कर अंतरंग के मिथ्यात्व और अज्ञान को दूर किया जाता है।"
    },
    {
      id: "dhoop",
      nameHindi: "७. धूप (Fragrant Incense)",
      emoji: "💨",
      purpose: "अष्ट-कर्म दहनाय",
      purposeEn: "To incinerate all eight karmic bondages",
      mantra: `ॐ ह्रीं ${jinName} जिनेन्द्राय अष्ट-कर्म-दहनाय धूपं निर्वपामीति स्वाहा।`,
      subtext: "दशांग धूप समर्पित कर ज्ञानावरणादि आठों कर्मों को भस्म करने की भावना की जाती है।"
    },
    {
      id: "phal",
      nameHindi: "८. फल (Auspicious Fruit)",
      emoji: "🍎",
      purpose: "मोक्ष-फल प्राप्तये",
      purposeEn: "To attain the supreme fruit of complete liberation",
      mantra: `ॐ ह्रीं ${jinName} जिनेन्द्राय मोक्ष-फल-प्राप्तये फलं निर्वपामीति स्वाहा।`,
      subtext: "पवित्र फल चढ़ाकर सर्वश्रेष्ठ मोक्ष-फल प्राप्ति की मंगल कामना की जाती है।"
    },
    {
      id: "arghya",
      nameHindi: "९. पूर्णार्घ्य (Supreme Arghya)",
      emoji: "🏆",
      purpose: "अनर्घ-पद प्राप्तये",
      purposeEn: "To attain the priceless, peerless Siddhahood",
      mantra: `ॐ ह्रीं ${jinName} जिनेन्द्राय अनर्घ-पद-प्राप्तये पूर्णार्घ्यं निर्वपामीति स्वाहा।`,
      subtext: "अष्टों द्रव्यों को एक साथ सुसज्जित कर अमूल्य सिद्ध पद प्राप्ति हेतु महा-अर्घ्य समर्पित किया जाता है।"
    }
  ];
};

