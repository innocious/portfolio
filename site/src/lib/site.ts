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
    'DevOps and platform engineer with 5+ years architecting, automating, and running cloud systems across AWS, Azure, and GCP. I have built and hardened delivery pipelines and infrastructure for teams at MTN South Africa, Standard Bank, and fast-moving startups, with a focus on systems that ship faster and stay reliable.',

  photo: 'profile.jpg',
  location: 'Canada',
  studyingAt: 'Memorial University of Newfoundland',

  email: 'onwukanjoinnocent01@gmail.com',
  // Preferred "Get in touch" target. Empty falls back to email.
  contact: '',
  resumeUrl: '', // set to '/resume.pdf' after adding one to /public
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
  company: string;
  client?: string;
  start: string;
  end: string;
  location?: string;
  bullets: string[];
};

// Most recent first.
export const experience: Job[] = [
  {
    role: 'DevOps Engineer',
    company: 'Inhlelo Consultants',
    client: 'MTN South Africa (via iOCO)',
    start: 'Jan 2024',
    end: 'Jun 2025',
    bullets: [
      'Build and run delivery for the MTN SA NextGen App with the iOCO client team.',
      'On-call DevOps support; automated deployment and maintenance tooling.',
      'Improved frontend deployment speed by 20% and hardened backend API CI/CD.',
      'Rearchitected cloud deployment to add configuration management and infra monitoring.',
    ],
  },
  {
    role: 'DevOps Engineer',
    company: 'Inhlelo Consultants',
    client: 'Standard Bank (via iOCO)',
    start: 'Aug 2023',
    end: 'Dec 2023',
    bullets: [
      'Built and managed team infrastructure on AWS using the Java CDK.',
      'Deployed and managed CodePipeline, CodeBuild, and CodeCommit for the team.',
      'Shipped AWS Lambda functions for event-based applications and an Angular UI pipeline.',
    ],
  },
  {
    role: 'DevOps Engineer',
    company: 'Lecturio',
    start: 'May 2023',
    end: 'Sept 2023',
    bullets: [
      'Built and maintained CI/CD pipelines for system testing.',
      'Co-created system-behavior requirements and alerting via product instrumentation.',
      'Monitored and troubleshot systems for reliability, scalability, and security.',
    ],
  },
  {
    role: 'DevOps / Site Reliability Engineer',
    company: 'Occasio LLC',
    start: 'May 2022',
    end: 'Apr 2023',
    location: 'Uyo, Nigeria',
    bullets: [
      'Primary on-call engineer; implemented disaster recovery and optimized database performance.',
      'Managed infrastructure with Terraform workspaces and Azure Key Vault for secrets.',
      'Built Azure DevOps pipelines for multi-subscription resource management.',
    ],
  },
  {
    role: 'DevOps Engineer',
    company: 'phpsandbox.io',
    start: 'Nov 2021',
    end: 'Apr 2022',
    location: 'Uyo, Nigeria',
    bullets: [
      'Managed enterprise CEPH storage clusters and configured SSL across AWS EC2 and storage.',
      'Reduced CI/CD build time from 45 minutes to 11 minutes.',
      'Monitored builds and deployments with Sentry and New Relic.',
    ],
  },
  {
    role: 'DevOps Engineer',
    company: 'HNG',
    start: 'Aug 2021',
    end: 'Nov 2021',
    location: 'Nigeria',
    bullets: [
      'Built the ELK (Elasticsearch, Logstash, Kibana) cluster for centralized logging across React, Vue, .NET, Go, Django, and PHP apps.',
      'Set up CI/CD pipelines and Nagios real-time server monitoring for the Zuri Chat web app.',
    ],
  },
  {
    role: 'Mentee, Polycephaly',
    company: 'Open Mainframe Project (Linux Foundation)',
    start: 'Jun 2021',
    end: 'Jul 2021',
    bullets: [
      'Monitored the Polycephaly application on z/OS and contributed to its CI/CD pipeline.',
      'Set up incident management and root-cause analysis tooling.',
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
