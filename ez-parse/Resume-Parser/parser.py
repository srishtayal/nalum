from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.pdfpage import PDFPage
from pdfminer.converter import PDFPageAggregator
from pdfminer.layout import LAParams, LTTextBoxHorizontal, LTTextLineHorizontal, LTChar
import json
import io
import re

TAGS = {
    "Contact",
    "Top Skills",
    "Certifications",
    "Honors-Awards",
    "Publications",
    "Summary",
    "Languages",
    "Experience",
    "Education",
}

WEIRD = [
    "\u00b7",
    "\xa0",
    "\uf0da",
    "\x0c",
    "• ",
    "* ",
    "(LinkedIn)",
    " (LinkedIn)",
    "\uf0a7",
    "(Mobile)",
    "-       ",
    "●",
]


def extract_pdf(fname):
    """Function that converts text in a PDF
    to a list of tuples with text and font size.

    Args:
        fname (str): A string with the path to the PDF to be parsed.

    Returns:
        result_list (list): A list of tuples (text, font size).

    """
    rsrcmgr = PDFResourceManager()
    laparams = LAParams()
    device = PDFPageAggregator(rsrcmgr, laparams=laparams)
    interpreter = PDFPageInterpreter(rsrcmgr, device)
    
    lines_with_sizes = []

    with open(fname, 'rb') as fp:
        for page in PDFPage.get_pages(fp):
            interpreter.process_page(page)
            layout = device.get_result()
            for element in layout:
                if isinstance(element, LTTextBoxHorizontal):
                    for text_line in element:
                        if isinstance(text_line, LTTextLineHorizontal):
                            line_text = ''
                            line_font_size = 0
                            if text_line._objs:
                                first_char = text_line._objs[0]
                                if isinstance(first_char, LTChar):
                                    line_font_size = first_char.size

                            line_text = text_line.get_text().strip()
                            if line_text:
                                for weird_char in WEIRD:
                                    line_text = line_text.replace(weird_char, "")
                                lines_with_sizes.append((line_text, line_font_size))
    
    return lines_with_sizes


def get_contact(result_list, i):
    contact = []
    for j in range(i + 1, len(result_list)):
        if not result_list[j][0]:
            continue
        elif "Page" in result_list[j][0]:
            continue
        elif result_list[j][0] not in TAGS:
            contact.append(result_list[j][0].strip())
        else:
            return contact, j
    return contact, len(result_list)


def get_name_and_headline(result_list_with_sizes):
    if not result_list_with_sizes:
        return "", ""

    max_font_size = 0
    for text, size in result_list_with_sizes:
        if size > max_font_size:
            max_font_size = size

    name = ""
    headline = ""
    name_index = -1
    for i, (text, size) in enumerate(result_list_with_sizes):
        if size == max_font_size:
            name = text
            name_index = i
            break

    if name_index != -1 and name_index + 1 < len(result_list_with_sizes):
        headline = result_list_with_sizes[name_index + 1][0]

    return name, headline


def get_skills(result_list, i):
    skills = []
    for j in range(i + 1, len(result_list)):
        if not result_list[j][0]:
            continue
        elif "Page" in result_list[j][0]:
            continue
        elif result_list[j][0] not in TAGS:
            skills.append(result_list[j][0].strip())
        else:
            return skills, j
    return skills, len(result_list)


def get_certifications(result_list, i):
    certifications = []
    for j in range(i + 1, len(result_list)):
        if not result_list[j][0]:
            continue
        elif "Page" in result_list[j][0]:
            continue
        elif result_list[j][0] not in TAGS:
            certifications.append(result_list[j][0].strip())
        else:
            return certifications, j
    return certifications, len(result_list)


def get_honors(result_list, i):
    honors = []
    for j in range(i + 1, len(result_list)):
        if not result_list[j][0]:
            continue
        elif "Page" in result_list[j][0]:
            continue
        elif result_list[j][0] not in TAGS:
            honors.append(result_list[j][0].strip())
        else:
            return honors, j
    return honors, len(result_list)


def get_summary(result_list, i):
    summary = []
    summ = ""
    for j in range(i + 1, len(result_list)):
        if not result_list[j][0]:
            continue
        elif "Page" in result_list[j][0]:
            continue
        elif result_list[j][0] not in TAGS:
            summ += result_list[j][0].strip() + " "
        else:
            summary.append(summ.strip())
            return summary, j
    summary.append(summ.strip())
    return summary, len(result_list)


def get_languages(result_list, i):
    languages = []
    for j in range(i + 1, len(result_list)):
        if not result_list[j][0]:
            continue
        elif "Page" in result_list[j][0]:
            continue
        elif result_list[j][0] not in TAGS:
            languages.append(result_list[j][0].strip())
        else:
            return languages, j
    return languages, len(result_list)


def get_education(result_list, i):
    education_entries = []
    j = i + 1
    
    duration_pattern = re.compile(r'\((\d{4}\s*-\s*\d{4})\)')

    while j < len(result_list):
        line_text = result_list[j][0].strip()

        if not line_text or line_text in TAGS:
            break

        institution = line_text
        
        if j + 1 < len(result_list):
            degree_line = result_list[j+1][0].strip()
            duration_match = duration_pattern.search(degree_line)
            
            if duration_match:
                duration = duration_match.group(1)
                degree = degree_line.replace(duration_match.group(0), '').strip()
                
                education_entries.append({
                    "institution": institution,
                    "degree": degree,
                    "duration": duration
                })
                j += 2
            else:
                if j + 2 < len(result_list):
                    degree = result_list[j+1][0].strip()
                    duration_line = result_list[j+2][0].strip()
                    duration_match = duration_pattern.search(duration_line)
                    if duration_match:
                        duration = duration_match.group(1)
                        education_entries.append({
                            "institution": institution,
                            "degree": degree,
                            "duration": duration
                        })
                        j += 3
                    else:
                        j += 1
                else:
                    j += 1
        else:
            j += 1
            
    return education_entries, j


def get_experience(result_list, i):
    experience_entries = []
    
    j = i + 1
    
    timeline_pattern = re.compile(r'\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{4}\b|\bPresent\b|\d{4}\s*-\s*\d{4}')

    while j < len(result_list):
        line_text = result_list[j][0].strip()

        if not line_text:
            j += 1
            continue

        if line_text in TAGS:
            return experience_entries, j

        if j + 2 < len(result_list):
            company = result_list[j][0].strip()
            role = result_list[j+1][0].strip()
            timeline = result_list[j+2][0].strip()

            if timeline_pattern.search(timeline):
                experience_entries.append({
                    "company": company,
                    "role": role,
                    "timeline": timeline
                })
                j += 3
                while j < len(result_list) and result_list[j][0] not in TAGS:
                    if j + 2 < len(result_list) and timeline_pattern.search(result_list[j+2][0]):
                        break
                    j += 1
            else:
                j += 1
        else:
            j += 1

    return experience_entries, j


def get_publications(result_list, i):
    publications = []
    for j in range(i + 1, len(result_list)):
        if not result_list[j][0]:
            continue
        elif "Page" in result_list[j][0]:
            continue
        elif result_list[j][0] not in TAGS:
            publications.append(result_list[j][0].strip())
        else:
            return publications, j
    return publications, len(result_list)


def get_many(result_list):
    contact, skills, languages, certifications, honors, publications, summary, experience, education = [], [], [], [], [], [], [], [], []
    
    name, headline = get_name_and_headline(result_list)

    i = 0
    while i < len(result_list):
        line = result_list[i][0]
        if line == "Contact":
            contact, i = get_contact(result_list, i)
        elif line == "Top Skills":
            skills, i = get_skills(result_list, i)
        elif line == "Languages":
            languages, i = get_languages(result_list, i)
        elif line == "Certifications":
            certifications, i = get_certifications(result_list, i)
        elif line == "Honors-Awards":
            honors, i = get_honors(result_list, i)
        elif line == "Publications":
            publications, i = get_publications(result_list, i)
        elif line == "Summary":
            summary, i = get_summary(result_list, i)
        elif line == "Experience":
            experience, i = get_experience(result_list, i)
        elif line == "Education":
            education, i = get_education(result_list, i)
        else:
            i += 1

    res = {
        "name": name,
        "headline": headline,
        "contact": contact,
        "skills": skills,
        "languages": languages,
        "certifications": certifications,
        "honors": honors,
        "publications": publications,
        "summary": summary,
        "experience": experience,
        "education": education,
    }

    return res


def get_json(result_list):
    res = get_many(result_list)
    return json.dumps(res)