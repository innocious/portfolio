// Central profile + site content. Edit these in one place; every component
// reads from here.
export const site = {
  name: 'Innocent Onwukanjo',
  role: 'Cloud & Platform Engineer',
  // Short headline phrase shown under the name. Keep it to a few words, not a
  // sentence.
  headline: 'Resilient systems. Low cost. Honest uptime.',
  // Two or three short sentences for the intro/About.
  about:
    'A living library of my work: what I have shipped, what I am building now, and what is next. Focused on resilient, low-cost infrastructure that stays useful even when the machines underneath it do not.',

  // Profile photo. A placeholder ships at /public/profile.svg. To use your own
  // photo, drop a square image in /public (e.g. profile.jpg) and set this to
  // its filename.
  photo: 'profile.svg',

  location: 'United Kingdom',
  // Contact + social links. Replace placeholders with your real handles.
  email: 'you@example.com',
  // Preferred contact target for the "Get in touch" button. Use a WhatsApp
  // link (https://wa.me/2348...) or a LinkedIn profile. Falls back to email.
  contact: '',
  resumeUrl: '', // e.g. '/resume.pdf' once you add one to /public
  socials: {
    github: 'https://github.com/innocious',
    linkedin: '', // e.g. 'https://www.linkedin.com/in/your-handle'
    credly: '', // e.g. 'https://www.credly.com/users/your-handle'
  },
} as const;

// Skills grouped by area, shown in the Skills section.
export const skills: { group: string; items: string[] }[] = [
  { group: 'Cloud & Infra', items: ['Oracle Cloud', 'Terraform', 'Docker', 'Caddy', 'Cloudflare'] },
  { group: 'Automation', items: ['GitHub Actions', 'CI/CD', 'Bash', 'cron'] },
  { group: 'Backend & Edge', items: ['TypeScript', 'Node.js', 'Cloudflare Workers', 'D1'] },
  { group: 'Observability', items: ['Uptime Kuma', 'Umami', 'Status pages'] },
];
