# spin up backend
echo -e "${yellow}Spinning up rails server${endColor}"
rails s -d -p 3001
if [[ $? -gt 0 ]]; then
    echo -e "${red}\t${cross}Error creating rails server${endColor}"
    exit 1
fi

# spin up front end
yarn run start
if [[ $? -gt 0 ]]; then
    echo -e "${red}\t${cross}Error creating node server${endColor}"
    exit 1
fi