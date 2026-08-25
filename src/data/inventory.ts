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
    { id: 'tirthankar-vidhan', label: '२४ तीर्थंकर विधान', description: 'आदिनाथ से महावीर स्वामी तक २४ तीर्थंकर विधान' },
    { id: 'mahamandal-vidhan', label: 'महामंडल विधान', description: 'सिद्धचक्र, दशलक्षण, कल्पतरु एवं शांति विधान' },
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
  ]
};

export const contentInventory: Record<string, ContentItem[]> = {
  aarti: [
    { id: 'jain-aarti', title: 'जैन मंगल आरती', category: 'aarti', description: 'पंच परमेष्ठी एवं जिनेंद्र मंगल आरती' },
    { id: 'adinath-aarti', title: 'श्री आदिनाथ आरती', category: 'aarti', description: 'प्रथम तीर्थंकर ऋषभदेव आरती' },
    { id: 'parshvanath-aarti', title: 'श्री पार्श्वनाथ आरती', category: 'aarti', description: '२३वें तीर्थंकर पार्श्वनाथ आरती' },
    { id: 'mahavir-aarti', title: 'श्री महावीर आरती', category: 'aarti', description: '२४वें तीर्थंकर महावीर स्वामी आरती' },
    { id: 'shantinath-aarti', title: 'श्री शांतिनाथ आरती', category: 'aarti', description: '१६वें तीर्थंकर शांतिनाथ आरती' },
    { id: 'padmavati-aarti', title: 'श्री पद्मावती माता आरती', category: 'aarti', description: 'शासन देवी पद्मावती माता आरती' },
    { id: 'nakoda-bhairav-aarti', title: 'श्री नाकोड़ा भैरव आरती', category: 'aarti', description: 'नाकोड़ा पार्श्वनाथ भैरव आरती' },
    { id: 'jinvani-aarti', title: 'श्री जिनवाणी आरती', category: 'aarti', description: 'द्वादशांग जिनवाणी माता आरती' },
    { id: 'guru-aarti', title: 'श्री गुरु महाराज आरती', category: 'aarti', description: 'परम पूज्य गुरुदेव वंदना आरती' },
    { id: 'mangal-aarti', title: 'मंगल आरती', category: 'aarti', description: 'सर्व विघ्न नाशक मंगल दीप आरती' },
    { id: 'adinath-arti', title: 'श्री आदिनाथ भगवान आरती', category: 'aarti', description: 'ऋषभ जिनेन्द्र आरती' },
    { id: 'bahubali-arti', title: 'श्री बाहुबली स्वामी आरती', category: 'aarti', description: 'गोमटेश बाहुबली स्वामी आरती' },
    { id: 'chandraprabhu-arti', title: 'जय चंद्रप्रभु देवा', category: 'aarti', description: '८वें तीर्थंकर चंद्रप्रभ भगवान आरती' },
    { id: 'chaubiso-bhagwan-arti', title: 'चौबीसों भगवान की आरती', category: 'aarti', description: '२४ जिनेंद्र देव सामूहिक आरती' },
    { id: 'dhoop-arti', title: 'धूप आरती', category: 'aarti', description: 'दशांग धूप समर्पण आरती' },
    { id: 'jin-padam-arti', title: 'आरती श्री जिन पदम तुम्हारी', category: 'aarti', description: 'पद्मप्रभ भगवान आरती' },
    { id: 'jinraj-arti', title: 'आरती श्री जिनराज तिहारी', category: 'aarti', description: 'जिनराज देव आरती' },
    { id: 'jinvani-mata-arti', title: 'श्री जिनवाणी माता की आरती', category: 'aarti', description: 'ज्ञानदायिनी सरस्वती जिनवाणी आरती' },
    { id: 'mahavir-swami-arti', title: 'श्री महावीर स्वामी की आरती', category: 'aarti', description: 'अंतिम तीर्थंकर महावीर आरती' },
    { id: 'munisuvratnath-arti', title: 'श्री मुनिसुव्रतनाथ भगवान की आरती', category: 'aarti', description: '२०वें तीर्थंकर मुनिसुव्रतनाथ आरती' },
    { id: 'padmaprabhu-arti', title: 'श्री पद्मप्रभु की आरती (बाड़ा)', category: 'aarti', description: 'पद्मप्रभ दिगम्बर जैन अतिशय क्षेत्र' },
    { id: 'panch-parmeshthi-arti', title: 'पंच परमेष्ठी की आरती', category: 'aarti', description: 'अरिहंत, सिद्ध, आचार्य, उपाध्याय, साधु आरती' },
    { id: 'parshvanath-arti', title: 'श्री पार्श्वनाथ स्वामी आरती', category: 'aarti', description: 'कमठ मान मर्दन पार्श्वनाथ आरती' },
    { id: 'shantinath-arti', title: 'श्री शान्तिनाथ भगवान की आरती', category: 'aarti', description: 'शांति प्रदाता शांतिनाथ आरती' },
    { id: 'tum-se-laagi-lagan', title: 'तुम से लागी लगन', category: 'aarti', description: 'प्रभु भक्ति समर्पण आरती' },
  ],
  bhajan: [
    { id: 'ae-malik-tere-bande-hum', title: 'ऐ मालिक तेरे बंदे हम', category: 'bhajan' },
    { id: 'baba-tere-charno-ki', title: 'बाबा तेरे चरणों की', category: 'bhajan' },
    { id: 'baje-kundalpur-mein-badhai', title: 'बजे कुण्डलपुर में बधाई', category: 'bhajan' },
    { id: 'bhagwan-meri-naiya', title: 'भगवान मेरी नैया उस पार लगा देना', category: 'bhajan' },
    { id: 'chalo-tijara-jaana-hai', title: 'चलो तिजारा जाना है', category: 'bhajan' },
    { id: 'daya-kar-daan-bhakti-ka', title: 'दया कर दान भक्ति का', category: 'bhajan' },
    { id: 'guruvar-ke-charno-mein', title: 'गुरुवर के चरणो में', category: 'bhajan' },
    { id: 'hey-veer-tumhare-dware-par', title: 'हे वीर तुम्हारे द्वारे पर', category: 'bhajan' },
    { id: 'hum-ko-man-ki-shakti-dena', title: 'हमको मन की शक्ति देना', category: 'bhajan' },
    { id: 'is-duniya-mein-sabse-sachcha', title: 'इस दुनिया में सबसे सच्चा', category: 'bhajan' },
    { id: 'itni-shakti-hamein-dena-data', title: 'इतनी शक्ति हमें देना दाता', category: 'bhajan' },
    { id: 'jab-koi-nahi-aata', title: 'जब कोई नहीं आता मेरे बाबा आते है', category: 'bhajan' },
    { id: 'jab-se-guru-darsh-mila', title: 'जब से गुरु दर्श मिला', category: 'bhajan' },
    { id: 'jai-gomtesh-jai-bahubali', title: 'जय गोमटेश जय बाहुबली', category: 'bhajan' },
    { id: 'jai-jinendra-bolie', title: 'जय जिनेन्द्र बोलिए', category: 'bhajan' },
    { id: 'jain-dharm-ke-heere-moti', title: 'जैन धर्म के हीरे मोती', category: 'bhajan' },
    { id: 'jinvani-amrit-rasat', title: 'जिनवाणी अमृत रसात', category: 'bhajan' },
    { id: 'jivan-hai-pani-ki-bund', title: 'जीवन है पानी की बूँद', category: 'bhajan' },
    { id: 'junagadh-mein-saj-gaye', title: 'जूनागढ़ में सज गए देखो', category: 'bhajan' },
    { id: 'kabhi-veer-ban-ke', title: 'कभी वीर बनके महावीर बनके', category: 'bhajan' },
    { id: 'kesariya-kesariya', title: 'केसरिया केसरिया', category: 'bhajan' },
    { id: 'madhuban-ke-mandiron-mein', title: 'मधुबन के मंदिरों में', category: 'bhajan' },
    { id: 'mahaveer-tere-hi-naam-se', title: 'महावीर तेरे ही नाम से', category: 'bhajan' },
    { id: 'mantra-namokar-hamein-prano-se-pyara', title: 'मंत्र णमोकार हमें प्राणों से प्यारा', category: 'bhajan' },
    { id: 'mera-aapki-kripa-se', title: 'मेरा आपकी कृपा से', category: 'bhajan' },
    { id: 'mera-rom-rom-harshaya', title: 'मेरे रोम रोम हर्षाया', category: 'bhajan' },
    { id: 'meri-bhavna', title: 'मेरी भावना (पारंपरिक)', category: 'bhajan' },
    { id: 'naam-hai-tera-taran-hara', title: 'नाम है तेरा तारण हारा', category: 'bhajan' },
    { id: 'o-gurusa-thoro-chelo-banu-mai', title: 'ओ गुरूसा ..थोरो चेलो बनु मै', category: 'bhajan' },
    { id: 'o-jagat-ke-shanti-data', title: 'ओ जगत के शांति दाता', category: 'bhajan' },
    { id: 'palken-hi-palken', title: 'पलकें ही पलकें हम बिछाएंगे', category: 'bhajan' },
    { id: 'phoolon-ka-taron-ka', title: 'फूलों का तारों का सबका कहना है', category: 'bhajan' },
    { id: 'rang-ma-rang-ma', title: 'रंग मा रंग मा रंग मा रे', category: 'bhajan' },
    { id: 'saj-dhaj-kar-jis-din', title: 'सज धज कर जिस दिन', category: 'bhajan' },
    { id: 'sare-tirath-dham', title: 'सारे तीरथ धाम आपके चरणों में', category: 'bhajan' },
    { id: 'subha-savere-le-kar-tera-naam', title: 'सुबह सवेरे लेकर तेरा नाम प्रभु', category: 'bhajan' },
    { id: 'tere-paanch-hue-kalyan', title: 'तेरे पाँच हुए कल्याण प्रभु', category: 'bhajan' },
    { id: 'tu-pyar-ka-sagar-hai', title: 'तु प्यार का सागर है', category: 'bhajan' },
    { id: 'tumhi-ho-mata-pita', title: 'तुम्ही हो माता पिता तुम्ही हो', category: 'bhajan' },
    { id: 'unche-unche-shikharo-wala', title: 'ऊंचे ऊंचे शिखरों वाला', category: 'bhajan' },
    { id: 'ye-dharam-hai-aatam-gyani-ka', title: 'ये धरम है आतम ज्ञानी का', category: 'bhajan' },
    { id: 'tu-mane-bhagwan-ek-vardan', title: 'तू माने भगवान एक वरदान', category: 'bhajan' },
    { id: 'maitri-bhav', title: 'मैत्री भाव', category: 'bhajan' },
  ],
  chalisa: [
    { id: 'adinath-chalisa', title: 'श्री आदिनाथ चालीसा', category: 'chalisa', subCategory: 'tirthankar-chalisa', badge: '१. प्रथम तीर्थंकर' },
    { id: 'ajitnath-chalisa', title: 'श्री अजितनाथ चालीसा', category: 'chalisa', subCategory: 'tirthankar-chalisa', badge: '२. द्वितीय तीर्थंकर' },
    { id: 'sambhavnath-chalisa', title: 'श्री संभवनाथ चालीसा', category: 'chalisa', subCategory: 'tirthankar-chalisa', badge: '३. तृतीय तीर्थंकर' },
    { id: 'abhinandannath-chalisa', title: 'श्री अभिनंदननाथ चालीसा', category: 'chalisa', subCategory: 'tirthankar-chalisa', badge: '४. चतुर्थ तीर्थंकर' },
    { id: 'sumatinath-chalisa', title: 'श्री सुमतिनाथ चालीसा', category: 'chalisa', subCategory: 'tirthankar-chalisa', badge: '५. पंचम तीर्थंकर' },
    { id: 'padmaprabhu-chalisa', title: 'श्री पद्मप्रभु चालीसा', category: 'chalisa', subCategory: 'tirthankar-chalisa', badge: '६. षष्ठम तीर्थंकर' },
    { id: 'suparshvanath-chalisa', title: 'श्री सुपार्श्वनाथ चालीसा', category: 'chalisa', subCategory: 'tirthankar-chalisa', badge: '७. सप्तम तीर्थंकर' },
    { id: 'chandraprabhu-chalisa', title: 'श्री चन्द्रप्रभु चालीसा', category: 'chalisa', subCategory: 'tirthankar-chalisa', badge: '८. अष्टम तीर्थंकर' },
    { id: 'pushpadanta-chalisa', title: 'श्री पुष्पदन्त चालीसा', category: 'chalisa', subCategory: 'tirthankar-chalisa', badge: '९. नवम तीर्थंकर' },
    { id: 'sheetalnath-chalisa', title: 'श्री शीतलनाथ चालीसा', category: 'chalisa', subCategory: 'tirthankar-chalisa', badge: '१०. दशम तीर्थंकर' },
    { id: 'shreyansnath-chalisa', title: 'श्री श्रेयांसनाथ चालीसा', category: 'chalisa', subCategory: 'tirthankar-chalisa', badge: '११. एकादश तीर्थंकर' },
    { id: 'vasupujya-chalisa', title: 'श्री वासुपूज्य चालीसा', category: 'chalisa', subCategory: 'tirthankar-chalisa', badge: '१२. द्वादश तीर्थंकर' },
    { id: 'vimalnath-chalisa', title: 'श्री विमलनाथ चालीसा', category: 'chalisa', subCategory: 'tirthankar-chalisa', badge: '१३. त्रयोदश तीर्थंकर' },
    { id: 'anantnath-chalisa', title: 'श्री अनन्तनाथ चालीसा', category: 'chalisa', subCategory: 'tirthankar-chalisa', badge: '१४. चतुर्दश तीर्थंकर' },
    { id: 'dharmanath-chalisa', title: 'श्री धर्मनाथ चालीसा', category: 'chalisa', subCategory: 'tirthankar-chalisa', badge: '१५. पंचदश तीर्थंकर' },
    { id: 'shantinath-chalisa', title: 'श्री शान्तिनाथ चालीसा', category: 'chalisa', subCategory: 'tirthankar-chalisa', badge: '१६. षोडश तीर्थंकर' },
    { id: 'kunthunath-chalisa', title: 'श्री कुन्थुनाथ चालीसा', category: 'chalisa', subCategory: 'tirthankar-chalisa', badge: '१७. सप्तदश तीर्थंकर' },
    { id: 'aranath-chalisa', title: 'श्री अरहनाथ चालीसा', category: 'chalisa', subCategory: 'tirthankar-chalisa', badge: '१८. अष्टादश तीर्थंकर' },
    { id: 'mallinath-chalisa', title: 'श्री मल्लिनाथ चालीसा', category: 'chalisa', subCategory: 'tirthankar-chalisa', badge: '१९. एकोनविंश तीर्थंकर' },
    { id: 'munisuvratnath-chalisa', title: 'श्री मुनिसुव्रतनाथ चालीसा', category: 'chalisa', subCategory: 'tirthankar-chalisa', badge: '२०. विंशति तीर्थंकर' },
    { id: 'naminath-chalisa', title: 'श्री नमिनाथ चालीसा', category: 'chalisa', subCategory: 'tirthankar-chalisa', badge: '२१. एकविंशति तीर्थंकर' },
    { id: 'neminath-chalisa', title: 'श्री नेमिनाथ चालीसा', category: 'chalisa', subCategory: 'tirthankar-chalisa', badge: '२२. द्वाविंशति तीर्थंकर' },
    { id: 'parshvanath-chalisa', title: 'श्री पार्श्वनाथ चालीसा', category: 'chalisa', subCategory: 'tirthankar-chalisa', badge: '२३. त्रयोविंशति तीर्थंकर' },
    { id: 'mahavir-chalisa', title: 'श्री महावीर चालीसा', category: 'chalisa', subCategory: 'tirthankar-chalisa', badge: '२४. चतुर्विंशति तीर्थंकर' },
    { id: 'namokar-chalisa', title: 'णमोकार महामंत्र चालीसा', category: 'chalisa', subCategory: 'vishesh-chalisa', badge: 'महामंत्र' },
    { id: 'simandhar-chalisa', title: 'श्री सीमंधर स्वामी चालीसा', category: 'chalisa', subCategory: 'vishesh-chalisa', badge: 'विदेह तीर्थंकर' },
    { id: 'jinendra-chalisa', title: 'श्री जिनेन्द्र चालीसा', category: 'chalisa', subCategory: 'vishesh-chalisa', badge: 'जिनेंद्र' },
  ],
  puja: [
    // ----------------- 1. नित्य पूजन क्रम (दैनिक देव पूजा अनुक्रम) -----------------
    {
      id: 'puja-vidhi-prarambh',
      title: 'पूजा विधि प्रारम्भ',
      category: 'puja',
      subCategory: 'daily-flow',
      order: 1,
      badge: 'चरण ०१ • पवित्रीकरण',
      description: 'अभिषेक व पूजन प्रारम्भ, पवित्रीकरण, स्वस्तिवाचन एवं दिग्बन्धन मन्त्र'
    },
    {
      id: 'puja-pratigya-path',
      title: 'पूजा प्रतिज्ञा पाठ (संकल्प)',
      category: 'puja',
      subCategory: 'daily-flow',
      order: 2,
      badge: 'चरण ०२ • संकल्प',
      description: 'स्वस्ति श्री जम्बूद्वीपे भरतक्षेत्रे... नित्य देव पूजा प्रतिज्ञा संकल्प'
    },
    {
      id: 'vinay-path',
      title: 'विनय पाठ',
      category: 'puja',
      subCategory: 'daily-flow',
      order: 3,
      badge: 'चरण ०३ • विनय वंदना',
      description: 'सकल ज्ञेय ज्ञायक जयवंत... विमल प्रकाशक जिनवर संत'
    },
    {
      id: 'samuchay-pujan',
      title: 'समुच्चय पूजन',
      category: 'puja',
      subCategory: 'daily-flow',
      order: 4,
      badge: 'चरण ०४ • स्थापना व द्रव्य',
      description: 'देव-शास्त्र-गुरु की पावन स्थापना एवं अष्टद्रव्य समर्पण'
    },
    {
      id: 'dev-shastra-guru-puja-dyanat',
      title: 'श्री देव-शास्त्र-गुरु पूजा (द्यानत राय)',
      category: 'puja',
      subCategory: 'daily-flow',
      order: 5,
      badge: 'चरण ०५ • देव शास्त्र गुरु',
      author: 'कविवर द्यानतराय',
      description: 'द्यानत राय कृत - देव-शास्त्र-गुरु अष्टद्रव्य पूजन एवं जयमाला'
    },
    {
      id: 'dev-shastra-guru-puja-jugal',
      title: 'श्री देव-शास्त्र-गुरु पूजा (जुगल किशोर)',
      category: 'puja',
      subCategory: 'daily-flow',
      order: 6,
      badge: 'चरण ०६ • देव शास्त्र गुरु',
      author: 'पं. जुगलकिशोर जी',
      description: 'परम पूज्य देव-शास्त्र-गुरु सरल हिंदी काव्य पूजन'
    },
    {
      id: 'chaubis-tirthankar-puja',
      title: 'श्री चौबीस तीर्थंकर पूजा',
      category: 'puja',
      subCategory: 'daily-flow',
      order: 7,
      badge: 'चरण ०७ • २४ तीर्थंकर',
      description: 'ऋषभदेव से महावीर स्वामी तक सम्पूर्ण चौबीस जिनेंद्र भगवान पूजा'
    },
    {
      id: 'panch-parmeshthi-puja',
      title: 'श्री पंच परमेष्ठी पूजा',
      category: 'puja',
      subCategory: 'daily-flow',
      order: 8,
      badge: 'चरण ०८ • पंच परमेष्ठी',
      description: 'अरिहंत, सिद्ध, आचार्य, उपाध्याय एवं सर्व साधु अष्टद्रव्य पूजन'
    },
    {
      id: 'navdevata-puja',
      title: 'श्री नवदेवता पूजा',
      category: 'puja',
      subCategory: 'daily-flow',
      order: 9,
      badge: 'चरण ०९ • नवदेवता',
      description: 'पंच परमेष्ठी, जिनधर्म, जिन आगम, जिन चैत्य एवं चैत्यालय पूजन'
    },
    {
      id: 'siddha-pujan',
      title: 'श्री सिद्ध पूजन',
      category: 'puja',
      subCategory: 'daily-flow',
      order: 10,
      badge: 'चरण १० • सिद्ध भगवान',
      description: 'आठों कर्मों से विमुक्त सिद्धशिला-विराजीत सिद्ध परमेष्ठी पूजन'
    },
    {
      id: '20-teerthankar-puja',
      title: 'श्री विद्यमान बीस तीर्थंकर पूजा',
      category: 'puja',
      subCategory: 'daily-flow',
      order: 11,
      badge: 'चरण ११ • विदेह तीर्थंकर',
      description: 'विदेह क्षेत्र में साक्षात् विचरते सीमंधर स्वामी आदि बीस तीर्थंकर पूजा'
    },
    {
      id: 'vidyman-vimshati-tirthankar-pujan',
      title: 'श्री विद्यमान विंशति तीर्थंकर पूजन',
      category: 'puja',
      subCategory: 'daily-flow',
      order: 12,
      badge: 'चरण १२ • विंशति तीर्थंकर',
      description: 'विद्यमान विंशति तीर्थंकर विस्तृत पूजन एवं स्तुति'
    },
    {
      id: 'arghyavali',
      title: 'अर्घ्यावली (२४ तीर्थंकर अर्घ्य)',
      category: 'puja',
      subCategory: 'daily-flow',
      order: 13,
      badge: 'चरण १३ • सम्पूर्ण अर्घ्यावली',
      description: 'आदिनाथ से महावीर स्वामी तक सभी २४ तीर्थंकरों के स्वतंत्र व सामूहिक अर्घ्य'
    },
    {
      id: 'panch-parmeshthi-argh',
      title: 'पंच परमेष्ठि अर्घ',
      category: 'puja',
      subCategory: 'daily-flow',
      order: 14,
      badge: 'चरण १४ • परमेष्ठि अर्घ',
      description: 'पंच परमेष्ठी भगवंतों को समर्पित समुच्चय अर्घ्य'
    },
    {
      id: 'maha-argh',
      title: 'महा अर्घ',
      category: 'puja',
      subCategory: 'daily-flow',
      order: 15,
      badge: 'चरण १५ • महा अर्घ',
      description: 'समस्त जिनेंद्र देवों को समर्पित अष्टद्रव्य महा अर्घ्य'
    },
    {
      id: 'shanti-path',
      title: 'शांति पाठ',
      category: 'puja',
      subCategory: 'daily-flow',
      order: 16,
      badge: 'चरण १६ • शांति पाठ',
      description: 'शान्ति जिनन्दं जगद्गुरुं च... विश्व शान्ति एवं आत्म-शान्ति पाठ'
    },
    {
      id: 'visarjan-path',
      title: 'विसर्जन पाठ',
      category: 'puja',
      subCategory: 'daily-flow',
      order: 17,
      badge: 'चरण १७ • विसर्जन व पुष्पांजलि',
      description: 'देव-आह्वान विसर्जन एवं पुष्पांजलि समर्पण'
    },

    // ----------------- 2. तीर्थंकर पूजाएँ -----------------
    {
      id: 'adinath-chandkhedi-puja',
      title: 'श्री आदिनाथ जिन पूजा (चाँदखेड़ी)',
      category: 'puja',
      subCategory: 'tirthankar',
      badge: '१. प्रथम तीर्थंकर',
      description: 'अतिशय क्षेत्र चाँदखेड़ी आदिनाथ भगवान पूजन'
    },
    {
      id: 'adinath-puja-jineshwardas',
      title: 'श्री आदिनाथ जिन पूजा (जिनेश्वरदास)',
      category: 'puja',
      subCategory: 'tirthankar',
      badge: '१. प्रथम तीर्थंकर',
      author: 'जिनेश्वरदास',
      description: 'प्रथम तीर्थंकर ऋषभदेव जिन पूजा'
    },
    {
      id: 'sumatinath-puja',
      title: 'श्री सुमतिनाथ जिन पूजन',
      category: 'puja',
      subCategory: 'tirthankar',
      badge: '५. पंचम तीर्थंकर',
      description: '५वें तीर्थंकर सुमतिनाथ भगवान पूजन'
    },
    {
      id: 'padmaprabh-puja',
      title: 'श्री पद्मप्रभ जिन पूजा',
      category: 'puja',
      subCategory: 'tirthankar',
      badge: '६. षष्ठम तीर्थंकर',
      description: '६वें तीर्थंकर पद्मप्रभ जिन पूजा'
    },
    {
      id: 'chandraprabh-dehra-puja',
      title: 'श्री चंद्रप्रभु जी पूजा - देहरा (तिजारा)',
      category: 'puja',
      subCategory: 'tirthankar',
      badge: '८. अष्टम तीर्थंकर',
      description: 'अतिशय क्षेत्र तिजारा देहरा चंद्रप्रभ पूजन'
    },
    {
      id: 'chandraprabh-puja',
      title: 'श्री चंद्रप्रभ जिन पूजा',
      category: 'puja',
      subCategory: 'tirthankar',
      badge: '८. अष्टम तीर्थंकर',
      description: '८वें तीर्थंकर चंद्रप्रभ भगवान पूजन'
    },
    {
      id: 'pushpadanta-puja',
      title: 'श्री पुष्पदंत जिन पूजन',
      category: 'puja',
      subCategory: 'tirthankar',
      badge: '९. नवम तीर्थंकर',
      description: '९वें तीर्थंकर पुष्पदंत (सुविधिनाथ) पूजन'
    },
    {
      id: 'sheetalnath-puja',
      title: 'श्री शीतलनाथ जिन पूजन',
      category: 'puja',
      subCategory: 'tirthankar',
      badge: '१०. दशम तीर्थंकर',
      description: '१०वें तीर्थंकर शीतलनाथ भगवान पूजन'
    },
    {
      id: 'vasupujya-puja',
      title: 'श्री वासुपूज्य जिन पूजन',
      category: 'puja',
      subCategory: 'tirthankar',
      badge: '१२. द्वादश तीर्थंकर',
      description: '१२वें तीर्थंकर वासुपूज्य भगवान पूजन'
    },
    {
      id: 'vimalnath-puja',
      title: 'श्री विमलनाथ जिन पूजन',
      category: 'puja',
      subCategory: 'tirthankar',
      badge: '१३. त्रयोदश तीर्थंकर',
      description: '१३वें तीर्थंकर विमलनाथ भगवान पूजन'
    },
    {
      id: 'anantanath-puja',
      title: 'श्री अनंतनाथ जिन पूजन',
      category: 'puja',
      subCategory: 'tirthankar',
      badge: '१४. चतुर्दश तीर्थंकर',
      description: '१४वें तीर्थंकर अनंतनाथ भगवान पूजन'
    },
    {
      id: 'shantinath-puja-bakhtawar',
      title: 'श्री शांतिनाथ जिन पूजा (बख्तावर सिंह)',
      category: 'puja',
      subCategory: 'tirthankar',
      badge: '१६. षोडश तीर्थंकर',
      author: 'पं. बख्तावर सिंह',
      description: '१६वें तीर्थंकर शांतिनाथ भगवान पूजन'
    },
    {
      id: 'kunthunath-puja',
      title: 'श्री कुन्थुनाथ जिन पूजन',
      category: 'puja',
      subCategory: 'tirthankar',
      badge: '१७. सप्तदश तीर्थंकर',
      description: '१७वें तीर्थंकर कुन्थुनाथ भगवान पूजन'
    },
    {
      id: 'munisuvrat-puja',
      title: 'श्री मुनिसुव्रत जिन पूजन',
      category: 'puja',
      subCategory: 'tirthankar',
      badge: '२०. विंशति तीर्थंकर',
      description: '२०वें तीर्थंकर मुनिसुव्रतनाथ भगवान पूजन'
    },
    {
      id: 'neminath-puja',
      title: 'श्री नेमिनाथ जिन पूजन',
      category: 'puja',
      subCategory: 'tirthankar',
      badge: '२२. द्वाविंशति तीर्थंकर',
      description: '२२वें तीर्थंकर नेमिनाथ भगवान पूजन'
    },
    {
      id: 'parshvanath-puja-bakhtawar',
      title: 'श्री पार्श्वनाथ जिन पूजा (बख्तावर सिंह)',
      category: 'puja',
      subCategory: 'tirthankar',
      badge: '२३. त्रयोविंशति तीर्थंकर',
      author: 'पं. बख्तावर सिंह',
      description: '२३वें तीर्थंकर पार्श्वनाथ भगवान पूजन'
    },
    {
      id: 'mahavir-puja-vrindavan',
      title: 'श्री महावीर जिन पूजा (वृन्दावनदास)',
      category: 'puja',
      subCategory: 'tirthankar',
      badge: '२४. चतुर्विंशति तीर्थंकर',
      author: 'पं. वृन्दावनदास',
      description: '२४वें तीर्थंकर महावीर स्वामी पूजन'
    },
    {
      id: 'bahubali-puja',
      title: 'श्री बाहुबली पूजा',
      category: 'puja',
      subCategory: 'tirthankar',
      badge: 'प्रथम कामदेव',
      description: 'भगवान बाहुबली (गोमटेश्वर) पूजन'
    },
    {
      id: '24-tirthankar-swasti-path',
      title: '२४ तीर्थंकर स्वस्ति पाठ',
      category: 'puja',
      subCategory: 'tirthankar',
      badge: 'चौबीसी स्तुति',
      description: 'चौबीसों तीर्थंकरों का कल्याणकारी स्वस्ति पाठ'
    },

    // ----------------- 3. पर्व एवं व्रत पूजाएँ -----------------
    {
      id: 'daslakshan-dharma-puja',
      title: 'दशलक्षण-धर्म पूजा',
      category: 'puja',
      subCategory: 'parva-vrat',
      badge: 'दशलक्षण महापर्व',
      author: 'कविवर द्यानतराय',
      description: 'उत्तम क्षमादि १० धर्मों की पावन अष्टद्रव्य पूजा एवं जयमाला'
    },
    {
      id: 'solah-karan-puja',
      title: 'सोलहकारण पूजा',
      category: 'puja',
      subCategory: 'parva-vrat',
      badge: 'भाद्रपद पर्व',
      description: 'तीर्थंकर प्रकृति बंध कराने वाली १६ भावनाओं की पूजा'
    },
    {
      id: 'ratnatraya-puja',
      title: 'रत्नत्रय पूजा',
      category: 'puja',
      subCategory: 'parva-vrat',
      badge: 'रत्नत्रय महापर्व',
      description: 'सम्यग्दर्शन, सम्यग्ज्ञान एवं सम्यक्चारित्र त्रय पूजन'
    },
    {
      id: 'nandishwar-dweep-puja',
      title: 'श्री नंदीश्वर-द्वीप पूजा',
      category: 'puja',
      subCategory: 'parva-vrat',
      badge: 'अष्टान्हिका पर्व',
      description: 'अष्टम द्वीप नंदीश्वर के ५२ अकृत्रिम चैत्यालय पूजन'
    },
    {
      id: 'panchmeru-puja',
      title: 'श्री पंचमेरु पूजा',
      category: 'puja',
      subCategory: 'parva-vrat',
      badge: 'पंचमेरु पूजन',
      description: 'सुदर्शन आदि पाँच मेरु सम्बन्धी ८० अकृत्रिम जिनालय पूजन'
    },
    {
      id: 'sugandh-dashami-puja',
      title: 'सुगंध दशमी पूजा',
      category: 'puja',
      subCategory: 'parva-vrat',
      badge: 'सुगंध दशमी',
      description: 'भाद्रपद शुक्ल दशमी धूप खेवना एवं सुगंध दशमी पूजा'
    },
    {
      id: 'deepmalika-parv-pujan',
      title: 'दीपमालिका पर्व पूजन (दीपावली)',
      category: 'puja',
      subCategory: 'parva-vrat',
      badge: 'दीपावली',
      description: 'कार्तिक अमावस्या भगवान महावीर निर्वाण कल्याणक पूजन'
    },
    {
      id: 'kshamavani-parv-puja',
      title: 'क्षमावाणी पर्व पूजा',
      category: 'puja',
      subCategory: 'parva-vrat',
      badge: 'क्षमावाणी पर्व',
      description: 'उत्तम क्षमा एवं विश्व क्षमापना पूजन'
    },
    {
      id: 'rakshabandhan-parv-pujan',
      title: 'रक्षाबन्धन पर्व पूजन',
      category: 'puja',
      subCategory: 'parva-vrat',
      badge: 'रक्षाबन्धन पर्व',
      description: 'अकंपनाचार्य आदि ७०० मुनि उपसर्ग निवारण व वात्सल्य पूजन'
    },
    {
      id: 'akshaya-tritiya-puja',
      title: 'अक्षय-तृतीया पूजा',
      category: 'puja',
      subCategory: 'parva-vrat',
      badge: 'अक्षय तृतीया',
      description: 'भगवान ऋषभदेव प्रथम आहार दान एवं दान तीर्थ पूजन'
    },
    {
      id: 'ashtanhika-vrat-puja',
      title: 'अष्टान्हिका व्रत पूजा',
      category: 'puja',
      subCategory: 'parva-vrat',
      badge: 'अष्टान्हिका व्रत',
      description: 'कार्तिक, फाल्गुन एवं आषाढ़ अष्टान्हिका महापर्व पूजन'
    },
    {
      id: 'rot-teej-vrat-puja',
      title: 'रोट तीज व्रत पूजा',
      category: 'puja',
      subCategory: 'parva-vrat',
      badge: 'रोट तीज व्रत',
      description: 'भाद्रपद शुक्ल तृतीया रोट तीज व्रत एवं चौबीसी पूजन'
    },
    {
      id: 'mukut-saptami-vrat-puja',
      title: 'मुकुट सप्तमी व्रत पूजा',
      category: 'puja',
      subCategory: 'parva-vrat',
      badge: 'मुकुट सप्तमी',
      description: 'श्रावण शुक्ल सप्तमी पार्श्वनाथ मोक्ष कल्याणक व्रत पूजा'
    },
    {
      id: 'chandan-shashti-vrat-puja',
      title: 'चन्दनषष्ठी व्रत पूजा',
      category: 'puja',
      subCategory: 'parva-vrat',
      badge: 'चन्दनषष्ठी व्रत',
      description: 'भाद्रपद कृष्ण षष्ठी चंद्रप्रभ भगवान पूजन'
    },
    {
      id: 'ravi-vrat-puja',
      title: 'रविव्रत पूजा',
      category: 'puja',
      subCategory: 'parva-vrat',
      badge: 'रविव्रत',
      description: 'रविवार व्रत एवं पार्श्वनाथ भगवान पूजन'
    },
    {
      id: 'kalash-dashami-puja',
      title: 'कलश दशमी पूजा',
      category: 'puja',
      subCategory: 'parva-vrat',
      badge: 'कलश दशमी',
      description: 'कलश दशमी व्रत एवं जिनेंद्र पूजन'
    },

    // ----------------- 4. गुरु एवं आचार्य पूजाएँ -----------------
    {
      id: 'vidyasagar-puja',
      title: 'आचार्य श्री विद्यासागर जी महाराज पूजन',
      category: 'puja',
      subCategory: 'guru-acharya',
      badge: 'युगश्रेष्ठ संत',
      description: 'परम पूज्य प्रातः स्मरणीय आचार्य श्री १०८ विद्यासागर जी महाराज पूजन'
    },
    {
      id: 'samaysagar-puja',
      title: 'आचार्य श्री समयसागर जी महाराज पूजन',
      category: 'puja',
      subCategory: 'guru-acharya',
      badge: 'पट्टाचार्य',
      description: 'परम पूज्य आचार्य श्री १०८ समयसागर जी महाराज पूजन'
    },
    {
      id: 'panch-balyati-puja',
      title: 'पंच बालयति पूजा',
      category: 'puja',
      subCategory: 'guru-acharya',
      badge: 'पंच बालयति',
      description: 'वासुपूज्य, मल्लिनाथ, नेमिनाथ, पार्श्वनाथ एवं महावीर स्वामी पूजन'
    },
    {
      id: 'parmarshi-swasti-mangal-path',
      title: 'परमर्षि स्वस्ति मंगल पाठ',
      category: 'puja',
      subCategory: 'guru-acharya',
      badge: 'ऋद्धिधारी मुनि',
      description: 'अणिमादि ऋद्धियों से संपन्न परमर्षि स्वस्ति मंगल पाठ'
    },

    // ----------------- 5. गुण, तत्त्व एवं शास्त्र पूजाएँ -----------------
    {
      id: 'samyagdarshan-puja',
      title: 'सम्यग्दर्शन पूजा',
      category: 'puja',
      subCategory: 'tattva-guna',
      badge: 'सम्यक्त्व',
      description: 'अष्टांग सम्यग्दर्शन एवं पच्चीस दोष विसर्जन पूजन'
    },
    {
      id: 'samyaggyan-puja',
      title: 'सम्यग्ज्ञान पूजा',
      category: 'puja',
      subCategory: 'tattva-guna',
      badge: 'ज्ञान',
      description: 'मति-श्रुतादि अष्टविध सम्यग्ज्ञान अष्टद्रव्य पूजन'
    },
    {
      id: 'samyakcharitra-puja',
      title: 'सम्यक्चारित्र पूजा',
      category: 'puja',
      subCategory: 'tattva-guna',
      badge: 'चारित्र',
      description: 'पंच महाव्रत, पंच समिति, त्रिगुप्ति त्रयोदशविध चारित्र पूजन'
    },
    {
      id: 'shrut-panchami-puja',
      title: 'श्रुतपंचमी पूजा (षट्खण्डागम पूजा)',
      category: 'puja',
      subCategory: 'tattva-guna',
      badge: 'श्रुतपंचमी',
      description: 'ज्येष्ठ शुक्ल पंचमी षट्खण्डागम एवं शास्त्र पूजन'
    },
    {
      id: 'jinvani-puja',
      title: 'श्री जिनवाणी पूजा',
      category: 'puja',
      subCategory: 'tattva-guna',
      badge: 'जिनवाणी',
      description: 'द्वादशांग जिनवाणी माता अष्टद्रव्य पूजन'
    },
    {
      id: 'namokar-mahamantra-puja',
      title: 'णमोकार महामंत्र पूजा',
      category: 'puja',
      subCategory: 'tattva-guna',
      badge: 'मूल महामंत्र',
      description: 'अनादिनिधन णमोकार महामंत्र एवं पंच परमेष्ठी पूजन'
    },
  ],
  vidhan: [
    { id: 'siddhachakra-vidhan', title: 'श्री सिद्धचक्र मण्डल विधान', category: 'vidhan', subCategory: 'mahamandal-vidhan', badge: 'सर्वश्रेष्ठ विधान', description: 'नवपद एवं सिद्धचक्र मण्डल महा विधान' },
    { id: 'das-lakshan-vidhan', title: 'दशलक्षण विधान (समुच्चय पूजा)', category: 'vidhan', subCategory: 'mahamandal-vidhan', badge: 'महापर्व विधान', description: 'दशलक्षण धर्म समुच्चय विधान एवं जयमाला' },
    { id: 'kalpataru-vidhan', title: 'श्री कल्पतरु विधान (समवसरण पूजा)', category: 'vidhan', subCategory: 'mahamandal-vidhan', badge: 'समवसरण विधान', description: 'समवसरण स्थित कल्पतरु महा विधान' },
    { id: 'shanti-vidhan-purnamati', title: 'शांति विधान', category: 'vidhan', subCategory: 'mahamandal-vidhan', badge: 'शांति प्रदायक', description: 'सर्व संकट निवारक शांति महा विधान' },
    { id: 'adinath-vidhan', title: 'श्री आदिनाथ विधान', category: 'vidhan', subCategory: 'tirthankar-vidhan', badge: '१. आदिनाथ', description: 'प्रथम तीर्थंकर ऋषभदेव विधान' },
    { id: 'ajitnath-vidhan', title: 'श्री अजितनाथ विधान', category: 'vidhan', subCategory: 'tirthankar-vidhan', badge: '२. अजितनाथ', description: '२रे तीर्थंकर अजितनाथ विधान' },
    { id: 'sambhavnath-vidhan', title: 'श्री संभवनाथ विधान', category: 'vidhan', subCategory: 'tirthankar-vidhan', badge: '३. संभवनाथ', description: '३रे तीर्थंकर संभवनाथ विधान' },
    { id: 'abhinandan-vidhan', title: 'श्री अभिनंदननाथ विधान', category: 'vidhan', subCategory: 'tirthankar-vidhan', badge: '४. अभिनंदननाथ', description: '४थे तीर्थंकर अभिनंदननाथ विधान' },
    { id: 'sumatinath-vidhan', title: 'श्री सुमतिनाथ विधान', category: 'vidhan', subCategory: 'tirthankar-vidhan', badge: '५. सुमतिनाथ', description: '५वें तीर्थंकर सुमतिनाथ विधान' },
    { id: 'padmaprabh-vidhan', title: 'श्री पद्मप्रभ विधान', category: 'vidhan', subCategory: 'tirthankar-vidhan', badge: '६. पद्मप्रभ', description: '६वें तीर्थंकर पद्मप्रभ विधान' },
    { id: 'suparshvanath-vidhan', title: 'श्री सुपार्श्वनाथ विधान', category: 'vidhan', subCategory: 'tirthankar-vidhan', badge: '७. सुपार्श्वनाथ', description: '७वें तीर्थंकर सुपार्श्वनाथ विधान' },
    { id: 'chandraprabh-vidhan', title: 'श्री चन्द्रप्रभ विधान', category: 'vidhan', subCategory: 'tirthankar-vidhan', badge: '८. चन्द्रप्रभ', description: '८वें तीर्थंकर चन्द्रप्रभ विधान' },
    { id: 'pushpadant-vidhan', title: 'श्री पुष्पदंत विधान', category: 'vidhan', subCategory: 'tirthankar-vidhan', badge: '९. पुष्पदंत', description: '९वें तीर्थंकर पुष्पदंत विधान' },
    { id: 'sheetalnath-vidhan', title: 'श्री शीतलनाथ विधान', category: 'vidhan', subCategory: 'tirthankar-vidhan', badge: '१०. शीतलनाथ', description: '१०वें तीर्थंकर शीतलनाथ विधान' },
    { id: 'shreyansnath-vidhan', title: 'श्री श्रेयांसनाथ विधान', category: 'vidhan', subCategory: 'tirthankar-vidhan', badge: '११. श्रेयांसनाथ', description: '११वें तीर्थंकर श्रेयांसनाथ विधान' },
    { id: 'vasupujya-vidhan', title: 'श्री वासुपूज्य विधान', category: 'vidhan', subCategory: 'tirthankar-vidhan', badge: '१२. वासुपूज्य', description: '१२वें तीर्थंकर वासुपूज्य विधान' },
    { id: 'vimalnath-vidhan', title: 'श्री विमलनाथ विधान', category: 'vidhan', subCategory: 'tirthankar-vidhan', badge: '१३. विमलनाथ', description: '१३वें तीर्थंकर विमलनाथ विधान' },
    { id: 'anantnath-vidhan', title: 'श्री अनंतनाथ विधान', category: 'vidhan', subCategory: 'tirthankar-vidhan', badge: '१४. अनंतनाथ', description: '१४वें तीर्थंकर अनंतनाथ विधान' },
    { id: 'dharmanath-vidhan', title: 'श्री धर्मनाथ विधान', category: 'vidhan', subCategory: 'tirthankar-vidhan', badge: '१५. धर्मनाथ', description: '१५वें तीर्थंकर धर्मनाथ विधान' },
    { id: 'shantinath-vidhan', title: 'श्री शांतिनाथ विधान', category: 'vidhan', subCategory: 'tirthankar-vidhan', badge: '१६. शांतिनाथ', description: '१६वें तीर्थंकर शांतिनाथ विधान' },
    { id: 'kunthunath-vidhan', title: 'श्री कुंथुनाथ विधान', category: 'vidhan', subCategory: 'tirthankar-vidhan', badge: '१७. कुंथुनाथ', description: '१७वें तीर्थंकर कुंथुनाथ विधान' },
    { id: 'arahnath-vidhan', title: 'श्री अरहनाथ विधान', category: 'vidhan', subCategory: 'tirthankar-vidhan', badge: '१८. अरहनाथ', description: '१८वें तीर्थंकर अरहनाथ विधान' },
    { id: 'mallinath-vidhan', title: 'श्री मल्लिनाथ विधान', category: 'vidhan', subCategory: 'tirthankar-vidhan', badge: '१९. मल्लिनाथ', description: '१९वें तीर्थंकर मल्लिनाथ विधान' },
    { id: 'munisuvrat-vidhan', title: 'श्री मुनिसुव्रतनाथ विधान', category: 'vidhan', subCategory: 'tirthankar-vidhan', badge: '२०. मुनिसुव्रतनाथ', description: '२०वें तीर्थंकर मुनिसुव्रतनाथ विधान' },
    { id: 'naminath-vidhan', title: 'श्री नमिनाथ विधान', category: 'vidhan', subCategory: 'tirthankar-vidhan', badge: '२१. नमिनाथ', description: '२१वें तीर्थंकर नमिनाथ विधान' },
    { id: 'neminath-vidhan', title: 'श्री नेमिनाथ विधान', category: 'vidhan', subCategory: 'tirthankar-vidhan', badge: '२२. नेमिनाथ', description: '२२वें तीर्थंकर नेमिनाथ विधान' },
    { id: 'parshvanath-vidhan', title: 'श्री पार्श्वनाथ विधान', category: 'vidhan', subCategory: 'tirthankar-vidhan', badge: '२३. पार्श्वनाथ', description: '२३वें तीर्थंकर पार्श्वनाथ विधान' },
    { id: 'mahavir-vidhan', title: 'श्री महावीर विधान', category: 'vidhan', subCategory: 'tirthankar-vidhan', badge: '२४. महावीर', description: '२४वें तीर्थंकर महावीर विधान' },
  ],
  stotra: [
    { id: 'namokar-mantra', title: 'णमोकार महामंत्र', category: 'stotra', subCategory: 'pradhan-stotra', badge: 'मूल महामंत्र', description: 'अनादिनिधन मूल मंत्र' },
    { id: 'bhaktamar-stotra', title: 'भक्तामर स्तोत्र (संस्कृत व हिन्दी भावार्थ)', category: 'stotra', subCategory: 'pradhan-stotra', badge: 'आदिनाथ स्तुति', author: 'आचार्य मानतुंग', description: '४८ पद्य संस्कृत मूल व भावार्थ' },
    { id: 'bhaktamar-hindi-hemraj', title: 'भक्तामर स्तोत्र (हिन्दी पद्यानुवाद)', category: 'stotra', subCategory: 'pradhan-stotra', badge: 'काव्यानुवाद', author: 'पं. हेमराज जी', description: 'सरल एवं लोकप्रिय हिन्दी भाषा पद्य' },
    { id: 'bhaktamar-mahima', title: 'भक्तामर महिमा', category: 'stotra', subCategory: 'pradhan-stotra', badge: 'स्तोत्र महात्म्य', description: 'भक्तामर स्तोत्र का इतिहास एवं प्रभाव' },
    { id: 'bhaktamar-riddhi-mantra', title: 'भक्तामर ऋद्धि मंत्र', category: 'stotra', subCategory: 'pradhan-stotra', badge: '४८ ऋद्धि मंत्र', description: '४८ काव्यों के स्वतंत्र ऋद्धि-सिद्धि मंत्र' },
    { id: 'kalyan-mandir-stotra', title: 'कल्याण मंदिर स्तोत्र', category: 'stotra', subCategory: 'pradhan-stotra', badge: 'पार्श्वनाथ स्तुति', author: 'आचार्य कुमुदचन्द्र', description: 'भगवान पार्श्वनाथ की ४४ पद्य स्तुति' },
    { id: 'ekibhav-stotra', title: 'एकीभाव स्तोत्र', category: 'stotra', subCategory: 'pradhan-stotra', badge: 'आत्म-लीनता', author: 'आचार्य वादिराज', description: 'आत्म-लीनता एवं वीतराग स्तुति' },
    { id: 'brihat-shanti-stotra', title: 'बृहत् शांति स्तोत्र (बड़ी शांति)', category: 'stotra', subCategory: 'shanti-raksha', badge: 'शांति पाठ', description: 'समस्त उपद्रव नाशक बड़ी शांति' },
    { id: 'laghu-shanti-stotra', title: 'लघु शांति स्तोत्र', category: 'stotra', subCategory: 'shanti-raksha', badge: 'शांति स्तोत्र', description: 'दैनिक पाठ योग्य लघु शांति' },
    { id: 'vishapahar-stotra', title: 'विषापहार स्तोत्र', category: 'stotra', subCategory: 'shanti-raksha', badge: 'विष-बाधा नाशक', author: 'आचार्य धनंजय', description: 'विष एवं भय निवारक स्तोत्र' },
    { id: 'santikaram-stotra', title: 'श्री संतिकरं स्तोत्र', category: 'stotra', subCategory: 'shanti-raksha', badge: 'प्राकृत शांति', author: 'आचार्य मुनिचन्द्र', description: 'प्राकृत शांति स्तोत्र' },
    { id: 'rishi-mandal-stotra', title: 'ऋषि मण्डल स्तोत्र', category: 'stotra', subCategory: 'shanti-raksha', badge: 'मंत्रमय स्तोत्र', description: 'समस्त सिद्ध व आचार्यों का मन्त्र स्तोत्र' },
    { id: 'jinsahasranam-stotra', title: 'श्री जिनसहस्रनाम-स्तोत्रम्', category: 'stotra', subCategory: 'bhakti-stuti', badge: '१००८ नाम', author: 'आचार्य जिनसेन', description: 'जिनेंद्र भगवान के १००८ पावन नाम' },
    { id: 'mahaveerashtak-stotra', title: 'महावीराष्टक-स्तोत्रम्', category: 'stotra', subCategory: 'bhakti-stuti', badge: 'महावीर स्तुति', description: 'यस्याङ्के भाति चन्द्र... महावीर अष्टक' },
    { id: 'parshvanath-stotra', title: 'श्री पार्श्वनाथ स्तोत्र', category: 'stotra', subCategory: 'bhakti-stuti', badge: 'पार्श्वनाथ', description: 'पार्श्वनाथ भगवान स्तुति' },
    { id: 'ratnakar-pachisi', title: 'श्री रत्नाकर पच्चीसी', category: 'stotra', subCategory: 'bhakti-stuti', badge: 'वैराग्य स्तुति', author: 'मुनि रत्नाकर', description: '२५ पद्य वैराग्य व आत्म-निवेदन' },
    { id: 'saraswati-stotra', title: 'श्री सरस्वती स्तोत्र', category: 'stotra', subCategory: 'bhakti-stuti', badge: 'जिनवाणी स्तुति', description: 'ज्ञानदायिनी सरस्वती देवी स्तुति' },
    { id: 'swayambhu-stotra', title: 'स्वयंभू स्तोत्र', category: 'stotra', subCategory: 'bhakti-stuti', badge: '२४ तीर्थंकर स्तुति', author: 'आचार्य समन्तभद्र', description: 'आचार्य समन्तभद्र कृत २४ जिन स्तुति' },
    { id: 'logassa-sutra', title: 'लोगस्स पाठ (चतुर्विंशति स्तव)', category: 'stotra', subCategory: 'bhakti-stuti', badge: 'प्राकृत स्तुति', description: 'लोगस्स उज्जोअगरे... चौबीस जिन वंदना' },
    { id: 'tijay-pahutta-stotra', title: 'तिजयपहुत्त स्तोत्र', category: 'stotra', subCategory: 'bhakti-stuti', badge: 'पार्श्व स्तुति', description: 'प्राकृत पार्श्वनाथ स्तोत्र' },
    { id: 'uvasaggaharam-stotra', title: 'उवसग्गहरं स्तोत्र', category: 'stotra', subCategory: 'bhakti-stuti', badge: 'उपसर्गहर', description: 'सर्व विघ्न निवारक स्तोत्र' },
  ],
  path: [
    { id: 'darshan-path-hindi', title: 'दर्शन पाठ हिंदी', category: 'path', description: 'जिनेंद्र देव के दर्शन करने का हिंदी पाठ' },
    { id: 'darshan-path-sanskrit', title: 'दर्शन पाठ (संस्कृत)', category: 'path', description: 'दर्शनं देवदेवस्य... संस्कृत दर्शन पाठ' },
    { id: 'meri-bhavana', title: 'मेरी भावना', category: 'path', author: 'पं. जुगलकिशोर जी', description: 'जिसने राग द्वेष कामादिक... अमर भावना' },
    { id: 'meri-bhavana-jugal', title: 'मेरी भावना (पं. जुगलकिशोर जी)', category: 'path', author: 'पं. जुगलकिशोर जी', description: 'पं. जुगलकिशोर जी विरचित' },
    { id: 'barah-bhavana-raja-rana', title: 'बारह भावना (राजा राणा छत्रपति)', category: 'path', author: 'कविवर भूधरदास', description: 'राजा राणा छत्रपति हाथिन के असवार...' },
    { id: 'barah-bhavana', title: 'बारह भावना', category: 'path', description: 'अनित्य आदि १२ वैराग्य भावनाएँ' },
    { id: 'alochana-path', title: 'आलोचना-पाठ', category: 'path', author: 'कविवर द्यानतराय', description: 'सुनिये जिन अरज हमारी... पाप प्रायश्चित्त पाठ' },
    { id: 'samadhi-bhavana', title: 'समाधि भावना', category: 'path', description: 'दिन रात मेरे स्वामी मैं भावना ये भाऊँ...' },
    { id: 'samadhi-maran-path', title: 'समाधि-मरण पाठ', category: 'path', description: 'संथारा व समाधि मरण पाठ' },
    { id: 'samayik-path', title: 'सामायिक पाठ', category: 'path', author: 'आचार्य अमितगति', description: 'सत्त्वेषु मैत्रीं गुणिषु प्रमोदं...' },
    { id: 'laghu-pratikraman', title: 'लघु प्रतिक्रमण', category: 'path', description: 'दैनिक पाप शुद्धि लघु प्रतिक्रमण' },
    { id: 'jinvani-stuti', title: 'जिनवाणी स्तुति', category: 'path', description: 'मिथ्यातम तम हरन को... जिनवाणी स्तुति' },
    { id: 'mata-tu-daya-karke', title: 'जिनवाणी स्तुति (माता तू दया करके)', category: 'path', description: 'माता तू दया करके भव-सिंधु तारना...' },
    { id: 'prabhu-patit-pavan', title: 'स्तुति (प्रभु पतित पावन)', category: 'path', description: 'प्रभु पतित पावन मैं अपावन... स्तुति' },
    { id: 'main-tum-charan-kamal', title: 'स्तुति- मैं तुम चरण-कमल गुण गाय', category: 'path', description: 'मैं तुम चरण-कमल गुण गाय... स्तुति' },
    { id: 'aho-jagat-gurudev', title: 'देव-स्तुति', category: 'path', description: 'अहो जगत गुरुदेव... देव स्तुति' },
    { id: 'sankat-mochan-vinati', title: 'संकट मोचन विनती', category: 'path', description: 'संकट मोचन पार्श्वनाथ विनती' },
    { id: 'dukh-haran-vinati', title: 'दुःख हरण विनती', category: 'path', description: 'दुःख हरण जिनेंद्र विनती' },
    { id: 'vairagya-bhavana', title: 'वैराग्य भावना', category: 'path', description: 'आत्म-बोधक वैराग्य भावना' },
    { id: 'nirvan-kand', title: 'निर्वाण कांड भाषा', category: 'path', author: 'कविवर भैया भगवतीदास', description: 'अष्टापद आदि समस्त सिद्धक्षेत्र वंदना' },
    { id: 'siddha-bhakti', title: 'सिद्ध भक्ति (प्राकृत)', category: 'path', description: 'सिद्धे जयपहुत्त... प्राकृत सिद्ध भक्ति' },
    { id: 'siddhachakra-stuti', title: 'श्री सिद्धचक्र की स्तुति', category: 'path', description: 'सिद्धचक्र नवपद स्तुति' },
    { id: 'mangalashtak', title: 'मंगलाष्टक', category: 'path', description: 'आद्यो धर्मकरो जिनः प्रथमजः... मंगलाष्टक' },
    { id: 'aradhana-path', title: 'आराधना पाठ', category: 'path', description: 'चार आराधना पाठ' },
  ],
  granthas: [
    { id: 'chhah-dhala', title: 'छह ढाला', category: 'granthas', author: 'पं. दौलतराम जी', description: 'जैन दर्शन की लघु गीता - ६ ढाला' },
    { id: 'tattvartha-sutra', title: 'तत्त्वार्थ सूत्र', category: 'granthas', author: 'आचार्य उमास्वामी', description: 'मोक्षशास्त्र - १० अध्याय सूत्र ग्रंथ' },
    { id: 'ratnakarand-shravakachar', title: 'रत्नकरण्ड श्रावकाचार', category: 'granthas', author: 'आचार्य समन्तभद्र', description: 'श्रावक के आचार व व्रतों का मूल ग्रंथ' },
    { id: 'samaysar', title: 'समयसार', category: 'granthas', author: 'आचार्य कुन्दकुन्द देव', description: 'परम अध्यात्म ग्रंथराज' },
    { id: 'dravya-sangrah', title: 'द्रव्य संग्रह', category: 'granthas', author: 'आचार्य नेमिचन्द्र सिद्धांत चक्रवर्ती', description: 'षट्द्रव्य एवं नवपदार्थ स्वरूप' },
    { id: 'moksha-marg-prakashak', title: 'मोक्षमार्ग प्रकाशक', category: 'granthas', author: 'पं. टोडरमल जी', description: 'मोक्षमार्ग का प्रामाणिक विवेचन' },
    { id: 'pravachanasar', title: 'प्रवचनसार', category: 'granthas', author: 'आचार्य कुन्दकुन्द देव', description: 'ज्ञान, ज्ञेय एवं चारित्र अधिकार' },
    { id: 'niyamasar', title: 'नियमसार', category: 'granthas', author: 'आचार्य कुन्दकुन्द देव', description: 'शुद्धोपयोग एवं नियम स्वरूप' },
    { id: 'purushartha-siddhipaya', title: 'पुरुषार्थ सिद्ध्युपाय', category: 'granthas', author: 'आचार्य अमृतचन्द्र', description: 'अहिंसा एवं पुरुषार्थ सिद्धि' },
    { id: 'mulachar', title: 'मूलाचार', category: 'granthas', author: 'आचार्य वट्टकेर', description: 'मुनि आचार का महान ग्रंथ' },
    { id: 'padma-puran', title: 'पद्म पुराण (जैन रामायण)', category: 'granthas', author: 'आचार्य रविषेण', description: 'भगवान रामचन्द्र जी का जीवन चरित्र' },
    { id: 'harivansh-puran', title: 'हरिवंश पुराण (जैन महाभारत)', category: 'granthas', author: 'आचार्य जिनसेन', description: 'भगवान नेमिनाथ एवं तीर्थंकर हरिवंश' },
    { id: 'trilok-saar', title: 'त्रिलोक सार', category: 'granthas', author: 'आचार्य नेमिचन्द्र सिद्धांत चक्रवर्ती', description: 'त्रिलोक संरचना एवं गणित' },
    { id: 'ashtasahasri', title: 'अष्टसहस्री', category: 'granthas', author: 'आचार्य विद्यानंद', description: 'न्याय एवं दर्शन महाग्रंथ' },
  ],
  itihas: [
    { id: 'adinath', title: 'भगवान आदिनाथ का इतिहास', category: 'itihas', description: 'युगादि पुरुष प्रथम तीर्थंकर चरित्र' },
    { id: 'mahavir-swami', title: 'भगवान महावीर स्वामी का इतिहास', category: 'itihas', description: '२४वें तीर्थंकर का जीवन एवं उपदेश' },
    { id: 'mahavir-jayanti', title: 'महावीर जयंती एवं शासन प्रभावना', category: 'itihas', description: 'कल्याणक एवं प्रभावना इतिहास' },
    { id: 'acharya-kundakunda', title: 'आचार्य कुन्दकुन्द देव', category: 'itihas', description: 'अध्यात्म चक्रवर्ती आचार्य कुन्दकुन्द' },
    { id: 'acharya-samantabhadra', title: 'आचार्य समन्तभद्र स्वामी', category: 'itihas', description: 'तार्किक शिरोमणि स्वामी समन्तभद्र' },
    { id: 'acharya-jinasena', title: 'आचार्य जिनसेन स्वामी', category: 'itihas', description: 'आदिपुराण एवं महापुराण कर्ता' },
    { id: 'acharya-todarmal', title: 'पंडित टोडरमल जी', category: 'itihas', description: 'मोक्षमार्ग प्रकाशक के रचयिता' },
    { id: 'acharya-virsena', title: 'आचार्य वीरसेन स्वामी', category: 'itihas', description: 'धवला टीका के महान रचयिता' },
  ],
  bhugol: [
    { id: 'cosmology', title: 'जैन त्रिलोक रचना एवं भूगोल', category: 'bhugol', description: 'तीन लोक का स्वरूप एवं रचना' },
    { id: 'jambudvipa', title: 'जम्बूद्वीप संरचना', category: 'bhugol', description: '१ लाख योजन विस्तृत जम्बूद्वीप' },
    { id: 'urdhva-loka', title: 'ऊर्ध्व लोक (देवलोक)', category: 'bhugol', description: '१६ स्वर्ग, नव ग्रैवेयक, नव अनुदिश, ५ अनुत्तर' },
    { id: 'madhya-loka', title: 'मध्य लोक (मनुष्य व तिर्यंच लोक)', category: 'bhugol', description: 'असंख्यात द्वीप-समुद्र रचना' },
    { id: 'adho-loka', title: 'अधो लोक (नरक लोक)', category: 'bhugol', description: 'सातों नरक भूमियों का वर्णन' },
    { id: 'siddhashila', title: 'सिद्धशिला स्वरूप', category: 'bhugol', description: '४५ लाख योजन सिद्धिक्षेत्र' },
  ],
  parva: [
    { id: 'das-lakshan', title: 'दशलक्षण महापर्व', category: 'parva', description: 'भाद्रपद शुक्ल पंचमी से चतुर्दशी' },
    { id: 'ashtanhika', title: 'अष्टान्हिका महापर्व', category: 'parva', description: 'कार्तिक, फाल्गुन, आषाढ़ नंदीश्वर पर्व' },
    { id: 'diwali', title: 'दीपावली (भगवान महावीर निर्वाण कल्याणक)', category: 'parva', description: 'कार्तिक कृष्ण अमावस्या निर्वाण लाडू' },
    { id: 'raksha-bandhan', title: 'रक्षाबंधन (मुनि अकंपनाचार्य कथा)', category: 'parva', description: 'श्रावण पूर्णिमा मुनि रक्षा दिवस' },
    { id: 'akshaya-tritiya', title: 'अक्षय तृतीया (इक्षुरस प्रथम आहार)', category: 'parva', description: 'वैशाख शुक्ल तृतीया आहार दान पर्व' },
    { id: 'vardhaman-calendar', title: 'तीर्थंकर वर्धमान पंचांग', category: 'parva', description: 'जैन तिथि, पर्व एवं कल्याणक पंचांग' },
  ],
  philosophy: [
    { id: 'six-dravyas', title: 'षट्द्रव्य स्वरूप', category: 'philosophy', description: 'जीव, पुद्गल, धर्म, अधर्म, आकाश, काल' },
    { id: 'jiva-tattva', title: 'जीव तत्त्व', category: 'philosophy', description: 'चेतन्यमय आत्म तत्त्व' },
    { id: 'ajiva-tattva', title: 'अजीव तत्त्व', category: 'philosophy', description: 'जड़ एवं अचेतन तत्त्व' },
    { id: 'asrava-tattva', title: 'आस्रव तत्त्व', category: 'philosophy', description: 'कर्मों का आत्मा की ओर आगमन' },
    { id: 'bandha-tattva', title: 'बंध तत्त्व', category: 'philosophy', description: 'कर्मों का आत्मा से बंधना' },
    { id: 'samvara-tattva', title: 'संवर तत्त्व', category: 'philosophy', description: 'कर्मों के आगमन को रोकना' },
    { id: 'nirjara-tattva', title: 'निर्जरा तत्त्व', category: 'philosophy', description: 'बंधे कर्मों का क्षय करना' },
    { id: 'moksha-tattva', title: 'मोक्ष तत्त्व', category: 'philosophy', description: 'सर्व कर्मों से पूर्ण मुक्ति' },
    { id: 'karma-theory', title: 'कर्म सिद्धान्त एवं आठ कर्म', category: 'philosophy', description: 'ज्ञानावरणी आदि ८ कर्म' },
    { id: 'twelve-vratas', title: 'श्रावक के बारह व्रत', category: 'philosophy', description: 'अणुव्रत, गुणव्रत एवं शिक्षाव्रत' },
    { id: 'anekantavada', title: 'अनेकांतवाद एवं स्याद्वाद', category: 'philosophy', description: 'जैन दृष्टि एवं सापेक्षता' },
    { id: 'gunasthan', title: 'चौदह गुणस्थान विवेचन', category: 'philosophy', description: 'मिथ्यात्व से सिद्ध पद तक आत्म-विकास' },
    { id: 'leshya', title: 'षड् लेश्या स्वरूप', category: 'philosophy', description: 'कृष्ण, नील, कापोत, पीत, पद्म, शुक्ल' },
  ],
  kids: [
    { id: 'namokar-mantra-meaning', title: 'णमोकार महामंत्र का भावार्थ', category: 'kids', description: 'बच्चों के लिए णमोकार मंत्र का सरल अर्थ' },
    { id: 'four-kashaya', title: 'चार कषाय (क्रोध, मान, माया, लोभ)', category: 'kids', description: 'कषायों से बचने की प्रेरणादायक सीख' },
    { id: 'five-paps', title: 'पाँच पाप और उनसे बचाव', category: 'kids', description: 'हिंसा, झूठ, चोरी, कुशील, परिग्रह' },
    { id: 'trishala-dreams', title: 'माता त्रिशला के १६ शुभ स्वप्न', category: 'kids', description: 'तीर्थंकर जन्म से पूर्व देखे गए १६ स्वप्न' },
    { id: 'elephant-rabbit', title: 'हाथी और खरगोश की दयालु कथा', category: 'kids', description: 'जीव दया एवं करुणा की अमर कहानी' },
  ],
  tirthankar: [
    { id: 'adinath', title: '१. श्री आदिनाथ भगवान', category: 'tirthankar', badge: 'बैल (वृषभ)', description: 'प्रथम तीर्थंकर • अयोध्या जन्म • कैलाश मोक्ष' },
    { id: 'ajitnath', title: '२. श्री अजितनाथ भगवान', category: 'tirthankar', badge: 'हाथी (गज)', description: 'द्वितीय तीर्थंकर • अयोध्या जन्म • सम्मेदशिखर मोक्ष' },
    { id: 'sambhavnath', title: '३. श्री संभवनाथ भगवान', category: 'tirthankar', badge: 'घोड़ा (अश्व)', description: 'तृतीय तीर्थंकर • श्रावस्ती जन्म • सम्मेदशिखर मोक्ष' },
    { id: 'abhinandannath', title: '४. श्री अभिनंदननाथ भगवान', category: 'tirthankar', badge: 'बंदर (कपि)', description: 'चतुर्थ तीर्थंकर • अयोध्या जन्म • सम्मेदशिखर मोक्ष' },
    { id: 'sumatinath', title: '५. श्री सुमतिनाथ भगवान', category: 'tirthankar', badge: 'चकवा (क्रौंच)', description: 'पंचम तीर्थंकर • अयोध्या जन्म • सम्मेदशिखर मोक्ष' },
    { id: 'padmaprabh', title: '६. श्री पद्मप्रभ भगवान', category: 'tirthankar', badge: 'कमल (पद्म)', description: 'षष्ठम तीर्थंकर • कौशाम्बी जन्म • सम्मेदशिखर मोक्ष' },
    { id: 'suparshvanath', title: '७. श्री सुपार्श्वनाथ भगवान', category: 'tirthankar', badge: 'स्वस्तिक', description: 'सप्तम तीर्थंकर • वाराणसी जन्म • सम्मेदशिखर मोक्ष' },
    { id: 'chandraprabh', title: '८. श्री चंद्रप्रभ भगवान', category: 'tirthankar', badge: 'चन्द्रमा (शशि)', description: 'अष्टम तीर्थंकर • चन्द्रपुरी जन्म • सम्मेदशिखर मोक्ष' },
    { id: 'pushpadant', title: '९. श्री पुष्पदंत भगवान', category: 'tirthankar', badge: 'मकर (मगरमच्छ)', description: 'नवम तीर्थंकर • काकन्दी जन्म • सम्मेदशिखर मोक्ष' },
    { id: 'sheetalnath', title: '१०. श्री शीतलनाथ भगवान', category: 'tirthankar', badge: 'कल्पवृक्ष', description: 'दशम तीर्थंकर • भद्रिलपुर जन्म • सम्मेदशिखर मोक्ष' },
    { id: 'shreyansanath', title: '११. श्री श्रेयांसनाथ भगवान', category: 'tirthankar', badge: 'गैंडा (खड्गी)', description: 'एकादश तीर्थंकर • सिंहपुर जन्म • सम्मेदशिखर मोक्ष' },
    { id: 'vasupujya', title: '१२. श्री वासुपूज्य भगवान', category: 'tirthankar', badge: 'भैंसा (महिष)', description: 'द्वादश तीर्थंकर • चम्पापुर जन्म एवं मोक्ष' },
    { id: 'vimalanath', title: '१३. श्री विमलनाथ भगवान', category: 'tirthankar', badge: 'शूकर (वराह)', description: 'त्रयोदश तीर्थंकर • कांपिल्य जन्म • सम्मेदशिखर मोक्ष' },
    { id: 'anantanath', title: '१४. श्री अनंतनाथ भगवान', category: 'tirthankar', badge: 'सेही / श्येन', description: 'चतुर्विंशति तीर्थंकर • अयोध्या जन्म • सम्मेदशिखर मोक्ष' },
    { id: 'dharmanath', title: '१५. श्री धर्मनाथ भगवान', category: 'tirthankar', badge: 'वज्र', description: 'पंचदश तीर्थंकर • रतनपुरी जन्म • सम्मेदशिखर मोक्ष' },
    { id: 'shantinath', title: '१६. श्री शांतिनाथ भगवान', category: 'tirthankar', badge: 'हिरण (मृग)', description: 'षोडश तीर्थंकर • हस्तिनापुर जन्म • सम्मेदशिखर मोक्ष' },
    { id: 'kunthunath', title: '१७. श्री कुन्थुनाथ भगवान', category: 'tirthankar', badge: 'बकरा (अज)', description: 'सप्तदश तीर्थंकर • हस्तिनापुर जन्म • सम्मेदशिखर मोक्ष' },
    { id: 'aranath', title: '१८. श्री अरहनाथ भगवान', category: 'tirthankar', badge: 'मछली (मीन)', description: 'अष्टादश तीर्थंकर • हस्तिनापुर जन्म • सम्मेदशिखर मोक्ष' },
    { id: 'mallinath', title: '१९. श्री मल्लिनाथ भगवान', category: 'tirthankar', badge: 'कलश (कुम्भ)', description: 'एकोनविंश तीर्थंकर • मिथिला जन्म • सम्मेदशिखर मोक्ष' },
    { id: 'munisuvrata', title: '२०. श्री मुनिसुव्रतनाथ भगवान', category: 'tirthankar', badge: 'कछुआ (कूर्म)', description: 'विंशति तीर्थंकर • राजगृह जन्म • सम्मेदशिखर मोक्ष' },
    { id: 'naminath', title: '२१. श्री नमिनाथ भगवान', category: 'tirthankar', badge: 'नीलकमल', description: 'एकविंशति तीर्थंकर • मिथिला जन्म • सम्मेदशिखर मोक्ष' },
    { id: 'neminath', title: '२२. श्री नेमिनाथ भगवान', category: 'tirthankar', badge: 'शंख', description: 'द्वाविंशति तीर्थंकर • शौरीपुर जन्म • गिरनार मोक्ष' },
    { id: 'parshvanath', title: '२३. श्री पार्श्वनाथ भगवान', category: 'tirthankar', badge: 'सर्प (नाग)', description: 'त्रयोविंशति तीर्थंकर • वाराणसी जन्म • सम्मेदशिखर मोक्ष' },
    { id: 'mahavir-swami', title: '२४. श्री महावीर भगवान', category: 'tirthankar', badge: 'सिंह (केसरी)', description: 'चतुर्विंशति तीर्थंकर • कुण्डलपुर जन्म • पावापुर मोक्ष' },
  ]
};
