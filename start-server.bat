@echo off
echo Starting local server...
cd /d "%~dp0"
C:\Users\student\AppData\Local\Python\bin\python.exe -m http.server 8000
