const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";

const C = {
  navy: "0A2342",
  deepBlue: "065A82",
  teal: "1C7293",
  white: "FFFFFF",
  offWhite: "F0F4F8",
  lightGray: "E2E8F0",
  midGray: "94A3B8",
  darkText: "1E293B",
  accent: "2DD4BF",
  green: "10B981",
  yellow: "F59E0B",
  orange: "F97316",
  red: "EF4444",
  lightBlue: "DBEAFE",
  lightTeal: "CCFBF1",
};

const titleFont = "Cambria";
const bodyFont = "Calibri";

function addDarkSlide() {
  const slide = pres.addSlide();
  slide.background = { fill: C.navy };
  return slide;
}

function addLightSlide(title) {
  const slide = pres.addSlide();
  slide.background = { fill: C.white };
  slide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 10, h: 1.1, fill: { color: C.navy } });
  slide.addText(title, {
    x: 0.6, y: 0.15, w: 8.8, h: 0.8,
    fontSize: 28, fontFace: titleFont, color: C.white, bold: true,
    isTextBox: true, margin: 0,
  });
  return slide;
}

function sn(slide, num) {
  slide.addText(String(num), {
    x: 9.2, y: 5.15, w: 0.5, h: 0.35,
    fontSize: 10, fontFace: bodyFont, color: C.midGray, align: "right",
    isTextBox: true, margin: 0,
  });
}

let slideNum = 0;

// =========== SLIDE 1: Title ===========
{
  slideNum++;
  const s = addDarkSlide();
  s.addShape(pres.ShapeType.rect, { x: 0.6, y: 2.0, w: 1.5, h: 0.06, fill: { color: C.accent } });
  s.addText("Modernizing Digital\nBanking Operations", {
    x: 0.6, y: 1.0, w: 8.8, h: 1.2,
    fontSize: 42, fontFace: titleFont, color: C.white, bold: true,
    isTextBox: true, margin: 0, lineSpacingMultiple: 1.1,
  });
  s.addText("at a Retail Bank", {
    x: 0.6, y: 2.2, w: 8.8, h: 0.6,
    fontSize: 28, fontFace: titleFont, color: C.accent,
    isTextBox: true, margin: 0,
  });
  s.addText("Final Project  |  Systems Analysis & Design", {
    x: 0.6, y: 3.2, w: 8.8, h: 0.4,
    fontSize: 16, fontFace: bodyFont, color: C.midGray,
    isTextBox: true, margin: 0,
  });
  s.addText("ABC Bank  |  Digital Transformation Initiative", {
    x: 0.6, y: 3.7, w: 8.8, h: 0.4,
    fontSize: 14, fontFace: bodyFont, color: C.midGray,
    isTextBox: true, margin: 0,
  });
}

// =========== SLIDE 2: Executive Summary ===========
{
  slideNum++;
  const s = addLightSlide("Executive Summary");
  sn(s, slideNum);

  s.addText("THE PROBLEM", {
    x: 0.6, y: 1.4, w: 4, h: 0.35,
    fontSize: 11, fontFace: bodyFont, color: C.deepBlue, bold: true,
    isTextBox: true, margin: 0,
  });
  s.addText([
    { text: "Legacy systems slow onboarding to 5+ days", options: { bullet: true, breakLine: true, fontSize: 12, fontFace: bodyFont, color: C.darkText } },
    { text: "Manual processes cause errors and delays", options: { bullet: true, breakLine: true, fontSize: 12, fontFace: bodyFont, color: C.darkText } },
    { text: "Poor system integration across channels", options: { bullet: true, fontSize: 12, fontFace: bodyFont, color: C.darkText } },
  ], { x: 0.6, y: 1.75, w: 4.2, h: 1.1, isTextBox: true, margin: 0, paraSpaceAfter: 5 });

  s.addText("KEY INSIGHTS", {
    x: 0.6, y: 2.9, w: 4, h: 0.35,
    fontSize: 11, fontFace: bodyFont, color: C.deepBlue, bold: true,
    isTextBox: true, margin: 0,
  });
  s.addText([
    { text: "Cloud-native microservices approach", options: { bullet: true, breakLine: true, fontSize: 12, fontFace: bodyFont, color: C.darkText } },
    { text: "API-first integration strategy", options: { bullet: true, breakLine: true, fontSize: 12, fontFace: bodyFont, color: C.darkText } },
    { text: "Containerized deployment model", options: { bullet: true, fontSize: 12, fontFace: bodyFont, color: C.darkText } },
  ], { x: 0.6, y: 3.25, w: 4.2, h: 1.1, isTextBox: true, margin: 0, paraSpaceAfter: 5 });

  s.addShape(pres.ShapeType.roundRect, { x: 5.2, y: 1.4, w: 4.2, h: 3.6, fill: { color: C.offWhite }, rectRadius: 0.15 });
  s.addText("RECOMMENDED ACTIONS", {
    x: 5.5, y: 1.55, w: 3.6, h: 0.35,
    fontSize: 11, fontFace: bodyFont, color: C.deepBlue, bold: true,
    isTextBox: true, margin: 0,
  });
  const actions = ["Migrate to IBM Cloud platform", "Implement CI/CD pipelines", "Deploy event-driven architecture", "Modernize database layer", "Establish real-time monitoring"];
  actions.forEach((a, i) => {
    s.addShape(pres.ShapeType.ellipse, { x: 5.5, y: 2.05 + i * 0.55, w: 0.25, h: 0.25, fill: { color: C.teal } });
    s.addText(String(i + 1), { x: 5.5, y: 2.05 + i * 0.55, w: 0.25, h: 0.25, fontSize: 10, fontFace: bodyFont, color: C.white, bold: true, align: "center", valign: "middle", isTextBox: true, margin: 0 });
    s.addText(a, { x: 5.9, y: 2.03 + i * 0.55, w: 3.3, h: 0.3, fontSize: 12, fontFace: bodyFont, color: C.darkText, isTextBox: true, margin: 0 });
  });
}

// =========== SLIDE 3: Introduction (FIX: expand to 5-6 bullets) ===========
{
  slideNum++;
  const s = addLightSlide("Introduction");
  sn(s, slideNum);

  s.addText("THE OPPORTUNITY", {
    x: 0.6, y: 1.4, w: 4, h: 0.3,
    fontSize: 11, fontFace: bodyFont, color: C.deepBlue, bold: true,
    isTextBox: true, margin: 0,
  });
  s.addText([
    { text: "Modernize ABC Bank's customer-facing and back-office systems", options: { bullet: true, breakLine: true, fontSize: 11, fontFace: bodyFont, color: C.darkText } },
    { text: "Replace legacy monolithic architecture with cloud-native services", options: { bullet: true, breakLine: true, fontSize: 11, fontFace: bodyFont, color: C.darkText } },
    { text: "Improve onboarding, transactions, and loan processing workflows", options: { bullet: true, fontSize: 11, fontFace: bodyFont, color: C.darkText } },
  ], { x: 0.6, y: 1.75, w: 4.2, h: 1.0, isTextBox: true, margin: 0, paraSpaceAfter: 4 });

  s.addText("APPROACH", {
    x: 0.6, y: 2.85, w: 4, h: 0.3,
    fontSize: 11, fontFace: bodyFont, color: C.deepBlue, bold: true,
    isTextBox: true, margin: 0,
  });
  s.addText([
    { text: "UML and BPMN process modeling for requirements capture", options: { bullet: true, breakLine: true, fontSize: 11, fontFace: bodyFont, color: C.darkText } },
    { text: "Data flow and architecture analysis for system design", options: { bullet: true, breakLine: true, fontSize: 11, fontFace: bodyFont, color: C.darkText } },
    { text: "Agile methodology with phased delivery across three phases", options: { bullet: true, fontSize: 11, fontFace: bodyFont, color: C.darkText } },
  ], { x: 0.6, y: 3.2, w: 4.2, h: 1.0, isTextBox: true, margin: 0, paraSpaceAfter: 4 });

  s.addShape(pres.ShapeType.roundRect, { x: 5.2, y: 1.4, w: 4.2, h: 3.6, fill: { color: C.lightBlue }, rectRadius: 0.15 });
  s.addText("KEY QUESTIONS AND HYPOTHESES", {
    x: 5.4, y: 1.55, w: 3.8, h: 0.3,
    fontSize: 11, fontFace: bodyFont, color: C.navy, bold: true,
    isTextBox: true, margin: 0,
  });
  s.addText([
    { text: "How to reduce customer onboarding time by 60% through automation?", options: { bullet: true, breakLine: true, fontSize: 11, fontFace: bodyFont, color: C.navy } },
    { text: "How to ensure 99.9% system uptime with cloud-native architecture?", options: { bullet: true, breakLine: true, fontSize: 11, fontFace: bodyFont, color: C.navy } },
    { text: "How to meet PCI-DSS and KYC regulatory compliance while modernizing?", options: { bullet: true, breakLine: true, fontSize: 11, fontFace: bodyFont, color: C.navy } },
    { text: "Can event-driven architecture handle real-time fraud detection at scale?", options: { bullet: true, breakLine: true, fontSize: 11, fontFace: bodyFont, color: C.navy } },
    { text: "Will containerized microservices reduce deployment cycles from monthly to weekly?", options: { bullet: true, breakLine: true, fontSize: 11, fontFace: bodyFont, color: C.navy } },
    { text: "How to manage change resistance and ensure staff adoption of new systems?", options: { bullet: true, fontSize: 11, fontFace: bodyFont, color: C.navy } },
  ], { x: 5.4, y: 1.9, w: 3.8, h: 3.0, isTextBox: true, margin: 0, paraSpaceAfter: 4 });
}

// =========== SLIDE 4: Objectives ===========
{
  slideNum++;
  const s = addLightSlide("Objectives");
  sn(s, slideNum);

  const objectives = [
    { metric: "60%", label: "Reduce onboarding\nfrom 5 to 2 days" },
    { metric: "99.9%", label: "System availability\ntarget uptime" },
    { metric: "80%", label: "Transaction\nautomation rate" },
    { metric: "Real-time", label: "Fraud detection\nimplementation" },
    { metric: "PCI-DSS", label: "Full KYC and\nsecurity compliance" },
    { metric: "40%", label: "Customer satisfaction\nscore improvement" },
  ];

  objectives.forEach((obj, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.6 + col * 3.1;
    const y = 1.4 + row * 2.0;
    s.addShape(pres.ShapeType.roundRect, { x, y, w: 2.8, h: 1.7, fill: { color: C.offWhite }, rectRadius: 0.1 });
    s.addText(obj.metric, { x, y: y + 0.2, w: 2.8, h: 0.6, fontSize: 28, fontFace: titleFont, color: C.deepBlue, bold: true, align: "center", isTextBox: true, margin: 0 });
    s.addText(obj.label, { x, y: y + 0.85, w: 2.8, h: 0.65, fontSize: 12, fontFace: bodyFont, color: C.darkText, align: "center", isTextBox: true, margin: 0, lineSpacingMultiple: 1.1 });
  });
}

// =========== SLIDE 5: Project Charter (FIX: add all required fields) ===========
{
  slideNum++;
  const s = addLightSlide("Project Charter");
  sn(s, slideNum);

  const rows = [
    ["Element", "Details"],
    ["Project Title", "Digital Banking Modernization Initiative"],
    ["Date", "January 15, 2025"],
    ["Project Description", "End-to-end modernization of ABC Bank's core banking operations from legacy monolithic systems to cloud-native microservices"],
    ["Objectives", "Reduce onboarding from 5 to 2 days; achieve 99.9% uptime; automate 80% of transactions; implement real-time fraud detection"],
    ["Success Criteria", "Onboarding < 2 days; uptime >= 99.9%; 80% transaction automation; PCI-DSS audit pass; zero critical security breaches"],
    ["High-Level Requirements", "Cloud migration; microservices architecture; CI/CD pipeline; real-time monitoring; automated KYC; event-driven processing"],
    ["Key Stakeholders/Roles", "CTO (Sponsor); IT Director (Tech Lead); Branch Manager (End User); Compliance Officer (Advisor); CS Lead (End User)"],
    ["Scope", "Core banking, customer onboarding, loan processing, payment transactions, fraud detection"],
    ["Deliverables", "Cloud platform on IBM Cloud; microservices suite; CI/CD pipeline; monitoring dashboard; security framework"],
    ["Assumptions", "Existing infrastructure supports hybrid cloud; staff available for training; regulatory approvals obtained in parallel"],
    ["High-Level Risks", "Legacy migration complexity; data loss during migration; staff resistance; cybersecurity threats; regulatory non-compliance"],
    ["Milestones", "Requirements (Wk 2); Architecture (Wk 4); Infrastructure (Wk 8); Dev complete (Wk 20); UAT (Wk 28); Go-live (Wk 32)"],
    ["Budget", "$2.4M total: Infrastructure $800K; Development $1M; Testing $300K; Training $150K; Contingency $150K"],
  ];

  s.addTable(rows, {
    x: 0.3, y: 1.25, w: 9.4,
    fontSize: 8, fontFace: bodyFont, color: C.darkText,
    border: { type: "solid", pt: 0.5, color: C.lightGray },
    colW: [1.8, 7.6],
    rowH: 0.28,
    autoPage: false,
    rowProps: rows.map((_, i) => ({
      fill: i === 0 ? C.navy : i % 2 === 1 ? C.offWhite : C.white,
      color: i === 0 ? C.white : C.darkText,
      bold: i === 0,
    })),
  });
}

// =========== SLIDE 6: Stakeholder Register (FIX: add location + success criteria) ===========
{
  slideNum++;
  const s = addLightSlide("Stakeholder Register");
  sn(s, slideNum);

  const rows = [
    ["Stakeholder", "Role", "Attitude", "Interest", "Impact", "Influence", "Comm. Pref.", "Location", "Success Criteria", "Hours"],
    ["CTO", "Sponsor", "Supportive", "High", "High", "High", "Weekly brief", "HQ Floor 10", "On-time delivery, budget compliance", "9-5"],
    ["IT Director", "Tech Lead", "Neutral", "High", "High", "High", "Bi-weekly", "HQ Floor 8", "System stability, zero downtime", "9-6"],
    ["Branch Mgr", "End User", "Resistant", "Medium", "Medium", "Medium", "Monthly", "Branch Office", "Workflow efficiency gains", "8-5"],
    ["Compliance", "Advisor", "Supportive", "High", "High", "Medium", "Weekly", "HQ Floor 9", "PCI-DSS pass, KYC automated", "9-5"],
    ["CS Lead", "End User", "Supportive", "Medium", "Medium", "Low", "Training", "Call Center", "Reduced customer complaints", "Shift"],
  ];

  s.addTable(rows, {
    x: 0.15, y: 1.4, w: 9.7,
    fontSize: 8, fontFace: bodyFont, color: C.darkText,
    border: { type: "solid", pt: 0.5, color: C.lightGray },
    colW: [0.85, 0.7, 0.8, 0.65, 0.65, 0.7, 0.85, 0.9, 1.9, 0.55],
    rowH: 0.55,
    autoPage: false,
    rowProps: rows.map((_, i) => ({
      fill: i === 0 ? C.navy : i % 2 === 1 ? C.offWhite : C.white,
      color: i === 0 ? C.white : C.darkText,
      bold: i === 0,
    })),
  });
}

// =========== SLIDE 7: Stakeholder Engagement Plan ===========
{
  slideNum++;
  const s = addLightSlide("Stakeholder Engagement Plan");
  sn(s, slideNum);

  const rows = [
    ["Stakeholder", "Current State", "Desired State", "Strategy"],
    ["CTO", "Leading", "Leading", "Regular progress demos and KPI dashboards"],
    ["IT Director", "Neutral", "Supportive", "Involve in architecture decisions early"],
    ["Branch Manager", "Resistant", "Neutral", "Show workflow efficiency benefits early"],
    ["Compliance Officer", "Supportive", "Leading", "Co-design compliance checks and audits"],
    ["CS Lead", "Supportive", "Supportive", "Provide training and feedback loops"],
  ];

  s.addTable(rows, {
    x: 0.6, y: 1.4, w: 8.8,
    fontSize: 11, fontFace: bodyFont, color: C.darkText,
    border: { type: "solid", pt: 0.5, color: C.lightGray },
    colW: [1.6, 1.4, 1.4, 4.4],
    rowH: 0.55,
    autoPage: false,
    rowProps: rows.map((_, i) => ({
      fill: i === 0 ? C.navy : i % 2 === 1 ? C.offWhite : C.white,
      color: i === 0 ? C.white : C.darkText,
      bold: i === 0,
    })),
  });
}

// =========== SLIDE 8: BRD ===========
{
  slideNum++;
  const s = addLightSlide("Business Requirements Document");
  sn(s, slideNum);

  const rows = [
    ["Section", "Details"],
    ["Scope", "End-to-end digital banking platform covering onboarding, transactions, and loans"],
    ["Objectives", "Modernize onboarding, payments, and loan processing workflows"],
    ["Assumptions", "Existing infrastructure supports hybrid cloud; staff available for training"],
    ["Success Metrics", "Onboarding < 2 days | 99.9% uptime | 80% automation | Zero critical breaches"],
  ];

  s.addTable(rows, {
    x: 0.6, y: 1.4, w: 8.8,
    fontSize: 12, fontFace: bodyFont, color: C.darkText,
    border: { type: "solid", pt: 0.5, color: C.lightGray },
    colW: [2.0, 6.8],
    rowH: 0.6,
    autoPage: false,
    rowProps: rows.map((_, i) => ({
      fill: i === 0 ? C.navy : i % 2 === 1 ? C.offWhite : C.white,
      color: i === 0 ? C.white : C.darkText,
      bold: i === 0,
    })),
  });
}

// =========== SLIDE 9: Use Case Diagram ===========
{
  slideNum++;
  const s = addLightSlide("Use Case Diagram");
  sn(s, slideNum);

  s.addShape(pres.ShapeType.roundRect, {
    x: 2.5, y: 1.3, w: 5.0, h: 3.7,
    fill: { color: C.offWhite },
    line: { color: C.deepBlue, width: 2, dashType: "dash" },
    rectRadius: 0.15,
  });
  s.addText("ABC Bank Digital Platform", {
    x: 2.6, y: 1.35, w: 4.8, h: 0.35,
    fontSize: 12, fontFace: bodyFont, color: C.deepBlue, bold: true, italic: true,
    isTextBox: true, margin: 0,
  });

  const useCases = [
    { label: "Customer\nOnboarding", x: 3.2, y: 1.85 },
    { label: "Account\nLogin", x: 5.5, y: 1.85 },
    { label: "Transaction\nProcessing", x: 3.2, y: 2.9 },
    { label: "Loan\nApplication", x: 5.5, y: 2.9 },
    { label: "View Transaction\nHistory", x: 4.35, y: 3.85 },
  ];
  useCases.forEach((uc) => {
    s.addShape(pres.ShapeType.ellipse, { x: uc.x, y: uc.y, w: 1.8, h: 0.8, fill: { color: C.white }, line: { color: C.teal, width: 1.5 } });
    s.addText(uc.label, { x: uc.x, y: uc.y + 0.05, w: 1.8, h: 0.7, fontSize: 9, fontFace: bodyFont, color: C.darkText, align: "center", valign: "middle", isTextBox: true, margin: 0, lineSpacingMultiple: 0.95 });
  });

  [{ label: "Customer", y: 2.0 }, { label: "Bank Staff", y: 3.3 }].forEach((a) => {
    s.addText("\u{1F464}", { x: 0.7, y: a.y, w: 0.5, h: 0.4, fontSize: 20, align: "center", isTextBox: true, margin: 0 });
    s.addText(a.label, { x: 0.4, y: a.y + 0.4, w: 1.1, h: 0.3, fontSize: 10, fontFace: bodyFont, color: C.darkText, align: "center", isTextBox: true, margin: 0 });
  });

  [{ label: "Credit Bureau", y: 1.85 }, { label: "Payment GW", y: 2.7 }, { label: "Auth Service", y: 3.55 }].forEach((a) => {
    s.addText("⚙️", { x: 8.3, y: a.y, w: 0.5, h: 0.4, fontSize: 18, align: "center", isTextBox: true, margin: 0 });
    s.addText(a.label, { x: 7.9, y: a.y + 0.4, w: 1.3, h: 0.3, fontSize: 10, fontFace: bodyFont, color: C.darkText, align: "center", isTextBox: true, margin: 0 });
  });

  s.addText("Relationships: <<include>> Authentication | <<include>> Credit Check | <<extend>> Fraud Alert", {
    x: 0.6, y: 5.1, w: 8.8, h: 0.25,
    fontSize: 8, fontFace: bodyFont, color: C.midGray, italic: true,
    align: "center", isTextBox: true, margin: 0,
  });
}

// =========== SLIDE 10: RTM (FIX: add business objective + linked req columns) ===========
{
  slideNum++;
  const s = addLightSlide("Requirements Traceability Matrix");
  sn(s, slideNum);

  const rows = [
    ["Req ID", "Type", "Description", "Source", "Biz Objective", "Acceptance Criteria", "Linked Req", "Owner", "Priority", "Status", "Verification", "Risk"],
    ["REQ-001", "Func", "Online account opening", "CTO", "Reduce onboarding 60%", "Complete < 10 min", "REQ-003, REQ-004", "IT Dir.", "High", "In Progress", "UAT", "R-003"],
    ["REQ-002", "Func", "Real-time transactions", "Br. Mgr", "80% automation", "Process < 2 sec", "REQ-003", "Dev Lead", "High", "In Progress", "Perf Test", "R-001"],
    ["REQ-003", "NFR", "99.9% system uptime", "CTO", "System availability", "< 8.7 hrs down/yr", "REQ-001, REQ-002", "IT Dir.", "Critical", "Planned", "Monitoring", "R-002"],
    ["REQ-004", "Func", "Automated KYC", "Comp.", "PCI-DSS compliance", "Verify < 5 min", "REQ-001, REQ-005", "Comp Lead", "High", "In Progress", "Int. Test", "R-004"],
    ["REQ-005", "NFR", "PCI-DSS compliance", "Comp.", "Security compliance", "Pass annual audit", "REQ-004", "Sec Lead", "Critical", "In Progress", "Sec Audit", "R-005"],
  ];

  s.addTable(rows, {
    x: 0.1, y: 1.4, w: 9.8,
    fontSize: 7.5, fontFace: bodyFont, color: C.darkText,
    border: { type: "solid", pt: 0.5, color: C.lightGray },
    colW: [0.6, 0.4, 1.1, 0.5, 1.1, 0.9, 1.0, 0.6, 0.55, 0.7, 0.7, 0.5],
    rowH: 0.55,
    autoPage: false,
    rowProps: rows.map((_, i) => ({
      fill: i === 0 ? C.navy : i % 2 === 1 ? C.offWhite : C.white,
      color: i === 0 ? C.white : C.darkText,
      bold: i === 0,
    })),
  });
}

// =========== SLIDE 11: WBS ===========
{
  slideNum++;
  const s = addLightSlide("Work Breakdown Structure");
  sn(s, slideNum);

  s.addShape(pres.ShapeType.roundRect, { x: 2.8, y: 1.35, w: 4.4, h: 0.55, fill: { color: C.navy }, rectRadius: 0.1 });
  s.addText("1.0 Digital Banking Modernization", { x: 2.8, y: 1.35, w: 4.4, h: 0.55, fontSize: 12, fontFace: bodyFont, color: C.white, bold: true, align: "center", valign: "middle", isTextBox: true, margin: 0 });

  const phases = [
    { title: "1.1 Planning", color: C.deepBlue, tasks: ["1.1.1 Requirements\ngathering", "1.1.2 Stakeholder\nanalysis", "1.1.3 Risk\nassessment", "1.1.4 Architecture\ndesign"], x: 0.3 },
    { title: "1.2 Execution", color: C.teal, tasks: ["1.2.1 Infrastructure\nsetup", "1.2.2 Microservices\ndevelopment", "1.2.3 Data\nmigration", "1.2.4 Integration\ntesting"], x: 3.5 },
    { title: "1.3 Closure", color: C.green, tasks: ["1.3.1 UAT", "1.3.2 Deployment", "1.3.3 Training", "1.3.4 Post-launch\nreview"], x: 6.7 },
  ];

  phases.forEach((p) => {
    s.addShape(pres.ShapeType.roundRect, { x: p.x, y: 2.3, w: 2.8, h: 0.5, fill: { color: p.color }, rectRadius: 0.08 });
    s.addText(p.title, { x: p.x, y: 2.3, w: 2.8, h: 0.5, fontSize: 11, fontFace: bodyFont, color: C.white, bold: true, align: "center", valign: "middle", isTextBox: true, margin: 0 });
    p.tasks.forEach((t, i) => {
      const tx = p.x + i * 0.72;
      s.addShape(pres.ShapeType.roundRect, { x: tx, y: 3.15, w: 0.65, h: 1.6, fill: { color: C.offWhite }, rectRadius: 0.06, line: { color: C.lightGray, width: 0.5 } });
      s.addText(t, { x: tx, y: 3.2, w: 0.65, h: 1.5, fontSize: 7, fontFace: bodyFont, color: C.darkText, align: "center", valign: "top", isTextBox: true, margin: [2, 2, 2, 2], lineSpacingMultiple: 1.0 });
    });
  });
}

// =========== SLIDE 12: Network Diagram (FIX: include all WBS activities) ===========
{
  slideNum++;
  const s = addLightSlide("Network Diagram");
  sn(s, slideNum);

  const allTasks = [
    { label: "Requirements\nGathering\n2 wks", x: 0.15, color: C.deepBlue },
    { label: "Stakeholder\nAnalysis\n1 wk", x: 1.15, color: C.deepBlue },
    { label: "Risk\nAssessment\n1 wk", x: 2.15, color: C.deepBlue },
    { label: "Architecture\nDesign\n2 wks", x: 3.15, color: C.deepBlue },
    { label: "Infrastructure\nSetup\n4 wks", x: 4.15, color: C.teal },
    { label: "Microservices\nDev\n12 wks", x: 5.15, color: C.teal },
    { label: "Data\nMigration\n4 wks", x: 6.15, color: C.teal },
    { label: "Integration\nTest\n4 wks", x: 7.15, color: C.teal },
    { label: "UAT\n2 wks", x: 8.15, color: C.green },
    { label: "Deployment\n2 wks", x: 0.15, color: C.green, row: 1 },
    { label: "Training\n2 wks", x: 1.15, color: C.green, row: 1 },
    { label: "Post-launch\nReview\n1 wk", x: 2.15, color: C.green, row: 1 },
  ];

  // Row 0 connection line
  s.addShape(pres.ShapeType.line, { x: 0.55, y: 2.55, w: 8.1, h: 0, line: { color: C.midGray, width: 1.5, dashType: "dash" } });
  // Row 1 connection line
  s.addShape(pres.ShapeType.line, { x: 0.55, y: 4.1, w: 2.55, h: 0, line: { color: C.midGray, width: 1.5, dashType: "dash" } });
  // Vertical connector between rows
  s.addShape(pres.ShapeType.line, { x: 8.65, y: 3.0, w: 0, h: 0.55, line: { color: C.midGray, width: 1.5, dashType: "dash" } });
  s.addShape(pres.ShapeType.line, { x: 8.65, y: 3.55, w: -8.1, h: 0, line: { color: C.midGray, width: 1.5, dashType: "dash" } });

  allTasks.forEach((t) => {
    const yBase = t.row === 1 ? 3.55 : 1.95;
    s.addShape(pres.ShapeType.roundRect, { x: t.x, y: yBase, w: 0.9, h: 1.15, fill: { color: t.color }, rectRadius: 0.06 });
    s.addText(t.label, { x: t.x, y: yBase, w: 0.9, h: 1.15, fontSize: 7, fontFace: bodyFont, color: C.white, bold: true, align: "center", valign: "middle", isTextBox: true, margin: 0, lineSpacingMultiple: 1.0 });
  });

  s.addText("Critical Path: Requirements → Stakeholder Analysis → Risk Assessment → Architecture → Infrastructure → Microservices → Data Migration → Integration Test → UAT → Deployment → Training → Post-launch Review", {
    x: 0.3, y: 4.85, w: 9.4, h: 0.35,
    fontSize: 8, fontFace: bodyFont, color: C.red, italic: true,
    isTextBox: true, margin: 0,
  });
  s.addText("Total Duration: ~36 weeks  |  Planning: 6 wks  |  Execution: 24 wks  |  Closure: 7 wks", {
    x: 0.3, y: 5.15, w: 9.4, h: 0.25,
    fontSize: 9, fontFace: bodyFont, color: C.darkText,
    isTextBox: true, margin: 0,
  });
}

// =========== SLIDE 13: SWOT Analysis (FIX: ensure clearly extractable) ===========
{
  slideNum++;
  const s = addLightSlide("SWOT Analysis");
  sn(s, slideNum);

  const quads = [
    { title: "STRENGTHS", color: C.green, fill: C.lightTeal, x: 0.6, y: 1.4, items: ["Strong executive sponsorship from CTO", "Existing large customer base of 2M users", "Skilled IT team with Java and cloud experience", "Clear regulatory framework and compliance history"] },
    { title: "WEAKNESSES", color: C.orange, fill: "FFF7ED", x: 5.2, y: 1.4, items: ["Heavy legacy system dependencies and technical debt", "Limited cloud-native and Kubernetes expertise", "Change resistance from branch operations staff", "Fragmented data across siloed legacy databases"] },
    { title: "OPPORTUNITIES", color: C.deepBlue, fill: C.lightBlue, x: 0.6, y: 3.45, items: ["Cloud-native scalability for peak transaction loads", "AI-driven fraud detection and risk scoring", "Open banking APIs for third-party integration", "Market differentiation through digital-first experience"] },
    { title: "THREATS", color: C.red, fill: "FEF2F2", x: 5.2, y: 3.45, items: ["Cybersecurity risks during migration window", "Regulatory changes mid-implementation", "Competitor banks launching digital platforms first", "Data migration failures causing service outages"] },
  ];

  quads.forEach((q) => {
    s.addShape(pres.ShapeType.roundRect, { x: q.x, y: q.y, w: 4.2, h: 1.85, fill: { color: q.fill }, rectRadius: 0.1 });
    s.addText(q.title, { x: q.x + 0.2, y: q.y + 0.1, w: 3.8, h: 0.35, fontSize: 12, fontFace: bodyFont, color: q.color, bold: true, isTextBox: true, margin: 0 });
    s.addText(q.items.map((item, i) => ({
      text: item,
      options: { bullet: true, fontSize: 10, fontFace: bodyFont, color: C.darkText, breakLine: i < q.items.length - 1 },
    })), { x: q.x + 0.2, y: q.y + 0.45, w: 3.8, h: 1.3, isTextBox: true, margin: 0, paraSpaceAfter: 3 });
  });
}

// =========== SLIDE 14: Risk Register (FIX: add trigger column, expand entries) ===========
{
  slideNum++;
  const s = addLightSlide("Risk Register");
  sn(s, slideNum);

  const rows = [
    ["ID", "Cause", "Event", "Impact", "Owner", "Cat.", "Prob", "Impact", "Rating", "Score", "Trigger", "Response"],
    ["R-001", "Legacy system complexity", "Migration failure during cutover", "Service downtime", "IT Dir.", "Tech", "High", "High", "Critical", "9", "Failed test migration", "Rollback plan"],
    ["R-002", "Single point of failure", "Production system outage", "Revenue loss", "IT Dir.", "Tech", "Med", "High", "High", "6", "Server health alerts", "Auto-failover"],
    ["R-003", "Manual onboarding process", "Customer onboarding delayed", "Customer churn", "Br. Mgr", "Ops", "Med", "Med", "Med", "4", "SLA breach on onboarding", "Process automation"],
    ["R-004", "Regulatory gaps in new system", "Compliance audit failure", "Financial penalties", "Comp.", "Comp", "Low", "High", "Med", "3", "Pre-audit findings", "Compliance review"],
    ["R-005", "External cyber threats", "Data breach incident", "Reputation damage", "Sec Lead", "Sec", "Med", "High", "High", "6", "Intrusion detection alert", "Incident response"],
  ];

  s.addTable(rows, {
    x: 0.1, y: 1.35, w: 9.8,
    fontSize: 7, fontFace: bodyFont, color: C.darkText,
    border: { type: "solid", pt: 0.5, color: C.lightGray },
    colW: [0.4, 1.1, 1.2, 0.8, 0.55, 0.4, 0.4, 0.5, 0.55, 0.4, 1.1, 0.85],
    rowH: 0.6,
    autoPage: false,
    rowProps: rows.map((_, i) => ({
      fill: i === 0 ? C.navy : i % 2 === 1 ? C.offWhite : C.white,
      color: i === 0 ? C.white : C.darkText,
      bold: i === 0,
    })),
  });
}

// =========== SLIDE 15: Risk Matrix - Threat Matrix ===========
{
  slideNum++;
  const s = addLightSlide("Risk Matrix: Threat and Opportunity");
  sn(s, slideNum);

  // Threat Matrix
  s.addText("THREAT MATRIX", { x: 0.3, y: 1.3, w: 2, h: 0.3, fontSize: 10, fontFace: bodyFont, color: C.red, bold: true, isTextBox: true, margin: 0 });

  const labels = ["VL", "Low", "Med", "High", "VH"];
  const gridColors = [
    [C.green, C.green, C.green, "B8D4A0", "B8D4A0"],
    [C.green, "B8D4A0", C.yellow, C.yellow, C.orange],
    ["B8D4A0", C.yellow, C.yellow, C.orange, C.orange],
    ["B8D4A0", C.yellow, C.orange, C.orange, C.red],
    [C.yellow, C.orange, C.orange, C.red, C.red],
  ];
  const startX = 1.2, startY = 1.6, cellW = 0.7, cellH = 0.52;

  s.addText("Prob →", { x: 0.1, y: 2.6, w: 1.0, h: 0.3, fontSize: 8, fontFace: bodyFont, color: C.darkText, bold: true, isTextBox: true, margin: 0, rotate: 270 });

  for (let row = 0; row < 5; row++) {
    s.addText(labels[4 - row], { x: 0.6, y: startY + row * cellH, w: 0.5, h: cellH, fontSize: 7, fontFace: bodyFont, color: C.darkText, align: "right", valign: "middle", isTextBox: true, margin: 0 });
    for (let col = 0; col < 5; col++) {
      s.addShape(pres.ShapeType.rect, { x: startX + col * cellW, y: startY + row * cellH, w: cellW, h: cellH, fill: { color: gridColors[4 - row][col] }, line: { color: C.white, width: 1.5 } });
    }
  }
  labels.forEach((l, i) => {
    s.addText(l, { x: startX + i * cellW, y: startY + 5 * cellH, w: cellW, h: 0.25, fontSize: 7, fontFace: bodyFont, color: C.darkText, align: "center", isTextBox: true, margin: 0 });
  });
  s.addText("Impact →", { x: 2.0, y: startY + 5 * cellH + 0.2, w: 1.5, h: 0.2, fontSize: 8, fontFace: bodyFont, color: C.darkText, bold: true, align: "center", isTextBox: true, margin: 0 });

  // Plot threats
  const threats = [
    { id: "R-001", col: 3, row: 3 }, { id: "R-002", col: 3, row: 2 },
    { id: "R-003", col: 2, row: 2 }, { id: "R-004", col: 3, row: 1 },
    { id: "R-005", col: 3, row: 2 },
  ];
  threats.forEach((r) => {
    const rx = startX + r.col * cellW + (r.id === "R-005" ? 0.35 : 0.15);
    const ry = startY + (4 - r.row) * cellH + 0.08;
    s.addShape(pres.ShapeType.ellipse, { x: rx, y: ry, w: 0.35, h: 0.35, fill: { color: C.navy }, line: { color: C.white, width: 1.5 } });
    s.addText(r.id, { x: rx, y: ry, w: 0.35, h: 0.35, fontSize: 6, fontFace: bodyFont, color: C.white, bold: true, align: "center", valign: "middle", isTextBox: true, margin: 0 });
  });

  // Opportunity Matrix
  s.addText("OPPORTUNITY MATRIX", { x: 5.3, y: 1.3, w: 3, h: 0.3, fontSize: 10, fontFace: bodyFont, color: C.green, bold: true, isTextBox: true, margin: 0 });

  const oppColors = [
    ["B8D4A0", "B8D4A0", C.green, C.green, C.green],
    [C.yellow, "B8D4A0", "B8D4A0", C.green, C.green],
    [C.yellow, C.yellow, "B8D4A0", "B8D4A0", C.green],
    [C.orange, C.yellow, C.yellow, "B8D4A0", "B8D4A0"],
    [C.orange, C.orange, C.yellow, C.yellow, "B8D4A0"],
  ];
  const ox = 6.2;

  s.addText("Prob →", { x: 5.1, y: 2.6, w: 1.0, h: 0.3, fontSize: 8, fontFace: bodyFont, color: C.darkText, bold: true, isTextBox: true, margin: 0, rotate: 270 });

  for (let row = 0; row < 5; row++) {
    s.addText(labels[4 - row], { x: 5.6, y: startY + row * cellH, w: 0.5, h: cellH, fontSize: 7, fontFace: bodyFont, color: C.darkText, align: "right", valign: "middle", isTextBox: true, margin: 0 });
    for (let col = 0; col < 5; col++) {
      s.addShape(pres.ShapeType.rect, { x: ox + col * cellW, y: startY + row * cellH, w: cellW, h: cellH, fill: { color: oppColors[4 - row][col] }, line: { color: C.white, width: 1.5 } });
    }
  }
  labels.forEach((l, i) => {
    s.addText(l, { x: ox + i * cellW, y: startY + 5 * cellH, w: cellW, h: 0.25, fontSize: 7, fontFace: bodyFont, color: C.darkText, align: "center", isTextBox: true, margin: 0 });
  });
  s.addText("Impact →", { x: 7.0, y: startY + 5 * cellH + 0.2, w: 1.5, h: 0.2, fontSize: 8, fontFace: bodyFont, color: C.darkText, bold: true, align: "center", isTextBox: true, margin: 0 });

  // Plot opportunities
  const opps = [
    { id: "O-001", label: "Cloud\nscale", col: 4, row: 3 },
    { id: "O-002", label: "AI fraud", col: 3, row: 2 },
    { id: "O-003", label: "Open\nAPIs", col: 3, row: 3 },
  ];
  opps.forEach((o) => {
    const orx = ox + o.col * cellW + 0.15;
    const ory = startY + (4 - o.row) * cellH + 0.08;
    s.addShape(pres.ShapeType.ellipse, { x: orx, y: ory, w: 0.35, h: 0.35, fill: { color: C.deepBlue }, line: { color: C.white, width: 1.5 } });
    s.addText(o.id, { x: orx, y: ory, w: 0.35, h: 0.35, fontSize: 6, fontFace: bodyFont, color: C.white, bold: true, align: "center", valign: "middle", isTextBox: true, margin: 0 });
  });

  // Legend
  s.addText("Threats: R-001 Migration failure | R-002 System outage | R-003 Onboarding delay | R-004 Compliance failure | R-005 Data breach", {
    x: 0.3, y: 4.65, w: 9.4, h: 0.25, fontSize: 7, fontFace: bodyFont, color: C.darkText, isTextBox: true, margin: 0,
  });
  s.addText("Opportunities: O-001 Cloud-native scalability | O-002 AI-driven fraud detection | O-003 Open banking APIs", {
    x: 0.3, y: 4.9, w: 9.4, h: 0.25, fontSize: 7, fontFace: bodyFont, color: C.darkText, isTextBox: true, margin: 0,
  });
}

// =========== SLIDE 16: Process Model (FIX: Core Banking Process covering multiple flows) ===========
{
  slideNum++;
  const s = addLightSlide("Core Banking Process Flowchart");
  sn(s, slideNum);

  // Customer Onboarding row
  s.addText("CUSTOMER ONBOARDING", { x: 0.3, y: 1.25, w: 2.5, h: 0.25, fontSize: 8, fontFace: bodyFont, color: C.deepBlue, bold: true, isTextBox: true, margin: 0 });
  const onbSteps = [
    { label: "Start", shape: "ellipse", x: 0.3, y: 1.55, w: 0.7, h: 0.4, fill: C.green },
    { label: "Submit\nApplication", shape: "rect", x: 1.15, y: 1.5, w: 1.0, h: 0.55, fill: C.teal },
    { label: "Validate\nIdentity", shape: "rect", x: 2.3, y: 1.5, w: 1.0, h: 0.55, fill: C.teal },
    { label: "KYC\nCheck", shape: "diamond", x: 3.45, y: 1.4, w: 0.8, h: 0.75, fill: C.yellow },
    { label: "Create\nAccount", shape: "rect", x: 4.5, y: 1.5, w: 1.0, h: 0.55, fill: C.teal },
    { label: "Notify", shape: "rect", x: 5.65, y: 1.5, w: 0.8, h: 0.55, fill: C.teal },
    { label: "End", shape: "ellipse", x: 6.6, y: 1.55, w: 0.6, h: 0.4, fill: C.red },
  ];
  onbSteps.forEach((st) => {
    const shapeType = st.shape === "ellipse" ? pres.ShapeType.ellipse : st.shape === "diamond" ? pres.ShapeType.diamond : pres.ShapeType.roundRect;
    s.addShape(shapeType, { x: st.x, y: st.y, w: st.w, h: st.h, fill: { color: st.fill }, rectRadius: st.shape === "rect" ? 0.06 : undefined });
    s.addText(st.label, { x: st.x, y: st.y, w: st.w, h: st.h, fontSize: 7, fontFace: bodyFont, color: st.fill === C.yellow ? C.darkText : C.white, bold: true, align: "center", valign: "middle", isTextBox: true, margin: 0, lineSpacingMultiple: 0.9 });
  });

  // Transaction Processing row
  s.addText("TRANSACTION PROCESSING", { x: 0.3, y: 2.25, w: 2.5, h: 0.25, fontSize: 8, fontFace: bodyFont, color: C.deepBlue, bold: true, isTextBox: true, margin: 0 });
  const txSteps = [
    { label: "Start", shape: "ellipse", x: 0.3, y: 2.55, w: 0.7, h: 0.4, fill: C.green },
    { label: "Initiate\nPayment", shape: "rect", x: 1.15, y: 2.5, w: 1.0, h: 0.55, fill: C.deepBlue },
    { label: "Auth\nCheck", shape: "rect", x: 2.3, y: 2.5, w: 1.0, h: 0.55, fill: C.deepBlue },
    { label: "Fraud\nScan", shape: "diamond", x: 3.45, y: 2.4, w: 0.8, h: 0.75, fill: C.yellow },
    { label: "Process\nPayment", shape: "rect", x: 4.5, y: 2.5, w: 1.0, h: 0.55, fill: C.deepBlue },
    { label: "Update\nLedger", shape: "rect", x: 5.65, y: 2.5, w: 0.8, h: 0.55, fill: C.deepBlue },
    { label: "End", shape: "ellipse", x: 6.6, y: 2.55, w: 0.6, h: 0.4, fill: C.red },
  ];
  txSteps.forEach((st) => {
    const shapeType = st.shape === "ellipse" ? pres.ShapeType.ellipse : st.shape === "diamond" ? pres.ShapeType.diamond : pres.ShapeType.roundRect;
    s.addShape(shapeType, { x: st.x, y: st.y, w: st.w, h: st.h, fill: { color: st.fill }, rectRadius: st.shape === "rect" ? 0.06 : undefined });
    s.addText(st.label, { x: st.x, y: st.y, w: st.w, h: st.h, fontSize: 7, fontFace: bodyFont, color: st.fill === C.yellow ? C.darkText : C.white, bold: true, align: "center", valign: "middle", isTextBox: true, margin: 0, lineSpacingMultiple: 0.9 });
  });

  // Loan Application row
  s.addText("LOAN APPLICATION", { x: 0.3, y: 3.25, w: 2.5, h: 0.25, fontSize: 8, fontFace: bodyFont, color: C.deepBlue, bold: true, isTextBox: true, margin: 0 });
  const loanSteps = [
    { label: "Start", shape: "ellipse", x: 0.3, y: 3.55, w: 0.7, h: 0.4, fill: C.green },
    { label: "Submit\nLoan App", shape: "rect", x: 1.15, y: 3.5, w: 1.0, h: 0.55, fill: C.navy },
    { label: "Credit\nCheck", shape: "rect", x: 2.3, y: 3.5, w: 1.0, h: 0.55, fill: C.navy },
    { label: "Risk\nScore", shape: "diamond", x: 3.45, y: 3.4, w: 0.8, h: 0.75, fill: C.yellow },
    { label: "Approve\nLoan", shape: "rect", x: 4.5, y: 3.5, w: 1.0, h: 0.55, fill: C.navy },
    { label: "Disburse\nFunds", shape: "rect", x: 5.65, y: 3.5, w: 0.8, h: 0.55, fill: C.navy },
    { label: "End", shape: "ellipse", x: 6.6, y: 3.55, w: 0.6, h: 0.4, fill: C.red },
  ];
  loanSteps.forEach((st) => {
    const shapeType = st.shape === "ellipse" ? pres.ShapeType.ellipse : st.shape === "diamond" ? pres.ShapeType.diamond : pres.ShapeType.roundRect;
    s.addShape(shapeType, { x: st.x, y: st.y, w: st.w, h: st.h, fill: { color: st.fill }, rectRadius: st.shape === "rect" ? 0.06 : undefined });
    s.addText(st.label, { x: st.x, y: st.y, w: st.w, h: st.h, fontSize: 7, fontFace: bodyFont, color: st.fill === C.yellow ? C.darkText : C.white, bold: true, align: "center", valign: "middle", isTextBox: true, margin: 0, lineSpacingMultiple: 0.9 });
  });

  // Legend
  s.addShape(pres.ShapeType.roundRect, { x: 7.5, y: 1.4, w: 2.2, h: 3.0, fill: { color: C.offWhite }, rectRadius: 0.1 });
  s.addText("LEGEND", { x: 7.6, y: 1.45, w: 2.0, h: 0.25, fontSize: 9, fontFace: bodyFont, color: C.navy, bold: true, isTextBox: true, margin: 0 });
  s.addShape(pres.ShapeType.ellipse, { x: 7.7, y: 1.8, w: 0.3, h: 0.2, fill: { color: C.green } });
  s.addText("Start/End", { x: 8.1, y: 1.8, w: 1.4, h: 0.2, fontSize: 8, fontFace: bodyFont, color: C.darkText, isTextBox: true, margin: 0 });
  s.addShape(pres.ShapeType.roundRect, { x: 7.7, y: 2.1, w: 0.3, h: 0.2, fill: { color: C.teal }, rectRadius: 0.04 });
  s.addText("Process Step", { x: 8.1, y: 2.1, w: 1.4, h: 0.2, fontSize: 8, fontFace: bodyFont, color: C.darkText, isTextBox: true, margin: 0 });
  s.addShape(pres.ShapeType.diamond, { x: 7.7, y: 2.4, w: 0.3, h: 0.25, fill: { color: C.yellow } });
  s.addText("Decision", { x: 8.1, y: 2.4, w: 1.4, h: 0.25, fontSize: 8, fontFace: bodyFont, color: C.darkText, isTextBox: true, margin: 0 });

  s.addText("Key Components: Application Portal | Identity Verification | KYC Engine | Payment Gateway | Credit Bureau | Account Management | Notification Service | Loan Processor | Fraud Detection Engine", {
    x: 0.3, y: 4.55, w: 9.4, h: 0.6,
    fontSize: 7, fontFace: bodyFont, color: C.midGray, italic: true,
    align: "center", isTextBox: true, margin: 0,
  });
}

// =========== SLIDE 17: System Design - DFD Level 0 ===========
{
  slideNum++;
  const s = addLightSlide("System Design: Data Flow Diagram (Level 0)");
  sn(s, slideNum);

  const entities = [{ label: "Customer", y: 1.5 }, { label: "Credit Bureau", y: 3.0 }, { label: "Payment Gateway", y: 4.3 }];
  entities.forEach((e) => {
    s.addShape(pres.ShapeType.rect, { x: 0.4, y: e.y, w: 1.5, h: 0.6, fill: { color: C.deepBlue } });
    s.addText(e.label, { x: 0.4, y: e.y, w: 1.5, h: 0.6, fontSize: 10, fontFace: bodyFont, color: C.white, bold: true, align: "center", valign: "middle", isTextBox: true, margin: 0 });
  });

  const processes = [{ label: "Onboarding\nSystem", y: 1.5 }, { label: "Transaction\nEngine", y: 3.0 }, { label: "Loan\nProcessor", y: 4.3 }];
  processes.forEach((p) => {
    s.addShape(pres.ShapeType.ellipse, { x: 3.6, y: p.y, w: 2.0, h: 0.8, fill: { color: C.teal } });
    s.addText(p.label, { x: 3.6, y: p.y, w: 2.0, h: 0.8, fontSize: 10, fontFace: bodyFont, color: C.white, bold: true, align: "center", valign: "middle", isTextBox: true, margin: 0, lineSpacingMultiple: 0.95 });
  });

  const stores = [{ label: "Customer DB", y: 1.5 }, { label: "Transaction DB", y: 3.0 }, { label: "Loan DB", y: 4.3 }];
  stores.forEach((ds) => {
    s.addShape(pres.ShapeType.rect, { x: 7.5, y: ds.y, w: 1.8, h: 0.6, fill: { color: C.offWhite }, line: { color: C.deepBlue, width: 1 } });
    s.addShape(pres.ShapeType.line, { x: 7.5, y: ds.y, w: 1.8, h: 0, line: { color: C.deepBlue, width: 2 } });
    s.addText(ds.label, { x: 7.5, y: ds.y, w: 1.8, h: 0.6, fontSize: 10, fontFace: bodyFont, color: C.darkText, bold: true, align: "center", valign: "middle", isTextBox: true, margin: 0 });
  });

  [1.75, 3.25, 4.55].forEach((y) => {
    s.addShape(pres.ShapeType.line, { x: 1.95, y, w: 1.6, h: 0, line: { color: C.midGray, width: 1.5 } });
    s.addShape(pres.ShapeType.line, { x: 5.65, y, w: 1.8, h: 0, line: { color: C.midGray, width: 1.5 } });
  });
}

// =========== SLIDE 18: DFD Level 1 (NEW - FIX) ===========
{
  slideNum++;
  const s = addLightSlide("Data Flow Diagram (Level 1: Onboarding)");
  sn(s, slideNum);

  const l1procs = [
    { id: "1.1", label: "Receive\nApplication", x: 0.5, y: 1.8, w: 1.5, h: 0.7 },
    { id: "1.2", label: "Validate\nIdentity", x: 2.5, y: 1.8, w: 1.5, h: 0.7 },
    { id: "1.3", label: "Perform\nKYC Check", x: 4.5, y: 1.8, w: 1.5, h: 0.7 },
    { id: "1.4", label: "Create\nAccount", x: 6.5, y: 1.8, w: 1.5, h: 0.7 },
    { id: "1.5", label: "Send\nNotification", x: 8.0, y: 1.8, w: 1.5, h: 0.7 },
  ];
  l1procs.forEach((p) => {
    s.addShape(pres.ShapeType.ellipse, { x: p.x, y: p.y, w: p.w, h: p.h, fill: { color: C.teal } });
    s.addText(p.id + "\n" + p.label, { x: p.x, y: p.y, w: p.w, h: p.h, fontSize: 8, fontFace: bodyFont, color: C.white, bold: true, align: "center", valign: "middle", isTextBox: true, margin: 0, lineSpacingMultiple: 0.9 });
  });

  // External entities
  s.addShape(pres.ShapeType.rect, { x: 0.5, y: 1.2, w: 1.2, h: 0.4, fill: { color: C.deepBlue } });
  s.addText("Customer", { x: 0.5, y: 1.2, w: 1.2, h: 0.4, fontSize: 9, fontFace: bodyFont, color: C.white, bold: true, align: "center", valign: "middle", isTextBox: true, margin: 0 });

  s.addShape(pres.ShapeType.rect, { x: 4.5, y: 1.1, w: 1.2, h: 0.4, fill: { color: C.deepBlue } });
  s.addText("Credit Bureau", { x: 4.5, y: 1.1, w: 1.2, h: 0.4, fontSize: 8, fontFace: bodyFont, color: C.white, bold: true, align: "center", valign: "middle", isTextBox: true, margin: 0 });

  // Data stores
  const l1stores = [
    { label: "D1 Application DB", x: 0.5, y: 3.0 },
    { label: "D2 Identity DB", x: 2.5, y: 3.0 },
    { label: "D3 KYC Records", x: 4.5, y: 3.0 },
    { label: "D4 Customer DB", x: 6.5, y: 3.0 },
    { label: "D5 Notification Log", x: 8.0, y: 3.0 },
  ];
  l1stores.forEach((ds) => {
    s.addShape(pres.ShapeType.rect, { x: ds.x, y: ds.y, w: 1.5, h: 0.45, fill: { color: C.offWhite }, line: { color: C.deepBlue, width: 1 } });
    s.addShape(pres.ShapeType.line, { x: ds.x, y: ds.y, w: 1.5, h: 0, line: { color: C.deepBlue, width: 2 } });
    s.addText(ds.label, { x: ds.x, y: ds.y, w: 1.5, h: 0.45, fontSize: 7, fontFace: bodyFont, color: C.darkText, bold: true, align: "center", valign: "middle", isTextBox: true, margin: 0 });
  });

  // Data flow labels
  s.addText("Data Flows: Application Data → 1.1 → Identity Info → 1.2 → KYC Request → 1.3 → Account Data → 1.4 → Confirmation → 1.5 → Email/SMS", {
    x: 0.3, y: 3.7, w: 9.4, h: 0.3,
    fontSize: 8, fontFace: bodyFont, color: C.midGray, italic: true, isTextBox: true, margin: 0,
  });

  // Flow lines
  [0.5, 2.5, 4.5, 6.5].forEach((x) => {
    s.addShape(pres.ShapeType.line, { x: x + 1.5, y: 2.15, w: 0.5, h: 0, line: { color: C.midGray, width: 1.5 } });
  });
  l1procs.forEach((p) => {
    s.addShape(pres.ShapeType.line, { x: p.x + 0.75, y: 2.5, w: 0, h: 0.5, line: { color: C.midGray, width: 1 } });
  });
}

// =========== SLIDE 19: Sequence Diagram (NEW - FIX) ===========
{
  slideNum++;
  const s = addLightSlide("Sequence Diagram: Customer Onboarding");
  sn(s, slideNum);

  const actors = [
    { label: "Customer", x: 0.8 },
    { label: "Web App", x: 2.3 },
    { label: "Auth\nService", x: 3.8 },
    { label: "Onboarding\nService", x: 5.3 },
    { label: "KYC\nEngine", x: 6.8 },
    { label: "Account\nDB", x: 8.3 },
  ];

  actors.forEach((a) => {
    s.addShape(pres.ShapeType.roundRect, { x: a.x, y: 1.25, w: 1.2, h: 0.45, fill: { color: C.deepBlue }, rectRadius: 0.06 });
    s.addText(a.label, { x: a.x, y: 1.25, w: 1.2, h: 0.45, fontSize: 8, fontFace: bodyFont, color: C.white, bold: true, align: "center", valign: "middle", isTextBox: true, margin: 0, lineSpacingMultiple: 0.9 });
    s.addShape(pres.ShapeType.line, { x: a.x + 0.6, y: 1.7, w: 0, h: 3.3, line: { color: C.lightGray, width: 1, dashType: "dash" } });
  });

  const messages = [
    { from: 0, to: 1, label: "1. Submit registration form", y: 1.85 },
    { from: 1, to: 2, label: "2. Authenticate request", y: 2.15 },
    { from: 2, to: 1, label: "3. Auth token", y: 2.4, ret: true },
    { from: 1, to: 3, label: "4. Create onboarding request", y: 2.65 },
    { from: 3, to: 4, label: "5. Verify KYC documents", y: 2.9 },
    { from: 4, to: 3, label: "6. KYC result (pass/fail)", y: 3.15, ret: true },
    { from: 3, to: 5, label: "7. Create account record", y: 3.4 },
    { from: 5, to: 3, label: "8. Account ID", y: 3.65, ret: true },
    { from: 3, to: 1, label: "9. Onboarding complete", y: 3.9, ret: true },
    { from: 1, to: 0, label: "10. Confirmation + account details", y: 4.15, ret: true },
  ];

  messages.forEach((m) => {
    const x1 = actors[m.from].x + 0.6;
    const x2 = actors[m.to].x + 0.6;
    const lineW = x2 - x1;
    s.addShape(pres.ShapeType.line, { x: x1, y: m.y, w: lineW, h: 0, line: { color: m.ret ? C.teal : C.navy, width: 1, dashType: m.ret ? "dash" : "solid" } });
    const labelX = Math.min(x1, x2) + 0.1;
    const labelW = Math.abs(lineW) - 0.2;
    s.addText(m.label, { x: labelX, y: m.y - 0.18, w: labelW, h: 0.18, fontSize: 6.5, fontFace: bodyFont, color: C.darkText, align: "center", isTextBox: true, margin: 0 });
  });
}

// =========== SLIDE 20: System Architecture & Cloud Topology ===========
{
  slideNum++;
  const s = addLightSlide("System Architecture & Cloud Topology");
  sn(s, slideNum);

  const tiers = [
    { title: "Presentation Layer", y: 1.35, h: 0.9, color: C.deepBlue, items: ["Web App", "Mobile App", "API Gateway"] },
    { title: "Application Layer", y: 2.45, h: 0.9, color: C.teal, items: ["Auth Service", "Onboarding Svc", "Transaction Svc", "Loan Service"] },
    { title: "Data Layer", y: 3.55, h: 0.9, color: C.navy, items: ["PostgreSQL", "Redis Cache", "Kafka MQ"] },
  ];

  tiers.forEach((t) => {
    s.addShape(pres.ShapeType.roundRect, { x: 0.4, y: t.y, w: 5.5, h: t.h, fill: { color: t.color }, rectRadius: 0.08 });
    s.addText(t.title, { x: 0.5, y: t.y + 0.05, w: 1.8, h: 0.3, fontSize: 10, fontFace: bodyFont, color: C.white, bold: true, isTextBox: true, margin: 0 });
    t.items.forEach((item, i) => {
      s.addShape(pres.ShapeType.roundRect, { x: 0.6 + i * 1.35, y: t.y + 0.4, w: 1.2, h: 0.4, fill: { color: C.white }, rectRadius: 0.06 });
      s.addText(item, { x: 0.6 + i * 1.35, y: t.y + 0.4, w: 1.2, h: 0.4, fontSize: 8, fontFace: bodyFont, color: C.darkText, align: "center", valign: "middle", isTextBox: true, margin: 0 });
    });
  });

  s.addShape(pres.ShapeType.roundRect, { x: 6.2, y: 1.35, w: 3.4, h: 3.1, fill: { color: C.offWhite }, line: { color: C.deepBlue, width: 1, dashType: "dash" }, rectRadius: 0.12 });
  s.addText("IBM Cloud", { x: 6.3, y: 1.4, w: 3.2, h: 0.3, fontSize: 11, fontFace: bodyFont, color: C.deepBlue, bold: true, isTextBox: true, margin: 0 });

  ["Kubernetes Cluster", "Container Registry", "Load Balancer", "WAF", "Cloud Monitoring", "Cloud Logging"].forEach((item, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    s.addShape(pres.ShapeType.roundRect, { x: 6.4 + col * 1.6, y: 1.85 + row * 0.8, w: 1.4, h: 0.55, fill: { color: C.white }, line: { color: C.teal, width: 0.5 }, rectRadius: 0.06 });
    s.addText(item, { x: 6.4 + col * 1.6, y: 1.85 + row * 0.8, w: 1.4, h: 0.55, fontSize: 8, fontFace: bodyFont, color: C.darkText, align: "center", valign: "middle", isTextBox: true, margin: 0 });
  });
}

// =========== SLIDE 21: Security Architecture (NEW - FIX) ===========
{
  slideNum++;
  const s = addLightSlide("Security Architecture Diagram");
  sn(s, slideNum);

  const secLayers = [
    { title: "Perimeter Security", y: 1.35, color: C.red, items: ["WAF", "DDoS Protection", "TLS 1.3 Termination"] },
    { title: "Network Security", y: 2.25, color: C.orange, items: ["VPC Isolation", "Network ACLs", "Firewall Rules", "VPN Tunnels"] },
    { title: "Application Security", y: 3.15, color: C.yellow, items: ["OAuth 2.0 / JWT", "RBAC Authorization", "Input Validation", "API Rate Limiting"] },
    { title: "Data Security", y: 4.05, color: C.deepBlue, items: ["AES-256 Encryption", "Key Management", "Data Masking", "Audit Logging"] },
  ];

  secLayers.forEach((layer) => {
    s.addShape(pres.ShapeType.roundRect, { x: 0.3, y: layer.y, w: 5.8, h: 0.75, fill: { color: layer.color }, rectRadius: 0.06 });
    s.addText(layer.title, { x: 0.4, y: layer.y + 0.02, w: 1.6, h: 0.25, fontSize: 9, fontFace: bodyFont, color: layer.color === C.yellow ? C.darkText : C.white, bold: true, isTextBox: true, margin: 0 });
    layer.items.forEach((item, i) => {
      s.addShape(pres.ShapeType.roundRect, { x: 0.4 + i * 1.45, y: layer.y + 0.32, w: 1.3, h: 0.35, fill: { color: C.white }, rectRadius: 0.04 });
      s.addText(item, { x: 0.4 + i * 1.45, y: layer.y + 0.32, w: 1.3, h: 0.35, fontSize: 7, fontFace: bodyFont, color: C.darkText, align: "center", valign: "middle", isTextBox: true, margin: 0 });
    });
  });

  // Compliance box
  s.addShape(pres.ShapeType.roundRect, { x: 6.4, y: 1.35, w: 3.2, h: 3.45, fill: { color: C.offWhite }, rectRadius: 0.1, line: { color: C.teal, width: 1 } });
  s.addText("COMPLIANCE", { x: 6.5, y: 1.4, w: 3.0, h: 0.3, fontSize: 10, fontFace: bodyFont, color: C.deepBlue, bold: true, isTextBox: true, margin: 0 });
  s.addText([
    { text: "PCI-DSS v4.0 compliant", options: { bullet: true, breakLine: true, fontSize: 9, fontFace: bodyFont, color: C.darkText } },
    { text: "KYC/AML automated checks", options: { bullet: true, breakLine: true, fontSize: 9, fontFace: bodyFont, color: C.darkText } },
    { text: "GDPR data handling", options: { bullet: true, breakLine: true, fontSize: 9, fontFace: bodyFont, color: C.darkText } },
    { text: "SOC 2 Type II controls", options: { bullet: true, breakLine: true, fontSize: 9, fontFace: bodyFont, color: C.darkText } },
    { text: "Quarterly pen testing", options: { bullet: true, breakLine: true, fontSize: 9, fontFace: bodyFont, color: C.darkText } },
    { text: "SIEM integration", options: { bullet: true, breakLine: true, fontSize: 9, fontFace: bodyFont, color: C.darkText } },
    { text: "Incident response SLA < 1hr", options: { bullet: true, breakLine: true, fontSize: 9, fontFace: bodyFont, color: C.darkText } },
    { text: "Automated vulnerability scanning", options: { bullet: true, fontSize: 9, fontFace: bodyFont, color: C.darkText } },
  ], { x: 6.5, y: 1.75, w: 3.0, h: 2.9, isTextBox: true, margin: 0, paraSpaceAfter: 3 });
}

// =========== SLIDE 22: PoC ===========
{
  slideNum++;
  const s = addLightSlide("Proof of Concept (PoC)");
  sn(s, slideNum);

  const rows = [
    ["Section", "Details"],
    ["Objectives", "Validate microservices architecture for the customer onboarding flow"],
    ["Scope", "Auth service + Onboarding service + KYC integration"],
    ["Setup", "Docker containers on IBM Cloud Kubernetes, PostgreSQL, REST APIs"],
    ["Tools", "Docker, Kubernetes, Jenkins, PostgreSQL, Kafka"],
    ["Limitations", "Onboarding flow only; no production data; single region deployment"],
    ["Recommendations", "Proceed with full build; add Redis caching; implement circuit breakers"],
  ];

  s.addTable(rows, {
    x: 0.6, y: 1.4, w: 8.8,
    fontSize: 11, fontFace: bodyFont, color: C.darkText,
    border: { type: "solid", pt: 0.5, color: C.lightGray },
    colW: [2.0, 6.8],
    rowH: 0.5,
    autoPage: false,
    rowProps: rows.map((_, i) => ({
      fill: i === 0 ? C.navy : i % 2 === 1 ? C.offWhite : C.white,
      color: i === 0 ? C.white : C.darkText,
      bold: i === 0,
    })),
  });
}

// =========== SLIDE 23: Database Design - Conceptual ERD + Logical ERD (FIX: add logical ERD) ===========
{
  slideNum++;
  const s = addLightSlide("Database Design: Conceptual & Logical ERD");
  sn(s, slideNum);

  // Conceptual ERD label
  s.addText("CONCEPTUAL ERD", { x: 0.4, y: 1.25, w: 2, h: 0.25, fontSize: 9, fontFace: bodyFont, color: C.deepBlue, bold: true, isTextBox: true, margin: 0 });

  const ents = [
    { label: "Customer\n─────\nCustomerID (PK)\nName\nEmail\nPhone\nAddress", x: 0.3, y: 1.55, w: 1.55, h: 1.55 },
    { label: "Account\n─────\nAccountID (PK)\nCustomerID (FK)\nType\nBalance\nStatus\nOpenDate", x: 2.2, y: 1.55, w: 1.55, h: 1.55 },
    { label: "Transaction\n─────\nTransactionID (PK)\nAccountID (FK)\nAmount\nType\nDate\nStatus", x: 4.1, y: 1.55, w: 1.55, h: 1.55 },
    { label: "Loan\n─────\nLoanID (PK)\nCustomerID (FK)\nAmount\nRate\nTerm\nStatus", x: 6.0, y: 1.55, w: 1.55, h: 1.55 },
  ];

  ents.forEach((e) => {
    s.addShape(pres.ShapeType.roundRect, { x: e.x, y: e.y, w: e.w, h: e.h, fill: { color: C.offWhite }, line: { color: C.teal, width: 1.5 }, rectRadius: 0.06 });
    s.addText(e.label, { x: e.x + 0.08, y: e.y + 0.05, w: e.w - 0.16, h: e.h - 0.1, fontSize: 7, fontFace: bodyFont, color: C.darkText, valign: "top", isTextBox: true, margin: 0, lineSpacingMultiple: 1.05 });
  });

  s.addText("1:N →", { x: 1.85, y: 2.1, w: 0.4, h: 0.25, fontSize: 7, fontFace: bodyFont, color: C.deepBlue, bold: true, align: "center", isTextBox: true, margin: 0 });
  s.addText("1:N →", { x: 3.75, y: 2.1, w: 0.4, h: 0.25, fontSize: 7, fontFace: bodyFont, color: C.deepBlue, bold: true, align: "center", isTextBox: true, margin: 0 });
  s.addText("1:N →", { x: 5.65, y: 2.1, w: 0.4, h: 0.25, fontSize: 7, fontFace: bodyFont, color: C.deepBlue, bold: true, align: "center", isTextBox: true, margin: 0 });

  // Logical ERD normalization info
  s.addText("LOGICAL ERD — NORMALIZATION", { x: 7.8, y: 1.25, w: 2, h: 0.25, fontSize: 9, fontFace: bodyFont, color: C.deepBlue, bold: true, isTextBox: true, margin: 0 });
  s.addShape(pres.ShapeType.roundRect, { x: 7.7, y: 1.55, w: 2.0, h: 1.55, fill: { color: C.offWhite }, rectRadius: 0.06 });
  s.addText([
    { text: "1NF: All fields atomic", options: { bullet: true, breakLine: true, fontSize: 8, fontFace: bodyFont, color: C.darkText } },
    { text: "2NF: No partial dependencies", options: { bullet: true, breakLine: true, fontSize: 8, fontFace: bodyFont, color: C.darkText } },
    { text: "3NF: No transitive deps", options: { bullet: true, breakLine: true, fontSize: 8, fontFace: bodyFont, color: C.darkText } },
    { text: "All tables in BCNF", options: { bullet: true, breakLine: true, fontSize: 8, fontFace: bodyFont, color: C.darkText } },
    { text: "Referential integrity via FK", options: { bullet: true, fontSize: 8, fontFace: bodyFont, color: C.darkText } },
  ], { x: 7.8, y: 1.6, w: 1.8, h: 1.4, isTextBox: true, margin: 0, paraSpaceAfter: 2 });

  // Data Dictionary
  s.addText("DATA DICTIONARY", { x: 0.3, y: 3.25, w: 3, h: 0.25, fontSize: 9, fontFace: bodyFont, color: C.deepBlue, bold: true, isTextBox: true, margin: 0 });
  const ddRows = [
    ["Field", "Type", "Length", "Nullable", "Description"],
    ["CustomerID", "INT", "11", "No", "Primary key, auto-increment"],
    ["Name", "VARCHAR", "100", "No", "Customer full name"],
    ["AccountID", "INT", "11", "No", "Primary key, auto-increment"],
    ["Balance", "DECIMAL", "15,2", "No", "Current account balance"],
    ["TransactionID", "INT", "11", "No", "Primary key, auto-increment"],
  ];
  s.addTable(ddRows, {
    x: 0.3, y: 3.5, w: 5.4,
    fontSize: 7.5, fontFace: bodyFont, color: C.darkText,
    border: { type: "solid", pt: 0.5, color: C.lightGray },
    colW: [1.0, 0.9, 0.6, 0.6, 2.3],
    rowH: 0.23,
    autoPage: false,
    rowProps: ddRows.map((_, i) => ({ fill: i === 0 ? C.navy : i % 2 === 1 ? C.offWhite : C.white, color: i === 0 ? C.white : C.darkText, bold: i === 0 })),
  });

  // Data Migration Strategy
  s.addText("DATA MIGRATION STRATEGY", { x: 5.9, y: 3.25, w: 3.5, h: 0.25, fontSize: 9, fontFace: bodyFont, color: C.deepBlue, bold: true, isTextBox: true, margin: 0 });
  s.addShape(pres.ShapeType.roundRect, { x: 5.9, y: 3.5, w: 3.8, h: 1.9, fill: { color: C.offWhite }, rectRadius: 0.08 });
  s.addText([
    { text: "Phase 1: Extract legacy data from Oracle/DB2", options: { bullet: true, breakLine: true, fontSize: 8, fontFace: bodyFont, color: C.darkText } },
    { text: "Phase 2: Transform and cleanse using ETL pipeline", options: { bullet: true, breakLine: true, fontSize: 8, fontFace: bodyFont, color: C.darkText } },
    { text: "Phase 3: Load into PostgreSQL with validation", options: { bullet: true, breakLine: true, fontSize: 8, fontFace: bodyFont, color: C.darkText } },
    { text: "Phase 4: Parallel run with data sync for 2 weeks", options: { bullet: true, breakLine: true, fontSize: 8, fontFace: bodyFont, color: C.darkText } },
    { text: "Phase 5: Cutover with rollback plan ready", options: { bullet: true, breakLine: true, fontSize: 8, fontFace: bodyFont, color: C.darkText } },
    { text: "Validation: Row counts, checksums, referential integrity checks post-migration", options: { bullet: true, fontSize: 8, fontFace: bodyFont, color: C.darkText } },
  ], { x: 6.0, y: 3.55, w: 3.6, h: 1.8, isTextBox: true, margin: 0, paraSpaceAfter: 2 });

  // Normalization Key table
  s.addText("NORMALIZATION KEYS", { x: 0.3, y: 5.0, w: 3, h: 0.25, fontSize: 8, fontFace: bodyFont, color: C.deepBlue, bold: true, isTextBox: true, margin: 0 });
  s.addText("Customer(CustomerID) → Account(CustomerID FK) → Transaction(AccountID FK) | Customer(CustomerID) → Loan(CustomerID FK)", {
    x: 0.3, y: 5.2, w: 9.4, h: 0.25, fontSize: 7, fontFace: bodyFont, color: C.darkText, isTextBox: true, margin: 0,
  });
}

// =========== SLIDE 24: Test Plan (FIX: add deliverables + annotations) ===========
{
  slideNum++;
  const s = addLightSlide("Test Plan & Test Cases (TDD/BDD)");
  sn(s, slideNum);

  const tpRows = [
    ["Element", "Details"],
    ["Scope", "All microservices, APIs, integration points, and database operations"],
    ["Purpose", "Validate functional and non-functional requirements against acceptance criteria"],
    ["Objectives", "100% critical path coverage; performance benchmarks met; zero P1 defects at launch"],
    ["Deliverables", "Test strategy document; test cases; test execution report; defect log; coverage report"],
    ["Approach", "TDD for unit tests; BDD for acceptance tests; automated regression suite"],
    ["Environment", "Staging cluster mirroring production configuration on IBM Cloud Kubernetes"],
  ];

  s.addTable(tpRows, {
    x: 0.4, y: 1.25, w: 4.5,
    fontSize: 8, fontFace: bodyFont, color: C.darkText,
    border: { type: "solid", pt: 0.5, color: C.lightGray },
    colW: [1.0, 3.5],
    rowH: 0.32,
    autoPage: false,
    rowProps: tpRows.map((_, i) => ({ fill: i === 0 ? C.navy : i % 2 === 1 ? C.offWhite : C.white, color: i === 0 ? C.white : C.darkText, bold: i === 0 })),
  });

  // TDD example with annotation
  s.addShape(pres.ShapeType.roundRect, { x: 5.2, y: 1.25, w: 4.4, h: 2.0, fill: { color: C.offWhite }, rectRadius: 0.08 });
  s.addText("TDD Example (Annotated)", { x: 5.3, y: 1.3, w: 4.2, h: 0.25, fontSize: 9, fontFace: bodyFont, color: C.deepBlue, bold: true, isTextBox: true, margin: 0 });
  s.addText("# TC-001: Verify account creation returns ACTIVE status\n# Priority: High | Linked Req: REQ-001\ndef test_account_creation():\n    account = create_account(valid_data)\n    assert account.status == \"ACTIVE\"  # verify status\n    assert account.id is not None       # verify ID assigned\n    assert account.created_at is not None", {
    x: 5.3, y: 1.6, w: 4.2, h: 1.5,
    fontSize: 7, fontFace: "Courier New", color: C.darkText,
    isTextBox: true, margin: 0, lineSpacingMultiple: 1.2,
  });

  // BDD example
  s.addShape(pres.ShapeType.roundRect, { x: 0.4, y: 3.55, w: 9.2, h: 1.85, fill: { color: C.lightTeal }, rectRadius: 0.08 });
  s.addText("BDD Scenario (Gherkin) — TC-002: Customer Onboarding | Priority: Critical | Linked Req: REQ-001, REQ-004", {
    x: 0.5, y: 3.6, w: 9.0, h: 0.25,
    fontSize: 8, fontFace: bodyFont, color: C.deepBlue, bold: true,
    isTextBox: true, margin: 0,
  });
  s.addText("Feature: Customer Onboarding\n  Scenario: Successful account creation with valid KYC\n    Given a customer provides valid KYC documents including passport and proof of address\n    When they submit the onboarding form with all required fields\n    Then an account is created within 10 minutes with status ACTIVE\n    And a confirmation email is sent to the registered email address\n    And the account appears in the customer's dashboard", {
    x: 0.5, y: 3.9, w: 9.0, h: 1.4,
    fontSize: 7.5, fontFace: "Courier New", color: C.darkText,
    isTextBox: true, margin: 0, lineSpacingMultiple: 1.2,
  });
}

// =========== SLIDE 25: CI/CD Workflow (FIX: add config + backup + cloud components) ===========
{
  slideNum++;
  const s = addLightSlide("CI/CD Workflow & Monitoring Plan");
  sn(s, slideNum);

  s.addText("CI WORKFLOW", { x: 0.4, y: 1.25, w: 2, h: 0.25, fontSize: 9, fontFace: bodyFont, color: C.deepBlue, bold: true, isTextBox: true, margin: 0 });
  const ciSteps = ["Code\nCommit", "Build", "Unit\nTests", "Code\nAnalysis", "Artifact\nRegistry"];
  ciSteps.forEach((step, i) => {
    s.addShape(pres.ShapeType.roundRect, { x: 0.4 + i * 1.85, y: 1.55, w: 1.55, h: 0.55, fill: { color: C.teal }, rectRadius: 0.06 });
    s.addText(step, { x: 0.4 + i * 1.85, y: 1.55, w: 1.55, h: 0.55, fontSize: 8, fontFace: bodyFont, color: C.white, bold: true, align: "center", valign: "middle", isTextBox: true, margin: 0, lineSpacingMultiple: 0.9 });
    if (i < ciSteps.length - 1) s.addText("→", { x: 1.95 + i * 1.85, y: 1.6, w: 0.3, h: 0.45, fontSize: 14, fontFace: bodyFont, color: C.midGray, align: "center", isTextBox: true, margin: 0 });
  });

  s.addText("CD PIPELINE", { x: 0.4, y: 2.25, w: 2, h: 0.25, fontSize: 9, fontFace: bodyFont, color: C.deepBlue, bold: true, isTextBox: true, margin: 0 });
  const cdSteps = ["Staging\nDeploy", "Integration\nTests", "Approval\nGate", "Production\nDeploy", "Smoke\nTests"];
  cdSteps.forEach((step, i) => {
    s.addShape(pres.ShapeType.roundRect, { x: 0.4 + i * 1.85, y: 2.55, w: 1.55, h: 0.55, fill: { color: C.deepBlue }, rectRadius: 0.06 });
    s.addText(step, { x: 0.4 + i * 1.85, y: 2.55, w: 1.55, h: 0.55, fontSize: 8, fontFace: bodyFont, color: C.white, bold: true, align: "center", valign: "middle", isTextBox: true, margin: 0, lineSpacingMultiple: 0.9 });
    if (i < cdSteps.length - 1) s.addText("→", { x: 1.95 + i * 1.85, y: 2.6, w: 0.3, h: 0.45, fontSize: 14, fontFace: bodyFont, color: C.midGray, align: "center", isTextBox: true, margin: 0 });
  });

  // Configuration Guides
  s.addText("CONFIGURATION", { x: 0.4, y: 3.3, w: 2, h: 0.25, fontSize: 9, fontFace: bodyFont, color: C.deepBlue, bold: true, isTextBox: true, margin: 0 });
  s.addText([
    { text: "Jenkinsfile pipeline-as-code", options: { bullet: true, breakLine: true, fontSize: 8, fontFace: bodyFont, color: C.darkText } },
    { text: "Helm charts for K8s deployment", options: { bullet: true, breakLine: true, fontSize: 8, fontFace: bodyFont, color: C.darkText } },
    { text: "Docker Compose for local dev", options: { bullet: true, fontSize: 8, fontFace: bodyFont, color: C.darkText } },
  ], { x: 0.4, y: 3.55, w: 3.0, h: 0.8, isTextBox: true, margin: 0, paraSpaceAfter: 2 });

  // Backup & Recovery
  s.addText("BACKUP & RECOVERY", { x: 3.5, y: 3.3, w: 2.5, h: 0.25, fontSize: 9, fontFace: bodyFont, color: C.deepBlue, bold: true, isTextBox: true, margin: 0 });
  s.addText([
    { text: "Automated daily DB backups", options: { bullet: true, breakLine: true, fontSize: 8, fontFace: bodyFont, color: C.darkText } },
    { text: "RPO: 1 hour; RTO: 4 hours", options: { bullet: true, breakLine: true, fontSize: 8, fontFace: bodyFont, color: C.darkText } },
    { text: "Cross-region replication active", options: { bullet: true, fontSize: 8, fontFace: bodyFont, color: C.darkText } },
  ], { x: 3.5, y: 3.55, w: 3.0, h: 0.8, isTextBox: true, margin: 0, paraSpaceAfter: 2 });

  // Cloud Components
  s.addText("CLOUD COMPONENTS", { x: 6.6, y: 3.3, w: 2.5, h: 0.25, fontSize: 9, fontFace: bodyFont, color: C.deepBlue, bold: true, isTextBox: true, margin: 0 });
  s.addText([
    { text: "IBM Cloud Kubernetes Service", options: { bullet: true, breakLine: true, fontSize: 8, fontFace: bodyFont, color: C.darkText } },
    { text: "IBM Container Registry", options: { bullet: true, breakLine: true, fontSize: 8, fontFace: bodyFont, color: C.darkText } },
    { text: "IBM Cloud Object Storage", options: { bullet: true, fontSize: 8, fontFace: bodyFont, color: C.darkText } },
  ], { x: 6.6, y: 3.55, w: 3.0, h: 0.8, isTextBox: true, margin: 0, paraSpaceAfter: 2 });

  // Monitoring
  s.addText("MONITORING FRAMEWORK", { x: 0.4, y: 4.45, w: 4, h: 0.25, fontSize: 9, fontFace: bodyFont, color: C.deepBlue, bold: true, isTextBox: true, margin: 0 });
  [{ label: "Prometheus", desc: "Metrics" }, { label: "Grafana", desc: "Dashboards" }, { label: "ELK Stack", desc: "Log aggregation" }, { label: "PagerDuty", desc: "Alerting" }].forEach((m, i) => {
    s.addShape(pres.ShapeType.roundRect, { x: 0.4 + i * 2.35, y: 4.75, w: 2.1, h: 0.7, fill: { color: C.offWhite }, rectRadius: 0.06 });
    s.addText(m.label, { x: 0.4 + i * 2.35, y: 4.78, w: 2.1, h: 0.3, fontSize: 10, fontFace: bodyFont, color: C.navy, bold: true, align: "center", isTextBox: true, margin: 0 });
    s.addText(m.desc, { x: 0.4 + i * 2.35, y: 5.1, w: 2.1, h: 0.3, fontSize: 8, fontFace: bodyFont, color: C.midGray, align: "center", isTextBox: true, margin: 0 });
  });
}

// =========== SLIDE 26: Key Findings ===========
{
  slideNum++;
  const s = addLightSlide("Key Findings");
  sn(s, slideNum);

  const findings = [
    { stat: "300%", title: "Onboarding Time Overhead", desc: "Legacy systems increase onboarding time by 300% compared to industry benchmarks due to manual data entry and paper-based verification." },
    { stat: "45 min", title: "Incident Detection Delay", desc: "Lack of real-time monitoring means average incident detection takes 45 minutes, well above the 5-minute industry target." },
    { stat: "23%", title: "Resource Waste", desc: "Current monolithic architecture prevents independent scaling, causing 23% resource waste during off-peak hours." },
  ];

  findings.forEach((f, i) => {
    const y = 1.4 + i * 1.3;
    s.addShape(pres.ShapeType.roundRect, { x: 0.6, y, w: 8.8, h: 1.1, fill: { color: C.offWhite }, rectRadius: 0.1 });
    s.addShape(pres.ShapeType.roundRect, { x: 0.8, y: y + 0.15, w: 1.5, h: 0.8, fill: { color: C.deepBlue }, rectRadius: 0.08 });
    s.addText(f.stat, { x: 0.8, y: y + 0.15, w: 1.5, h: 0.8, fontSize: 24, fontFace: titleFont, color: C.white, bold: true, align: "center", valign: "middle", isTextBox: true, margin: 0 });
    s.addText(f.title, { x: 2.5, y: y + 0.1, w: 6.7, h: 0.35, fontSize: 14, fontFace: bodyFont, color: C.navy, bold: true, isTextBox: true, margin: 0 });
    s.addText(f.desc, { x: 2.5, y: y + 0.45, w: 6.7, h: 0.55, fontSize: 11, fontFace: bodyFont, color: C.darkText, isTextBox: true, margin: 0 });
  });
}

// =========== SLIDE 27: Key Recommendations ===========
{
  slideNum++;
  const s = addLightSlide("Key Recommendations");
  sn(s, slideNum);

  const recs = [
    { title: "Adopt Microservices Architecture", desc: "Enable independent deployment and scaling of each banking service for greater agility." },
    { title: "Implement Event-Driven Architecture", desc: "Use Kafka for real-time transaction processing and fraud detection across all channels." },
    { title: "Deploy CI/CD Pipeline", desc: "Automated testing and deployment to reduce release cycles from monthly to weekly." },
    { title: "Establish Centralized Monitoring", desc: "Prometheus and Grafana to achieve sub-5-minute incident detection and response." },
  ];

  recs.forEach((r, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.6 + col * 4.6, y = 1.4 + row * 2.0;
    s.addShape(pres.ShapeType.roundRect, { x, y, w: 4.2, h: 1.7, fill: { color: C.offWhite }, rectRadius: 0.1 });
    s.addShape(pres.ShapeType.ellipse, { x: x + 0.15, y: y + 0.15, w: 0.45, h: 0.45, fill: { color: C.teal } });
    s.addText(String(i + 1), { x: x + 0.15, y: y + 0.15, w: 0.45, h: 0.45, fontSize: 16, fontFace: bodyFont, color: C.white, bold: true, align: "center", valign: "middle", isTextBox: true, margin: 0 });
    s.addText(r.title, { x: x + 0.75, y: y + 0.15, w: 3.25, h: 0.45, fontSize: 13, fontFace: bodyFont, color: C.navy, bold: true, valign: "middle", isTextBox: true, margin: 0 });
    s.addText(r.desc, { x: x + 0.2, y: y + 0.75, w: 3.8, h: 0.75, fontSize: 11, fontFace: bodyFont, color: C.darkText, isTextBox: true, margin: 0 });
  });
}

// =========== SLIDE 28: Conclusion ===========
{
  slideNum++;
  const s = addDarkSlide();
  sn(s, slideNum);

  s.addText("Conclusion", { x: 0.6, y: 0.8, w: 8.8, h: 0.7, fontSize: 36, fontFace: titleFont, color: C.white, bold: true, isTextBox: true, margin: 0 });
  s.addShape(pres.ShapeType.rect, { x: 0.6, y: 1.5, w: 1.5, h: 0.05, fill: { color: C.accent } });

  const conclusions = [
    "The modernization initiative addresses critical operational inefficiencies in ABC Bank's digital infrastructure.",
    "Cloud-native microservices architecture provides the scalability and resilience needed for modern banking.",
    "Phased implementation minimizes risk while delivering incremental business value.",
    "Success depends on stakeholder alignment, robust testing, and continuous monitoring post-deployment.",
  ];

  conclusions.forEach((c, i) => {
    s.addShape(pres.ShapeType.ellipse, { x: 0.6, y: 1.9 + i * 0.85, w: 0.3, h: 0.3, fill: { color: C.teal } });
    s.addText(String(i + 1), { x: 0.6, y: 1.9 + i * 0.85, w: 0.3, h: 0.3, fontSize: 11, fontFace: bodyFont, color: C.white, bold: true, align: "center", valign: "middle", isTextBox: true, margin: 0 });
    s.addText(c, { x: 1.1, y: 1.85 + i * 0.85, w: 8.0, h: 0.55, fontSize: 14, fontFace: bodyFont, color: C.white, valign: "middle", isTextBox: true, margin: 0 });
  });
}

// =========== SLIDE 29: Appendix ===========
{
  slideNum++;
  const s = addLightSlide("Appendix");
  sn(s, slideNum);

  s.addText("REFERENCES", { x: 0.6, y: 1.4, w: 4, h: 0.3, fontSize: 11, fontFace: bodyFont, color: C.deepBlue, bold: true, isTextBox: true, margin: 0 });
  s.addText([
    { text: "IBM Cloud Documentation (2024)", options: { bullet: true, breakLine: true, fontSize: 12, fontFace: bodyFont, color: C.darkText } },
    { text: "TOGAF Architecture Framework v10", options: { bullet: true, breakLine: true, fontSize: 12, fontFace: bodyFont, color: C.darkText } },
    { text: "PCI-DSS Compliance Guide v4.0", options: { bullet: true, breakLine: true, fontSize: 12, fontFace: bodyFont, color: C.darkText } },
    { text: "OWASP Security Testing Guide v4.2", options: { bullet: true, fontSize: 12, fontFace: bodyFont, color: C.darkText } },
  ], { x: 0.6, y: 1.75, w: 4.2, h: 1.4, isTextBox: true, margin: 0, paraSpaceAfter: 6 });

  s.addText("TOOLS USED", { x: 5.2, y: 1.4, w: 4, h: 0.3, fontSize: 11, fontFace: bodyFont, color: C.deepBlue, bold: true, isTextBox: true, margin: 0 });
  s.addText([
    { text: "Draw.io for UML and process diagrams", options: { bullet: true, breakLine: true, fontSize: 12, fontFace: bodyFont, color: C.darkText } },
    { text: "Jira for project tracking and RTM", options: { bullet: true, breakLine: true, fontSize: 12, fontFace: bodyFont, color: C.darkText } },
    { text: "Jenkins for CI/CD pipeline automation", options: { bullet: true, breakLine: true, fontSize: 12, fontFace: bodyFont, color: C.darkText } },
    { text: "Prometheus/Grafana for monitoring", options: { bullet: true, fontSize: 12, fontFace: bodyFont, color: C.darkText } },
  ], { x: 5.2, y: 1.75, w: 4.2, h: 1.4, isTextBox: true, margin: 0, paraSpaceAfter: 6 });

  s.addText("SUPPORTING MATERIALS", { x: 0.6, y: 3.4, w: 8, h: 0.3, fontSize: 11, fontFace: bodyFont, color: C.deepBlue, bold: true, isTextBox: true, margin: 0 });
  s.addText([
    { text: "Detailed API specifications available in project repository", options: { bullet: true, breakLine: true, fontSize: 12, fontFace: bodyFont, color: C.darkText } },
    { text: "Full stakeholder interview transcripts and meeting notes", options: { bullet: true, breakLine: true, fontSize: 12, fontFace: bodyFont, color: C.darkText } },
    { text: "Complete test execution reports and defect logs", options: { bullet: true, fontSize: 12, fontFace: bodyFont, color: C.darkText } },
  ], { x: 0.6, y: 3.75, w: 8.8, h: 1.0, isTextBox: true, margin: 0, paraSpaceAfter: 6 });
}

// Generate
pres.writeFile({ fileName: "/home/user/Artist/FinalSubmission.pptx" })
  .then(() => console.log("Done: FinalSubmission.pptx"))
  .catch((err) => console.error(err));
