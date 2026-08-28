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
  puja: [
    { id: 'all', label: 'सभी पूजाएँ' },
    { id: 'daily-flow', label: 'नित्य पूजन क्रम', description: 'प्रतिदिन मंदिर जी एवं घर में की जाने वाली क्रमबद्ध दैनिक पूजा विधि' },
    { id: 'tirthankar', label: 'तीर्थंकर पूजा', description: '२४ तीर्थंकर एवं बाहुबली भगवान की स्वतंत्र पूजाएँ' },
    { id: 'parva-vrat', label: 'पर्व एवं व्रत पूजा', description: 'दशलक्षण, सोलहकारण, अष्टान्हिका, नंदीश्वर व विशेष व्रत पूजाएँ' },
    { id: 'guru-acharya', label: 'गुरु एवं आचार्य', description: 'आचार्य श्री विद्यासागर जी, समयसागर जी एवं मुनि संघ पूजन' },
    { id: 'tattva-guna', label: 'गुण एवं शास्त्र पूजा', description: 'सम्यग्दर्शन, ज्ञान, चारित्र, जिनवाणी एवं णमोकार मंत्र पूजा' },
  ],
  vidhan: [
    { id: 'all', label: 'सभी विधान' },
    { id: 'mahamandal-vidhan', label: 'महामंडल विधान', description: 'सिद्धचक्र, भक्तामर, कल्याणमंदिर, दशलक्षण एवं प्रमुख महाविधान' },
    { id: 'tirthankar-vidhan', label: '२४ तीर्थंकर विधान', description: 'भगवान आदिनाथ से भगवान महावीर स्वामी तक २४ तीर्थंकर विधान' },
  ],
  stotra: [
    { id: 'all', label: 'सभी स्तोत्र' },
    { id: 'pradhan-stotra', label: 'प्रधान स्तोत्र', description: 'भक्तामर, कल्याणमंदिर, एकीभाव एवं महामंत्र' },
    { id: 'shanti-raksha', label: 'शांति एवं रक्षा स्तोत्र', description: 'बृहत् शांति, लघु शांति, विषापहार, ऋषि मण्डल' },
    { id: 'bhakti-stuti', label: 'भक्ति एवं स्तुति', description: 'जिनसहस्रनाम, महावीराष्टक, रत्नाकर पच्चीसी' },
  ],
  chalisa: [
    { id: 'all', label: 'सभी चालीसा' },
    { id: 'tirthankar-chalisa', label: 'तीर्थंकर चालीसा', description: '२४ तीर्थंकरों की चालीसा स्तुति' },
    { id: 'vishesh-chalisa', label: 'विशेष चालीसा', description: 'णमोकार, सीमंधर स्वामी एवं जिनेन्द्र चालीसा' },
  ],
  granthas: [
    { id: 'all', label: 'सभी शास्त्र' },
    { id: 'prathamanuyoga', label: 'प्रथमानुयोग', description: 'आदिपुराण, उत्तरपुराण, पद्म पुराण, हरिवंश पुराण व तीर्थंकर महाचरित्र' },
    { id: 'karnanuyoga', label: 'करणानुयोग', description: 'गोम्मटसार, लब्धिसार, त्रिलोक सार, तिलोयपण्णत्ती व लोक-कर्म संरचना' },
    { id: 'charananuyoga', label: 'चरणानुयोग', description: 'रत्नकरण्ड श्रावकाचार, सागार धर्मामृत, पुरुषार्थ सिद्ध्युपाय व मुनि आचार' },
    { id: 'dravyanuyoga', label: 'द्रव्यानुयोग', description: 'समयसार, प्रवचनसार, नियमसार, पंचास्तिकाय, छह ढाला व तत्त्वार्थ सूत्र' },
  ],
  shastra: [
    { id: 'all', label: 'सभी शास्त्र' },
    { id: 'prathamanuyoga', label: 'प्रथमानुयोग', description: 'आदिपुराण, उत्तरपुराण, पद्म पुराण, हरिवंश पुराण व तीर्थंकर महाचरित्र' },
    { id: 'karnanuyoga', label: 'करणानुयोग', description: 'गोम्मटसार, लब्धिसार, त्रिलोक सार, तिलोयपण्णत्ती व लोक-कर्म संरचना' },
    { id: 'charananuyoga', label: 'चरणानुयोग', description: 'रत्नकरण्ड श्रावकाचार, सागार धर्मामृत, पुरुषार्थ सिद्ध्युपाय व मुनि आचार' },
    { id: 'dravyanuyoga', label: 'द्रव्यानुयोग', description: 'समयसार, प्रवचनसार, नियमसार, पंचास्तिकाय, छह ढाला व तत्त्वार्थ सूत्र' },
  ],
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
    "id": "abhinandannath-chalisa",
    "title": "श्री अभिनंदननाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "४० पद्य स्तुति एवं भक्ति पाठ"
  },
  {
    "id": "adinath-chalisa",
    "title": "श्री आदिनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "४० पद्य स्तुति एवं भक्ति पाठ"
  },
  {
    "id": "ajitnath-chalisa",
    "title": "श्री अजितनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "४० पद्य स्तुति एवं भक्ति पाठ"
  },
  {
    "id": "anantnath-chalisa",
    "title": "श्री अनन्तनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "४० पद्य स्तुति एवं भक्ति पाठ"
  },
  {
    "id": "aranath-chalisa",
    "title": "श्री अरहनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "४० पद्य स्तुति एवं भक्ति पाठ"
  },
  {
    "id": "chandraprabhu-chalisa",
    "title": "श्री चन्द्रप्रभु चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "४० पद्य स्तुति एवं भक्ति पाठ"
  },
  {
    "id": "dharmanath-chalisa",
    "title": "श्री धर्मनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "४० पद्य स्तुति एवं भक्ति पाठ"
  },
  {
    "id": "kunthunath-chalisa",
    "title": "श्री कुन्थुनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "४० पद्य स्तुति एवं भक्ति पाठ"
  },
  {
    "id": "mahavir-chalisa",
    "title": "श्री महावीर चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "४० पद्य स्तुति एवं भक्ति पाठ"
  },
  {
    "id": "mallinath-chalisa",
    "title": "श्री मल्लिनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "४० पद्य स्तुति एवं भक्ति पाठ"
  },
  {
    "id": "munisuvratnath-chalisa",
    "title": "श्री मुनिसुव्रतनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "४० पद्य स्तुति एवं भक्ति पाठ"
  },
  {
    "id": "naminath-chalisa",
    "title": "श्री नमिनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "४० पद्य स्तुति एवं भक्ति पाठ"
  },
  {
    "id": "namokar-chalisa",
    "title": "णमोकार महामंत्र चालीसा",
    "category": "chalisa",
    "subCategory": "vishesh-chalisa",
    "description": "४० पद्य स्तुति एवं भक्ति पाठ"
  },
  {
    "id": "neminath-chalisa",
    "title": "श्री नेमिनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "४० पद्य स्तुति एवं भक्ति पाठ"
  },
  {
    "id": "padmaprabhu-chalisa",
    "title": "श्री पद्मप्रभु चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "४० पद्य स्तुति एवं भक्ति पाठ"
  },
  {
    "id": "parshvanath-chalisa",
    "title": "श्री पार्श्वनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "४० पद्य स्तुति एवं भक्ति पाठ"
  },
  {
    "id": "pushpadanta-chalisa",
    "title": "श्री पुष्पदन्त चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "४० पद्य स्तुति एवं भक्ति पाठ"
  },
  {
    "id": "sambhavnath-chalisa",
    "title": "श्री संभवनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "४० पद्य स्तुति एवं भक्ति पाठ"
  },
  {
    "id": "shantinath-chalisa",
    "title": "श्री शान्तिनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "४० पद्य स्तुति एवं भक्ति पाठ"
  },
  {
    "id": "sheetalnath-chalisa",
    "title": "श्री शीतलनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "४० पद्य स्तुति एवं भक्ति पाठ"
  },
  {
    "id": "shreyansnath-chalisa",
    "title": "श्री श्रेयांसनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "४० पद्य स्तुति एवं भक्ति पाठ"
  },
  {
    "id": "sumatinath-chalisa",
    "title": "श्री सुमतिनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "४० पद्य स्तुति एवं भक्ति पाठ"
  },
  {
    "id": "suparshvanath-chalisa",
    "title": "श्री सुपार्श्वनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "४० पद्य स्तुति एवं भक्ति पाठ"
  },
  {
    "id": "vasupujya-chalisa",
    "title": "श्री वासुपूज्य चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "४० पद्य स्तुति एवं भक्ति पाठ"
  },
  {
    "id": "vimalnath-chalisa",
    "title": "श्री विमलनाथ चालीसा",
    "category": "chalisa",
    "subCategory": "tirthankar-chalisa",
    "description": "४० पद्य स्तुति एवं भक्ति पाठ"
  },
  {
    "id": "simandhar-chalisa",
    "title": "श्री सीमंधर स्वामी चालीसा",
    "category": "chalisa",
    "subCategory": "vishesh-chalisa",
    "description": "४० पद्य स्तुति एवं भक्ति पाठ"
  },
  {
    "id": "jinendra-chalisa",
    "title": "श्री जिनेन्द्र चालीसा",
    "category": "chalisa",
    "subCategory": "vishesh-chalisa",
    "description": "४० पद्य स्तुति एवं भक्ति पाठ"
  }
],
  puja: [
  {
    "id": "20-teerthankar-puja",
    "title": "श्री विद्यमान बीस तीर्थंकर पूजा",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "24-tirthankar-swasti-path",
    "title": "२४ तीर्थंकर स्वस्ति पाठ",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "adinath-chandkhedi-puja",
    "title": "श्री आदिनाथ जिन पूजा (चाँदखेड़ी)",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "adinath-puja-jineshwardas",
    "title": "श्री आदिनाथ जिन पूजा (जिनेश्वरदास)",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "anantanath-puja",
    "title": "श्री अनंतनाथ जिन पूजन",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "arghyavali",
    "title": "अर्घ्यावली (संपूर्ण २४ तीर्थंकर)",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "bahubali-puja",
    "title": "श्री बाहुबली पूजा",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "chandraprabh-dehra-puja",
    "title": "श्री चंद्रप्रभु जी पूजा - देहरा (तिजारा)",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "chandraprabh-puja",
    "title": "श्री चंद्रप्रभ जिन पूजा",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "chaubis-tirthankar-puja",
    "title": "श्री चौबीस तीर्थंकर पूजा",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "dev-shastra-guru-puja-dyanat",
    "title": "श्री देव-शास्त्र-गुरु पूजा (द्यानत राय)",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "dev-shastra-guru-puja-jugal",
    "title": "श्री देव-शास्त्र-गुरु पूजा",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "jinvani-puja",
    "title": "श्री जिनवाणी पूजा",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "kunthunath-puja",
    "title": "श्री कुन्थुनाथ जिन पूजन",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "maha-argh",
    "title": "महा अर्घ",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "mahavir-puja-vrindavan",
    "title": "श्री महावीर जिन पूजा (वृन्दावनदास)",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "munisuvrat-puja",
    "title": "श्री मुनिसुव्रत जिन पूजन",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "namokar-mahamantra-puja",
    "title": "णमोकार महामंत्र पूजा",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "navdevata-puja",
    "title": "श्री नवदेवता पूजा",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "neminath-puja",
    "title": "श्री नेमिनाथ जिन पूजन",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "padmaprabh-puja",
    "title": "श्री पद्मप्रभ जिन पूजा",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "panch-balyati-puja",
    "title": "पंच बालयति पूजा",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "panch-parmeshthi-argh",
    "title": "पंच परमेष्ठि अर्घ",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "panch-parmeshthi-puja",
    "title": "श्री पंच परमेष्ठी पूजा",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "parmarshi-swasti-mangal-path",
    "title": "परमर्षि स्वस्ति मंगल पाठ",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "parshvanath-puja-bakhtawar",
    "title": "श्री पार्श्वनाथ जिन पूजा (बख्तावर सिंह)",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "puja-pratigya-path",
    "title": "पूजा प्रतिज्ञा पाठ",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "puja-vidhi-prarambh",
    "title": "पूजा विधि प्रारम्भ",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "pushpadanta-puja",
    "title": "श्री पुष्पदंत जिन पूजन",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "samaysagar-puja",
    "title": "आचार्य श्री समयसागर जी महाराज पूजन",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "samuchay-pujan",
    "title": "समुच्चय पूजन",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "shanti-path",
    "title": "शांति पाठ",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "shantinath-puja-bakhtawar",
    "title": "श्री शांतिनाथ जिन पूजा (बख्तावर सिंह)",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "sheetalnath-puja",
    "title": "श्री शीतलनाथ जिन पूजन",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "siddha-pujan",
    "title": "श्री सिद्ध पूजन",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "sumatinath-puja",
    "title": "श्री सुमतिनाथ जिन पूजन",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "vasupujya-puja",
    "title": "श्री वासुपूज्य जिन पूजन",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "vidyasagar-puja",
    "title": "आचार्य श्री विद्यासागर जी महाराज पूजन",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "vidyman-vimshati-tirthankar-pujan",
    "title": "श्री विद्यमान विंशति तीर्थंकर पूजन",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "vimalnath-puja",
    "title": "श्री विमलनाथ जिन पूजन",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "vinay-path",
    "title": "विनय पाठ",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "visarjan-path",
    "title": "विसर्जन पाठ",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "akshaya-tritiya-puja",
    "title": "अक्षय-तृतीया पूजा (भगवान आदिनाथ)",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "ashtanhika-vrat-puja",
    "title": "अष्टान्हिका व्रत पूजा (नंदीश्वर द्वीप)",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "chandan-shashti-vrat-puja",
    "title": "चन्दनषष्ठी व्रत पूजा",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "daslakshan-dharma-puja",
    "title": "दशलक्षण-धर्म पूजा",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "deepmalika-parv-pujan",
    "title": "दीपमालिका पर्व पूजन (दीपावली पूजा)",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "kalash-dashami-puja",
    "title": "कलश दशमी पूजा (अक्षय फल दशमी)",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "kshamavani-parv-puja",
    "title": "क्षमावाणी पर्व पूजा",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "mukut-saptami-vrat-puja",
    "title": "मुकुट सप्तमी व्रत पूजा",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "nandishwar-dweep-puja",
    "title": "श्री नंदीश्वर-द्वीप पूजा",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "panchmeru-puja",
    "title": "श्री पंचमेरु पूजा",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "rakshabandhan-parv-pujan",
    "title": "रक्षाबन्धन पर्व पूजन",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "ratnatraya-puja",
    "title": "रत्नत्रय पूजा",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "ravi-vrat-puja",
    "title": "रविव्रत पूजा (भगवान पार्श्वनाथ)",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "rot-teej-vrat-puja",
    "title": "रोट तीज व्रत पूजा (चौबीसी व्रत)",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "samyagdarshan-puja",
    "title": "सम्यग्दर्शन पूजा",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "samyaggyan-puja",
    "title": "सम्यग्ज्ञान पूजा",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "samyakcharitra-puja",
    "title": "सम्यक्चारित्र पूजा",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "shrut-panchami-puja",
    "title": "श्रुतपंचमी पूजा (षट्खण्डागम पूजा)",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "solah-karan-puja",
    "title": "सोलहकारण पूजा",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "sugandh-dashami-puja",
    "title": "सुगंध दशमी पूजा",
    "category": "puja",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "ajitnath-puja",
    "title": "श्री अजितनाथ जिन पूजन",
    "category": "puja",
    "description": "द्वितीय तीर्थंकर अजितनाथ अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "sambhavnath-puja",
    "title": "श्री संभवनाथ जिन पूजन",
    "category": "puja",
    "description": "तृतीय तीर्थंकर संभवनाथ अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "abhinandan-puja",
    "title": "श्री अभिनंदननाथ जिन पूजन",
    "category": "puja",
    "description": "चतुर्थ तीर्थंकर अभिनंदननाथ अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "suparshvanath-puja",
    "title": "श्री सुपार्श्वनाथ जिन पूजन",
    "category": "puja",
    "description": "सप्तम तीर्थंकर सुपार्श्वनाथ अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "shreyansnath-puja",
    "title": "श्री श्रेयांसनाथ जिन पूजन",
    "category": "puja",
    "description": "एकादश तीर्थंकर श्रेयांसनाथ अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "dharmanath-puja",
    "title": "श्री धर्मनाथ जिन पूजन",
    "category": "puja",
    "description": "पंचदश तीर्थंकर धर्मनाथ अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "arahnath-puja",
    "title": "श्री अरहनाथ जिन पूजन",
    "category": "puja",
    "description": "अष्टादश तीर्थंकर अरहनाथ अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "mallinath-puja",
    "title": "श्री मल्लिनाथ जिन पूजन",
    "category": "puja",
    "description": "एकोनविंशति तीर्थंकर मल्लिनाथ अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "naminath-puja",
    "title": "श्री नमिनाथ जिन पूजन",
    "category": "puja",
    "description": "एकविंशति तीर्थंकर नमिनाथ अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "bhaktamar-puja",
    "title": "श्री भक्तामर पूजा",
    "category": "puja",
    "description": "आचार्य मानतुंग कृत भक्तामर आधारित अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "kalyanmandir-puja",
    "title": "श्री कल्याणमन्दिर पूजा",
    "category": "puja",
    "description": "आचार्य कुमुदचन्द्र कृत कल्याणमन्दिर आधारित पार्श्वनाथ पूजन एवं जयमाला"
  },
  {
    "id": "rishi-mandal-puja",
    "title": "श्री ऋषिमण्डल पूजा",
    "category": "puja",
    "description": "सर्व ऋद्धि-सिद्धिधारी महामुनि एवं मन्त्रमय ऋषिमण्डल पूजन"
  },
  {
    "id": "seemandhar-puja",
    "title": "श्री सीमंधर स्वामी पूजा",
    "category": "puja",
    "description": "विदेह क्षेत्र के वर्तमान विहरमान तीर्थंकर सीमंधर स्वामी पूजन"
  },
  {
    "id": "kundkund-acharya-puja",
    "title": "श्री कुन्दकुन्द आचार्य पूजा",
    "category": "puja",
    "description": "कलिकालसर्वज्ञ श्रीमद् भगवत्कुन्दकुन्दाचार्य देव पूजन एवं जयमाला"
  },
  {
    "id": "ashtakarma-dahan-puja",
    "title": "श्री अष्टकर्म निवारण पूजा",
    "category": "puja",
    "description": "ज्ञानावरणी आदि आठों कर्मों के क्षय एवं मुक्ति प्राप्ति हेतु अष्टकर्म पूजा"
  },
  {
    "id": "padmavati-mata-puja",
    "title": "श्री पद्मावती माता पूजा",
    "category": "puja",
    "description": "भगवान पार्श्वनाथ शासन देवी पद्मावती आराधना एवं सुख-शांति पूजा"
  },
  {
    "id": "samavasharan-puja",
    "title": "श्री समवशरण पूजा",
    "category": "puja",
    "description": "तीर्थंकर प्रभु के दिव्य १२ सभाओं से युक्त समवशरण पूजन"
  },
  {
    "id": "nirvan-kalyanak-ladu-puja",
    "title": "श्री निर्वाण कल्याणक (मोक्ष लाडू) पूजा",
    "category": "puja",
    "description": "भगवान महावीर एवं तीर्थंकरों के निर्वाण कल्याणक पर मोक्ष लाडू समर्पण पूजन"
  },
  {
    "id": "jinasahasranam-puja",
    "title": "श्री जिनसहस्रनाम पूजा",
    "category": "puja",
    "description": "आचार्य जिनसेन विरचित जिनेंद्र भगवान के १००८ पावन नामों की अष्टद्रव्य पूजा"
  },
  {
    "id": "shanti-puja",
    "title": "श्री शांतिनाथ महाशांति पूजा",
    "category": "puja",
    "description": "सर्व विघ्न-विनाशक एवं शांति प्रदायक शांतिनाथ जिनेंद्र पूजन"
  }
],
  vidhan: [
  {
    "id": "adinath-vidhan",
    "title": "श्री आदिनाथ विधान",
    "category": "vidhan",
    "subCategory": "tirthankar-vidhan",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "das-lakshan-vidhan",
    "title": "दशलक्षण विधान (समुच्चय पूजा)",
    "category": "vidhan",
    "subCategory": "mahamandal-vidhan",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "kalpataru-vidhan",
    "title": "श्री कल्पतरु विधान (समवसरण पूजा)",
    "category": "vidhan",
    "subCategory": "mahamandal-vidhan",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "mahavir-vidhan",
    "title": "श्री महावीर विधान",
    "category": "vidhan",
    "subCategory": "tirthankar-vidhan",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "parshvanath-vidhan",
    "title": "श्री पार्श्वनाथ विधान",
    "category": "vidhan",
    "subCategory": "tirthankar-vidhan",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "shantinath-vidhan",
    "title": "श्री शांतिनाथ विधान",
    "category": "vidhan",
    "subCategory": "tirthankar-vidhan",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "siddhachakra-vidhan",
    "title": "श्री सिद्धचक्र मण्डल विधान",
    "category": "vidhan",
    "subCategory": "mahamandal-vidhan",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "ajitnath-vidhan",
    "title": "श्री अजितनाथ विधान",
    "category": "vidhan",
    "subCategory": "tirthankar-vidhan",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "sambhavnath-vidhan",
    "title": "श्री संभवनाथ विधान",
    "category": "vidhan",
    "subCategory": "tirthankar-vidhan",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "abhinandan-vidhan",
    "title": "श्री अभिनंदननाथ विधान",
    "category": "vidhan",
    "subCategory": "tirthankar-vidhan",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "sumatinath-vidhan",
    "title": "श्री सुमतिनाथ विधान",
    "category": "vidhan",
    "subCategory": "tirthankar-vidhan",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "padmaprabh-vidhan",
    "title": "श्री पद्मप्रभ विधान",
    "category": "vidhan",
    "subCategory": "tirthankar-vidhan",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "suparshvanath-vidhan",
    "title": "श्री सुपार्श्वनाथ विधान",
    "category": "vidhan",
    "subCategory": "tirthankar-vidhan",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "chandraprabh-vidhan",
    "title": "श्री चन्द्रप्रभ विधान",
    "category": "vidhan",
    "subCategory": "tirthankar-vidhan",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "pushpadant-vidhan",
    "title": "श्री पुष्पदंत विधान",
    "category": "vidhan",
    "subCategory": "tirthankar-vidhan",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "sheetalnath-vidhan",
    "title": "श्री शीतलनाथ विधान",
    "category": "vidhan",
    "subCategory": "tirthankar-vidhan",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "shreyansnath-vidhan",
    "title": "श्री श्रेयांसनाथ विधान",
    "category": "vidhan",
    "subCategory": "tirthankar-vidhan",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "vasupujya-vidhan",
    "title": "श्री वासुपूज्य विधान",
    "category": "vidhan",
    "subCategory": "tirthankar-vidhan",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "vimalnath-vidhan",
    "title": "श्री विमलनाथ विधान",
    "category": "vidhan",
    "subCategory": "tirthankar-vidhan",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "anantnath-vidhan",
    "title": "श्री अनंतनाथ विधान",
    "category": "vidhan",
    "subCategory": "tirthankar-vidhan",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "dharmanath-vidhan",
    "title": "श्री धर्मनाथ विधान",
    "category": "vidhan",
    "subCategory": "tirthankar-vidhan",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "kunthunath-vidhan",
    "title": "श्री कुंथुनाथ विधान",
    "category": "vidhan",
    "subCategory": "tirthankar-vidhan",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "arahnath-vidhan",
    "title": "श्री अरहनाथ विधान",
    "category": "vidhan",
    "subCategory": "tirthankar-vidhan",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "mallinath-vidhan",
    "title": "श्री मल्लिनाथ विधान",
    "category": "vidhan",
    "subCategory": "tirthankar-vidhan",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "munisuvrat-vidhan",
    "title": "श्री मुनिसुव्रतनाथ विधान",
    "category": "vidhan",
    "subCategory": "tirthankar-vidhan",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "naminath-vidhan",
    "title": "श्री नमिनाथ विधान",
    "category": "vidhan",
    "subCategory": "tirthankar-vidhan",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "neminath-vidhan",
    "title": "श्री नेमिनाथ विधान",
    "category": "vidhan",
    "subCategory": "tirthankar-vidhan",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "shanti-vidhan-purnamati",
    "title": "शांति विधान",
    "category": "vidhan",
    "subCategory": "mahamandal-vidhan",
    "description": "अष्टद्रव्य पूजन एवं जयमाला"
  },
  {
    "id": "bhaktamar-vidhan",
    "title": "श्री भक्तामर महामण्डल विधान",
    "category": "vidhan",
    "subCategory": "mahamandal-vidhan",
    "description": "आचार्य मानतुंग विरचित ४८ काव्यों पर आधारित महामण्डल विधान एवं ४८ अर्घ्यावली"
  },
  {
    "id": "kalyanmandir-vidhan",
    "title": "श्री कल्याणमन्दिर महामण्डल विधान",
    "category": "vidhan",
    "subCategory": "mahamandal-vidhan",
    "description": "आचार्य कुमुदचन्द्र विरचित पार्श्वनाथ स्तुति पर आधारित ४४ अर्घ्य एवं जयमाला"
  },
  {
    "id": "navgraha-shanti-vidhan",
    "title": "श्री नवग्रह शांति निवारण विधान",
    "category": "vidhan",
    "subCategory": "mahamandal-vidhan",
    "description": "सूर्य, चन्द्र, मंगल, बुध, गुरु, शुक्र, शनि, राहु, केतु नवग्रह दोष निवारक तीर्थंकर विधान"
  },
  {
    "id": "rishi-mandal-vidhan",
    "title": "श्री ऋषिमण्डल महामण्डल विधान",
    "category": "vidhan",
    "subCategory": "mahamandal-vidhan",
    "description": "समस्त ऋद्धिधारी मुनियों, २४ तीर्थंकरों एवं गणधरों का मन्त्रमय महाविधान"
  },
  {
    "id": "solah-karan-vidhan",
    "title": "श्री सोलहकारण महामण्डल विधान",
    "category": "vidhan",
    "subCategory": "mahamandal-vidhan",
    "description": "दर्शनविशुद्धि आदि १६ भावनाओं की आराधना एवं तीर्थंकर प्रकृति बंध विधान"
  },
  {
    "id": "ratnatraya-vidhan",
    "title": "श्री रत्नत्रय महामण्डल विधान",
    "category": "vidhan",
    "subCategory": "mahamandal-vidhan",
    "description": "सम्यग्दर्शन, सम्यग्ज्ञान एवं सम्यक्चारित्र मोक्षमार्ग आराधना विधान"
  },
  {
    "id": "jinasahasranam-vidhan",
    "title": "श्री जिनसहस्रनाम महामण्डल विधान",
    "category": "vidhan",
    "subCategory": "mahamandal-vidhan",
    "description": "आचार्य जिनसेन विरचित १००८ जिनेंद्र नामों पर आधारित महाविधान"
  },
  {
    "id": "panchameru-vidhan",
    "title": "श्री पंचमेरु एवं नंदीश्वर महामण्डल विधान",
    "category": "vidhan",
    "subCategory": "mahamandal-vidhan",
    "description": "५ मेरु के ८० एवं नंदीश्वर द्वीप के ५२ अकृत्रिम जिनालयों का महाविधान"
  },
  {
    "id": "shrut-skandha-vidhan",
    "title": "श्री श्रुतस्कंध (जिनवाणी) महामण्डल विधान",
    "category": "vidhan",
    "subCategory": "mahamandal-vidhan",
    "description": "द्वादशांग जिनवाणी, चौदह पूर्व एवं समस्त आगम शास्त्रों की आराधना का महाविधान"
  },
  {
    "id": "karma-dahan-vidhan",
    "title": "श्री कर्म दहन महामण्डल विधान",
    "category": "vidhan",
    "subCategory": "mahamandal-vidhan",
    "description": "ज्ञानावरणी आदि आठों कर्मों के क्षय एवं आत्मा की मुक्ति हेतु महाविधान"
  },
  {
    "id": "bahubali-vidhan",
    "title": "श्री बाहुबली स्वामी महामण्डल विधान",
    "category": "vidhan",
    "subCategory": "mahamandal-vidhan",
    "description": "प्रथम कामदेव, घोर तपस्वी भगवान गोमटेश बाहुबली आराधना विधान"
  },
  {
    "id": "samavasharan-vidhan",
    "title": "श्री समवशरण महामण्डल विधान",
    "category": "vidhan",
    "subCategory": "mahamandal-vidhan",
    "description": "तीर्थंकर प्रभु के १२ दिव्य सभाओं से युक्त समवशरण महाविधान"
  },
  {
    "id": "padmavati-vidhan",
    "title": "श्री पद्मावती माता महामण्डल विधान",
    "category": "vidhan",
    "subCategory": "mahamandal-vidhan",
    "description": "पार्श्वनाथ शासन देवी पद्मावती आराधना, सुख-समृद्धि एवं शांति विधान"
  },
  {
    "id": "sarvatobhadra-vidhan",
    "title": "श्री सर्वतोभद्र महामण्डल विधान",
    "category": "vidhan",
    "subCategory": "mahamandal-vidhan",
    "description": "सर्व दिशाओं में मंगल एवं समस्त विघ्नों के शमन हेतु सर्वतोभद्र विधान"
  },
  {
    "id": "indradhwaj-vidhan",
    "title": "श्री इन्द्रध्वज महामण्डल विधान",
    "category": "vidhan",
    "subCategory": "mahamandal-vidhan",
    "description": "सौधर्मेन्द्र आदि देवों द्वारा आयोजित जैन परम्परा का सर्वोच्च महामण्डल विधान"
  },
  {
    "id": "chaubisi-vidhan",
    "title": "श्री चौबीस तीर्थंकर महामण्डल विधान",
    "category": "vidhan",
    "subCategory": "mahamandal-vidhan",
    "description": "भगवान ऋषभदेव से लेकर भगवान महावीर तक समुच्चय २४ तीर्थंकर महाविधान"
  },
  {
    "id": "bhaktamar-deep-archana-vidhan",
    "title": "श्री भक्तामर दीप अर्चना विधान",
    "category": "vidhan",
    "subCategory": "mahamandal-vidhan",
    "description": "४८ दीपकों से युक्त भक्तामर महाआरती व दीप अर्चना विधान"
  }
],
  stotra: [
  {
    "id": "ekibhav-stotra",
    "title": "एकीभाव स्तोत्र (संस्कृत व हिन्दी भावार्थ)",
    "category": "stotra",
    "subCategory": "pradhan-stotra",
    "description": "आचार्य वादिराज विरचित २६ पद्य स्तोत्र"
  },
  {
    "id": "bhaktamar-hindi-hemraj",
    "title": "भक्तामर स्तोत्र (हिन्दी)",
    "category": "stotra",
    "subCategory": "pradhan-stotra",
    "description": "पं. हेमराज जी विरचित हिन्दी पद्यानुवाद"
  },
  {
    "id": "bhaktamar-mahima",
    "title": "भक्तामर महिमा",
    "category": "stotra",
    "subCategory": "pradhan-stotra",
    "description": "भक्तामर स्तोत्र का इतिहास एवं प्रभाव"
  },
  {
    "id": "bhaktamar-riddhi-mantra",
    "title": "भक्तामर ऋद्धि मंत्र",
    "category": "stotra",
    "subCategory": "pradhan-stotra",
    "description": "४८ काव्यों के स्वतंत्र ऋद्धि-सिद्धि मंत्र"
  },
  {
    "id": "bhaktamar-stotra",
    "title": "भक्तामर स्तोत्र (संस्कृत व हिन्दी)",
    "category": "stotra",
    "subCategory": "pradhan-stotra",
    "author": "आचार्य मानतुंग स्वामी",
    "description": "आचार्य मानतुंग विरचित ४८ पद्य स्तोत्र (संस्कृत व हिन्दी भावार्थ)"
  },
  {
    "id": "brihat-shanti-stotra",
    "title": "बृहत् शांति स्तोत्र (बड़ी शांति)",
    "category": "stotra",
    "subCategory": "shanti-raksha",
    "description": "सर्व उपद्रव नाशक बृहत् शांति स्तोत्र"
  },
  {
    "id": "jinsahasranam-stotra",
    "title": "श्री जिनसहस्रनाम-स्तोत्रम्",
    "category": "stotra",
    "subCategory": "bhakti-stuti",
    "description": "आचार्य जिनसेन विरचित १००८ पावन नाम"
  },
  {
    "id": "kalyan-mandir-stotra",
    "title": "कल्याण मंदिर स्तोत्र",
    "category": "stotra",
    "subCategory": "pradhan-stotra",
    "description": "आचार्य कुमुदचन्द्र विरचित ४४ पद्य स्तोत्र"
  },
  {
    "id": "laghu-shanti-stotra",
    "title": "लघु शांति स्तोत्र",
    "category": "stotra",
    "subCategory": "shanti-raksha",
    "description": "दैनिक पाठ योग्य लघु शांति स्तोत्र"
  },
  {
    "id": "logassa-sutra",
    "title": "लोगस्स पाठ (चतुर्विंशति स्तव)",
    "category": "stotra",
    "subCategory": "bhakti-stuti",
    "description": "प्राकृत चतुर्विंशति स्तव"
  },
  {
    "id": "mahaveerashtak-stotra",
    "title": "महावीराष्टक-स्तोत्रम्",
    "category": "stotra",
    "subCategory": "bhakti-stuti",
    "description": "भगवान महावीर स्वामी की ८ पद्य स्तुति"
  },
  {
    "id": "parshvanath-stotra",
    "title": "श्री पार्श्वनाथ स्तोत्र",
    "category": "stotra",
    "subCategory": "shanti-raksha",
    "description": "भगवान पार्श्वनाथ स्तुति"
  },
  {
    "id": "ratnakar-pachisi",
    "title": "श्री रत्नाकर पच्चीसी",
    "category": "stotra",
    "subCategory": "bhakti-stuti",
    "description": "मुनि रत्नाकर विरचित २५ पद्य वैराग्य स्तुति"
  },
  {
    "id": "rishi-mandal-stotra",
    "title": "ऋषि मण्डल स्तोत्र",
    "category": "stotra",
    "subCategory": "shanti-raksha",
    "description": "समस्त सिद्ध व आचार्यों का मन्त्र स्तोत्र"
  },
  {
    "id": "santikaram-stotra",
    "title": "श्री संतिकरं स्तोत्र",
    "category": "stotra",
    "subCategory": "shanti-raksha",
    "description": "आचार्य मुनिचन्द्र विरचित प्राकृत शांति स्तोत्र"
  },
  {
    "id": "saraswati-stotra",
    "title": "श्री सरस्वती स्तोत्र",
    "category": "stotra",
    "subCategory": "bhakti-stuti",
    "description": "द्वादशांग जिनवाणी माता स्तुति"
  },
  {
    "id": "swayambhu-stotra",
    "title": "स्वयंभू स्तोत्र",
    "category": "stotra",
    "subCategory": "bhakti-stuti",
    "description": "आचार्य समन्तभद्र विरचित २४ तीर्थंकर स्तुति"
  },
  {
    "id": "tijay-pahutta-stotra",
    "title": "तिजयपहुत्त स्तोत्र",
    "category": "stotra",
    "subCategory": "bhakti-stuti",
    "description": "प्राकृत पार्श्वनाथ स्तोत्र"
  },
  {
    "id": "uvasaggaharam-stotra",
    "title": "उवसग्गहरं स्तोत्र",
    "category": "stotra",
    "subCategory": "shanti-raksha",
    "description": "सर्व विघ्न निवारक उवसग्गहरं स्तोत्र"
  },
  {
    "id": "namokar-mantra",
    "title": "णमोकार महामंत्र",
    "category": "stotra",
    "subCategory": "pradhan-stotra",
    "description": "अनादिनिधन पंच नमस्कार महामंत्र एवं फलश्रुति"
  }
],
  path: [
  {
    "id": "vishapahar-stotra",
    "title": "विषापहार स्तोत्र",
    "category": "path",
    "description": "महाकवि धनंजय विरचित ४४ पद्य स्तोत्र"
  },
  {
    "id": "aho-jagat-gurudev",
    "title": "देव-स्तुति",
    "category": "path",
    "description": "परम पूज्य जिनेंद्र देव स्तुति"
  },
  {
    "id": "alochana-path",
    "title": "आलोचना-पाठ",
    "category": "path",
    "description": "कविवर द्यानतराय विरचित प्रायश्चित्त पाठ"
  },
  {
    "id": "aradhana-path",
    "title": "आराधना पाठ",
    "category": "path",
    "description": "दर्शन, ज्ञान, चारित्र, तप - चार आराधना"
  },
  {
    "id": "barah-bhavana-raja-rana",
    "title": "बारह भावना (राजा राणा छत्रपति)",
    "category": "path",
    "description": "कविवर भूधरदास विरचित १२ भावना"
  },
  {
    "id": "barah-bhavana",
    "title": "बारह भावना",
    "category": "path",
    "description": "अनित्य आदि १२ वैराग्य भावनाएँ"
  },
  {
    "id": "darshan-path-hindi",
    "title": "दर्शन पाठ हिंदी",
    "category": "path",
    "description": "दैनिक जिनेंद्र दर्शन पाठ"
  },
  {
    "id": "darshan-path-sanskrit",
    "title": "दर्शन पाठ (संस्कृत)",
    "category": "path",
    "description": "संस्कृत दर्शन पाठ"
  },
  {
    "id": "dukh-haran-vinati",
    "title": "दुःख हरण विनती",
    "category": "path",
    "description": "दुःख हरण जिनेंद्र विनती"
  },
  {
    "id": "jinvani-stuti",
    "title": "जिनवाणी स्तुति",
    "category": "path",
    "description": "द्वादशांग जिनवाणी स्तुति"
  },
  {
    "id": "laghu-pratikraman",
    "title": "लघु प्रतिक्रमण",
    "category": "path",
    "description": "दैनिक पाप शुद्धि प्रतिक्रमण"
  },
  {
    "id": "main-tum-charan-kamal",
    "title": "स्तुति- मैं तुम चरण-कमल गुण गाय",
    "category": "path",
    "description": "मैं तुम चरण-कमल गुण गाय - स्तुति"
  },
  {
    "id": "mangalashtak",
    "title": "मंगलाष्टक",
    "category": "path",
    "description": "आद्यो धर्मकरो जिनः - मंगलाष्टक"
  },
  {
    "id": "mata-tu-daya-karke",
    "title": "जिनवाणी स्तुति (माता तू दया करके)",
    "category": "path",
    "description": "माता तू दया करके - जिनवाणी वंदना"
  },
  {
    "id": "meri-bhavana-jugal",
    "title": "मेरी भावना",
    "category": "path",
    "description": "पं. जुगलकिशोर जी विरचित"
  },
  {
    "id": "meri-bhavana",
    "title": "मेरी भावना",
    "category": "path",
    "description": "पं. जुगलकिशोर जी विरचित अमर भावना"
  },
  {
    "id": "nirvan-kand",
    "title": "निर्वाण कांड भाषा",
    "category": "path",
    "description": "कविवर भैया भगवतीदास विरचित सिद्धक्षेत्र वंदना"
  },
  {
    "id": "prabhu-patit-pavan",
    "title": "स्तुति (प्रभु पतित पावन)",
    "category": "path",
    "description": "प्रभु पतित पावन मैं अपावन - दैन्य प्रार्थना"
  },
  {
    "id": "samadhi-bhavana",
    "title": "समाधि भावना",
    "category": "path",
    "description": "आत्म-शांति एवं समाधि भावना"
  },
  {
    "id": "samadhi-maran-path",
    "title": "समाधि-मरण पाठ",
    "category": "path",
    "description": "संथारा एवं समाधि मरण पाठ"
  },
  {
    "id": "samayik-path",
    "title": "सामायिक पाठ",
    "category": "path",
    "description": "आचार्य अमितगति विरचित सामायिक पाठ"
  },
  {
    "id": "sankat-mochan-vinati",
    "title": "संकट मोचन विनती",
    "category": "path",
    "description": "संकट मोचन पार्श्वनाथ विनती"
  },
  {
    "id": "siddha-bhakti",
    "title": "सिद्ध भक्ति (प्राकृत)",
    "category": "path",
    "description": "प्राकृत सिद्ध भक्ति पाठ"
  },
  {
    "id": "siddhachakra-stuti",
    "title": "श्री सिद्धचक्र की स्तुति",
    "category": "path",
    "description": "सिद्धचक्र नवपद स्तुति"
  },
  {
    "id": "vairagya-bhavana",
    "title": "वैराग्य भावना",
    "category": "path",
    "description": "आत्म-बोधक वैराग्य भावना"
  }
],
  granthas: [
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
    "subCategory": "charananuyoga",
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
    "subCategory": "karananuyoga",
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
