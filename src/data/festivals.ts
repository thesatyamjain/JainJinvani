// Jain festivals and important dates

export interface JainFestival {
  id: string;
  name: string;
  nameHindi: string;
  date: string; // Format: "YYYY-MM-DD" or "MM-DD" for recurring
  description: string;
  descriptionHindi: string;
  type: 'festival' | 'parva' | 'jayanti' | 'important';
  recurring: boolean;
}

export const jainFestivals: JainFestival[] = [
  {
    id: 'mahavir-jayanti',
    name: 'Mahavir Jayanti',
    nameHindi: 'महावीर जयंती',
    date: '04-13', // Chaitra Sud 13
    description: 'Birth anniversary of Lord Mahavira, the 24th Tirthankara',
    descriptionHindi: 'भगवान महावीर स्वामी का जन्म उत्सव',
    type: 'jayanti',
    recurring: true
  },
  {
    id: 'paryushan',
    name: 'Paryushan Parva',
    nameHindi: 'पर्युषण पर्व',
    date: '08-24', // Bhadrapada Sud 5-13
    description: 'Eight days of fasting, prayer, and spiritual reflection',
    descriptionHindi: 'आठ दिवसीय उपवास, प्रार्थना और आत्म-चिंतन का पर्व',
    type: 'parva',
    recurring: true
  },
  {
    id: 'samvatsari',
    name: 'Samvatsari',
    nameHindi: 'संवत्सरी',
    date: '09-01',
    description: 'Day of forgiveness and repentance',
    descriptionHindi: 'क्षमा और प्रायश्चित का दिन',
    type: 'important',
    recurring: true
  },
  {
    id: 'diwali',
    name: 'Mahavir Nirvana (Diwali)',
    nameHindi: 'महावीर निर्वाण दिवस',
    date: '10-24',
    description: 'Day Lord Mahavira attained Nirvana',
    descriptionHindi: 'भगवान महावीर के मोक्ष प्राप्ति का दिन',
    type: 'important',
    recurring: true
  },
  {
    id: 'gyan-panchami',
    name: 'Gyan Panchami',
    nameHindi: 'ज्ञान पंचमी',
    date: '10-29',
    description: 'Day dedicated to knowledge and scriptures',
    descriptionHindi: 'ज्ञान और शास्त्रों को समर्पित दिवस',
    type: 'festival',
    recurring: true
  },
  {
    id: 'rishabhdev-jayanti',
    name: 'Rishabhdev Jayanti',
    nameHindi: 'ऋषभदेव जयंती',
    date: '03-21',
    description: 'Birth anniversary of the first Tirthankara',
    descriptionHindi: 'प्रथम तीर्थंकर का जन्म उत्सव',
    type: 'jayanti',
    recurring: true
  },
  {
    id: 'akshaya-tritiya',
    name: 'Akshaya Tritiya',
    nameHindi: 'अक्षय तृतीया',
    date: '04-23',
    description: 'Day when Lord Rishabhdev broke his year-long fast',
    descriptionHindi: 'भगवान ऋषभदेव के पारण का दिन',
    type: 'important',
    recurring: true
  },
  {
    id: 'anant-chaturdashi',
    name: 'Anant Chaturdashi',
    nameHindi: 'अनंत चतुर्दशी',
    date: '09-14',
    description: 'Day of Anant Vrat and spiritual purification',
    descriptionHindi: 'अनंत व्रत और आध्यात्मिक शुद्धि का दिन',
    type: 'festival',
    recurring: true
  }
];

export const getDailyThought = (): { text: string; textHindi: string; author: string } => {
  const thoughts = [
    {
      text: 'Live and let live',
      textHindi: 'जीओ और जीने दो',
      author: 'Jain Philosophy'
    },
    {
      text: 'Non-violence is the supreme religion',
      textHindi: 'अहिंसा परमो धर्मः',
      author: 'Mahavir Swami'
    },
    {
      text: 'The soul is its own friend and its own enemy',
      textHindi: 'आत्मा अपना मित्र और अपना शत्रु है',
      author: 'Tattvartha Sutra'
    },
    {
      text: 'Conquer anger with non-anger',
      textHindi: 'क्रोध को अक्रोध से जीतो',
      author: 'Mahavir Swami'
    },
    {
      text: 'All life is sacred',
      textHindi: 'सभी जीवन पवित्र हैं',
      author: 'Jain Principle'
    },
    {
      text: 'The truth has many aspects',
      textHindi: 'सत्य के अनेक पहलू हैं',
      author: 'Anekantavada'
    },
    {
      text: 'Be the change you wish to see',
      textHindi: 'वह परिवर्तन बनो जो तुम देखना चाहते हो',
      author: 'Jain Wisdom'
    },
    {
      text: 'Self-discipline leads to liberation',
      textHindi: 'आत्म-संयम मुक्ति की ओर ले जाता है',
      author: 'Jain Teaching'
    },
    {
      text: 'Attachment is the root of suffering',
      textHindi: 'आसक्ति दुःख का मूल है',
      author: 'Jain Philosophy'
    },
    {
      text: 'Right faith, right knowledge, right conduct',
      textHindi: 'सम्यक दर्शन, सम्यक ज्ञान, सम्यक चरित्र',
      author: 'Ratnatraya'
    }
  ];
  
  // Use date as seed for consistent daily thought
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const index = dayOfYear % thoughts.length;
  
  return thoughts[index];
};

export const getUpcomingFestivals = (count: number = 3): JainFestival[] => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();
  
  return jainFestivals
    .map(festival => {
      const [month, day] = festival.date.split('-').map(Number);
      let daysUntil = 0;
      
      const festivalDate = new Date(today.getFullYear(), month - 1, day);
      if (festivalDate < today) {
        festivalDate.setFullYear(today.getFullYear() + 1);
      }
      
      daysUntil = Math.floor((festivalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      return { ...festival, daysUntil };
    })
    .sort((a: any, b: any) => a.daysUntil - b.daysUntil)
    .slice(0, count);
};
