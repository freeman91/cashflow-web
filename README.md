[![Test](https://github.com/freeman91/cashflow-web/workflows/Test/badge.svg)](https://github.com/freeman91/cashflow-web/actions)

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
