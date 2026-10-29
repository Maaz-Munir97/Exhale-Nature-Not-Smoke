// Static content: triggers, moods, tips, distractions, help lines and sources.

export const TRIGGERS = [
  { id: 'coffee', label: 'Coffee / tea', icon: '☕' },
  { id: 'meal', label: 'After a meal', icon: '🍽️' },
  { id: 'stress', label: 'Stress', icon: '😤' },
  { id: 'boredom', label: 'Boredom', icon: '🥱' },
  { id: 'social', label: 'With smokers', icon: '👥' },
  { id: 'alcohol', label: 'Alcohol', icon: '🍺' },
  { id: 'driving', label: 'Driving', icon: '🚗' },
  { id: 'break', label: 'Work break', icon: '💼' },
  { id: 'waking', label: 'Waking up', icon: '🌅' },
  { id: 'phone', label: 'Phone / screen', icon: '📱' },
  { id: 'emotion', label: 'Sad / angry', icon: '🌧️' },
  { id: 'other', label: 'Other', icon: '✳️' },
];

export const triggerById = (id) => TRIGGERS.find((t) => t.id === id) || TRIGGERS[TRIGGERS.length - 1];

export const MOODS = [
  { value: 1, icon: '😣', label: 'Rough' },
  { value: 2, icon: '😕', label: 'Low' },
  { value: 3, icon: '😐', label: 'Okay' },
  { value: 4, icon: '🙂', label: 'Good' },
  { value: 5, icon: '😄', label: 'Great' },
];

export const MOOD_REPLIES = {
  1: 'Rough days are part of withdrawal, and they pass. Be gentle with yourself and keep SOS close.',
  2: 'Low moods are common in the first weeks. A short walk or a call to a supporter can lift it.',
  3: 'Steady is good. Every ordinary day without smoking is a win.',
  4: 'Nice. Notice what is helping today so you can repeat it.',
  5: 'Love that. Remember this feeling for the next tough moment.',
};

export const TIPS = [
  'A craving usually passes within 3–5 minutes. You only need to outlast it, not defeat it forever.',
  'Delay, Deep breathe, Drink water, Distract: the 4 Ds work on almost every craving.',
  'Cold water is a surprisingly strong craving-breaker. Sip it slowly.',
  'Combining a nicotine patch with gum or a lozenge works better than either one alone.',
  'Caffeine hits harder after you quit. If you feel jittery, cut back.',
  'Change your seat, your mug, your route. New routines carry fewer cues.',
  'Say "I don\'t smoke," not "I\'m trying to quit." Language shapes identity.',
  'Hands restless? Hold a pen, a stress ball or a straw.',
  'Alcohol is one of the biggest relapse triggers. Go easy for the first month.',
  'Smoking does not relieve stress; it relieves nicotine withdrawal. Quitting lowers stress over time.',
  'Brush your teeth after meals. That fresh taste is a great "no cigarette" signal.',
  'If you slip, do not quit quitting. Throw the rest away and continue today.',
  'Exercise, even 5 minutes of it, measurably shrinks a craving.',
  'Withdrawal symptoms are signs of recovery, not signs that something is wrong.',
  'Tell someone when you hit a milestone. Celebration strengthens new habits.',
];

export const DISTRACTIONS = [
  'Drink a full glass of cold water, slowly',
  'Do 20 squats or walk up and down the stairs',
  'Text a supporter: "Craving. Talk me through it?"',
  'Brush your teeth or chew sugar-free gum',
  'Step outside and walk to the end of the street',
  'Splash cold water on your face',
];

export const IF_THEN_EXAMPLES = [
  { trigger: 'coffee', plan: 'I drink it in a different spot and chew gum right after' },
  { trigger: 'stress', plan: 'I open SOS and do one breathing round' },
  { trigger: 'meal', plan: 'I get up straight away and brush my teeth' },
  { trigger: 'social', plan: 'I step away, get a drink and text a supporter' },
];

export const HELPLINES = [
  { region: 'USA', name: '1-800-QUIT-NOW', phone: '18007848669', display: '1-800-784-8669' },
  { region: 'UK', name: 'NHS Smokefree helpline', phone: '03001231044', display: '0300 123 1044' },
];

export const RESOURCES = [
  { label: 'Smokefree.gov', href: 'https://smokefree.gov' },
  { label: 'NHS Better Health: Quit smoking', href: 'https://www.nhs.uk/better-health/quit-smoking/' },
  { label: 'WHO: Tobacco', href: 'https://www.who.int/health-topics/tobacco' },
];

export const SOURCES = [
  'Lindson-Hawley et al., Annals of Internal Medicine 2016: abrupt vs gradual cessation (49% vs 39% abstinent at 4 weeks).',
  'Jackson et al., Addiction 2025 (UCL): about 20 minutes of life lost per cigarette.',
  'HSE Ireland & Australian Dept. of Health: cravings usually pass in 3–5 minutes; the 4 Ds.',
  'American Cancer Society & CDC: health benefits timeline after quitting.',
  'Cochrane reviews: NRT, varenicline and combination NRT improve quit rates.',
];

// Minutes of life expectancy lost per cigarette (UCL estimate).
export const MINUTES_PER_CIGARETTE = 20;
