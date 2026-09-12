// Central profile + site content. Edit these in one place; every component
// reads from here.
export const site = {
  name: 'Innocent Onwukanjo',
  role: 'Cloud & Platform Engineer',
  // Short, punchy hero line. Keep it to one sentence.
  tagline:
    'I build resilient systems that stay useful even when the infrastructure underneath them does not.',
  // Two or three sentences for the About section.
  about:
    'Cloud and platform engineer focused on resilient, low-cost infrastructure. I like systems that degrade gracefully, cost little to run, and tell the truth about their own health. This site is one of them.',

  // Profile photo. A placeholder ships at /public/profile.svg. To use your own
  // photo, drop a square image in /public (e.g. profile.jpg) and set this to
  // its filename.
  photo: 'profile.svg',

  location: 'United Kingdom',
  // Contact + social links. Replace the placeholders with your real handles.
  email: 'you@example.com',
  resumeUrl: '', // e.g. '/resume.pdf' once you add one to /public
  socials: {
    github: 'https://github.com/innocious',
    linkedin: '', // e.g. 'https://www.linkedin.com/in/your-handle'
  },
} as const;

// Skills grouped by area, shown in the Skills section.
export const skills: { group: string; items: string[] }[] = [
  { group: 'Cloud & Infra', items: ['Oracle Cloud', 'Terraform', 'Docker', 'Caddy', 'Cloudflare'] },
  { group: 'Automation', items: ['GitHub Actions', 'CI/CD', 'Bash', 'cron'] },
  { group: 'Backend & Edge', items: ['TypeScript', 'Node.js', 'Cloudflare Workers', 'D1'] },
  { group: 'Observability', items: ['Uptime Kuma', 'Umami', 'Status pages'] },
];
