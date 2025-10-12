import json
from parser import (
    extract_pdf,
    get_contact,
    get_skills,
    get_certifications,
    get_honors,
    get_summary,
    get_languages,
    get_many,
    get_json,
)


def test_get_contact():
    li = ["999-999-9999", "Email", "URL", "Top Skills"]
    res = {"contact": ["999-999-9999", "Email", "URL"]}
    assert get_contact(li, -1)[0] == res["contact"]


def test_get_skills():
    li = ["Python", "Java", "C++", "Certifications"]
    res = {"skills": ["Python", "Java", "C++"]}
    assert get_skills(li, -1)[0] == res["skills"]


def test_get_certifications():
    li = ["QuickBooks", "CPR", "Bartending", "Honors-Awards"]
    res = {"certifications": ["QuickBooks", "CPR", "Bartending"]}
    assert get_certifications(li, -1)[0] == res["certifications"]


def test_get_honors():
    li = ["USACO Gold", "USAMO Silver", "USACO Bronze", "Summary"]
    res = {"honors": ["USACO Gold", "USAMO Silver", "USACO Bronze"]}
    assert get_honors(li, -1)[0] == res["honors"]


def test_get_summary():
    li = ["A", "mysterious", "person.", "Languages"]
    res = {"summary": ["A mysterious person."]}
    assert get_summary(li, -1)[0] == res["summary"]


def test_get_languages():
    li = ["English", "Spanish", "Latin", "Contact"]
    res = {"languages": ["English", "Spanish", "Latin"]}
    assert get_languages(li, -1)[0] == res["languages"]


def test_extract_pdf():
    res = [
        "Contact",
        "5202620535 ",
        "ss5945@columbia.edu",
        "",
        "www.linkedin.com/in/shivansh-",
        "srivastava-cs001 ",
        "",
        "Top Skills",
        "Public Speaking",
        "Python (Programming Language)",
        "HTML",
        "",
        "Languages",
        "Hindi (Native or Bilingual)",
        "English (Native or Bilingual)",
        "Spanish (Professional Working)",
        "",
        "Certifications",
        "Gold Seal of Biliteracy in Spanish",
        "Software Engineering Virtual",
        "Experience",
        "",
        "Honors-Awards",
        "Gold Seal of Bilteracy",
        "SARSEF Grand Award",
        "Excellence in Engineering",
        "Scholarship",
        "2019 Coca-Cola Scholar Semifinalist",
        "Columbia Computer Science",
        "Emerging Scholar of 2020",
        "",
        "Publications",
        "India: Facts, Faith and Festivals",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "Shivansh Srivastava",
        "",
        "SWE Intern @ Meta (Facebook) | CS @ Columbia",
        "New York City Metropolitan Area",
        "",
        "Summary",
        "Hi, I'm Shivansh! I'm a senior at Columbia Engineering studying",
        "computer science. I'm interested in AI/ML, computer vision, and NLP.",
        "Feel free to reach out to me at ss5945@columbia.edu.",
        "",
        "Experience",
        "",
        "Meta",
        "Software Engineer",
        "May 2022-Present(11 months)",
        "Menlo Park, California, United States",
        "Integrity Observation Platform",
        "",
        "Columbia Build Lab",
        "Vice President of Community",
        "February 2021-Present(2 years 2 months)",
        "New York City Metropolitan Area",
        "- Interview and match 30+ MBA startup founders with 50+ \
            undergrad and",
        "graduate SWE, PD, and PM interns each semester",
        "- Manage a semester budget of $144k to pay student interns \
            and organize",
        "workshops and networking events",
        "- Work with the Eugene M. Lang Entrepreneurship Center and \
            the CS",
        "Department to design academic guidelines for students",
        "",
        "Skye",
        "Software Engineer",
        "February 2021-May 2022(1 year 4 months)",
        "New York City Metropolitan Area",
        "- Develop a full-stack web application for professional \
            coaching services",
        "- Implement Firebase back-end infrastructure for the React \
            web app’s server to",
        "reduce costs",
        "- Design a novel matching algorithm to match 80+ clients to \
            their personalized",
        "coaches",
        "- Clean data from 6700+ schools in the U.S. to train the matching \
            algorithm on",
        "",
        "Page 1 of 2",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "Education",
        "Columbia University in the City of New York",
        "Bachelor of Science - BS,Computer Science(2019-2023)",
        "",
        "Catalina Foothills High School",
        "Honors Diploma(2015-2019)",
        "",
        "Page 2 of 2",
        "",
        "",
    ]
    li = extract_pdf('sample/Shivansh Srivastava.pdf')
    assert li.sort() == res.sort()


def test_get_many():
    li = [
        "Contact",
        "5202620535 ",
        "ss5945@columbia.edu",
        "",
        "www.linkedin.com/in/shivansh-",
        "srivastava-cs001 ",
        "",
        "Top Skills",
        "Public Speaking",
        "Python (Programming Language)",
        "HTML",
        "",
        "Languages",
        "Hindi (Native or Bilingual)",
        "English (Native or Bilingual)",
        "Spanish (Professional Working)",
        "",
        "Certifications",
        "Gold Seal of Biliteracy in Spanish",
        "Software Engineering Virtual",
        "Experience",
        "",
        "Honors-Awards",
        "Gold Seal of Bilteracy",
        "SARSEF Grand Award",
        "Excellence in Engineering",
        "Scholarship",
        "2019 Coca-Cola Scholar Semifinalist",
        "Columbia Computer Science",
        "Emerging Scholar of 2020",
        "",
        "Publications",
        "India: Facts, Faith and Festivals",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "Shivansh Srivastava",
        "",
        "SWE Intern @ Meta (Facebook) | CS @ Columbia",
        "New York City Metropolitan Area",
        "",
        "Summary",
        "Hi, I'm Shivansh! I'm a senior at Columbia Engineering studying",
        "computer science. I'm interested in AI/ML, computer vision, and NLP.",
        "Feel free to reach out to me at ss5945@columbia.edu.",
        "",
        "Experience",
        "",
        "Meta",
        "Software Engineer",
        "May 2022-Present(11 months)",
        "Menlo Park, California, United States",
        "Integrity Observation Platform",
        "",
        "Columbia Build Lab",
        "Vice President of Community",
        "February 2021-Present(2 years 2 months)",
        "New York City Metropolitan Area",
        "- Interview and match 30+ MBA startup founders with 50+ \
            undergrad and",
        "graduate SWE, PD, and PM interns each semester",
        "- Manage a semester budget of $144k to pay student interns \
            and organize",
        "workshops and networking events",
        "- Work with the Eugene M. Lang Entrepreneurship Center and \
            the CS",
        "Department to design academic guidelines for students",
        "",
        "Skye",
        "Software Engineer",
        "February 2021-May 2022(1 year 4 months)",
        "New York City Metropolitan Area",
        "- Develop a full-stack web application for professional \
            coaching services",
        "- Implement Firebase back-end infrastructure for the React \
            web app’s server to",
        "reduce costs",
        "- Design a novel matching algorithm to match 80+ clients to \
            their personalized",
        "coaches",
        "- Clean data from 6700+ schools in the U.S. to train the matching \
            algorithm on",
        "",
        "Page 1 of 2",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "Education",
        "Columbia University in the City of New York",
        "Bachelor of Science - BS,Computer Science(2019-2023)",
        "",
        "Catalina Foothills High School",
        "Honors Diploma(2015-2019)",
        "",
        "Page 2 of 2",
        "",
        "",
    ]
    res = get_many(li)

    assert res == {
        "contact": [
            "5202620535",
            "ss5945@columbia.edu",
            "www.linkedin.com/in/shivansh-",
            "srivastava-cs001",
        ],
        "skills": ["Public Speaking", "Python (Programming Language)", "HTML"],
        "languages": [
            "Hindi (Native or Bilingual)",
            "English (Native or Bilingual)",
            "Spanish (Professional Working)",
        ],
        "certifications": [
            "Gold Seal of Biliteracy in Spanish",
            "Software Engineering Virtual",
        ],
        "honors": [
            "Gold Seal of Bilteracy",
            "SARSEF Grand Award",
            "Excellence in Engineering",
            "Scholarship",
            "2019 Coca-Cola Scholar Semifinalist",
            "Columbia Computer Science",
            "Emerging Scholar of 2020",
        ],
        "summary": [
            "Hi, I'm Shivansh! I'm a senior at Columbia Engineering studying computer science. I'm interested in AI/ML, computer vision, and NLP. Feel free to reach out to me at ss5945@columbia.edu."
        ],
    }


def test_get_json():
    li = [
        "Contact",
        "5202620535 ",
        "ss5945@columbia.edu",
        "",
        "www.linkedin.com/in/shivansh-",
        "srivastava-cs001 ",
        "",
        "Top Skills",
        "Public Speaking",
        "Python (Programming Language)",
        "HTML",
        "",
        "Languages",
        "Hindi (Native or Bilingual)",
        "English (Native or Bilingual)",
        "Spanish (Professional Working)",
        "",
        "Certifications",
        "Gold Seal of Biliteracy in Spanish",
        "Software Engineering Virtual",
        "Experience",
        "",
        "Honors-Awards",
        "Gold Seal of Bilteracy",
        "SARSEF Grand Award",
        "Excellence in Engineering",
        "Scholarship",
        "2019 Coca-Cola Scholar Semifinalist",
        "Columbia Computer Science",
        "Emerging Scholar of 2020",
        "",
        "Publications",
        "India: Facts, Faith and Festivals",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "Shivansh Srivastava",
        "",
        "SWE Intern @ Meta (Facebook) | CS @ Columbia",
        "New York City Metropolitan Area",
        "",
        "Summary",
        "Hi, I'm Shivansh! I'm a senior at Columbia Engineering studying",
        "computer science. I'm interested in AI/ML, computer vision, and NLP.",
        "Feel free to reach out to me at ss5945@columbia.edu.",
        "",
        "Experience",
        "",
        "Meta",
        "Software Engineer",
        "May 2022-Present(11 months)",
        "Menlo Park, California, United States",
        "Integrity Observation Platform",
        "",
        "Columbia Build Lab",
        "Vice President of Community",
        "February 2021-Present(2 years 2 months)",
        "New York City Metropolitan Area",
        "- Interview and match 30+ MBA startup founders with 50+ \
            undergrad and",
        "graduate SWE, PD, and PM interns each semester",
        "- Manage a semester budget of $144k to pay student interns \
            and organize",
        "workshops and networking events",
        "- Work with the Eugene M. Lang Entrepreneurship Center and \
            the CS",
        "Department to design academic guidelines for students",
        "",
        "Skye",
        "Software Engineer",
        "February 2021-May 2022(1 year 4 months)",
        "New York City Metropolitan Area",
        "- Develop a full-stack web application for professional \
            coaching services",
        "- Implement Firebase back-end infrastructure for the React \
            web app’s server to",
        "reduce costs",
        "- Design a novel matching algorithm to match 80+ clients to \
            their personalized",
        "coaches",
        "- Clean data from 6700+ schools in the U.S. to train the matching \
            algorithm on",
        "",
        "Page 1 of 2",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "Education",
        "Columbia University in the City of New York",
        "Bachelor of Science - BS,Computer Science(2019-2023)",
        "",
        "Catalina Foothills High School",
        "Honors Diploma(2015-2019)",
        "",
        "Page 2 of 2",
        "",
        "",
    ]
    res = get_json(li)
    try:
        json.loads(res)
    except ValueError as err:
        assert False
    assert True


def test_integrated():
    li = extract_pdf('sample/Shivansh Srivastava.pdf')
    res = get_many(li)

    assert res == {
        "contact": [
            "5202620535",
            "ss5945@columbia.edu",
            "www.linkedin.com/in/shivansh-",
            "srivastava-cs001",
        ],
        "skills": ["Public Speaking", "Python (Programming Language)", "HTML"],
        "languages": [
            "Hindi (Native or Bilingual)",
            "English (Native or Bilingual)",
            "Spanish (Professional Working)",
        ],
        "certifications": [
            "Gold Seal of Biliteracy in Spanish",
            "Software Engineering Virtual",
        ],
        "honors": [
            "Gold Seal of Bilteracy",
            "SARSEF Grand Award",
            "Excellence in Engineering",
            "Scholarship",
            "2019 Coca-Cola Scholar Semifinalist",
            "Columbia Computer Science",
            "Emerging Scholar of 2020",
        ],
        "summary": [
            "Hi, I'm Shivansh! I'm a senior at Columbia Engineering studying computer science. I'm interested in AI/ML, computer vision, and NLP. Feel free to reach out to me at ss5945@columbia.edu."
        ],
    }


def test_integrated_json():
    li = extract_pdf('sample/Shivansh Srivastava.pdf')
    res = get_json(li)

    try:
        json.loads(res)
    except ValueError as err:
        assert False
    assert True
