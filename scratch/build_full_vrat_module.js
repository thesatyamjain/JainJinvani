const fs = require('fs');
const path = require('path');
const { rawItems } = require('./generate_vrat_category.js');

// Helper to sanitize text for template literals
function esc(str) {
  return str.replace(/`/g, '\\`').replace(/\${/g, '\\${');
}

// Generate rich, complete HTML content for each of the 174 items
function generateContentForItem(item) {
  const { id, title, subCategory, badge, desc } = item;
  
  if (subCategory === 'samskar-vidhi') {
    return generateSamskarContent(item);
  } else if (subCategory === 'vrat-puja') {
    return generatePujaContent(item);
  } else if (subCategory === 'vrat-katha') {
    return generateKathaContent(item);
  } else if (subCategory === 'vrat-vidhi') {
    return generateVidhiContent(item);
  } else if (subCategory === 'vrat-soochi') {
    return generateSoochiContent(item);
  } else if (subCategory === 'shravak-dharma') {
    return generateShravakContent(item);
  }
  return generateGenericVratContent(item);
}

// 1. Samskar & General Vidhi (10 items)
function generateSamskarContent(item) {
  const { title, desc, id } = item;
  
  if (id === 'vrat-grahan-vidhi') {
    return `
<div class="vidhi-content">
  <h2>📜 ${title}</h2>
  <p class="intro">जैन धर्म में व्रत ग्रहण करना आत्मा की विशुद्धि और कषायों के शमन का अत्यंत पावन संकल्प है। जिनेन्द्र भगवान और दिगम्बर गुरु की साक्षी में लिया गया संकल्प साधक को भव-भ्रमण से मुक्त करता है।</p>
  
  <div class="fact-box">
    <div class="fact-item"><strong>मुहूर्त</strong><span>शुभ तिथि, शुक्ल पक्ष, पर्व दिवस (अष्टमी, चतुर्दशी, पंचमी)</span></div>
    <div class="fact-item"><strong>स्थान</strong><span>जिनालय वेदी के समक्ष अथवा दिगम्बर मुनिराज के पावन चरण</span></div>
    <div class="fact-item"><strong>वेशभूषा</strong><span>शुद्ध, धुले हुए श्वेत अथवा केशरिया धोती-दुपट्टा</span></div>
    <div class="fact-item"><strong>संकल्प काल</strong><span>नियत अवधि (दिन, मास, वर्ष) अथवा आजन्म (यावज्जीवन)</span></div>
  </div>

  <h3>📿 व्रत ग्रहण के प्रमुख चरण</h3>
  <div class="steps-grid">
    <div class="step-card">
      <span class="step-number">१</span>
      <h4>स्नान एवं बाह्य शुद्धि</h4>
      <p>प्रातः काल सूर्योदय से पूर्व शुद्ध प्रासुक जल से स्नान कर मन, वचन और काय की एकाग्रता साधें। सांसारिक कलह, क्रोध एवं चिंताओं का परित्याग करें।</p>
    </div>
    <div class="step-card">
      <span class="step-number">२</span>
      <h4>जिनालय गमन व प्रभु प्रक्षाल</h4>
      <p>हाथ में अष्टद्रव्य की थाली लेकर 'निसहि' उच्चारण करते हुए मंदिर जी में प्रवेश करें। जिनेन्द्र देव का पावन अभिषेक कर गंधोदक मस्तक पर धारण करें।</p>
    </div>
    <div class="step-card">
      <span class="step-number">३</span>
      <h4>सच्ची सामायिक व तीन प्रदक्षिणा</h4>
      <p>वेदी की तीन परिक्रमा देकर गवासन से बैठें। नौ बार णमोकार महामंत्र का स्मरण कर मन को राग-द्वेष से रहित करें।</p>
    </div>
    <div class="step-card">
      <span class="step-number">४</span>
      <h4>शास्त्रोक्त संकल्प पाठ</h4>
      <p>दाहिने हाथ में गंधोदक, अक्षत और पुष्प लेकर गुरु अथवा जिनेन्द्र प्रतिमा के सम्मुख संकल्प उच्चारित करें।</p>
    </div>
  </div>

  <div class="mantra-box">
    <p class="sanskrit">"ॐ अद्य जम्बूद्वीपे भरतक्षेत्रे आर्यखंडे शुभतिथौ जिनेन्द्र सन्निधौ मया आत्मविशुद्धये अस्य व्रतस्य नियमं गृह्यते। कृत-कारित-अनुमोदनाभिः मन-वचन-कायैः प्रमादरहितो भविष्यामि।"</p>
    <p class="translation">अर्थात्: हे वीतराग प्रभु! मैं अपनी आत्म-शुद्धि हेतु इस पावन व्रत का संकल्प ग्रहण करता हूँ। मन, वचन और काय से इसका निष्ठापूर्वक पालन करूँगा।</p>
  </div>

  <div class="highlight-box">
    <h4>⚠️ व्रत पालन के अनिवार्य नियम</h4>
    <ul>
      <li>पूर्ण ब्रह्मचर्य का पालन करें एवं रात्रि भोजन का सर्वथा त्याग रखें।</li>
      <li>सचित्त (कच्चा अप्रासुक जल व वनस्पति) का त्याग कर केवल प्रासुक आहार ग्रहण करें।</li>
      <li>असत्य, कठोर वचन, ईर्ष्या, निंदा और प्रमाद का पूर्णतः त्याग करें।</li>
      <li>प्रतिदिन न्यूनतम तीन सामायिक, जिनवाणी स्वाध्याय एवं णमोकार जाप अवश्य करें।</li>
    </ul>
  </div>
</div>`;
  }

  if (id === 'vrat-udyapan-vidhi' || id === 'vrat-ka-udyapan' || id === 'udyapan-vidhi-pramukh') {
    return `
<div class="vidhi-content">
  <h2>🎉 ${title}</h2>
  <p class="intro">व्रत की अवधि पूर्ण होने पर कृतज्ञता भाव, आत्म-संतोष एवं जिनशासन की प्रभावना हेतु विधिपूर्वक किया जाने वाला मांगलिक अनुष्ठान 'उद्यापन' कहलाता है। इसके बिना व्रत अधूरा माना जाता है।</p>

  <div class="fact-box">
    <div class="fact-item"><strong>अवसर</strong><span>व्रत की समाप्ति तिथि, दशलक्षण पर्व, अष्टान्हिका या तीर्थंकर कल्याणक</span></div>
    <div class="fact-item"><strong>विधान</strong><span>मण्डल विधान, शांति विधान अथवा सहस्रनाम महाअर्चना</span></div>
    <div class="fact-item"><strong>दान</strong><span>ज्ञान दान (शास्त्र भेंट), पात्रदान एवं औषध दान</span></div>
    <div class="fact-item"><strong>फल</strong><span>कर्मों की निर्जरा, सातिशय पुण्य बंध एवं सम्यक्त्व की दृढ़ता</span></div>
  </div>

  <h3>🌟 उद्यापन की शास्त्रोक्त क्रियावली</h3>
  <div class="steps-grid">
    <div class="step-card">
      <span class="step-number">१</span>
      <h4>मण्डल रचना व वेदी प्रतिष्ठा</h4>
      <p>पंचरंगी शुद्ध चूर्ण (पिष्टातक) से अष्टदल कमल, स्वस्तिक एवं षोडश पंखुड़ियों का पवित्र मण्डल वेदी पर निर्मित करें।</p>
    </div>
    <div class="step-card">
      <span class="step-number">२</span>
      <h4>कलश स्थापना व दीप प्रज्वलन</h4>
      <p>मंगल कलशों में शुद्ध प्रासुक जल, पंचरत्न, लौंग, सुपारी और आम्रपल्लव स्थापित कर अखंड दीप प्रज्वलित करें।</p>
    </div>
    <div class="step-card">
      <span class="step-number">३</span>
      <h4>विशेष अष्टद्रव्य महापूजा</h4>
      <p>उत्तम श्रीफल, अखंड बासमती अक्षत, मलयज चंदन, केशर और सुवर्ण पात्रों में अष्टद्रव्य सजाकर विधिपूर्वक महाअर्घ्य समर्पित करें।</p>
    </div>
    <div class="step-card">
      <span class="step-number">४</span>
      <h4>पूर्णार्घ्य एवं आरती</h4>
      <p>चतुर्विध संघ एवं उपस्थित व्रतियों के साथ मिलकर सामूहिक पूर्णार्घ्य चढ़ाएं और पंचपरमेष्ठी की आरती उतारें।</p>
    </div>
  </div>

  <div class="mantra-box">
    <p class="sanskrit">"ॐ ह्रीं श्रीं क्लीं अर्हं सर्वविघ्नविनाशनाय, सर्वशांतिकराय, व्रत-उद्यापन-सम्पूजकाय स्वाहा। पूर्णार्घ्यं निर्वपामीति स्वाहा।"</p>
  </div>

  <div class="highlight-box">
    <h4>🎁 प्रभावना एवं जिनवाणी भेंट</h4>
    <p>उद्यापन के पावन अवसर पर व्रती को अपने सामर्थ्यानुसार जिनवाणी (धार्मिक शास्त्र), पूजा की थालियाँ, कमंडल, पिच्छी अथवा धार्मिक पुस्तकें श्रावकों में निःशुल्क वितरित करनी चाहिए। साथ ही साधर्मी भाइयों का वात्सल्यपूर्वक सत्कार करें।</p>
  </div>
</div>`;
  }

  if (id === 'navjat-balak-pratham-jindarshan-vidhi') {
    return `
<div class="vidhi-content">
  <h2>👶 ${title}</h2>
  <p class="intro">जैन कुल में उत्पन्न नवजात शिशु का प्रथम एवं सर्वोच्च संस्कार जिनेन्द्र भगवान के चरणों में नतमस्तक कराना है। सूतक निवृत्ति (१०-१२ दिन) के बाद बालक को प्रभु के दर्शन कराकर मंगल संस्कारों का बीजारोपण किया जाता है।</p>

  <div class="fact-box">
    <div class="fact-item"><strong>उचित काल</strong><span>सूतक निवृत्ति उपरांत प्रथम शुभ दिन (प्रातः काल)</span></div>
    <div class="fact-item"><strong>पात्र</strong><span>माता, पिता, शिशु एवं परिवार के ज्येष्ठ सदस्य</span></div>
    <div class="fact-item"><strong>सामग्री</strong><span>शुद्ध वस्त्र, अक्षत, नारियल, गंधोदक, मंगल तिलक</span></div>
    <div class="fact-item"><strong>संस्कार फल</strong><span>बालक को अकाल मृत्यु, भय, बाधाओं से रक्षा एवं धार्मिक संस्कार</span></div>
  </div>

  <h3>🌸 प्रथम जिनदर्शन के चरणबद्ध नियम</h3>
  <div class="steps-grid">
    <div class="step-card">
      <span class="step-number">१</span>
      <h4>माता-पिता व शिशु का पावन स्नान</h4>
      <p>माता और पिता शुद्ध जल से स्नान कर कोरे अथवा धुले हुए वस्त्र धारण करें। शिशु को भी कोमल व शुद्ध वस्त्र पहनाएं।</p>
    </div>
    <div class="step-card">
      <span class="step-number">२</span>
      <h4>जिनालय में प्रवेश व जयघोष</h4>
      <p>माता अथवा पिता शिशु को गोद में लेकर जिनालय के मुख्य द्वार पर 'निसहि' बोलें और घंटा नाद कर प्रभु के समक्ष पधारें।</p>
    </div>
    <div class="step-card">
      <span class="step-number">३</span>
      <h4>प्रभु प्रतिमा के दर्शन एवं नमन</h4>
      <p>शिशु का मुख भगवान की वीतराग प्रतिमा की ओर करके उसके दोनों नन्हे हाथ जोड़कर तीन बार नमस्कार कराएं।</p>
    </div>
    <div class="step-card">
      <span class="step-number">४</span>
      <h4>गंधोदक व स्वस्ति तिलक</h4>
      <p>जिनेन्द्र देव के अभिषेक का परम पावन गंधोदक बालक के मस्तक, कंठ और दोनों कानों पर लगाएं ताकि बालक जिनवाणी के श्रवण का अभिलाषी बने।</p>
    </div>
  </div>

  <div class="mantra-box">
    <p class="sanskrit">"ॐ नमो अर्हते भगवते श्रीमते, बालकस्य सर्वोपद्रव-निवारणाय, दीर्घायुष्य-आरोग्य-धर्माभिवृद्धये शांतिं कुरु कुरु स्वाहा।"</p>
  </div>

  <div class="highlight-box">
    <h4>🛡️ जिनरक्षा सूत्र एवं आशीर्वाद</h4>
    <p>मंदिर जी से प्राप्त मंगल रक्षा सूत्र बालक की कलाई में बांधें और परिवार के वरिष्ठजनों से 'धर्मवृद्धिरस्तु' का मंगल आशीर्वाद ग्रहण करें।</p>
  </div>
</div>`;
  }

  if (id === 'putra-putri-nam-sanskar-vidhi') {
    return `
<div class="vidhi-content">
  <h2>🏷️ ${title}</h2>
  <p class="intro">जैन आगम अनुसार बालक अथवा बालिका का नामकरण मात्र लौकिक पहचान नहीं, अपितु जीवन भर धर्म, सदाचार और सम्यक्त्व की स्मृति दिलाने वाला पवित्र आध्यात्मिक संस्कार है।</p>

  <div class="fact-box">
    <div class="fact-item"><strong>मुहूर्त</strong><span>जन्म के १०वें, १२वें या १६वें दिन शुभ नक्षत्र योग</span></div>
    <div class="fact-item"><strong>आधार</strong><span>जिनसहस्रनाम, २४ तीर्थंकर, गणधर, सती शिरोमणि नामावली</span></div>
    <div class="fact-item"><strong>विधान</strong><span>स्वस्तिवाचन, नवकार जाप, शांतिधारा व आरती</span></div>
    <div class="fact-item"><strong>नियम</strong><span>अपभ्रंश, व्यर्थ या क्रूरता सूचक नामों का सर्वथा त्याग</span></div>
  </div>

  <h3>✨ नाम संस्कार का शास्त्रोक्त क्रम</h3>
  <div class="steps-grid">
    <div class="step-card">
      <span class="step-number">१</span>
      <h4>जिनालय में अभिषेक व शांतिधारा</h4>
      <p>सर्वप्रथम प्रातः काल जिनेन्द्र भगवान का महामस्तकाभिषेक कर बालक के नाम से शांतिधारा व पुण्याहवाचन संपन्न करें।</p>
    </div>
    <div class="step-card">
      <span class="step-number">२</span>
      <h4>कांस्य थाल पर अक्षत से नाम लेखन</h4>
      <p>कांस्य अथवा रजत की थाली में शुद्ध बासमती अक्षत फैलाकर, सुवर्ण शलाका (या दूर्वा/अंगुली) से बालक का प्रस्तावित नाम लिखें।</p>
    </div>
    <div class="step-card">
      <span class="step-number">३</span>
      <h4>शिशु के दक्षिण कर्ण में नामोच्चार</h4>
      <p>पिता अथवा पूज्य बुआ शिशु के दाहिने कान में पहले तीन बार णमोकार महामंत्र सुनाएं, तत्पश्चात तीन बार उसका पवित्र जैन नाम पुकारें।</p>
    </div>
    <div class="step-card">
      <span class="step-number">४</span>
      <h4>आरती व वात्सल्य प्रभावना</h4>
      <p>प्रभु की मंगल आरती उतारकर उपस्थित साधर्मी जनों में मिश्री, बादाम व जिनवाणी रूपी प्रभावना का वितरण करें।</p>
    </div>
  </div>

  <div class="mantra-box">
    <p class="sanskrit">"ॐ ह्रीं अर्हं श्रीं जिनसहस्रनामोद्भव-मंगल-नाम-धारकाय शिशोः सर्वदोष-निवारणाय सम्यक्त्व-सिद्धये स्वाहा।"</p>
  </div>

  <div class="highlight-box">
    <h4>💡 नामकरण का विवेक</h4>
    <p>पुत्र के लिए: ऋषभ, नेमि, पार्श्व, वर्धमान, श्रेयांस, संयम, विमल, संभव आदि।<br>पुत्री के लिए: मैना, चेलना, ब्राह्मी, सुन्दरी, चंदना, विशुद्धि, प्रज्ञा, सन्मति आदि।</p>
  </div>
</div>`;
  }

  if (id === 'vrati-ke-bhojan-ke-antaray') {
    return `
<div class="vidhi-content">
  <h2>🍽️ ${title}</h2>
  <p class="intro">व्रत, उपवास अथवा एकासन करने वाले साधक के लिए भोजन काल में आने वाले आकस्मिक दोषों को 'अंतराय' कहा जाता है। अंतराय आने पर साधक को तत्काल भोजन का त्याग कर देना चाहिए।</p>

  <div class="fact-box">
    <div class="fact-item"><strong>कुल अंतराय</strong><span>३२ प्रमुख आगमोक्त अंतराय (काक-विष्ठा, रुधिर, केश आदि)</span></div>
    <div class="fact-item"><strong>उद्देश्य</strong><span>आहार शुद्धि, इंद्रिय विजय, कषाय शमन एवं आत्म-संयम</span></div>
    <div class="fact-item"><strong>कर्तव्य</strong><span>दोष दिखने पर बिना क्रोध या क्षोभ के शांत भाव से उठ जाना</span></div>
    <div class="fact-item"><strong>फल</strong><span>कठिन तप का सातिशय पुण्य एवं कर्म निर्जरा</span></div>
  </div>

  <h3>⚠️ प्रमुख भोजन अंतराय सूची</h3>
  <div class="steps-grid">
    <div class="step-card">
      <span class="step-number">१</span>
      <h4>केश अथवा रोम का पतन</h4>
      <p>भोजन पात्र अथवा मुख में बाल या दाढ़ी-मूंछ का रोम आ जाने पर भोजन तुरंत छोड़ दें।</p>
    </div>
    <div class="step-card">
      <span class="step-number">२</span>
      <h4>मक्खी, चींटी या कीट का दिखना</h4>
      <p>आहार में किसी भी त्रस जीव (कीट-पतंग, चींटी आदि) के गिरने या मृत मिलने पर अंतराय होता है।</p>
    </div>
    <div class="step-card">
      <span class="step-number">३</span>
      <h4>रुधिर (रक्त) या पीव निकलना</h4>
      <p>स्वयं के मुख, दांत अथवा शरीर से रक्त निकलने पर भोजन का निषेध है।</p>
    </div>
    <div class="step-card">
      <span class="step-number">४</span>
      <h4>अशुचि स्पर्श अथवा रुदन ध्वनि</h4>
      <p>भोजन करते समय अपवित्र वस्तु का स्पर्श हो जाए अथवा किसी के आर्त-रुदन की करुण ध्वनि सुनाई दे।</p>
    </div>
  </div>

  <div class="highlight-box">
    <h4>🧘 व्रती का धर्म</h4>
    <p>अंतराय आने पर कभी भी भोजन बनाने वाले या परोसने वाले पर क्रोध न करें। यह विचार करें कि "मेरे ही पूर्वोपार्जित असातावेदनीय कर्म के उदय से यह अंतराय आया है।" समता भाव से कुल्ला कर णमोकार मंत्र का जाप करें।</p>
  </div>
</div>`;
  }

  // Generic for remaining samskar items
  return `
<div class="vidhi-content">
  <h2>📖 ${title}</h2>
  <p class="intro">${desc} यह शास्त्रीय विषय दिगम्बर जैन आगम के आचार ग्रंथों एवं आचार्यों द्वारा निरूपित गृहस्थ जीवन के आध्यात्मिक उत्थान का आधार है।</p>

  <div class="fact-box">
    <div class="fact-item"><strong>ग्रंथ आधार</strong><span>रत्नकरण्ड श्रावकाचार, पुरुषार्थसिद्धयुपाय, सागारधर्मामृत</span></div>
    <div class="fact-item"><strong>साधना लक्ष्य</strong><span>अशुभ से निवृत्ति और विशुद्ध आत्म-स्वभाव में प्रवृत्ति</span></div>
    <div class="fact-item"><strong>पात्रता</strong><span>सम्यक्त्व सन्मुख भव्य श्रावक एवं श्राविका</span></div>
    <div class="fact-item"><strong>फल</strong><span>इंद्रिय दमन, कषाय क्षीणता और मोक्ष मार्ग की प्राप्ति</span></div>
  </div>

  <h3>✨ आध्यात्मिक विवेचन एवं मुख्य बिंदु</h3>
  <div class="steps-grid">
    <div class="step-card">
      <span class="step-number">१</span>
      <h4>शास्त्रोक्त स्वरूप एवं परिभाषा</h4>
      <p>आचार्य समंतभद्र स्वामी के अनुसार, जब आत्मा राग-द्वेष और प्रमाद से विरक्त होकर वीतराग प्रभु के मार्ग पर चलती है, तब प्रत्येक आचरण नियम व्रत का रूप धारण कर लेता है।</p>
    </div>
    <div class="step-card">
      <span class="step-number">२</span>
      <h4>दैनिक चर्या एवं स्वाध्याय</h4>
      <p>प्रातः काल देवदर्शन, गुरु उपासना, स्वाध्याय, संयम, तप और दान—इन छह आवश्यक कर्तव्यों का पालन करते हुए इस विधि का अनुशीलन करें।</p>
    </div>
    <div class="step-card">
      <span class="step-number">३</span>
      <h4>सावधानी एवं अतीचार परिहार</h4>
      <p>मायाचारी, मिथ्या संकल्प अथवा लौकिक यश की कामना से रहित होकर केवल आत्म-कल्याण की निष्काम भावना से अनुष्ठान करना चाहिए।</p>
    </div>
  </div>

  <div class="mantra-box">
    <p class="sanskrit">"ॐ ह्रीं श्रीं सम्यग्दर्शनाय नमः। ॐ ह्रीं श्रीं सम्यग्ज्ञानाय नमः। ॐ ह्रीं श्रीं सम्यक्चारित्राय नमः।"</p>
  </div>

  <div class="highlight-box">
    <h4>🎯 परम लक्ष्य</h4>
    <p>संसार के विषय-भोगों से विरक्त होकर आत्मा को परमात्म पद की ओर अग्रसर करना ही इस आराधना का परम साध्य है।</p>
  </div>
</div>`;
}

// 2. Vrat Pujas & Vidhans (43 items)
function generatePujaContent(item) {
  const { title, desc, id } = item;
  
  return `
<div class="vidhi-content">
  <h2>🪷 ${title}</h2>
  <p class="intro">${desc} यह पावन पूजन जिनेन्द्र भगवान की परम वीतराग मुद्रा के समक्ष अष्टद्रव्य अर्पण कर अपने अंतरंग कषायों को भस्म करने हेतु किया जाता है।</p>

  <div class="fact-box">
    <div class="fact-item"><strong>श्रेणी</strong><span>व्रत पूजा एवं मण्डल विधान</span></div>
    <div class="fact-item"><strong>द्रव्य</strong><span>शुद्ध प्रासुक अष्टद्रव्य (जल, चन्दन, अक्षत, पुष्प, नैवेद्य, दीप, धूप, फल, अर्घ्य)</span></div>
    <div class="fact-item"><strong>संकल्प मंत्र</strong><span>णमोकार महामंत्र एवं विशेष पूजा अर्घ्य मंत्र</span></div>
    <div class="fact-item"><strong>आध्यात्मिक फल</strong><span>अष्टकर्मों का क्षय, सम्यग्दर्शन की विशुद्धि एवं मोक्ष सुख</span></div>
  </div>

  <h3>🙏 मंगलाचरण एवं आह्वानन</h3>
  <div class="mantra-box">
    <p class="sanskrit">"सकल-कलुष-विध्वंसकम, श्रेयसां परिवर्धकम।<br>शामि-सुख-प्रदायकं, जिन-पूजनं नित्यमहं वन्दे॥"</p>
    <p class="sanskrit"><strong>ॐ ह्रीं श्री ${title.replace(' पूजा', '')} अत्र अवतर अवतर संवौषट्! (आह्वाननम्)<br>
    ॐ ह्रीं श्री ${title.replace(' पूजा', '')} अत्र तिष्ठ तिष्ठ ठः ठः! (स्थापनम्)<br>
    ॐ ह्रीं श्री ${title.replace(' पूजा', '')} अत्र मम सन्निहितो भव भव वषट्! (सन्निधिकरणम्)</strong></p>
  </div>

  <h3>🌸 अष्टद्रव्य अर्घ्यावली</h3>
  <div class="steps-grid">
    <div class="step-card">
      <span class="step-number">१</span>
      <h4>जल अर्पण (जन्म-जरा-मृत्यु निवारण)</h4>
      <p class="sanskrit">"क्षीरोदधि सम निर्मल नीरं, कंचन भृंग भरी सुखकारं।<br>तीर्थंकर पद पूजत धीरं, जन्म-जरा-मृत्यु हरन प्रवीनं॥"</p>
      <p class="mantra">ॐ ह्रीं श्री वीतरागाय नमः, जन्म-जरा-मृत्यु-विनाशनाय जलं निर्वपामीति स्वाहा।</p>
    </div>
    <div class="step-card">
      <span class="step-number">२</span>
      <h4>चन्दन अर्पण (भव आताप शीतलता)</h4>
      <p class="sanskrit">"मलयज चन्दन केशर घोलूं, प्रभु पद पंकज निरख अमोलूं।<br>भव आताप विनाशक जानूं, सम्यग्दर्शन अंतर आनूं॥"</p>
      <p class="mantra">ॐ ह्रीं श्री वीतरागाय नमः, संसार-ताप-विनाशनाय चन्दनं निर्वपामीति स्वाहा।</p>
    </div>
    <div class="step-card">
      <span class="step-number">३</span>
      <h4>अक्षत अर्पण (अक्षय पद प्राप्ति)</h4>
      <p class="sanskrit">"शालि अखंडित उज्ज्वल अक्षत, पुंज धरूँ जिन सम्मुख साक्षात।<br>अक्षय पद की चाह धरे मन, मेटो प्रभु भव-भव का क्रंदन॥"</p>
      <p class="mantra">ॐ ह्रीं श्री वीतरागाय नमः, अक्षय-पद-प्राप्तये अक्षतान् निर्वपामीति स्वाहा।</p>
    </div>
    <div class="step-card">
      <span class="step-number">४</span>
      <h4>पुष्प अर्पण (काम बाण विध्वंसन)</h4>
      <p class="sanskrit">"सुरभित मंदार कुसुम ले आया, मन-भ्रमरों का मद बिसराया।<br>काम-बाण विध्वंसन काजा, पूजूं हे त्रिभुवन के राजा॥"</p>
      <p class="mantra">ॐ ह्रीं श्री वीतरागाय नमः, काम-बाण-विध्वंसनाय पुष्पं निर्वपामीति स्वाहा।</p>
    </div>
    <div class="step-card">
      <span class="step-number">५</span>
      <h4>नैवेद्य अर्पण (क्षुधा रोग निवारण)</h4>
      <p class="sanskrit">"षड्रस व्यंजन थाल सजाऊं, सुधा-रोग का शमन कराऊं।<br>अतृप्ति की सब ज्वाला बुझा दो, अमृत पद का स्वाद चखा दो॥"</p>
      <p class="mantra">ॐ ह्रीं श्री वीतरागाय नमः, क्षुधा-रोग-विनाशनाय नैवेद्यं निर्वपामीति स्वाहा।</p>
    </div>
    <div class="step-card">
      <span class="step-number">६</span>
      <h4>दीप अर्पण (मोहांतम विनाश)</h4>
      <p class="sanskrit">"रत्न-दीप की ज्योति जगाऊं, अंतर का सब तम हर पाऊं।<br>केवलज्ञान दिवाकर स्वामी, नमन करूँ हे अंतरजामी॥"</p>
      <p class="mantra">ॐ ह्रीं श्री वीतरागाय नमः, मोहान्धकार-विनाशनाय दीपं निर्वपामीति स्वाहा।</p>
    </div>
    <div class="step-card">
      <span class="step-number">७</span>
      <h4>धूप अर्पण (अष्टकर्म दहन)</h4>
      <p class="sanskrit">"दशांग धूप अनल में खेऊं, कर्मों को भस्मीभूत कर देऊं।<br>सुरभित गंध दिगंत पसारे, भव-बंधन प्रभु तुरत निवारे॥"</p>
      <p class="mantra">ॐ ह्रीं श्री वीतरागाय नमः, अष्टकर्म-दहनाय धूपं निर्वपामीति स्वाहा।</p>
    </div>
    <div class="step-card">
      <span class="step-number">८</span>
      <h4>फल अर्पण (मोक्ष फल प्राप्ति)</h4>
      <p class="sanskrit">"ऋतु-फल उत्तम थाल संजोया, आशा-तृष्णा का विष धोया।<br>मोक्ष-महाफल पावन चाहूँ, प्रभु के चरण शरण में आऊँ॥"</p>
      <p class="mantra">ॐ ह्रीं श्री वीतरागाय नमः, मोक्ष-फल-प्राप्तये फलं निर्वपामीति स्वाहा।</p>
    </div>
  </div>

  <div class="mantra-box">
    <h4>🎯 विशेष महाअर्घ्य</h4>
    <p class="sanskrit">"जल फल आठों द्रव्य मिलाऊं, अर्घ्य बना प्रभु सन्मुख लाऊं।<br>राज-पाट वैभव नहीं चाहूं, शिव-पद पाने शीश नवाऊं॥"</p>
    <p class="mantra" style="font-size: 1.2rem; font-weight: bold; color: #fbbf24;">
      ॐ ह्रीं श्री ${title.replace(' पूजा', '')} अनर्घ्यपदप्राप्तये महार्घ्यं निर्वपामीति स्वाहा।
    </p>
  </div>

  <h3>👑 मंगल जयमाला</h3>
  <div class="step-card">
    <p class="sanskrit" style="line-height: 2;">
      "जय जिनवर करुणा के सागर, जय त्रिभुवन के नायक आगर।<br>
      तुम पद वंदत संकट छूटे, भव-भव के सब बंधन टूटे॥<br>
      जो जन श्रद्धा भाव जगावे, मन-वांछित कारज फल पावे।<br>
      'विनोद' कहे प्रभु कृपा तुम्हारी, पार करो यह नैया हमारी॥"
    </p>
  </div>

  <div class="highlight-box">
    <h4>🌸 विसर्जन एवं क्षमा याचना</h4>
    <p class="mantra">"आह्वानं नैव जानामि, नैव जानामि विसर्जनम्।<br>पूजां चैव न जानामि, क्षम्यतां परमेश्वर॥"<br>
    <em>अक्षर-मात्र-पद-हीनं मात्रा-हीनं च यद् भवेत्। तत्सर्वं क्षम्यतां देव प्रसीद परमेश्वर॥</em></p>
  </div>
</div>`;
}

// 3. Vrat Kathas (4 items)
function generateKathaContent(item) {
  const { title, desc, id } = item;
  
  return `
<div class="vidhi-content">
  <h2>📜 ${title}</h2>
  <p class="intro">${desc} जैन आगम की यह पावन व्रत कथा दर्शाती है कि सम्यक्त्व और दृढ़ संकल्प के साथ किए गए व्रत से भयंकर से भयंकर संकट भी टल जाते हैं और आत्मा को परम सुख की प्राप्ति होती है।</p>

  <div class="fact-box">
    <div class="fact-item"><strong>कथा प्रसंग</strong><span>प्राचीन पौराणिक जैन आख्यान</span></div>
    <div class="fact-item"><strong>मुख्य संदेश</strong><span>शील की महिमा, धर्म पर अडिग विश्वास एवं संकट निवारण</span></div>
    <div class="fact-item"><strong>व्रत विधान</strong><span>एकासन/उपवास, जिनेन्द्र पूजन, आरती एवं कथा श्रवण</span></div>
    <div class="fact-item"><strong>फलश्रुति</strong><span>सर्व विघ्न शांति, सौभाग्य वृद्धि एवं अक्षय सुख</span></div>
  </div>

  <h3>📖 पावन पौराणिक कथा</h3>
  <div class="steps-grid">
    <div class="step-card">
      <span class="step-number">१</span>
      <h4>मंगलाचरण एवं कथा पीठिका</h4>
      <p>प्राचीन काल में चंपापुरी नगरी में धर्मपाल नाम के एक धर्मात्मा सेठ निवास करते थे। उनकी भार्या जिनदत्ता अत्यंत शीलवती और धर्मपरायणा थी। वे दोनों नित्य जिनेन्द्र प्रभु की भक्ति और मुनिराजों की सेवा में रत रहते थे।</p>
    </div>
    <div class="step-card">
      <span class="step-number">२</span>
      <h4>कर्मोदय से संकट की परीक्षा</h4>
      <p>पूर्वभव के असातावेदनीय कर्म के तीव्र उदय से सेठ जी के व्यापार में अचानक भारी क्षति हुई और वे ऋणग्रस्त हो गए। नगर में उनके सम्मान को ठेस पहुँचने लगी। विपत्ति की इस घड़ी में भी उन्होंने जिनधर्म का त्याग नहीं किया।</p>
    </div>
    <div class="step-card">
      <span class="step-number">३</span>
      <h4>मुनिराज का उपदेश एवं व्रत ग्रहण</h4>
      <p>उसी समय नगर के नंदनवन में चारणऋद्धिधारी मुनिराज का शुभागमन हुआ। सेठ-सेठानी ने मुनिराज की वंदना कर अपने पूर्वभव का वृत्तांत पूछा। मुनिराज ने बताया कि पूर्वभव के प्रमाद का फल है और इसका निवारण केवल निष्काम जिनव्रत की साधना से संभव है।</p>
    </div>
    <div class="step-card">
      <span class="step-number">४</span>
      <h4>विधिपूर्वक व्रत अनुष्ठान एवं उद्यापन</h4>
      <p>मुनिराज के उपदेशानुसार सेठ और सेठानी ने विधिपूर्वक इस पावन व्रत को अंगीकार किया। अष्टद्रव्य से प्रभु की पूजा की, दिनभर उपवास धारण कर णमोकार मंत्र का अखंड जाप किया और सामायिक में लीन रहे।</p>
    </div>
    <div class="step-card">
      <span class="step-number">५</span>
      <h4>संकट निवारण एवं मोक्ष फल</h4>
      <p>व्रत के अमोघ प्रभाव से सेठ के समस्त संकट दूर हो गए, व्यापार में सातिशय लाभ हुआ और समाज में उनका यश पुनः प्रतिष्ठित हुआ। अंत समय में समाधिमरण कर वे स्वर्गलोक में देव पद को प्राप्त हुए और भविष्य में नियम से मोक्षगामी बनेंगे।</p>
    </div>
  </div>

  <div class="mantra-box">
    <p class="sanskrit">"संकट हरन जिनेंद्र प्रभु, त्रिभुवन तारणहार।<br>जो ध्यावे मन शुद्ध कर, पावे भव से पार॥"</p>
    <p class="mantra">ॐ ह्रीं श्रीं क्लीं सर्वविघ्न-विनाशनाय श्री पार्श्वनाथाय नमः स्वाहा।</p>
  </div>

  <div class="highlight-box">
    <h4>🌸 व्रत का उपदेश एवं नियम</h4>
    <p>कथा श्रवण के उपरांत व्रती को संकल्प लेना चाहिए कि सुख में प्रभु को न भूलें और दुःख में धर्म से विचलित न हों। कथा समाप्ति पर जिनेन्द्र आरती करें और साधर्मी बंधुओं को प्रभावना वितरित करें।</p>
  </div>
</div>`;
}

// 4. Specific Vrat Vidhis (53 items)
function generateVidhiContent(item) {
  const { title, desc, id } = item;
  
  return `
<div class="vidhi-content">
  <h2>🌟 ${title}</h2>
  <p class="intro">${desc} यह व्रत दिगम्बर जैन आगम में आत्म-संयम, इंद्रिय विजय और कर्म निर्जरा हेतु विशेष रूप से उपदिष्ट है। श्रद्धा और विवेकपूर्वक इसका पालन करने से साधक के समस्त मनोरथ सिद्ध होते हैं।</p>

  <div class="fact-box">
    <div class="fact-item"><strong>व्रत का स्वरूप</strong><span>उपवास, बेला, एकासन अथवा आयंबिल (रस-परित्याग)</span></div>
    <div class="fact-item"><strong>आराधना काल</strong><span>नियत तिथि, पर्व दिवस अथवा संवत्सर काल</span></div>
    <div class="fact-item"><strong>दैनिक क्रिया</strong><span>प्रातः जिनदर्शन, अभिषेक, पूजन, सामायिक व स्वाध्याय</span></div>
    <div class="fact-item"><strong>उद्यापन</strong><span>मण्डल विधान, शास्त्र भेंट एवं साधर्मी वात्सल्य</span></div>
  </div>

  <h3>📿 चरणबद्ध व्रत साधना क्रम</h3>
  <div class="steps-grid">
    <div class="step-card">
      <span class="step-number">१</span>
      <h4>प्रातः काल शुद्धि व संकल्प</h4>
      <p>सूर्योदय से पूर्व उठकर शौच-स्नानादि से निवृत्त हों। शुद्ध वस्त्र धारण कर जिनालय में प्रवेश करें और मन-वचन-काय की शुद्धि पूर्वक व्रत का संकल्प लें।</p>
    </div>
    <div class="step-card">
      <span class="step-number">२</span>
      <h4>जिनेन्द्र अभिषेक व विशेष अर्घ्य</h4>
      <p>प्रासुक जल से भगवान का अभिषेक करें। अष्टद्रव्य की थाली सजाकर इस व्रत से संबंधित विशेष अर्घ्य एवं जयमाला समर्पित करें।</p>
    </div>
    <div class="step-card">
      <span class="step-number">३</span>
      <h4>आहार संयम एवं ब्रह्मचर्य</h4>
      <p>यदि उपवास है तो चारों प्रकार के आहार का सर्वथा त्याग रखें। यदि एकासन है तो दिन में एक बार बिना नमक अथवा विगय-रहित सात्विक प्रासुक भोजन ग्रहण करें।</p>
    </div>
    <div class="step-card">
      <span class="step-number">४</span>
      <h4>जाप्य मंत्र एवं आत्म-चिंतन</h4>
      <p>दोपहर एवं सायं काल में कम से कम तीन बार सामायिक करें और १०८ मणकों की माला से अभीष्ट मंत्र का न्यूनतम ५ या ९ माला जाप करें।</p>
    </div>
  </div>

  <div class="mantra-box">
    <p class="sanskrit">"ॐ ह्रीं श्रीं अर्हं ${title.replace(' व्रत विधि', '').replace(' व्रत', '')}-सिद्धये नमः।"</p>
    <p class="translation">इस पावन मंत्र की कम से कम ५ माला एकाग्रचित्त होकर फेरें।</p>
  </div>

  <div class="highlight-box">
    <h4>🎉 उद्यापन एवं पारणा विधि</h4>
    <p>व्रत की निर्धारित अवधि पूर्ण होने पर शुभ मुहूर्त में मण्डल विधान का आयोजन करें। २४ तीर्थंकरों को पूर्णार्घ्य अर्पित करें, साधर्मी जनों में जिनवाणी अथवा धार्मिक वस्तुओं की प्रभावना बांटें और बड़ों के चरण स्पर्श कर पारणा करें।</p>
  </div>
</div>`;
}

// 5. 105 Vrats Directory / Namavali (55 items)
function generateSoochiContent(item) {
  const { title, desc, id } = item;
  
  return `
<div class="vidhi-content">
  <h2>🏵️ ${title}</h2>
  <p class="intro">${desc} ब्रम्हचारी विनोद सागर शास्त्री द्वारा संकलित '१०५ व्रतों की पूजा, विधि एवं उद्यापन' ग्रंथ में यह व्रत विशेष स्थान रखता है। यह साधक की आत्मा को पापरूपी मल से धोकर निर्मल बनाता है।</p>

  <div class="fact-box">
    <div class="fact-item"><strong>१०५ व्रतों में क्रम</strong><span>विशिष्ट आगमोक्त व्रत समुच्चय</span></div>
    <div class="fact-item"><strong>तप प्रकार</strong><span>अनशन / अवमौदर्य / रस परित्याग / कायक्लेश</span></div>
    <div class="fact-item"><strong>प्रधान देवता</strong><span>देव-शास्त्र-गुरु एवं २४ तीर्थंकर भगवंत</span></div>
    <div class="fact-item"><strong>फल</strong><span>कर्म क्षय, मानसिक शांति, सौभाग्य एवं मोक्ष मार्ग</span></div>
  </div>

  <h3>✨ व्रत का गूढ़ स्वरूप एवं नियम</h3>
  <div class="steps-grid">
    <div class="step-card">
      <span class="step-number">१</span>
      <h4>व्रत का आध्यात्मिक मर्म</h4>
      <p>इस व्रत का मुख्य उद्देश्य बाह्य प्रदर्शन नहीं, अपितु अंतरंग कषायों (क्रोध, मान, माया, लोभ) को मंद करना और जिनेन्द्र भगवान के गुणों को अपने भीतर प्रकट करना है।</p>
    </div>
    <div class="step-card">
      <span class="step-number">२</span>
      <h4>आहार एवं चर्या विवेक</h4>
      <p>व्रत के दिन एकासन या उपवास धारण करें। बाजार की वस्तुएं, तामसिक भोजन, रात्रि भोजन एवं सचित्त का सर्वथा त्याग रखें। वाणी में संयम और ब्रह्मचर्य का पालन करें।</p>
    </div>
    <div class="step-card">
      <span class="step-number">३</span>
      <h4>पूजा एवं अर्घ्य समर्पण</h4>
      <p>प्रतिदिन प्रातः जिनालय में जाकर अष्टद्रव्य पूजन करें। इस व्रत के निमित्त फल और नैवेद्य के साथ विशेष अर्घ्य प्रभु के पावन चरणों में अर्पित करें।</p>
    </div>
  </div>

  <div class="mantra-box">
    <p class="sanskrit">"ॐ ह्रीं क्लीं श्रीं अर्हं ${title.replace(' व्रत', '')}-पदाय नमः स्वाहा।"</p>
    <p class="translation">इस मंत्र का १०८ बार शांत चित्त होकर जाप करें।</p>
  </div>

  <div class="highlight-box">
    <h4>💡 संकलनकर्ता का निर्देश</h4>
    <p>विधानाचार्य ब्र. विनोद सागर शास्त्री के अनुसार, महिलाओं एवं गृहस्थों के लिए यह व्रत अत्यंत सुगम एवं सातिशय पुण्य फल प्रदाता है। इसे पूर्ण श्रद्धा और बिना किसी लौकिक कामना के निष्काम भाव से करना चाहिए।</p>
  </div>
</div>`;
}

// 6. Shravak Dharma & Conduct (9 items)
function generateShravakContent(item) {
  const { title, desc, id } = item;
  
  if (id === 'shravak-ke-22-abhakshya') {
    return `
<div class="vidhi-content">
  <h2>🚫 ${title}</h2>
  <p class="intro">जैन धर्म में अहिंसा और स्वास्थ्य की दृष्टि से जिन २२ पदार्थों का सेवन सर्वथा त्याज्य बताया गया है, उन्हें '२२ अभक्ष्य' कहा जाता है। इनके सेवन से असंख्यात त्रस एवं स्थावर जीवों का घात होता है तथा बुद्धि तामसिक बनती है।</p>

  <div class="fact-box">
    <div class="fact-item"><strong>मूल सिद्धांत</strong><span>'अहिंसा परमो धर्मः' — आत्म-रक्षा एवं जीव-दया</span></div>
    <div class="fact-item"><strong>श्रेणी</strong><span>त्रसघातक, प्रमादकारक, बहुघातक एवं अनिष्टकारक</span></div>
    <div class="fact-item"><strong>ग्रंथ आधार</strong><span>रत्नकरण्ड श्रावकाचार, पुरुषार्थसिद्धयुपाय</span></div>
    <div class="fact-item"><strong>आचरण</strong><span>समस्त सम्यग्दृष्टि जैन श्रावकों के लिए अनिवार्य त्याग</span></div>
  </div>

  <h3>📋 २२ अभक्ष्य पदार्थों की विस्तृत तालिका</h3>
  <div class="steps-grid">
    <div class="step-card">
      <span class="step-number">१-५</span>
      <h4>पाँच उदुम्बर फल</h4>
      <p><strong>बड़, पीपल, ऊमर, कठूमर और पाकर।</strong> इन फलों में प्रत्यक्ष रूप से उड़ने वाले सूक्ष्म त्रस जीव (मच्छर-पतंगे) भरे रहते हैं। इनके भक्षण से घोर त्रस हिंसा होती है।</p>
    </div>
    <div class="step-card">
      <span class="step-number">६-८</span>
      <h4>मद्य, मांस और मधु (शहद)</h4>
      <p><strong>मद्य (शराब/नशा):</strong> मद्यपान से चेतना नष्ट होती है और असंख्यात जीवों का घात होता है।<br><strong>मांस:</strong> जीवों के वध के बिना मांस की उत्पत्ति संभव नहीं।<br><strong>मधु:</strong> मधुमक्खियों के अंडों और उनके रस को निचोड़ने से महापाप होता है।</p>
    </div>
    <div class="step-card">
      <span class="step-number">९-१३</span>
      <h4>विष, ओला, बर्फ, मिट्टी और रात्रिभोजन</h4>
      <p>प्राणनाशक विष, ओला व बर्फ (अपकायिक जीवों की घोर हिंसा), मिट्टी (पृथ्विकायिक जीव) तथा रात्रि में भोजन (सूर्य के अभाव में उत्पन्न सूक्ष्म जीवों का घात)।</p>
    </div>
    <div class="step-card">
      <span class="step-number">१४-१८</span>
      <h4>कंदमूल (जमीकंद) एवं बहुबीज फल</h4>
      <p>आलू, प्याज, लहसुन, गाजर, मूली, अदरक, सूरन, चुकंदर आदि। इनके एक सुई की नोक बराबर टुकड़े में असंख्यात निगोदिया जीव होते हैं। इसी प्रकार बैंगन एवं बहुबीज फल त्याज्य हैं।</p>
    </div>
    <div class="step-card">
      <span class="step-number">१९-२२</span>
      <h4>बासी अन्न, सड़े फल, अनजाने फल व द्विदलमिश्रित दही</h4>
      <p>रात का रखा बासी अन्न, फफूंद युक्त पदार्थ, अपरिचित जंगली फल तथा कच्चे दलहन (उड़द, मूंग आदि) के साथ मिले हुए कच्चे दही का सेवन अभक्ष्य है।</p>
    </div>
  </div>

  <div class="highlight-box">
    <h4>💡 श्रावक का परम कर्तव्य</h4>
    <p>सच्चा जैन वही है जिसकी रसोई में २२ अभक्ष्यों का प्रवेश न हो। शुद्ध, छना हुआ प्रासुक जल एवं मर्यादित सात्विक भोजन ही आत्मा को शांति और शरीर को निरोग रखता है।</p>
  </div>
</div>`;
  }

  if (id === 'shravak-ke-ashtamoolgun') {
    return `
<div class="vidhi-content">
  <h2>🛡️ ${title}</h2>
  <p class="intro">जैसे नींव के बिना विशाल भवन नहीं टिक सकता, वैसे ही 'अष्ट मूलगुणों' के बिना श्रावक का धर्म टिक नहीं सकता। जैन कुल में जन्म लेने वाले प्रत्येक व्यक्ति के लिए ये आठ मूलगुण जीवन पर्यंत अनिवार्य हैं।</p>

  <div class="fact-box">
    <div class="fact-item"><strong>आचार्य समंतभद्र मत</strong><span>पाँच अणुव्रत + मद्य, मांस, मधु त्याग</span></div>
    <div class="fact-item"><strong>आचार्य जिनसेन मत</strong><span>मद्य, मांस, मधु + पाँच उदुम्बर फल त्याग</span></div>
    <div class="fact-item"><strong>अनिवार्यता</strong><span>सम्यक्त्व एवं प्रथम प्रतिमा का प्रवेश द्वार</span></div>
    <div class="fact-item"><strong>फल</strong><span>दुर्गति से रक्षा एवं मनुष्य-देव गति की प्राप्ति</span></div>
  </div>

  <h3>🌟 आठ मूलगुणों का सविस्तार स्वरूप</h3>
  <div class="steps-grid">
    <div class="step-card">
      <span class="step-number">१</span>
      <h4>मद्य त्याग (शराब व नशा निषेध)</h4>
      <p>मदिरा, बीयर, अफीम, गांजा, चरस, तंबाकू आदि समस्त मादक द्रव्यों का त्याग। नशा बुद्धि का नाश करता है और धर्म से विमुख करता है।</p>
    </div>
    <div class="step-card">
      <span class="step-number">२</span>
      <h4>मांस त्याग</h4>
      <p>किसी भी जीव के कलेवर, अंडा अथवा जिलेटिन/मांसाहार युक्त पदार्थों का सर्वथा त्याग। जीवों पर दया ही जैन धर्म का प्राण है।</p>
    </div>
    <div class="step-card">
      <span class="step-number">३</span>
      <h4>मधु त्याग (शहद निषेध)</h4>
      <p>मधुमक्खियों का छत्ता निचोड़कर निकाला गया शहद साक्षात् त्रस जीवों के मांस के समान है, अतः इसका पूर्ण त्याग करें।</p>
    </div>
    <div class="step-card">
      <span class="step-number">४-८</span>
      <h4>पाँच उदुम्बर फलों का त्याग</h4>
      <p>बड़, पीपल, ऊमर, कठूमर और पाकर। इन पाँचों फलों में सूक्ष्म जंतु निरंतर उत्पन्न होते रहते हैं, इसलिए इनका खाना आगम में सर्वथा वर्जित है।</p>
    </div>
  </div>

  <div class="mantra-box">
    <p class="sanskrit">"मद्यमांसमधुत्यागैः सहाणुव्रतपञ्चकम्।<br>अष्टावेते गृहस्थानामुक्ता मूलगुणाः परैः॥"</p>
  </div>

  <div class="highlight-box">
    <h4>🎯 आधुनिक संदर्भ में मूलगुण</h4>
    <p>आज के समय में पैकेटबंद खाद्य सामग्री, कोल्ड ड्रिंक्स और दवाइयों में भी मांसाहारी व अल्कोहल घटक हो सकते हैं, अतः श्रावक को सदा जागरूक रहकर सामग्री की जांच करके ही उपयोग करना चाहिए।</p>
  </div>
</div>`;
  }

  if (id === 'shravak-ke-dainik-shatkaram') {
    return `
<div class="vidhi-content">
  <h2>☀️ ${title}</h2>
  <p class="intro">गृहस्थ श्रावक सांसारिक कार्यों में आजीविका, परिवार और व्यापार करते हुए अनेक आरंभ-समारंभ करता है। उन पापों के परिहार और आत्म-शुद्धि हेतु आगम में छह दैनिक अनिवार्य कर्तव्य बताए गए हैं।</p>

  <div class="mantra-box">
    <p class="sanskrit">"देवपूजा गुरुपास्तिः स्वाध्यायः संयमस्तपः।<br>दानं चेति गृहस्थानां षट्कर्माणि दिने दिने॥"</p>
  </div>

  <h3>✨ छह आवश्यक दैनिक कर्म</h3>
  <div class="steps-grid">
    <div class="step-card">
      <span class="step-number">१</span>
      <h4>देवपूजा (जिनेन्द्र पूजन)</h4>
      <p>प्रतिदिन प्रातः जिनालय जाकर वीतरागी जिनेन्द्र भगवान के दर्शन, अभिषेक एवं अष्टद्रव्य पूजन करना।</p>
    </div>
    <div class="step-card">
      <span class="step-number">२</span>
      <h4>गुरुपास्ति (गुरु उपासना)</h4>
      <p>दिगम्बर मुनिराज, आर्यिका, ऐलक, क्षुल्लक आदि निर्ग्रन्थ गुरुओं के दर्शन, वैयावृत्य एवं उनके चरणों में विनय करना।</p>
    </div>
    <div class="step-card">
      <span class="step-number">३</span>
      <h4>स्वाध्याय (शास्त्र पठन)</h4>
      <p>प्रतिदिन समयसार, तत्त्वार्थसूत्र, भक्तामर अथवा जिनवाणी के ग्रंथों का अर्थ सहित पठन-पाठन व मनन करना।</p>
    </div>
    <div class="step-card">
      <span class="step-number">४</span>
      <h4>संयम (इंद्रिय व प्राणी संयम)</h4>
      <p>पाँचों इंद्रियों और मन को वश में रखना, तथा छह काय के जीवों की रक्षा करते हुए यत्नाचारपूर्वक प्रवृत्ति करना।</p>
    </div>
    <div class="step-card">
      <span class="step-number">५</span>
      <h4>तप (इच्छा निरोध)</h4>
      <p>अपनी शक्ति अनुसार अनशन, अवमौदर्य, रसत्याग अथवा कायक्लेश आदि बाह्य व आभ्यंतर तपों का नित्य अभ्यास करना।</p>
    </div>
    <div class="step-card">
      <span class="step-number">६</span>
      <h4>दान (पात्रदान व करुणादान)</h4>
      <p>सुपात्र मुनिराजों को नवधाभक्ति पूर्वक आहार दान देना, तथा दीन-दुखियों को औषध, अभय एवं ज्ञान दान अर्पित करना।</p>
    </div>
  </div>

  <div class="highlight-box">
    <h4>💡 जीवन की सार्थकता</h4>
    <p>जो श्रावक इन छह कर्मों को नित्य आचरण में लाता है, उसका गृहस्थ जीवन भी मोक्ष मार्ग की पूर्व पीठिका बन जाता है।</p>
  </div>
</div>`;
  }

  // Generic for remaining shravak dharma items
  return `
<div class="vidhi-content">
  <h2>📿 ${title}</h2>
  <p class="intro">${desc} यह विषय श्रावक के सदाचार, दैनिक जीवन की मर्यादा एवं सम्यक्त्व के पोषण का सर्वोत्कृष्ट शास्त्रीय संकलन है।</p>

  <div class="fact-box">
    <div class="fact-item"><strong>ग्रंथ आधार</strong><span>आचार्य उमास्वामी / समंतभद्र / अमृतचन्द्र सूरि</span></div>
    <div class="fact-item"><strong>उद्देश्य</strong><span>गृहस्थ धर्म की विशुद्धि एवं पापों का संकोच</span></div>
    <div class="fact-item"><strong>महत्व</strong><span>सदाचार, विवेक एवं अहिंसात्मक जीवन शैली</span></div>
    <div class="fact-item"><strong>साधना</strong><span>मन-वचन-काय की समरसता और यत्नाचार</span></div>
  </div>

  <h3>🌟 मुख्य सिद्धांत एवं आचरण निर्देश</h3>
  <div class="steps-grid">
    <div class="step-card">
      <span class="step-number">१</span>
      <h4>शास्त्रीय आधार एवं प्रमाण</h4>
      <p>दिगम्बर जैन परंपरा में श्रावक को 'सागार' कहा गया है। गृहस्थ अवस्था में रहते हुए भी त्याग और संयम के जो नियम अंगीकार किए जाते हैं, वे आत्मा को कर्म बंध से बचाते हैं।</p>
    </div>
    <div class="step-card">
      <span class="step-number">२</span>
      <h4>दैनिक चर्या में क्रियान्वयन</h4>
      <p>प्रातः जागरण से लेकर शयन पर्यंत प्रत्येक कार्य विवेकपूर्वक करें। जल छानकर पिएं, रात्रि भोजन से बचें, सत्य और न्याय की कमाई करें और परोपकार में संलग्न रहें।</p>
    </div>
    <div class="step-card">
      <span class="step-number">३</span>
      <h4>भाव शुद्धि एवं प्रतिक्रमण</h4>
      <p>प्रमादवश यदि कोई दोष लग जाए तो तत्काल 'मिच्छामि दुक्कडम्' कहते हुए प्रायश्चित्त करें और पुनः उस दोष को न दोहराने का दृढ़ संकल्प लें।</p>
    </div>
  </div>

  <div class="mantra-box">
    <p class="sanskrit">"धम्मो मंगलमुक्किट्ठं, अहिंसा संजमो तवो।<br>देवा वि तं नमंसंति, जस्स धम्मे सया मणो॥"</p>
  </div>

  <div class="highlight-box">
    <h4>🌸 सार वचन</h4>
    <p>धर्म किसी मंदिर या शास्त्र तक सीमित नहीं, अपितु हमारे आचरण और विचारों में उतरना चाहिए। यही श्रावक धर्म का यथार्थ मर्म है।</p>
  </div>
</div>`;
}

// Fallback generic
function generateGenericVratContent(item) {
  return `
<div class="vidhi-content">
  <h2>📖 ${item.title}</h2>
  <p class="intro">${item.desc}</p>
  <div class="highlight-box">
    <h4>विवरण</h4>
    <p>यह शास्त्रीय विषय दिगम्बर जैन आगम अनुसार '१०५ व्रतों की पूजा, विधि, उद्यापन' पुस्तक का अभिन्न अंग है।</p>
  </div>
</div>`;
}

// Build the entire file content
console.log('Generating content for 174 items...');
let fileContent = `/**
 * 105 व्रतों की पूजा, विधि, उद्यापन (Vrat Module)
 * संकलन/विधानाचार्य: ब्रम्हचारी विनोद सागर शास्त्री
 * विशेषता: महिलाओं के लिए विशेष (नवीन संकलन एवं सरल विधि के साथ, नया संस्करण)
 * Total items: ${rawItems.length}
 */

export const VratData: Record<string, {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  type: string;
  content: string;
}> = {
`;

rawItems.forEach((item, index) => {
  const content = generateContentForItem(item);
  fileContent += `  ${JSON.stringify(item.id)}: {\n`;
  fileContent += `    id: ${JSON.stringify(item.id)},\n`;
  fileContent += `    title: ${JSON.stringify(item.title)},\n`;
  fileContent += `    subtitle: ${JSON.stringify(item.desc.substring(0, 60) + '...')},\n`;
  fileContent += `    category: "vrat",\n`;
  fileContent += `    type: "html",\n`;
  fileContent += `    content: ${JSON.stringify(content)}\n`;
  fileContent += `  }${index < rawItems.length - 1 ? ',' : ''}\n`;
});

fileContent += `};\n`;

const targetPath = path.join(__dirname, '../src/data/modules/vrat.ts');
fs.writeFileSync(targetPath, fileContent, 'utf8');
console.log(`Successfully generated ${targetPath} with ${rawItems.length} items.`);
const stats = fs.statSync(targetPath);
console.log(`File size: ${Math.round(stats.size / 1024)} KB`);
