#!/bin/bash
set -e
cd /home/ubuntu/fitness/cloudProject_Healthcare/cloud_3
git pull origin main || true
npm install
pm2 restart health-app || pm2 start server.js --name health-app
