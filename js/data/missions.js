// The 30-day protocol content.
// Quick Stop uses the 3 `core` prep missions; Step Down uses all 7.
// After quit day, FREE_MISSIONS run in order and the final day is always graduation.

export const PREP_MISSIONS = [
  {
    id: 'why',
    core: true,
    tag: 'Motivation',
    title: 'Find your real why',
    why: 'Vague reasons crumble under a craving; specific, personal ones hold. People who tie quitting to what they value stay quit longer.',
    steps: [
      'Write at least 3 specific reasons in My Why (e.g. "to play football with my son without coughing")',
      'Pick the reason that hits hardest and set it as a phone note or lock-screen',
      'Read all your reasons out loud once',
    ],
    tool: { label: 'Open My Why', href: '#/toolkit' },
  },
  {
    id: 'detective',
    tag: 'Awareness',
    title: 'Become a smoking detective',
    why: 'Most cigarettes are automatic, set off by cues like coffee, stress or finishing a meal. You cannot beat a pattern you cannot see.',
    steps: [
      'Log every cigarette today with the button on this screen',
      'Pick the trigger for each one',
      'Before lighting up, ask: "How much do I actually want this, 1–10?"',
    ],
  },
  {
    id: 'support',
    tag: 'Support',
    title: 'Recruit your support team',
    why: 'Support from other people measurably raises quit rates, and telling people adds gentle accountability.',
    steps: [
      'Tell at least 2 people your quit date',
      'Ask one of them to be your "craving call" person',
      'Add them in Toolkit → Support team',
    ],
    tool: { label: 'Add supporters', href: '#/toolkit' },
  },
  {
    id: 'medicine',
    tag: 'Medicine',
    title: 'Line up stop-smoking medicine',
    why: 'Stop-smoking medicines (nicotine patch plus gum or lozenge, varenicline, or bupropion) roughly double your chances compared with willpower alone. A patch combined with a fast-acting form works better than either one alone.',
    steps: [
      'Talk to a doctor or pharmacist about your options',
      'If you choose nicotine replacement, get a patch AND a fast-acting form (gum, lozenge or spray)',
      'Ask when to start. Varenicline is usually started about a week before quit day',
    ],
  },
  {
    id: 'if-then',
    core: true,
    tag: 'Strategy',
    title: 'Write your If-Then plans',
    why: '"If X happens, then I will do Y" plans (implementation intentions) are one of the best-tested behaviour-change tools. They make your response automatic when willpower is low.',
    steps: [
      'Choose your top 3 smoking triggers',
      'Write an If-Then plan for each one in the Toolkit',
      'Picture yourself carrying out each plan once',
    ],
    tool: { label: 'Write If-Then plans', href: '#/toolkit' },
  },
  {
    id: 'urge-surf',
    tag: 'Skill',
    title: 'Practise the urge surf',
    why: 'A craving is a wave: it builds, peaks and passes, usually within 3–5 minutes. Practising now, while the stakes are low, turns it into a skill.',
    steps: [
      'Before one cigarette today, open SOS and finish the full session first',
      'Notice where the craving sits in your body (chest, hands, mouth)',
      'Delay at least one cigarette by 15 minutes',
    ],
    tool: { label: 'Open SOS', href: '#/sos' },
  },
  {
    id: 'clear-decks',
    core: true,
    tag: 'Environment',
    title: 'Clear the decks',
    why: 'Your surroundings vote for your habit. Every cue you remove today is one less craving to fight tomorrow.',
    steps: [
      'Throw away all cigarettes, lighters and ashtrays. Check the car, bags and jackets',
      'Wash smoky clothes and air out your room and car',
      'Stock up on water, sugar-free gum, crunchy snacks and your medicine',
      'Tell the people around you that tomorrow is quit day',
      'Write your letter to future you in the Toolkit',
    ],
    tool: { label: 'Write your letter', href: '#/toolkit' },
  },
];

export const QUIT_DAY_MISSION = {
  id: 'quit-day',
  tag: 'Quit day',
  title: 'Quit day: not one puff',
  why: 'Today you become a non-smoker. One rule matters more than any other: not a single puff. Cravings will come, and every one you ride out weakens the habit loop.',
  steps: [
    'Put on your patch first thing (if you are using nicotine replacement)',
    'Change your morning routine: a different seat, a different drink',
    'Use SOS for every craving. It takes 3 minutes',
    'Drink plenty of water and avoid alcohol today',
    'Before bed, do your mood check-in',
  ],
  tool: { label: 'Open SOS', href: '#/sos' },
};

export const FREE_MISSIONS = [
  {
    id: 'peak',
    tag: 'Withdrawal',
    title: 'Ride the peak',
    why: 'Cravings and withdrawal are usually strongest 2–3 days after stopping, as nicotine leaves your body. It is temporary, and it means you are healing.',
    steps: [
      'Learn the 4 Ds: Delay, Deep breathe, Drink water, Distract',
      'Use the 4 Ds for every craving today',
      'Eat regular meals. Low blood sugar can feel like a craving',
    ],
  },
  {
    id: 'move',
    tag: 'Body',
    title: 'Move it out',
    why: 'Even 5–10 minutes of brisk activity reduces craving strength and withdrawal symptoms.',
    steps: [
      'Take a 10-minute walk today',
      'When a strong craving hits, do 20 squats or climb some stairs',
      'Notice how the craving changes afterwards',
    ],
  },
  {
    id: 'nicotine-free',
    tag: 'Milestone',
    title: 'Your body is nicotine-free',
    why: 'By about 72 hours, nicotine has left your body and your airways are starting to relax. What remains is habit and cues, and those can be retrained.',
    steps: [
      'Keep today as low-stress as you can',
      'Write down one physical change you have noticed',
      'Give yourself a small reward (not a cigarette)',
    ],
  },
  {
    id: 'rituals',
    tag: 'Habits',
    title: 'Rewire the rituals',
    why: 'Cigarettes are glued to routines: coffee, the commute, after meals. Change the routine and you break the cue.',
    steps: [
      'Name your 2 strongest "ritual" cigarettes',
      'Change something about each one: the place, the drink or the timing',
      'After meals, get up straight away. Brush your teeth or take a walk',
    ],
  },
  {
    id: 'sleep',
    tag: 'Body',
    title: 'Sleep and caffeine reset',
    why: 'Poor sleep is a common, temporary withdrawal symptom. Smoking speeds up how fast your body clears caffeine, so after quitting the same coffee hits much harder and can feel like anxiety.',
    steps: [
      'Cut your caffeine roughly in half for now',
      'No screens for 30 minutes before bed',
      'If a craving wakes you up, do a breathing session in SOS',
    ],
  },
  {
    id: 'snacks',
    tag: 'Body',
    title: 'Smart snacking',
    why: 'Appetite often rises after quitting. A small weight change is normal and far less harmful than smoking, but a plan helps.',
    steps: [
      'Prepare crunchy snacks: carrots, cucumber, apple slices, nuts',
      'Keep sugar-free gum with you',
      'Drink a glass of water before reaching for food',
    ],
  },
  {
    id: 'one-week',
    tag: 'Milestone',
    title: 'One week free',
    why: 'The first week is the hardest part. People who get through it are far more likely to stay quit for good.',
    steps: [
      'Check how much money you have saved on Progress',
      'Spend some of it on a real reward',
      'Tell your support team you made it a week',
    ],
    tool: { label: 'See progress', href: '#/progress' },
  },
  {
    id: 'stress',
    tag: 'Mind',
    title: 'Stress without smoke',
    why: 'Smoking feels calming because it relieves nicotine withdrawal, not stress itself. Studies find anxiety and stress levels go down after people quit.',
    steps: [
      'Do one breathing session in SOS three times today, even without a craving',
      'Write an If-Then plan for your biggest stress trigger',
      'Try a 5-minute body scan before bed',
    ],
  },
  {
    id: 'social',
    tag: 'Social',
    title: 'Alcohol and social plan',
    why: 'Alcohol and being around smokers are among the biggest relapse triggers. Both lower your guard.',
    steps: [
      'Avoid alcohol this week if you can',
      'If you go out, keep a drink or something else in your old "smoking hand"',
      'Prepare a refusal line: "No thanks, I don\'t smoke."',
    ],
  },
  {
    id: 'identity',
    tag: 'Mind',
    title: 'The identity shift',
    why: 'People who see themselves as non-smokers, rather than as smokers trying to quit, are more likely to stay smoke-free.',
    steps: [
      'Say "I don\'t smoke," not "I\'m trying to quit"',
      'Write one sentence about who you are now',
      'Notice one moment today when you acted like a non-smoker',
    ],
  },
  {
    id: 'senses',
    tag: 'Body',
    title: 'Taste the difference',
    why: 'Taste and smell sharpen as damaged nerve endings recover. Noticing it gives you proof that quitting is working.',
    steps: [
      'Eat something with strong flavour and really pay attention to it',
      'Smell something you love: coffee, flowers, rain',
      'Tell someone what you noticed',
    ],
  },
  {
    id: 'lung-test',
    tag: 'Body',
    title: 'The stairs test',
    why: 'From about 2 weeks onwards, circulation and lung function start improving. Feel it for yourself.',
    steps: [
      'Climb a few flights of stairs at your normal pace',
      'Compare your breathing with how it felt a month ago',
      'Commit to one weekly activity: walking, swimming, football',
    ],
  },
  {
    id: 'data',
    tag: 'Awareness',
    title: 'Read your own data',
    why: 'Your log shows when and why urges hit. Once you see the pattern you can plan for it instead of reacting.',
    steps: [
      'Open Progress and check your "urges by hour" chart',
      'Find your peak craving time',
      'Schedule something absorbing for that time tomorrow',
    ],
    tool: { label: 'See insights', href: '#/progress' },
  },
  {
    id: 'two-weeks',
    tag: 'Milestone',
    title: 'Two weeks strong',
    why: 'Two smoke-free weeks. Your circulation is improving and the habit loop is getting weaker every day.',
    steps: [
      'Re-read My Why and add one new reason you have discovered',
      'Treat yourself with money you would have spent on cigarettes',
      'Thank someone who supported you',
    ],
  },
  {
    id: 'just-one',
    tag: 'Relapse-proof',
    title: 'The "just one" trap',
    why: '"Just one" is the most common road back to smoking. A single cigarette wakes up the nicotine receptors and the habit loop. The rule is simple: not a puff.',
    steps: [
      'Write what you will tell yourself when the "just one" thought comes',
      'Add it to your If-Then plans',
      'Re-read your letter to future you',
    ],
    tool: { label: 'Open Toolkit', href: '#/toolkit' },
  },
  {
    id: 'pay-forward',
    tag: 'Social',
    title: 'Pay it forward',
    why: 'Helping someone else quit, or simply telling your story, strengthens your own commitment.',
    steps: [
      'Tell someone what has helped you most so far',
      'Offer to support a friend who wants to quit',
      'Notice how it feels to be the "non-smoker" in the conversation',
    ],
  },
  {
    id: 'mood',
    tag: 'Mind',
    title: 'Mood check',
    why: 'Some people feel low or irritable for a few weeks. It passes, and mood usually ends up better than it was while smoking. If low mood is severe or will not lift, talk to a doctor.',
    steps: [
      'Do today\'s mood check-in honestly',
      'Do one thing you genuinely enjoy',
      'Reach out to someone you trust',
    ],
  },
  {
    id: 'replace',
    tag: 'Habits',
    title: 'Build a replacement habit',
    why: 'Habits are easier to replace than to delete. Give your hands and your breaks a new job.',
    steps: [
      'Choose a replacement: a short walk, tea, stretching, a puzzle',
      'Attach it to an old smoking moment ("After lunch, I will…")',
      'Do it at least twice today',
    ],
  },
  {
    id: 'deep-clean',
    tag: 'Environment',
    title: 'Deep clean',
    why: 'Smoke residue in fabrics, cars and furniture keeps old cues alive. Clearing it out finishes the job.',
    steps: [
      'Wash jackets, curtains or car seat covers that smell of smoke',
      'Clean the spot where you used to smoke',
      'Make it a nice place: add a plant, a chair, something new',
    ],
  },
  {
    id: 'money-goal',
    tag: 'Motivation',
    title: 'Set a money goal',
    why: 'Turning saved money into something real makes the benefit concrete and keeps motivation up after the first rush fades.',
    steps: [
      'Check your total money saved on Progress',
      'Choose something you will buy or do with 3 months of savings',
      'Move this week\'s savings into a separate place',
    ],
    tool: { label: 'See savings', href: '#/progress' },
  },
  {
    id: 'three-weeks',
    tag: 'Milestone',
    title: 'Three weeks',
    why: 'Most physical withdrawal symptoms fade within 2–4 weeks. What is left is mostly memory and cues, and they get weaker every time you do not smoke.',
    steps: [
      'Review your If-Then plans. Keep what worked and fix what didn\'t',
      'Notice which symptoms have already disappeared',
      'Celebrate with your support team',
    ],
  },
  {
    id: 'surprise',
    tag: 'Relapse-proof',
    title: 'Expect the unexpected',
    why: 'Late cravings and even smoking dreams are normal. They do not mean you are failing. They are the habit fading.',
    steps: [
      'Write down what you will do if a craving hits out of nowhere',
      'Keep gum or a fast-acting nicotine product with you for emergencies',
      'Do one full SOS session as a refresher',
    ],
  },
  {
    id: 'high-risk',
    tag: 'Relapse-proof',
    title: 'Your high-risk calendar',
    why: 'Relapse often happens at predictable events: weddings, travel, exams, arguments, celebrations. Plan for them now.',
    steps: [
      'List the high-risk events in the next 3 months',
      'Write an If-Then plan for each',
      'Tell a supporter about the toughest one',
    ],
  },
  {
    id: 'thank-body',
    tag: 'Mind',
    title: 'Thank your body',
    why: 'Your body has been repairing itself every hour since you stopped. Acknowledging that builds pride, and pride protects you.',
    steps: [
      'Look at the health timeline on Progress',
      'Write a short thank-you note to your lungs and heart',
      'Do something kind for your body: a long walk, a good meal, sleep',
    ],
    tool: { label: 'Health timeline', href: '#/progress' },
  },
  {
    id: 'blueprint',
    tag: 'Relapse-proof',
    title: 'Your relapse-proof blueprint',
    why: 'Months 2 and 3 are quieter but still risky. A written plan keeps you safe when cravings surprise you.',
    steps: [
      'Write your top 3 remaining risks and your response to each',
      'Decide who you will call if you ever slip',
      'Update your letter to future you',
    ],
    tool: { label: 'Open Toolkit', href: '#/toolkit' },
  },
];

export const GRADUATION_MISSION = {
  id: 'graduation',
  tag: 'Graduation',
  title: 'Day 30: you did it',
  why: 'You have completed the protocol. You are a non-smoker. Cravings will keep getting rarer and weaker, and SOS is always here if one surprises you.',
  steps: [
    'Look back at your full progress, lung tree and savings',
    'Celebrate with your support team',
    'Write your plan for month 2 in your letter to future you',
    'Keep Exhale on your home screen. SOS stays one tap away',
  ],
  tool: { label: 'See progress', href: '#/progress' },
};
