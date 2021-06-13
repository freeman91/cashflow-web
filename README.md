[![Test](https://github.com/freeman91/cashflow-web/workflows/Test/badge.svg)](https://github.com/freeman91/cashflow-web/actions)

## Environment setup

## install yarn dependencies

```sh
brew install yarn
yarn install
```

## spin up development server

```sh
yarn start:web-only
```

## Jupiter deployment

```sh
# execute build script
yarn run build:jupiter

# spin up the frontend server
serve -s build -l 3000

# detachted
nohup serve -s build -l 3000 >> tmp/log/frontend.log &
```
