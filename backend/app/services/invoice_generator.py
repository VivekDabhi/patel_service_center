from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_RIGHT, TA_CENTER

RED = colors.HexColor("#dc3545")
LIGHT_GREY = colors.HexColor("#f8f9fa")

def generate_invoice_pdf(invoice_data: dict) -> bytes:
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4,
                            leftMargin=15*mm, rightMargin=15*mm,
                            topMargin=15*mm, bottomMargin=15*mm)
    styles = getSampleStyleSheet()
    story = []

    # ── Header ────────────────────────────────────────────────────────────────
    header_data = [[
        Paragraph(f"<font color='#dc3545'><b>{invoice_data['business_name']}</b></font><br/>"
                  f"{invoice_data['business_address']}<br/>"
                  f"Phone: {invoice_data['business_phone']}", styles["Normal"]),
        Paragraph(f"<b>INVOICE</b><br/>"
                  f"<font color='#dc3545'><b>#{invoice_data['invoice_number']}</b></font><br/>"
                  f"Date: {invoice_data['invoice_date']}", ParagraphStyle("right", parent=styles["Normal"], alignment=TA_RIGHT))
    ]]
    header_table = Table(header_data, colWidths=[95*mm, 85*mm])
    header_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LINEBELOW", (0, 0), (-1, 0), 1.5, RED),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 6*mm))

    # ── Bill To ───────────────────────────────────────────────────────────────
    story.append(Paragraph(
        f"<b>Bill To:</b> {invoice_data['customer_name']} &nbsp;|&nbsp; "
        f"{invoice_data['customer_phone']} &nbsp;|&nbsp; "
        f"Vehicle: <b>{invoice_data['vehicle_number']}</b> ({invoice_data['vehicle_model']})",
        styles["Normal"]
    ))
    story.append(Spacer(1, 5*mm))

    # ── Line Items Table ──────────────────────────────────────────────────────
    table_data = [["Service / Part", "Qty", "Unit Price (₹)", "Total (₹)"]]
    for item in invoice_data["line_items"]:
        table_data.append([
            item["name"],
            str(item["qty"]),
            f"{float(item['unit_price']):,.2f}",
            f"{float(item['total']):,.2f}",
        ])

    items_table = Table(table_data, colWidths=[90*mm, 20*mm, 45*mm, 45*mm])
    items_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), RED),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, LIGHT_GREY]),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#dee2e6")),
        ("ALIGN", (1, 0), (-1, -1), "RIGHT"),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(items_table)
    story.append(Spacer(1, 4*mm))

    # ── Totals ────────────────────────────────────────────────────────────────
    totals = [["Subtotal:", f"₹{invoice_data['subtotal']:,.2f}"]]
    if invoice_data["discount"] > 0:
        totals.append(["Discount:", f"- ₹{invoice_data['discount']:,.2f}"])
    if invoice_data["tax"] > 0:
        totals.append(["GST / Tax:", f"₹{invoice_data['tax']:,.2f}"])
    totals.append(["TOTAL:", f"₹{invoice_data['total']:,.2f}"])

    totals_table = Table(totals, colWidths=[40*mm, 40*mm])
    totals_table.setStyle(TableStyle([
        ("ALIGN", (0, 0), (-1, -1), "RIGHT"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("FONTNAME", (0, -1), (-1, -1), "Helvetica-Bold"),
        ("TEXTCOLOR", (0, -1), (-1, -1), RED),
        ("FONTSIZE", (0, -1), (-1, -1), 11),
        ("LINEABOVE", (0, -1), (-1, -1), 1, RED),
        ("TOPPADDING", (0, -1), (-1, -1), 5),
    ]))

    # right-align totals block
    wrapper = Table([[None, totals_table]], colWidths=[100*mm, 80*mm])
    wrapper.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP")]))
    story.append(wrapper)
    story.append(Spacer(1, 12*mm))

    # ── Footer ────────────────────────────────────────────────────────────────
    story.append(Paragraph(
        f"Thank you for choosing <b>{invoice_data['business_name']}</b>! "
        "We look forward to serving you again.",
        ParagraphStyle("footer", parent=styles["Normal"], alignment=TA_CENTER,
                       textColor=colors.grey, fontSize=9)
    ))

    doc.build(story)
    return buffer.getvalue()
