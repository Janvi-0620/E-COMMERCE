@echo off
:: Usage: automate-push.bat "your commit message"

set "msg=%~1"
if "%msg%"=="" set "msg=feat: automated update and sync"

echo 🔗 Configuring remote and branch...
git init
git remote set-url origin https://github.com/Janvi-0620/e-commerce.git 2>nul || git remote add origin https://github.com/Janvi-0620/e-commerce.git
git branch -M main

echo  Starting automated push...

:: 1. Force Git to remember your credentials so it doesn't hang
git config --global credential.helper wincred

:: 2. Stage all changes
git add .

:: 3. Only commit if there are actual changes to prevent the script from stopping
git commit -m "%msg%" || echo ℹ️ No new changes to commit.

:: 4. Push to GitHub
:: We use -f (force) for the initial push to overwrite any default README/License 
:: created on the GitHub website that might be blocking your local code.
echo 🚀 Uploading to https://github.com/Janvi-0620/e-commerce.git...
git push -u origin main -f

echo.
echo ✅ Process complete! Refresh your browser at:
echo    https://github.com/Janvi-0620/e-commerce
pause