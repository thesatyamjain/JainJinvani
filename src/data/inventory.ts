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
  ]
  granthas: [
    // --- प्रथमानुयोग (Prathamanuyoga - 7) ---
    { id: 'adipurana', title: 'श्री आदिपुराण', category: 'granthas', subCategory: 'prathamanuyoga', author: 'आचार्य जिनसेन', badge: 'महापुराण पूर्व', description: 'प्रथम तीर्थंकर ऋषभदेव एवं भरत चक्रवर्ती का पावन महाचरित्र' },
    { id: 'uttarapurana', title: 'श्री उत्तरपुराण', category: 'granthas', subCategory: 'prathamanuyoga', author: 'आचार्य गुणभद्र', badge: 'महापुराण उत्तर', description: 'अजितनाथ से महावीर स्वामी तक २३ तीर्थंकरों का संपूर्ण महाचरित्र' },
    { id: 'padma-puran', title: 'पद्म पुराण (जैन रामायण)', category: 'granthas', subCategory: 'prathamanuyoga', author: 'आचार्य रविषेण', badge: 'जैन रामायण', description: 'भगवान रामचन्द्र जी (पद्म) एवं सीता जी का प्रामाणिक जीवन चरित' },
    { id: 'harivansh-puran', title: 'हरिवंश पुराण (जैन महाभारत)', category: 'granthas', subCategory: 'prathamanuyoga', author: 'आचार्य जिनसेन', badge: 'जैन महाभारत', description: 'भगवान नेमिनाथ, श्रीकृष्ण एवं पाण्डवों का पावन जीवन चरित्र' },
    { id: 'mahavira-purana', title: 'श्री महावीर पुराण', category: 'granthas', subCategory: 'prathamanuyoga', author: 'आचार्य सकलकीर्ति', badge: 'महावीर चरित', description: '२४वें तीर्थंकर भगवान महावीर स्वामी का संपूर्ण जीवन दर्शन' },
    { id: 'parshvanath-charitra', title: 'श्री पार्श्वनाथ चरित', category: 'granthas', subCategory: 'prathamanuyoga', author: 'आचार्य वादिराज सूरि', badge: 'पार्श्व चरित', description: '२३वें तीर्थंकर पार्श्वनाथ भगवान का १० भवों का अमर चरित' },
    { id: 'yashastilaka-champu', title: 'श्री यशस्तिलक चम्पू', category: 'granthas', subCategory: 'prathamanuyoga', author: 'आचार्य सोमदेव सूरि', badge: 'नीति महाकाव्य', description: 'राजा यशोधर का चरित, हिंसा-त्याग एवं जैन नीति-दर्शन' },

    // --- करणानुयोग (Karnanuyoga - 6) ---
    { id: 'gommatasara-jiva-kanda', title: 'श्री गोम्मटसार जीवकांड', category: 'granthas', subCategory: 'karnanuyoga', author: 'आचार्य नेमिचन्द्र सिद्धांत चक्रवर्ती', badge: 'जीव सिद्धांत', description: '१४ गुणस्थान, १४ जीवसमास एवं २० प्ररूपणाओं का वैज्ञानिक निरूपण' },
    { id: 'gommatasara-karma-kanda', title: 'श्री गोम्मटसार कर्मकांड', category: 'granthas', subCategory: 'karnanuyoga', author: 'आचार्य नेमिचन्द्र सिद्धांत चक्रवर्ती', badge: 'कर्म सिद्धांत', description: '८ मूल कर्म, १४८ उत्तर प्रकृतियाँ व बंध-उदय-सत्व व्यवस्था' },
    { id: 'labdhisara', title: 'श्री लब्धिसार एवं क्षपणासार', category: 'granthas', subCategory: 'karnanuyoga', author: 'आचार्य नेमिचन्द्र सिद्धांत चक्रवर्ती', badge: 'पंच लब्धि', description: 'सम्यक्त्व प्राप्ति की ५ लब्धियाँ एवं क्षपक श्रेणी द्वारा कर्म निर्जरा' },
    { id: 'trilok-saar', title: 'त्रिलोक सार', category: 'granthas', subCategory: 'karnanuyoga', author: 'आचार्य नेमिचन्द्र सिद्धांत चक्रवर्ती', badge: 'लोक रचना', description: 'ऊर्ध्व, मध्य एवं अधोलोक की विस्तृत संरचना एवं गणित' },
    { id: 'tiloyapannatti', title: 'श्री तिलोयपण्णत्ती (त्रिलोक प्रज्ञप्ति)', category: 'granthas', subCategory: 'karnanuyoga', author: 'आचार्य यतिवृषभ', badge: 'प्राकृत खगोल', description: 'तीनों लोकों का प्राचीनतम भौगोलिक एवं खगोलीय आगम' },
    { id: 'jambudvipa-pannatti', title: 'श्री जम्बूद्वीप प्रज्ञप्ति', category: 'granthas', subCategory: 'karnanuyoga', author: 'आचार्य पद्मनंदि', badge: 'जैन भूगोल', description: '१ लाख योजन जम्बूद्वीप, सुदर्शन मेरु व चक्रवर्ती क्षेत्रों का वर्णन' },

    // --- चरणानुयोग (Charananuyoga - 8) ---
    { id: 'ratnakarand-shravakachar', title: 'रत्नकरण्ड श्रावकाचार', category: 'granthas', subCategory: 'charananuyoga', author: 'आचार्य समन्तभद्र', badge: 'श्रावक धर्म', description: 'सम्यग्दर्शन, श्रावक के १२ व्रत, सल्लेखना एवं ११ प्रतिमाएँ' },
    { id: 'purushartha-siddhipaya', title: 'पुरुषार्थ सिद्ध्युपाय', category: 'granthas', subCategory: 'charananuyoga', author: 'आचार्य अमृतचन्द्र', badge: 'अहिंसा पुरुषार्थ', description: 'अहिंसा का सूक्ष्म विवेचन एवं श्रावक का आत्मोद्धारक पुरुषार्थ' },
    { id: 'mulachar', title: 'मूलाचार', category: 'granthas', subCategory: 'charananuyoga', author: 'आचार्य वट्टकेर', badge: 'मुनि आचार', description: 'दिगम्बर मुनिराजों के २८ मूलगुण एवं श्रमण आचार संहिता' },
    { id: 'sagara-dharmamrita', title: 'श्री सागार धर्मामृत', category: 'granthas', subCategory: 'charananuyoga', author: 'पं. आशाधर जी', badge: 'गृहस्थ आचार', description: 'श्रावकों के षट्कर्म, व्रत-नियम एवं ११ प्रतिमाओं का महाग्रंथ' },
    { id: 'anagara-dharmamrita', title: 'श्री अनगार धर्मामृत', category: 'granthas', subCategory: 'charananuyoga', author: 'पं. आशाधर जी', badge: 'मुनि धर्म', description: 'गृहत्यागी मुनिराजों के महाव्रत, समिति, गुप्ति व १२ तप' },
    { id: 'kartikeyanupreksha', title: 'श्री कार्तिकेयानुप्रेक्षा', category: 'granthas', subCategory: 'charananuyoga', author: 'स्वामी कार्तिकेय', badge: 'द्वादश भावना', description: 'वैराग्य उत्पादक १२ अनुप्रेक्षाएँ एवं आत्म-साधना का मार्ग' },
    { id: 'bhagavati-aradhana', title: 'श्री भगवती आराधना', category: 'granthas', subCategory: 'charananuyoga', author: 'आचार्य शिवार्य', badge: 'समाधिमरण', description: 'दर्शन, ज्ञान, चारित्र एवं समाधिमरण (सल्लेखना) की आराधना' },
    { id: 'yogasara-prabhrita', title: 'श्री योगसार प्राभृत', category: 'granthas', subCategory: 'charananuyoga', author: 'आचार्य अमितगति', badge: 'चित्त शुद्धि', description: 'कषाय शमन, समता भाव एवं आत्म-अनुभव का आचार ग्रंथ' },

    // --- द्रव्यानुयोग (Dravyanuyoga - 15) ---
    { id: 'samaysar', title: 'समयसार', category: 'granthas', subCategory: 'dravyanuyoga', author: 'आचार्य कुन्दकुन्द देव', badge: 'परमागम सिरमौर', description: 'शुद्ध जीवास्तिकाय, परम अध्यात्म एवं निश्चय मोक्षमार्ग' },
    { id: 'pravachanasar', title: 'प्रवचनसार', category: 'granthas', subCategory: 'dravyanuyoga', author: 'आचार्य कुन्दकुन्द देव', badge: 'शुद्धोपयोग', description: 'ज्ञान, ज्ञेय एवं चारित्र अधिकार में सर्वज्ञता का निरूपण' },
    { id: 'niyamasar', title: 'नियमसार', category: 'granthas', subCategory: 'dravyanuyoga', author: 'आचार्य कुन्दकुन्द देव', badge: 'परम समाधि', description: 'निश्चय-व्यवहार सम्यक्त्व एवं शुद्धोपयोग नियम स्वरूप' },
    { id: 'panchastikaya-sangrah', title: 'श्री पंचास्तिकाय संग्रह', category: 'granthas', subCategory: 'dravyanuyoga', author: 'आचार्य कुन्दकुन्द देव', badge: 'षट्द्रव्य स्वरूप', description: 'जीव, पुद्गल, धर्म, अधर्म, आकाश, काल एवं नवपदार्थ' },
    { id: 'chhah-dhala', title: 'छह ढाला', category: 'granthas', subCategory: 'dravyanuyoga', author: 'पं. दौलतराम जी', badge: 'लघु गीता', description: 'संसार के दुःखों से लेकर सिद्ध पद की प्राप्ति तक ६ ढाला' },
    { id: 'tattvartha-sutra', title: 'तत्त्वार्थ सूत्र', category: 'granthas', subCategory: 'dravyanuyoga', author: 'आचार्य उमास्वामी', badge: 'मोक्षशास्त्र', description: '१० अध्याय सूत्र ग्रंथ - सम्यग्दर्शनज्ञानचारित्राणि मोक्षमार्गः' },
    { id: 'dravya-sangrah', title: 'द्रव्य संग्रह', category: 'granthas', subCategory: 'dravyanuyoga', author: 'आचार्य नेमिचन्द्र सिद्धांत चक्रवर्ती', badge: 'नवपदार्थ', description: 'षट्द्रव्य, पंचास्तिकाय एवं नवपदार्थों का सारगर्भित निरूपण' },
    { id: 'moksha-marg-prakashak', title: 'मोक्षमार्ग प्रकाशक', category: 'granthas', subCategory: 'dravyanuyoga', author: 'पं. टोडरमल जी', badge: 'रहस्योद्घाटन', description: 'मोक्षमार्ग का प्रामाणिक विवेचन एवं मिथ्यात्व निवारण' },
    { id: 'samadhitantra', title: 'श्री समाधितंत्र', category: 'granthas', subCategory: 'dravyanuyoga', author: 'आचार्य पूज्यपाद स्वामी', badge: 'भेदविज्ञान', description: 'बहिरात्मा, अंतरात्मा व परमात्मा का भेदविज्ञान एवं ध्यान विधि' },
    { id: 'ishto-padesha', title: 'श्री इष्टोपदेश', category: 'granthas', subCategory: 'dravyanuyoga', author: 'आचार्य पूज्यपाद स्वामी', badge: 'मोक्षमार्ग सार', description: '५१ श्लोकों में मोक्षमार्ग, आत्म-कल्याण एवं संसार-स्वरूप का सार' },
    { id: 'jnanarnava', title: 'श्री ज्ञानार्णव (योगप्रदीपिका)', category: 'granthas', subCategory: 'dravyanuyoga', author: 'आचार्य शुभचन्द्र', badge: 'जैन योग महाग्रंथ', description: 'पिंडस्थ, पदस्थ, रूपस्थ एवं रूपातीत ध्यान द्वारा आत्मसिद्धि' },
    { id: 'aptamimamsa', title: 'श्री आप्तमीमांसा (देवागम)', category: 'granthas', subCategory: 'dravyanuyoga', author: 'आचार्य समन्तभद्र', badge: 'स्याद्वाद सिद्धि', description: 'स्याद्वाद, अनेकांत एवं सच्चे सर्वज्ञ आप्त की तार्किक सिद्धि' },
    { id: 'nyayadeepika', title: 'श्री न्यायदीपिका', category: 'granthas', subCategory: 'dravyanuyoga', author: 'आचार्य धर्मभूषण यति', badge: 'जैन तर्कशास्त्र', description: 'प्रमाण, नय, निक्षेप एवं जैन न्याय का प्रवेश द्वार' },
    { id: 'ashtasahasri', title: 'अष्टसहस्री', category: 'granthas', subCategory: 'dravyanuyoga', author: 'आचार्य विद्यानंद', badge: 'न्याय महाग्रंथ', description: 'आप्तमीमांसा पर आठ हजार श्लोक प्रमाण दर्शन महाग्रंथ' },
    { id: 'svarupa-sambodhana', title: 'श्री स्वरूप सम्बोधन', category: 'granthas', subCategory: 'dravyanuyoga', author: 'आचार्य अकलंक देव', badge: 'आत्म-बोध', description: '२५ श्लोकों में मोह-त्याग एवं शुद्ध चैतन्य स्वरूप का बोध' },
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
  ],
  agamas: [
    { id: 'shatkhandagama', title: 'षट्खण्डागम', category: 'agamas', author: 'आचार्य पुष्पदंत एवं भूतबलि', description: 'दिगम्बर जैन आम्नाय का प्रथम लिपिबद्ध मूल आगम' },
    { id: 'kashayaprabhrita', title: 'कषायपाहुड़', category: 'agamas', author: 'आचार्य गुणधर', description: 'कषाय एवं कर्म सिद्धांत का मूल आगम' },
    { id: 'acharang-sutra', title: 'आचारांग सूत्र', category: 'agamas', author: 'गणधर देव', description: 'द्वादशांग जिनवाणी का प्रथम अंग' },
    { id: 'tattvartha-sutra', title: 'तत्त्वार्थ सूत्र (मोक्षशास्त्र)', category: 'agamas', author: 'आचार्य उमास्वामी', description: 'सर्वमान्य जैन सूत्र ग्रंथ' },
    { id: 'samaysar', title: 'समयसार', category: 'agamas', author: 'आचार्य कुन्दकुन्द देव', description: 'परम अध्यात्म ग्रंथराज' },
    { id: 'mulachar', title: 'मूलाचार', category: 'agamas', author: 'आचार्य वट्टकेर', description: 'दिगम्बर मुनि आचार संहिता' },
  ]
};

// Aliases for navigation categories
(contentInventory as any)['tattva'] = contentInventory.philosophy;
(contentInventory as any)['shastra'] = contentInventory.granthas;

