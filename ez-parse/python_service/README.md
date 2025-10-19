# EZ-Parse Service

This service provides a lightweight REST API that wraps the `ez-parse` resume parsing library and exposes a single endpoint to parse PDF resumes and return structured JSON.

## Features

- PDF resume parsing (POST /parse)
- Simple FastAPI-based REST API
- Uses `pdfminer.six` for PDF text extraction and the project's `Resume-Parser/parser.py` for parsing logic

## Prerequisites

- Python 3.7 or newer
- pip

## Installation

1. Clone the repository (if you haven't already).

2. Create and activate a virtual environment in the repository root.

   - Linux / macOS

     ```bash
     python3 -m venv .venv
     source .venv/bin/activate
     ```

   - Windows (PowerShell)

     ```powershell
     python -m venv .venv
     .\.venv\Scripts\Activate.ps1
     ```

   - Windows (Command Prompt)

     ```cmd
     python -m venv .venv
     .venv\Scripts\activate.bat
     ```

   Note for PowerShell users: If you get a script execution policy error, run (as Administrator or for the current user):

   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

1.Install dependencies:

   ```bash
   pip install -r python_service/requirements.txt
   ```

### Windows (alternate installer)

```powershell
pip install -r python_service/requirements.txt
```

## Running the Service

To start the service, run the following command from the root of the project:

### Linux / macOS

```bash
uvicorn python_service.app:app --reload --port 8000
```

### Windows (PowerShell or Command Prompt)

```powershell
uvicorn python_service.app:app --reload --port 8000
```

The service will be available at <http://localhost:8000> and will reload automatically on code changes when run with `--reload`.

## API

POST /parse

- Description: Parse an uploaded PDF resume and return extracted fields as JSON.
- Request: multipart/form-data with a `file` field containing a PDF.
- Response: 200 OK with parsed JSON, or 4xx/5xx on error.

Example cURL request:

```bash
curl -X POST "http://localhost:8000/parse" \
  -H "accept: application/json" \
  -F "file=@/path/to/your/resume.pdf"
```

## Example integration (Express + Axios)

If you need to call this service from a Node.js backend, here's a minimal example:

```javascript
// Express handler
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

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    fs.unlinkSync(req.file.path);
  }
});
```

## How it works

The service extracts text from PDFs using `pdfminer.six` and then passes the raw text to `Resume-Parser/parser.py`, which applies regexes and heuristics to produce structured fields such as name, email, phone, skills, education, experience, and company names.

## Security & performance notes

- File validation: currently the service checks the file extension. For production, validate file signatures and file size limits.
- Scalability: for high traffic, consider offloading parsing jobs to a background queue (e.g., Celery + Redis) to avoid long request times.
- Authentication: add API keys or OAuth2 if exposing the service publicly.

## Quick start (Windows PowerShell)

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r python_service/requirements.txt
uvicorn python_service.app:app --reload --port 8000
```
