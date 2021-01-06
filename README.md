## Dev Env setup

## spin up the frontend
```
$ yarn start
```

## Jupiter deployment

Clone repo then:
```
# install npm dependencies 
$ yarn install

# execute build script (optimized production build)
$ yarn run build:jupiter

# spin up the frontend server
$ serve -s build -l 3000
```