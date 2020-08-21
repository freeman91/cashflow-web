#!/bin/zsh

# Run this script on juptiter when you want to deploy the newest release

red="\033[31m"
yellow="\033[33m"
green="\033[32m"
endColor="\033[97m"
check="✔"
cross="✘"

echo -e "${yellow}Shutting down cashflow servers${endColor}"
# kill the front end server
servePID=$(ps -c | grep node | xargs)
servePID=$(echo $servePID | egrep -o "^[0-9]*\s")
kill -9 $(echo $servePID)

# kill the backend server
kill -9 $(cat tmp/pids/server.pid)

echo -e "${yellow}Fetching and building latest cashflow repo${endColor}"
# update local repo from origin master
git pull origin master

# build prod optimized server
npm run build:jupiter

echo -e "${yellow}Spinning up cashflow servers${endColor}"
# spin up backend
rails s -d -p 3001 --binding=0.0.0.0

# spin up front end
nohup serve -s build -l 3000 >> tmp/log/frontend.log &

echo -e "${green}cashflow successfully deployed to jupiter${endColor}"