#!/usr/bin/env python3
"""
Henri Le Riche — Senior Solutions Architect Resume (v2 — expanded CV)
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
OUT = "/home/user/Artist/henri-leriche-resume.pdf"

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

ML = 20 * mm
MR = 16 * mm
MT = 14 * mm
MB = 10 * mm

LEFT_COL_W = 54 * mm
STRIP_W = 1.2 * mm
LEFT_TOTAL = ML + LEFT_COL_W
RIGHT_COL_X = LEFT_TOTAL + STRIP_W + 5 * mm
RIGHT_COL_W = W - RIGHT_COL_X - MR


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
        leading = size * 1.4
    c.setFont(font, size)
    c.setFillColor(color)
    for line in wrap_text(text, font, size, max_width):
        c.drawString(x, y, line)
        y -= leading
    return y


def draw_bullet(c, x, y, text, font, size, color, max_width, leading=None):
    if leading is None:
        leading = size * 1.32
    indent = 5 * mm
    c.setFont("DMMono", size)
    c.setFillColor(ACCENT)
    c.drawString(x, y, "—")
    c.setFont(font, size)
    c.setFillColor(color)
    for line in wrap_text(text, font, size, max_width - indent):
        c.drawString(x + indent, y, line)
        y -= leading
    return y


def section_label(c, x, y, label):
    c.saveState()
    s = 2.2 * mm
    c.setFillColor(ACCENT)
    c.rect(x, y - 0.3 * mm, s, s, fill=1, stroke=0)
    c.setFont("DMMono", 5.2)
    c.drawString(x + s + 1.8 * mm, y, label)
    c.restoreState()


def right_section_header(c, x, y, label, width):
    c.setFont("DMMono", 5.5)
    c.setFillColor(STEEL)
    c.drawString(x, y, label)
    y -= 2.5
    c.setStrokeColor(HexColor("#D1D5DB"))
    c.setLineWidth(0.3)
    c.line(x, y, x + width, y)
    return y - 9


def draw_skill_tags(c, x, y, skills, max_width):
    tag_x = x
    tag_h = 5.2 * mm
    tag_pad = 2 * mm
    row_gap = 1.2 * mm
    font, fsize = "InstrumentSans", 5.5
    for skill in skills:
        tag_w = pdfmetrics.stringWidth(skill, font, fsize) + tag_pad * 2
        if tag_x + tag_w > x + max_width:
            tag_x = x
            y -= tag_h + row_gap
        c.setFillColor(SLATE)
        c.roundRect(tag_x, y - 1 * mm, tag_w, tag_h, 1 * mm, fill=1, stroke=0)
        c.setFont(font, fsize)
        c.setFillColor(LIGHT)
        c.drawString(tag_x + tag_pad, y + 0.7 * mm, skill)
        tag_x += tag_w + 1.5 * mm
    return y - tag_h - row_gap


def draw_metric_card(c, x, y, value, label, width):
    card_h = 18 * mm
    c.setFillColor(ACCENT_FAINT)
    c.roundRect(x, y - card_h + 4 * mm, width, card_h, 1.5 * mm, fill=1, stroke=0)
    c.setStrokeColor(HexColor("#BFDBFE"))
    c.setLineWidth(0.4)
    c.roundRect(x, y - card_h + 4 * mm, width, card_h, 1.5 * mm, fill=0, stroke=1)
    c.setFont("Jura-Medium", 15)
    c.setFillColor(ACCENT)
    c.drawCentredString(x + width / 2, y - 3 * mm, value)
    c.setFont("DMMono", 4.2)
    c.setFillColor(STEEL)
    lines = wrap_text(label, "DMMono", 4.2, width - 4 * mm)
    ly = y - card_h + 7.5 * mm
    for line in lines:
        c.drawCentredString(x + width / 2, ly, line)
        ly -= 5.5


def build_resume():
    c = canvas.Canvas(OUT, pagesize=A4)
    c.setTitle("Henri Le Riche — Senior Solutions Architect")
    c.setAuthor("Henri Le Riche")

    # === BACKGROUND ===
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    # Subtle structural grid — right side
    c.saveState()
    c.setStrokeColor(HexColor("#EBEDF0"))
    c.setLineWidth(0.12)
    for gx in range(int(LEFT_TOTAL + STRIP_W), int(W), int(10 * mm)):
        c.line(gx, 0, gx, H)
    for gy in range(int(10 * mm), int(H), int(10 * mm)):
        c.line(int(LEFT_TOTAL + STRIP_W), gy, int(W), gy)
    c.restoreState()

    # === LEFT COLUMN GROUND ===
    c.setFillColor(DARK)
    c.rect(0, 0, LEFT_TOTAL, H, fill=1, stroke=0)

    # Fine grid on dark
    c.saveState()
    c.setStrokeColor(Color(1, 1, 1, alpha=0.025))
    c.setLineWidth(0.15)
    for gx in range(0, int(LEFT_TOTAL), int(5 * mm)):
        c.line(gx, 0, gx, H)
    for gy in range(0, int(H), int(5 * mm)):
        c.line(0, gy, int(LEFT_TOTAL), gy)
    c.restoreState()

    # === ACCENT STRIP ===
    c.setFillColor(ACCENT)
    c.rect(LEFT_TOTAL, 0, STRIP_W, H, fill=1, stroke=0)

    # === BOTTOM BAR ===
    c.setFillColor(ACCENT)
    c.rect(0, 0, W, 1.8 * mm, fill=1, stroke=0)

    # ============================================================
    # LEFT COLUMN
    # ============================================================
    y = H - MT
    avail_w = LEFT_COL_W - 6 * mm

    c.setFillColor(WHITE)
    c.setFont("Jura-Light", 26)
    c.drawString(ML, y, "HENRI")
    y -= 28
    c.setFont("Jura-Medium", 26)
    c.drawString(ML, y, "LE RICHE")

    y -= 10
    c.setStrokeColor(ACCENT)
    c.setLineWidth(0.7)
    c.line(ML, y, ML + LEFT_COL_W - 4 * mm, y)

    y -= 12
    c.setFillColor(ACCENT_LIGHT)
    c.setFont("DMMono", 5.8)
    c.drawString(ML, y, "SENIOR SOLUTIONS ARCHITECT")

    # Contact
    y -= 16
    section_label(c, ML, y, "CONTACT")
    y -= 10
    c.setFont("InstrumentSans", 6.3)
    c.setFillColor(SILVER)
    for item in ["London, United Kingdom", "henri.leriche@outlook.com", "+44 7376 783718"]:
        c.drawString(ML, y, item)
        y -= 8.5

    # Education
    y -= 6
    section_label(c, ML, y, "EDUCATION")
    y -= 10
    c.setFont("InstrumentSans-Bold", 6.8)
    c.setFillColor(WHITE)
    c.drawString(ML, y, "MBA")
    y -= 8
    c.setFont("InstrumentSans", 6)
    c.setFillColor(SILVER)
    c.drawString(ML, y, "University of Liverpool, UK")
    y -= 7
    c.drawString(ML, y, "2008 – 2011")
    y -= 9

    c.setFont("InstrumentSans-Bold", 6.8)
    c.setFillColor(WHITE)
    c.drawString(ML, y, "Cert III — IT")
    y -= 8
    c.setFont("InstrumentSans", 6)
    c.setFillColor(SILVER)
    c.drawString(ML, y, "Institute of Technology, Canberra")
    y -= 7
    c.drawString(ML, y, "2014")

    # Certifications
    y -= 10
    section_label(c, ML, y, "CERTIFICATIONS")
    y -= 10
    certs = [
        "ITIL Foundation (APMG/AXELOS)",
        "AI Fundamentals (DataCamp)",
        "AI Ethics (DataCamp)",
        "Data Literacy (DataCamp)",
        "Google Cybersecurity (x2)",
        "UK Govt Cyber Launchpad (QA)",
    ]
    for cert in certs:
        c.setFont("InstrumentSans", 5.8)
        c.setFillColor(SILVER)
        c.drawString(ML, y, cert)
        y -= 7.5

    # Training
    y -= 3
    c.setFont("DMMono", 5)
    c.setFillColor(ACCENT)
    c.drawString(ML, y, "50+ PROFESSIONAL COURSES")
    y -= 7
    c.setFont("InstrumentSans-Italic", 5.3)
    c.setFillColor(HexColor("#7B8290"))
    y = draw_text_block(c, ML, y, "Enterprise Architecture, AI/Data, Project Management, Leadership, Cybersecurity, Business Analysis",
                        "InstrumentSans-Italic", 5.3, HexColor("#7B8290"), avail_w, 6.5)

    # Membership
    y -= 4
    section_label(c, ML, y, "MEMBERSHIP")
    y -= 10
    c.setFont("InstrumentSans-Bold", 6.5)
    c.setFillColor(WHITE)
    c.drawString(ML, y, "IEEE")
    c.setFont("InstrumentSans", 6)
    c.setFillColor(SILVER)
    c.drawString(ML + pdfmetrics.stringWidth("IEEE", "InstrumentSans-Bold", 6.5) + 3 * mm, y, "Senior Member")

    # Technical Skills
    y -= 13
    section_label(c, ML, y, "TECHNICAL SKILLS")
    y -= 10

    skill_groups = [
        ("ARCHITECTURE", ["TOGAF", "ArchiMate", "HLD/LLD", "GDS", "Gov.UK"]),
        ("CLOUD & DATA", ["Azure", "M365", "Power BI", "Synapse", "API"]),
        ("SECURITY", ["ISO 27001", "GDPR", "SSO/IAM", "Secure-by-Design"]),
        ("AI", ["AI Strategy", "LLMs", "Prompt Eng.", "Data Ethics"]),
        ("DELIVERY", ["Agile", "Waterfall", "ITIL", "ServiceNow"]),
        ("BA", ["Story Maps", "Process Model", "Benefits Real."]),
    ]

    for group_name, skills in skill_groups:
        c.setFont("DMMono", 4.5)
        c.setFillColor(ACCENT)
        c.drawString(ML, y, group_name)
        y -= 7
        y = draw_skill_tags(c, ML, y, skills, avail_w)
        y -= 0.5

    # Publications
    y -= 3
    section_label(c, ML, y, "PUBLICATIONS")
    y -= 10

    pubs = [
        ("Digital Infrastructure Standards for Energy Regulation", "Zenodo, 2025"),
        ("Technical Infrastructure for Human Rights Documentation", "Zenodo, 2025"),
        ("Comparative UK/US Regulatory Analysis", "SSRN, 2026"),
    ]
    for title, venue in pubs:
        y = draw_text_block(c, ML, y, title, "InstrumentSans", 5.6, LIGHT, avail_w, 7)
        c.setFont("DMMono", 4.5)
        c.setFillColor(HexColor("#6B7280"))
        c.drawString(ML, y + 1, venue)
        y -= 10

    # ============================================================
    # RIGHT COLUMN
    # ============================================================
    ry = H - MT
    rx = RIGHT_COL_X
    rw = RIGHT_COL_W

    # Profile
    ry = right_section_header(c, rx, ry, "PROFILE", rw)

    summary = "Enterprise architect and digital transformation leader with extensive progressive experience spanning solution architecture, business analysis, project management, and technical delivery. Currently shaping solution architecture at Ofgem, the UK's independent energy regulator, designing secure, scalable infrastructure serving 3M+ users across 28M+ households. Architect of record on 18 projects since 2021. Published researcher and IEEE Senior Member. MBA-qualified with deep expertise in TOGAF, ArchiMate, Azure, and UK Government security frameworks. People-oriented leader who values collaborative, respectful working environments."
    ry = draw_text_block(c, rx, ry, summary, "InstrumentSans", 7, GRAPHITE, rw, 9.8)

    # === KEY METRICS STRIP ===
    ry -= 6
    metrics = [
        ("18", "PROJECTS\nARCHITECTED"),
        ("3M+", "PLATFORM\nUSERS"),
        ("£150M+", "PROGRAMME\nBUDGETS"),
        ("99.95%", "UPTIME\nSTANDARD"),
    ]
    card_gap = 3 * mm
    card_w = (rw - card_gap * 3) / 4
    for i, (val, lbl) in enumerate(metrics):
        cx = rx + i * (card_w + card_gap)
        draw_metric_card(c, cx, ry, val, lbl, card_w)

    ry -= 22 * mm

    # Experience
    ry = right_section_header(c, rx, ry, "EXPERIENCE", rw)

    # --- Ofgem ---
    c.setFont("InstrumentSans-Bold", 8.8)
    c.setFillColor(DARK)
    c.drawString(rx, ry, "Senior Solutions Architect")
    ry -= 10.5

    c.setFont("InstrumentSans", 6.8)
    c.setFillColor(ACCENT)
    c.drawString(rx, ry, "Ofgem — Office of Gas and Electricity Markets")
    c.setFont("DMMono", 5.5)
    c.setFillColor(STEEL)
    c.drawRightString(rx + rw, ry, "Aug 2021 – Present")
    ry -= 8.5
    c.setFont("InstrumentSans-Italic", 6)
    c.setFillColor(GRAPHITE)
    c.drawString(rx, ry, "Grade 2A · London · DDSS Directorate")
    ry -= 10

    ofgem_bullets = [
        "Architect of record on 18 projects: Synapse data platform replacement, AI social listening, DWP-Ofgem SFTE secure file transfer, Power BI external sharing/publish-to-web, Vivup benefits, 8x8/Crezovi telephony, Digital/Hybrid Mail, and Castellan business continuity.",
        "Designed HLD/LLD architectures to ArchiMate standard through TDA governance to production. Led technical evaluations, SSO integration, security assurance, and vendor due diligence across multiple procurement cycles.",
        "Delivered end-to-end business analysis (2021–24): software request standardisation, SharePoint Online migration, Teams provisioning automation, service catalogue redesign, intranet rebuild, and cross-directorate stakeholder coordination.",
        "Contributed AI governance, data ethics assessments, and architectural input to procurement across £150M+ programme budgets. Platforms maintained to 99.95% uptime reliability.",
    ]

    for bullet in ofgem_bullets:
        ry = draw_bullet(c, rx, ry, bullet, "InstrumentSans", 6.3, GRAPHITE, rw, 8.3)
        ry -= 2.5

    # --- Freelance ---
    ry -= 5
    c.setFont("InstrumentSans-Bold", 7.8)
    c.setFillColor(DARK)
    c.drawString(rx, ry, "Technologist / IT Consultant")
    ry -= 9.5

    c.setFont("InstrumentSans", 6.5)
    c.setFillColor(ACCENT)
    c.drawString(rx, ry, "Self-employed")
    c.setFont("DMMono", 5.5)
    c.setFillColor(STEEL)
    c.drawRightString(rx + rw, ry, "Jul 2020 – Aug 2021")
    ry -= 9

    ry = draw_text_block(c, rx, ry, "Technology consultancy, advanced cybersecurity training, process optimisation, and equipment mapping for Apple Maps.",
                        "InstrumentSans", 6.3, GRAPHITE, rw, 8.3)

    # --- Nelson Mandela ---
    ry -= 5
    c.setFont("InstrumentSans-Bold", 7.8)
    c.setFillColor(DARK)
    c.drawString(rx, ry, "Project Manager — IT")
    ry -= 9.5

    c.setFont("InstrumentSans", 6.5)
    c.setFillColor(ACCENT)
    c.drawString(rx, ry, "Nelson Mandela Children's Hospital")
    c.setFont("DMMono", 5.5)
    c.setFillColor(STEEL)
    c.drawRightString(rx + rw, ry, "Jun 2019 – Jul 2020")
    ry -= 9

    ry = draw_text_block(c, rx, ry, "Managed healthcare IT project delivery across critical hospital infrastructure: scheduling, risk, change management, procurement, and vendor oversight.",
                        "InstrumentSans", 6.3, GRAPHITE, rw, 8.3)

    # --- DVT ---
    ry -= 5
    c.setFont("InstrumentSans-Bold", 7.8)
    c.setFillColor(DARK)
    c.drawString(rx, ry, "Business Analyst")
    ry -= 9.5

    c.setFont("InstrumentSans", 6.5)
    c.setFillColor(ACCENT)
    c.drawString(rx, ry, "DVT (placed at Telkom SA)")
    c.setFont("DMMono", 5.5)
    c.setFillColor(STEEL)
    c.drawRightString(rx + rw, ry, "Aug 2015 – May 2019")
    ry -= 9

    ry = draw_text_block(c, rx, ry, "Delivered solutions for PwC, Vodacom, and Multichoice. User workflows, story maps, innovation onboarding, and client relationship management.",
                        "InstrumentSans", 6.3, GRAPHITE, rw, 8.3)

    # --- Earlier Career ---
    ry -= 5
    c.setFont("InstrumentSans-Bold", 7.8)
    c.setFillColor(DARK)
    c.drawString(rx, ry, "Earlier Career")
    ry -= 10

    ry = draw_text_block(c, rx, ry, "Progressive roles: Technical Support → Systems Engineer → IT Coordinator → BA → PM → Senior SA. Across Denel (defence), ITV (broadcast), 3Par/HP (storage), Mweb (telecoms), Academy of Science (Canberra). UK, South Africa, Australia.",
                        "InstrumentSans", 6.3, GRAPHITE, rw, 8.3)

    # === KEY DOMAINS ===
    ry -= 10
    ry = right_section_header(c, rx, ry, "SECTOR EXPERIENCE", rw)

    domains = [
        ("Energy Regulation", "Ofgem · CNI · 28M+ households"),
        ("Government Digital", "GDS · TDA governance · 18 projects"),
        ("Healthcare", "Nelson Mandela Children's Hospital"),
        ("Telecoms & Media", "ITV · Mweb · Telkom · Vodacom"),
        ("Defence & Enterprise", "Denel · 3Par/HP · OKI Europe"),
    ]

    for domain_name, desc in domains:
        c.setFont("InstrumentSans-Bold", 6.5)
        c.setFillColor(DARK)
        c.drawString(rx, ry, domain_name)
        desc_x = rx + 42 * mm
        c.setFont("InstrumentSans", 6)
        c.setFillColor(STEEL)
        c.drawString(desc_x, ry, desc)
        ry -= 9.5

    # === Circuit trace ===
    c.saveState()
    c.setStrokeColor(HexColor("#D1D5DB"))
    c.setLineWidth(0.3)
    bx = rx + rw - 42 * mm
    by = MB + 6 * mm
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

    # Reference marker
    c.saveState()
    c.setFillColor(Color(0, 0, 0, alpha=0.07))
    c.setFont("DMMono", 3.8)
    c.drawString(rx, MB, "REF: HLR-SA-2026-R2")
    c.restoreState()

    # Coordinate marker
    c.saveState()
    c.setFillColor(HexColor("#C8CCD2"))
    c.setFont("DMMono", 3.8)
    c.drawRightString(W - MR, H - 8 * mm, "51.5074°N  0.1278°W")
    c.restoreState()

    c.save()
    print(f"Resume saved to {OUT}")


if __name__ == "__main__":
    build_resume()
