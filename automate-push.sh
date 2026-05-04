#!/bin/bash

# Usage: ./automate-push.sh "your commit message"

# Default message if none is provided
MESSAGE=${1:-"feat: automated update and sync"}

echo "🔗 Configuring remote and branch..."
git init
git remote set-url origin https://github.com/Janvi-0620/e-commerce.git 2>/dev/null || git remote add origin https://github.com/Janvi-0620/e-commerce.git
git branch -M main

echo "🔍 Checking status..."
git status -s

echo "➕ Adding changes..."
git add .

echo "💾 Committing with message: $MESSAGE"
git commit -m "$MESSAGE"

echo "🚀 Pushing to GitHub (forcing if necessary)..."
# -f is used here to ensure the initial push succeeds even if the remote is not empty
git push -u origin main || git push -u origin main -f

echo "✅ Done!"