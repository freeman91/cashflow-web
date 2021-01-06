## Environment setup

## install yarn dependencies

```
brew install yarn
yarn install
```

## spin up development server

```
yarn start
```

## Jupiter deployment

```
# execute build script
yarn run build:jupiter

# spin up the frontend server
serve -s build -l 3000

# detachted
nohup serve -s build -l 3000 >> tmp/log/frontend.log &
```
