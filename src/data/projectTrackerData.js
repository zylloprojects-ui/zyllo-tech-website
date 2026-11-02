// src/data/projectTrackerData.js
// Enterprise Project Tracker data model, persistence, and export engines for Zyllo Tech Admin

export const INITIAL_TRACKER_PROJECTS = [
  {
    id: "aims",
    name: "Aims",
    fullName: "AIMS Healthcare & Academy ERP",
    title: "AIMS Healthcare & Academy ERP",
    client: "AIMS Group Holdings",
    company: "AIMS Group Holdings",
    category: "Enterprise ERP & Cloud",
    status: "Completed",
    progress: 100,
    completion_date: "Oct 2026",
    description: "Comprehensive multi-tenant healthcare enterprise suite with EMR/EHR modules, inpatient bed allocation, telemedicine consultation, and pharmacy billing.",
    tech_stack: ["React 19", "Node.js", "PostgreSQL", "AWS EC2", "CloudFront CDN"],
    accent: "from-[#f96706] to-[#f7941e]",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    details: {
      completed: true,
      completionStatus: "Completed (Phase 1 & 2 Live)",
      completionDate: "October 14, 2026",
      progress: 100,
      signoffAuthority: "Dr. K. S. Rao (Clinical Director) & Lead Architect",
      warrantyPeriod: "12-Month Extended Enterprise Warranty (Active till Oct 2027)",
      teamAssigned: "HealthTech Engineering Pod (1 Lead, 4 Fullstack, 1 QA, 1 DevOps)",
      phases: [
        { name: "Phase 1: Architecture & EMR Data Modeling", status: "Completed", date: "Feb 2026", progress: 100 },
        { name: "Phase 2: Core Clinic & Inpatient Modules", status: "Completed", date: "Jun 2026", progress: 100 },
        { name: "Phase 3: Security Hardening & HIPAA Compliance", status: "Completed", date: "Sep 2026", progress: 100 },
        { name: "Phase 4: Production Deployment & Handover", status: "Completed", date: "Oct 2026", progress: 100 },
      ],
      hosted: true,
      hostingStatus: "Hosted & Active (Production Cluster)",
      hostingProvider: "AWS EC2 Cluster + CloudFront Global CDN",
      hostedUrl: "https://aims.enterprise.zyllotech.com",
      domainName: "aims.enterprise.zyllotech.com",
      customDomain: "aimshealthcare.org",
      domainExpiryDate: "October 14, 2028",
      domainDaysRemaining: 715,
      domainAutoRenew: true,
      domainRegistrar: "Cloudflare Registrar Enterprise",
      domainRegisteredDate: "October 14, 2025 (3-Year Term)",
      domainNameservers: "ns1.cloudflare.com, ns2.cloudflare.com",
      dnssecStatus: "Active & Cryptographically Validated",
      sslStatus: "Active & Secure (Let's Encrypt Wildcard 256-bit)",
      sslExpiryDate: "January 14, 2027 (Auto-renews every 90 days)",
      sslIssuer: "Let's Encrypt Authority X3",
      serverIp: "13.234.112.89",
      serverRegion: "AWS ap-south-1 (Mumbai Datacenter)",
      uptime: "99.98% High Availability SLA",
      latency: "18ms Average Latency",
      backupWhere: "AWS S3 Vault (ap-south-1) & GitHub Enterprise Private Archive",
      backupLocation: "s3://zyllotech-backups/aims-core/archive-20261028.tar.gz",
      backupFrequency: "Daily Automated Snapshot (03:00 AM IST)",
      lastBackupTime: "Today at 03:00 AM IST (Integrity: 100% OK)",
      backupSize: "14.8 GB Encrypted AES-256",
      projectValue: "₹40,25,000",
      projectValueInr: "₹40,25,000",
      amcValue: "₹37,500 / Month",
      amcSchedule: "Annual AMC Active (Renewed Oct 2026 - Oct 2027)",
      paymentStatus: "100% Paid in Full",
    },
    sales: {
      quotation: {
        code: "QT-2026-AIMS-01",
        title: "Enterprise Architecture & ERP Modules Quotation",
        date: "15 Jan 2026",
        amount: "₹40,25,000",
        validity: "30 Days",
        status: "Approved & Signed",
        fileName: "Quotation_QT-2026-AIMS-01.pdf",
      },
      po: {
        code: "PO-AIMS-88412",
        title: "Official Purchase Order from AIMS Group",
        date: "28 Jan 2026",
        amount: "₹40,25,000",
        authorizedBy: "Chief Operating Officer, AIMS Group",
        status: "Received & Verified",
        fileName: "Purchase_Order_PO-88412.pdf",
      },
      so: {
        code: "SO-ZYL-2026-042",
        title: "Zyllo Tech Executed Sales Order",
        date: "02 Feb 2026",
        amount: "₹40,25,000",
        deliveryLead: "20 Weeks",
        status: "Executed & Booked",
        fileName: "Sales_Order_SO-042.pdf",
      },
      invoices: [
        {
          code: "INV-2026-081",
          title: "Advance Kickoff Invoice (30%)",
          date: "05 Feb 2026",
          amount: "₹12,07,500",
          status: "Paid",
          dueDate: "20 Feb 2026",
          fileName: "Invoice_INV-081.pdf",
        },
        {
          code: "INV-2026-094",
          title: "Core Modules & API Milestone (50%)",
          date: "18 Jun 2026",
          amount: "₹20,12,500",
          status: "Paid",
          dueDate: "02 Jul 2026",
          fileName: "Invoice_INV-094.pdf",
        },
        {
          code: "INV-2026-112",
          title: "Final UAT, Deployment & Handover (20%)",
          date: "15 Oct 2026",
          amount: "₹8,05,000",
          status: "Paid",
          dueDate: "30 Oct 2026",
          fileName: "Invoice_INV-112.pdf",
        },
        {
          code: "INV-2026-140",
          title: "Q4 AMC Support & Monitoring Maintenance",
          date: "25 Oct 2026",
          amount: "₹1,12,500",
          status: "Paid",
          dueDate: "10 Nov 2026",
          fileName: "Invoice_INV-140.pdf",
        },
      ],
    },
    updates: [
      {
        id: 1,
        sno: 1,
        updateReq: "Multi-factor authentication (MFA) & SMS OTP gateway integration",
        reqRecFrom: "Rajesh Varma (Security Lead, AIMS)",
        dateOfModification: "2026-10-24",
        status: "Completed",
        remarks: "Twilio & WhatsApp OTP microservice deployed and tested with 99.9% delivery rate.",
      },
      {
        id: 2,
        sno: 2,
        updateReq: "Patient discharge summary PDF export & digital doctor signatures",
        reqRecFrom: "Dr. K. S. Rao (Clinical Director)",
        dateOfModification: "2026-10-26",
        status: "Completed",
        remarks: "Digital PKI signature module verified; rendering sub-second hospital discharge reports.",
      },
      {
        id: 3,
        sno: 3,
        updateReq: "Automated billing reconciliation with Tally Prime API sync",
        reqRecFrom: "Finance & Accounts Dept (AIMS)",
        dateOfModification: "2026-10-28",
        status: "In Progress",
        remarks: "End-to-end webhook sync active in staging environment; scheduled for production deploy on Friday.",
      },
      {
        id: 4,
        sno: 4,
        updateReq: "Bed occupancy real-time WebSocket dashboard for emergency ward",
        reqRecFrom: "Operations Control Desk",
        dateOfModification: "2026-10-29",
        status: "Testing",
        remarks: "WebSocket load testing completed up to 5,000 concurrent sockets without connection drops.",
      },
    ],
  },
  {
    id: "stsll",
    name: "STSLL",
    fullName: "STS Logistics & Fleet Supply Chain Telematics",
    title: "STS Logistics & Fleet Supply Chain Telematics",
    client: "STS Logistics Ltd",
    company: "STS Logistics Ltd",
    category: "IoT & Supply Chain",
    status: "Completed",
    progress: 100,
    completion_date: "Sep 2026",
    description: "High-throughput fleet telematics, CAN-bus protocol ingestion, real-time geofencing, and driver dispatch mobile app with automated route telemetry.",
    tech_stack: ["React Native", "Go", "AWS IoT Core", "Kafka", "TimescaleDB"],
    accent: "from-[#3089a6] to-[#1f4693]",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    details: {
      completed: true,
      completionStatus: "Completed & Hosted (AMC Phase)",
      completionDate: "September 28, 2026",
      progress: 100,
      signoffAuthority: "Tariq Mansoor (VP Supply Chain, STS Logistics)",
      warrantyPeriod: "12-Month 24/7 SLA Warranty (Active till Sep 2027)",
      teamAssigned: "IoT Telematics Pod (1 Lead, 3 Mobile Devs, 2 Cloud Backend)",
      phases: [
        { name: "Phase 1: CAN-bus Fleet Telemetry & Protocol Specs", status: "Completed", date: "Mar 2026", progress: 100 },
        { name: "Phase 2: Real-time Geofencing & Driver Android App", status: "Completed", date: "Jun 2026", progress: 100 },
        { name: "Phase 3: High-Throughput Ingestion Queue (MQTT/Kafka)", status: "Completed", date: "Aug 2026", progress: 100 },
        { name: "Phase 4: Production Handover & Fleet Deployment", status: "Completed", date: "Sep 2026", progress: 100 },
      ],
      hosted: true,
      hostingStatus: "Hosted & Active (High Availability Cluster)",
      hostingProvider: "DigitalOcean Kubernetes (DOKS) + Cloudflare Enterprise",
      hostedUrl: "https://portal.stslogistics.ae",
      domainName: "portal.stslogistics.ae",
      customDomain: "stslogistics.ae",
      domainExpiryDate: "September 28, 2027",
      domainDaysRemaining: 334,
      domainAutoRenew: true,
      domainRegistrar: "GoDaddy Corporate Domains / AE Server",
      domainRegisteredDate: "September 28, 2024 (3-Year Term)",
      domainNameservers: "ns-ae1.stslogistics.ae, ns-ae2.stslogistics.ae",
      dnssecStatus: "Active & Enforced",
      sslStatus: "Active & Secure (Cloudflare Dedicated SSL)",
      sslExpiryDate: "December 28, 2026 (Auto-managed)",
      sslIssuer: "Cloudflare Inc ECC CA-3",
      serverIp: "159.89.172.63",
      serverRegion: "DigitalOcean me-central-1 (Dubai Datacenter)",
      uptime: "99.95% High Availability SLA",
      latency: "24ms Average Latency",
      backupWhere: "Google Cloud Storage (GCS Multi-Region) & Local Disaster Recovery NAS",
      backupLocation: "gs://zyllotech-stsll-vault/db-full-snapshot.dump",
      backupFrequency: "Real-time WAL Streaming & Nightly Full Snapshot",
      lastBackupTime: "Today at 01:30 AM UTC (Integrity: 100% OK)",
      backupSize: "28.4 GB Compressed Dump",
      projectValue: "₹31,50,000",
      projectValueInr: "₹31,50,000",
      amcValue: "₹31,500 / Month",
      amcSchedule: "Annual AMC Active (Covered 24/7 Telematics SLA)",
      paymentStatus: "100% Paid in Full",
    },
    sales: {
      quotation: {
        code: "QT-2026-STS-02",
        title: "Fleet Telematics & Mobile Dispatch Platform",
        date: "02 Feb 2026",
        amount: "₹31,50,000",
        validity: "30 Days",
        status: "Approved & Signed",
        fileName: "Quotation_QT-STS-02.pdf",
      },
      po: {
        code: "PO-STS-77190",
        title: "Official Purchase Order from STS Logistics",
        date: "10 Feb 2026",
        amount: "₹31,50,000",
        authorizedBy: "VP of Supply Chain, STS",
        status: "Verified & Approved",
        fileName: "Purchase_Order_PO-STS.pdf",
      },
      so: {
        code: "SO-ZYL-2026-079",
        title: "Zyllo Tech Executed Sales Order",
        date: "15 Feb 2026",
        amount: "₹31,50,000",
        deliveryLead: "16 Weeks",
        status: "Confirmed & Closed",
        fileName: "Sales_Order_SO-STS.pdf",
      },
      invoices: [
        {
          code: "INV-2026-092",
          title: "Project Inception & Geofencing SDK",
          date: "20 Feb 2026",
          amount: "₹9,45,000",
          status: "Paid",
          dueDate: "05 Mar 2026",
          fileName: "Invoice_INV-092.pdf",
        },
        {
          code: "INV-2026-105",
          title: "Fleet Telematics & Driver Mobile App",
          date: "12 May 2026",
          amount: "₹15,75,000",
          status: "Paid",
          dueDate: "26 May 2026",
          fileName: "Invoice_INV-105.pdf",
        },
        {
          code: "INV-2026-121",
          title: "Production Cutover & Hardware Certification",
          date: "30 Sep 2026",
          amount: "₹6,30,000",
          status: "Paid",
          dueDate: "14 Oct 2026",
          fileName: "Invoice_INV-121.pdf",
        },
      ],
    },
    updates: [
      {
        id: 1,
        sno: 1,
        updateReq: "Fuel consumption sensor integration with CAN-bus OBD-II protocol",
        reqRecFrom: "Tariq Mansoor (Fleet Manager)",
        dateOfModification: "2026-10-18",
        status: "Completed",
        remarks: "CAN-bus parsing engine calibrated for Volvo and Scania truck telemetry.",
      },
      {
        id: 2,
        sno: 2,
        updateReq: "Geofence violation instant WhatsApp alerts for route deviation",
        reqRecFrom: "Dispatch & Safety Desk (Dubai Hub)",
        dateOfModification: "2026-10-25",
        status: "Completed",
        remarks: "Geo-fencing polygon triggers optimized down to 1.5 seconds alert latency.",
      },
      {
        id: 3,
        sno: 3,
        updateReq: "Custom export for Dubai RTA & Saudi Customs manifest filing",
        reqRecFrom: "Cross-Border Logistics Team",
        dateOfModification: "2026-10-27",
        status: "In Progress",
        remarks: "XML and Excel schema matching Saudi ZATCA standards currently being verified.",
      },
    ],
  },
  {
    id: "gcoman",
    name: "Gcoman",
    fullName: "Gcoman Engineering & Oilfield Services Portal",
    title: "Gcoman Engineering & Oilfield Services Portal",
    client: "Gcoman Global Energy LLC",
    company: "Gcoman Global Energy LLC",
    category: "Industrial SaaS & Field Ops",
    status: "Completed",
    progress: 100,
    completion_date: "Aug 2026",
    description: "Oilfield asset inventory, rig inspection PWA with offline-first SQLite sync, sovereign OCI compute deployment, and Permit to Work (PTW) multi-level approvals.",
    tech_stack: ["Next.js", "Python FastAPI", "Oracle Cloud (OCI)", "SQLite", "IndexedDB"],
    accent: "from-[#8b5cf6] to-[#6366f1]",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    details: {
      completed: true,
      completionStatus: "Completed (In Annual AMC Support)",
      completionDate: "August 19, 2026",
      progress: 100,
      signoffAuthority: "Hamed Al-Balushi (Managing Director, Gcoman LLC)",
      warrantyPeriod: "Annual Sovereign Support SLA (Active till Aug 2027)",
      teamAssigned: "Industrial Systems Engineering Team (5 Specialists)",
      phases: [
        { name: "Phase 1: Oilfield Asset Inventory & Schema Design", status: "Completed", date: "Apr 2026", progress: 100 },
        { name: "Phase 2: Rig Inspection PWA with Offline-First Sync", status: "Completed", date: "Jun 2026", progress: 100 },
        { name: "Phase 3: OCI Sovereign Cloud Migration & Cyber Security", status: "Completed", date: "Jul 2026", progress: 100 },
        { name: "Phase 4: Field Staff Onboarding & Official Handover", status: "Completed", date: "Aug 2026", progress: 100 },
      ],
      hosted: true,
      hostingStatus: "Hosted & Active (Sovereign Muscat Datacenter)",
      hostingProvider: "OCI Dedicated Compute & Enterprise Firewall",
      hostedUrl: "https://ops.gcoman.om",
      domainName: "ops.gcoman.om",
      customDomain: "gcoman.om",
      domainExpiryDate: "August 19, 2028",
      domainDaysRemaining: 659,
      domainAutoRenew: true,
      domainRegistrar: "Oman Telecommunications Regulatory Authority (TRA) / Omantel",
      domainRegisteredDate: "August 19, 2023 (5-Year Sovereign License)",
      domainNameservers: "ns1.omantel.net.om, ns2.omantel.net.om",
      dnssecStatus: "Active Sovereign Validation",
      sslStatus: "Active & Secure (DigiCert EV High Assurance SSL)",
      sslExpiryDate: "August 19, 2027",
      sslIssuer: "DigiCert Global Root G2",
      serverIp: "130.61.88.214",
      serverRegion: "Oracle Cloud Infrastructure (Muscat Datacenter)",
      uptime: "99.99% Sovereign SLA",
      latency: "14ms Gulf Dedicated Link",
      backupWhere: "Oracle Cloud Infrastructure (OCI) Muscat Region & Encrypted Vault",
      backupLocation: "oci://gcoman-backups/prod-vol-202610.tar.gz",
      backupFrequency: "Daily 02:00 AM GST Encrypted Snapshot",
      lastBackupTime: "Yesterday at 02:00 AM GST (Verified Valid)",
      backupSize: "42.1 GB Cold Encrypted Vault",
      projectValue: "₹45,00,000",
      projectValueInr: "₹45,00,000",
      amcValue: "₹41,500 / Month",
      amcSchedule: "Annual AMC Active (On-call 2-Hour SLA)",
      paymentStatus: "100% Paid in Full",
    },
    sales: {
      quotation: {
        code: "QT-2026-GCO-01",
        title: "Field Asset Tracking & Rig Inspection Portal Quotation",
        date: "10 Mar 2026",
        amount: "₹45,00,000",
        validity: "45 Days",
        status: "Approved & Executed",
        fileName: "Quotation_GCO-01.pdf",
      },
      po: {
        code: "PO-GCO-44910",
        title: "Official Purchase Order from Gcoman Energy",
        date: "22 Mar 2026",
        amount: "₹45,00,000",
        authorizedBy: "Managing Director, Gcoman",
        status: "Authorized & Archived",
        fileName: "Purchase_Order_GCO.pdf",
      },
      so: {
        code: "SO-ZYL-2026-118",
        title: "Zyllo Tech Executed Sales Order",
        date: "25 Mar 2026",
        amount: "₹45,00,000",
        deliveryLead: "22 Weeks",
        status: "Executed & Delivered",
        fileName: "Sales_Order_GCO.pdf",
      },
      invoices: [
        {
          code: "INV-2026-101",
          title: "Platform Architecture & Field App MVP",
          date: "30 Mar 2026",
          amount: "₹13,50,000",
          status: "Paid",
          dueDate: "14 Apr 2026",
          fileName: "Invoice_INV-101.pdf",
        },
        {
          code: "INV-2026-115",
          title: "Off-grid Offline SQLite Sync & Work Orders",
          date: "10 Jul 2026",
          amount: "₹22,50,000",
          status: "Paid",
          dueDate: "24 Jul 2026",
          fileName: "Invoice_INV-115.pdf",
        },
        {
          code: "INV-2026-130",
          title: "Final Compliance Signoff & Site Rollout",
          date: "25 Aug 2026",
          amount: "₹9,00,000",
          status: "Paid",
          dueDate: "10 Sep 2026",
          fileName: "Invoice_INV-130.pdf",
        },
      ],
    },
    updates: [
      {
        id: 1,
        sno: 1,
        updateReq: "Offline-first inspection forms with high-resolution photo compression",
        reqRecFrom: "Sultan Al-Harthy (HSE Director, Gcoman)",
        dateOfModification: "2026-10-12",
        status: "Completed",
        remarks: "IndexedDB local cache implemented; auto-syncs when rig reconnects to Starlink satellite.",
      },
      {
        id: 2,
        sno: 2,
        updateReq: "Permit to Work (PTW) electronic multi-level supervisor approval",
        reqRecFrom: "Safety Operations Desk",
        dateOfModification: "2026-10-21",
        status: "Completed",
        remarks: "Role-based signing hierarchy active with digital timestamp verification.",
      },
      {
        id: 3,
        sno: 3,
        updateReq: "Equipment calibration due date automated warning alerts",
        reqRecFrom: "Maintenance Engineering Lead",
        dateOfModification: "2026-10-26",
        status: "In Progress",
        remarks: "Cron scheduler firing 30-day, 14-day, and 48-hour automated reminders.",
      },
    ],
  },
  {
    id: "techwin",
    name: "Techwin",
    fullName: "Techwin Smart IoT & Factory Automation Hub",
    title: "Techwin Smart IoT & Factory Automation Hub",
    client: "Techwin Solutions Inc.",
    company: "Techwin Solutions Inc.",
    category: "IoT Automation & Web SaaS",
    status: "In Progress",
    progress: 75,
    completion_date: "Dec 2026",
    description: "Factory SCADA MQTT edge gateway telemetry, machine health monitoring, shift RBAC, and automated predictive maintenance alerting engine.",
    tech_stack: ["React", "FastAPI", "AWS ECS Fargate", "MQTT", "PostgreSQL"],
    accent: "from-[#ea580c] to-[#f97316]",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
    details: {
      completed: false,
      completionStatus: "In Progress (Sprint 4 Testing Active)",
      completionDate: "Target: Dec 15, 2026",
      progress: 75,
      signoffAuthority: "Sarah Jenkins (VP Engineering, Techwin Inc.)",
      warrantyPeriod: "Standard 12-Month Warranty upon Dec 2026 Go-Live",
      teamAssigned: "Factory Automation Pod (1 Lead, 3 Embedded Engineers, 2 Fullstack)",
      phases: [
        { name: "Phase 1: SCADA MQTT Pipeline & Edge Gateways", status: "Completed", date: "Jul 2026", progress: 100 },
        { name: "Phase 2: Machine Health Telemetry & Shift RBAC", status: "Completed", date: "Sep 2026", progress: 100 },
        { name: "Phase 3: Automated Preventive Maintenance Engine", status: "In Progress", date: "Nov 2026", progress: 75 },
        { name: "Phase 4: Factory UAT & Production Launch Cutover", status: "Upcoming", date: "Dec 2026", progress: 0 },
      ],
      hosted: true,
      hostingStatus: "Hosted on Staging Live Cluster (UAT Phase)",
      hostingProvider: "AWS ECS Fargate + Amazon RDS Multi-AZ",
      hostedUrl: "https://staging.techwinsmart.com",
      domainName: "staging.techwinsmart.com",
      customDomain: "techwinsmart.com (Production Reserved)",
      domainExpiryDate: "June 20, 2027",
      domainDaysRemaining: 234,
      domainAutoRenew: true,
      domainRegistrar: "Amazon Route 53 Domains",
      domainRegisteredDate: "June 20, 2025 (2-Year Term)",
      domainNameservers: "ns-842.awsdns-41.net, ns-1430.awsdns-50.org",
      dnssecStatus: "Active AWS Route 53 DNSSEC",
      sslStatus: "Active Staging SSL Certificate (Amazon Trust Services)",
      sslExpiryDate: "June 20, 2027",
      sslIssuer: "Amazon RSA 2048 M02",
      serverIp: "52.66.194.12",
      serverRegion: "AWS ap-south-1 (Hyderabad Datacenter)",
      uptime: "99.85% Staging Availability",
      latency: "22ms Staging Latency",
      backupWhere: "AWS S3 Staging Vault & GitHub CI/CD Automated Artifacts",
      backupLocation: "s3://zyllotech-techwin-dev/sprint-backup-latest.tar",
      backupFrequency: "Post-Commit CI/CD Snapshot & Nightly DB Dump",
      lastBackupTime: "Today at 05:00 AM IST (Automated CI/CD)",
      backupSize: "8.6 GB Sprint Snapshot",
      projectValue: "₹34,50,000",
      projectValueInr: "₹34,50,000",
      amcValue: "₹33,000 / Month",
      amcSchedule: "Scheduled Kickoff upon Final Dec 2026 Handover",
      paymentStatus: "70% Paid (₹24,15,000 Paid · ₹10,35,000 Pending Milestone)",
    },
    sales: {
      quotation: {
        code: "QT-2026-TW-04",
        title: "IoT Sensor Streaming & SCADA Dashboard Quotation",
        date: "15 Jun 2026",
        amount: "₹34,50,000",
        validity: "30 Days",
        status: "Approved",
        fileName: "Quotation_TW-04.pdf",
      },
      po: {
        code: "PO-TW-99318",
        title: "Official Purchase Order from Techwin Inc.",
        date: "24 Jun 2026",
        amount: "₹34,50,000",
        authorizedBy: "VP Technology, Techwin Inc.",
        status: "Received & Authorized",
        fileName: "Purchase_Order_TW.pdf",
      },
      so: {
        code: "SO-ZYL-2026-188",
        title: "Zyllo Tech Executed Sales Order",
        date: "28 Jun 2026",
        amount: "₹34,50,000",
        deliveryLead: "18 Weeks",
        status: "In Execution",
        fileName: "Sales_Order_TW.pdf",
      },
      invoices: [
        {
          code: "INV-2026-118",
          title: "Advance Initiation Sprint (35%)",
          date: "02 Jul 2026",
          amount: "₹12,07,500",
          status: "Paid",
          dueDate: "16 Jul 2026",
          fileName: "Invoice_INV-118.pdf",
        },
        {
          code: "INV-2026-135",
          title: "MQTT Telemetry & Microservices Engine (35%)",
          date: "15 Sep 2026",
          amount: "₹12,07,500",
          status: "Paid",
          dueDate: "30 Sep 2026",
          fileName: "Invoice_INV-135.pdf",
        },
        {
          code: "INV-2026-152",
          title: "Final Factory Testing & Production Cutover (30%)",
          date: "15 Dec 2026 (Scheduled)",
          amount: "₹10,35,000",
          status: "Pending",
          dueDate: "30 Dec 2026",
          fileName: "Invoice_INV-152.pdf",
        },
      ],
    },
    updates: [
      {
        id: 1,
        sno: 1,
        updateReq: "MQTT broker latency optimization for sensor packet buffering",
        reqRecFrom: "Brian Miller (IoT Architect, Techwin)",
        dateOfModification: "2026-10-15",
        status: "Completed",
        remarks: "Cluster upgraded to EMQX Enterprise broker; handles 40,000 messages/sec under 18ms.",
      },
      {
        id: 2,
        sno: 2,
        updateReq: "Factory floor temperature & vibration real-time anomaly graphs",
        reqRecFrom: "Production Engineering Lead",
        dateOfModification: "2026-10-23",
        status: "Completed",
        remarks: "Recharts time-series streaming graphs with threshold limit alerts.",
      },
      {
        id: 3,
        sno: 3,
        updateReq: "Role-based operator access control with shift assignment schedules",
        reqRecFrom: "Plant Operations Manager",
        dateOfModification: "2026-10-27",
        status: "In Progress",
        remarks: "Shift-based RBAC permissions implemented; unit test coverage at 94%.",
      },
      {
        id: 4,
        sno: 4,
        updateReq: "Automated maintenance work-order generation on machine fault",
        reqRecFrom: "Maintenance Supervisor",
        dateOfModification: "2026-10-29",
        status: "Pending Approval",
        remarks: "Architecture RFC approved; starting sprint integration next Monday.",
      },
    ],
  },
];

const STORAGE_KEY = "zyllotech_admin_project_tracker";

export function convertUsdStringToInr(val) {
  if (!val) return val;
  const str = String(val).trim();
  if (str.startsWith("₹")) return str;
  if (str.startsWith("$")) {
    const num = parseInt(str.replace(/[^0-9]/g, ""), 10);
    if (!isNaN(num)) {
      if (num === 48500) return "₹40,25,000";
      if (num === 38000) return "₹31,50,000";
      if (num === 54000) return "₹45,00,000";
      if (num === 41500) return "₹34,50,000";
      if (num === 45000) return "₹37,50,000";
      if (num === 450) return "₹37,500 / Month";
      if (num === 380) return "₹31,500 / Month";
      if (num === 500) return "₹41,500 / Month";
      if (num === 400) return "₹33,000 / Month";
      if (num === 14550) return "₹12,07,500";
      if (num === 24250) return "₹20,12,500";
      if (num === 9700) return "₹8,05,000";
      if (num === 1350) return "₹1,12,500";
      if (num === 11400) return "₹9,45,000";
      if (num === 19000) return "₹15,75,000";
      if (num === 7600) return "₹6,30,000";
      if (num === 16200) return "₹13,50,000";
      if (num === 27000) return "₹22,50,000";
      if (num === 10800) return "₹9,00,000";
      if (num === 14525) return "₹12,07,500";
      if (num === 12450) return "₹10,35,000";
      const inr = Math.round((num * 83) / 1000) * 1000;
      return `₹${inr.toLocaleString("en-IN")}`;
    }
  }
  return str;
}

function sanitizeProjectCurrencyToInr(p) {
  if (!p) return p;
  const details = p.details ? {
    ...p.details,
    projectValue: convertUsdStringToInr(p.details.projectValue || p.details.projectValueInr),
    projectValueInr: convertUsdStringToInr(p.details.projectValueInr || p.details.projectValue),
    amcValue: convertUsdStringToInr(p.details.amcValue),
    paymentStatus: typeof p.details.paymentStatus === "string" && p.details.paymentStatus.includes("$")
      ? p.details.paymentStatus.replace(/\$29,050/g, "₹24,15,000").replace(/\$12,450/g, "₹10,35,000")
      : p.details.paymentStatus,
  } : p.details;

  const sales = p.sales ? {
    ...p.sales,
    quotation: p.sales.quotation ? { ...p.sales.quotation, amount: convertUsdStringToInr(p.sales.quotation.amount) } : p.sales.quotation,
    po: p.sales.po ? { ...p.sales.po, amount: convertUsdStringToInr(p.sales.po.amount) } : p.sales.po,
    so: p.sales.so ? { ...p.sales.so, amount: convertUsdStringToInr(p.sales.so.amount) } : p.sales.so,
    invoices: Array.isArray(p.sales.invoices)
      ? p.sales.invoices.map((inv) => ({ ...inv, amount: convertUsdStringToInr(inv.amount) }))
      : p.sales.invoices,
  } : p.sales;

  return {
    ...p,
    details,
    sales,
  };
}

export function getStoredTrackerProjects() {
  if (typeof window === "undefined") return INITIAL_TRACKER_PROJECTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TRACKER_PROJECTS));
      return INITIAL_TRACKER_PROJECTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Merge initial rich telemetry with any persisted updates or edits
      const merged = INITIAL_TRACKER_PROJECTS.map((init) => {
        const found = parsed.find((p) => String(p.id) === String(init.id));
        if (!found) return init;
        return sanitizeProjectCurrencyToInr({
          ...init,
          ...found,
          title: found.title || found.fullName || init.fullName,
          fullName: found.fullName || init.fullName,
          client: found.client || init.client,
          company: found.company || found.client || init.client,
          category: found.category || init.category,
          status: found.status || (found.details?.completed ? "Completed" : found.details?.completionStatus?.includes("Testing") ? "Testing" : found.details?.completionStatus || "In Progress"),
          progress: found.progress ?? found.details?.progress ?? init.details?.progress ?? 50,
          completion_date: found.completion_date || found.details?.completionDate || init.details?.completionDate,
          description: found.description || init.description,
          tech_stack: found.tech_stack || init.tech_stack,
          last_update_note: found.last_update_note || init.last_update_note,
          last_updated_at: found.last_updated_at || init.last_updated_at,
          details: { ...init.details, ...(found.details || {}) },
          sales: { ...init.sales, ...(found.sales || {}) },
          updates: found.updates || init.updates,
        });
      });

      // Preserve any custom newly added projects that were created in Project Tracker!
      const initialIds = new Set(INITIAL_TRACKER_PROJECTS.map((p) => String(p.id)));
      const customProjects = parsed.filter((p) => !initialIds.has(String(p.id))).map((cp) => sanitizeProjectCurrencyToInr({
        ...cp,
        title: cp.title || cp.fullName || cp.name,
        company: cp.company || cp.client,
        status: cp.status || (cp.details?.completed ? "Completed" : cp.details?.completionStatus?.includes("Testing") ? "Testing" : cp.details?.completionStatus || "In Progress"),
        progress: cp.progress ?? cp.details?.progress ?? 40,
        completion_date: cp.completion_date || cp.details?.completionDate || "Dec 2026",
      }));

      const finalProjects = [...merged, ...customProjects];
      // Keep storage normalized to INR
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(finalProjects));
      } catch {
        // ignore
      }
      return finalProjects;
    }
  } catch (e) {
    console.warn("Error reading project tracker data from localStorage:", e);
  }
  return INITIAL_TRACKER_PROJECTS;
}

export function saveStoredTrackerProjects(projects) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));

    // Also mirror to zyllotech_portal_projects so Client Workspace stays 100% in sync
    const clientProjects = projects.map((p) => ({
      id: p.id,
      name: p.name || p.title,
      title: p.title || p.fullName || p.name,
      fullName: p.fullName || p.title || p.name,
      client: p.client,
      company: p.company || p.client,
      category: p.category,
      status: p.status || (p.details?.completed ? "Completed" : p.details?.completionStatus?.includes("Testing") ? "Testing" : p.details?.completionStatus || "In Progress"),
      progress: p.progress ?? p.details?.progress ?? 50,
      completion_date: p.completion_date || p.details?.completionDate || "Dec 2026",
      description: p.description || `${p.fullName || p.name} - Managed by Zyllo Tech enterprise pod.`,
      tech_stack: p.tech_stack || (p.details?.phases?.map((ph) => ph.name) || ["React", "Node.js", "Cloud"]),
      last_update_note: p.last_update_note || (p.updates && p.updates[0] ? p.updates[0].updateReq : ""),
      last_updated_at: p.last_updated_at || (p.updates && p.updates[0] ? p.updates[0].dateOfModification : ""),
      accent: p.accent || "from-[#f96706] to-[#f7941e]",
      badgeColor: p.badgeColor || "bg-emerald-100 text-emerald-800 border-emerald-300",
      details: p.details,
      sales: p.sales,
      updates: p.updates,
    }));
    localStorage.setItem("zyllotech_portal_projects", JSON.stringify(clientProjects));

    // Dispatch custom event to trigger instant live updates in open views
    window.dispatchEvent(new CustomEvent("zyllotech_projects_updated", { detail: projects }));
  } catch (e) {
    console.warn("Error saving project tracker data to localStorage:", e);
  }
}

/**
 * Adds a new enterprise project to Project Tracker and synchronizes it with Client Workspace
 */
export function addNewTrackerProject(newProjData) {
  const currentProjects = getStoredTrackerProjects();
  const slug = (newProjData.name || "project")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-") || `proj_${Date.now()}`;
  const id = newProjData.id || slug;

  const todayDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  const todayIso = new Date().toISOString().split("T")[0];
  const progressNum = Number(newProjData.progress ?? 40);
  const isCompleted = newProjData.status === "Completed" || progressNum === 100;

  const parsedTechStack = Array.isArray(newProjData.tech_stack)
    ? newProjData.tech_stack
    : typeof newProjData.tech_stack === "string" && newProjData.tech_stack.trim()
    ? newProjData.tech_stack.split(",").map((s) => s.trim()).filter(Boolean)
    : ["React 19", "Node.js", "PostgreSQL", "Cloud CDN"];

  const fullProject = {
    id,
    name: newProjData.name.trim(),
    fullName: (newProjData.fullName && newProjData.fullName.trim()) || newProjData.name.trim(),
    title: (newProjData.fullName && newProjData.fullName.trim()) || newProjData.name.trim(),
    client: (newProjData.client && newProjData.client.trim()) || "Enterprise Client",
    company: (newProjData.client && newProjData.client.trim()) || "Enterprise Client",
    category: newProjData.category || "Enterprise ERP & Cloud",
    accent: newProjData.accent || "from-[#f96706] to-[#1f4693]",
    badgeColor: isCompleted ? "bg-emerald-100 text-emerald-800 border-emerald-300" : "bg-blue-100 text-blue-800 border-blue-300",
    status: newProjData.status || "In Progress",
    progress: progressNum,
    completion_date: newProjData.completion_date || "Dec 2026",
    description: (newProjData.description && newProjData.description.trim()) || `${newProjData.fullName || newProjData.name} - Enterprise architecture deployed and maintained by Zyllo Tech engineering pod.`,
    tech_stack: parsedTechStack,
    last_update_note: newProjData.initialUpdate || "Project registered and initialized in Zyllo Tech Enterprise Portfolio.",
    last_updated_at: todayDate,
    details: {
      completed: isCompleted,
      completionStatus: isCompleted ? "Completed (Production Ready)" : `${newProjData.status || "In Progress"} (${progressNum}% Live Progress)`,
      completionDate: newProjData.completion_date || "Target: Dec 2026",
      progress: progressNum,
      signoffAuthority: newProjData.signoffAuthority || "Lead Solutions Architect & Client PM",
      warrantyPeriod: "12-Month Extended Enterprise Warranty from Cutover",
      teamAssigned: newProjData.teamAssigned || "Dedicated Enterprise Pod (1 Lead, 3 Developers, 1 QA)",
      phases: [
        { name: "Phase 1: Architecture Blueprint & Requirements", status: "Completed", date: todayDate, progress: 100 },
        { name: "Phase 2: Core Engineering & Sprint Development", status: progressNum >= 50 ? "Completed" : "In Progress", date: progressNum >= 50 ? todayDate : "Upcoming", progress: progressNum },
        { name: "Phase 3: QA Hardening & Security Audit", status: progressNum >= 85 ? "Completed" : progressNum >= 50 ? "In Progress" : "Upcoming", date: "Upcoming", progress: progressNum >= 85 ? 100 : 0 },
        { name: "Phase 4: Production Deployment & Cutover", status: isCompleted ? "Completed" : "Upcoming", date: newProjData.completion_date || "Upcoming", progress: isCompleted ? 100 : 0 },
      ],
      hosted: Boolean(newProjData.hosted ?? true),
      hostingStatus: newProjData.hosted !== false ? "Hosted & Active (Production Cluster)" : "Staging & Pre-deployment",
      hostingProvider: newProjData.hostingProvider || "AWS Cloud Compute Cluster + Cloudflare CDN",
      hostedUrl: newProjData.hostedUrl || (newProjData.domainName ? `https://${newProjData.domainName}` : `https://${id}.zyllotech.com`),
      domainName: newProjData.domainName || `${id}.zyllotech.com`,
      customDomain: newProjData.customDomain || (newProjData.domainName || `${id}.com`),
      domainExpiryDate: newProjData.domainExpiryDate || "October 14, 2028",
      domainDaysRemaining: 730,
      domainAutoRenew: true,
      domainRegistrar: "Cloudflare Registrar Enterprise",
      domainRegisteredDate: `${todayDate} (3-Year Term)`,
      domainNameservers: "ns1.cloudflare.com, ns2.cloudflare.com",
      dnssecStatus: "Active & Validated",
      sslStatus: "Active & Secure (Let's Encrypt Wildcard 256-bit)",
      sslExpiryDate: "Auto-renews every 90 days",
      sslIssuer: "Let's Encrypt Authority X3",
      serverIp: newProjData.serverIp || "13.234.180.45",
      serverRegion: newProjData.serverRegion || "AWS ap-south-1 (Mumbai Region)",
      uptime: "99.95% High Availability SLA",
      latency: "19ms Average Response",
      backupWhere: newProjData.backupWhere || "AWS S3 Vault & GitHub Private Enterprise Archive",
      backupLocation: newProjData.backupLocation || `s3://zyllotech-backups/${id}/archive-latest.tar.gz`,
      backupFrequency: newProjData.backupFrequency || "Daily Automated Snapshot (03:00 AM IST)",
      lastBackupTime: "Automated Routine Active",
      backupSize: "6.4 GB Encrypted AES-256",
      projectValue: newProjData.projectValue ? convertUsdStringToInr(newProjData.projectValue) : "₹37,50,000",
      projectValueInr: newProjData.projectValueInr ? convertUsdStringToInr(newProjData.projectValueInr) : "₹37,50,000",
      amcValue: newProjData.amcValue ? convertUsdStringToInr(newProjData.amcValue) : "₹35,000 / Month",
      amcSchedule: "Annual AMC Active (On-Call SLA Included)",
      paymentStatus: newProjData.paymentStatus || "Active Contract (Milestones Billing)",
    },
    sales: {
      quotation: {
        code: `QT-2026-${id.toUpperCase()}-01`,
        title: `${newProjData.name} Architecture & Engineering Quotation`,
        date: todayDate,
        amount: newProjData.projectValue ? convertUsdStringToInr(newProjData.projectValue) : "₹37,50,000",
        validity: "30 Days",
        status: "Approved & Signed",
        fileName: `Quotation_${id.toUpperCase()}-01.pdf`,
      },
      po: {
        code: `PO-${id.toUpperCase()}-88210`,
        title: `Official Purchase Order - ${newProjData.client || "Client"}`,
        date: todayDate,
        amount: newProjData.projectValue ? convertUsdStringToInr(newProjData.projectValue) : "₹37,50,000",
        authorizedBy: `Executive Management, ${newProjData.client || "Client"}`,
        status: "Received & Authorized",
        fileName: `Purchase_Order_${id.toUpperCase()}.pdf`,
      },
      so: {
        code: `SO-ZYL-2026-${Math.floor(100 + Math.random() * 900)}`,
        title: `Zyllo Tech Executed Sales Order - ${newProjData.name}`,
        date: todayDate,
        amount: newProjData.projectValue ? convertUsdStringToInr(newProjData.projectValue) : "₹37,50,000",
        deliveryLead: "16-20 Weeks",
        status: "Executed & Active",
        fileName: `Sales_Order_${id.toUpperCase()}.pdf`,
      },
      invoices: [
        {
          code: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
          title: `Project Kickoff Advance (30%)`,
          date: todayDate,
          amount: newProjData.projectValue
            ? `₹${Math.round(parseInt(String(newProjData.projectValue).replace(/[^0-9]/g, "") || "3750000", 10) * 0.3).toLocaleString("en-IN")}`
            : "₹11,25,000",
          status: "Paid",
          dueDate: todayDate,
          fileName: `Invoice_INV_${id.toUpperCase()}_01.pdf`,
        },
      ],
    },
    updates: [
      {
        id: Date.now(),
        sno: 1,
        updateReq: newProjData.initialUpdate || "Initial project kickoff, architecture sign-off, and repository initialization.",
        reqRecFrom: (newProjData.client && newProjData.client.trim()) || "Client Leadership",
        dateOfModification: todayIso,
        status: newProjData.status || "In Progress",
        remarks: "Sprint pipeline provisioned and active on Zyllo Tech enterprise delivery infrastructure.",
      },
    ],
  };

  const updatedProjects = [fullProject, ...currentProjects];
  saveStoredTrackerProjects(updatedProjects);
  return updatedProjects;
}

/**
 * Synchronizes project status, progress, target date, and note from Client Workspace into Project Tracker
 */
export function updateProjectStatusSync(projectId, { status, progress, completion_date, note }) {
  const allProjects = getStoredTrackerProjects();
  const dateStr = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const todayIso = new Date().toISOString().split("T")[0];

  const updatedProjects = allProjects.map((p) => {
    if (String(p.id) === String(projectId)) {
      const isCompleted = status === "Completed" || Number(progress) === 100;
      const existingUpdates = p.updates || [];
      const nextSno = existingUpdates.length > 0 ? Math.max(...existingUpdates.map((u) => u.sno || 0)) + 1 : 1;

      // Add modification log entry so it shows up in Project Tracker Updates tab!
      const newUpdateEntry = {
        id: Date.now(),
        sno: nextSno,
        updateReq: note && note.trim() ? note.trim() : `Project status updated to "${status}" (${progress}% progress)`,
        reqRecFrom: "Client Workspace",
        dateOfModification: todayIso,
        status: status === "Completed" ? "Completed" : status === "Testing" ? "Testing" : status === "Active" ? "Completed" : "In Progress",
        remarks: `Live telemetry updated via Client Workspace. Target: ${completion_date}`,
      };

      const updatedDetails = {
        ...(p.details || {}),
        completed: isCompleted,
        completionStatus: isCompleted ? "Completed (Live & Verified)" : `${status} (${progress}% Progress)`,
        completionDate: completion_date || p.details?.completionDate,
        progress: Number(progress),
      };

      return {
        ...p,
        status,
        progress: Number(progress),
        completion_date,
        last_update_note: note && note.trim() ? note.trim() : p.last_update_note,
        last_updated_at: dateStr,
        details: updatedDetails,
        updates: [newUpdateEntry, ...existingUpdates],
      };
    }
    return p;
  });

  saveStoredTrackerProjects(updatedProjects);
  return updatedProjects;
}

/**
 * Synchronizes updated project hosting and infrastructure configuration from Client Workspace / Admin Tracker
 */
export function updateProjectHostingSync(projectId, {
  hosted,
  hostingStatus,
  domainName,
  hostedUrl,
  customDomain,
  hostingProvider,
  serverRegion,
  serverIp,
  domainExpiryDate,
  domainAutoRenew,
  domainRegistrar,
  sslStatus,
  sslExpiryDate,
  uptime,
  latency,
  note,
  updater = "Client Workspace",
}) {
  const allProjects = getStoredTrackerProjects();
  const dateStr = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const todayIso = new Date().toISOString().split("T")[0];

  const updatedProjects = allProjects.map((p) => {
    if (String(p.id) === String(projectId)) {
      const existingUpdates = p.updates || [];
      const nextSno = existingUpdates.length > 0 ? Math.max(...existingUpdates.map((u) => u.sno || 0)) + 1 : 1;

      const cleanDomain = domainName
        ? domainName.trim().replace(/^https?:\/\//, "").replace(/\/+$/, "")
        : p.details?.domainName || `${projectId}.zyllotech.com`;
      const cleanUrl = hostedUrl && hostedUrl.trim() ? hostedUrl.trim() : `https://${cleanDomain}`;

      const isHosted = hosted !== undefined ? Boolean(hosted) : Boolean(p.details?.hosted);
      const computedHostingStatus = hostingStatus || (isHosted ? "Hosted & Active (Production Cluster)" : "Staging & Pre-deployment");

      const newUpdateEntry = {
        id: Date.now(),
        sno: nextSno,
        updateReq: note && note.trim()
          ? note.trim()
          : `Hosting details updated: ${cleanDomain} (${computedHostingStatus})`,
        reqRecFrom: updater,
        dateOfModification: todayIso,
        status: "Completed",
        remarks: `Provider: ${hostingProvider || p.details?.hostingProvider || "AWS Cloud"}. Expiry: ${domainExpiryDate || p.details?.domainExpiryDate || "Oct 2028"}.`,
      };

      const updatedDetails = {
        ...(p.details || {}),
        hosted: isHosted,
        hostingStatus: computedHostingStatus,
        domainName: cleanDomain,
        hostedUrl: cleanUrl,
        customDomain: customDomain !== undefined ? customDomain : p.details?.customDomain,
        hostingProvider: hostingProvider || p.details?.hostingProvider,
        serverRegion: serverRegion || p.details?.serverRegion,
        serverIp: serverIp || p.details?.serverIp,
        domainExpiryDate: domainExpiryDate || p.details?.domainExpiryDate,
        domainAutoRenew: domainAutoRenew !== undefined ? Boolean(domainAutoRenew) : p.details?.domainAutoRenew,
        domainRegistrar: domainRegistrar || p.details?.domainRegistrar,
        sslStatus: sslStatus || p.details?.sslStatus,
        sslExpiryDate: sslExpiryDate || p.details?.sslExpiryDate,
        uptime: uptime || p.details?.uptime,
        latency: latency || p.details?.latency,
      };

      return {
        ...p,
        last_update_note: `Hosting updated: ${cleanDomain} (${hostingProvider || p.details?.hostingProvider || "Cloud"}).`,
        last_updated_at: dateStr,
        details: updatedDetails,
        updates: [newUpdateEntry, ...existingUpdates],
      };
    }
    return p;
  });

  saveStoredTrackerProjects(updatedProjects);
  return updatedProjects;
}

/**
 * Synchronizes uploaded project backup file metadata from Client Workspace / Admin Tracker
 */
export function uploadProjectBackupSync(projectId, { fileName, fileSize, backupWhere, notes, uploader = "Client Workspace" }) {
  const allProjects = getStoredTrackerProjects();
  const dateStr = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const todayIso = new Date().toISOString().split("T")[0];
  const timeStr = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  const cleanFileName = fileName || `backup-${projectId}-${Date.now().toString().slice(-6)}.tar.gz`;
  const cleanSize = fileSize || "24.5 MB Encrypted AES-256";
  const vaultTarget = backupWhere || "AWS S3 Vault (ap-south-1)";
  const vaultPath = vaultTarget.toLowerCase().includes("s3")
    ? `s3://zyllotech-backups/${projectId}/${cleanFileName}`
    : vaultTarget.toLowerCase().includes("github")
    ? `git@github.com:zyllotech-enterprise/${projectId}-vault.git#${cleanFileName}`
    : vaultTarget.toLowerCase().includes("google")
    ? `gs://zyllotech-vault/${projectId}/${cleanFileName}`
    : `vault://${projectId}/archives/${cleanFileName}`;

  const updatedProjects = allProjects.map((p) => {
    if (String(p.id) === String(projectId)) {
      const existingUpdates = p.updates || [];
      const nextSno = existingUpdates.length > 0 ? Math.max(...existingUpdates.map((u) => u.sno || 0)) + 1 : 1;

      const newUpdateEntry = {
        id: Date.now(),
        sno: nextSno,
        updateReq: `Backup archive uploaded: ${cleanFileName} (${cleanSize})`,
        reqRecFrom: uploader,
        dateOfModification: todayIso,
        status: "Completed",
        remarks: notes && notes.trim()
          ? `Vault: ${vaultTarget}. Notes: ${notes.trim()}`
          : `Verified archive synchronized to ${vaultTarget} with checksum integrity validation.`,
      };

      const updatedDetails = {
        ...(p.details || {}),
        backupWhere: vaultTarget,
        backupLocation: vaultPath,
        lastBackupTime: `Just now (${dateStr} ${timeStr} IST - Verified OK)`,
        backupSize: cleanSize,
      };

      return {
        ...p,
        last_update_note: `New backup archive (${cleanFileName}) uploaded to ${vaultTarget}.`,
        last_updated_at: dateStr,
        details: updatedDetails,
        updates: [newUpdateEntry, ...existingUpdates],
      };
    }
    return p;
  });

  saveStoredTrackerProjects(updatedProjects);
  return updatedProjects;
}

/**
 * Downloads a synthesized official sales document (Quotation / PO / SO / Invoice)
 */
export function downloadSalesDocument(doc, type, project) {
  const stamp = new Date().toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${doc.code} - ${type.toUpperCase()}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 40px; color: #1e293b; background: #fff; }
    .header { border-bottom: 3px solid #f96706; padding-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
    .brand { font-size: 26px; font-weight: 800; color: #0f172a; }
    .brand span { color: #f96706; }
    .doc-type { font-size: 20px; font-weight: bold; color: #1f4693; text-transform: uppercase; margin-top: 5px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: bold; text-transform: uppercase; background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0; font-size: 14px; }
    .meta-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; }
    .meta-title { font-size: 11px; font-weight: bold; text-transform: uppercase; color: #64748b; margin-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px; }
    th { background: #f1f5f9; padding: 10px; text-align: left; font-size: 12px; text-transform: uppercase; color: #475569; border-bottom: 2px solid #cbd5e1; }
    td { padding: 12px 10px; border-bottom: 1px solid #e2e8f0; }
    .total-box { margin-left: auto; width: 280px; background: #fff7ed; border: 1px solid #ffedd5; border-radius: 8px; padding: 16px; margin-top: 20px; font-size: 14px; }
    .total-row { display: flex; justify-content: space-between; padding: 4px 0; }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">ZYLLO <span>TECH</span></div>
      <div class="doc-type">${type.toUpperCase()}: ${doc.code}</div>
    </div>
    <div style="text-align: right;">
      <span class="badge">${doc.status || "CONFIRMED"}</span>
      <div style="margin-top: 8px; font-size: 13px; color: #64748b;">Generated: ${stamp}</div>
    </div>
  </div>

  <div class="meta-grid">
    <div class="meta-box">
      <div class="meta-title">Issued By</div>
      <strong>Zyllo Tech Software Solutions Pvt. Ltd.</strong><br>
      Enterprise Technology Pod &amp; Systems Architecture<br>
      Email: billing@zyllotech.com | GSTIN: 37AAECZ2026M1Z8
    </div>
    <div class="meta-box">
      <div class="meta-title">Project &amp; Client Details</div>
      <strong>${project.fullName} (${project.name})</strong><br>
      Client: ${project.client}<br>
      Category: ${project.category}<br>
      Contract Value: ${project.details?.projectValue || "₹0"}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 50px;">#</th>
        <th>Item / Scope Description</th>
        <th>Reference Code</th>
        <th>Status</th>
        <th style="text-align: right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td><strong>${doc.title || doc.code}</strong><br><span style="color: #64748b; font-size: 12px;">Official authorized commercial document under project agreement</span></td>
        <td>${doc.code}</td>
        <td>${doc.status}</td>
        <td style="text-align: right; font-weight: bold; color: #0f172a;">${doc.amount}</td>
      </tr>
    </tbody>
  </table>

  <div class="total-box">
    <div class="total-row"><span>Document Total:</span><strong>${doc.amount}</strong></div>
    <div class="total-row" style="color: #059669;"><span>Verification:</span><strong>Official Document</strong></div>
  </div>

  <div class="footer">
    <p>This is an official commercial record generated from Zyllo Tech Project Tracker &bull; All Rights Reserved.</p>
  </div>
  <script>
    window.onload = function() { window.print(); }
  </script>
</body>
</html>
`;

  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (!win) {
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name}_${doc.code}.html`;
    a.click();
  }
}

/**
 * Exports project update requests to Excel using exceljs
 */
export async function exportProjectUpdatesToExcel(project) {
  try {
    const ExcelJS = (await import("exceljs")).default;
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Zyllo Tech Project Tracker";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet(`${project.name} Updates`);

    sheet.columns = [
      { header: "S.No.", key: "sno", width: 8 },
      { header: "Update Request", key: "updateReq", width: 44 },
      { header: "Request Received From", key: "reqRecFrom", width: 28 },
      { header: "Date of Modification", key: "dateOfModification", width: 20 },
      { header: "Status", key: "status", width: 16 },
      { header: "Remarks", key: "remarks", width: 45 },
    ];

    // Style header row with Zyllo brand orange (#F96706)
    const headerRow = sheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF96706" },
      };
      cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
      cell.alignment = { vertical: "middle", horizontal: "left" };
    });
    headerRow.height = 24;

    const updates = project.updates || [];
    updates.forEach((item, index) => {
      const row = sheet.addRow({
        sno: item.sno || index + 1,
        updateReq: item.updateReq,
        reqRecFrom: item.reqRecFrom,
        dateOfModification: item.dateOfModification,
        status: item.status,
        remarks: item.remarks || "—",
      });
      row.alignment = { vertical: "top", wrapText: true };
    });

    sheet.views = [{ state: "frozen", ySplit: 1 }];

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const stamp = new Date().toISOString().slice(0, 10);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${project.name}-Project-Updates-${stamp}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error("Excel export error:", err);
    throw err;
  }
}

/**
 * Exports project update requests to a printable executive PDF report
 */
export function exportProjectUpdatesToPdf(project) {
  const stamp = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const updates = project.updates || [];

  const rowsHtml = updates
    .map(
      (u, idx) => `
    <tr>
      <td style="text-align: center; font-weight: bold;">${u.sno || idx + 1}</td>
      <td style="font-weight: 600; color: #0f172a;">${escapeHtml(u.updateReq)}</td>
      <td>${escapeHtml(u.reqRecFrom)}</td>
      <td style="white-space: nowrap;">${escapeHtml(u.dateOfModification)}</td>
      <td>
        <span class="status-pill status-${(u.status || "").toLowerCase().replace(/[^a-z0-9]/g, "")}">
          ${escapeHtml(u.status)}
        </span>
      </td>
      <td style="color: #475569; font-size: 12.5px;">${escapeHtml(u.remarks || "—")}</td>
    </tr>
  `
    )
    .join("");

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to view and export the PDF report.");
    return;
  }

  printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(project.name)} - Project Updates Report</title>
  <style>
    @page { size: A4 landscape; margin: 16mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; margin: 0; padding: 20px; font-size: 13px; line-height: 1.5; }
    .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid #f96706; padding-bottom: 14px; margin-bottom: 20px; }
    .brand { font-size: 24px; font-weight: 800; color: #0f172a; text-transform: uppercase; }
    .brand span { color: #f96706; }
    .subhead { font-size: 14px; font-weight: 600; color: #64748b; margin-top: 4px; }
    .project-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 20px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 24px; }
    .card-item strong { display: block; font-size: 11px; text-transform: uppercase; color: #64748b; margin-bottom: 3px; }
    .card-item span { font-size: 14px; font-weight: bold; color: #0f172a; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th { background: #0f172a; color: #ffffff; padding: 10px 12px; font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.5px; text-align: left; }
    td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
    tr:nth-child(even) { background-color: #f8fafc; }
    .status-pill { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .status-completed { background: #dcfce7; color: #166534; }
    .status-inprogress { background: #fef3c7; color: #92400e; }
    .status-testing { background: #e0f2fe; color: #0369a1; }
    .status-pendingapproval { background: #f1f5f9; color: #475569; }
    .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; display: flex; justify-content: space-between; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">ZYLLO <span>TECH</span> &bull; PROJECT TRACKER</div>
      <div class="subhead">${escapeHtml(project.fullName)} (${escapeHtml(project.name)}) &bull; Modification Log</div>
    </div>
    <div style="text-align: right;">
      <div style="font-size: 12px; font-weight: bold; color: #0f172a;">Executive Telemetry Report</div>
      <div style="font-size: 11px; color: #64748b;">Generated: ${stamp}</div>
    </div>
  </div>

  <div class="project-card">
    <div class="card-item">
      <strong>Completion Status</strong>
      <span>${escapeHtml(project.details?.completionStatus || "Active")}</span>
    </div>
    <div class="card-item">
      <strong>Hosting Target</strong>
      <span>${escapeHtml(project.details?.hosted ? "Hosted & Live" : "Staging")}</span>
    </div>
    <div class="card-item">
      <strong>Total Project Value</strong>
      <span>${escapeHtml(project.details?.projectValue || "N/A")}</span>
    </div>
    <div class="card-item">
      <strong>Total Update Requests</strong>
      <span>${updates.length} Updates Logged</span>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 45px; text-align: center;">S.No.</th>
        <th style="width: 30%;">Update Request</th>
        <th style="width: 20%;">Request From</th>
        <th style="width: 14%;">Date of Modification</th>
        <th style="width: 12%;">Status</th>
        <th style="width: 24%;">Remarks</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml || '<tr><td colspan="6" style="text-align: center; padding: 20px;">No updates logged yet.</td></tr>'}
    </tbody>
  </table>

  <div class="footer">
    <span>Zyllo Tech Software Solutions Pvt. Ltd. &bull; Enterprise Engineering</span>
    <span>Confidential &bull; Generated for Client &amp; Admin Audit</span>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 250);
    }
  </script>
</body>
</html>
  `);
  printWindow.document.close();
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
