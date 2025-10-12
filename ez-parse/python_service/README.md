# EZ-Parse Service

This service provides a simple REST API to parse PDF resumes and extract structured data in JSON format. It acts as a wrapper around the `ez-parse` resume parsing library.

## Features

-   **PDF Resume Parsing**: Upload a PDF resume and get back structured JSON data.
-   **Simple REST API**: Easy to integrate with any backend service that can make HTTP requests.
-   **Lightweight**: Built with FastAPI, a modern, fast (high-performance) web framework for building APIs with Python.

## Prerequisites

-   Python 3.7+
-   `pip`

## Installation

1.  **Clone the repository** (if you haven't already).

2.  **Create and activate a virtual environment** in the repository root:

    ```bash
    python3 -m venv .venv
    source .venv/bin/activate
    ```

3.  **Install the required dependencies**:

    ```bash
    pip install -r python_service/requirements.txt
    ```

## Running the Service

To start the service, run the following command from the root of the project:

```bash
uvicorn python_service.app:app --reload --port 8000
```

The service will be running at `http://localhost:8000` and will automatically reload when you make changes to the code.

## API Endpoint

### `POST /parse`

Parses a PDF resume and returns the extracted text in JSON format.

**Request**

-   **URL**: `/parse`
-   **Method**: `POST`
-   **Headers**:
    -   `accept: application/json`
-   **Body**: `multipart/form-data`
    -   `file`: The PDF file to be parsed.

**Example Response**

A successful request will return a `200 OK` status code with a JSON object containing the parsed data from the resume. The structure of the JSON may vary depending on the content of the resume.

```json
{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "mobile_number": "123-456-7890",
    "skills": [
        "Python",
        "FastAPI",
        "JavaScript",
        "React"
    ],
    "college_name": "University of Example",
    "degree": "Bachelor of Science in Computer Science",
    "designation": "Software Engineer",
    "experience": [
        "Software Engineer at Tech Company (2020-Present)",
        "Intern at Another Company (2019)"
    ],
    "company_names": [
        "Tech Company",
        "Another Company"
    ]
}
```

**Error Responses**

-   `400 Bad Request`: If the uploaded file is not a PDF or is empty.
-   `500 Internal Server Error`: If an unexpected error occurs during parsing.

## Example Usage

### cURL

You can use `curl` to test the service:

```bash
curl -X POST "http://localhost:8000/parse" \
     -H "accept: application/json" \
     -F "file=@/path/to/your/resume.pdf"
```

### Express.js + Axios

If you have a Node.js backend with Express, you can use `axios` and `form-data` to call the service.

```javascript
// server.js (Express handler)
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(req.file.path));

    const response = await axios.post('http://localhost:8000/parse', form, {
      headers: form.getHeaders(),
    });

    // response.data contains the parsed JSON
    // You can now save response.data to your database
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    // Clean up the uploaded file
    fs.unlinkSync(req.file.path);
  }
});
```

## How It Works

The service uses `pdfminer.six` to extract raw text from the PDF. This text is then processed by the `Resume-Parser/parser.py` module, which uses regular expressions and keyword matching to identify and extract relevant information from the resume text.

## Security & Performance

-   **File Validation**: The service currently only accepts files with a `.pdf` extension. For more robust security, you should add more thorough file validation (e.g., checking file signatures).
-   **Job Queue**: For high-traffic applications, consider using a job queue (like Celery with Redis or RabbitMQ) to handle parsing tasks asynchronously. This will prevent long-running parsing jobs from blocking requests.
-   **Authentication**: If this service is exposed to the internet, you should add an authentication layer (e.g., API keys, OAuth2) to protect the endpoint from unauthorized access.

python3 -m venv .venv
source .venv/bin/activate
pip install -r python_service/requirements.txt
uvicorn python_service.app:app --reload --port 8000