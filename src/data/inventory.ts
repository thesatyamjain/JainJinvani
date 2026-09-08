export interface ContentItem {
  id: string;
  title: string;
  category: string;
  subCategory?: string;
  order?: number;
  description?: string;
  badge?: string;
  author?: string;
}

export interface SubCategoryDef {
  id: string;
  label: string;
  description?: string;
}

export const subCategoryMap: Record<string, SubCategoryDef[]> = {
  "puja": [
    {
      "id": "all",
      "label": "सभी पूजाएँ"
    },
    {
      "id": "daily-flow",
      "label": "नित्य पूजन व अभिषेक क्रम",
      "description": "प्रतिदिन मंदिर जी एवं घर में की जाने वाली क्रमबद्ध अभिषेक, शांतिधारा एवं दैनिक पूजा विधि"
    },
    {
      "id": "tirthankar",
      "label": "तीर्थंकर पूजा",
      "description": "२४ तीर्थंकर एवं बाहुबली भगवान की स्वतंत्र पूजाएँ"
    },
    {
      "id": "parva-vrat",
      "label": "पर्व एवं व्रत पूजा",
      "description": "दशलक्षण, सोलहकारण, अष्टान्हिका, नंदीश्वर व विशेष व्रत पूजाएँ"
    },
    {
      "id": "guru-acharya",
      "label": "गुरु एवं आचार्य",
      "description": "आचार्य श्री विद्यासागर जी, समयसागर जी, कुंदकुंद देव एवं मुनि संघ पूजन"
    },
    {
      "id": "tattva-guna",
      "label": "गुण एवं शास्त्र पूजा",
      "description": "सम्यग्दर्शन, ज्ञान, चारित्र, जिनवाणी एवं णमोकार मंत्र पूजा"
    }
  ],
    "vidhan": [
    {
      "id": "all",
      "label": "सभी विधान"
    },
    {
      "id": "mahamandal-vidhan",
      "label": "महामंडल विधान",
      "description": "सिद्धचक्र, भक्तामर, कल्याणमंदिर, इन्द्रध्वज, सर्वतोभद्र व प्रमुख महाविधान"
    },
    {
      "id": "daslakshan-vidhan",
      "label": "दशलक्षण धर्म विधान",
      "description": "उत्तम क्षमादि १० धर्म मण्डल विधान, कल्पद्रुम, जयमाला व पर्व विधान"
    },
    {
      "id": "tirthankar-vidhan",
      "label": "२४ तीर्थंकर विधान",
      "description": "भगवान आदिनाथ से भगवान महावीर स्वामी तक २४ तीर्थंकर विधान"
    }
  ],
  "stotra": [
    {
      "id": "all",
      "label": "सभी स्तोत्र"
    },
    {
      "id": "pradhan-stotra",
      "label": "प्रधान महास्तोत्र",
      "description": "भक्तामर, कल्याणमंदिर, एकीभाव, स्वयंभू व महामंत्र"
    },
    {
      "id": "shanti-raksha",
      "label": "शांति व रक्षा स्तोत्र",
      "description": "बृहत् शांति, लघु शांति, ऋषिमंडल, उवसग्गहरं, विषापहार"
    },
    {
      "id": "bhakti-stuti",
      "label": "तीर्थंकर वंदना व स्तवन",
      "description": "जिनसहस्रनाम, भूपाल चतुर्विंशति, लोगस्स, स्वस्ति मंगलम्"
    },
    {
      "id": "ashtak-stotra",
      "label": "अष्टक स्तोत्र संग्रह",
      "description": "महावीराष्टक, आदिनाथाष्टक, पार्श्वनाथाष्टक, शांतिनाथाष्टक"
    },
    {
      "id": "adhyatma-stotra",
      "label": "अध्यात्म व वैराग्य स्तोत्र",
      "description": "रत्नाकर पच्चीसी, पंचविंशतिका एवं आत्म-चिंतन स्तोत्र"
    }
  ],
  "path": [
    {
      "id": "all",
      "label": "सभी पाठ"
    },
    {
      "id": "daily-swadhyay",
      "label": "नित्य स्वाध्याय",
      "description": "मेरी भावना, समाधिमरण, आलोचना, बारह भावना एवं दैनिक पाठ"
    },
    {
      "id": "vairagya-bhavana",
      "label": "वैराग्य एवं तत्व चिंतन",
      "description": "वैराग्य भावना, ज्ञान भावना, आत्म भावना व अनुप्रेक्षा"
    },
    {
      "id": "atma-sadhana",
      "label": "आत्म साधना व सामायिक",
      "description": "सामायिक पाठ, प्रतिक्रमण, प्रायश्चित्त व आत्म शुद्धि"
    },
    {
      "id": "jinendra-stuti",
      "label": "जिनेन्द्र वंदना व स्तुति",
      "description": "सिद्ध वंदना, अरिहंत स्तुति, जिन स्तुति एवं भक्ति"
    },
    {
      "id": "tirth-vandana",
      "label": "तीर्थ व क्षेत्र वंदना",
      "description": "सम्मेद शिखर, गिरनार, पावापुरी व सर्व तीर्थ वंदना"
    }
  ],
  "chalisa": [
    {
      "id": "all",
      "label": "सभी चालीसा"
    },
    {
      "id": "tirthankar-chalisa",
      "label": "२४ तीर्थंकर चालीसा",
      "description": "भगवान ऋषभदेव से भगवान महावीर तक २४ तीर्थंकर चालीसा"
    },
    {
      "id": "atishay-kshetra",
      "label": "अतिशय क्षेत्र चालीसा",
      "description": "चाँदखेड़ी, अहिच्छत्र, बड़ागाँव आदि सिद्ध व अतिशय क्षेत्र चालीसा"
    },
    {
      "id": "guru-devi",
      "label": "गुरु, गणधर व शासन देवी",
      "description": "बाहुबली, विद्यासागर जी, कुंदकुंद देव, गौतम गणधर, पद्मावती व जिनवाणी"
    },
    {
      "id": "siddha-tirth",
      "label": "सिद्धक्षेत्र व विशेष चालीसा",
      "description": "सम्मेद शिखर जी, गिरनार जी, णमोकार, सीमंधर स्वामी व जिनेन्द्र चालीसा"
    }
  ],
  "granthas": [
    {
      "id": "all",
      "label": "सभी शास्त्र"
    },
    {
      "id": "prathamanuyoga",
      "label": "प्रथमानुयोग",
      "description": "आदिपुराण, उत्तरपुराण, पद्म पुराण, हरिवंश पुराण व तीर्थंकर महाचरित्र"
    },
    {
      "id": "karnanuyoga",
      "label": "करणानुयोग",
      "description": "गोम्मटसार, लब्धिसार, त्रिलोक सार, तिलोयपण्णत्ती व लोक-कर्म संरचना"
    },
    {
      "id": "charananuyoga",
      "label": "चरणानुयोग",
      "description": "रत्नकरण्ड श्रावकाचार, सागार धर्मामृत, पुरुषार्थ सिद्ध्युपाय व मुनि आचार"
    },
    {
      "id": "dravyanuyoga",
      "label": "द्रव्यानुयोग",
      "description": "समयसार, प्रवचनसार, नियमसार, पंचास्तिकाय, छह ढाला व तत्त्वार्थ सूत्र"
    }
  ],
  "shastra": [
    {
      "id": "all",
      "label": "सभी शास्त्र"
    },
    {
      "id": "prathamanuyoga",
      "label": "प्रथमानुयोग",
      "description": "आदिपुराण, उत्तरपुराण, पद्म पुराण, हरिवंश पुराण व तीर्थंकर महाचरित्र"
    },
    {
      "id": "karnanuyoga",
      "label": "करणानुयोग",
      "description": "गोम्मटसार, लब्धिसार, त्रिलोक सार, तिलोयपण्णत्ती व लोक-कर्म संरचना"
    },
    {
      "id": "charananuyoga",
      "label": "चरणानुयोग",
      "description": "रत्नकरण्ड श्रावकाचार, सागार धर्मामृत, पुरुषार्थ सिद्ध्युपाय व मुनि आचार"
    },
    {
      "id": "dravyanuyoga",
      "label": "द्रव्यानुयोग",
      "description": "समयसार, प्रवचनसार, नियमसार, पंचास्तिकाय, छह ढाला व तत्त्वार्थ सूत्र"
    }
  ]
};

export const contentInventory: Record<string, ContentItem[]> = {
  aarti: [
  {
    "id": "jain-aarti",
    "title": "जैन मंगल आरती",
    "category": "aarti",
    "description": "दीपक वंदना एवं मंगल आरती"
  },
  {
    "id": "adinath-aarti",
    "title": "श्री आदिनाथ आरती",
    "category": "aarti",
    "description": "दीपक वंदना एवं मंगल आरती"
  },
  {
    "id": "parshvanath-aarti",
    "title": "श्री पार्श्वनाथ आरती",
    "category": "aarti",
    "description": "दीपक वंदना एवं मंगल आरती"
  },
  {
    "id": "mahavir-aarti",
    "title": "श्री महावीर आरती",
    "category": "aarti",
    "description": "दीपक वंदना एवं मंगल आरती"
  },
  {
    "id": "shantinath-aarti",
    "title": "श्री शांतिनाथ आरती",
    "category": "aarti",
    "description": "दीपक वंदना एवं मंगल आरती"
  },
  {
    "id": "padmavati-aarti",
    "title": "श्री पद्मावती माता आरती",
    "category": "aarti",
    "description": "दीपक वंदना एवं मंगल आरती"
  },
  {
    "id": "nakoda-bhairav-aarti",
    "title": "श्री नाकोड़ा भैरव आरती",
    "category": "aarti",
    "description": "दीपक वंदना एवं मंगल आरती"
  },
  {
    "id": "jinvani-aarti",
    "title": "श्री जिनवाणी आरती",
    "category": "aarti",
    "description": "दीपक वंदना एवं मंगल आरती"
  },
  {
    "id": "guru-aarti",
    "title": "श्री गुरु महाराज आरती",
    "category": "aarti",
    "description": "दीपक वंदना एवं मंगल आरती"
  },
  {
    "id": "mangal-aarti",
    "title": "मंगल आरती",
    "category": "aarti",
    "description": "दीपक वंदना एवं मंगल आरती"
  },
  {
    "id": "adinath-arti",
    "title": "श्री आदिनाथ भगवान आरती",
    "category": "aarti",
    "description": "दीपक वंदना एवं मंगल आरती"
  },
  {
    "id": "bahubali-arti",
    "title": "श्री बाहुबली स्वामी आरती",
    "category": "aarti",
    "description": "दीपक वंदना एवं मंगल आरती"
  },
  {
    "id": "chandraprabhu-arti",
    "title": "जय चंद्रप्रभु देवा",
    "category": "aarti",
    "description": "दीपक वंदना एवं मंगल आरती"
  },
  {
    "id": "chaubiso-bhagwan-arti",
    "title": "चौबीसों भगवान की आरती",
    "category": "aarti",
    "description": "दीपक वंदना एवं मंगल आरती"
  },
  {
    "id": "dhoop-arti",
    "title": "धूप आरती",
    "category": "aarti",
    "description": "दीपक वंदना एवं मंगल आरती"
  },
  {
    "id": "jin-padam-arti",
    "title": "आरती श्री जिन पदम तुम्हारी",
    "category": "aarti",
    "description": "दीपक वंदना एवं मंगल आरती"
  },
  {
    "id": "jinraj-arti",
    "title": "आरती श्री जिनराज तिहारी",
    "category": "aarti",
    "description": "दीपक वंदना एवं मंगल आरती"
  },
  {
    "id": "jinvani-mata-arti",
    "title": "श्री जिनवाणी माता की आरती",
    "category": "aarti",
    "description": "दीपक वंदना एवं मंगल आरती"
  },
  {
    "id": "mahavir-swami-arti",
    "title": "श्री महावीर स्वामी की आरती",
    "category": "aarti",
    "description": "दीपक वंदना एवं मंगल आरती"
  },
  {
    "id": "munisuvratnath-arti",
    "title": "श्री मुनिसुव्रतनाथ भगवान की आरती",
    "category": "aarti",
    "description": "दीपक वंदना एवं मंगल आरती"
  },
  {
    "id": "padmaprabhu-arti",
    "title": "श्री पद्मप्रभु की आरती (बाड़ा)",
    "category": "aarti",
    "description": "दीपक वंदना एवं मंगल आरती"
  },
  {
    "id": "panch-parmeshthi-arti",
    "title": "पंच परमेष्ठी की आरती",
    "category": "aarti",
    "description": "दीपक वंदना एवं मंगल आरती"
  },
  {
    "id": "parshvanath-arti",
    "title": "श्री पार्श्वनाथ स्वामी आरती",
    "category": "aarti",
    "description": "दीपक वंदना एवं मंगल आरती"
  },
  {
    "id": "shantinath-arti",
    "title": "श्री शान्तिनाथ भगवान की आरती",
    "category": "aarti",
    "description": "दीपक वंदना एवं मंगल आरती"
  },
  {
    "id": "tum-se-laagi-lagan",
    "title": "तुम से लागी लगन",
    "category": "aarti",
    "description": "दीपक वंदना एवं मंगल आरती"
  }
],
  bhajan: [
  {
    "id": "ae-malik-tere-bande-hum",
    "title": "ऐ मालिक तेरे बंदे हम",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "baba-tere-charno-ki",
    "title": "बाबा तेरे चरणों की",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "baje-kundalpur-mein-badhai",
    "title": "बजे कुण्डलपुर में बधाई",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "bhagwan-meri-naiya",
    "title": "भगवान मेरी नैया उस पार लगा देना",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "chalo-tijara-jaana-hai",
    "title": "चलो तिजारा जाना है",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "daya-kar-daan-bhakti-ka",
    "title": "दया कर दान भक्ति का",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "guruvar-ke-charno-mein",
    "title": "गुरुवर के चरणो में",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "hey-veer-tumhare-dware-par",
    "title": "हे वीर तुम्हारे द्वारे पर",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "hum-ko-man-ki-shakti-dena",
    "title": "हमको मन की शक्ति देना",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "is-duniya-mein-sabse-sachcha",
    "title": "इस दुनिया में सबसे सच्चा",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "itni-shakti-hamein-dena-data",
    "title": "इतनी शक्ति हमें देना दाता",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "jab-koi-nahi-aata",
    "title": "जब कोई नहीं आता मेरे बाबा आते है",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "jab-se-guru-darsh-mila",
    "title": "जब से गुरु दर्श मिला",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "jai-gomtesh-jai-bahubali",
    "title": "जय गोमटेश जय बाहुबली",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "jai-jinendra-bolie",
    "title": "जय जिनेन्द्र बोलिए",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "jain-dharm-ke-heere-moti",
    "title": "जैन धर्म के हीरे मोती",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "tu-mane-bhagwan-ek-vardan",
    "title": "तू माने भगवान एक वरदान",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "maitri-bhav",
    "title": "मैत्री भाव (Maitri Bhav)",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "jinvani-amrit-rasat",
    "title": "जिनवाणी अमृत रसात",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "jivan-hai-pani-ki-bund",
    "title": "जीवन है पानी की बूँद",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "junagadh-mein-saj-gaye",
    "title": "जूनागढ़ में सज गए देखो",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "kabhi-veer-ban-ke",
    "title": "कभी वीर बनके महावीर बनके",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "kesariya-kesariya",
    "title": "केसरिया केसरिया",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "madhuban-ke-mandiron-mein",
    "title": "मधुबन के मंदिरों में",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "mahaveer-tere-hi-naam-se",
    "title": "महावीर तेरे ही नाम से",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "mantra-namokar-hamein-prano-se-pyara",
    "title": "मंत्र णमोकार हमें प्राणों से प्यारा",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "mera-aapki-kripa-se",
    "title": "मेरा आपकी कृपा से",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "mera-rom-rom-harshaya",
    "title": "मेरे रोम रोम हर्षाया",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "meri-bhavna",
    "title": "मेरी भावना",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "naam-hai-tera-taran-hara",
    "title": "नाम है तेरा तारण हारा",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "o-gurusa-thoro-chelo-banu-mai",
    "title": "ओ गुरूसा ..थोरो चेलो बनु मै",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "o-jagat-ke-shanti-data",
    "title": "ओ जगत के शांति दाता",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "palken-hi-palken",
    "title": "पलकें ही पलकें हम बिछाएंगे",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "phoolon-ka-taron-ka",
    "title": "फूलों का तारों का सबका कहना है",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "rang-ma-rang-ma",
    "title": "रंग मा रंग मा रंग मा रे",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "saj-dhaj-kar-jis-din",
    "title": "सज धज कर जिस दिन",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "sare-tirath-dham",
    "title": "सारे तीरथ धाम आपके चरणों में",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "subha-savere-le-kar-tera-naam",
    "title": "सुबह सवेरे लेकर तेरा नाम प्रभु",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "tere-paanch-hue-kalyan",
    "title": "तेरे पाँच हुए कल्याण प्रभु",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "tu-pyar-ka-sagar-hai",
    "title": "तु प्यार का सागर है",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "tumhi-ho-mata-pita",
    "title": "तुम्ही हो माता पिता तुम्ही हो",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "unche-unche-shikharo-wala",
    "title": "ऊंचे ऊंचे शिखरों वाला",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  },
  {
    "id": "ye-dharam-hai-aatam-gyani-ka",
    "title": "ये धरम है आतम ज्ञानी का",
    "category": "bhajan",
    "description": "आध्यात्मिक भक्ति पद"
  }
],
  chalisa: [
  {
    "id": "adinath-chalisa",
    "title": "श्री आदिनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "प्रथम तीर्थंकर भगवान ऋषभदेव ४० पद्य चालीसा",
    "badge": "१. ऋषभदेव"
  },
  {
    "id": "ajitnath-chalisa",
    "title": "श्री अजितनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "द्वितीय तीर्थंकर भगवान अजितनाथ चालीसा",
    "badge": "२. अजितनाथ"
  },
  {
    "id": "sambhavnath-chalisa",
    "title": "श्री संभवनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "तृतीय तीर्थंकर भगवान संभवनाथ चालीसा",
    "badge": "३. संभवनाथ"
  },
  {
    "id": "abhinandannath-chalisa",
    "title": "श्री अभिनंदननाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "चतुर्थ तीर्थंकर भगवान अभिनंदननाथ चालीसा",
    "badge": "४. अभिनंदननाथ"
  },
  {
    "id": "sumatinath-chalisa",
    "title": "श्री सुमतिनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "पंचम तीर्थंकर भगवान सुमतिनाथ चालीसा",
    "badge": "५. सुमतिनाथ"
  },
  {
    "id": "padmaprabhu-chalisa",
    "title": "श्री पद्मप्रभु चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "षष्ठ तीर्थंकर भगवान पद्मप्रभु चालीसा",
    "badge": "६. पद्मप्रभु"
  },
  {
    "id": "suparshvanath-chalisa",
    "title": "श्री सुपार्श्वनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "सप्तम तीर्थंकर भगवान सुपार्श्वनाथ चालीसा",
    "badge": "७. सुपार्श्वनाथ"
  },
  {
    "id": "chandraprabhu-chalisa",
    "title": "श्री चन्द्रप्रभु चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "अष्टम तीर्थंकर भगवान चन्द्रप्रभु चालीसा",
    "badge": "८. चन्द्रप्रभु"
  },
  {
    "id": "pushpadanta-chalisa",
    "title": "श्री पुष्पदन्त चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "नवम तीर्थंकर भगवान पुष्पदन्त (सुविधिनाथ) चालीसा",
    "badge": "९. पुष्पदन्त"
  },
  {
    "id": "sheetalnath-chalisa",
    "title": "श्री शीतलनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "दशम तीर्थंकर भगवान शीतलनाथ चालीसा",
    "badge": "१०. शीतलनाथ"
  },
  {
    "id": "shreyansnath-chalisa",
    "title": "श्री श्रेयांसनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "एकादश तीर्थंकर भगवान श्रेयांसनाथ चालीसा",
    "badge": "११. श्रेयांसनाथ"
  },
  {
    "id": "vasupujya-chalisa",
    "title": "श्री वासुपूज्य चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "द्वादश तीर्थंकर भगवान वासुपूज्य चालीसा",
    "badge": "१२. वासुपूज्य"
  },
  {
    "id": "vimalnath-chalisa",
    "title": "श्री विमलनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "त्रयोदश तीर्थंकर भगवान विमलनाथ चालीसा",
    "badge": "१३. विमलनाथ"
  },
  {
    "id": "anantnath-chalisa",
    "title": "श्री अनन्तनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "चतुर्दश तीर्थंकर भगवान अनन्तनाथ चालीसा",
    "badge": "१४. अनन्तनाथ"
  },
  {
    "id": "dharmanath-chalisa",
    "title": "श्री धर्मनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "पंचदश तीर्थंकर भगवान धर्मनाथ चालीसा",
    "badge": "१५. धर्मनाथ"
  },
  {
    "id": "shantinath-chalisa",
    "title": "श्री शान्तिनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "षोडश तीर्थंकर चक्रवर्ती कामदेव भगवान शान्तिनाथ चालीसा",
    "badge": "१६. शान्तिनाथ"
  },
  {
    "id": "kunthunath-chalisa",
    "title": "श्री कुन्थुनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "सप्तदश तीर्थंकर भगवान कुन्थुनाथ चालीसा",
    "badge": "१७. कुन्थुनाथ"
  },
  {
    "id": "aranath-chalisa",
    "title": "श्री अरहनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "अष्टादश तीर्थंकर भगवान अरहनाथ चालीसा",
    "badge": "१८. अरहनाथ"
  },
  {
    "id": "mallinath-chalisa",
    "title": "श्री मल्लिनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "एकोनविंशति तीर्थंकर भगवान मल्लिनाथ चालीसा",
    "badge": "१९. मल्लिनाथ"
  },
  {
    "id": "munisuvratnath-chalisa",
    "title": "श्री मुनिसुव्रतनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "विंशति तीर्थंकर भगवान मुनिसुव्रतनाथ चालीसा",
    "badge": "२०. मुनिसुव्रतनाथ"
  },
  {
    "id": "naminath-chalisa",
    "title": "श्री नमिनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "एकविंशति तीर्थंकर भगवान नमिनाथ चालीसा",
    "badge": "२१. नमिनाथ"
  },
  {
    "id": "neminath-chalisa",
    "title": "श्री नेमिनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "द्वाविंशति तीर्थंकर भगवान नेमिनाथ (अरिष्टनेमि) चालीसा",
    "badge": "२२. नेमिनाथ"
  },
  {
    "id": "parshvanath-chalisa",
    "title": "श्री पार्श्वनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "त्रयोविंशति तीर्थंकर संकटमोचक भगवान पार्श्वनाथ चालीसा",
    "badge": "२३. पार्श्वनाथ"
  },
  {
    "id": "mahavir-chalisa",
    "title": "श्री महावीर चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "चतुर्विंशति तीर्थंकर चरम तीर्थेश भगवान महावीर चालीसा",
    "badge": "२४. महावीर"
  },
  {
    "id": "adinath-chalisa-chandkhedi",
    "title": "श्री आदिनाथ चालीसा (चाँदखेड़ी)",
    "category": "chalisa",
    "subCategory": "atishay-kshetra",
    "description": "अतिशय क्षेत्र चाँदखेड़ी (राजस्थान) आदिनाथ चालीसा",
    "badge": "चाँदखेड़ी"
  },
  {
    "id": "parshvanath-chalisa-ahichchhatra",
    "title": "श्री पार्श्वनाथ चालीसा (अहिच्छत्र)",
    "category": "chalisa",
    "subCategory": "atishay-kshetra",
    "description": "तपस्थली अतिशय क्षेत्र अहिच्छत्र पार्श्वनाथ चालीसा",
    "badge": "अहिच्छत्र"
  },
  {
    "id": "parshvanath-chalisa-badagaon",
    "title": "श्री पार्श्वनाथ चालीसा (बड़ागाँव)",
    "category": "chalisa",
    "subCategory": "atishay-kshetra",
    "description": "त्रिलोक तीर्थ बड़ागाँव (बागपत) पार्श्वनाथ चालीसा",
    "badge": "बड़ागाँव"
  },
  {
    "id": "bahubali-chalisa",
    "title": "श्री बाहुबली चालीसा",
    "category": "chalisa",
    "subCategory": "guru-devi",
    "description": "प्रथम कामदेव महातपस्वी भगवान बाहुबली स्वामी चालीसा",
    "badge": "बाहुबली"
  },
  {
    "id": "vidyasagar-chalisa",
    "title": "आचार्य श्री विद्यासागर चालीसा",
    "category": "chalisa",
    "subCategory": "guru-devi",
    "description": "संत शिरोमणि युगप्रवर्तक आचार्य श्री विद्यासागर जी महाराज चालीसा",
    "badge": "विद्यासागर जी"
  },
  {
    "id": "gautam-ganadhar-chalisa",
    "title": "श्री गौतम गणधर चालीसा",
    "category": "chalisa",
    "subCategory": "guru-devi",
    "description": "भगवान महावीर के प्रथम गणधर स्वामी चालीसा",
    "badge": "गौतम गणधर"
  },
  {
    "id": "kundkund-chalisa",
    "title": "आचार्य श्री कुंदकुंद स्वामी चालीसा",
    "category": "chalisa",
    "subCategory": "guru-devi",
    "description": "समयसार प्रणेता कलिकाल सर्वज्ञ कुंदकुंद देव चालीसा",
    "badge": "कुंदकुंद देव"
  },
  {
    "id": "padmavati-chalisa",
    "title": "श्री पद्मावती माता चालीसा",
    "category": "chalisa",
    "subCategory": "guru-devi",
    "description": "पार्श्वनाथ शासनदेवी श्री पद्मावती माता चालीसा",
    "badge": "पद्मावती माता"
  },
  {
    "id": "saraswati-chalisa",
    "title": "श्री जिनवाणी / सरस्वती चालीसा",
    "category": "chalisa",
    "subCategory": "guru-devi",
    "description": "द्वादशांग जिनवाणी माता एवं सरस्वती चालीसा",
    "badge": "जिनवाणी"
  },
  {
    "id": "sammed-shikhar-chalisa",
    "title": "श्री सम्मेद शिखर जी चालीसा",
    "category": "chalisa",
    "subCategory": "siddha-tirth",
    "description": "शाश्वत सिद्धक्षेत्र २० तीर्थंकर निर्वाण भूमि चालीसा",
    "badge": "सम्मेद शिखर"
  },
  {
    "id": "girnar-chalisa",
    "title": "श्री गिरनार जी तीर्थ चालीसा",
    "category": "chalisa",
    "subCategory": "siddha-tirth",
    "description": "भगवान नेमिनाथ मोक्ष कल्याणक ऊर्जयन्त गिरि चालीसा",
    "badge": "गिरनार जी"
  },
  {
    "id": "namokar-chalisa",
    "title": "णमोकार महामंत्र चालीसा",
    "category": "chalisa",
    "subCategory": "siddha-tirth",
    "description": "अनादि मूल मंत्र श्री णमोकार महामंत्र चालीसा",
    "badge": "णमोकार"
  },
  {
    "id": "simandhar-chalisa",
    "title": "श्री सीमंधर स्वामी चालीसा",
    "category": "chalisa",
    "subCategory": "siddha-tirth",
    "description": "महाविदेह क्षेत्र में विद्यमान तीर्थंकर सीमंधर स्वामी चालीसा",
    "badge": "सीमंधर स्वामी"
  },
  {
    "id": "jinendra-chalisa",
    "title": "श्री जिनेन्द्र चालीसा",
    "category": "chalisa",
    "subCategory": "siddha-tirth",
    "description": "सर्व जिनेन्द्र भगवान की सामूहिक वंदना चालीसा",
    "badge": "सर्व जिन"
  }
],
  puja: [
    {"id":"abhishek-vidhi","title":"जैन अभिषेक विधि","category":"puja","subCategory":"daily-flow","description":"शुद्धता, प्रासुक जल, दिशा, अभिषेक के प्रकार एवं संपूर्ण शास्त्रोक्त विधि","badge":"अभिषेक विधि"},
    {"id":"pratima-prakshal-vidhi-path","title":"प्रतिमा-प्रक्षाल-विधि पाठ","category":"puja","subCategory":"daily-flow","description":"शास्त्रोक्त जिनबिम्ब प्रक्षाल, मार्जन एवं अभिषेक क्रम","badge":"प्रक्षाल"},
    {"id":"abhishek-path-sanskrit","title":"अभिषेक पाठ (संस्कृत)","category":"puja","subCategory":"daily-flow","description":"पारंपरिक संस्कृत जिनबिम्ब अभिषेक विधि एवं न्हवन पाठ","badge":"अभिषेक पाठ"},
    {"id":"abhishek-path-maghanandi","title":"अभिषेक पाठ संस्कृत (माघनन्दिकृत)","category":"puja","subCategory":"daily-flow","description":"आचार्य माघनन्दि विरचित चार कलश प्रामाणिक न्हवन एवं अभिषेक विधि","badge":"माघनन्दि अभिषेक"},
    {"id":"jalabhishek-path","title":"जलाभिषेक पाठ","category":"puja","subCategory":"daily-flow","description":"प्रासुक जल धाराभिषेक, जिनबिम्ब अभिषेक एवं शांति मंत्र","badge":"जलाभिषेक"},
    {"id":"mandilashtakam","title":"मण्डलाष्टकम् (संस्कृत)","category":"puja","subCategory":"daily-flow","description":"संस्कृत मण्डलाष्टक स्तोत्र एवं अभिषेक पाठ","badge":"मण्डलाष्टक"},
    {"id":"brihat-shantidhara","title":"वृहत् शांतिधारा (सकल वांग्मय शांति मंत्र)","category":"puja","subCategory":"daily-flow","description":"परम मांगलिक जिनबिम्ब मस्तक अभिषेक एवं सर्वोपद्रव निवारक वृहत् शांतिधारा पाठ","badge":"शांतिधारा"},
    {"id":"gandhodak-vidhi","title":"गंधोदक ग्रहण विधि","category":"puja","subCategory":"daily-flow","description":"गंधोदक ग्रहण के चार स्थान, महिमा एवं पवित्र मंत्र","badge":"गंधोदक विधि"},
    {"id":"siddha-yantra-abhishek","title":"सिद्धयंत्राभिषेक विधि एवं मंत्र","category":"puja","subCategory":"daily-flow","description":"सिद्धचक्र महायंत्र का पावन अभिषेक, शांतिधारा एवं आशीर्वाद मंत्र","badge":"सिद्धयंत्र अभिषेक"},
    {"id":"puja-vidhi-prarambh","title":"पूजा विधि प्रारम्भ","category":"puja","subCategory":"daily-flow","description":"दैनिक अभिषेक एवं पूजन प्रारम्भिक विधि","badge":"नित्य पूजन"},
    {"id":"puja-pratigya-path","title":"पूजा प्रतिज्ञा पाठ","category":"puja","subCategory":"daily-flow","description":"संकल्प एवं पूजन प्रतिज्ञा पाठ","badge":"नित्य पूजन"},
    {"id":"vinay-path","title":"विनय पाठ","category":"puja","subCategory":"daily-flow","description":"जिनेंद्र प्रभु के चरणों में विनय पाठ","badge":"नित्य पूजन"},
    {"id":"dev-shastra-guru-puja-jugal","title":"श्री देव-शास्त्र-गुरु पूजा","category":"puja","subCategory":"daily-flow","description":"पं. जुगल किशोर जी कृत नित्य देव-शास्त्र-गुरु पूजा","badge":"नित्य पूजन"},
    {"id":"dev-shastra-guru-puja-dyanat","title":"श्री देव-शास्त्र-गुरु पूजा (द्यानत राय)","category":"puja","subCategory":"daily-flow","description":"कविवर द्यानतराय कृत देव-शास्त्र-गुरु पूजा","badge":"नित्य पूजन"},
    {"id":"samuchay-pujan","title":"समुच्चय पूजन","category":"puja","subCategory":"daily-flow","description":"दैनिक समुच्चय जिनेंद्र पूजन","badge":"नित्य पूजन"},
    {"id":"chaubis-tirthankar-puja","title":"श्री चौबीस तीर्थंकर पूजा","category":"puja","subCategory":"daily-flow","description":"चौबीसों तीर्थंकर भगवान की सामूहिक पूजा","badge":"नित्य पूजन"},
    {"id":"24-tirthankar-swasti-path","title":"२४ तीर्थंकर स्वस्ति पाठ","category":"puja","subCategory":"daily-flow","description":"२४ तीर्थंकर मांगलिक स्वस्ति पाठ","badge":"नित्य पूजन"},
    {"id":"parmarshi-swasti-mangal-path","title":"परमर्षि स्वस्ति मंगल पाठ","category":"puja","subCategory":"daily-flow","description":"परमर्षि मांगलिक स्वस्ति पाठ","badge":"नित्य पूजन"},
    {"id":"arghyavali","title":"अर्घ्यावली (संपूर्ण २४ तीर्थंकर)","category":"puja","subCategory":"daily-flow","description":"चौबीस तीर्थंकर सामूहिक अर्घ्यावली","badge":"नित्य पूजन"},
    {"id":"maha-argh","title":"महा अर्घ","category":"puja","subCategory":"daily-flow","description":"समस्त पूजाओं के अंत में महा अर्घ समर्पण","badge":"नित्य पूजन"},
    {"id":"panch-parmeshthi-argh","title":"पंच परमेष्ठि अर्घ","category":"puja","subCategory":"daily-flow","description":"पंच परमेष्ठी भगवान का पावन अर्घ","badge":"नित्य पूजन"},
    {"id":"shanti-path","title":"शांति पाठ","category":"puja","subCategory":"daily-flow","description":"पूजनोपरांत सर्व शांति पाठ","badge":"नित्य पूजन"},
    {"id":"visarjan-path","title":"विसर्जन पाठ","category":"puja","subCategory":"daily-flow","description":"पूजन विसर्जन एवं क्षमा याचना पाठ","badge":"नित्य पूजन"},
    {"id":"adinath-puja-jineshwardas","title":"श्री आदिनाथ जिन पूजा (जिनेश्वरदास)","category":"puja","subCategory":"tirthankar","description":"प्रथम तीर्थंकर भगवान ऋषभदेव अष्टद्रव्य पूजन","badge":"१. ऋषभदेव"},
    {"id":"adinath-chandkhedi-puja","title":"श्री आदिनाथ जिन पूजा (चाँदखेड़ी)","category":"puja","subCategory":"tirthankar","description":"अतिशय क्षेत्र चाँदखेड़ी आदिनाथ पूजन","badge":"चाँदखेड़ी"},
    {"id":"ajitnath-puja","title":"श्री अजितनाथ जिन पूजन","category":"puja","subCategory":"tirthankar","description":"द्वितीय तीर्थंकर अजितनाथ अष्टद्रव्य पूजन एवं जयमाला","badge":"२. अजितनाथ"},
    {"id":"sambhavnath-puja","title":"श्री संभवनाथ जिन पूजन","category":"puja","subCategory":"tirthankar","description":"तृतीय तीर्थंकर संभवनाथ अष्टद्रव्य पूजन एवं जयमाला","badge":"३. संभवनाथ"},
    {"id":"abhinandan-puja","title":"श्री अभिनंदननाथ जिन पूजन","category":"puja","subCategory":"tirthankar","description":"चतुर्थ तीर्थंकर अभिनंदननाथ अष्टद्रव्य पूजन एवं जयमाला","badge":"४. अभिनंदननाथ"},
    {"id":"sumatinath-puja","title":"श्री सुमतिनाथ जिन पूजन","category":"puja","subCategory":"tirthankar","description":"पंचम तीर्थंकर सुमतिनाथ अष्टद्रव्य पूजन एवं जयमाला","badge":"५. सुमतिनाथ"},
    {"id":"padmaprabh-puja","title":"श्री पद्मप्रभ जिन पूजा","category":"puja","subCategory":"tirthankar","description":"षष्ठ तीर्थंकर भगवान पद्मप्रभु अष्टद्रव्य पूजन","badge":"६. पद्मप्रभु"},
    {"id":"suparshvanath-puja","title":"श्री सुपार्श्वनाथ जिन पूजन","category":"puja","subCategory":"tirthankar","description":"सप्तम तीर्थंकर सुपार्श्वनाथ अष्टद्रव्य पूजन एवं जयमाला","badge":"७. सुपार्श्वनाथ"},
    {"id":"chandraprabh-puja","title":"श्री चंद्रप्रभ जिन पूजा","category":"puja","subCategory":"tirthankar","description":"अष्टम तीर्थंकर भगवान चंद्रप्रभु अष्टद्रव्य पूजन","badge":"८. चंद्रप्रभु"},
    {"id":"chandraprabh-dehra-puja","title":"श्री चंद्रप्रभु जी पूजा - देहरा (तिजारा)","category":"puja","subCategory":"tirthankar","description":"अतिशय क्षेत्र तिजारा देहरा चंद्रप्रभु पूजन","badge":"तिजारा"},
    {"id":"pushpadanta-puja","title":"श्री पुष्पदंत जिन पूजन","category":"puja","subCategory":"tirthankar","description":"नवम तीर्थंकर भगवान पुष्पदंत अष्टद्रव्य पूजन","badge":"९. पुष्पदंत"},
    {"id":"sheetalnath-puja","title":"श्री शीतलनाथ जिन पूजन","category":"puja","subCategory":"tirthankar","description":"दशम तीर्थंकर भगवान शीतलनाथ अष्टद्रव्य पूजन","badge":"१०. शीतलनाथ"},
    {"id":"shreyansnath-puja","title":"श्री श्रेयांसनाथ जिन पूजन","category":"puja","subCategory":"tirthankar","description":"एकादश तीर्थंकर श्रेयांसनाथ अष्टद्रव्य पूजन एवं जयमाला","badge":"११. श्रेयांसनाथ"},
    {"id":"vasupujya-puja","title":"श्री वासुपूज्य जिन पूजन","category":"puja","subCategory":"tirthankar","description":"द्वादश तीर्थंकर भगवान वासुपूज्य अष्टद्रव्य पूजन","badge":"१२. वासुपूज्य"},
    {"id":"vimalnath-puja","title":"श्री विमलनाथ जिन पूजन","category":"puja","subCategory":"tirthankar","description":"त्रयोदश तीर्थंकर भगवान विमलनाथ अष्टद्रव्य पूजन","badge":"१३. विमलनाथ"},
    {"id":"anantanath-puja","title":"श्री अनंतनाथ जिन पूजन","category":"puja","subCategory":"tirthankar","description":"चतुर्दश तीर्थंकर भगवान अनंतनाथ अष्टद्रव्य पूजन","badge":"१४. अनंतनाथ"},
    {"id":"dharmanath-puja","title":"श्री धर्मनाथ जिन पूजन","category":"puja","subCategory":"tirthankar","description":"पंचदश तीर्थंकर धर्मनाथ अष्टद्रव्य पूजन एवं जयमाला","badge":"१५. धर्मनाथ"},
    {"id":"shantinath-puja-bakhtawar","title":"श्री शांतिनाथ जिन पूजा (बख्तावर सिंह)","category":"puja","subCategory":"tirthankar","description":"षोडश तीर्थंकर भगवान शांतिनाथ अष्टद्रव्य पूजन","badge":"१६. शांतिनाथ"},
    {"id":"shanti-puja","title":"श्री शांतिनाथ महाशांति पूजा","category":"puja","subCategory":"tirthankar","description":"सर्व विघ्न-विनाशक एवं शांति प्रदायक शांतिनाथ जिनेंद्र पूजन","badge":"महाशांति"},
    {"id":"kunthunath-puja","title":"श्री कुन्थुनाथ जिन पूजन","category":"puja","subCategory":"tirthankar","description":"सप्तदश तीर्थंकर भगवान कुन्थुनाथ अष्टद्रव्य पूजन","badge":"१७. कुन्थुनाथ"},
    {"id":"arahnath-puja","title":"श्री अरहनाथ जिन पूजन","category":"puja","subCategory":"tirthankar","description":"अष्टादश तीर्थंकर अरहनाथ अष्टद्रव्य पूजन एवं जयमाला","badge":"१८. अरहनाथ"},
    {"id":"mallinath-puja","title":"श्री मल्लिनाथ जिन पूजन","category":"puja","subCategory":"tirthankar","description":"एकोनविंशति तीर्थंकर मल्लिनाथ अष्टद्रव्य पूजन एवं जयमाला","badge":"१९. मल्लिनाथ"},
    {"id":"munisuvrat-puja","title":"श्री मुनिसुव्रत जिन पूजन","category":"puja","subCategory":"tirthankar","description":"विंशति तीर्थंकर भगवान मुनिसुव्रतनाथ अष्टद्रव्य पूजन","badge":"२०. मुनिसुव्रत"},
    {"id":"naminath-puja","title":"श्री नमिनाथ जिन पूजन","category":"puja","subCategory":"tirthankar","description":"एकविंशति तीर्थंकर नमिनाथ अष्टद्रव्य पूजन एवं जयमाला","badge":"२१. नमिनाथ"},
    {"id":"neminath-puja","title":"श्री नेमिनाथ जिन पूजन","category":"puja","subCategory":"tirthankar","description":"द्वाविंशति तीर्थंकर भगवान नेमिनाथ अष्टद्रव्य पूजन","badge":"२२. नेमिनाथ"},
    {"id":"parshvanath-puja-bakhtawar","title":"श्री पार्श्वनाथ जिन पूजा (बख्तावर सिंह)","category":"puja","subCategory":"tirthankar","description":"त्रयोविंशति तीर्थंकर भगवान पार्श्वनाथ अष्टद्रव्य पूजन","badge":"२३. पार्श्वनाथ"},
    {"id":"mahavir-puja-vrindavan","title":"श्री महावीर जिन पूजा (वृन्दावनदास)","category":"puja","subCategory":"tirthankar","description":"चतुर्विंशति तीर्थंकर चरम तीर्थेश भगवान महावीर पूजन","badge":"२४. महावीर"},
    {"id":"bahubali-puja","title":"श्री बाहुबली पूजा","category":"puja","subCategory":"tirthankar","description":"प्रथम कामदेव भगवान बाहुबली अष्टद्रव्य पूजन","badge":"बाहुबली"},
    {"id":"seemandhar-puja","title":"श्री सीमंधर स्वामी पूजा","category":"puja","subCategory":"tirthankar","description":"विदेह क्षेत्र के वर्तमान विहरमान तीर्थंकर सीमंधर स्वामी पूजन","badge":"सीमंधर स्वामी"},
    {"id":"20-teerthankar-puja","title":"श्री विद्यमान बीस तीर्थंकर पूजा","category":"puja","subCategory":"tirthankar","description":"महाविदेह क्षेत्र के विद्यमान बीस तीर्थंकर पूजा","badge":"२० तीर्थंकर"},
    {"id":"vidyman-vimshati-tirthankar-pujan","title":"श्री विद्यमान विंशति तीर्थंकर पूजन","category":"puja","subCategory":"tirthankar","description":"विद्यमान विंशति तीर्थंकर अष्टद्रव्य पूजन","badge":"विंशति जिन"},
    {"id":"panch-balyati-puja","title":"पंच बालयति पूजा","category":"puja","subCategory":"tirthankar","description":"पंच बालयति तीर्थंकरों की पावन पूजा","badge":"पंच बालयति"},
    {"id":"samavasharan-puja","title":"श्री समवशरण पूजा","category":"puja","subCategory":"tirthankar","description":"तीर्थंकर प्रभु के दिव्य १२ सभाओं से युक्त समवशरण पूजन","badge":"समवशरण"},
    {"id":"jinasahasranam-puja","title":"श्री जिनसहस्रनाम पूजा","category":"puja","subCategory":"tirthankar","description":"आचार्य जिनसेन विरचित जिनेंद्र भगवान के १००८ पावन नामों की अष्टद्रव्य पूजा","badge":"सहस्रनाम"},
    {"id":"bhaktamar-puja","title":"श्री भक्तामर पूजा","category":"puja","subCategory":"tirthankar","description":"आचार्य मानतुंग कृत भक्तामर आधारित अष्टद्रव्य पूजन एवं जयमाला","badge":"भक्तामर"},
    {"id":"kalyanmandir-puja","title":"श्री कल्याणमन्दिर पूजा","category":"puja","subCategory":"tirthankar","description":"आचार्य कुमुदचन्द्र कृत कल्याणमन्दिर आधारित पार्श्वनाथ पूजन एवं जयमाला","badge":"कल्याणमंदिर"},
    {"id":"uttam-kshama-dharma-puja","title":"श्री उत्तम क्षमा धर्म पूजा (प्रथम दिन)","category":"puja","subCategory":"parva-vrat","description":"दशलक्षण महापर्व प्रथम दिवस — भाद्रपद शुक्ल पंचमी","badge":"प्रथम दिन"},
    {"id":"uttam-mardav-dharma-puja","title":"श्री उत्तम मार्दव धर्म पूजा (द्वितीय दिन)","category":"puja","subCategory":"parva-vrat","description":"दशलक्षण महापर्व द्वितीय दिवस — भाद्रपद शुक्ल षष्ठी","badge":"द्वितीय दिन"},
    {"id":"uttam-arjav-dharma-puja","title":"श्री उत्तम आर्जव धर्म पूजा (तृतीय दिन)","category":"puja","subCategory":"parva-vrat","description":"दशलक्षण महापर्व तृतीय दिवस — भाद्रपद शुक्ल सप्तमी","badge":"तृतीय दिन"},
    {"id":"uttam-shauch-dharma-puja","title":"श्री उत्तम शौच धर्म पूजा (चतुर्थ दिन)","category":"puja","subCategory":"parva-vrat","description":"दशलक्षण महापर्व चतुर्थ दिवस — भाद्रपद शुक्ल अष्टमी","badge":"चतुर्थ दिन"},
    {"id":"uttam-satya-dharma-puja","title":"श्री उत्तम सत्य धर्म पूजा (पंचम दिन)","category":"puja","subCategory":"parva-vrat","description":"दशलक्षण महापर्व पंचम दिवस — भाद्रपद शुक्ल नवमी","badge":"पंचम दिन"},
    {"id":"uttam-sanyam-dharma-puja","title":"श्री उत्तम संयम धर्म पूजा (षष्ठ दिन)","category":"puja","subCategory":"parva-vrat","description":"दशलक्षण महापर्व षष्ठ दिवस — सुगंध दशमी","badge":"षष्ठ दिन"},
    {"id":"uttam-tap-dharma-puja","title":"श्री उत्तम तप धर्म पूजा (सप्तम दिन)","category":"puja","subCategory":"parva-vrat","description":"दशलक्षण महापर्व सप्तम दिवस — भाद्रपद शुक्ल एकादशी","badge":"सप्तम दिन"},
    {"id":"uttam-tyag-dharma-puja","title":"श्री उत्तम त्याग धर्म पूजा (अष्टम दिन)","category":"puja","subCategory":"parva-vrat","description":"दशलक्षण महापर्व अष्टम दिवस — भाद्रपद शुक्ल द्वादशी","badge":"अष्टम दिन"},
    {"id":"uttam-akinchanya-dharma-puja","title":"श्री उत्तम आकिंचन्य धर्म पूजा (नवम दिन)","category":"puja","subCategory":"parva-vrat","description":"दशलक्षण महापर्व नवम दिवस — भाद्रपद शुक्ल त्रयोदशी","badge":"नवम दिन"},
    {"id":"uttam-brahmacharya-dharma-puja","title":"श्री उत्तम ब्रह्मचर्य धर्म पूजा (दशम दिन)","category":"puja","subCategory":"parva-vrat","description":"दशलक्षण महापर्व दशम दिवस — अनन्त चतुर्दशी","badge":"दशम दिन"},
    {"id":"daslakshan-dharma-puja","title":"दशलक्षण-धर्म पूजा","category":"puja","subCategory":"parva-vrat","description":"उत्तम क्षमादि १० धर्मों की अष्टद्रव्य पूजा","badge":"दशलक्षण पर्व"},
    {"id":"solah-karan-puja","title":"सोलहकारण पूजा","category":"puja","subCategory":"parva-vrat","description":"तीर्थंकर प्रकृति बंध के कारणभूत १६ भावना पूजा","badge":"सोलहकारण"},
    {"id":"ashtanhika-vrat-puja","title":"अष्टान्हिका व्रत पूजा (नंदीश्वर द्वीप)","category":"puja","subCategory":"parva-vrat","description":"कार्तिक, फाल्गुन एवं आषाढ़ अष्टान्हिका महापर्व पूजा","badge":"अष्टान्हिका"},
    {"id":"nandishwar-dweep-puja","title":"श्री नंदीश्वर-द्वीप पूजा","category":"puja","subCategory":"parva-vrat","description":"आठवें द्वीप नंदीश्वर के ५२ जिनालयों की पावन पूजा","badge":"नंदीश्वर द्वीप"},
    {"id":"panchmeru-puja","title":"श्री पंचमेरु पूजा","category":"puja","subCategory":"parva-vrat","description":"सुदर्शन आदि पंचमेरु पर्वत के ८० जिनालयों की पूजा","badge":"पंचमेरु"},
    {"id":"deepmalika-parv-pujan","title":"दीपमालिका पर्व पूजन (दीपावली पूजा)","category":"puja","subCategory":"parva-vrat","description":"भगवान महावीर निर्वाण कल्याणक एवं दीपावली पूजन","badge":"दीपावली"},
    {"id":"nirvan-kalyanak-ladu-puja","title":"श्री निर्वाण कल्याणक (मोक्ष लाडू) पूजा","category":"puja","subCategory":"parva-vrat","description":"भगवान महावीर एवं तीर्थंकरों के निर्वाण कल्याणक पर मोक्ष लाडू समर्पण पूजन","badge":"निर्वाण लाडू"},
    {"id":"kshamavani-parv-puja","title":"क्षमावाणी पर्व पूजा","category":"puja","subCategory":"parva-vrat","description":"विश्व मैत्री एवं क्षमावाणी महापर्व पूजन","badge":"क्षमावाणी"},
    {"id":"rakshabandhan-parv-pujan","title":"रक्षाबन्धन पर्व पूजन","category":"puja","subCategory":"parva-vrat","description":"अकंपनाचार्य आदि ७०० मुनियों के उपसर्ग निवारण स्मृति पर्व पूजन","badge":"रक्षाबंधन"},
    {"id":"akshaya-tritiya-puja","title":"अक्षय-तृतीया पूजा (भगवान आदिनाथ)","category":"puja","subCategory":"parva-vrat","description":"प्रथम तीर्थंकर आदिनाथ प्रथम पारणा अक्षय तृतीया पूजन","badge":"अक्षय तृतीया"},
    {"id":"sugandh-dashami-puja","title":"सुगंध दशमी पूजा","category":"puja","subCategory":"parva-vrat","description":"भाद्रपद शुक्ल दशमी सुगंध धूप पूजन","badge":"सुगंध दशमी"},
    {"id":"kalash-dashami-puja","title":"कलश दशमी पूजा (अक्षय फल दशमी)","category":"puja","subCategory":"parva-vrat","description":"अक्षय फल दायिनी कलश दशमी पूजा","badge":"कलश दशमी"},
    {"id":"mukut-saptami-vrat-puja","title":"मुकुट सप्तमी व्रत पूजा","category":"puja","subCategory":"parva-vrat","description":"भगवान पार्श्वनाथ मोक्ष कल्याणक मुकुट सप्तमी व्रत पूजा","badge":"मुकुट सप्तमी"},
    {"id":"rot-teej-vrat-puja","title":"रोट तीज व्रत पूजा (चौबीसी व्रत)","category":"puja","subCategory":"parva-vrat","description":"भाद्रपद शुक्ल तृतीया रोट तीज चौबीसी व्रत पूजा","badge":"रोट तीज"},
    {"id":"ravi-vrat-puja","title":"रविव्रत पूजा (भगवान पार्श्वनाथ)","category":"puja","subCategory":"parva-vrat","description":"सर्व संकट नाशक रविवार पार्श्वनाथ व्रत पूजा","badge":"रविव्रत"},
    {"id":"chandan-shashti-vrat-puja","title":"चन्दनषष्ठी व्रत पूजा","category":"puja","subCategory":"parva-vrat","description":"चन्दनषष्ठी पावन व्रत पूजन","badge":"चंदनषष्ठी"},
    {"id":"panch-parmeshthi-puja","title":"श्री पंच परमेष्ठी पूजा","category":"puja","subCategory":"guru-acharya","description":"अरिहंत, सिद्ध, आचार्य, उपाध्याय, साधु पंच परमेष्ठी पूजा","badge":"पंचपरमेष्ठी"},
    {"id":"siddha-pujan","title":"श्री सिद्ध पूजन","category":"puja","subCategory":"guru-acharya","description":"अष्ट कर्म रहित अनंत सिद्ध परमेष्ठी पूजन","badge":"सिद्ध परमेष्ठी"},
    {"id":"navdevata-puja","title":"श्री नवदेवता पूजा","category":"puja","subCategory":"guru-acharya","description":"अरहंत, सिद्ध, आचार्य, पाठक, साधु, जिनधर्म, जिनागम, जिनचैत्य, जिनचैत्यालय पूजन","badge":"नवदेवता"},
    {"id":"vidyasagar-puja","title":"आचार्य श्री विद्यासागर जी महाराज पूजन","category":"puja","subCategory":"guru-acharya","description":"संत शिरोमणि युगप्रवर्तक आचार्य श्री विद्यासागर जी पूजन","badge":"विद्यासागर जी"},
    {"id":"samaysagar-puja","title":"आचार्य श्री समयसागर जी महाराज पूजन","category":"puja","subCategory":"guru-acharya","description":"पट्टाचार्य श्री समयसागर जी महाराज पूजन","badge":"समयसागर जी"},
    {"id":"kundkund-acharya-puja","title":"श्री कुन्दकुन्द आचार्य पूजा","category":"puja","subCategory":"guru-acharya","description":"कलिकालसर्वज्ञ श्रीमद् भगवत्कुन्दकुन्दाचार्य देव पूजन एवं जयमाला","badge":"कुंदकुंद देव"},
    {"id":"rishi-mandal-puja","title":"श्री ऋषिमण्डल पूजा","category":"puja","subCategory":"guru-acharya","description":"सर्व ऋद्धि-सिद्धिधारी महामुनि एवं मन्त्रमय ऋषिमण्डल पूजन","badge":"ऋषिमंडल"},
    {"id":"padmavati-mata-puja","title":"श्री पद्मावती माता पूजा","category":"puja","subCategory":"guru-acharya","description":"भगवान पार्श्वनाथ शासन देवी पद्मावती आराधना एवं सुख-शांति पूजा","badge":"पद्मावती माता"},
    {"id":"jinvani-puja","title":"श्री जिनवाणी पूजा","category":"puja","subCategory":"tattva-guna","description":"द्वादशांग जिनवाणी माता अष्टद्रव्य पूजन","badge":"जिनवाणी"},
    {"id":"shrut-panchami-puja","title":"श्रुतपंचमी पूजा (षट्खण्डागम पूजा)","category":"puja","subCategory":"tattva-guna","description":"आगम ग्रंथ षट्खण्डागम प्रकटीकरण श्रुतपंचमी पूजा","badge":"श्रुतपंचमी"},
    {"id":"namokar-mahamantra-puja","title":"णमोकार महामंत्र पूजा","category":"puja","subCategory":"tattva-guna","description":"अनादि मूल मंत्र श्री णमोकार महामंत्र अष्टद्रव्य पूजा","badge":"णमोकार"},
    {"id":"ratnatraya-puja","title":"रत्नत्रय पूजा","category":"puja","subCategory":"tattva-guna","description":"सम्यग्दर्शन, सम्यग्ज्ञान, सम्यक्चारित्र रत्नत्रय धर्म पूजा","badge":"रत्नत्रय"},
    {"id":"samyagdarshan-puja","title":"सम्यग्दर्शन पूजा","category":"puja","subCategory":"tattva-guna","description":"मोक्षमार्ग का प्रथम सोपान सम्यग्दर्शन पूजन","badge":"सम्यग्दर्शन"},
    {"id":"samyaggyan-puja","title":"सम्यग्ज्ञान पूजा","category":"puja","subCategory":"tattva-guna","description":"संसार के समस्त पदार्थों को यथार्थ जानने वाला सम्यग्ज्ञान पूजन","badge":"सम्यग्ज्ञान"},
    {"id":"samyakcharitra-puja","title":"सम्यक्चारित्र पूजा","category":"puja","subCategory":"tattva-guna","description":"आत्म शुद्धि का परम साधन सम्यक्चारित्र पूजन","badge":"सम्यक्चारित्र"},
    {"id":"ashtakarma-dahan-puja","title":"श्री अष्टकर्म निवारण पूजा","category":"puja","subCategory":"tattva-guna","description":"ज्ञानावरणी आदि आठों कर्मों के क्षय एवं मुक्ति प्राप्ति हेतु अष्टकर्म पूजा","badge":"अष्टकर्म"}
  ],
    vidhan: [
    // -------------------------------------------------------------
    // १. प्रमुख महामंडल विधान (Major Mahamandal Vidhans)
    // -------------------------------------------------------------
    {"id":"siddhachakra-vidhan","title":"श्री सिद्धचक्र मण्डल विधान","category":"vidhan","subCategory":"mahamandal-vidhan","description":"अष्टान्हिका महापर्व एवं नवान्हिक सिद्धचक्र महामण्डल आराधना विधान","badge":"सिद्धचक्र महामण्डल"},
    {"id":"bhaktamar-vidhan","title":"श्री भक्तामर महामण्डल विधान","category":"vidhan","subCategory":"mahamandal-vidhan","description":"आचार्य मानतुंग विरचित ४८ काव्यमयी भक्तामर महामण्डल विधान","badge":"भक्तामर महामण्डल"},
    {"id":"kalyanmandir-vidhan","title":"श्री कल्याणमन्दिर महामण्डल विधान","category":"vidhan","subCategory":"mahamandal-vidhan","description":"आचार्य कुमुदचन्द्र विरचित ४४ श्लोकमयी कल्याणमन्दिर महामण्डल विधान","badge":"कल्याणमंदिर विधान"},
    {"id":"kalpataru-vidhan","title":"श्री कल्पतरु विधान (समवसरण पूजा)","category":"vidhan","subCategory":"mahamandal-vidhan","description":"सर्व अभीष्ट प्रदायक एवं समवसरण रचना युक्त कल्पतरु महाविधान","badge":"कल्पतरु विधान"},
    {"id":"shanti-vidhan-purnamati","title":"श्री शांति विधान (शांति महामण्डल)","category":"vidhan","subCategory":"mahamandal-vidhan","description":"विश्व शांति एवं सर्व विघ्न-निवारक शांतिनाथ महामण्डल विधान","badge":"शांति महाविधान"},
    {"id":"indradhwaj-vidhan","title":"श्री इन्द्रध्वज महामण्डल विधान","category":"vidhan","subCategory":"mahamandal-vidhan","description":"सौधर्म इन्द्र कृत अष्टद्रव्य एवं ध्वजारोहण युक्त इन्द्रध्वज महाविधान","badge":"इन्द्रध्वज विधान"},
    {"id":"sarvatobhadra-vidhan","title":"श्री सर्वतोभद्र महामण्डल विधान","category":"vidhan","subCategory":"mahamandal-vidhan","description":"सर्वतोभद्र मण्डल युक्त सर्व विघ्न-विनाशक पावन महाविधान","badge":"सर्वतोभद्र विधान"},
    {"id":"samavasharan-vidhan","title":"श्री समवशरण महामण्डल विधान","category":"vidhan","subCategory":"mahamandal-vidhan","description":"तीर्थंकर प्रभु की दिव्य धर्मसभा समवशरण महामण्डल विधान","badge":"समवशरण विधान"},
    {"id":"chaubisi-vidhan","title":"श्री चौबीस तीर्थंकर महामण्डल विधान","category":"vidhan","subCategory":"mahamandal-vidhan","description":"२४ जिनेन्द्र भगवान की सामूहिक अष्टद्रव्य आराधना महाविधान","badge":"चौबीसी विधान"},
    {"id":"panchameru-vidhan","title":"श्री पंचमेरु एवं नंदीश्वर महामण्डल विधान","category":"vidhan","subCategory":"mahamandal-vidhan","description":"अकृत्रिम चैत्यालय एवं पंचमेरु-नंदीश्वर द्वीप महामण्डल विधान","badge":"पंचमेरु विधान"},
    {"id":"solah-karan-vidhan","title":"श्री सोलहकारण महामण्डल विधान","category":"vidhan","subCategory":"mahamandal-vidhan","description":"तीर्थंकर प्रकृति बंध के कारणभूत १६ पावन भावनाओं का महाविधान","badge":"सोलहकारण विधान"},
    {"id":"ratnatraya-mahamandal-vidhan","title":"श्री रत्नत्रय महामण्डल विधान","category":"vidhan","subCategory":"mahamandal-vidhan","description":"सम्यग्दर्शन, सम्यग्ज्ञान, सम्यक्चारित्र मोक्षमार्ग महामण्डल विधान","badge":"रत्नत्रय महामण्डल"},
    {"id":"rishi-mandal-vidhan","title":"श्री ऋषिमण्डल महामण्डल विधान","category":"vidhan","subCategory":"mahamandal-vidhan","description":"मन्त्रराज ऋषिमण्डल एवं सर्व ऋद्धि-सिद्धिधारी मुनि आराधना विधान","badge":"ऋषिमंडल विधान"},
    {"id":"navgraha-shanti-vidhan","title":"श्री नवग्रह शांति निवारण विधान","category":"vidhan","subCategory":"mahamandal-vidhan","description":"सर्व अरिष्ट निवारक एवं जिनेन्द्र प्रभु आधारित नवग्रह शांति विधान","badge":"नवग्रह शांति"},
    {"id":"jinasahasranam-vidhan","title":"श्री जिनसहस्रनाम महामण्डल विधान","category":"vidhan","subCategory":"mahamandal-vidhan","description":"जिनेन्द्र भगवान के १००८ पावन नामों की आराधना का महामण्डल विधान","badge":"जिनसहस्रनाम"},
    {"id":"shrut-skandha-vidhan","title":"श्री श्रुतस्कंध (जिनवाणी) महामण्डल विधान","category":"vidhan","subCategory":"mahamandal-vidhan","description":"द्वादशांग जिनवाणी माता एवं श्रुतस्कंध आराधना महामण्डल विधान","badge":"श्रुतस्कंध विधान"},
    {"id":"karma-dahan-vidhan","title":"श्री कर्म दहन महामण्डल विधान","category":"vidhan","subCategory":"mahamandal-vidhan","description":"ज्ञानावरणी आदि आठों कर्मों के नाश हेतु कर्म दहन महाविधान","badge":"कर्म दहन विधान"},
    {"id":"bahubali-vidhan","title":"श्री बाहुबली स्वामी महामण्डल विधान","category":"vidhan","subCategory":"mahamandal-vidhan","description":"कामदेव प्रथम मोक्षगामी भगवान बाहुबली महामण्डल विधान","badge":"बाहुबली विधान"},
    {"id":"padmavati-vidhan","title":"श्री पद्मावती माता महामण्डल विधान","category":"vidhan","subCategory":"mahamandal-vidhan","description":"पार्श्वनाथ शासन देवी पद्मावती आराधना एवं सुख-शांति महाविधान","badge":"पद्मावती विधान"},
    {"id":"bhaktamar-deep-archana-vidhan","title":"श्री भक्तामर दीप अर्चना विधान","category":"vidhan","subCategory":"mahamandal-vidhan","description":"४८ दीप प्रज्वलन एवं भक्तामर स्तोत्र दीप आराधना महाविधान","badge":"दीप अर्चना विधान"},

    // -------------------------------------------------------------
    // २. दशलक्षण धर्म एवं पर्व विधान (क्रम: प्रथम दिन से दशम दिन)
    // -------------------------------------------------------------
    {"id":"uttam-kshama-dharma-vidhan","title":"श्री उत्तम क्षमा धर्म मण्डल विधान (प्रथम दिन)","category":"vidhan","subCategory":"daslakshan-vidhan","description":"दशलक्षण महापर्व प्रथम दिवस मण्डल आराधना विधान — क्रोध त्याग व क्षमा भाव","badge":"प्रथम दिन विधान"},
    {"id":"uttam-mardav-dharma-vidhan","title":"श्री उत्तम मार्दव धर्म मण्डल विधान (द्वितीय दिन)","category":"vidhan","subCategory":"daslakshan-vidhan","description":"दशलक्षण महापर्व द्वितीय दिवस मण्डल आराधना विधान — मान त्याग व मृदुता","badge":"द्वितीय दिन विधान"},
    {"id":"uttam-arjav-dharma-vidhan","title":"श्री उत्तम आर्जव धर्म मण्डल विधान (तृतीय दिन)","category":"vidhan","subCategory":"daslakshan-vidhan","description":"दशलक्षण महापर्व तृतीय दिवस मण्डल आराधना विधान — माया त्याग व सरलता","badge":"तृतीय दिन विधान"},
    {"id":"uttam-shauch-dharma-vidhan","title":"श्री उत्तम शौच धर्म मण्डल विधान (चतुर्थ दिन)","category":"vidhan","subCategory":"daslakshan-vidhan","description":"दशलक्षण महापर्व चतुर्थ दिवस मण्डल आराधना विधान — लोभ त्याग व पवित्रता","badge":"चतुर्थ दिन विधान"},
    {"id":"uttam-satya-dharma-vidhan","title":"श्री उत्तम सत्य धर्म मण्डल विधान (पंचम दिन)","category":"vidhan","subCategory":"daslakshan-vidhan","description":"दशलक्षण महापर्व पंचम दिवस मण्डल आराधना विधान — असत्य त्याग व हित-मित-प्रिय वचन","badge":"पंचम दिन विधान"},
    {"id":"uttam-sanyam-dharma-vidhan","title":"श्री उत्तम संयम धर्म मण्डल विधान (षष्ठ दिन)","category":"vidhan","subCategory":"daslakshan-vidhan","description":"दशलक्षण महापर्व षष्ठ दिवस मण्डल आराधना विधान — इन्द्रिय व प्राणी संयम","badge":"षष्ठ दिन विधान"},
    {"id":"uttam-tap-dharma-vidhan","title":"श्री उत्तम तप धर्म मण्डल विधान (सप्तम दिन)","category":"vidhan","subCategory":"daslakshan-vidhan","description":"दशलक्षण महापर्व सप्तम दिवस मण्डल आराधना विधान — १२ प्रकार के तप की साधना","badge":"सप्तम दिन विधान"},
    {"id":"uttam-tyag-dharma-vidhan","title":"श्री उत्तम त्याग धर्म मण्डल विधान (अष्टम दिन)","category":"vidhan","subCategory":"daslakshan-vidhan","description":"दशलक्षण महापर्व अष्टम दिवस मण्डल आराधना विधान — दान व परिग्रह त्याग","badge":"अष्टम दिन विधान"},
    {"id":"uttam-akinchanya-dharma-vidhan","title":"श्री उत्तम आकिंचन्य धर्म मण्डल विधान (नवम दिन)","category":"vidhan","subCategory":"daslakshan-vidhan","description":"दशलक्षण महापर्व नवम दिवस मण्डल आराधना विधान — ममत्व त्याग व आत्मलीनता","badge":"नवम दिन विधान"},
    {"id":"uttam-brahmacharya-dharma-vidhan","title":"श्री उत्तम ब्रह्मचर्य धर्म मण्डल विधान (दशम दिन)","category":"vidhan","subCategory":"daslakshan-vidhan","description":"दशलक्षण महापर्व दशम दिवस मण्डल आराधना विधान — ब्रह्मचर्य व शुद्ध आत्मचर्या","badge":"दशम दिन विधान"},
    {"id":"daslakshan-mahamandal-vidhan","title":"श्री दशलक्षण महामण्डल विधान","category":"vidhan","subCategory":"daslakshan-vidhan","description":"उत्तम क्षमादि दस धर्मों की आराधना का सर्वोत्कृष्ट महामण्डल विधान","badge":"दशलक्षण महामण्डल"},
    {"id":"das-lakshan-vidhan","title":"दशलक्षण विधान (समुच्चय पूजा)","category":"vidhan","subCategory":"daslakshan-vidhan","description":"दशलक्षण धर्मों की संपूर्ण अष्टद्रव्य समुच्चय पूजा एवं जयमाला","badge":"समुच्चय विधान"},
    {"id":"daslakshan-jaimala-vidhan","title":"श्री दशलक्षण जयमाला महाविधान","category":"vidhan","subCategory":"daslakshan-vidhan","description":"दसों धर्मों की विस्तृत, भावपूर्ण जयमालाओं का विशेष महाविधान","badge":"जयमाला विधान"},
    {"id":"daslakshan-kalpadrum-vidhan","title":"श्री दशलक्षण कल्पद्रुम विधान","category":"vidhan","subCategory":"daslakshan-vidhan","description":"सर्व मनोरथ सिद्धि एवं दशलक्षण कल्पद्रुम महामण्डल विधान","badge":"कल्पद्रुम विधान"},
    {"id":"daslakshan-dyanat-vidhan","title":"श्री दशलक्षण मण्डल विधान (द्यानतराय)","category":"vidhan","subCategory":"daslakshan-vidhan","description":"कविवर द्यानतराय विरचित दशलक्षण धर्म मण्डल पूजा व छन्द विधान","badge":"द्यानतराय मण्डल"},
    {"id":"daslakshan-udypan-vidhan","title":"श्री दशलक्षण व्रत उद्यापन विधान","category":"vidhan","subCategory":"daslakshan-vidhan","description":"दशलक्षण व्रत की पूर्णता पर विधिपूर्वक उद्यापन व महामण्डल विधान","badge":"उद्यापन विधान"},
    {"id":"sugandh-dashami-vidhan","title":"श्री सुगंध दशमी महाविधान","category":"vidhan","subCategory":"daslakshan-vidhan","description":"भाद्रपद शुक्ल दशमी धूप खेवन एवं सर्व पाप-विनाशक सुगंध दशमी महाविधान","badge":"सुगंध दशमी"},
    {"id":"anant-chaturdashi-vidhan","title":"श्री अनन्त चतुर्दशी महाविधान","category":"vidhan","subCategory":"daslakshan-vidhan","description":"दशलक्षण महापर्व के अंतिम दिवस का १४ ग्रंथियुक्त अनन्त व्रत महाविधान","badge":"अनंत चतुर्दशी"},
    {"id":"rot-teej-vrat-vidhan","title":"श्री रोट तीज (चौबीसी) व्रत विधान","category":"vidhan","subCategory":"daslakshan-vidhan","description":"भाद्रपद शुक्ल तृतीया रोट तीज व्रत एवं २४ तीर्थंकर आराधना विधान","badge":"रोट तीज विधान"},
    {"id":"kshamavani-parv-vidhan","title":"श्री उत्तम क्षमावाणी (पर्युषण) महाविधान","category":"vidhan","subCategory":"daslakshan-vidhan","description":"दशलक्षण महापर्व की पूर्णाहूति पर विश्व मैत्री एवं क्षमावाणी महाविधान","badge":"क्षमावाणी विधान"},

    // -------------------------------------------------------------
    // ३. २४ तीर्थंकर विधान (क्रम १ से २४: आदिनाथ से महावीर स्वामी)
    // -------------------------------------------------------------
    {"id":"adinath-vidhan","title":"श्री आदिनाथ (ऋषभदेव) विधान","category":"vidhan","subCategory":"tirthankar-vidhan","description":"प्रथम तीर्थंकर भगवान आदिनाथ अष्टद्रव्य पूजन एवं जयमाला विधान","badge":"प्रथम तीर्थंकर"},
    {"id":"ajitnath-vidhan","title":"श्री अजितनाथ विधान","category":"vidhan","subCategory":"tirthankar-vidhan","description":"द्वितीय तीर्थंकर भगवान अजितनाथ अष्टद्रव्य पूजन एवं जयमाला विधान","badge":"द्वितीय तीर्थंकर"},
    {"id":"sambhavnath-vidhan","title":"श्री संभवनाथ विधान","category":"vidhan","subCategory":"tirthankar-vidhan","description":"तृतीय तीर्थंकर भगवान संभवनाथ अष्टद्रव्य पूजन एवं जयमाला विधान","badge":"तृतीय तीर्थंकर"},
    {"id":"abhinandan-vidhan","title":"श्री अभिनंदननाथ विधान","category":"vidhan","subCategory":"tirthankar-vidhan","description":"चतुर्थ तीर्थंकर भगवान अभिनंदननाथ अष्टद्रव्य पूजन एवं जयमाला विधान","badge":"चतुर्थ तीर्थंकर"},
    {"id":"sumatinath-vidhan","title":"श्री सुमतिनाथ विधान","category":"vidhan","subCategory":"tirthankar-vidhan","description":"पंचम तीर्थंकर भगवान सुमतिनाथ अष्टद्रव्य पूजन एवं जयमाला विधान","badge":"पंचम तीर्थंकर"},
    {"id":"padmaprabh-vidhan","title":"श्री पद्मप्रभ विधान","category":"vidhan","subCategory":"tirthankar-vidhan","description":"षष्ठ तीर्थंकर भगवान पद्मप्रभ अष्टद्रव्य पूजन एवं जयमाला विधान","badge":"षष्ठ तीर्थंकर"},
    {"id":"suparshvanath-vidhan","title":"श्री सुपार्श्वनाथ विधान","category":"vidhan","subCategory":"tirthankar-vidhan","description":"सप्तम तीर्थंकर भगवान सुपार्श्वनाथ अष्टद्रव्य पूजन एवं जयमाला विधान","badge":"सप्तम तीर्थंकर"},
    {"id":"chandraprabh-vidhan","title":"श्री चन्द्रप्रभ विधान","category":"vidhan","subCategory":"tirthankar-vidhan","description":"अष्टम तीर्थंकर भगवान चन्द्रप्रभ अष्टद्रव्य पूजन एवं जयमाला विधान","badge":"अष्टम तीर्थंकर"},
    {"id":"pushpadant-vidhan","title":"श्री पुष्पदंत (सुविधिनाथ) विधान","category":"vidhan","subCategory":"tirthankar-vidhan","description":"नवम तीर्थंकर भगवान पुष्पदंत अष्टद्रव्य पूजन एवं जयमाला विधान","badge":"नवम तीर्थंकर"},
    {"id":"sheetalnath-vidhan","title":"श्री शीतलनाथ विधान","category":"vidhan","subCategory":"tirthankar-vidhan","description":"दशम तीर्थंकर भगवान शीतलनाथ अष्टद्रव्य पूजन एवं जयमाला विधान","badge":"दशम तीर्थंकर"},
    {"id":"shreyansnath-vidhan","title":"श्री श्रेयांसनाथ विधान","category":"vidhan","subCategory":"tirthankar-vidhan","description":"एकादश तीर्थंकर भगवान श्रेयांसनाथ अष्टद्रव्य पूजन एवं जयमाला विधान","badge":"एकादश तीर्थंकर"},
    {"id":"vasupujya-vidhan","title":"श्री वासुपूज्य विधान","category":"vidhan","subCategory":"tirthankar-vidhan","description":"द्वादश तीर्थंकर भगवान वासुपूज्य स्वामी अष्टद्रव्य पूजन एवं जयमाला विधान","badge":"द्वादश तीर्थंकर"},
    {"id":"vimalnath-vidhan","title":"श्री विमलनाथ विधान","category":"vidhan","subCategory":"tirthankar-vidhan","description":"त्रयोदश तीर्थंकर भगवान विमलनाथ अष्टद्रव्य पूजन एवं जयमाला विधान","badge":"त्रयोदश तीर्थंकर"},
    {"id":"anantnath-vidhan","title":"श्री अनंतनाथ विधान","category":"vidhan","subCategory":"tirthankar-vidhan","description":"चतुर्दश तीर्थंकर भगवान अनंतनाथ अष्टद्रव्य पूजन एवं जयमाला विधान","badge":"चतुर्दश तीर्थंकर"},
    {"id":"dharmanath-vidhan","title":"श्री धर्मनाथ विधान","category":"vidhan","subCategory":"tirthankar-vidhan","description":"पंचदश तीर्थंकर भगवान धर्मनाथ अष्टद्रव्य पूजन एवं जयमाला विधान","badge":"पंचदश तीर्थंकर"},
    {"id":"shantinath-vidhan","title":"श्री शांतिनाथ विधान","category":"vidhan","subCategory":"tirthankar-vidhan","description":"षोडश तीर्थंकर भगवान शांतिनाथ अष्टद्रव्य पूजन एवं जयमाला विधान","badge":"षोडश तीर्थंकर"},
    {"id":"kunthunath-vidhan","title":"श्री कुंथुनाथ विधान","category":"vidhan","subCategory":"tirthankar-vidhan","description":"सप्तदश तीर्थंकर भगवान कुंथुनाथ अष्टद्रव्य पूजन एवं जयमाला विधान","badge":"सप्तदश तीर्थंकर"},
    {"id":"arahnath-vidhan","title":"श्री अरहनाथ विधान","category":"vidhan","subCategory":"tirthankar-vidhan","description":"अष्टादश तीर्थंकर भगवान अरहनाथ अष्टद्रव्य पूजन एवं जयमाला विधान","badge":"अष्टादश तीर्थंकर"},
    {"id":"mallinath-vidhan","title":"श्री मल्लिनाथ विधान","category":"vidhan","subCategory":"tirthankar-vidhan","description":"१९वें तीर्थंकर भगवान मल्लिनाथ अष्टद्रव्य पूजन एवं जयमाला विधान","badge":"१९वें तीर्थंकर"},
    {"id":"munisuvrat-vidhan","title":"श्री मुनिसुव्रतनाथ विधान","category":"vidhan","subCategory":"tirthankar-vidhan","description":"२०वें तीर्थंकर भगवान मुनिसुव्रतनाथ अष्टद्रव्य पूजन एवं जयमाला विधान","badge":"२०वें तीर्थंकर"},
    {"id":"naminath-vidhan","title":"श्री नमिनाथ विधान","category":"vidhan","subCategory":"tirthankar-vidhan","description":"२१वें तीर्थंकर भगवान नमिनाथ अष्टद्रव्य पूजन एवं जयमाला विधान","badge":"२१वें तीर्थंकर"},
    {"id":"neminath-vidhan","title":"श्री नेमिनाथ (अरिष्टनेमि) विधान","category":"vidhan","subCategory":"tirthankar-vidhan","description":"२२वें तीर्थंकर भगवान नेमिनाथ अष्टद्रव्य पूजन एवं जयमाला विधान","badge":"२२वें तीर्थंकर"},
    {"id":"parshvanath-vidhan","title":"श्री पार्श्वनाथ विधान","category":"vidhan","subCategory":"tirthankar-vidhan","description":"२३वें तीर्थंकर भगवान पार्श्वनाथ अष्टद्रव्य पूजन एवं जयमाला विधान","badge":"२३वें तीर्थंकर"},
    {"id":"mahavir-vidhan","title":"श्री महावीर स्वामी विधान","category":"vidhan","subCategory":"tirthankar-vidhan","description":"२४वें तीर्थंकर भगवान महावीर स्वामी अष्टद्रव्य पूजन एवं जयमाला विधान","badge":"२४वें तीर्थंकर"}
  ],
  stotra: [
  {
    "id": "bhaktamar-stotra",
    "title": "भक्तामर स्तोत्र (संस्कृत व हिन्दी)",
    "category": "stotra",
    "subCategory": "pradhan-stotra",
    "description": "आचार्य मानतुंग विरचित ४८ पद्य महास्तोत्र (मूल संस्कृत एवं भावार्थ)",
    "author": "आचार्य मानतुंग स्वामी",
    "badge": "प्रधान स्तोत्र"
  },
  {
    "id": "bhaktamar-hindi-hemraj",
    "title": "भक्तामर स्तोत्र (हिन्दी पद्यानुवाद)",
    "category": "stotra",
    "subCategory": "pradhan-stotra",
    "description": "पं. हेमराज जी विरचित सम्पूर्ण ४८ पद्य हिन्दी पद्यानुवाद",
    "author": "पं. हेमराज जी",
    "badge": "पद्यानुवाद"
  },
  {
    "id": "bhaktamar-riddhi-mantra",
    "title": "भक्तामर ऋद्धि-सिद्धि मंत्र",
    "category": "stotra",
    "subCategory": "pradhan-stotra",
    "description": "भक्तामर के ४८ काव्यों के स्वतंत्र तांत्रिक ऋद्धि-सिद्धि मंत्र",
    "author": "प्राचीन परंपरा",
    "badge": "ऋद्धि मंत्र"
  },
  {
    "id": "bhaktamar-mahima",
    "title": "भक्तामर स्तोत्र महिमा",
    "category": "stotra",
    "subCategory": "pradhan-stotra",
    "description": "भक्तामर स्तोत्र का प्राकट्य, इतिहास एवं अचिन्त्य प्रभाव कथा"
  },
  {
    "id": "bhaktamar-mahatmya",
    "title": "भक्तामर महात्म्य एवं फल",
    "category": "stotra",
    "subCategory": "pradhan-stotra",
    "description": "आचार्य मानतुंग विरचित भक्तामर स्तोत्र का अलौकिक आध्यात्मिक फल"
  },
  {
    "id": "kalyan-mandir-stotra",
    "title": "कल्याण मंदिर स्तोत्र",
    "category": "stotra",
    "subCategory": "pradhan-stotra",
    "description": "आचार्य कुमुदचन्द्र विरचित ४४ पद्य पार्श्वनाथ महास्तोत्र",
    "author": "आचार्य कुमुदचन्द्र",
    "badge": "महास्तोत्र"
  },
  {
    "id": "ekibhav-stotra",
    "title": "एकीभाव स्तोत्र (संस्कृत व हिन्दी)",
    "category": "stotra",
    "subCategory": "pradhan-stotra",
    "description": "आचार्य वादिराज विरचित २६ पद्य कुष्ठरोग निवारक स्तोत्र",
    "author": "आचार्य वादिराज",
    "badge": "महास्तोत्र"
  },
  {
    "id": "swayambhu-stotra",
    "title": "स्वयंभू स्तोत्र (संस्कृत)",
    "category": "stotra",
    "subCategory": "pradhan-stotra",
    "description": "आचार्य समन्तभद्र विरचित २४ तीर्थंकर स्तुति महास्तोत्र",
    "author": "आचार्य समन्तभद्र",
    "badge": "संस्कृत"
  },
  {
    "id": "svayambhu-stotra-bhasha",
    "title": "स्वयंभू स्तोत्र (भाषा - द्यानतराय)",
    "category": "stotra",
    "subCategory": "pradhan-stotra",
    "description": "कविवर द्यानतराय विरचित २४ तीर्थंकर हिन्दी भाषा स्तोत्र",
    "author": "कविवर द्यानतराय",
    "badge": "भाषा"
  },
  {
    "id": "namokar-mantra",
    "title": "णमोकार महामंत्र एवं फलश्रुति",
    "category": "stotra",
    "subCategory": "pradhan-stotra",
    "description": "अनादिनिधन पंच नमस्कार महामंत्र, ध्यान एवं महिमा",
    "badge": "महामंत्र"
  },
  {
    "id": "brihat-shanti-stotra",
    "title": "बृहत् शांति स्तोत्र (बड़ी शांति)",
    "category": "stotra",
    "subCategory": "shanti-raksha",
    "description": "ॐ नमोऽर्हते भगवते - सर्व उपद्रव व ग्रहदोष नाशक महास्तोत्र",
    "badge": "शांति स्तोत्र"
  },
  {
    "id": "laghu-shanti-stotra",
    "title": "लघु शांति स्तोत्र (शांतिजिनं)",
    "category": "stotra",
    "subCategory": "shanti-raksha",
    "description": "शांतिजिनं शांतिकरं नमामि - दैनिक पाठ योग्य लघु शांति स्तोत्र",
    "badge": "नित्य शांति"
  },
  {
    "id": "rishi-mandal-stotra",
    "title": "ऋषि मण्डल स्तोत्र (हिंदी)",
    "category": "stotra",
    "subCategory": "shanti-raksha",
    "description": "समस्त सिद्ध व आचार्यों का बीजमंत्र युक्त रक्षा स्तोत्र",
    "badge": "रक्षा स्तोत्र"
  },
  {
    "id": "rishimandal-stotra-sanskrit",
    "title": "श्री ऋषिमंडल स्तोत्रम् (संस्कृत)",
    "category": "stotra",
    "subCategory": "shanti-raksha",
    "description": "सर्व विघ्न-निवारक एवं ऋद्धि-सिद्धि प्रदायक संस्कृत महास्तोत्र",
    "badge": "संस्कृत"
  },
  {
    "id": "uvasaggaharam-stotra",
    "title": "उवसग्गहरं स्तोत्र (प्राकृत)",
    "category": "stotra",
    "subCategory": "shanti-raksha",
    "description": "आचार्य भद्रबाहु विरचित सर्व उपसर्ग व संकट निवारक स्तोत्र",
    "author": "आचार्य भद्रबाहु",
    "badge": "प्राकृत"
  },
  {
    "id": "upasargahar-stotra",
    "title": "उपसर्ग हर स्तोत्र (भद्रबाहु)",
    "category": "stotra",
    "subCategory": "shanti-raksha",
    "description": "पार्श्वनाथ प्रभु के चरणों में समर्पित संकटमोचक उपसर्गहर स्तोत्र"
  },
  {
    "id": "santikaram-stotra",
    "title": "श्री संतिकरं स्तोत्र (प्राकृत)",
    "category": "stotra",
    "subCategory": "shanti-raksha",
    "description": "आचार्य मुनिचन्द्र विरचित प्राकृत शांति एवं रक्षा स्तोत्र",
    "author": "आचार्य मुनिचन्द्र"
  },
  {
    "id": "vishapahar-stotra-sanskrit",
    "title": "विषापहार स्तोत्र (मूल संस्कृत)",
    "category": "stotra",
    "subCategory": "shanti-raksha",
    "description": "महाकवि धनंजय विरचित ४४ पद्य सर्पदंश व विष नाशक स्तोत्र",
    "author": "महाकवि धनंजय",
    "badge": "विष नाशक"
  },
  {
    "id": "parshvanath-stotra",
    "title": "श्री पार्श्वनाथ स्तोत्र",
    "category": "stotra",
    "subCategory": "shanti-raksha",
    "description": "भगवान पार्श्वनाथ की पावन स्तुति व संकट निवारण पाठ"
  },
  {
    "id": "parshvanath-stotram-narendra",
    "title": "श्री पार्श्वनाथस्तोत्रम् (नरेंद्र-फणि)",
    "category": "stotra",
    "subCategory": "shanti-raksha",
    "description": "नरेंद्र-फणि-चंद्र-संस्तुतं - प्राचीन संस्कृत पार्श्वनाथ स्तोत्र",
    "badge": "संस्कृत"
  },
  {
    "id": "jinsahasranam-stotra",
    "title": "श्री जिनसहस्रनाम-स्तोत्रम्",
    "category": "stotra",
    "subCategory": "bhakti-stuti",
    "description": "आचार्य जिनसेन विरचित जिनेन्द्र भगवान के १००८ पावन नाम",
    "author": "आचार्य जिनसेन",
    "badge": "१००८ नाम"
  },
  {
    "id": "logassa-sutra",
    "title": "लोगस्स पाठ (चतुर्विंशति स्तव)",
    "category": "stotra",
    "subCategory": "bhakti-stuti",
    "description": "लोगस्स उज्जोअगरे - प्राकृत २४ तीर्थंकर वंदना स्तव",
    "badge": "प्राकृत स्तव"
  },
  {
    "id": "bhupal-chaturvinshati-stotra",
    "title": "भूपालचतुर्विंशति-स्तोत्र (हिंदी)",
    "category": "stotra",
    "subCategory": "bhakti-stuti",
    "description": "भूपाल विरचित २४ तीर्थंकर गुणानुवाद एवं पावन स्तुति",
    "author": "भूपाल कवि"
  },
  {
    "id": "chaturvinshati-swasti-mangalam",
    "title": "चतुर्विंशति स्वस्ति-मंगलम् (संस्कृत)",
    "category": "stotra",
    "subCategory": "bhakti-stuti",
    "description": "२४ तीर्थंकरों का नित्य मांगलिक स्वस्ति-मंगल पाठ",
    "badge": "स्वस्ति मंगल"
  },
  {
    "id": "tijay-pahutta-stotra",
    "title": "तिजयपहुत्त स्तोत्र (प्राकृत)",
    "category": "stotra",
    "subCategory": "bhakti-stuti",
    "description": "तिजयपहुत्त पवरं - प्राकृत पार्श्वनाथ स्तुति"
  },
  {
    "id": "saraswati-stotra",
    "title": "श्री सरस्वती स्तोत्र (जिनवाणी)",
    "category": "stotra",
    "subCategory": "bhakti-stuti",
    "description": "द्वादशांग जिनवाणी माता एवं ज्ञानदायिनी सरस्वती स्तुति",
    "badge": "जिनवाणी"
  },
  {
    "id": "darshan-path-sanskrit",
    "title": "दर्शन स्तोत्र पाठ (संस्कृत)",
    "category": "stotra",
    "subCategory": "bhakti-stuti",
    "description": "सकलगलुषविध्वंसं जिनदर्शनम् - संस्कृत जिनदर्शन स्तोत्र"
  },
  {
    "id": "suprabhat-stotram",
    "title": "सुप्रभात-स्तोत्रम् (प्रातः स्तोत्र)",
    "category": "stotra",
    "subCategory": "bhakti-stuti",
    "description": "प्रातःकालीन संस्कृत जिनेंद्र मंगल प्रभात स्तोत्रम्",
    "badge": "सुप्रभात"
  },
  {
    "id": "panchaparmeshthi-stotra",
    "title": "पंचपरमेष्ठी स्तोत्रम् (संस्कृत)",
    "category": "stotra",
    "subCategory": "bhakti-stuti",
    "description": "अरिहंत, सिद्ध, आचार्य, उपाध्याय, साधु पंच परमेष्ठी स्तुति",
    "badge": "पंच परमेष्ठी"
  },
  {
    "id": "dashlakshan-stotra",
    "title": "दशलक्षण महाधर्म स्तोत्रम्",
    "category": "stotra",
    "subCategory": "bhakti-stuti",
    "description": "उत्तम क्षमादि १० पावन धर्म स्तुति व वंदना",
    "badge": "दशलक्षण"
  },
  {
    "id": "ratnatraya-stotra",
    "title": "रत्नत्रय स्तोत्रम् (सम्यक्त्व)",
    "category": "stotra",
    "subCategory": "bhakti-stuti",
    "description": "सम्यग्दर्शन-ज्ञान-चारित्र रूपी रत्नत्रय स्तुति",
    "badge": "रत्नत्रय"
  },
  {
    "id": "mahaveerashtak-stotra",
    "title": "महावीराष्टक-स्तोत्रम्",
    "category": "stotra",
    "subCategory": "ashtak-stotra",
    "description": "यस्याङ्के स्फुरितं - भगवान महावीर स्वामी की ८ पद्य स्तुति",
    "author": "आचार्य भागचन्द्र",
    "badge": "अष्टक"
  },
  {
    "id": "adinathashtak-stotra",
    "title": "श्री आदिनाथाष्टक स्तोत्रम्",
    "category": "stotra",
    "subCategory": "ashtak-stotra",
    "description": "प्रथम तीर्थंकर भगवान ऋषभदेव की पावन अष्टक स्तुति",
    "badge": "अष्टक"
  },
  {
    "id": "parshvanathashtak-stotra",
    "title": "श्री पार्श्वनाथाष्टक स्तोत्रम्",
    "category": "stotra",
    "subCategory": "ashtak-stotra",
    "description": "२३वें तीर्थंकर भगवान पार्श्वनाथ संकटमोचक अष्टक स्तुति",
    "badge": "अष्टक"
  },
  {
    "id": "shantinathashtak-stotra",
    "title": "श्री शांतिनाथाष्टक स्तोत्रम्",
    "category": "stotra",
    "subCategory": "ashtak-stotra",
    "description": "१६वें तीर्थंकर चक्रवर्ती एवं कामदेव भगवान शांतिनाथ अष्टक",
    "badge": "अष्टक"
  },
  {
    "id": "chandraprabhashtak-stotra",
    "title": "श्री चंद्रप्रभाष्टक स्तोत्रम्",
    "category": "stotra",
    "subCategory": "ashtak-stotra",
    "description": "८वें तीर्थंकर भगवान चंद्रप्रभु स्वामी शीतल अष्टक स्तोत्र",
    "badge": "अष्टक"
  },
  {
    "id": "bahubalyashtak-stotra",
    "title": "श्री बाहुबल्याष्टक स्तोत्रम्",
    "category": "stotra",
    "subCategory": "ashtak-stotra",
    "description": "प्रथम कामदेव घोर तपस्वी भगवान बाहुबली स्वामी अष्टक",
    "badge": "अष्टक"
  },
  {
    "id": "ratnakar-pachisi",
    "title": "श्री रत्नाकर पच्चीसी (भाषा)",
    "category": "stotra",
    "subCategory": "adhyatma-stotra",
    "description": "मुनि रत्नाकर विरचित २५ पद्य वैराग्य एवं आत्म-प्रार्थना स्तुति",
    "author": "मुनि रत्नाकर",
    "badge": "२५ पद्य"
  },
  {
    "id": "ratnakar-panchavimshatika",
    "title": "रत्नाकर-पंचविंशतिका (भावार्थ)",
    "category": "stotra",
    "subCategory": "adhyatma-stotra",
    "description": "आचार्य रत्नाकर विरचित २५ पद्य संस्कृत मूल व हिन्दी भावार्थ",
    "author": "आचार्य रत्नाकर"
  }
],
  path: [
  {
    "id": "daivasika-pratikramana",
    "title": "श्रावक दैवसिक प्रतिक्रमण पाठ",
    "category": "path",
    "subCategory": "daily-swadhyay",
    "description": "दिन भर में हुए ज्ञात-अज्ञात प्रमाद, दोषों एवं अतिचारों की शुद्धि हेतु संध्याकालीन प्रतिक्रमण",
    "badge": "नित्य नियम"
},
  {
    "id": "darshan-path-hindi",
    "title": "दर्शन पाठ (हिंदी)",
    "category": "path",
    "subCategory": "daily-swadhyay",
    "description": "दैनिक जिनेंद्र देव दर्शन पाठ व वंदना",
    "badge": "नित्य नियम"
  },
  {
    "id": "darshan-path-sanskrit",
    "title": "दर्शन पाठ (संस्कृत)",
    "category": "path",
    "subCategory": "daily-swadhyay",
    "description": "सकलज्ञेय ज्ञायकं वन्दे - संस्कृत दर्शन पाठ",
    "badge": "संस्कृत"
  },
  {
    "id": "alochana-path",
    "title": "आलोचना पाठ (कविवर द्यानतराय)",
    "category": "path",
    "subCategory": "daily-swadhyay",
    "description": "सुनिये जिनराज अमरपद दाता - प्रायश्चित्त पाठ",
    "author": "कविवर द्यानतराय",
    "badge": "प्रायश्चित्त"
  },
  {
    "id": "laghu-pratikraman",
    "title": "लघु प्रतिक्रमण पाठ",
    "category": "path",
    "subCategory": "daily-swadhyay",
    "description": "दैनिक अतिचार विशुद्धि एवं पाप क्षमापना पाठ",
    "badge": "विशुद्धि"
  },
  {
    "id": "samayik-path",
    "title": "सामायिक पाठ (आ. अमितगति)",
    "category": "path",
    "subCategory": "daily-swadhyay",
    "description": "सत्त्वेषु मैत्रीं गुणिषु प्रमोदं - समता सामायिक पाठ",
    "author": "आचार्य अमितगति",
    "badge": "समता"
  },
  {
    "id": "aradhana-path",
    "title": "आराधना पाठ (चार आराधना)",
    "category": "path",
    "subCategory": "daily-swadhyay",
    "description": "दर्शन, ज्ञान, चारित्र और तप - चतुर्विध आराधना",
    "badge": "आराधना"
  },
  {
    "id": "mangalashtak",
    "title": "मंगलाष्टक स्तोत्र",
    "category": "path",
    "subCategory": "daily-swadhyay",
    "description": "आद्यो धर्मकरो जिनः - नित्य मांगलिक पाठ",
    "badge": "मंगल"
  },
  {
    "id": "shastra-mangalacharan",
    "title": "शास्त्र-स्वाध्याय मंगलाचरण",
    "category": "path",
    "subCategory": "daily-swadhyay",
    "description": "नमो जिनेन्द्राय - स्वाध्याय प्रारम्भ मंगलाचरण",
    "badge": "स्वाध्याय"
  },
  {
    "id": "tithi-shodashi-path",
    "title": "तिथि षोडशी पाठ (द्यानतराय)",
    "category": "path",
    "subCategory": "daily-swadhyay",
    "description": "१६ तिथियों में धर्म आराधना व संयम पाठ",
    "author": "कविवर द्यानतराय"
  },
  {
    "id": "mangal-prabhat-stavan",
    "title": "मंगल प्रभात स्तवन",
    "category": "path",
    "subCategory": "daily-swadhyay",
    "description": "प्रातःकाल उठि जिनवर ध्याऊँ - प्रभात स्तवन",
    "badge": "प्रातः वंदना"
  },
  {
    "id": "ishta-prarthana",
    "title": "इष्ट प्रार्थना (भावना दिन-रात)",
    "category": "path",
    "subCategory": "daily-swadhyay",
    "description": "भावना दिन-रात मेरी सब सुखी संसार हो",
    "badge": "प्रार्थना"
  },
  {
    "id": "meri-bhavana",
    "title": "मेरी भावना (अमर पाठ)",
    "category": "path",
    "subCategory": "vairagya-bhavana",
    "description": "जिसने राग-द्वेष कामादिक जीते - अमर आत्म-संदेश",
    "author": "पं. जुगलकिशोर मुख्तार",
    "badge": "अमर पाठ"
  },
  {
    "id": "meri-bhavana-jugal",
    "title": "मेरी भावना (पद्यानुवाद)",
    "category": "path",
    "subCategory": "vairagya-bhavana",
    "description": "पं. जुगलकिशोर जी विरचित सम्पूर्ण मेरी भावना",
    "author": "पं. जुगलकिशोर"
  },
  {
    "id": "barah-bhavana-raja-rana",
    "title": "बारह भावना (राजा राणा छत्रपति)",
    "category": "path",
    "subCategory": "vairagya-bhavana",
    "description": "राजा राणा छत्रपति हाथिन के असवार - १२ भावना",
    "author": "कविवर भूधरदास",
    "badge": "वैराग्य"
  },
  {
    "id": "barah-bhavana",
    "title": "बारह भावना (अनित्य भावनादि)",
    "category": "path",
    "subCategory": "vairagya-bhavana",
    "description": "संसार असार स्वरूप - १२ वैराग्य भावनाएँ",
    "badge": "वैराग्य"
  },
  {
    "id": "barah-bhavana-vandoo",
    "title": "बारह भावना (वंदूँ श्री अरिहंत)",
    "category": "path",
    "subCategory": "vairagya-bhavana",
    "description": "वंदूँ श्री अरिहंत पद - आत्म-स्वरूप वैराग्य भावना"
  },
  {
    "id": "vairagya-bhavana",
    "title": "वैराग्य भावना (ज्ञान-वैराग्य)",
    "category": "path",
    "subCategory": "vairagya-bhavana",
    "description": "मोह-महातम मेटने वाली आत्म-बोधक वैराग्य भावना"
  },
  {
    "id": "vairagya-bhavana-ihavidhi",
    "title": "वैराग्य भावना (इहविधि राज विचार)",
    "category": "path",
    "subCategory": "vairagya-bhavana",
    "description": "इहविधि राज विचार के - चक्रवर्ती वैराग्य चिंतन"
  },
  {
    "id": "samadhi-bhavana",
    "title": "समाधि भावना",
    "category": "path",
    "subCategory": "vairagya-bhavana",
    "description": "दिन-रात मेरे स्वामी मैं भावना ये भाऊँ - समाधि पाठ"
  },
  {
    "id": "samadhi-maran-path",
    "title": "समाधि-मरण पाठ (संथारा)",
    "category": "path",
    "subCategory": "vairagya-bhavana",
    "description": "सल्लेखना एवं समतापूर्वक देह त्याग पाठ",
    "badge": "सल्लेखना"
  },
  {
    "id": "laghu-samadhimaran-path",
    "title": "लघु समाधिमरण पाठ",
    "category": "path",
    "subCategory": "vairagya-bhavana",
    "description": "अंतिम समय में आत्म-लीनता एवं समता समाधि पाठ"
  },
  {
    "id": "atma-kirtan",
    "title": "आत्म कीर्तन (हूँ स्वतन्त्र निश्चल)",
    "category": "path",
    "subCategory": "atma-sadhana",
    "description": "हूँ स्वतन्त्र निश्चल निष्काम - शुद्धात्म स्वरूप संकीर्तन",
    "badge": "अध्यात्म"
  },
  {
    "id": "atma-raman",
    "title": "आत्म-रमण (मैं दर्शन-ज्ञान स्वभावी)",
    "category": "path",
    "subCategory": "atma-sadhana",
    "description": "मैं दर्शन-ज्ञान स्वभावी हूँ - शुद्ध चेतना लीनता पाठ",
    "badge": "शुद्धात्मा"
  },
  {
    "id": "atma-bhakti",
    "title": "आत्म-भक्ति (मेरे शाश्वत पद की वंदना)",
    "category": "path",
    "subCategory": "atma-sadhana",
    "description": "निज आत्म-प्रभु की अखंड भक्ति एवं वंदना"
  },
  {
    "id": "atma-chintan-path",
    "title": "आत्म चिन्तन पाठ (भेद-विज्ञान)",
    "category": "path",
    "subCategory": "atma-sadhana",
    "description": "देह-जीव भिन्नता एवं शुद्धात्मा का भेद-विज्ञान"
  },
  {
    "id": "sambodhan-path",
    "title": "संबोधन (सदा संतोष कर मनवा)",
    "category": "path",
    "subCategory": "atma-sadhana",
    "description": "सदा संतोष कर मनवा - मन को धर्म व समता का उपदेश"
  },
  {
    "id": "aho-jagat-gurudev",
    "title": "देव-स्तुति (अहो जगत गुरुदेव)",
    "category": "path",
    "subCategory": "jinendra-stuti",
    "description": "अहो जगत गुरुदेव तुम - परम पावन जिनेंद्र स्तुति",
    "badge": "स्तुति"
  },
  {
    "id": "prabhu-patit-pavan",
    "title": "स्तुति (प्रभु पतित पावन)",
    "category": "path",
    "subCategory": "jinendra-stuti",
    "description": "प्रभु पतित पावन मैं अपावन - परम दैन्य विनय स्तुति"
  },
  {
    "id": "stuti-prabhu-patitpavan",
    "title": "स्तुति (प्रभु पतितपावन - पद २)",
    "category": "path",
    "subCategory": "jinendra-stuti",
    "description": "चरण शरण में आए स्वामी - दैन्य स्तुति पाठ"
  },
  {
    "id": "stuti-tum-taran-taran",
    "title": "स्तुति (तुम तरण तारण)",
    "category": "path",
    "subCategory": "jinendra-stuti",
    "description": "तुम तरण तारण भव निवारण - जिनवर गुणगान"
  },
  {
    "id": "stuti-main-tum-charan",
    "title": "स्तुति (मैं तुम चरण कमल अनुरागी)",
    "category": "path",
    "subCategory": "jinendra-stuti",
    "description": "जिनवर चरण अनुराग एवं भक्ति स्तुति"
  },
  {
    "id": "main-tum-charan-kamal",
    "title": "स्तुति (मैं तुम चरण-कमल गुण गाय)",
    "category": "path",
    "subCategory": "jinendra-stuti",
    "description": "मैं तुम चरण-कमल गुण गाय - कविवर द्यानतराय"
  },
  {
    "id": "stuti-tumse-laagi",
    "title": "स्तुति पार्श्वनाथ (तुमसे लागी लगन)",
    "category": "path",
    "subCategory": "jinendra-stuti",
    "description": "श्री पार्श्वनाथ भगवान के चरणों में अनन्य लगन स्तुति"
  },
  {
    "id": "dukh-haran-vinati",
    "title": "दुःख हरण विनती",
    "category": "path",
    "subCategory": "jinendra-stuti",
    "description": "दुःख हरण जिनेंद्र विनती - संकट निवारक पाठ"
  },
  {
    "id": "sankat-mochan-vinati",
    "title": "संकट मोचन पार्श्वनाथ विनती",
    "category": "path",
    "subCategory": "jinendra-stuti",
    "description": "पार्श्व जिनेश संकट निवारण स्तुति व प्रार्थना",
    "badge": "संकट मोचन"
  },
  {
    "id": "tirthankar-stavan-doha",
    "title": "तीर्थंकर स्तवन दोहावली",
    "category": "path",
    "subCategory": "jinendra-stuti",
    "description": "२४ तीर्थंकर पावन दोहावली समुच्चय स्तवन",
    "badge": "२४ जिन"
  },
  {
    "id": "bahubali-jin-stavan",
    "title": "बाहुबली जिनस्तवन",
    "category": "path",
    "subCategory": "jinendra-stuti",
    "description": "प्रथम कामदेव घोर तपस्वी भगवान बाहुबली स्तवन"
  },
  {
    "id": "guru-stuti-te-guru",
    "title": "गुरु-स्तुति (ते गुरु मेरे उर बसो सदा)",
    "category": "path",
    "subCategory": "jinendra-stuti",
    "description": "निग्र्रंथ दिगंबर मुनिराज एवं आचार्यों की पावन स्तुति",
    "badge": "गुरु भक्ति"
  },
  {
    "id": "vidyaguru-stavan",
    "title": "विद्यागुरु स्तवन (आचार्य-वन्दना)",
    "category": "path",
    "subCategory": "jinendra-stuti",
    "description": "संत शिरोमणि आचार्य श्री विद्यासागर जी महाराज वंदना",
    "badge": "विद्यागुरु"
  },
  {
    "id": "jinvani-stuti",
    "title": "जिनवाणी स्तुति (मिथ्यातम तम नासवे)",
    "category": "path",
    "subCategory": "jinendra-stuti",
    "description": "द्वादशांग जिनवाणी माता की पावन स्तुति"
  },
  {
    "id": "mata-tu-daya-karke",
    "title": "जिनवाणी स्तुति (माता तू दया करके)",
    "category": "path",
    "subCategory": "jinendra-stuti",
    "description": "माता तू दया करके भव-सिंधु पार कर दे - जिनवाणी प्रार्थना"
  },
  {
    "id": "vishapahar-stotra",
    "title": "विषापहार स्तोत्र पाठ",
    "category": "path",
    "subCategory": "jinendra-stuti",
    "description": "महाकवि धनंजय विरचित ४४ पद्य सर्पदंश व विष निवारक स्तोत्र पाठ",
    "author": "महाकवि धनंजय"
  },
  {
    "id": "nirvan-kand",
    "title": "निर्वाण कांड भाषा",
    "category": "path",
    "subCategory": "tirth-vandana",
    "description": "अष्टापद कैलाश आदि समस्त सिद्धक्षेत्र वंदना पाठ",
    "author": "कविवर भैया भगवतीदास",
    "badge": "सिद्धक्षेत्र"
  },
  {
    "id": "siddha-bhakti",
    "title": "सिद्ध भक्ति (प्राकृत)",
    "category": "path",
    "subCategory": "tirth-vandana",
    "description": "णमोकार मंत्र पूर्वक अष्टगुण संपन्न सिद्ध वंदना पाठ",
    "badge": "प्राकृत"
  },
  {
    "id": "siddhachakra-stuti",
    "title": "श्री सिद्धचक्र स्तुति",
    "category": "path",
    "subCategory": "tirth-vandana",
    "description": "सिद्धचक्र नवपद महायंत्र एवं सिद्ध प्रभु स्तुति"
  },
  {
    "id": "stuti-siddhachakra",
    "title": "स्तुति (श्री सिद्धचक्र का पाठ)",
    "category": "path",
    "subCategory": "tirth-vandana",
    "description": "सिद्धचक्र आराधना एवं नवपद स्तुति"
  },
  {
    "id": "ath-athai-rasa",
    "title": "अथ अठाई रासा (विनयकीर्ति)",
    "category": "path",
    "subCategory": "tirth-vandana",
    "description": "अष्टान्हिका महापर्व नंदीश्वर द्वीप वंदना रासा पाठ",
    "author": "विनयकीर्ति",
    "badge": "पर्व पाठ"
  }
],
  granthas: [
  {
    "id": "samaysar-natak",
    "title": "समयसार नाटक (Samaysar Natak)",
    "category": "granthas",
    "subCategory": "dravyanuyoga",
    "author": "कविवर बनारसीदास जी",
    "description": "अध्यात्म शिरोमणि बनारसीदास जी विरचित समयसार एवं आत्मख्याति कलशों का ब्रजभाषा में अमर पद्यानुवाद (७२७ छंद)"
},
  {
    "id": "ashtapahuda",
    "title": "अष्टपाहुड़ (Ashtapahuda)",
    "category": "granthas",
    "subCategory": "charananuyoga",
    "author": "आचार्य कुन्दकुन्द देव",
    "description": "प्राकृत भाषा में आठ स्वतंत्र पाहुड़ - दर्शन, चारित्र, सूत्र, बोध, भाव, मोक्ष, लिंग एवं शील पाहुड़ (५०२ गाथाएं)"
},
  {
    "id": "sarvarthasiddhi",
    "title": "सर्वार्थसिद्धि (Sarvarthasiddhi - तत्त्वार्थ टीका)",
    "category": "granthas",
    "subCategory": "dravyanuyoga",
    "author": "आचार्य पूज्यपाद (देवनन्दि)",
    "description": "तत्त्वार्थसूत्र की प्रथम एवं सर्वाधिक प्रामाणिक संस्कृत टीका - १० अध्यायों और ३५७ सूत्रों का विशद प्रमाण-नय विवेचन"
},
  {
    "id": "chhah-dhala",
    "title": "छह ढाला (Chhah Dhala)",
    "category": "granthas",
    "subCategory": "charananuyoga",
    "author": "कविवर पं. दौलतराम जी",
    "description": "जैन दर्शन की लघु गीता - ६ ढालाओं में संसार के दुःखों से लेकर सिद्ध पद की प्राप्ति तक का संपूर्ण मोक्षमार्ग"
  },
  {
    "id": "tattvartha-sutra",
    "title": "तत्त्वार्थ सूत्र (Tattvartha Sutra / मोक्षशास्त्र)",
    "category": "granthas",
    "subCategory": "dravyanuyoga",
    "author": "आचार्य उमास्वामी",
    "description": "जैन दर्शन का प्रथम एवं सर्वमान्य संस्कृत सूत्र ग्रंथ - सम्पूर्ण १० अध्यायों एवं ३५७ सूत्रों का प्रामाणिक संस्कृत पाठ व विस्तृत हिंदी भावार्थ"
  },
  {
    "id": "ratnakarand-shravakachar",
    "title": "रत्नकरण्ड श्रावकाचार (Ratnakarand Shravakachar)",
    "category": "granthas",
    "subCategory": "charananuyoga",
    "description": "आचार्य समन्तभद्र विरचित श्रावक धर्म एवं आचार का आधार स्तंभ (१५० श्लोक)"
  },
  {
    "id": "samaysar",
    "title": "समयसार (Samaysar)",
    "category": "granthas",
    "subCategory": "dravyanuyoga",
    "description": "अध्यात्म चक्रवर्ती आचार्य कुन्दकुन्द देव विरचित परम अध्यात्म ग्रंथराज (४१५ गाथाएँ)"
  },
  {
    "id": "dravya-sangrah",
    "title": "द्रव्य संग्रह (Dravya Sangrah)",
    "category": "granthas",
    "subCategory": "dravyanuyoga",
    "description": "आचार्य नेमिचन्द्र सिद्धांत चक्रवर्ती विरचित षट्द्रव्य, नवपदार्थ एवं ध्यान संग्रह (५८ गाथाएँ)"
  },
  {
    "id": "moksha-marg-prakashak",
    "title": "मोक्षमार्ग प्रकाशक (Moksha Marg Prakashak)",
    "category": "granthas",
    "subCategory": "dravyanuyoga",
    "description": "प्रातःस्मरणीय पंडितप्रवर टोडरमल जी विरचित अनुपम तार्किक मौलिक ग्रंथ (९ अधिकार)"
  },
  {
    "id": "pravachanasar",
    "title": "प्रवचनसार (Pravachanasar)",
    "category": "granthas",
    "subCategory": "dravyanuyoga",
    "description": "आचार्य कुन्दकुन्द देव विरचित ज्ञान, ज्ञेय एवं मुनि चारित्र का महान ग्रंथ (२७५ गाथाएँ)"
  },
  {
    "id": "niyamasar",
    "title": "नियमसार (Niyamasar)",
    "category": "granthas",
    "subCategory": "dravyanuyoga",
    "description": "आचार्य कुन्दकुन्द देव विरचित परम समाधि एवं नियम स्वरूप (१८७ गाथाएँ)"
  },
  {
    "id": "purushartha-siddhipaya",
    "title": "पुरुषार्थ सिद्ध्युपाय (Purushartha Siddhipaya)",
    "category": "granthas",
    "subCategory": "charananuyoga",
    "description": "आचार्य अमृतचन्द्र विरचित मोक्ष पुरुषार्थ एवं अहिंसा दर्शन का अनुपम ग्रंथ (२२६ श्लोक)"
  },
  {
    "id": "mulachar",
    "title": "मूलाचार (Mulachar)",
    "category": "granthas",
    "subCategory": "charananuyoga",
    "description": "आचार्य वट्टकेर विरचित दिगम्बर मुनि आचार संहिता का महाग्रंथ (१२४३ गाथाएँ)"
  },
  {
    "id": "padma-puran",
    "title": "पद्म पुराण (Padma Puran / जैन रामायण)",
    "category": "granthas",
    "subCategory": "prathamanuyoga",
    "description": "आचार्य रविषेण विरचित भगवान रामचन्द्र जी का प्रामाणिक जीवन चरित्र (१२३ पर्व)"
  },
  {
    "id": "harivansh-puran",
    "title": "हरिवंश पुराण (Harivansh Puran / जैन महाभारत)",
    "category": "granthas",
    "subCategory": "prathamanuyoga",
    "description": "आचार्य जिनसेन विरचित भगवान नेमिनाथ एवं श्रीकृष्ण का प्रामाणिक इतिहास (६६ सर्ग)"
  },
  {
    "id": "trilok-saar",
    "title": "त्रिलोक सार (Trilok Saar)",
    "category": "granthas",
    "subCategory": "karnanuyoga",
    "description": "आचार्य नेमिचन्द्र सिद्धांत चक्रवर्ती विरचित तीन लोक की गणितीय संरचना (१०१८ गाथाएँ)"
  },
  {
    "id": "ashtasahasri",
    "title": "अष्टसहस्री (Ashtasahasri)",
    "category": "granthas",
    "subCategory": "dravyanuyoga",
    "description": "आचार्य विद्यानंद विरचित जैन न्याय एवं स्याद्वाद का सर्वोच्च शिखर ग्रंथ (८००० श्लोक प्रमाण)"
  },
  {
    "id": "adipurana",
    "title": "श्री आदिपुराण (महापुराण पूर्वभाग)",
    "category": "granthas",
    "subCategory": "prathamanuyoga",
    "author": "आचार्य जिनसेन",
    "description": "जैन वांग्मय का सर्वोपरि महाकाव्य - प्रथम तीर्थंकर ऋषभदेव एवं भरत चक्रवर्ती का पावन जीवन चरित्र व कर्मयुग का प्रादुर्भाव"
  },
  {
    "id": "uttarapurana",
    "title": "श्री उत्तरपुराण (महापुराण उत्तरभाग)",
    "category": "granthas",
    "subCategory": "prathamanuyoga",
    "author": "आचार्य गुणभद्र",
    "description": "महापुराण का उत्तरभाग - द्वितीय तीर्थंकर अजितनाथ से लेकर २४वें तीर्थंकर महावीर स्वामी तक का प्रामाणिक महाचरित्र"
  },
  {
    "id": "mahavira-purana",
    "title": "श्री महावीर पुराण",
    "category": "granthas",
    "subCategory": "prathamanuyoga",
    "author": "आचार्य सकलकीर्ति",
    "description": "चरम तीर्थंकर भगवान महावीर स्वामी के पूर्व भव, कुण्डलपुर जन्म, तप, समवशरण दिव्यध्वनि एवं पावापुर निर्वाण का भावपूर्ण महाकाव्य"
  },
  {
    "id": "parshvanath-charitra",
    "title": "श्री पार्श्वनाथ चरित",
    "category": "granthas",
    "subCategory": "prathamanuyoga",
    "author": "आचार्य वादिराज सूरि",
    "description": "कमठ के दस भवों के वैर का शमन, कमठ उपसर्ग पर भगवान पार्श्वनाथ की परम क्षमा एवं धरणीन्द्र-पद्मावती भक्ति का अमर चरित"
  },
  {
    "id": "yashastilaka-champu",
    "title": "श्री यशस्तिलक चम्पू",
    "category": "granthas",
    "subCategory": "prathamanuyoga",
    "author": "आचार्य सोमदेव सूरि",
    "description": "राजा यशोधर का चरित - हिंसा के सूक्ष्म परिणामों (पिष्टमय मयूर बलि) का दुष्फल एवं जैन नीति-दर्शन का अमर प्रतिपादन"
  },
  {
    "id": "gommatasara-jiva-kanda",
    "title": "श्री गोम्मटसार जीवकांड",
    "category": "granthas",
    "subCategory": "karnanuyoga",
    "author": "आचार्य नेमिचन्द्र सिद्धांत चक्रवर्ती",
    "description": "करणानुयोग का मुकुटमणि ग्रंथ - १४ गुणस्थान, १४ जीवसमास, १४ मार्गणाएँ एवं २० प्ररूपणाओं द्वारा आत्मा के अनंत भेदों का वैज्ञानिक निरूपण"
  },
  {
    "id": "gommatasara-karma-kanda",
    "title": "श्री गोम्मटसार कर्मकांड",
    "category": "granthas",
    "subCategory": "karnanuyoga",
    "author": "आचार्य नेमिचन्द्र सिद्धांत चक्रवर्ती",
    "description": "८ मूल कर्म, १४८ उत्तर प्रकृतियाँ, प्रकृति-स्थिति-अनुभाग-प्रदेश बंध, उदय, उदीरणा, उपशम एवं निर्जरा का संपूर्ण वैज्ञानिक विश्लेषण"
  },
  {
    "id": "labdhisara",
    "title": "श्री लब्धिसार एवं क्षपणासार",
    "category": "granthas",
    "subCategory": "karnanuyoga",
    "author": "आचार्य नेमिचन्द्र सिद्धांत चक्रवर्ती",
    "description": "पंच लब्धि (क्षयोपशम, विशुद्धि, देशना, प्रायोग्य, करण) द्वारा प्रथमोपशम सम्यक्त्व एवं क्षपक श्रेणी द्वारा मोक्ष प्राप्ति की साधना"
  },
  {
    "id": "tiloyapannatti",
    "title": "श्री तिलोयपण्णत्ती (त्रिलोक प्रज्ञप्ति)",
    "category": "granthas",
    "subCategory": "karnanuyoga",
    "author": "आचार्य यतिवृषभ",
    "description": "प्राकृत भाषा में ऊर्ध्वलोक, मध्यलोक एवं अधोलोक, द्वीप-समुद्र, नर्क-स्वर्ग व अकृत्रिम चैत्यालयों का विस्तृत परिमाप व नक्शा"
  },
  {
    "id": "jambudvipa-pannatti",
    "title": "श्री जम्बूद्वीप प्रज्ञप्ति",
    "category": "granthas",
    "subCategory": "karnanuyoga",
    "author": "आचार्य पद्मनंदि",
    "description": "१ लाख योजन विस्तार वाले जम्बूद्वीप, सुदर्शन मेरु, भरत-ऐरावत-विदेह क्षेत्र, गंगा-सिंधु नदियाँ एवं अकृत्रिम चैत्यालयों का पावन वर्णन"
  },
  {
    "id": "sagara-dharmamrita",
    "title": "श्री सागार धर्मामृत",
    "category": "granthas",
    "subCategory": "charananuyoga",
    "author": "पं. आशाधर जी",
    "description": "श्रावक के दैनिक अष्ट मूलगुण, १२ व्रत, षट् आवश्यक एवं दर्शन से लेकर क्षुल्लक-ऐलक तक की ११ प्रतिमाओं का संपूर्ण आचार शास्त्र"
  },
  {
    "id": "anagara-dharmamrita",
    "title": "श्री अनगार धर्मामृत",
    "category": "granthas",
    "subCategory": "charananuyoga",
    "author": "पं. आशाधर जी",
    "description": "अनगार (घर-रहित दिगम्बर मुनिराजों) के २८ मूलगुण, १२ तप, २२ परीषह जय एवं शुक्लध्यान द्वारा मोक्ष साधना का शास्त्र"
  },
  {
    "id": "kartikeyanupreksha",
    "title": "श्री कार्तिकेयानुप्रेक्षा",
    "category": "granthas",
    "subCategory": "charananuyoga",
    "author": "स्वामी कार्तिकेय",
    "description": "अनित्य, अशरण, संसार, एकत्व, अन्यत्व, अशुचि, आस्रव, संवर, निर्जरा, लोक, बोधिदुर्लभ एवं धर्म भावना का प्राकृत महाकाव्य"
  },
  {
    "id": "bhagavati-aradhana",
    "title": "श्री भगवती आराधना",
    "category": "granthas",
    "subCategory": "charananuyoga",
    "author": "आचार्य शिवार्य",
    "description": "दर्शनाराधना, ज्ञानाराधना, चारित्राराधना एवं तप-आराधना द्वारा जीवन के अंतिम समय में पंडितमरण (समाधिमरण) की सिद्धि"
  },
  {
    "id": "yogasara-prabhrita",
    "title": "श्री योगसार प्राभृत",
    "category": "granthas",
    "subCategory": "charananuyoga",
    "author": "आचार्य अमितगति",
    "description": "मन की चंचलता का त्याग, कषायों का शमन, समता भाव की साधना एवं शुद्ध आत्म-स्वरूप में लीन होने की योग पद्धति"
  },
  {
    "id": "panchastikaya-sangrah",
    "title": "श्री पंचास्तिकाय संग्रह",
    "category": "granthas",
    "subCategory": "dravyanuyoga",
    "author": "आचार्य कुन्दकुन्द देव",
    "description": "पंचपरमागम का आधारभूत ग्रंथ - जीव, पुद्गल, धर्म, अधर्म, आकाश (५ अस्तिकाय) एवं काल द्रव्य तथा नवपदार्थों का तात्विक रहस्य"
  },
  {
    "id": "samadhitantra",
    "title": "श्री समाधितंत्र",
    "category": "granthas",
    "subCategory": "dravyanuyoga",
    "author": "आचार्य पूज्यपाद स्वामी",
    "description": "बहिरात्मा (शरीर को आत्मा मानना), अंतरात्मा (शरीर-आत्मा का भेदविज्ञान) एवं परमात्मा (शुद्ध सिद्ध अवस्था) की १०५ श्लोकीय साधना"
  },
  {
    "id": "ishto-padesha",
    "title": "श्री इष्टोपदेश",
    "category": "granthas",
    "subCategory": "dravyanuyoga",
    "author": "आचार्य पूज्यपाद स्वामी",
    "description": "इष्ट (आत्मा) की प्राप्ति का सर्वोत्तम उपदेश - सुख-दुःख की भ्रांति, देह-भिन्नता एवं वीतराग पद की प्राप्ति का अमृत संदेश"
  },
  {
    "id": "jnanarnava",
    "title": "श्री ज्ञानार्णव (योगप्रदीपिका)",
    "category": "granthas",
    "subCategory": "dravyanuyoga",
    "author": "आचार्य शुभचन्द्र",
    "description": "जैन योग का विश्वप्रसिद्ध महाग्रंथ - प्राणायाम, प्रत्याहार, धारणा, पिंडस्थ, पदस्थ, रूपस्थ एवं रूपातीत ध्यान द्वारा केवलज्ञान सिद्धि"
  },
  {
    "id": "aptamimamsa",
    "title": "श्री आप्तमीमांसा (देवागम स्तोत्र)",
    "category": "granthas",
    "subCategory": "dravyanuyoga",
    "author": "आचार्य समन्तभद्र",
    "description": "जैन दर्शन का गौरव ग्रंथ - बाह्य विभूतियों से नहीं, बल्कि वीतरागता एवं निर्दोष आप्त वचनों से सर्वज्ञता की तार्किक सिद्धि"
  },
  {
    "id": "nyayadeepika",
    "title": "श्री न्यायदीपिका",
    "category": "granthas",
    "subCategory": "dravyanuyoga",
    "author": "आचार्य धर्मभूषण यति",
    "description": "जैन न्याय की अमूल्य कुंजी - प्रमाण (प्रत्यक्ष व परोक्ष), नय (द्रव्यार्थिक व पर्यायार्थिक), निक्षेप एवं हेत्वाभासों का विशद विवेचन"
  },
  {
    "id": "svarupa-sambodhana",
    "title": "श्री स्वरूप सम्बोधन",
    "category": "granthas",
    "subCategory": "dravyanuyoga",
    "author": "आचार्य अकलंक देव",
    "description": "२५ श्लोकों में देह और आत्मा की भिन्नता, मोह की निद्रा से जागरण एवं शुद्ध आत्म-अनुभूति का परम अमृत"
  }
],
  itihas: [
  {
    "id": "adinath",
    "title": "भगवान आदिनाथ (ऋषभदेव) का इतिहास",
    "category": "itihas",
    "description": "युगादि पुरुष, संस्कृति के जनक एवं प्रथम तीर्थंकर"
  },
  {
    "id": "mahavir-swami",
    "title": "भगवान महावीर स्वामी का इतिहास",
    "category": "itihas",
    "description": "२४वें तीर्थंकर, अहिंसा के अमर संदेशवाहक एवं शासन नायक"
  },
  {
    "id": "mahavir-jayanti",
    "title": "महावीर जयंती एवं शासन प्रभावना",
    "category": "itihas",
    "description": "चैत्र शुक्ल त्रयोदशी - २४वें तीर्थंकर जन्म कल्याणक महोत्सव"
  },
  {
    "id": "acharya-kundakunda",
    "title": "अध्यात्म चक्रवर्ती आचार्य कुन्दकुन्द देव",
    "category": "itihas",
    "description": "दिगम्बर जैन अध्यात्म परंपरा के सर्वोपरि महर्षि"
  },
  {
    "id": "acharya-samantabhadra",
    "title": "स्वामी समन्तभद्र आचार्य",
    "category": "itihas",
    "description": "तार्किक शिरोमणि, वादीभसिंह एवं श्रावक धर्म के अमर प्रणेता"
  },
  {
    "id": "acharya-jinasena",
    "title": "आचार्य जिनसेन स्वामी",
    "category": "itihas",
    "description": "महापुराण एवं आदिपुराण के अमर रचयिता"
  },
  {
    "id": "acharya-todarmal",
    "title": "प्रातःस्मरणीय पंडित टोडरमल जी",
    "category": "itihas",
    "description": "मोक्षमार्ग प्रकाशक के रचयिता, जयपुर के अद्वितीय विद्वान"
  },
  {
    "id": "acharya-virsena",
    "title": "सिद्धांताचार्य वीरसेन स्वामी",
    "category": "itihas",
    "description": "षट्खण्डागम पर ७२,००० श्लोक प्रमाण 'धवला' टीका के रचयिता"
  }
],
  bhugol: [
  {
    "id": "cosmology",
    "title": "जैन त्रिलोक रचना एवं भूगोल",
    "category": "bhugol",
    "description": "अनादिनिधन चौदह राजू प्रमाण तीन लोक का संपूर्ण स्वरूप"
  },
  {
    "id": "jambudvipa",
    "title": "जम्बूद्वीप संरचना",
    "category": "bhugol",
    "description": "मध्यलोक का केंद्रवर्ती १ लाख योजन विस्तृत चक्राकार द्वीप"
  },
  {
    "id": "urdhva-loka",
    "title": "ऊर्ध्व लोक (देवलोक)",
    "category": "bhugol",
    "description": "१६ स्वर्ग, नव ग्रैवेयक, नव अनुदिश, ५ अनुत्तर विमान एवं सिद्धशिला"
  },
  {
    "id": "madhya-loka",
    "title": "मध्य लोक (मनुष्य व तिर्यंच लोक)",
    "category": "bhugol",
    "description": "असंख्यात द्वीप-समुद्र, ढाई द्वीप एवं कर्मभूमि व्यवस्था"
  },
  {
    "id": "adho-loka",
    "title": "अधो लोक (नरक लोक)",
    "category": "bhugol",
    "description": "सातों नरक भूमियाँ, ८४ लाख बिल एवं नारकियों की दारुण वेदना"
  },
  {
    "id": "siddhashila",
    "title": "सिद्धशिला स्वरूप",
    "category": "bhugol",
    "description": "लोकाग्र स्थित ४५ लाख योजन विस्तृत मोक्ष धाम"
  }
],
  parva: [
  {
    "id": "das-lakshan",
    "title": "दशलक्षण महापर्व",
    "category": "parva",
    "description": "भाद्रपद शुक्ल पंचमी से चतुर्दशी - आत्मा के १० उत्तम धर्मों का महापर्व"
  },
  {
    "id": "ashtanhika",
    "title": "अष्टान्हिका महापर्व",
    "category": "parva",
    "description": "कार्तिक, फाल्गुन एवं आषाढ़ मास का शाश्वत नंदीश्वर पर्व"
  },
  {
    "id": "diwali",
    "title": "जैन दीपावली (भगवान महावीर निर्वाण कल्याणक)",
    "category": "parva",
    "description": "कार्तिक कृष्ण अमावस्या - निर्वाण लाडू एवं ज्ञान दीपक महोत्सव"
  },
  {
    "id": "raksha-bandhan",
    "title": "जैन रक्षाबंधन पर्व (वात्सल्य पर्व)",
    "category": "parva",
    "description": "श्रावण पूर्णिमा - मुनि विष्णुकुमार द्वारा ७०० मुनिराजों का उपसर्ग निवारण"
  },
  {
    "id": "akshaya-tritiya",
    "title": "अक्षय तृतीया (दान तीर्थ प्रवर्तन दिवस)",
    "category": "parva",
    "description": "वैशाख शुक्ल तृतीया - भगवान आदिनाथ का इक्षुरस प्रथम पारणा"
  },
  {
    "id": "vardhaman-calendar",
    "title": "तीर्थंकर वर्धमान पंचांग एवं तिथियाँ",
    "category": "parva",
    "description": "जैन पंचांग, अष्टान्हिका, दशलक्षण, अष्टमी एवं चतुर्दशी पर्व तिथियाँ"
  }
],
  philosophy: [
  {
    "id": "karma-theory",
    "title": "कर्म सिद्धान्त एवं आठ कर्म",
    "category": "philosophy",
    "description": "आत्मा और कर्म पुद्गल का संबंध, आठ मूल प्रकृतियाँ"
  },
  {
    "id": "six-dravyas",
    "title": "षट्द्रव्य स्वरूप",
    "category": "philosophy",
    "description": "सृष्टि के अनादि-अनंत छह मूल घटक"
  },
  {
    "id": "jiva-tattva",
    "title": "जीव तत्त्व",
    "category": "philosophy",
    "description": "ज्ञान-दर्शनमय चेतन आत्म तत्त्व"
  },
  {
    "id": "ajiva-tattva",
    "title": "अजीव तत्त्व",
    "category": "philosophy",
    "description": "चेतना रहित जड़ तत्त्व (पुद्गल, धर्म, अधर्म, आकाश, काल)"
  },
  {
    "id": "asrava-tattva",
    "title": "आस्रव तत्त्व",
    "category": "philosophy",
    "description": "आत्मा में कर्म पुद्गलों का आगमन"
  },
  {
    "id": "bandha-tattva",
    "title": "बंध तत्त्व",
    "category": "philosophy",
    "description": "आत्मा और कर्म परमाणुओं का परस्पर एक क्षेत्रावगाह होना"
  },
  {
    "id": "samvara-tattva",
    "title": "संवर तत्त्व",
    "category": "philosophy",
    "description": "नवीन कर्मों के आगमन को रोकना"
  },
  {
    "id": "nirjara-tattva",
    "title": "निर्जरा तत्त्व",
    "category": "philosophy",
    "description": "पूर्व संचित कर्मों का आत्मा से एकदेश क्षय"
  },
  {
    "id": "moksha-tattva",
    "title": "मोक्ष तत्त्व",
    "category": "philosophy",
    "description": "आठों कर्मों से आत्मा की पूर्ण एवं शाश्वत मुक्ति"
  },
  {
    "id": "twelve-vratas",
    "title": "श्रावक के बारह व्रत",
    "category": "philosophy",
    "description": "गृहस्थ के ५ अणुव्रत, ३ गुणव्रत एवं ४ शिक्षाव्रत"
  },
  {
    "id": "anekantavada",
    "title": "अनेकांतवाद एवं स्याद्वाद",
    "category": "philosophy",
    "description": "जैन दर्शन की सर्वोत्कृष्ट विश्व-शांति एवं समन्वय दृष्टि"
  },
  {
    "id": "gunasthan",
    "title": "चौदह गुणस्थान विवेचन",
    "category": "philosophy",
    "description": "मिथ्यात्व से सिद्धपद तक आत्मा के क्रमिक आध्यात्मिक विकास के १४ सोपान"
  },
  {
    "id": "leshya",
    "title": "षड् लेश्या स्वरूप",
    "category": "philosophy",
    "description": "कषायों के तारतम्य से उत्पन्न आत्मा के भावों का रंग"
  }
],
  kids: [
  {
    "id": "namokar-mantra-meaning",
    "title": "Namokar Mantra Meaning",
    "category": "kids",
    "description": "The Universal Prayer"
  },
  {
    "id": "four-kashaya",
    "title": " The 4 Kashayas (Passions)",
    "category": "kids",
    "description": "Enemies of the Soul"
  },
  {
    "id": "five-paps",
    "title": "5 Pap (The Five Sins)",
    "category": "kids",
    "description": "What to Avoid"
  },
  {
    "id": "trishala-dreams",
    "title": "Dreams of Mother Trishala",
    "category": "kids",
    "description": "The 16 Auspicious Dreams"
  },
  {
    "id": "elephant-rabbit",
    "title": "Story of Elephant and Rabbit",
    "category": "kids",
    "description": "Compassion of Parshvanath's Soul"
  }
],
  tirthankar: [
  {
    "id": "adinath",
    "title": "१. श्री आदिनाथ भगवान",
    "category": "tirthankar",
    "badge": "बैल (वृषभ)",
    "description": "प्रथम तीर्थंकर • अयोध्या जन्म • कैलाश मोक्ष"
  },
  {
    "id": "ajitnath",
    "title": "२. श्री अजितनाथ भगवान",
    "category": "tirthankar",
    "badge": "हाथी (गज)",
    "description": "द्वितीय तीर्थंकर • अयोध्या जन्म • सम्मेदशिखर मोक्ष"
  },
  {
    "id": "sambhavnath",
    "title": "३. श्री संभवनाथ भगवान",
    "category": "tirthankar",
    "badge": "घोड़ा (अश्व)",
    "description": "तृतीय तीर्थंकर • श्रावस्ती जन्म • सम्मेदशिखर मोक्ष"
  },
  {
    "id": "abhinandannath",
    "title": "४. श्री अभिनंदननाथ भगवान",
    "category": "tirthankar",
    "badge": "बंदर (कपि)",
    "description": "चतुर्थ तीर्थंकर • अयोध्या जन्म • सम्मेदशिखर मोक्ष"
  },
  {
    "id": "sumatinath",
    "title": "५. श्री सुमतिनाथ भगवान",
    "category": "tirthankar",
    "badge": "चकवा (क्रौंच)",
    "description": "पंचम तीर्थंकर • अयोध्या जन्म • सम्मेदशिखर मोक्ष"
  },
  {
    "id": "padmaprabh",
    "title": "६. श्री पद्मप्रभ भगवान",
    "category": "tirthankar",
    "badge": "कमल (पद्म)",
    "description": "षष्ठम तीर्थंकर • कौशाम्बी जन्म • सम्मेदशिखर मोक्ष"
  },
  {
    "id": "suparshvanath",
    "title": "७. श्री सुपार्श्वनाथ भगवान",
    "category": "tirthankar",
    "badge": "स्वस्तिक",
    "description": "सप्तम तीर्थंकर • वाराणसी जन्म • सम्मेदशिखर मोक्ष"
  },
  {
    "id": "chandraprabh",
    "title": "८. श्री चंद्रप्रभ भगवान",
    "category": "tirthankar",
    "badge": "चन्द्रमा (शशि)",
    "description": "अष्टम तीर्थंकर • चन्द्रपुरी जन्म • सम्मेदशिखर मोक्ष"
  },
  {
    "id": "pushpadant",
    "title": "९. श्री पुष्पदंत भगवान",
    "category": "tirthankar",
    "badge": "मकर (मगरमच्छ)",
    "description": "नवम तीर्थंकर • काकन्दी जन्म • सम्मेदशिखर मोक्ष"
  },
  {
    "id": "sheetalnath",
    "title": "१०. श्री शीतलनाथ भगवान",
    "category": "tirthankar",
    "badge": "कल्पवृक्ष",
    "description": "दशम तीर्थंकर • भद्रिलपुर जन्म • सम्मेदशिखर मोक्ष"
  },
  {
    "id": "shreyansanath",
    "title": "११. श्री श्रेयांसनाथ भगवान",
    "category": "tirthankar",
    "badge": "गैंडा (खड्गी)",
    "description": "एकादश तीर्थंकर • सिंहपुर जन्म • सम्मेदशिखर मोक्ष"
  },
  {
    "id": "vasupujya",
    "title": "१२. श्री वासुपूज्य भगवान",
    "category": "tirthankar",
    "badge": "भैंसा (महिष)",
    "description": "द्वादश तीर्थंकर • चम्पापुर जन्म एवं मोक्ष"
  },
  {
    "id": "vimalanath",
    "title": "१३. श्री विमलनाथ भगवान",
    "category": "tirthankar",
    "badge": "शूकर (वराह)",
    "description": "त्रयोदश तीर्थंकर • कांपिल्य जन्म • सम्मेदशिखर मोक्ष"
  },
  {
    "id": "anantanath",
    "title": "१४. श्री अनंतनाथ भगवान",
    "category": "tirthankar",
    "badge": "सेही / श्येन",
    "description": "चतुर्विंशति तीर्थंकर • अयोध्या जन्म • सम्मेदशिखर मोक्ष"
  },
  {
    "id": "dharmanath",
    "title": "१५. श्री धर्मनाथ भगवान",
    "category": "tirthankar",
    "badge": "वज्र",
    "description": "पंचदश तीर्थंकर • रतनपुरी जन्म • सम्मेदशिखर मोक्ष"
  },
  {
    "id": "shantinath",
    "title": "१६. श्री शांतिनाथ भगवान",
    "category": "tirthankar",
    "badge": "हिरण (मृग)",
    "description": "षोडश तीर्थंकर • हस्तिनापुर जन्म • सम्मेदशिखर मोक्ष"
  },
  {
    "id": "kunthunath",
    "title": "१७. श्री कुन्थुनाथ भगवान",
    "category": "tirthankar",
    "badge": "बकरा (अज)",
    "description": "सप्तदश तीर्थंकर • हस्तिनापुर जन्म • सम्मेदशिखर मोक्ष"
  },
  {
    "id": "aranath",
    "title": "१८. श्री अरहनाथ भगवान",
    "category": "tirthankar",
    "badge": "मछली (मीन)",
    "description": "अष्टादश तीर्थंकर • हस्तिनापुर जन्म • सम्मेदशिखर मोक्ष"
  },
  {
    "id": "mallinath",
    "title": "१९. श्री मल्लिनाथ भगवान",
    "category": "tirthankar",
    "badge": "कलश (कुम्भ)",
    "description": "एकोनविंश तीर्थंकर • मिथिला जन्म • सम्मेदशिखर मोक्ष"
  },
  {
    "id": "munisuvrata",
    "title": "२०. श्री मुनिसुव्रतनाथ भगवान",
    "category": "tirthankar",
    "badge": "कछुआ (कूर्म)",
    "description": "विंशति तीर्थंकर • राजगृह जन्म • सम्मेदशिखर मोक्ष"
  },
  {
    "id": "naminath",
    "title": "२१. श्री नमिनाथ भगवान",
    "category": "tirthankar",
    "badge": "एकविंशति तीर्थंकर • मिथिला जन्म • सम्मेदशिखर मोक्ष"
  },
  {
    "id": "neminath",
    "title": "२२. श्री नेमिनाथ भगवान",
    "category": "tirthankar",
    "badge": "शंख",
    "description": "द्वाविंशति तीर्थंकर • शौरीपुर जन्म • गिरनार मोक्ष"
  },
  {
    "id": "parshvanath",
    "title": "२३. श्री पार्श्वनाथ भगवान",
    "category": "tirthankar",
    "badge": "सर्प (नाग)",
    "description": "त्रयोविंशति तीर्थंकर • वाराणसी जन्म • सम्मेदशिखर मोक्ष"
  },
  {
    "id": "mahavir-swami",
    "title": "२४. श्री महावीर भगवान",
    "category": "tirthankar",
    "badge": "सिंह (केसरी)",
    "description": "चतुर्विंशति तीर्थंकर • कुण्डलपुर जन्म • पावापुर मोक्ष"
  }
],
  agamas: [
  {
    "id": "shatkhandagama",
    "title": "षट्खण्डागम (Shatkhandagama)",
    "category": "agamas",
    "subCategory": "karananuyoga",
    "description": "आचार्य पुष्पदंत एवं भूतबलि विरचित दिगम्बर आम्नाय का प्रथम मूल सिद्धांत आगम (६ खण्ड, ६००० सूत्र)"
  },
  {
    "id": "kashayaprabhrita",
    "title": "कषायपाहुड़ (Kashayaprabhrita)",
    "category": "agamas",
    "subCategory": "karananuyoga",
    "description": "आचार्य गुणधर विरचित कषाय एवं कर्म निर्जरा का मूल प्राकृत आगम (२३३ गाथाएँ)"
  },
  {
    "id": "acharang-sutra",
    "title": "आचारांग सूत्र (Acharang Sutra)",
    "category": "agamas",
    "subCategory": "charananuyoga",
    "description": "द्वादशांग जिनवाणी का प्रथम अंग - मुनि आचार एवं अहिंसा का महाग्रंथ"
  },
  {
    "id": "tattvartha-sutra",
    "title": "तत्त्वार्थ सूत्र (मोक्षशास्त्र)",
    "category": "agamas",
    "author": "आचार्य उमास्वामी",
    "description": "सर्वमान्य जैन सूत्र ग्रंथ"
  },
  {
    "id": "samaysar",
    "title": "समयसार",
    "category": "agamas",
    "author": "आचार्य कुन्दकुन्द देव",
    "description": "परम अध्यात्म ग्रंथराज"
  },
  {
    "id": "mulachar",
    "title": "मूलाचार",
    "category": "agamas",
    "author": "आचार्य वट्टकेर",
    "description": "दिगम्बर मुनि आचार संहिता"
  }
]
};

// Aliases for navigation categories
(contentInventory as any)['tattva'] = contentInventory.philosophy;
(contentInventory as any)['shastra'] = contentInventory.granthas;
