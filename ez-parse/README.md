# ez-parse
A Python library that scrapes essential information from PDFs of LinkedIn profiles.

[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)
[![](https://img.shields.io/github/issues/ShivanshSrivastava1/ez-parse)](https://github.com/ShivanshSrivastava1/ez-parse/issues)
[![Build Status](https://github.com/ShivanshSrivastava1/ez-parse/actions/workflows/build.yml/badge.svg)](https://github.com/ShivanshSrivastava1/ez-parse/actions/workflows/build.yml)
[![codecov](https://codecov.io/github/ShivanshSrivastava1/Resume-Parser/branch/main/graph/badge.svg?token=V4IKQ490DY)](https://codecov.io/github/ShivanshSrivastava1/ez-parse)
[![PyPI](https://img.shields.io/pypi/v/ez_parse)](https://pypi.org/project/ez-parse/0.1.2/)
[![docs](https://img.shields.io/badge/docs-passing-brightgreen)](https://shivanshsrivastava1.github.io/ez-parse/)

[Project Board](https://github.com/users/ShivanshSrivastava1/projects/2/views/1)

## Overview
This is a parser that extracts important information from a LinkedIn profile PDF. It converts the PDF to a list of strings, and then uses LinkedIn's headers to create a dictionary that maps said headers to string values that contain the most relevant parts of a candidate's profile.

## Installation
Install the library's dependencies and build the library using:

`pip install ez-parse`

## Accessing LinkedIn PDFs
Visit the LinkedIn profile that you would like to parse. Under the individual's basic profile information, there is a button labeled "More". Click on this button, and then click on "Save to PDF".

## Usage
In your code, begin by importing the package:

`from ez-parse import parser`

You can extract the text data from the PDF like so:

`data = parser.extract_pdf(<path_to_linkedin_pdf>)`

This parsed data can also be stored in a dictionary:

`res = parser.get_many(data)`

## Examples
Below are some minimal examples of how the helper functions for each header work. Note how each helper function is designed to exclude information after encountering an irrelevant section header:

1) get_contact

`>>> li = ["999-999-9999", "Email", "URL", "Top Skills"]`

`>>> print(get_contact(li, -1)[0])`

`["999-999-9999", "Email", "URL"]`

2) get_skills

`>>> li = ["Python", "Java", "C++", "Certifications"]`

`>>> print(get_skills(li, -1)[0])`

`["Python", "Java", "C++"]`

3) get_certifications

`>>> li = ["QuickBooks", "CPR", "Bartending", "Honors-Awards"]`

`>>> print(get_certifications(li, -1)[0])`

`["QuickBooks", "CPR", "Bartending"]`

4) get_honors

`>>> li = ["USACO Gold", "USAMO Silver", "USACO Bronze"]`

`>>> print(get_honors(li, -1)[0])`

`["USACO Gold", "USAMO Silver", "USACO Bronze"]`

5) get_summary

`>>> li = ["A", "mysterious", "person.", "Languages"]`

`>>> print(get_summary(li, -1)[0])`

`["A", "mysterious", "person."]`

6) get_languages

`>>> li = ["English", "Spanish", "Latin"]`

`>>> print(get_languages(li, -1)[0])`

`["English", "Spanish", "Latin"]`

For a more in-depth example that extracts text from the PDF and relies on all of these helper functions, please see the [documentation](https://shivanshsrivastava1.github.io/ez-parse/).
