import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import {
  ChevronLeft,
  MapPin,
  Navigation,
  Sparkles,
  Crown,
  Compass,
  X,
  Phone,
  Train,
  Plane,
  ExternalLink,
  Search,
} from 'lucide-react';
import { useModalBackHandler } from '../lib';

interface PilgrimagePageProps {
  onBack: () => void;
}

interface KshetraDef {
  id: string;
  nameHindi: string;
  location: string;
  state: string;
  significance: string;
  category: 'सिद्ध क्षेत्र' | 'अतिशय क्षेत्र' | 'कल्याणक क्षेत्र';
  description: string;
  howToReach: string;
  railway: string;
  airport: string;
  mapQuery: string;
  dharamshala: string;
}

const pilgrimageData: KshetraDef[] = [
  {
    id: 'shikharji',
    nameHindi: 'श्री सम्मेद शिखरजी',
    location: 'पारसनाथ पर्वत, गिरिडीह',
    state: 'झारखंड',
    significance: '२० तीर्थंकरों एवं असंख्य मुनिराजों की पावन निर्वाण भूमि',
    category: 'सिद्ध क्षेत्र',
    description:
      'सम्मेद शिखरजी दिगम्बर जैन आम्नाय का सर्वोच्च एवं सर्वाधिक पवित्र शाश्वत सिद्ध क्षेत्र है। यहाँ भगवान पार्श्वनाथ सहित २० तीर्थंकरों एवं असंख्य मुनिराजों ने तपस्या कर मोक्ष प्राप्त किया। मधुबन तलहटी से पर्वत वंदना में २७ किलोमीटर की पावन परिक्रमा होती है।',
    howToReach: 'मधुबन तलहटी से पैदल अथवा डोली द्वारा पर्वत वंदना की जाती है।',
    railway: 'पारसनाथ रेलवे स्टेशन (PNME) - २२ किमी, नेताजी सुभाष चंद्र बोस जंक्शन गोमो - ३५ किमी',
    airport: 'काजी नजरुल इस्लाम हवाई अड्डा दुर्गापुर (१४० किमी) / रांची हवाई अड्डा (१६० किमी)',
    mapQuery: 'Shikharji+Madhuban+Jharkhand',
    dharamshala: 'मधुबन में दिगम्बर समाज की अनेक विशाल धर्मशालाएं, कोठियां एवं शुद्ध भोजनशालाएं उपलब्ध हैं।',
  },
  {
    id: 'girnar',
    nameHindi: 'श्री गिरनार जी तीर्थ',
    location: 'जूनागढ़',
    state: 'गुजरात',
    significance: '२२वें तीर्थंकर भगवान नेमिनाथ की दीक्षा, केवलज्ञान एवं मोक्ष स्थली',
    category: 'सिद्ध क्षेत्र',
    description:
      'गिरनार जी अत्यंत प्राचीन सिद्ध क्षेत्र है जहाँ भगवान नेमिनाथ ने राजुल के साथ विवाह का त्याग कर घोर तपस्या की और ५वीं टोंक (ऊर्जयंत पर्वत) से निर्वाण प्राप्त किया। यहाँ लगभग १०,००० सीढ़ियों की पावन चढ़ाई है तथा रोपवे भी उपलब्ध है।',
    howToReach: 'जूनागढ़ शहर से भवनाथ तलहटी पहुँचकर सीढ़ियों अथवा रोपवे द्वारा वंदना की जाती है।',
    railway: 'जूनागढ़ जंक्शन (JND) - ६ किमी',
    airport: 'राजकोट अंतरराष्ट्रीय हवाई अड्डा (१०० किमी) / पोरबंदर (१०० किमी)',
    mapQuery: 'Girnar+Jain+Temple+Junagadh',
    dharamshala: 'भवनाथ तलहटी एवं जूनागढ़ नगर में दिगम्बर धर्मशालाएं एवं अन्नक्षेत्र उपलब्ध हैं।',
  },
  {
    id: 'pavapuri',
    nameHindi: 'श्री पावापुरी जी तीर्थ',
    location: 'नालंदा',
    state: 'बिहार',
    significance: '२४वें तीर्थंकर भगवान महावीर स्वामी की पावन निर्वाण स्थली',
    category: 'सिद्ध क्षेत्र',
    description:
      'पावापुरी में चरम तीर्थंकर भगवान महावीर स्वामी ने कार्तिक कृष्ण अमावस्या (दीपावली की प्रातः) को निर्वाण प्राप्त किया। यहाँ कमल-सरोवर के मध्य स्थित श्वेत संगमरमर का अलौकिक जलमंदिर विश्व-विख्यात है।',
    howToReach: 'पटना अथवा राजगीर से सड़क मार्ग द्वारा सुगमता से पहुँचा जा सकता है।',
    railway: 'पावापुरी रोड रेलवे स्टेशन (POE) - १० किमी / राजगीर स्टेशन - २० किमी',
    airport: 'जयप्रकाश नारायण अंतरराष्ट्रीय हवाई अड्डा, पटना (९० किमी) / गया हवाई अड्डा (९५ किमी)',
    mapQuery: 'Jal+Mandir+Pawapuri+Bihar',
    dharamshala: 'जलमंदिर एवं गाँव मंदिर के समीप अनेक भव्य दिगम्बर धर्मशालाएं व भोजनशालाएं स्थित हैं।',
  },
  {
    id: 'champapuri',
    nameHindi: 'श्री चंपापुरी जी तीर्थ',
    location: 'भागलपुर',
    state: 'बिहार',
    significance: '१२वें तीर्थंकर भगवान वासुपूज्य स्वामी के पंचकल्याणक तीर्थ',
    category: 'सिद्ध क्षेत्र',
    description:
      'चंपापुरी महातीर्थ १२वें तीर्थंकर भगवान वासुपूज्य स्वामी के गर्भ, जन्म, तप, केवलज्ञान एवं मोक्ष - पाँचों कल्याणकों से पवित्र भूमि है। यहाँ दानवीर राजा कर्ण एवं सती सुभद्रा का भी ऐतिहासिक संबंध रहा है।',
    howToReach: 'भागलपुर शहर से नाथनगर स्थित मंदिर परिसर हेतु ऑटो व ई-रिक्शा उपलब्ध हैं।',
    railway: 'भागलपुर जंक्शन (BGP) - ४ किमी / नाथनगर स्टेशन - १ किमी',
    airport: 'पटना हवाई अड्डा (२२० किमी) / देवघर हवाई अड्डा (१२० किमी)',
    mapQuery: 'Champapuri+Jain+Temple+Bhagalpur',
    dharamshala: 'दिगम्बर जैन सिद्धक्षेत्र चम्पापुरी में आवास व शुद्ध भोजन की उत्तम व्यवस्था है।',
  },
  {
    id: 'bawangaja',
    nameHindi: 'श्री बावनगजा (चूलगिरि) तीर्थ',
    location: 'बड़वानी',
    state: 'मध्य प्रदेश',
    significance: 'प्रथम तीर्थंकर आदिनाथ की ८४ फीट विशाल प्राचीन प्रतिमा व कुंभकर्ण-इन्द्रजीत निर्वाण',
    category: 'सिद्ध क्षेत्र',
    description:
      'सतपुड़ा पर्वत श्रृंखला में स्थित चूलगिरि पर्वत पर एक ही पाषाण को तराशकर बनाई गई भगवान ऋषभदेव की ८४ फीट ऊँची १२वीं शताब्दी की विशाल खड्गासन प्रतिमा है। यहाँ से रावण के भाई कुंभकर्ण एवं पुत्र इन्द्रजीत सहित करोड़ों मुनियों ने मोक्ष प्राप्त किया।',
    howToReach: 'बड़वानी जिला मुख्यालय से ८ किमी, इंदौर से सड़क मार्ग द्वारा पहुँचा जाता है।',
    railway: 'खंडवा स्टेशन - १५० किमी / इंदौर जंक्शन - १५० किमी',
    airport: 'देवी अहिल्याबाई होल्कर हवाई अड्डा, इंदौर (१५० किमी)',
    mapQuery: 'Bawangaja+Jain+Temple+Barwani',
    dharamshala: 'पर्वत तलहटी एवं ऊपर चूलगिरि पर विशाल दिगम्बर धर्मशालाएं एवं भोजनशालाएं हैं।',
  },
  {
    id: 'mangi-tungi',
    nameHindi: 'श्री मांगीतुंगी जी तीर्थ',
    location: 'सटाणा, नासिक',
    state: 'महाराष्ट्र',
    significance: 'भगवान राम, सुग्रीव, गवय, गवाक्ष सहित ९९ करोड़ मुनियों की मोक्ष स्थली',
    category: 'सिद्ध क्षेत्र',
    description:
      'मांगी एवं तुंगी दो उत्तुंग पर्वतों की चोटियों पर अनेक प्राचीन दिगम्बर जैन गुफाएं हैं। यहाँ से भगवान रामचन्द्र जी के साथ ९९ करोड़ मुनिराजों ने निर्वाण पाया। पर्वत तलहटी में भगवान ऋषभदेव की १०८ फीट ऊँची भव्य एकाश्म अहिंसा प्रतिमा स्थापित है।',
    howToReach: 'नासिक अथवा मनमाड से सड़क मार्ग (सटाणा होते हुए) सुगम है।',
    railway: 'मनमाड जंक्शन (MMR) - ७५ किमी / नासिक रोड स्टेशन - १२० किमी',
    airport: 'नासिक हवाई अड्डा ओझर (१०० किमी) / मुंबई (२८० किमी)',
    mapQuery: 'Mangi+Tungi+Jain+Temple+Maharashtra',
    dharamshala: 'तलहटी में १०८ फीट अहिंसा प्रतिमा परिसर में सर्व-सुविधायुक्त धर्मशालाएं उपलब्ध हैं।',
  },
  {
    id: 'sonagir',
    nameHindi: 'श्री सोनागिरि जी तीर्थ',
    location: 'दतिया',
    state: 'मध्य प्रदेश',
    significance: 'नंग-अनंग कुमार सहित साढ़े पाँच करोड़ मुनिराजों की मोक्ष स्थली',
    category: 'सिद्ध क्षेत्र',
    description:
      'स्वर्णगिरि पर्वत पर स्थित ७७ दिगम्बर जैन मंदिर दूर से ही श्वेत शिखरों के रूप में सुशोभित होते हैं। मुख्य मंदिर ५७वें नंबर का भगवान चंद्रप्रभ का है, जहाँ ध्यान एवं आत्म-साधना का अपूर्व वातावरण है।',
    howToReach: 'ग्वालियर एवं झांसी के मध्य मुख्य रेल व राजमार्ग पर स्थित है।',
    railway: 'सोनागिर रेलवे स्टेशन (SOR) - ३ किमी / दतिया - १५ किमी / ग्वालियर - ६५ किमी',
    airport: 'ग्वालियर हवाई अड्डा (७० किमी)',
    mapQuery: 'Sonagir+Jain+Temple+Madhya+Pradesh',
    dharamshala: 'पर्वत तलहटी में अनेक प्राचीन व नवीन धर्मशालाएं एवं त्यागी वृत्ति भवन स्थित हैं।',
  },
  {
    id: 'muktagiri',
    nameHindi: 'श्री मुक्तागिरि (मेढ़ागिरि) तीर्थ',
    location: 'बैतूल - अमरावती सीमा',
    state: 'मध्य प्रदेश',
    significance: 'साढ़े तीन करोड़ मुनिराजों की निर्वाण भूमि एवं ५२ प्राचीन जिनालय',
    category: 'सिद्ध क्षेत्र',
    description:
      'सतपुड़ा की सुरम्य वादियों में स्थित मुक्तागिरि पर्वत पर ५२ सुंदर दिगम्बर जैन मंदिर स्थित हैं। यहाँ एक पावन प्राकृतिक जलप्रपात बहता है। जनश्रुति अनुसार यहाँ केसर और मोतियों की वर्षा हुई थी, जिससे इसका नाम मुक्तागिरि पड़ा।',
    howToReach: 'परतवाड़ा (अमरावती) से १४ किमी अथवा बैतूल से सड़क मार्ग द्वारा सुगम।',
    railway: 'बैतूल रेलवे स्टेशन (BZU) - १०० किमी / बडनेरा जंक्शन - ८० किमी',
    airport: 'डॉ. बाबासाहेब आंबेडकर अंतरराष्ट्रीय हवाई अड्डा, नागपुर (१७० किमी)',
    mapQuery: 'Muktagiri+Jain+Temple+Madhya+Pradesh',
    dharamshala: 'तलहटी में विशाल दिगम्बर धर्मशाला, अतिथि गृह एवं शुद्ध सात्विक भोजनशाला उपलब्ध है।',
  },
  {
    id: 'kundalpur',
    nameHindi: 'श्री कुंडलपुर महातीर्थ',
    location: 'पटेरा, दमोह',
    state: 'मध्य प्रदेश',
    significance: 'बड़े बाबा (भगवान ऋषभदेव) की अलौकिक पद्मासन प्रतिमा व सहस्राब्दी महामंदिर',
    category: 'अतिशय क्षेत्र',
    description:
      'कुंडलपुर में ६३ जिनालयों की पर्वतमाला है। यहाँ पूज्य आचार्य श्री विद्यासागर जी महाराज की प्रेरणा से भारतीय स्थापत्य कला का अनुपम सहस्राब्दी महामंदिर निर्मित हुआ है, जहाँ "बड़े बाबा" भगवान आदिनाथ की अतिशयकारी प्रतिमा पद्मासन मुद्रा में विराजमान है।',
    howToReach: 'दमोह जिला मुख्यालय से ३५ किमी की दूरी पर स्थित है।',
    railway: 'दमोह रेलवे स्टेशन (DMO) - ३५ किमी / सागर स्टेशन - ११० किमी',
    airport: 'जबलपुर हवाई अड्डा (१४० किमी) / खजुराहो हवाई अड्डा (१४५ किमी)',
    mapQuery: 'Kundalpur+Damoh+Madhya+Pradesh',
    dharamshala: 'कुंडलपुर तीर्थ क्षेत्र ट्रस्ट द्वारा सैकड़ों वातानुकूलित कमरे एवं निःशुल्क भोजनशालाएं संचालित हैं।',
  },
  {
    id: 'shravanabelagola',
    nameHindi: 'श्री श्रवणबेलगोला तीर्थ',
    location: 'हासन जिला',
    state: 'कर्नाटक',
    significance: 'भगवान गोम्मटेश्वर बाहुबली स्वामी की ५७ फीट उत्तुंग एकाश्म प्रतिमा',
    category: 'अतिशय क्षेत्र',
    description:
      'विंध्यगिरि पर्वत पर स्थित भगवान बाहुबली की ५७ फीट ऊँची एकाश्म प्रतिमा विश्व की अद्वितीय शिल्पकला है, जिसे सन् ९८१ में सेनापति चामुंडराय ने प्रतिष्ठापित कराया था। समीप ही चंद्रगिरि पर्वत पर श्रुतकेवली भद्रबाहु स्वामी एवं सम्राट चंद्रगुप्त मौर्य की साधना गुफा है।',
    howToReach: 'बेंगलुरु अथवा मैसूर से राष्ट्रीय राजमार्ग द्वारा सड़क व रेल मार्ग से सीधे जुड़ा है।',
    railway: 'श्रवणबेलगोला रेलवे स्टेशन (SBGA) - २ किमी',
    airport: 'केंपेगौड़ा अंतरराष्ट्रीय हवाई अड्डा, बेंगलुरु (१४५ किमी)',
    mapQuery: 'Shravanabelagola+Gommateshwara',
    dharamshala: 'क्षेत्रीय जैन मठ के अंतर्गत अनेक विशाल यात्री निवास एवं अन्नछत्र संचालित हैं।',
  },
  {
    id: 'tijara',
    nameHindi: 'श्री तिजारा जी अतिशय क्षेत्र',
    location: 'खैरथल-तिजारा',
    state: 'राजस्थान',
    significance: '८वें तीर्थंकर भगवान चंद्रप्रभ स्वामी की भूगर्भ से प्रगट चमत्कारी प्रतिमा',
    category: 'अतिशय क्षेत्र',
    description:
      'सन् १९५६ में टीले की खुदाई के समय भूगर्भ से प्रगट भगवान चंद्रप्रभ की श्वेत पद्मासन प्रतिमा का यह विश्व-प्रसिद्ध अतिशय क्षेत्र है। यहाँ आने वाले भक्तों के सभी मानसिक एवं शारीरिक कष्ट दूर होते हैं।',
    howToReach: 'दिल्ली (१०० किमी), गुरुग्राम (८० किमी) और अलवर (५५ किमी) से सीधे सड़क मार्ग द्वारा जुड़ा है।',
    railway: 'अलवर जंक्शन (AWR) - ५५ किमी / रेवाड़ी स्टेशन - ५० किमी',
    airport: 'इंदिरा गांधी अंतरराष्ट्रीय हवाई अड्डा, नई दिल्ली (९० किमी)',
    mapQuery: 'Tijara+Jain+Mandir+Rajasthan',
    dharamshala: 'अतिशय क्षेत्र परिसर में आधुनिक गेस्ट हाउस, एसी कमरे व शुद्ध भोजनालय उपलब्ध हैं।',
  },
  {
    id: 'mahavirji',
    nameHindi: 'श्री महावीर जी अतिशय क्षेत्र',
    location: 'चांदनपुर, करौली',
    state: 'राजस्थान',
    significance: 'गंभीरी नदी तट पर टीले से प्रगट भगवान महावीर स्वामी की चमत्कारी प्रतिमा',
    category: 'अतिशय क्षेत्र',
    description:
      'चांदनपुर के टीले से कामधेनु गाय के दुग्ध अभिषेक से प्रगट भगवान महावीर स्वामी की रक्ताभ पाषाण की प्राचीन पद्मासन प्रतिमा का यह देश का सर्वाधिक प्रख्यात दिगम्बर अतिशय क्षेत्र है। यहाँ प्रतिवर्ष वैशाख कृष्ण में लक्खी मेला आयोजित होता है।',
    howToReach: 'सवाई माधोपुर, जयपुर अथवा दिल्ली-मुंबई मुख्य रेलवे लाइन पर स्थित।',
    railway: 'श्री महावीर जी रेलवे स्टेशन (SMBJ) - ६ किमी',
    airport: 'जयपुर अंतरराष्ट्रीय हवाई अड्डा (१४० किमी)',
    mapQuery: 'Shri+Mahavir+Ji+Temple+Rajasthan',
    dharamshala: 'क्षेत्र प्रबंधकारिणी समिति द्वारा संचालित अनेक विशाल धर्मशालाएं, कटले व भोजनशालाएं।',
  },
  {
    id: 'padampura',
    nameHindi: 'श्री बाड़ा पदमपुरा अतिशय क्षेत्र',
    location: 'शिवदासपुरा, जयपुर',
    state: 'राजस्थान',
    significance: '६वें तीर्थंकर भगवान पद्मप्रभु स्वामी की चमत्कारी रक्ताभ प्रतिमा',
    category: 'अतिशय क्षेत्र',
    description:
      'सन् १९४४ में बाड़ा ग्राम में नींव खोदते समय भगवान पद्मप्रभु की रक्ताभ पाषाण की पद्मासन प्रतिमा प्रगट हुई थी। यहाँ दर्शन एवं शांतिधारा से मनोकामनाएं पूर्ण होती हैं।',
    howToReach: 'जयपुर शहर से टोंक रोड पर मात्र ३५ किमी की दूरी पर स्थित।',
    railway: 'शिवदासपुरा स्टेशन - ४ किमी / जयपुर जंक्शन - ३८ किमी',
    airport: 'जयपुर अंतरराष्ट्रीय हवाई अड्डा (२८ किमी)',
    mapQuery: 'Padampura+Jain+Temple+Jaipur',
    dharamshala: 'अतिशय क्षेत्र परिसर में आधुनिक वातानुकूलित धर्मशालाएं, डीलक्स कमरे व उत्तम भोजनशाला।',
  },
  {
    id: 'chandkhedi',
    nameHindi: 'श्री चांदखेड़ी अतिशय क्षेत्र',
    location: 'खानपुर, झालावाड़',
    state: 'राजस्थान',
    significance: 'भूगर्भ जिनालय में भगवान आदिनाथ स्वामी की अलौकिक चमत्कारी पद्मासन प्रतिमा',
    category: 'अतिशय क्षेत्र',
    description:
      'संवत् १७४६ में कोटा रियासत के मंत्री किशनदास जी द्वारा निर्मित यह भूगर्भ जिनालय है। यहाँ भूतल के नीचे भगवान आदिनाथ की पाषाण प्रतिमा विराजमान है, जिनके चरणों में सदैव अपूर्व शांति की अनुभूति होती है।',
    howToReach: 'झालावाड़ जिला मुख्यालय से ३२ किमी एवं कोटा से ९० किमी दूर स्थित।',
    railway: 'झालावाड़ सिटी स्टेशन - ३५ किमी / रामगंज मंडी जंक्शन - ६५ किमी',
    airport: 'इंदौर हवाई अड्डा (२४० किमी) / जयपुर (३०० किमी)',
    mapQuery: 'Chandkhedi+Jain+Temple+Jhalawar',
    dharamshala: 'क्षेत्र पर आधुनिक सर्व-सुविधायुक्त धर्मशालाएं एवं अन्नपूर्णा भोजनशाला संचालित हैं।',
  },
  {
    id: 'siddhavarakuta',
    nameHindi: 'श्री सिद्धवरकूट तीर्थ',
    location: 'ओंकारेश्वर, बड़वाह, खरगोन',
    state: 'मध्य प्रदेश',
    significance: 'दो चक्रवर्ती, १० कामदेव एवं साढ़े तीन करोड़ मुनिराजों की मोक्ष स्थली',
    category: 'सिद्ध क्षेत्र',
    description:
      'नर्मदा और कावेरी नदियों के पावन संगम पर स्थित यह प्राचीन सिद्ध क्षेत्र है, जहाँ से चक्रवर्ती एवं करोड़ों मुनियों ने निर्वाण पाया। यहाँ मुख्य मंदिर में भगवान आदिनाथ, शांतिनाथ एवं चंद्रप्रभ की अतिशयकारी प्राचीन प्रतिमाएं हैं।',
    howToReach: 'ओंकारेश्वर ज्योतिर्लिंग के निकट, इंदौर से ८० किमी की दूरी पर स्थित।',
    railway: 'बड़वाह रेलवे स्टेशन - १२ किमी / इंदौर जंक्शन - ८० किमी',
    airport: 'इंदौर हवाई अड्डा (८५ किमी)',
    mapQuery: 'Siddhavarakuta+Jain+Temple+Madhya+Pradesh',
    dharamshala: 'नर्मदा तट पर शांत प्राकृतिक वातावरण में दिगम्बर धर्मशालाएं एवं भोजनशालाएं उपलब्ध हैं।',
  },
  {
    id: 'dronagiri',
    nameHindi: 'श्री द्रोणगिरि जी तीर्थ',
    location: 'सेंधपा, छतरपुर',
    state: 'मध्य प्रदेश',
    significance: 'गुरुदत्त आदि साढ़े चार करोड़ मुनिराजों की पावन निर्वाण स्थली',
    category: 'सिद्ध क्षेत्र',
    description:
      'बुंदेलखंड के छतरपुर जिले में द्रोणगिरि पर्वत पर अनेक प्राचीन दिगम्बर जिनालय हैं। यहाँ भगवान चंद्रप्रभ का मुख्य मंदिर तथा गुफाएं हैं जहाँ गुरुदत्त मुनिराज ने भीषण शीत में कठोर तपस्या कर मोक्ष प्राप्त किया।',
    howToReach: 'छतरपुर से ५० किमी, टीकमगढ़ से ६० किमी दूरी पर स्थित।',
    railway: 'ललितपुर जंक्शन - ९० किमी / खजुराहो स्टेशन - ९० किमी',
    airport: 'खजुराहो हवाई अड्डा (९० किमी)',
    mapQuery: 'Dronagiri+Jain+Temple+Chhatarpur',
    dharamshala: 'पर्वत तलहटी में धर्मशालाएं, त्यागी भवन एवं शुद्ध भोजनालय की व्यवस्था है।',
  },
  {
    id: 'moodbidri',
    nameHindi: 'श्री मूडबिद्री (जैन काशी)',
    location: 'दक्षिण कन्नड़',
    state: 'कर्नाटक',
    significance: '१८ प्राचीन बसदियां, सहस्र स्तंभ बसदी एवं धवला-जयधवला मूल ताड़पत्रीय पांडुलिपि धरोहर',
    category: 'अतिशय क्षेत्र',
    description:
      'मूडबिद्री को दक्षिण भारत की "जैन काशी" कहा जाता है। यहाँ त्रिभुवन तिलक चूड़ामणि (हजार स्तंभ बसदी) काष्ठ व पाषाण शिल्प का अद्भुत चमत्कार है। यहाँ जैन मठ में षट्खण्डागम की मूल ताड़पत्रीय धवला, जयधवला एवं महाधवला पांडुलिपियां सुरक्षित हैं।',
    howToReach: 'मंगलुरु से ३५ किमी की दूरी पर स्थित राष्ट्रीय राजमार्ग पर।',
    railway: 'मंगलुरु जंक्शन (MAJN) - ३५ किमी',
    airport: 'मंगलुरु अंतरराष्ट्रीय हवाई अड्डा (२० किमी)',
    mapQuery: 'Moodbidri+Thousand+Pillar+Temple',
    dharamshala: 'जैन मठ परिसर एवं मूडबिद्री नगर में सुसज्जित दिगम्बर यात्री निवास स्थित हैं।',
  },
  {
    id: 'karkala',
    nameHindi: 'श्री करकला तीर्थ',
    location: 'उडुपी',
    state: 'कर्नाटक',
    significance: 'भगवान बाहुबली स्वामी की ४२ फीट विशाल एकाश्म प्रतिमा एवं चतुर्मुख बसदी',
    category: 'अतिशय क्षेत्र',
    description:
      'करकला में पर्वत की चोटी पर सन् १४३२ में भैररस राजा वीर पांड्य द्वारा स्थापित भगवान बाहुबली की ४२ फीट ऊँची एकाश्म प्रतिमा है। समीप ही अद्वितीय "चतुर्मुख बसदी" स्थित है जिसके चारों दिशाओं में समान द्वार एवं प्रतिमाएं हैं।',
    howToReach: 'उडुपी से ३५ किमी एवं मूडबिद्री से १८ किमी दूर स्थित।',
    railway: 'उडुपी रेलवे स्टेशन (UD) - ३५ किमी',
    airport: 'मंगलुरु हवाई अड्डा (४५ किमी)',
    mapQuery: 'Karkala+Gommateshwara+Karnataka',
    dharamshala: 'क्षेत्र परिसर में दिगम्बर धर्मशालाएं एवं भोजनशालाएं संचालित हैं।',
  },
  {
    id: 'ahicchatra',
    nameHindi: 'श्री अहिच्छत्र अतिशय क्षेत्र',
    location: 'रामनगर, आंवला, बरेली',
    state: 'उत्तर प्रदेश',
    significance: 'भगवान पार्श्वनाथ की तप एवं कमठ उपसर्ग विजेता केवलज्ञान स्थली',
    category: 'अतिशय क्षेत्र',
    description:
      'यह वही पावन क्षेत्र है जहाँ धरणेन्द्र पद्मावती ने फण फैलाकर तपस्यारत भगवान पार्श्वनाथ पर कमठ द्वारा किए गए घोर मूसलाधार जल-उपसर्ग का निवारण किया था और भगवान को केवलज्ञान प्रगट हुआ था।',
    howToReach: 'बरेली से ५० किमी, आंवला रेलवे स्टेशन से १४ किमी दूरी पर स्थित।',
    railway: 'आंवला रेलवे स्टेशन (AO) - १४ किमी / बरेली जंक्शन - ५० किमी',
    airport: 'बरेली हवाई अड्डा (५५ किमी) / दिल्ली (२६० किमी)',
    mapQuery: 'Ahicchatra+Jain+Temple+Bareilly',
    dharamshala: 'अतिशय क्षेत्र परिसर में आधुनिक वातानुकूलित कमरे, हाल एवं शुद्ध भोजनशाला उपलब्ध हैं।',
  },
  {
    id: 'hastinapur',
    nameHindi: 'श्री हस्तिनापुर महातीर्थ',
    location: 'मेरठ',
    state: 'उत्तर प्रदेश',
    significance: '१६वें, १७वें, १८वें तीर्थंकर (शांतिनाथ, कुंथुनाथ, अरहनाथ) की गर्भ, जन्म, तप व केवलज्ञान भूमि',
    category: 'कल्याणक क्षेत्र',
    description:
      'हस्तिनापुर तीन तीर्थंकरों की पावन कल्याणक भूमि है तथा यहाँ भगवान आदिनाथ का प्रथम पारणा राजा श्रेयांस द्वारा इक्षुरस से हुआ (अक्षय तृतीया)। यहाँ प्राचीन दिगम्बर बड़ा मंदिर, पूज्य ज्ञानमती माताजी की प्रेरणा से निर्मित जम्बूद्वीप रचना एवं त्रिलोक शोध संस्थान स्थित है।',
    howToReach: 'मेरठ जिला मुख्यालय से ३८ किमी एवं दिल्ली से ११० किमी की दूरी पर स्थित।',
    railway: 'मेरठ सिटी जंक्शन (MTC) - ४० किमी',
    airport: 'इंदिरा गांधी अंतरराष्ट्रीय हवाई अड्डा, नई दिल्ली (१२० किमी)',
    mapQuery: 'Hastinapur+Jain+Temple+Meerut',
    dharamshala: 'प्राचीन बड़ा मंदिर एवं जम्बूद्वीप परिसर में सैकड़ों आधुनिक कमरे व भोजनशालाएं हैं।',
  },
  {
    id: 'ayodhya',
    nameHindi: 'श्री अयोध्या जी महातीर्थ',
    location: 'अयोध्या',
    state: 'उत्तर प्रदेश',
    significance: 'प्रथम तीर्थंकर ऋषभदेव सहित ५ तीर्थंकरों (अजित, अभिनंदन, सुमति, अनंत) की जन्म व कल्याणक भूमि',
    category: 'कल्याणक क्षेत्र',
    description:
      'अयोध्या दिगम्बर जैन परंपरा की शाश्वत पावन तीर्थ भूमि है। यहाँ प्रथम तीर्थंकर भगवान ऋषभदेव, द्वितीय अजितनाथ, चतुर्थ अभिनंदननाथ, पंचम सुमतिनाथ एवं चतुर्दश अनंतनाथ स्वामी के गर्भ व जन्म कल्याणक हुए। यहाँ रायगंज स्थित ३१ फीट ऊँची भगवान ऋषभदेव प्रतिमा एवं प्राचीन टोंकें दर्शनीय हैं।',
    howToReach: 'लखनऊ एवं वाराणसी से मुख्य रेल व फोर-लेन सड़क मार्ग से सीधे जुड़ा है।',
    railway: 'अयोध्या धाम जंक्शन (AY) - ३ किमी / अयोध्या कैंट - ७ किमी',
    airport: 'महर्षि वाल्मीकि अंतरराष्ट्रीय हवाई अड्डा, अयोध्या (८ किमी)',
    mapQuery: 'Badi+Murti+Jain+Temple+Ayodhya',
    dharamshala: 'दिगम्बर जैन मंदिर रायगंज एवं कटरा में आधुनिक धर्मशालाएं व भोजनशालाएं उपलब्ध हैं।',
  },
  {
    id: 'kundalpur-nalanda',
    nameHindi: 'श्री कुण्डलपुर (नालंदा) तीर्थ',
    location: 'नालंदा',
    state: 'बिहार',
    significance: '२४वें तीर्थंकर भगवान महावीर स्वामी की पावन जन्म एवं दीक्षा भूमि',
    category: 'कल्याणक क्षेत्र',
    description:
      'दिगम्बर जैन परंपरा के अनुसार भगवान महावीर स्वामी का जन्म कुण्डलपुर (नालंदा, बिहार) में राजा सिद्धार्थ और महारानी त्रिशला के राजमहल में हुआ था। यहाँ विशाल नंदीश्वर द्वीप जिनालय, ध्यान केंद्र एवं प्राचीन चरण पादुकाएं स्थापित हैं।',
    howToReach: 'नालंदा खंडहर के समीप, राजगीर से १५ किमी एवं पटना से ८५ किमी।',
    railway: 'नालंदा रेलवे स्टेशन (NLD) - ४ किमी / राजगीर - १५ किमी',
    airport: 'पटना अंतरराष्ट्रीय हवाई अड्डा (८५ किमी)',
    mapQuery: 'Kundalpur+Jain+Temple+Nalanda+Bihar',
    dharamshala: 'तीर्थ क्षेत्र परिसर में भव्य दिगम्बर धर्मशाला एवं शुद्ध भोजनालय की उत्तम सुविधा है।',
  },
];

export const PilgrimagePage = ({ onBack }: PilgrimagePageProps) => {
  const [selectedPlace, setSelectedPlace] = useState<KshetraDef | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useModalBackHandler(!!selectedPlace, () => setSelectedPlace(null), 'pilgrimage-detail');

  const filteredPlaces = pilgrimageData.filter((p) => {
    const matchesCategory = filter === 'all' || p.category === filter;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      p.nameHindi.toLowerCase().includes(query) ||
      p.location.toLowerCase().includes(query) ||
      p.state.toLowerCase().includes(query) ||
      p.significance.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-6xl mx-auto pt-6 sm:pt-10 page-bottom-clearance px-4 sm:px-6 flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-amber-500/20 hover:border-amber-500/40 transition-all backdrop-blur-xl shrink-0 group cursor-pointer shadow-md"
          title="वापस जाएं"
        >
          <ChevronLeft className="w-5 h-5 text-slate-300 group-hover:text-amber-200" />
        </button>

        <div className="text-center flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-[11px] font-gotu mb-1">
            <MapPin className="w-3 h-3" />
            <span>दिगम्बर जैन सिद्ध, अतिशय एवं कल्याणक क्षेत्र</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-notoserif font-bold text-transparent bg-clip-text bg-gradient-to-b from-cyan-100 to-cyan-300 truncate">
            जैन तीर्थ यात्रा महा-गाइड
          </h1>
        </div>

        <div className="w-11 h-11" />
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-md relative mb-5">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="तीर्थ क्षेत्र, राज्य अथवा तीर्थंकर नाम खोजें..."
          className="w-full pl-9 pr-4 py-2.5 bg-slate-900/80 border border-white/15 focus:border-cyan-400 rounded-2xl text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none transition-colors font-gotu shadow-inner"
        />
      </div>

      {/* Filter Tabs */}
      <div className="w-full flex items-center justify-center gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: `सर्व तीर्थ (${pilgrimageData.length})` },
          {
            id: 'सिद्ध क्षेत्र',
            label: `सिद्ध क्षेत्र (${pilgrimageData.filter((p) => p.category === 'सिद्ध क्षेत्र').length})`,
          },
          {
            id: 'अतिशय क्षेत्र',
            label: `अतिशय क्षेत्र (${pilgrimageData.filter((p) => p.category === 'अतिशय क्षेत्र').length})`,
          },
          {
            id: 'कल्याणक क्षेत्र',
            label: `कल्याणक भूमि (${pilgrimageData.filter((p) => p.category === 'कल्याणक क्षेत्र').length})`,
          },
        ].map((tab) => {
          const isActive = filter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-gotu whitespace-nowrap transition-all border cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.2)] font-bold'
                  : 'bg-slate-900/60 text-slate-400 border-white/10 hover:border-white/20'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Kshetra Cards Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlaces.map((place) => (
          <GlassCard
            key={place.id}
            variant="gilded"
            tilt={{ maxTilt: 10, glareColor: 'amber', scale: 1.02 }}
            className="p-5 flex flex-col justify-between hover:border-cyan-400/50 transition-all duration-300 rounded-2xl group cursor-pointer"
            onClick={() => setSelectedPlace(place)}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span
                  className={`text-[10px] font-bold font-gotu px-2.5 py-0.5 rounded-full border ${
                    place.category === 'सिद्ध क्षेत्र'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : place.category === 'कल्याणक क्षेत्र'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                      : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                  }`}
                >
                  {place.category}
                </span>
                <span className="text-xs text-slate-400 font-gotu flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span className="truncate">{place.state}</span>
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-notoserif font-bold text-white group-hover:text-cyan-200 transition-colors mb-1">
                {place.nameHindi}
              </h3>
              <p className="text-xs text-cyan-300/90 font-gotu font-medium mb-2 line-clamp-1">
                {place.significance}
              </p>
              <p className="text-xs text-slate-300/80 font-gotu leading-relaxed line-clamp-3 mb-4">
                {place.description}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-cyan-300 font-gotu font-semibold">
              <span>विस्तृत विवरण व आवागमन</span>
              <Navigation className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedPlace && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlace(null)}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl max-h-[min(90vh,720px)] flex flex-col bg-slate-900/95 border border-cyan-400/40 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10"
            >
              {/* Pinned Modal Header */}
              <div className="p-4 sm:p-5 border-b border-white/10 bg-slate-950/60 flex items-start justify-between gap-3 shrink-0">
                <div className="min-w-0 flex-1">
                  <span
                    className={`text-[11px] font-bold font-gotu px-2.5 py-0.5 rounded-full border inline-block mb-1.5 ${
                      selectedPlace.category === 'सिद्ध क्षेत्र'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : selectedPlace.category === 'कल्याणक क्षेत्र'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                        : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                    }`}
                  >
                    {selectedPlace.category}
                  </span>
                  <h2 className="text-lg sm:text-2xl font-notoserif font-bold text-white leading-snug break-words">
                    {selectedPlace.nameHindi}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-cyan-300 font-gotu mt-0.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {selectedPlace.location}, {selectedPlace.state}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPlace(null)}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                  title="बंद करें"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-4 min-h-0">
                <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-1 font-gotu">
                    पावन महात्म्य व विशेषता:
                  </div>
                  <div className="text-xs sm:text-sm font-gotu text-cyan-100 font-medium leading-relaxed">
                    {selectedPlace.significance}
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-slate-200 font-gotu leading-relaxed">
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-cinzel">
                      इतिहास एवं परिचय
                    </h4>
                    <p className="bg-white/5 p-3.5 rounded-xl border border-white/5">
                      {selectedPlace.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-cinzel">
                      आवागमन एवं मार्ग
                    </h4>
                    <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-2.5">
                      <div className="flex items-start gap-2.5">
                        <Train className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-slate-100">निकटतम रेलवे:</strong> {selectedPlace.railway}
                        </span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Plane className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-slate-100">निकटतम एयरपोर्ट:</strong> {selectedPlace.airport}
                        </span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Navigation className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-slate-100">पहुँचने का मार्ग:</strong> {selectedPlace.howToReach}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-cinzel">
                      धर्मशाला एवं भोजनशाला सुविधा
                    </h4>
                    <p className="bg-white/5 p-3.5 rounded-xl border border-white/5 text-amber-200/90">
                      {selectedPlace.dharamshala}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pinned Action Footer */}
              <div className="p-3.5 sm:p-4 border-t border-white/10 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    selectedPlace.mapQuery
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-gotu font-bold text-xs transition-colors shadow-lg"
                >
                  <Navigation className="w-4 h-4" />
                  <span>गूगल मैप्स पर देखें</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </a>

                <button
                  onClick={() => setSelectedPlace(null)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-gotu text-xs transition-colors cursor-pointer"
                >
                  बंद करें
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
