const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";

// Color palette - Ocean/Banking theme
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

// Shared styles
const titleFont = "Cambria";
const bodyFont = "Calibri";

function addDarkSlide(pres) {
  const slide = pres.addSlide();
  slide.background = { fill: C.navy };
  return slide;
}

function addLightSlide(pres, title) {
  const slide = pres.addSlide();
  slide.background = { fill: C.white };
  // Title bar
  slide.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 1.1,
    fill: { color: C.navy },
  });
  slide.addText(title, {
    x: 0.6, y: 0.15, w: 8.8, h: 0.8,
    fontSize: 28, fontFace: titleFont, color: C.white, bold: true,
    isTextBox: true, margin: 0,
  });
  return slide;
}

function addSlideNumber(slide, num) {
  slide.addText(String(num), {
    x: 9.2, y: 5.15, w: 0.5, h: 0.35,
    fontSize: 10, fontFace: bodyFont, color: C.midGray, align: "right",
    isTextBox: true, margin: 0,
  });
}

// =========== SLIDE 1: Title ===========
{
  const s = addDarkSlide(pres);
  s.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { color: C.navy },
  });
  // Decorative teal bar
  s.addShape(pres.ShapeType.rect, {
    x: 0.6, y: 2.0, w: 1.5, h: 0.06,
    fill: { color: C.accent },
  });
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
  const s = addLightSlide(pres, "Executive Summary");
  addSlideNumber(s, 2);
  const leftX = 0.6, topY = 1.4;

  // Problem section
  s.addText("THE PROBLEM", {
    x: leftX, y: topY, w: 4, h: 0.35,
    fontSize: 11, fontFace: bodyFont, color: C.deepBlue, bold: true,
    isTextBox: true, margin: 0,
  });
  s.addText([
    { text: "Legacy systems slow onboarding to 5+ days", options: { bullet: true, breakLine: true, fontSize: 13, fontFace: bodyFont, color: C.darkText } },
    { text: "Manual processes cause errors and delays", options: { bullet: true, breakLine: true, fontSize: 13, fontFace: bodyFont, color: C.darkText } },
    { text: "Poor system integration across channels", options: { bullet: true, fontSize: 13, fontFace: bodyFont, color: C.darkText } },
  ], {
    x: leftX, y: topY + 0.35, w: 4.2, h: 1.2,
    isTextBox: true, margin: 0, paraSpaceAfter: 6,
  });

  // Key Insights
  s.addText("KEY INSIGHTS", {
    x: leftX, y: topY + 1.6, w: 4, h: 0.35,
    fontSize: 11, fontFace: bodyFont, color: C.deepBlue, bold: true,
    isTextBox: true, margin: 0,
  });
  s.addText([
    { text: "Cloud-native microservices approach", options: { bullet: true, breakLine: true, fontSize: 13, fontFace: bodyFont, color: C.darkText } },
    { text: "API-first integration strategy", options: { bullet: true, breakLine: true, fontSize: 13, fontFace: bodyFont, color: C.darkText } },
    { text: "Containerized deployment model", options: { bullet: true, fontSize: 13, fontFace: bodyFont, color: C.darkText } },
  ], {
    x: leftX, y: topY + 1.95, w: 4.2, h: 1.2,
    isTextBox: true, margin: 0, paraSpaceAfter: 6,
  });

  // Right side - Recommended actions
  s.addShape(pres.ShapeType.roundRect, {
    x: 5.2, y: topY, w: 4.2, h: 3.6,
    fill: { color: C.offWhite }, rectRadius: 0.15,
  });
  s.addText("RECOMMENDED ACTIONS", {
    x: 5.5, y: topY + 0.15, w: 3.6, h: 0.35,
    fontSize: 11, fontFace: bodyFont, color: C.deepBlue, bold: true,
    isTextBox: true, margin: 0,
  });
  const actions = [
    "Migrate to IBM Cloud platform",
    "Implement CI/CD pipelines",
    "Deploy event-driven architecture",
    "Modernize database layer",
    "Establish real-time monitoring",
  ];
  actions.forEach((a, i) => {
    s.addShape(pres.ShapeType.ellipse, {
      x: 5.5, y: topY + 0.65 + i * 0.55, w: 0.25, h: 0.25,
      fill: { color: C.teal },
    });
    s.addText(String(i + 1), {
      x: 5.5, y: topY + 0.65 + i * 0.55, w: 0.25, h: 0.25,
      fontSize: 10, fontFace: bodyFont, color: C.white, bold: true,
      align: "center", valign: "middle", isTextBox: true, margin: 0,
    });
    s.addText(a, {
      x: 5.9, y: topY + 0.63 + i * 0.55, w: 3.3, h: 0.3,
      fontSize: 12, fontFace: bodyFont, color: C.darkText,
      isTextBox: true, margin: 0,
    });
  });
}

// =========== SLIDE 3: Introduction ===========
{
  const s = addLightSlide(pres, "Introduction");
  addSlideNumber(s, 3);

  s.addText("THE OPPORTUNITY", {
    x: 0.6, y: 1.4, w: 4, h: 0.3,
    fontSize: 11, fontFace: bodyFont, color: C.deepBlue, bold: true,
    isTextBox: true, margin: 0,
  });
  s.addText("Digital transformation of ABC Bank's core operations to modernize customer-facing and back-office systems through a structured systems analysis approach.", {
    x: 0.6, y: 1.75, w: 4.2, h: 0.8,
    fontSize: 13, fontFace: bodyFont, color: C.darkText,
    isTextBox: true, margin: 0,
  });

  s.addText("APPROACH", {
    x: 0.6, y: 2.7, w: 4, h: 0.3,
    fontSize: 11, fontFace: bodyFont, color: C.deepBlue, bold: true,
    isTextBox: true, margin: 0,
  });
  s.addText([
    { text: "UML and BPMN process modeling", options: { bullet: true, breakLine: true, fontSize: 13, fontFace: bodyFont, color: C.darkText } },
    { text: "Data flow and architecture analysis", options: { bullet: true, breakLine: true, fontSize: 13, fontFace: bodyFont, color: C.darkText } },
    { text: "Agile methodology with phased delivery", options: { bullet: true, fontSize: 13, fontFace: bodyFont, color: C.darkText } },
  ], {
    x: 0.6, y: 3.05, w: 4.2, h: 1.0,
    isTextBox: true, margin: 0, paraSpaceAfter: 6,
  });

  // Right side - Key Questions
  s.addShape(pres.ShapeType.roundRect, {
    x: 5.2, y: 1.4, w: 4.2, h: 3.2,
    fill: { color: C.lightBlue }, rectRadius: 0.15,
  });
  s.addText("KEY QUESTIONS", {
    x: 5.5, y: 1.55, w: 3.6, h: 0.3,
    fontSize: 11, fontFace: bodyFont, color: C.navy, bold: true,
    isTextBox: true, margin: 0,
  });
  const questions = [
    "How to reduce onboarding time by 60%?",
    "How to ensure 99.9% system uptime?",
    "How to meet regulatory compliance while modernizing?",
  ];
  questions.forEach((q, i) => {
    s.addText("?", {
      x: 5.5, y: 2.05 + i * 0.8, w: 0.3, h: 0.3,
      fontSize: 18, fontFace: titleFont, color: C.deepBlue, bold: true,
      align: "center", isTextBox: true, margin: 0,
    });
    s.addText(q, {
      x: 5.9, y: 2.05 + i * 0.8, w: 3.3, h: 0.6,
      fontSize: 13, fontFace: bodyFont, color: C.navy,
      isTextBox: true, margin: 0,
    });
  });
}

// =========== SLIDE 4: Objectives ===========
{
  const s = addLightSlide(pres, "Objectives");
  addSlideNumber(s, 4);

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

    s.addShape(pres.ShapeType.roundRect, {
      x, y, w: 2.8, h: 1.7,
      fill: { color: C.offWhite }, rectRadius: 0.1,
    });
    s.addText(obj.metric, {
      x, y: y + 0.2, w: 2.8, h: 0.6,
      fontSize: 28, fontFace: titleFont, color: C.deepBlue, bold: true,
      align: "center", isTextBox: true, margin: 0,
    });
    s.addText(obj.label, {
      x, y: y + 0.85, w: 2.8, h: 0.65,
      fontSize: 12, fontFace: bodyFont, color: C.darkText,
      align: "center", isTextBox: true, margin: 0, lineSpacingMultiple: 1.1,
    });
  });
}

// =========== SLIDE 5: Project Charter ===========
{
  const s = addLightSlide(pres, "Project Charter");
  addSlideNumber(s, 5);

  const rows = [
    ["Element", "Details"],
    ["Project Name", "Digital Banking Modernization"],
    ["Sponsor", "CTO, ABC Bank"],
    ["Scope", "Core banking, onboarding, loans, payments"],
    ["Objectives", "Modernize legacy systems, improve efficiency"],
    ["Major Deliverables", "Cloud platform, microservices, CI/CD pipeline"],
    ["Timeline", "12 months, 3 phases"],
  ];

  s.addTable(rows, {
    x: 0.6, y: 1.4, w: 8.8,
    fontSize: 12, fontFace: bodyFont, color: C.darkText,
    border: { type: "solid", pt: 0.5, color: C.lightGray },
    colW: [2.5, 6.3],
    rowH: 0.45,
    autoPage: false,
    rowProps: rows.map((_, i) => ({
      fill: i === 0 ? C.navy : i % 2 === 1 ? C.offWhite : C.white,
      color: i === 0 ? C.white : C.darkText,
      bold: i === 0,
      fontSize: i === 0 ? 13 : 12,
    })),
  });
}

// =========== SLIDE 6: Stakeholder Register ===========
{
  const s = addLightSlide(pres, "Stakeholder Register");
  addSlideNumber(s, 6);

  const rows = [
    ["Stakeholder", "Role", "Attitude", "Interest", "Impact", "Influence", "Comm. Pref.", "Hours"],
    ["CTO", "Sponsor", "Supportive", "High", "High", "High", "Weekly brief", "9-5"],
    ["IT Director", "Tech Lead", "Neutral", "High", "High", "High", "Bi-weekly", "9-6"],
    ["Branch Mgr", "End User", "Resistant", "Medium", "Medium", "Medium", "Monthly", "8-5"],
    ["Compliance", "Advisor", "Supportive", "High", "High", "Medium", "Weekly", "9-5"],
    ["CS Lead", "End User", "Supportive", "Medium", "Medium", "Low", "Training", "Shift"],
  ];

  s.addTable(rows, {
    x: 0.3, y: 1.4, w: 9.4,
    fontSize: 10, fontFace: bodyFont, color: C.darkText,
    border: { type: "solid", pt: 0.5, color: C.lightGray },
    colW: [1.2, 1.0, 1.1, 1.0, 1.0, 1.0, 1.3, 0.8],
    rowH: 0.5,
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
  const s = addLightSlide(pres, "Stakeholder Engagement Plan");
  addSlideNumber(s, 7);

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
  const s = addLightSlide(pres, "Business Requirements Document");
  addSlideNumber(s, 8);

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
  const s = addLightSlide(pres, "Use Case Diagram");
  addSlideNumber(s, 9);

  // System boundary
  s.addShape(pres.ShapeType.roundRect, {
    x: 2.5, y: 1.3, w: 5.0, h: 4.0,
    fill: { color: C.offWhite },
    line: { color: C.deepBlue, width: 2, dashType: "dash" },
    rectRadius: 0.15,
  });
  s.addText("ABC Bank Digital Platform", {
    x: 2.6, y: 1.35, w: 4.8, h: 0.35,
    fontSize: 12, fontFace: bodyFont, color: C.deepBlue, bold: true, italic: true,
    isTextBox: true, margin: 0,
  });

  // Use cases (ellipses)
  const useCases = [
    { label: "Customer\nOnboarding", x: 3.2, y: 1.85 },
    { label: "Account\nLogin", x: 5.5, y: 1.85 },
    { label: "Transaction\nProcessing", x: 3.2, y: 3.0 },
    { label: "Loan\nApplication", x: 5.5, y: 3.0 },
    { label: "View Transaction\nHistory", x: 4.35, y: 4.1 },
  ];
  useCases.forEach((uc) => {
    s.addShape(pres.ShapeType.ellipse, {
      x: uc.x, y: uc.y, w: 1.8, h: 0.85,
      fill: { color: C.white },
      line: { color: C.teal, width: 1.5 },
    });
    s.addText(uc.label, {
      x: uc.x, y: uc.y + 0.05, w: 1.8, h: 0.75,
      fontSize: 9, fontFace: bodyFont, color: C.darkText,
      align: "center", valign: "middle", isTextBox: true, margin: 0,
      lineSpacingMultiple: 0.95,
    });
  });

  // Left actors
  const leftActors = [
    { label: "Customer", y: 2.1 },
    { label: "Bank Staff", y: 3.5 },
  ];
  leftActors.forEach((a) => {
    s.addText("👤", {
      x: 0.7, y: a.y, w: 0.5, h: 0.4,
      fontSize: 20, align: "center", isTextBox: true, margin: 0,
    });
    s.addText(a.label, {
      x: 0.4, y: a.y + 0.4, w: 1.1, h: 0.3,
      fontSize: 10, fontFace: bodyFont, color: C.darkText,
      align: "center", isTextBox: true, margin: 0,
    });
  });

  // Right actors
  const rightActors = [
    { label: "Credit Bureau", y: 1.9 },
    { label: "Payment GW", y: 2.8 },
    { label: "Auth Service", y: 3.7 },
  ];
  rightActors.forEach((a) => {
    s.addText("⚙️", {
      x: 8.3, y: a.y, w: 0.5, h: 0.4,
      fontSize: 18, align: "center", isTextBox: true, margin: 0,
    });
    s.addText(a.label, {
      x: 7.9, y: a.y + 0.4, w: 1.3, h: 0.3,
      fontSize: 10, fontFace: bodyFont, color: C.darkText,
      align: "center", isTextBox: true, margin: 0,
    });
  });

  // Relationships text
  s.addText("<<include>> Authentication  |  <<include>> Credit Check  |  <<extend>> Fraud Alert", {
    x: 0.6, y: 5.05, w: 8.8, h: 0.3,
    fontSize: 9, fontFace: bodyFont, color: C.midGray, italic: true,
    align: "center", isTextBox: true, margin: 0,
  });
}

// =========== SLIDE 10: RTM ===========
{
  const s = addLightSlide(pres, "Requirements Traceability Matrix");
  addSlideNumber(s, 10);

  const rows = [
    ["Req ID", "Type", "Description", "Source", "Acceptance Criteria", "Owner", "Priority", "Status", "Verification", "Risk"],
    ["REQ-001", "Func", "Online account opening", "CTO", "Complete < 10 min", "IT Dir.", "High", "In Progress", "UAT", "R-003"],
    ["REQ-002", "Func", "Real-time transactions", "Branch Mgr", "Process < 2 sec", "Dev Lead", "High", "In Progress", "Perf Test", "R-001"],
    ["REQ-003", "NFR", "99.9% system uptime", "CTO", "< 8.7 hrs down/yr", "IT Dir.", "Critical", "Planned", "Monitoring", "R-002"],
    ["REQ-004", "Func", "Automated KYC", "Compliance", "Verify < 5 min", "Comp Lead", "High", "In Progress", "Int. Test", "R-004"],
    ["REQ-005", "NFR", "PCI-DSS compliance", "Compliance", "Pass annual audit", "Sec Lead", "Critical", "In Progress", "Sec Audit", "R-005"],
  ];

  s.addTable(rows, {
    x: 0.2, y: 1.4, w: 9.6,
    fontSize: 9, fontFace: bodyFont, color: C.darkText,
    border: { type: "solid", pt: 0.5, color: C.lightGray },
    colW: [0.7, 0.5, 1.4, 0.8, 1.2, 0.8, 0.7, 0.9, 0.9, 0.6],
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
  const s = addLightSlide(pres, "Work Breakdown Structure");
  addSlideNumber(s, 11);

  // Top level
  s.addShape(pres.ShapeType.roundRect, {
    x: 2.8, y: 1.35, w: 4.4, h: 0.55,
    fill: { color: C.navy }, rectRadius: 0.1,
  });
  s.addText("1.0 Digital Banking Modernization", {
    x: 2.8, y: 1.35, w: 4.4, h: 0.55,
    fontSize: 12, fontFace: bodyFont, color: C.white, bold: true,
    align: "center", valign: "middle", isTextBox: true, margin: 0,
  });

  const phases = [
    {
      title: "1.1 Planning", color: C.deepBlue,
      tasks: ["1.1.1 Requirements\ngathering", "1.1.2 Stakeholder\nanalysis", "1.1.3 Risk\nassessment", "1.1.4 Architecture\ndesign"],
      x: 0.3,
    },
    {
      title: "1.2 Execution", color: C.teal,
      tasks: ["1.2.1 Infrastructure\nsetup", "1.2.2 Microservices\ndevelopment", "1.2.3 Data\nmigration", "1.2.4 Integration\ntesting"],
      x: 3.5,
    },
    {
      title: "1.3 Closure", color: C.green,
      tasks: ["1.3.1 UAT", "1.3.2 Deployment", "1.3.3 Training", "1.3.4 Post-launch\nreview"],
      x: 6.7,
    },
  ];

  phases.forEach((p) => {
    s.addShape(pres.ShapeType.roundRect, {
      x: p.x, y: 2.3, w: 2.8, h: 0.5,
      fill: { color: p.color }, rectRadius: 0.08,
    });
    s.addText(p.title, {
      x: p.x, y: 2.3, w: 2.8, h: 0.5,
      fontSize: 11, fontFace: bodyFont, color: C.white, bold: true,
      align: "center", valign: "middle", isTextBox: true, margin: 0,
    });

    p.tasks.forEach((t, i) => {
      const tx = p.x + i * 0.72;
      s.addShape(pres.ShapeType.roundRect, {
        x: tx, y: 3.15, w: 0.65, h: 1.6,
        fill: { color: C.offWhite }, rectRadius: 0.06,
        line: { color: C.lightGray, width: 0.5 },
      });
      s.addText(t, {
        x: tx, y: 3.2, w: 0.65, h: 1.5,
        fontSize: 7, fontFace: bodyFont, color: C.darkText,
        align: "center", valign: "top", isTextBox: true, margin: [2, 2, 2, 2],
        lineSpacingMultiple: 1.0,
      });
    });
  });
}

// =========== SLIDE 12: Network Diagram ===========
{
  const s = addLightSlide(pres, "Network Diagram");
  addSlideNumber(s, 12);

  const tasks = [
    { label: "Requirements\n2 wks", x: 0.3, color: C.deepBlue },
    { label: "Architecture\n2 wks", x: 1.5, color: C.deepBlue },
    { label: "Infrastructure\n4 wks", x: 2.7, color: C.teal },
    { label: "Microservices\n12 wks", x: 3.9, color: C.teal },
    { label: "Data Migration\n4 wks", x: 5.1, color: C.teal },
    { label: "Integration Test\n4 wks", x: 6.3, color: C.teal },
    { label: "UAT\n2 wks", x: 7.5, color: C.green },
    { label: "Deployment\n2 wks", x: 8.7, color: C.green },
  ];

  // Connection line
  s.addShape(pres.ShapeType.line, {
    x: 0.85, y: 2.8, w: 8.4, h: 0,
    line: { color: C.midGray, width: 2, dashType: "dash" },
  });

  tasks.forEach((t) => {
    s.addShape(pres.ShapeType.roundRect, {
      x: t.x, y: 2.1, w: 1.1, h: 1.3,
      fill: { color: t.color }, rectRadius: 0.08,
    });
    s.addText(t.label, {
      x: t.x, y: 2.1, w: 1.1, h: 1.3,
      fontSize: 9, fontFace: bodyFont, color: C.white, bold: true,
      align: "center", valign: "middle", isTextBox: true, margin: 0,
      lineSpacingMultiple: 1.1,
    });
  });

  // Critical path label
  s.addText("Critical Path: Requirements → Architecture → Infrastructure → Microservices → Integration Testing → UAT → Deployment", {
    x: 0.6, y: 3.7, w: 8.8, h: 0.4,
    fontSize: 10, fontFace: bodyFont, color: C.red, italic: true,
    isTextBox: true, margin: 0,
  });
  s.addText("Total Duration: ~32 weeks (8 months)  |  Planning: 2 wks  |  Execution: 6 months  |  Closure: 2 wks", {
    x: 0.6, y: 4.2, w: 8.8, h: 0.4,
    fontSize: 11, fontFace: bodyFont, color: C.darkText,
    isTextBox: true, margin: 0,
  });
}

// =========== SLIDE 13: SWOT ===========
{
  const s = addLightSlide(pres, "SWOT Analysis");
  addSlideNumber(s, 13);

  const quads = [
    {
      title: "STRENGTHS", color: C.green, fill: C.lightTeal, x: 0.6, y: 1.4,
      items: ["Strong executive sponsorship", "Existing customer base", "Skilled IT team", "Clear regulatory framework"],
    },
    {
      title: "WEAKNESSES", color: C.orange, fill: "FFF7ED", x: 5.2, y: 1.4,
      items: ["Legacy system dependencies", "Limited cloud expertise", "Change resistance from staff", "Technical debt"],
    },
    {
      title: "OPPORTUNITIES", color: C.deepBlue, fill: C.lightBlue, x: 0.6, y: 3.45,
      items: ["Cloud-native scalability", "AI-driven fraud detection", "Open banking APIs", "Market differentiation"],
    },
    {
      title: "THREATS", color: C.red, fill: "FEF2F2", x: 5.2, y: 3.45,
      items: ["Cybersecurity risks", "Regulatory changes", "Competitor digital offerings", "Data migration failures"],
    },
  ];

  quads.forEach((q) => {
    s.addShape(pres.ShapeType.roundRect, {
      x: q.x, y: q.y, w: 4.2, h: 1.85,
      fill: { color: q.fill }, rectRadius: 0.1,
    });
    s.addText(q.title, {
      x: q.x + 0.2, y: q.y + 0.1, w: 3.8, h: 0.35,
      fontSize: 12, fontFace: bodyFont, color: q.color, bold: true,
      isTextBox: true, margin: 0,
    });
    s.addText(q.items.map((item, i) => ({
      text: item,
      options: {
        bullet: true, fontSize: 11, fontFace: bodyFont, color: C.darkText,
        breakLine: i < q.items.length - 1,
      },
    })), {
      x: q.x + 0.2, y: q.y + 0.45, w: 3.8, h: 1.3,
      isTextBox: true, margin: 0, paraSpaceAfter: 4,
    });
  });
}

// =========== SLIDE 14: Risk Register ===========
{
  const s = addLightSlide(pres, "Risk Register");
  addSlideNumber(s, 14);

  const rows = [
    ["ID", "Cause", "Event", "Impact", "Owner", "Cat.", "Prob", "Impact", "Rating", "Score", "Response"],
    ["R-001", "Legacy complexity", "Migration fail", "Service down", "IT Dir.", "Tech", "High", "High", "Critical", "9", "Rollback"],
    ["R-002", "Single point fail", "Downtime", "Revenue loss", "IT Dir.", "Tech", "Med", "High", "High", "6", "Failover"],
    ["R-003", "Manual process", "Onboard delay", "Cust. churn", "Br. Mgr", "Ops", "Med", "Med", "Med", "4", "Automate"],
    ["R-004", "Reg. gaps", "Compliance fail", "Fines", "Comp.", "Comp", "Low", "High", "Med", "3", "Audit"],
    ["R-005", "Cyber threats", "Data breach", "Reputation", "Sec Lead", "Sec", "Med", "High", "High", "6", "Incident resp."],
  ];

  s.addTable(rows, {
    x: 0.15, y: 1.4, w: 9.7,
    fontSize: 8.5, fontFace: bodyFont, color: C.darkText,
    border: { type: "solid", pt: 0.5, color: C.lightGray },
    colW: [0.55, 1.0, 0.9, 0.85, 0.7, 0.55, 0.55, 0.6, 0.7, 0.5, 0.9],
    rowH: 0.55,
    autoPage: false,
    rowProps: rows.map((_, i) => ({
      fill: i === 0 ? C.navy : i % 2 === 1 ? C.offWhite : C.white,
      color: i === 0 ? C.white : C.darkText,
      bold: i === 0,
    })),
  });
}

// =========== SLIDE 15: Risk Matrix ===========
{
  const s = addLightSlide(pres, "Risk Matrix");
  addSlideNumber(s, 15);

  const labels = ["Very Low", "Low", "Medium", "High", "Very High"];
  const gridColors = [
    [C.green, C.green, C.green, "B8D4A0", "B8D4A0"],
    [C.green, "B8D4A0", C.yellow, C.yellow, C.orange],
    ["B8D4A0", C.yellow, C.yellow, C.orange, C.orange],
    ["B8D4A0", C.yellow, C.orange, C.orange, C.red],
    [C.yellow, C.orange, C.orange, C.red, C.red],
  ];

  const startX = 2.0, startY = 1.5, cellW = 1.3, cellH = 0.7;

  // Y-axis label
  s.addText("PROBABILITY →", {
    x: 0.3, y: 3.2, w: 1.5, h: 0.3,
    fontSize: 10, fontFace: bodyFont, color: C.darkText, bold: true,
    isTextBox: true, margin: 0, rotate: 270,
  });

  // X-axis label
  s.addText("IMPACT →", {
    x: 4.0, y: 5.1, w: 2.0, h: 0.3,
    fontSize: 10, fontFace: bodyFont, color: C.darkText, bold: true,
    align: "center", isTextBox: true, margin: 0,
  });

  for (let row = 0; row < 5; row++) {
    // Y labels
    s.addText(labels[4 - row], {
      x: 0.8, y: startY + row * cellH, w: 1.1, h: cellH,
      fontSize: 8, fontFace: bodyFont, color: C.darkText,
      align: "right", valign: "middle", isTextBox: true, margin: 0,
    });
    for (let col = 0; col < 5; col++) {
      s.addShape(pres.ShapeType.rect, {
        x: startX + col * cellW, y: startY + row * cellH, w: cellW, h: cellH,
        fill: { color: gridColors[4 - row][col] },
        line: { color: C.white, width: 2 },
      });
    }
  }
  // X labels
  labels.forEach((l, i) => {
    s.addText(l, {
      x: startX + i * cellW, y: startY + 5 * cellH, w: cellW, h: 0.35,
      fontSize: 8, fontFace: bodyFont, color: C.darkText,
      align: "center", isTextBox: true, margin: 0,
    });
  });

  // Plot risks
  const risks = [
    { id: "R-001", col: 3, row: 3, color: C.red },
    { id: "R-002", col: 3, row: 2, color: C.orange },
    { id: "R-003", col: 2, row: 2, color: C.yellow },
    { id: "R-004", col: 3, row: 1, color: C.yellow },
    { id: "R-005", col: 3, row: 2, color: C.orange },
  ];

  risks.forEach((r, i) => {
    const rx = startX + r.col * cellW + (r.id === "R-005" ? 0.65 : 0.3);
    const ry = startY + (4 - r.row) * cellH + 0.15;
    s.addShape(pres.ShapeType.ellipse, {
      x: rx, y: ry, w: 0.4, h: 0.4,
      fill: { color: C.navy },
      line: { color: C.white, width: 1.5 },
    });
    s.addText(r.id, {
      x: rx, y: ry, w: 0.4, h: 0.4,
      fontSize: 7, fontFace: bodyFont, color: C.white, bold: true,
      align: "center", valign: "middle", isTextBox: true, margin: 0,
    });
  });
}

// =========== SLIDE 16: Process Model ===========
{
  const s = addLightSlide(pres, "Process Model: Customer Onboarding");
  addSlideNumber(s, 16);

  const steps = [
    { label: "Start", shape: "ellipse", x: 0.4, y: 2.5, w: 0.9, h: 0.55, fill: C.green },
    { label: "Submit\nApplication", shape: "rect", x: 1.6, y: 2.35, w: 1.2, h: 0.85, fill: C.teal },
    { label: "Validate\nIdentity", shape: "rect", x: 3.1, y: 2.35, w: 1.2, h: 0.85, fill: C.teal },
    { label: "KYC\nPassed?", shape: "diamond", x: 4.55, y: 2.2, w: 1.2, h: 1.15, fill: C.yellow },
    { label: "Create\nAccount", shape: "rect", x: 6.05, y: 2.35, w: 1.2, h: 0.85, fill: C.teal },
    { label: "Notify\nCustomer", shape: "rect", x: 7.55, y: 2.35, w: 1.2, h: 0.85, fill: C.teal },
    { label: "End", shape: "ellipse", x: 9.0, y: 2.5, w: 0.7, h: 0.55, fill: C.red },
  ];

  steps.forEach((st) => {
    const shapeType = st.shape === "ellipse" ? pres.ShapeType.ellipse :
      st.shape === "diamond" ? pres.ShapeType.diamond : pres.ShapeType.roundRect;
    s.addShape(shapeType, {
      x: st.x, y: st.y, w: st.w, h: st.h,
      fill: { color: st.fill },
      rectRadius: st.shape === "rect" ? 0.08 : undefined,
    });
    s.addText(st.label, {
      x: st.x, y: st.y, w: st.w, h: st.h,
      fontSize: 9, fontFace: bodyFont, color: st.fill === C.yellow ? C.darkText : C.white,
      bold: true, align: "center", valign: "middle", isTextBox: true, margin: 0,
      lineSpacingMultiple: 0.95,
    });
  });

  // No path
  s.addShape(pres.ShapeType.roundRect, {
    x: 3.8, y: 3.8, w: 1.6, h: 0.65,
    fill: { color: C.orange }, rectRadius: 0.08,
  });
  s.addText("Request Add'l\nDocuments", {
    x: 3.8, y: 3.8, w: 1.6, h: 0.65,
    fontSize: 9, fontFace: bodyFont, color: C.white, bold: true,
    align: "center", valign: "middle", isTextBox: true, margin: 0,
    lineSpacingMultiple: 0.95,
  });

  // Labels
  s.addText("Yes →", {
    x: 5.55, y: 2.05, w: 0.5, h: 0.3,
    fontSize: 8, fontFace: bodyFont, color: C.green, bold: true,
    isTextBox: true, margin: 0,
  });
  s.addText("No ↓", {
    x: 4.85, y: 3.35, w: 0.5, h: 0.3,
    fontSize: 8, fontFace: bodyFont, color: C.red, bold: true,
    isTextBox: true, margin: 0,
  });

  // Components
  s.addText("Key Components: Application Portal  |  Identity Verification  |  KYC Engine  |  Account Management  |  Notification Service", {
    x: 0.6, y: 4.8, w: 8.8, h: 0.35,
    fontSize: 9, fontFace: bodyFont, color: C.midGray, italic: true,
    align: "center", isTextBox: true, margin: 0,
  });
}

// =========== SLIDE 17: System Design - DFD ===========
{
  const s = addLightSlide(pres, "System Design: Data Flow Diagram (Level 0)");
  addSlideNumber(s, 17);

  // External entities - left
  const entities = [
    { label: "Customer", y: 1.5 },
    { label: "Credit Bureau", y: 3.0 },
    { label: "Payment Gateway", y: 4.3 },
  ];
  entities.forEach((e) => {
    s.addShape(pres.ShapeType.rect, {
      x: 0.4, y: e.y, w: 1.5, h: 0.6,
      fill: { color: C.deepBlue },
    });
    s.addText(e.label, {
      x: 0.4, y: e.y, w: 1.5, h: 0.6,
      fontSize: 10, fontFace: bodyFont, color: C.white, bold: true,
      align: "center", valign: "middle", isTextBox: true, margin: 0,
    });
  });

  // Processes - center
  const processes = [
    { label: "Onboarding\nSystem", y: 1.5 },
    { label: "Transaction\nEngine", y: 3.0 },
    { label: "Loan\nProcessor", y: 4.3 },
  ];
  processes.forEach((p) => {
    s.addShape(pres.ShapeType.ellipse, {
      x: 3.6, y: p.y, w: 2.0, h: 0.8,
      fill: { color: C.teal },
    });
    s.addText(p.label, {
      x: 3.6, y: p.y, w: 2.0, h: 0.8,
      fontSize: 10, fontFace: bodyFont, color: C.white, bold: true,
      align: "center", valign: "middle", isTextBox: true, margin: 0,
      lineSpacingMultiple: 0.95,
    });
  });

  // Data stores - right
  const stores = [
    { label: "Customer DB", y: 1.5 },
    { label: "Transaction DB", y: 3.0 },
    { label: "Loan DB", y: 4.3 },
  ];
  stores.forEach((ds) => {
    s.addShape(pres.ShapeType.rect, {
      x: 7.5, y: ds.y, w: 1.8, h: 0.6,
      fill: { color: C.offWhite },
      line: { color: C.deepBlue, width: 1 },
    });
    // Top line for data store notation
    s.addShape(pres.ShapeType.line, {
      x: 7.5, y: ds.y, w: 1.8, h: 0,
      line: { color: C.deepBlue, width: 2 },
    });
    s.addText(ds.label, {
      x: 7.5, y: ds.y, w: 1.8, h: 0.6,
      fontSize: 10, fontFace: bodyFont, color: C.darkText, bold: true,
      align: "center", valign: "middle", isTextBox: true, margin: 0,
    });
  });

  // Flow arrows (horizontal lines)
  [1.75, 3.25, 4.55].forEach((y) => {
    s.addShape(pres.ShapeType.line, {
      x: 1.95, y, w: 1.6, h: 0,
      line: { color: C.midGray, width: 1.5 },
    });
    s.addShape(pres.ShapeType.line, {
      x: 5.65, y, w: 1.8, h: 0,
      line: { color: C.midGray, width: 1.5 },
    });
  });
}

// =========== SLIDE 18: System Architecture ===========
{
  const s = addLightSlide(pres, "System Architecture & Cloud Topology");
  addSlideNumber(s, 18);

  // Three tiers
  const tiers = [
    {
      title: "Presentation Layer", y: 1.35, h: 0.9, color: C.deepBlue,
      items: ["Web App", "Mobile App", "API Gateway"],
    },
    {
      title: "Application Layer", y: 2.45, h: 0.9, color: C.teal,
      items: ["Auth Service", "Onboarding Svc", "Transaction Svc", "Loan Service"],
    },
    {
      title: "Data Layer", y: 3.55, h: 0.9, color: C.navy,
      items: ["PostgreSQL", "Redis Cache", "Kafka MQ"],
    },
  ];

  tiers.forEach((t) => {
    s.addShape(pres.ShapeType.roundRect, {
      x: 0.4, y: t.y, w: 5.5, h: t.h,
      fill: { color: t.color }, rectRadius: 0.08,
    });
    s.addText(t.title, {
      x: 0.5, y: t.y + 0.05, w: 1.8, h: 0.3,
      fontSize: 10, fontFace: bodyFont, color: C.white, bold: true,
      isTextBox: true, margin: 0,
    });
    t.items.forEach((item, i) => {
      s.addShape(pres.ShapeType.roundRect, {
        x: 0.6 + i * 1.35, y: t.y + 0.4, w: 1.2, h: 0.4,
        fill: { color: C.white }, rectRadius: 0.06,
      });
      s.addText(item, {
        x: 0.6 + i * 1.35, y: t.y + 0.4, w: 1.2, h: 0.4,
        fontSize: 8, fontFace: bodyFont, color: C.darkText,
        align: "center", valign: "middle", isTextBox: true, margin: 0,
      });
    });
  });

  // Cloud topology - right side
  s.addShape(pres.ShapeType.roundRect, {
    x: 6.2, y: 1.35, w: 3.4, h: 3.1,
    fill: { color: C.offWhite },
    line: { color: C.deepBlue, width: 1, dashType: "dash" },
    rectRadius: 0.12,
  });
  s.addText("IBM Cloud", {
    x: 6.3, y: 1.4, w: 3.2, h: 0.3,
    fontSize: 11, fontFace: bodyFont, color: C.deepBlue, bold: true,
    isTextBox: true, margin: 0,
  });

  const cloudItems = [
    "Kubernetes Cluster", "Container Registry",
    "Load Balancer", "WAF",
    "Cloud Monitoring", "Cloud Logging",
  ];
  cloudItems.forEach((item, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    s.addShape(pres.ShapeType.roundRect, {
      x: 6.4 + col * 1.6, y: 1.85 + row * 0.8, w: 1.4, h: 0.55,
      fill: { color: C.white },
      line: { color: C.teal, width: 0.5 },
      rectRadius: 0.06,
    });
    s.addText(item, {
      x: 6.4 + col * 1.6, y: 1.85 + row * 0.8, w: 1.4, h: 0.55,
      fontSize: 8, fontFace: bodyFont, color: C.darkText,
      align: "center", valign: "middle", isTextBox: true, margin: 0,
    });
  });
}

// =========== SLIDE 19: PoC ===========
{
  const s = addLightSlide(pres, "Proof of Concept (PoC)");
  addSlideNumber(s, 19);

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

// =========== SLIDE 20: Database Design ===========
{
  const s = addLightSlide(pres, "Database Design");
  addSlideNumber(s, 20);

  // ERD entities
  const ents = [
    { label: "Customer\n─────────\nCustomerID (PK)\nName\nEmail\nPhone\nAddress", x: 0.4, y: 1.5, w: 1.9, h: 2.0 },
    { label: "Account\n─────────\nAccountID (PK)\nCustomerID (FK)\nType\nBalance\nStatus\nOpenDate", x: 2.8, y: 1.5, w: 1.9, h: 2.0 },
    { label: "Transaction\n─────────\nTransactionID (PK)\nAccountID (FK)\nAmount\nType\nDate\nStatus", x: 5.2, y: 1.5, w: 1.9, h: 2.0 },
    { label: "Loan\n─────────\nLoanID (PK)\nCustomerID (FK)\nAmount\nRate\nTerm\nStatus", x: 7.6, y: 1.5, w: 1.9, h: 2.0 },
  ];

  ents.forEach((e) => {
    s.addShape(pres.ShapeType.roundRect, {
      x: e.x, y: e.y, w: e.w, h: e.h,
      fill: { color: C.offWhite },
      line: { color: C.teal, width: 1.5 },
      rectRadius: 0.08,
    });
    s.addText(e.label, {
      x: e.x + 0.1, y: e.y + 0.1, w: e.w - 0.2, h: e.h - 0.2,
      fontSize: 8, fontFace: bodyFont, color: C.darkText,
      valign: "top", isTextBox: true, margin: 0, lineSpacingMultiple: 1.1,
    });
  });

  // Relationship labels
  s.addText("1:N →", {
    x: 2.3, y: 2.3, w: 0.5, h: 0.3,
    fontSize: 8, fontFace: bodyFont, color: C.deepBlue, bold: true,
    align: "center", isTextBox: true, margin: 0,
  });
  s.addText("1:N →", {
    x: 4.7, y: 2.3, w: 0.5, h: 0.3,
    fontSize: 8, fontFace: bodyFont, color: C.deepBlue, bold: true,
    align: "center", isTextBox: true, margin: 0,
  });
  s.addText("1:N →", {
    x: 7.1, y: 2.3, w: 0.5, h: 0.3,
    fontSize: 8, fontFace: bodyFont, color: C.deepBlue, bold: true,
    align: "center", isTextBox: true, margin: 0,
  });

  // Data dictionary
  const ddRows = [
    ["Field", "Type", "Length", "Nullable", "Description"],
    ["CustomerID", "INT", "11", "No", "Primary key, auto-increment"],
    ["Name", "VARCHAR", "100", "No", "Customer full name"],
    ["AccountID", "INT", "11", "No", "Primary key, auto-increment"],
    ["Balance", "DECIMAL", "15,2", "No", "Current account balance"],
    ["TransactionID", "INT", "11", "No", "Primary key, auto-increment"],
  ];

  s.addText("Data Dictionary", {
    x: 0.6, y: 3.7, w: 3, h: 0.3,
    fontSize: 11, fontFace: bodyFont, color: C.deepBlue, bold: true,
    isTextBox: true, margin: 0,
  });

  s.addTable(ddRows, {
    x: 0.6, y: 4.0, w: 8.8,
    fontSize: 8, fontFace: bodyFont, color: C.darkText,
    border: { type: "solid", pt: 0.5, color: C.lightGray },
    colW: [1.4, 1.2, 0.8, 0.8, 4.6],
    rowH: 0.25,
    autoPage: false,
    rowProps: ddRows.map((_, i) => ({
      fill: i === 0 ? C.navy : i % 2 === 1 ? C.offWhite : C.white,
      color: i === 0 ? C.white : C.darkText,
      bold: i === 0,
    })),
  });
}

// =========== SLIDE 21: Test Plan & TDD/BDD ===========
{
  const s = addLightSlide(pres, "Test Plan & Test Cases (TDD/BDD)");
  addSlideNumber(s, 21);

  // Test plan table
  const tpRows = [
    ["Element", "Details"],
    ["Scope", "All microservices and integration points"],
    ["Purpose", "Validate functional and non-functional requirements"],
    ["Objectives", "100% critical path coverage; performance benchmarks met"],
    ["Approach", "TDD for unit tests; BDD for acceptance tests"],
    ["Environment", "Staging cluster mirroring production"],
  ];

  s.addTable(tpRows, {
    x: 0.6, y: 1.35, w: 4.3,
    fontSize: 9, fontFace: bodyFont, color: C.darkText,
    border: { type: "solid", pt: 0.5, color: C.lightGray },
    colW: [1.2, 3.1],
    rowH: 0.35,
    autoPage: false,
    rowProps: tpRows.map((_, i) => ({
      fill: i === 0 ? C.navy : i % 2 === 1 ? C.offWhite : C.white,
      color: i === 0 ? C.white : C.darkText,
      bold: i === 0,
    })),
  });

  // TDD example
  s.addShape(pres.ShapeType.roundRect, {
    x: 5.2, y: 1.35, w: 4.3, h: 1.5,
    fill: { color: C.offWhite }, rectRadius: 0.08,
  });
  s.addText("TDD Example", {
    x: 5.4, y: 1.4, w: 3.9, h: 0.3,
    fontSize: 10, fontFace: bodyFont, color: C.deepBlue, bold: true,
    isTextBox: true, margin: 0,
  });
  s.addText("def test_account_creation():\n    account = create_account(valid_data)\n    assert account.status == \"ACTIVE\"\n    assert account.id is not None", {
    x: 5.4, y: 1.75, w: 3.9, h: 1.0,
    fontSize: 8, fontFace: "Courier New", color: C.darkText,
    isTextBox: true, margin: 0, lineSpacingMultiple: 1.3,
  });

  // BDD example
  s.addShape(pres.ShapeType.roundRect, {
    x: 0.6, y: 3.6, w: 8.8, h: 1.8,
    fill: { color: C.lightTeal }, rectRadius: 0.08,
  });
  s.addText("BDD Scenario (Gherkin)", {
    x: 0.8, y: 3.65, w: 8.4, h: 0.3,
    fontSize: 10, fontFace: bodyFont, color: C.deepBlue, bold: true,
    isTextBox: true, margin: 0,
  });
  s.addText("Feature: Customer Onboarding\n  Scenario: Successful account creation\n    Given a customer provides valid KYC documents\n    When they submit the onboarding form\n    Then an account is created within 10 minutes\n    And a confirmation email is sent", {
    x: 0.8, y: 4.0, w: 8.4, h: 1.3,
    fontSize: 9, fontFace: "Courier New", color: C.darkText,
    isTextBox: true, margin: 0, lineSpacingMultiple: 1.3,
  });
}

// =========== SLIDE 22: CI/CD ===========
{
  const s = addLightSlide(pres, "CI/CD Workflow & Monitoring Plan");
  addSlideNumber(s, 22);

  // CI Pipeline
  s.addText("CI WORKFLOW", {
    x: 0.6, y: 1.35, w: 3, h: 0.3,
    fontSize: 11, fontFace: bodyFont, color: C.deepBlue, bold: true,
    isTextBox: true, margin: 0,
  });
  const ciSteps = ["Code\nCommit", "Build", "Unit\nTests", "Code\nAnalysis", "Artifact\nRegistry"];
  ciSteps.forEach((step, i) => {
    s.addShape(pres.ShapeType.roundRect, {
      x: 0.6 + i * 1.8, y: 1.7, w: 1.5, h: 0.7,
      fill: { color: C.teal }, rectRadius: 0.08,
    });
    s.addText(step, {
      x: 0.6 + i * 1.8, y: 1.7, w: 1.5, h: 0.7,
      fontSize: 9, fontFace: bodyFont, color: C.white, bold: true,
      align: "center", valign: "middle", isTextBox: true, margin: 0,
      lineSpacingMultiple: 0.95,
    });
    if (i < ciSteps.length - 1) {
      s.addText("→", {
        x: 2.1 + i * 1.8, y: 1.85, w: 0.3, h: 0.4,
        fontSize: 16, fontFace: bodyFont, color: C.midGray,
        align: "center", isTextBox: true, margin: 0,
      });
    }
  });

  // CD Pipeline
  s.addText("CD PIPELINE", {
    x: 0.6, y: 2.65, w: 3, h: 0.3,
    fontSize: 11, fontFace: bodyFont, color: C.deepBlue, bold: true,
    isTextBox: true, margin: 0,
  });
  const cdSteps = ["Staging\nDeploy", "Integration\nTests", "Approval\nGate", "Production\nDeploy", "Smoke\nTests"];
  cdSteps.forEach((step, i) => {
    s.addShape(pres.ShapeType.roundRect, {
      x: 0.6 + i * 1.8, y: 3.0, w: 1.5, h: 0.7,
      fill: { color: C.deepBlue }, rectRadius: 0.08,
    });
    s.addText(step, {
      x: 0.6 + i * 1.8, y: 3.0, w: 1.5, h: 0.7,
      fontSize: 9, fontFace: bodyFont, color: C.white, bold: true,
      align: "center", valign: "middle", isTextBox: true, margin: 0,
      lineSpacingMultiple: 0.95,
    });
    if (i < cdSteps.length - 1) {
      s.addText("→", {
        x: 2.1 + i * 1.8, y: 3.15, w: 0.3, h: 0.4,
        fontSize: 16, fontFace: bodyFont, color: C.midGray,
        align: "center", isTextBox: true, margin: 0,
      });
    }
  });

  // Monitoring
  s.addText("MONITORING FRAMEWORK", {
    x: 0.6, y: 4.0, w: 4, h: 0.3,
    fontSize: 11, fontFace: bodyFont, color: C.deepBlue, bold: true,
    isTextBox: true, margin: 0,
  });
  const monItems = [
    { label: "Prometheus", desc: "Metrics collection" },
    { label: "Grafana", desc: "Dashboards" },
    { label: "ELK Stack", desc: "Log aggregation" },
    { label: "PagerDuty", desc: "Alerting" },
  ];
  monItems.forEach((m, i) => {
    s.addShape(pres.ShapeType.roundRect, {
      x: 0.6 + i * 2.3, y: 4.35, w: 2.0, h: 0.85,
      fill: { color: C.offWhite }, rectRadius: 0.08,
    });
    s.addText(m.label, {
      x: 0.6 + i * 2.3, y: 4.4, w: 2.0, h: 0.35,
      fontSize: 11, fontFace: bodyFont, color: C.navy, bold: true,
      align: "center", isTextBox: true, margin: 0,
    });
    s.addText(m.desc, {
      x: 0.6 + i * 2.3, y: 4.75, w: 2.0, h: 0.35,
      fontSize: 9, fontFace: bodyFont, color: C.midGray,
      align: "center", isTextBox: true, margin: 0,
    });
  });
}

// =========== SLIDE 23: Key Findings ===========
{
  const s = addLightSlide(pres, "Key Findings");
  addSlideNumber(s, 23);

  const findings = [
    {
      num: "1", stat: "300%",
      title: "Onboarding Time Overhead",
      desc: "Legacy systems increase onboarding time by 300% compared to industry benchmarks due to manual data entry and paper-based verification.",
    },
    {
      num: "2", stat: "45 min",
      title: "Incident Detection Delay",
      desc: "Lack of real-time monitoring means average incident detection takes 45 minutes, well above the 5-minute industry target.",
    },
    {
      num: "3", stat: "23%",
      title: "Resource Waste",
      desc: "Current monolithic architecture prevents independent scaling, causing 23% resource waste during off-peak hours.",
    },
  ];

  findings.forEach((f, i) => {
    const y = 1.4 + i * 1.3;
    s.addShape(pres.ShapeType.roundRect, {
      x: 0.6, y, w: 8.8, h: 1.1,
      fill: { color: C.offWhite }, rectRadius: 0.1,
    });
    // Stat box
    s.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: y + 0.15, w: 1.5, h: 0.8,
      fill: { color: C.deepBlue }, rectRadius: 0.08,
    });
    s.addText(f.stat, {
      x: 0.8, y: y + 0.15, w: 1.5, h: 0.8,
      fontSize: 24, fontFace: titleFont, color: C.white, bold: true,
      align: "center", valign: "middle", isTextBox: true, margin: 0,
    });
    s.addText(f.title, {
      x: 2.5, y: y + 0.1, w: 6.7, h: 0.35,
      fontSize: 14, fontFace: bodyFont, color: C.navy, bold: true,
      isTextBox: true, margin: 0,
    });
    s.addText(f.desc, {
      x: 2.5, y: y + 0.45, w: 6.7, h: 0.55,
      fontSize: 11, fontFace: bodyFont, color: C.darkText,
      isTextBox: true, margin: 0,
    });
  });
}

// =========== SLIDE 24: Key Recommendations ===========
{
  const s = addLightSlide(pres, "Key Recommendations");
  addSlideNumber(s, 24);

  const recs = [
    {
      title: "Adopt Microservices Architecture",
      desc: "Enable independent deployment and scaling of each banking service for greater agility.",
    },
    {
      title: "Implement Event-Driven Architecture",
      desc: "Use Kafka for real-time transaction processing and fraud detection across all channels.",
    },
    {
      title: "Deploy CI/CD Pipeline",
      desc: "Automated testing and deployment to reduce release cycles from monthly to weekly.",
    },
    {
      title: "Establish Centralized Monitoring",
      desc: "Prometheus and Grafana to achieve sub-5-minute incident detection and response.",
    },
  ];

  recs.forEach((r, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.6 + col * 4.6;
    const y = 1.4 + row * 2.0;

    s.addShape(pres.ShapeType.roundRect, {
      x, y, w: 4.2, h: 1.7,
      fill: { color: C.offWhite }, rectRadius: 0.1,
    });
    s.addShape(pres.ShapeType.ellipse, {
      x: x + 0.15, y: y + 0.15, w: 0.45, h: 0.45,
      fill: { color: C.teal },
    });
    s.addText(String(i + 1), {
      x: x + 0.15, y: y + 0.15, w: 0.45, h: 0.45,
      fontSize: 16, fontFace: bodyFont, color: C.white, bold: true,
      align: "center", valign: "middle", isTextBox: true, margin: 0,
    });
    s.addText(r.title, {
      x: x + 0.75, y: y + 0.15, w: 3.25, h: 0.45,
      fontSize: 13, fontFace: bodyFont, color: C.navy, bold: true,
      valign: "middle", isTextBox: true, margin: 0,
    });
    s.addText(r.desc, {
      x: x + 0.2, y: y + 0.75, w: 3.8, h: 0.75,
      fontSize: 11, fontFace: bodyFont, color: C.darkText,
      isTextBox: true, margin: 0,
    });
  });
}

// =========== SLIDE 25: Conclusion ===========
{
  const s = addDarkSlide(pres);
  addSlideNumber(s, 25);

  s.addText("Conclusion", {
    x: 0.6, y: 0.8, w: 8.8, h: 0.7,
    fontSize: 36, fontFace: titleFont, color: C.white, bold: true,
    isTextBox: true, margin: 0,
  });
  s.addShape(pres.ShapeType.rect, {
    x: 0.6, y: 1.5, w: 1.5, h: 0.05,
    fill: { color: C.accent },
  });

  const conclusions = [
    "The modernization initiative addresses critical operational inefficiencies in ABC Bank's digital infrastructure.",
    "Cloud-native microservices architecture provides the scalability and resilience needed for modern banking.",
    "Phased implementation minimizes risk while delivering incremental business value.",
    "Success depends on stakeholder alignment, robust testing, and continuous monitoring post-deployment.",
  ];

  conclusions.forEach((c, i) => {
    s.addShape(pres.ShapeType.ellipse, {
      x: 0.6, y: 1.9 + i * 0.85, w: 0.3, h: 0.3,
      fill: { color: C.teal },
    });
    s.addText(String(i + 1), {
      x: 0.6, y: 1.9 + i * 0.85, w: 0.3, h: 0.3,
      fontSize: 11, fontFace: bodyFont, color: C.white, bold: true,
      align: "center", valign: "middle", isTextBox: true, margin: 0,
    });
    s.addText(c, {
      x: 1.1, y: 1.85 + i * 0.85, w: 8.0, h: 0.55,
      fontSize: 14, fontFace: bodyFont, color: C.white,
      valign: "middle", isTextBox: true, margin: 0,
    });
  });
}

// =========== SLIDE 26: Appendix ===========
{
  const s = addLightSlide(pres, "Appendix");
  addSlideNumber(s, 26);

  s.addText("REFERENCES", {
    x: 0.6, y: 1.4, w: 4, h: 0.3,
    fontSize: 11, fontFace: bodyFont, color: C.deepBlue, bold: true,
    isTextBox: true, margin: 0,
  });
  s.addText([
    { text: "IBM Cloud Documentation (2024)", options: { bullet: true, breakLine: true, fontSize: 12, fontFace: bodyFont, color: C.darkText } },
    { text: "TOGAF Architecture Framework v10", options: { bullet: true, breakLine: true, fontSize: 12, fontFace: bodyFont, color: C.darkText } },
    { text: "PCI-DSS Compliance Guide v4.0", options: { bullet: true, breakLine: true, fontSize: 12, fontFace: bodyFont, color: C.darkText } },
    { text: "OWASP Security Testing Guide v4.2", options: { bullet: true, fontSize: 12, fontFace: bodyFont, color: C.darkText } },
  ], {
    x: 0.6, y: 1.75, w: 4.2, h: 1.4,
    isTextBox: true, margin: 0, paraSpaceAfter: 6,
  });

  s.addText("TOOLS USED", {
    x: 5.2, y: 1.4, w: 4, h: 0.3,
    fontSize: 11, fontFace: bodyFont, color: C.deepBlue, bold: true,
    isTextBox: true, margin: 0,
  });
  s.addText([
    { text: "Draw.io for UML and process diagrams", options: { bullet: true, breakLine: true, fontSize: 12, fontFace: bodyFont, color: C.darkText } },
    { text: "Jira for project tracking and RTM", options: { bullet: true, breakLine: true, fontSize: 12, fontFace: bodyFont, color: C.darkText } },
    { text: "Jenkins for CI/CD pipeline automation", options: { bullet: true, breakLine: true, fontSize: 12, fontFace: bodyFont, color: C.darkText } },
    { text: "Prometheus/Grafana for monitoring", options: { bullet: true, fontSize: 12, fontFace: bodyFont, color: C.darkText } },
  ], {
    x: 5.2, y: 1.75, w: 4.2, h: 1.4,
    isTextBox: true, margin: 0, paraSpaceAfter: 6,
  });

  s.addText("SUPPORTING MATERIALS", {
    x: 0.6, y: 3.4, w: 8, h: 0.3,
    fontSize: 11, fontFace: bodyFont, color: C.deepBlue, bold: true,
    isTextBox: true, margin: 0,
  });
  s.addText([
    { text: "Detailed API specifications available in project repository", options: { bullet: true, breakLine: true, fontSize: 12, fontFace: bodyFont, color: C.darkText } },
    { text: "Full stakeholder interview transcripts and meeting notes", options: { bullet: true, breakLine: true, fontSize: 12, fontFace: bodyFont, color: C.darkText } },
    { text: "Complete test execution reports and defect logs", options: { bullet: true, fontSize: 12, fontFace: bodyFont, color: C.darkText } },
  ], {
    x: 0.6, y: 3.75, w: 8.8, h: 1.0,
    isTextBox: true, margin: 0, paraSpaceAfter: 6,
  });
}

// Generate
pres.writeFile({ fileName: "/home/user/Artist/FinalSubmission.pptx" })
  .then(() => console.log("Done: FinalSubmission.pptx"))
  .catch((err) => console.error(err));
