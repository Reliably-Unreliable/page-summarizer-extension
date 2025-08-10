#!/usr/bin/env python3
"""
Startup script for the Page Summarizer backend API
"""
import uvicorn
import os
import sys

def main():
    # Check if .env file exists
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    if not os.path.exists(env_path):
        print("❌ .env file not found!")
        print("Please create a .env file based on env.example and add your GEMINI_API_KEY")
        sys.exit(1)
    
    print("🚀 Starting Page Summarizer API...")
    print("📍 Server will be available at: http://localhost:8000")
    print("📖 API documentation at: http://localhost:8000/docs")
    print("🔄 Press Ctrl+C to stop the server")
    print()
    
    try:
        uvicorn.run(
            "main:app",
            host="localhost",
            port=8000,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n👋 Server stopped")

if __name__ == "__main__":
    main()