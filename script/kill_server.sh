#!/bin/zsh

yellow="\033[33m"
green="\033[32m"
endColor="\033[97m"

servePID=$(ps -c | grep node | xargs)
if [[ ${#servePID} -gt 0 ]]; then
    # if the node server is running kill it
    echo -e "${yellow}\tShutting down cashflow node server${endColor}"
    servePID=$(echo $servePID | egrep -o "^[0-9]*\s")
    kill $(echo $servePID)
fi

echo -e "${green}\t${check}Node server is shut down${endColor}"
