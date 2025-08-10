import os
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(title="Page Summarizer API", version="1.0.0")

# Configure CORS to allow Chrome extension
app.add_middleware(
    CORSMiddleware,
    allow_origins=["chrome-extension://*", "http://localhost:*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini AI
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    logger.error("GEMINI_API_KEY not found in environment variables")
    raise ValueError("GEMINI_API_KEY is required")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

class SummarizeRequest(BaseModel):
    title: str
    content: str
    url: str

class SummarizeResponse(BaseModel):
    summary: str
    title: str
    url: str

@app.get("/")
async def root():
    return {"message": "Page Summarizer API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/summarize", response_model=SummarizeResponse)
async def summarize_page(request: SummarizeRequest):
    try:
        logger.info(f"Summarizing page: {request.title}")
        
        # Prepare the prompt for Gemini
        prompt = f"""
        Please provide a comprehensive summary of the following web page content.
        The summary should be:
        - Clear and concise (3-5 paragraphs)
        - Include the main points and key information
        - Well-structured and easy to read
        - Focus on the most important aspects
        
        Page Title: {request.title}
        Page URL: {request.url}
        
        Content:
        {request.content}
        
        Please provide only the summary without any additional commentary.
        """
        
        # Generate summary using Gemini
        response = model.generate_content(prompt)
        
        if not response.text:
            raise HTTPException(status_code=500, detail="Failed to generate summary")
        
        summary = response.text.strip()
        
        logger.info(f"Successfully generated summary for: {request.title}")
        
        return SummarizeResponse(
            summary=summary,
            title=request.title,
            url=request.url
        )
        
    except Exception as e:
        logger.error(f"Error summarizing page: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating summary: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)