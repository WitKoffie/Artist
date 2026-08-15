#!/usr/bin/env python3
"""
Henri Le Riche — 4-Page Professional CV
Design Philosophy: Structural Current
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import Color, HexColor
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

FONT_DIR = "/root/.claude/skills/synced/canvas-design/canvas-fonts"
pdfmetrics.registerFont(TTFont("Jura-Light", f"{FONT_DIR}/Jura-Light.ttf"))
pdfmetrics.registerFont(TTFont("Jura-Medium", f"{FONT_DIR}/Jura-Medium.ttf"))
pdfmetrics.registerFont(TTFont("InstrumentSans", f"{FONT_DIR}/InstrumentSans-Regular.ttf"))
pdfmetrics.registerFont(TTFont("InstrumentSans-Bold", f"{FONT_DIR}/InstrumentSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont("InstrumentSans-Italic", f"{FONT_DIR}/InstrumentSans-Italic.ttf"))
pdfmetrics.registerFont(TTFont("DMMono", f"{FONT_DIR}/DMMono-Regular.ttf"))

W, H = A4
OUT = "/home/user/Artist/henri-leriche-cv-full.pdf"

DARK = HexColor("#1A1D23")
SLATE = HexColor("#2E3340")
GRAPHITE = HexColor("#4A4F5C")
STEEL = HexColor("#6B7280")
SILVER = HexColor("#9CA3AF")
LIGHT = HexColor("#E8EAED")
PAPER = HexColor("#F5F6F8")
ACCENT = HexColor("#2563EB")
ACCENT_LIGHT = HexColor("#DBEAFE")
ACCENT_FAINT = HexColor("#EFF6FF")
WHITE = HexColor("#FFFFFF")

ML = 22 * mm
MR = 20 * mm
MT = 20 * mm
MB = 16 * mm
CW = W - ML - MR


def wrap_text(text, font, size, max_width):
    words = text.split()
    lines, current = [], ""
    for word in words:
        test = current + (" " if current else "") + word
        if pdfmetrics.stringWidth(test, font, size) <= max_width:
            current = test
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_text_block(c, x, y, text, font, size, color, max_width, leading=None):
    if leading is None:
        leading = size * 1.45
    c.setFont(font, size)
    c.setFillColor(color)
    for line in wrap_text(text, font, size, max_width):
        c.drawString(x, y, line)
        y -= leading
    return y


def draw_bullet(c, x, y, text, font, size, color, max_width, leading=None):
    if leading is None:
        leading = size * 1.35
    indent = 5.5 * mm
    c.setFont("DMMono", size - 0.5)
    c.setFillColor(ACCENT)
    c.drawString(x, y, "—")
    c.setFont(font, size)
    c.setFillColor(color)
    for line in wrap_text(text, font, size, max_width - indent):
        c.drawString(x + indent, y, line)
        y -= leading
    return y


def section_header(c, x, y, label, width):
    c.setFillColor(DARK)
    c.rect(x, y - 1 * mm, width, 6.5 * mm, fill=1, stroke=0)
    c.setFont("DMMono", 6)
    c.setFillColor(WHITE)
    c.drawString(x + 3 * mm, y + 0.8 * mm, label)
    return y - 10


def subsection_header(c, x, y, label, width):
    c.setFont("DMMono", 5.5)
    c.setFillColor(STEEL)
    c.drawString(x, y, label)
    y -= 2
    c.setStrokeColor(HexColor("#D1D5DB"))
    c.setLineWidth(0.3)
    c.line(x, y, x + width, y)
    return y - 7


def draw_page_background(c, page_num, total_pages):
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    c.saveState()
    c.setStrokeColor(HexColor("#EBEDF0"))
    c.setLineWidth(0.1)
    for gx in range(int(10 * mm), int(W), int(10 * mm)):
        c.line(gx, 0, gx, H)
    for gy in range(int(10 * mm), int(H), int(10 * mm)):
        c.line(0, gy, W, gy)
    c.restoreState()

    c.setFillColor(ACCENT)
    c.rect(0, 0, W, 1.5 * mm, fill=1, stroke=0)
    c.setFillColor(ACCENT)
    c.rect(0, 0, 2.5 * mm, H, fill=1, stroke=0)

    c.saveState()
    c.setFont("DMMono", 5)
    c.setFillColor(STEEL)
    c.drawRightString(W - MR, MB - 6 * mm, f"{page_num} / {total_pages}")
    c.setFont("InstrumentSans", 5.5)
    c.setFillColor(HexColor("#C8CCD2"))
    c.drawString(ML, MB - 6 * mm, "HENRI LE RICHE — SENIOR SOLUTIONS ARCHITECT")
    c.restoreState()


def draw_page1_header(c):
    c.setFillColor(DARK)
    c.rect(0, H - 52 * mm, W, 52 * mm, fill=1, stroke=0)

    c.saveState()
    c.setStrokeColor(Color(1, 1, 1, alpha=0.025))
    c.setLineWidth(0.15)
    for gx in range(0, int(W), int(5 * mm)):
        c.line(gx, H - 52 * mm, gx, H)
    for gy in range(int(H - 52 * mm), int(H), int(5 * mm)):
        c.line(0, gy, W, gy)
    c.restoreState()

    c.setFillColor(ACCENT)
    c.rect(0, H - 52 * mm, W, 1.5 * mm, fill=1, stroke=0)

    y = H - 18 * mm
    c.setFillColor(WHITE)
    c.setFont("Jura-Light", 32)
    c.drawString(ML, y, "HENRI")
    name_w = pdfmetrics.stringWidth("HENRI", "Jura-Light", 32)
    c.setFont("Jura-Medium", 32)
    c.drawString(ML + name_w + 4 * mm, y, "LE RICHE")

    y -= 14
    c.setStrokeColor(ACCENT)
    c.setLineWidth(0.8)
    c.line(ML, y, ML + 60 * mm, y)

    y -= 12
    c.setFillColor(ACCENT_LIGHT)
    c.setFont("DMMono", 7)
    c.drawString(ML, y, "SENIOR SOLUTIONS ARCHITECT")

    cy = H - 18 * mm
    c.setFont("InstrumentSans", 7)
    c.setFillColor(SILVER)
    c.drawRightString(W - MR, cy, "London, United Kingdom")
    cy -= 10
    c.drawRightString(W - MR, cy, "henri.leriche@outlook.com")
    cy -= 10
    c.drawRightString(W - MR, cy, "+44 7376 783718")
    cy -= 10
    c.setFont("DMMono", 6)
    c.setFillColor(HexColor("#6B7280"))
    c.drawRightString(W - MR, cy, "IEEE SENIOR MEMBER · MBA")

    c.saveState()
    c.setFillColor(HexColor("#4A4F5C"))
    c.setFont("DMMono", 4)
    c.drawRightString(W - MR, H - 6 * mm, "51.5074°N  0.1278°W")
    c.restoreState()


def draw_metric_strip(c, y):
    metrics = [
        ("18", "PROJECTS\nARCHITECTED"),
        ("3M+", "PLATFORM\nUSERS"),
        ("£150M+", "PROGRAMME\nBUDGETS"),
        ("99.95%", "UPTIME\nSTANDARD"),
        ("28M+", "HOUSEHOLDS\nSERVED"),
    ]
    card_gap = 3 * mm
    card_w = (CW - card_gap * 4) / 5
    card_h = 16 * mm

    for i, (val, lbl) in enumerate(metrics):
        cx = ML + i * (card_w + card_gap)
        c.setFillColor(ACCENT_FAINT)
        c.roundRect(cx, y - card_h + 4 * mm, card_w, card_h, 1.5 * mm, fill=1, stroke=0)
        c.setStrokeColor(HexColor("#BFDBFE"))
        c.setLineWidth(0.4)
        c.roundRect(cx, y - card_h + 4 * mm, card_w, card_h, 1.5 * mm, fill=0, stroke=1)

        c.setFont("Jura-Medium", 13)
        c.setFillColor(ACCENT)
        c.drawCentredString(cx + card_w / 2, y - 2 * mm, val)

        c.setFont("DMMono", 3.8)
        c.setFillColor(STEEL)
        lines = wrap_text(lbl, "DMMono", 3.8, card_w - 4 * mm)
        ly = y - card_h + 7 * mm
        for line in lines:
            c.drawCentredString(cx + card_w / 2, ly, line)
            ly -= 5

    return y - card_h - 3 * mm


def draw_project_entry(c, y, title, dates, role, description, font_size=6.8, leading=9.2):
    c.setFont("InstrumentSans-Bold", 7.5)
    c.setFillColor(DARK)
    c.drawString(ML, y, title)
    c.setFont("DMMono", 5.5)
    c.setFillColor(STEEL)
    c.drawRightString(W - MR, y, dates)
    y -= 9

    c.setFont("InstrumentSans-Italic", 6.2)
    c.setFillColor(ACCENT)
    c.drawString(ML, y, role)
    y -= 9

    y = draw_text_block(c, ML, y, description, "InstrumentSans", font_size, GRAPHITE, CW, leading)
    return y


def draw_role_header(c, y, title, org, location, dates):
    c.setFont("InstrumentSans-Bold", 8.5)
    c.setFillColor(DARK)
    c.drawString(ML, y, title)
    y -= 10
    c.setFont("InstrumentSans", 7)
    c.setFillColor(ACCENT)
    c.drawString(ML, y, f"{org} — {location}")
    c.setFont("DMMono", 5.5)
    c.setFillColor(STEEL)
    c.drawRightString(W - MR, y, dates)
    y -= 10
    return y


def build_cv():
    c = canvas.Canvas(OUT, pagesize=A4)
    c.setTitle("Henri Le Riche — Senior Solutions Architect CV")
    c.setAuthor("Henri Le Riche")

    TOTAL_PAGES = 4

    # ================================================================
    # PAGE 1
    # ================================================================
    draw_page_background(c, 1, TOTAL_PAGES)
    draw_page1_header(c)

    y = H - 57 * mm

    y = section_header(c, ML, y, "PROFESSIONAL SUMMARY", CW)
    y -= 1

    p1 = "Enterprise architect and digital transformation leader with extensive progressive experience spanning solution architecture, business analysis, project management, and technical delivery across government, defence, healthcare, telecommunications, and media sectors. Currently serving as Senior Solutions Architect at the Office of Gas and Electricity Markets (Ofgem), the UK's independent energy regulator, where I design and assure scalable, secure digital infrastructure supporting critical energy systems serving 3M+ direct platform users across 28M+ households."
    y = draw_text_block(c, ML, y, p1, "InstrumentSans", 7.5, GRAPHITE, CW, 10)
    y -= 1

    p2 = "Architect of record on 18 projects since 2021, spanning end-to-end solution design, enterprise data platform strategy, AI-enabled tooling, inter-departmental secure file transfer, and business continuity digitisation. Published researcher with peer-accessible papers on energy-sector enterprise architecture, human rights documentation infrastructure, and comparative regulatory analysis. IEEE Senior Member. MBA-qualified with deep expertise in TOGAF, ArchiMate, Microsoft Azure, GDS Standards, and UK Government security frameworks."
    y = draw_text_block(c, ML, y, p2, "InstrumentSans", 7.5, GRAPHITE, CW, 10)
    y -= 1

    p3 = "Strengths include translating complex business requirements into practical, assured solution architectures; bridging technical detail with strategic intent for senior stakeholders; and maintaining architectural coherence across multi-project portfolios. People-oriented leader who values collaborative, respectful working environments."
    y = draw_text_block(c, ML, y, p3, "InstrumentSans", 7.5, GRAPHITE, CW, 10)

    y -= 5
    y = draw_metric_strip(c, y)

    y -= 2
    y = section_header(c, ML, y, "PROFESSIONAL EXPERIENCE", CW)
    y -= 1

    c.setFont("InstrumentSans-Bold", 9)
    c.setFillColor(DARK)
    c.drawString(ML, y, "Senior Solutions Architect")
    y -= 10

    c.setFont("InstrumentSans", 7)
    c.setFillColor(ACCENT)
    c.drawString(ML, y, "Office of Gas and Electricity Markets (Ofgem)")
    c.setFont("DMMono", 5.5)
    c.setFillColor(STEEL)
    c.drawRightString(W - MR, y, "August 2021 – Present")
    y -= 8

    c.setFont("InstrumentSans-Italic", 5.8)
    c.setFillColor(GRAPHITE)
    c.drawString(ML, y, "Grade Level 2A · Full-Time Permanent · Digital, Data, Security and Sustainability (DDSS) Directorate")
    y -= 8

    y = draw_text_block(c, ML, y, "Ofgem is the United Kingdom's independent energy regulator responsible for gas and electricity markets. I serve as technical architect within the DDSS division, accountable for solution architecture design, technical governance, and stakeholder engagement across the organisation.",
                       "InstrumentSans", 7.2, GRAPHITE, CW, 9.5)
    y -= 3

    responsibilities = [
        "Solution architecture design, documentation, and peer review on assigned projects (30% of role)",
        "Technical ownership and stakeholder engagement with Heads of Delivery, Product Owners, Enterprise Architects, Programme Managers, and vendors (30%)",
        "Collaboration with delivery teams ensuring technical feasibility, alignment, and coherence across projects (20%)",
        "Governance and assurance of standards and compliance (GDS, ISO 27001, GDPR); continuous improvement including AI and data platform governance (20%)",
    ]

    for resp in responsibilities:
        y = draw_bullet(c, ML, y, resp, "InstrumentSans", 6.8, GRAPHITE, CW, 8.8)

    y -= 6 * mm
    y = section_header(c, ML, y, "KEY SOLUTION ARCHITECTURE PROJECTS (2024–2026)", CW)
    y -= 1

    sa_projects_p1 = [
        ("Synapse Replacement / Enterprise Data Platform", "Feb–Jul 2026", "Solution Architect",
         "Led HLD review, current-state and requirements analysis, platform sizing, technical capability comparisons, and options/business-case material for replacing or evolving the Synapse-based enterprise data platform. Delivered handover package enabling Project 533 completion."),

        ("Power BI External Sharing with DESNZ", "Dec 2025–Apr 2026", "Solution Architect",
         "Ran discovery workshops, requirements and access governance, licensing/cost options analysis, managed group and approval discussions, and architecture/TDA support for controlled external sharing of Power BI reports with the Department for Energy Security and Net Zero."),

        ("Enable Power BI Publish to Web", "Sep 2025–Mar 2026", "Architecture/Assurance Contributor",
         "Participated in security, privacy, and operational-readiness review for establishing a governed process for publicly publishing selected Power BI reports. GO decision recorded at go-live review on 12 March 2026."),

        ("AI-Driven Social Listening Tool", "Feb–Jul 2025", "Solution Architect",
         "Delivered solution architecture, architecture content for TDA, governance and security coordination, and technical feasibility assessment for an AI-powered monitoring and sentiment analysis tool for energy-sector consumer insight. Concept approved at TDA288; supplier onboarding and further design work identified."),

        ("8x8 and Crezovi Integration", "May–Jun 2025", "Solution Architect/Assurance Contributor",
         "Managed supplier technical questions covering data-flow, identity, security, retention, cost, and exit considerations for telephony platform integration. Facilitated Vanta Trust Center assurance access for supplier due diligence."),
    ]

    for title, dates, role, desc in sa_projects_p1:
        y = draw_project_entry(c, y, title, dates, role, desc, 8.8, 12.2)
        y -= 10

    c.showPage()

    # ================================================================
    # PAGE 2 — Remaining SA Projects + All BA Projects
    # ================================================================
    draw_page_background(c, 2, TOTAL_PAGES)
    y = H - MT

    y = section_header(c, ML, y, "SOLUTION ARCHITECTURE PROJECTS (CONTINUED)", CW)
    y -= 2

    sa_projects_p2 = [
        ("DWP-Ofgem Secure File Transfer / SFTE", "Jun 2024–Jul 2025", "Solution Architecture & Technical Coordination",
         "Designed options and security assessment, storage-account design notes, testing coordination, and network whitelist information for secure bi-directional file exchange supporting DWP and Ofgem processes. Successful bi-directional end-to-end test recorded 9–10 April 2025."),

        ("Vivup Employee Benefits Platform", "Aug 2024–Aug 2025", "Technical Evaluation & Solution Support",
         "Led tender/presentation evaluation, security and SSO considerations, joiners/leavers process questions, logging and monitoring discussions, and implementation support for procurement, onboarding, and assurance of the employee benefits platform."),

        ("Digital Mail / Inbound Digitisation / Hybrid Mail", "Feb–Oct 2024", "Business & Solution Support",
         "Managed supplier workshops, SSO requirement and change request, service definition review, TDA material, and technical/operational coordination for SPS-supported inbound physical mail digitisation and outbound hybrid mail. Delivered baseline service definition and approved SSO change request."),

        ("AI Transcription / Data Ethics Assessment", "Jan 2025", "Governance Contributor",
         "Worked with assessment covering data sources, processing, transparency, accountability, fairness, risks, and harms for AI transcription processing."),
    ]

    for title, dates, role, desc in sa_projects_p2:
        y = draw_project_entry(c, y, title, dates, role, desc, 9, 12.5)
        y -= 12

    y -= 6
    y = section_header(c, ML, y, "KEY BUSINESS ANALYSIS PROJECTS (2021–2024)", CW)
    y -= 4

    ba_projects_all = [
        ("Business Continuity / Castellan / Riskonnect", "Jun 2023–Apr 2024", "Business Analyst → Architecture",
         "Captured objectives, scope, SSO/break-glass and API discussions, service-readiness input, and TDA/process clarification for digitising Ofgem business continuity and resilience processes. Go-with-caveats readiness decision recorded February 2024."),

        ("The Wire Rebuild (Intranet)", "Jun–Jul 2023", "Business Analyst",
         "Coordinated site-owner migration planning, content and archive queries, project-plan review, and action follow-up for the rebuild and migration of Ofgem's intranet content and profession/community sites."),

        ("Huddle Secure Collaboration Assessment", "May 2023", "Business Analyst",
         "Provided latest report, product identity clarification, indicative licensing research, vendor capability and security material handover for assessment of secure external document collaboration."),

        ("Service Excellence / Service Desk", "2023", "Business Analyst",
         "Delivered service catalogue scoping, process-design support, IT specialist support, and documentation contributions for improving service quality, customer journey, efficiency, and service-desk processes."),

        ("SharePoint to Cloud / Teams Provisioning", "2023", "Business Analyst",
         "Managed security acceptance support, approval coordination, capture of PDF/ZIP/email movements, process flows, developer and network handover, and controlled adoption for Teams provisioning capability and migration-process automation."),

        ("SharePoint Migration (2013 → Online)", "2023", "Business Analyst",
         "Served as business point of contact for migration from SharePoint 2013 to SharePoint Online, managing migration communications, user engagement, cross-directorate coordination, and feedback capture. Migration completed April 2023."),

        ("New Software Requests Standardisation", "2022–2023", "Business Analyst",
         "Led stakeholder discovery, end-to-end process design, live-request testing, ownership and routing, integration with Confluence/service desk/Ivanti, KPI support, and edge-case refinement. Process designed, tested, and accepted as a stakeholder template."),

        ("Business-as-Usual Digital Requests", "2022–2023", "Business Analyst",
         "Managed request routing, task assignment, support to TDA/Service Delivery/Communications, gap identification, and stakeholder updates across ongoing information, software, service, and support requests."),
    ]

    for title, dates, role, desc in ba_projects_all:
        y = draw_project_entry(c, y, title, dates, role, desc, 9, 12.5)
        y -= 11

    c.showPage()

    # ================================================================
    # PAGE 3 — Prior Experience + Publications + Competencies
    # ================================================================
    draw_page_background(c, 3, TOTAL_PAGES)
    y = H - MT

    y = section_header(c, ML, y, "PRIOR EXPERIENCE", CW)
    y -= 5

    y = draw_role_header(c, y, "Technologist / IT Consultant", "Self-employed / Freelance", "United Kingdom", "Jul 2020 – Aug 2021")
    freelance_bullets = [
        "Completed advanced cybersecurity training while providing technology consultancy services",
        "Analysed market trends and utilised resource management software to craft cost-effective solutions",
        "Streamlined business processes and reduced operating costs through technology optimisation",
        "Contributed to state-of-the-art equipment mapping project for Apple Maps",
    ]
    for b in freelance_bullets:
        y = draw_bullet(c, ML, y, b, "InstrumentSans", 9, GRAPHITE, CW, 13)
        y -= 6

    y -= 20
    y = draw_role_header(c, y, "Project Manager — IT", "Nelson Mandela Children's Hospital", "Johannesburg, South Africa", "Jun 2019 – Jul 2020")
    nm_bullets = [
        "Managed IT planning and implementation of small to medium healthcare technology projects across critical hospital infrastructure",
        "Ensured technical decisions based on key considerations of cost, quality, and risk",
        "Developed and maintained stakeholder relationships through communication and negotiation",
        "Managed project deliverables including scheduling, risk management, change management, and procurement",
        "Supervised vendor relationships to ensure success of technology implementations",
    ]
    for b in nm_bullets:
        y = draw_bullet(c, ML, y, b, "InstrumentSans", 9, GRAPHITE, CW, 13)
        y -= 6

    y -= 20
    y = draw_role_header(c, y, "Business Analyst", "DVT (placed at Telkom South Africa)", "South Africa", "Aug 2015 – May 2019")
    dvt_bullets = [
        "Delivered technology solutions for major clients including PwC, Vodacom, and Multichoice",
        "Created user workflows and user story maps to define user experience and product requirements",
        "Led innovation team onboarding and staff development initiatives",
        "Established and nurtured client-facing relationships to drive solution development",
    ]
    for b in dvt_bullets:
        y = draw_bullet(c, ML, y, b, "InstrumentSans", 9, GRAPHITE, CW, 13)
        y -= 6

    y -= 20
    c.setFont("InstrumentSans-Bold", 11)
    c.setFillColor(DARK)
    c.drawString(ML, y, "Earlier Career")
    y -= 16

    y = draw_text_block(c, ML, y, "Progressive technical roles across defence (Denel), broadcast media (ITV), enterprise storage (3Par/HP), telecommunications (Mweb), academic IT (Academy of Science, Canberra), and technology services (OKI Europe, OnDemand, CIC Technology). Delivered technical support, systems engineering, IT administration, and helpdesk management across the UK, South Africa, and Australia.",
                       "InstrumentSans", 9, GRAPHITE, CW, 13)
    y -= 14
    c.setFont("DMMono", 8)
    c.setFillColor(ACCENT)
    c.drawString(ML, y, "CAREER PROGRESSION:")
    prog_x = ML + pdfmetrics.stringWidth("CAREER PROGRESSION:", "DMMono", 8) + 3 * mm
    c.setFont("InstrumentSans", 9)
    c.setFillColor(GRAPHITE)
    c.drawString(prog_x, y, "Technical Support → Systems Engineer → IT Coordinator → BA → PM → Senior SA")

    # Publications
    y -= 30
    y = section_header(c, ML, y, "PUBLICATIONS", CW)
    y -= 6

    pubs = [
        ("Digital Infrastructure Standards for Energy Regulation: Enterprise Architecture in UK Government Service",
         "Zenodo, 2025 · DOI: 10.5281/zenodo.17750625",
         "Paper examining enterprise architecture standards within UK energy regulation, documenting infrastructure design principles, government digital service compliance, and scalable platform governance."),

        ("Technical Infrastructure for Human Rights Documentation: Bridging Enterprise Architecture and Evidence-Based Research",
         "Zenodo, 2025 · DOI: 10.5281/zenodo.17750868",
         "Paper exploring the intersection of enterprise architecture methodology and human rights documentation, presenting technical infrastructure frameworks for evidence-based research."),

        ("Comparative UK/US Regulatory Analysis",
         "SSRN, 2026 · CC BY licence",
         "Comparative analysis of UK and US energy regulatory frameworks."),
    ]

    for title, venue, desc in pubs:
        c.setFont("InstrumentSans-Bold", 10.5)
        c.setFillColor(DARK)
        lines = wrap_text(title, "InstrumentSans-Bold", 10.5, CW)
        for line in lines:
            c.drawString(ML, y, line)
            y -= 14.5
        c.setFont("DMMono", 8)
        c.setFillColor(ACCENT)
        c.drawString(ML, y, venue)
        y -= 16
        y = draw_text_block(c, ML, y, desc, "InstrumentSans-Italic", 9.5, STEEL, CW, 13.5)
        y -= 18

    c.showPage()

    # ================================================================
    # PAGE 4 — Education, Training, Technical Skills, Sector Experience
    # ================================================================
    draw_page_background(c, 4, TOTAL_PAGES)
    y = H - MT

    # Education & Certifications
    y = section_header(c, ML, y, "EDUCATION & CERTIFICATIONS", CW)
    y -= 2

    col1_x = ML
    col2_x = ML + CW * 0.55

    ey = y
    c.setFont("InstrumentSans-Bold", 9.5)
    c.setFillColor(DARK)
    c.drawString(col1_x, ey, "MBA")
    ey -= 12
    c.setFont("InstrumentSans", 8)
    c.setFillColor(GRAPHITE)
    c.drawString(col1_x, ey, "University of Liverpool, UK · 2008–2011")
    ey -= 16

    c.setFont("InstrumentSans-Bold", 9.5)
    c.setFillColor(DARK)
    c.drawString(col1_x, ey, "Certificate III — Information, Digital")
    ey -= 11
    c.setFont("InstrumentSans-Bold", 9.5)
    c.drawString(col1_x, ey, "Media & Technology")
    ey -= 12
    c.setFont("InstrumentSans", 8)
    c.setFillColor(GRAPHITE)
    c.drawString(col1_x, ey, "Institute of Technology, Canberra, Australia · 2014")

    ey2 = y
    certs = [
        "ITIL Foundation (APMG/AXELOS, 2015)",
        "AI Fundamentals (DataCamp, 2025)",
        "AI Ethics (DataCamp, 2025)",
        "Data Literacy (DataCamp, 2025)",
        "Foundations of Cyber Security (Google, 2024)",
        "Manage Security Risks (Google, 2024)",
        "UK Govt Cyber Launchpad (QA)",
    ]
    for cert in certs:
        c.setFont("InstrumentSans", 8)
        c.setFillColor(GRAPHITE)
        c.drawString(col2_x, ey2, cert)
        ey2 -= 11

    y = min(ey, ey2) - 10

    # Professional Training
    y -= 4
    y = section_header(c, ML, y, "PROFESSIONAL TRAINING (50+ COURSES)", CW)
    y -= 2

    training_groups = [
        ("Enterprise Architecture & Cloud", "Enterprise Architecture Foundations · Azure for Architects · Microsoft Office 365 Administration"),
        ("AI & Data", "AI Strategy · Generative AI for Business · LLMs for Business · Prompt Engineering · AI Solutions in Business · AI Agents · Microsoft Copilot · ChatGPT (Intro + Intermediate) · What Is Generative AI"),
        ("Business Analysis", "BA Foundations · Business Process Modeling · Business Benefits Realization"),
        ("Project Management", "PM Foundations · Government Projects · Iterative Methods · Procurement · Agile Tools · Business Acumen for PMs · Leading Projects"),
        ("Leadership", "Executive Leadership · Leadership Foundations · Management Foundations · Strategic HR · Administrative HR · Onboarding · Time Management"),
        ("Other", "Cybersecurity Foundations · Customer Service · Business Presentations · Working with Difficult People"),
    ]

    for group_name, courses in training_groups:
        c.setFont("InstrumentSans-Bold", 8)
        c.setFillColor(DARK)
        c.drawString(ML, y, group_name)
        y -= 10
        y = draw_text_block(c, ML, y, courses, "InstrumentSans", 7.8, STEEL, CW, 10.5)
        y -= 5

    # Technical Skills
    y -= 10
    y = section_header(c, ML, y, "TECHNICAL SKILLS", CW)
    y -= 3

    skills = [
        ("Enterprise Architecture", "TOGAF · ArchiMate · HLD/LLD · Enterprise Platform Governance · Options Appraisal"),
        ("Government Digital", "GDS Standards · Gov.UK Service Manual · TDA Governance · Government Assurance"),
        ("Cloud & Data", "Microsoft Azure · M365 · Power Platform · Power BI · Synapse · API/Integration"),
        ("Security & Compliance", "ISO 27001 · GDPR · UK Govt Security Frameworks · Secure-by-Design · SSO/IAM"),
        ("AI & Innovation", "AI Strategy · LLMs · Prompt Engineering · Data Ethics · Responsible AI Governance"),
        ("Service & Delivery", "ITIL · ServiceNow · Agile · Waterfall · Procurement · Risk Management"),
        ("Business Analysis", "User Story Mapping · Process Modeling · Benefits Realisation · Stakeholder Discovery"),
    ]

    for domain, caps in skills:
        c.setFont("InstrumentSans-Bold", 8)
        c.setFillColor(DARK)
        c.drawString(ML, y, domain)
        desc_x = ML + 45 * mm
        c.setFont("InstrumentSans", 7.8)
        c.setFillColor(GRAPHITE)
        c.drawString(desc_x, y, caps)
        y -= 12

    # Sector Experience
    y -= 12
    y = section_header(c, ML, y, "SECTOR EXPERIENCE", CW)
    y -= 3

    sectors = [
        ("Government / Energy", "Ofgem", "Critical national infrastructure, 28M+ households"),
        ("Defence", "Denel", "Government defence contractor"),
        ("Healthcare", "Nelson Mandela Children's Hospital", "Critical healthcare IT infrastructure"),
        ("Broadcast Media", "ITV", "National broadcaster technology"),
        ("Telecommunications", "Mweb, Telkom (via DVT)", "Large-scale platforms"),
        ("Enterprise Tech", "3Par/HP, OnDemand, OKI Europe", "Storage, support, systems engineering"),
        ("Research / Academic", "Academy of Science, Canberra", "Academic IT administration"),
    ]

    for sector, org, ctx in sectors:
        c.setFont("InstrumentSans-Bold", 8)
        c.setFillColor(DARK)
        c.drawString(ML, y, sector)
        c.setFont("InstrumentSans", 8)
        c.setFillColor(ACCENT)
        c.drawString(ML + 44 * mm, y, org)
        c.setFont("InstrumentSans", 7.8)
        c.setFillColor(STEEL)
        c.drawString(ML + 108 * mm, y, ctx)
        y -= 13

    # Cross-Project Competency Summary
    y -= 12
    y = section_header(c, ML, y, "CROSS-PROJECT COMPETENCY SUMMARY", CW)
    y -= 3

    competencies = [
        ("Business Analysis", "Stakeholder discovery, requirements capture, process mapping, service catalogue scoping, user communication, acceptance support, and documentation."),
        ("Governance & Assurance", "Architecture, security, privacy, procurement, data governance, TDA, and service-transition coordination."),
        ("Solution Architecture", "HLD and current-state review, options appraisal, data-flow analysis, identity and access, support model, cost and licensing considerations."),
        ("Delivery Support", "Workshops, action tracking, supplier engagement, handover, readiness reviews, UAT/testing coordination, and BAU transition support."),
        ("Research & Evaluation", "Supplier capabilities, licensing, platform comparisons, technical feasibility, assurance evidence, and operational implications."),
    ]

    for comp_name, comp_desc in competencies:
        c.setFont("InstrumentSans-Bold", 8)
        c.setFillColor(DARK)
        c.drawString(ML, y, comp_name)
        y -= 10
        y = draw_text_block(c, ML, y, comp_desc, "InstrumentSans", 7.8, GRAPHITE, CW, 10.5)
        y -= 6

    # References
    y -= 10
    c.setFont("InstrumentSans-Italic", 8.5)
    c.setFillColor(STEEL)
    c.drawString(ML, y, "References available on request. Recommendation letters on file from direct management (Ofgem) and professional colleagues.")

    y -= 16
    c.saveState()
    c.setFillColor(Color(0, 0, 0, alpha=0.07))
    c.setFont("DMMono", 5)
    c.drawString(ML, y, "REF: HLR-CV-2026-R2  ·  LAST UPDATED: AUGUST 2026")
    c.restoreState()

    # Circuit trace
    c.saveState()
    c.setStrokeColor(HexColor("#D1D5DB"))
    c.setLineWidth(0.3)
    bx = W - MR - 42 * mm
    by = MB + 2 * mm
    c.line(bx, by, bx + 37 * mm, by)
    c.line(bx + 37 * mm, by, bx + 37 * mm, by + 5 * mm)
    c.setFillColor(HexColor("#D1D5DB"))
    c.circle(bx, by, 0.5 * mm, fill=1, stroke=0)
    c.circle(bx + 13 * mm, by, 0.5 * mm, fill=1, stroke=0)
    c.circle(bx + 25 * mm, by, 0.5 * mm, fill=1, stroke=0)
    c.setFillColor(ACCENT)
    c.circle(bx + 37 * mm, by + 5 * mm, 0.7 * mm, fill=1, stroke=0)
    c.line(bx + 13 * mm, by, bx + 13 * mm, by - 3.5 * mm)
    c.line(bx + 13 * mm, by - 3.5 * mm, bx + 21 * mm, by - 3.5 * mm)
    c.setFillColor(HexColor("#D1D5DB"))
    c.circle(bx + 21 * mm, by - 3.5 * mm, 0.5 * mm, fill=1, stroke=0)
    c.restoreState()

    c.showPage()
    c.save()
    print(f"CV saved to {OUT}")


if __name__ == "__main__":
    build_cv()
