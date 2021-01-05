#!/bin/zsh

# Run this script on juptiter when you want to deploy the newest release

check="✔"
cross="✘"
red="\033[31m"
yellow="\033[33m"
green="\033[32m"
endColor="\033[97m"

zsh script/kill_server.sh
if [[ $? -gt 0 ]]; then
    echo -e "${red}\t${cross}Error killing the node server${endColor}"
    exit 1
fi

echo -e "${yellow}\tFetching and building latest cashflow-web repo${endColor}"
# update local repo from origin master
git pull origin master
if [[ $? -gt 0 ]]; then
    echo -e "${red}\t${cross}Error pulling remote tree${endColor}"
    exit 1
fi

echo -e "${green}\t${check}latest master fetched${endColor}"

# build prod optimized server
echo -e "${yellow}Building node server${endColor}"
npm run build:jupiter
if [[ $? -gt 0 ]]; then
    echo -e "${red}\t${cross}Error building node server${endColor}"
    exit 1
fi

echo -e "${green}\t${check}production optimized build complete${endColor}"

# spin up front end
nohup serve -s build -l 3000 >> tmp/log/frontend.log &
if [[ $? -gt 0 ]]; then
    echo -e "${red}\t${cross}Error creating node server${endColor}"
    exit 1
fi

echo -e "${green}\t${check}cashflow-web successfully deployed${endColor}"
