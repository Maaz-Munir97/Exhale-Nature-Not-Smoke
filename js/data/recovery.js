// Health recovery milestones after the last cigarette.
// Based on American Cancer Society, CDC and WHO summaries.
import { DAY, HOUR, MINUTE } from '../core/time.js';

const YEAR = 365 * DAY;

export const RECOVERY_MILESTONES = [
  { after: 20 * MINUTE, title: 'Heart rate settles', detail: 'Heart rate and blood pressure begin to drop back toward normal.' },
  { after: 12 * HOUR, title: 'Carbon monoxide clears', detail: 'Carbon monoxide in your blood falls to normal, so more oxygen reaches your organs.' },
  { after: 48 * HOUR, title: 'Senses wake up', detail: 'Nerve endings start to recover. Taste and smell begin to improve.' },
  { after: 72 * HOUR, title: 'Nicotine-free', detail: 'Nicotine has left your body. Breathing often feels easier as your airways relax.' },
  { after: 14 * DAY, title: 'Circulation improves', detail: 'From 2 weeks to 3 months, circulation improves and lung function increases.' },
  { after: 30 * DAY, title: 'One month free', detail: 'Withdrawal has usually faded. Coughing and breathlessness keep easing as lung cilia recover.' },
  { after: 90 * DAY, title: 'Lungs clearing', detail: 'Lung function keeps rising. Walking and exercise get noticeably easier.' },
  { after: YEAR, title: 'Heart risk halved', detail: 'Your extra risk of coronary heart disease is about half that of someone who smokes.' },
  { after: 5 * YEAR, title: 'Cancer and stroke risk falls', detail: 'Risk of mouth, throat, oesophagus and bladder cancer is cut in half, and stroke risk keeps falling.' },
  { after: 10 * YEAR, title: 'Lung cancer risk halved', detail: 'Your risk of dying from lung cancer is about half that of a person who still smokes.' },
];
