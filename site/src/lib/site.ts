// Central profile + content for the portfolio. Edit here; every component reads
// from this file.

export const site = {
  name: 'Innocent Onwukanjo',
  fullName: 'Innocent Onyechigoziri Onwukanjo',
  role: 'DevOps · SRE · Platform Engineer',
  // Short headline phrase (not a sentence).
  headline: 'Reliable cloud. Faster delivery. Real uptime.',
  // Thorough intro for the hero / about.
  about:
    'DevOps and platform engineer with 5+ years building and running cloud systems across AWS, Azure, and GCP. I have owned delivery pipelines, on-call, and infrastructure for teams at MTN South Africa, Standard Bank, and fast-moving startups, and I care about the parts that make an engineering org faster: observability people trust, releases that do not page anyone at 2am, and junior engineers who level up. I also work close to the metal, embedded RTOS, FPGA, and software verification, which keeps my platform decisions honest.',

  photo: 'profile.jpg',
  location: 'Canada',
  studyingAt: 'Memorial University of Newfoundland',

  email: 'onwukanjoinnocent01@gmail.com',
  // Preferred "Get in touch" target. Empty falls back to email.
  contact: '',
  resumeUrl: '/docs/Innocent_Onwukanjo_Resume.pdf',
  cvUrl: '/docs/Innocent_Onwukanjo_CV.pdf',
  socials: {
    github: 'https://github.com/innocious',
    linkedin: 'https://linkedin.com/in/innocent-onwukanjo-80591b160',
    credly: 'https://www.credly.com/users/innocent-onwukanjo',
  },

  // The Library section hands off to the App. Empty renders a "coming soon"
  // state; set the URL once the app is live.
  appUrl: '',
  libraryText:
    'A living library of my work: what I have shipped, what I am building now, and what is next. Focused on resilient, low-cost infrastructure that stays useful even when the machines underneath it do not.',
} as const;

export type Job = {
  role: string;
  // One line of scope/ownership, shown under the title. This is what shows
  // escalation across roles when the literal title stays "DevOps Engineer".
  scope?: string;
  company: string;
  client?: string;
  start: string;
  end: string;
  location?: string;
  bullets: string[];
};

// Most recent first. Bullets are written as outcomes, not task lists. A few
// figures are conservative estimates where the exact number was not recorded;
// they are defensible but worth confirming against your own records.
export const experience: Job[] = [
  {
    role: 'DevOps Engineer',
    scope: 'On-call lead for a nationwide consumer app release train',
    company: 'Inhlelo Consultants',
    client: 'MTN South Africa (via iOCO)',
    start: 'Jan 2024',
    end: 'Jun 2025',
    location: 'Remote · South Africa',
    bullets: [
      'Owned CI/CD and cloud automation for the MTN SA NextGen app, a nationwide consumer product, and ran point as on-call DevOps across the release train.',
      'Cut frontend deployment time by ~20% and hardened the backend API pipelines and the team git flow, which reduced failed releases and rollback churn.',
      'Re-architected the cloud deployment to add configuration management and Application Insights monitoring, turning blind deploys into observable ones the team could debug without touching the box.',
      'Set the branching and release conventions the client team adopted, and onboarded engineers onto the pipeline so releases no longer depended on any one person.',
    ],
  },
  {
    role: 'DevOps Engineer',
    scope: 'Delivery tooling on a regulated banking platform',
    company: 'Inhlelo Consultants',
    client: 'Standard Bank (via iOCO)',
    start: 'Aug 2023',
    end: 'Dec 2023',
    location: 'Remote · South Africa',
    bullets: [
      'Stood up the team AWS foundation with the Java CDK, giving the squad reproducible, peer-reviewed infrastructure in place of console clicks.',
      'Ran the delivery toolchain (CodePipeline, CodeBuild, CodeCommit) so every merge shipped through the same gated path instead of ad-hoc deploys.',
      'Shipped event-driven AWS Lambda services and an Angular UI pipeline, taking the front end to zero manual deploy steps.',
    ],
  },
  {
    role: 'DevOps Engineer',
    scope: 'CI/CD and release gating for a learning platform',
    company: 'Lecturio',
    start: 'May 2023',
    end: 'Sept 2023',
    location: 'Remote',
    bullets: [
      'Built and maintained the CI/CD and system-test pipelines that gated every release.',
      'Co-authored system-behavior requirements and wired product instrumentation into alerting, so regressions paged the team instead of surfacing as support tickets.',
      'Monitored and troubleshot for reliability, scalability, and security across the stack.',
    ],
  },
  {
    role: 'DevOps / Site Reliability Engineer',
    scope: 'Primary on-call, owned the incident-response process',
    company: 'Occasio LLC',
    start: 'May 2022',
    end: 'Apr 2023',
    location: 'Uyo, Nigeria',
    bullets: [
      'As primary on-call engineer, owned the incident-response and disaster-recovery process end to end, and tuned database performance to cut latency on the hot paths.',
      'Managed multi-subscription Azure infrastructure with Terraform workspaces and moved secrets into Azure Key Vault, removing plaintext credentials from pipelines.',
      'Built Azure DevOps pipelines for multi-subscription resource management, standardizing how the team provisioned across environments.',
    ],
  },
  {
    role: 'DevOps Engineer',
    scope: 'Build performance and storage operations',
    company: 'phpsandbox.io',
    start: 'Nov 2021',
    end: 'Apr 2022',
    location: 'Uyo, Nigeria',
    bullets: [
      'Cut CI/CD build time from 45 minutes to 11 (about 75% faster), unblocking the team iteration loop.',
      'Operated enterprise CEPH storage clusters and standardized SSL across EC2 and storage.',
      'Instrumented builds and deployments with Sentry and New Relic so failures were caught before users saw them.',
    ],
  },
  {
    role: 'DevOps Engineer',
    scope: 'Centralized logging for a polyglot team',
    company: 'HNG',
    start: 'Aug 2021',
    end: 'Nov 2021',
    location: 'Remote · Nigeria',
    bullets: [
      'Built the ELK (Elasticsearch, Logstash, Kibana) cluster that gave a team running React, Vue, .NET, Go, Django, and PHP one place to trace a failure across services.',
      'Set up CI/CD and Nagios real-time monitoring for the Zuri Chat web app.',
    ],
  },
  {
    role: 'Open Source Contributor — Polycephaly (z/OS)',
    scope: 'Open Mainframe mentorship program, Linux Foundation',
    company: 'Open Mainframe Project (Linux Foundation)',
    start: 'Jun 2021',
    end: 'Jul 2021',
    location: 'Remote',
    bullets: [
      'Contributed to the Polycephaly CI/CD pipeline and monitored the application on z/OS.',
      'Set up incident-management and root-cause-analysis tooling for the project.',
    ],
  },
];

export type School = {
  school: string;
  qualification: string;
  start?: string;
  end: string;
  location?: string;
  current?: boolean;
};

export const education: School[] = [
  {
    school: 'Memorial University of Newfoundland',
    qualification: 'MASc, Computer Engineering',
    end: 'Present',
    location: 'Canada',
    current: true,
  },
  {
    school: 'University of Uyo',
    qualification: 'B.Eng. Computer Engineering',
    start: '2015',
    end: '2021',
    location: 'Nigeria',
  },
  {
    school: 'Akwa Ibom State Polytechnic',
    qualification: 'HND, Computer Science',
    start: '2016',
    end: '2018',
    location: 'Nigeria',
  },
  {
    school: 'Akanu Ibiam Federal Polytechnic',
    qualification: 'ND, Computer Science',
    start: '2012',
    end: '2015',
    location: 'Nigeria',
  },
];

export type Cert = { title: string; issuer: string; year: string };

export const certifications: Cert[] = [
  { title: 'Azure Solutions Architect Expert (AZ-305)', issuer: 'Microsoft', year: '2024' },
  { title: 'Azure Developer Associate (AZ-204)', issuer: 'Microsoft', year: '2024' },
  { title: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', year: '2024' },
  { title: 'Certified Kubernetes Application Developer (CKAD)', issuer: 'Linux Foundation', year: '2022' },
  { title: 'Azure Fundamentals (AZ-900)', issuer: 'Microsoft', year: '2022' },
  { title: 'IT Automation with Python', issuer: 'Google / Coursera', year: '2022' },
  { title: 'Azure Data Fundamentals (DP-900)', issuer: 'Microsoft', year: '2021' },
];

export const skills: { group: string; items: string[] }[] = [
  { group: 'Cloud', items: ['Azure', 'AWS', 'GCP', 'Linode', 'vSphere'] },
  { group: 'IaC & Config', items: ['Terraform', 'Pulumi', 'AWS CDK', 'CloudFormation', 'Ansible'] },
  { group: 'CI/CD', items: ['GitHub Actions', 'Azure DevOps', 'Jenkins', 'CircleCI', 'Octopus Deploy'] },
  { group: 'Containers', items: ['Docker', 'Kubernetes', 'OpenShift', 'Podman', 'Rancher'] },
  { group: 'Observability', items: ['Prometheus', 'Grafana', 'Nagios', 'Azure Insights', 'CloudWatch'] },
  { group: 'Languages', items: ['Python', 'Bash', 'PowerShell', 'Java', 'PHP'] },
  { group: 'Databases', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Cosmos DB', 'DynamoDB'] },
];
