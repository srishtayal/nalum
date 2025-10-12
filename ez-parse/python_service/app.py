from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import tempfile
import importlib.util
import json
import os

app = FastAPI(title="ez-parse-service")

# Lazy-load the existing parser module from the repository
def load_parser_module():
    repo_parser_path = os.path.join(os.path.dirname(__file__), "..", "Resume-Parser", "parser.py")
    repo_parser_path = os.path.abspath(repo_parser_path)
    spec = importlib.util.spec_from_file_location("resume_parser", repo_parser_path)
    parser = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(parser)
    return parser

parser = load_parser_module()

@app.post("/parse")
async def parse_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(('.pdf')):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    # Save uploaded file to a temporary file on disk (pdfminer expects a file path)
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp_path = tmp.name
            tmp.seek(0)
            content = await file.read()
            if not content:
                raise HTTPException(status_code=400, detail="The uploaded file is empty")
            tmp.write(content)
            tmp.truncate()

        # Use the repository parser to extract text and convert to JSON/dict
        result_list = parser.extract_pdf(tmp_path)
        result = parser.get_many(result_list)

        return JSONResponse(content=result)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        # Clean up temporary file
        try:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
        except Exception:
            pass
