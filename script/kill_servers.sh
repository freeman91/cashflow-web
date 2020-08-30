#!/bin/zsh

yellow="\033[33m"
green="\033[32m"

servePID=$(ps -c | grep node | xargs)
if [[ ${#servePID} -gt 0 ]]; then
    # if the node server is running kill it
    echo -e "${yellow}\tShutting down cashflow node server${endColor}"
    servePID=$(echo $servePID | egrep -o "^[0-9]*\s")
    kill $(echo $servePID)
fi

if [[ -f 'tmp/pids/server.pid' ]]; then
    echo -e "${yellow}\tShutting down cashflow rails server${endColor}"
    # if the rails server is running kill it
    kill $(cat tmp/pids/server.pid)
fi