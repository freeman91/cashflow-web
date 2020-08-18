## Dev Env setup

### start postgresql server if it isn't up and running  
```
$ pg_ctl -D /usr/local/var/postgres start
```

### start mailcatcher server  
```
$ mailcatcher
```

## spin up the backend
```
$ rails s -p 3001
```

## spin up the frontend
```
$ yarn start
```



## Jupiter deployment

Clone repo then:
```
# install npm dependencies 
$ npm install

# install rails gems 
$ bundle install

# create postgres user if it doesn't exist
$ psql
admin=# CREATE USER cashflow_user WITH PASSWORD 'cashflow_password';
admin=# ALTER ROLE cashflow_user CREATEROLE CREATEDB;

# create cashflow db
$ rails db:create

# restore db from a backup
$ psql cashflow_development < cashflow_backup_xxx.bak

# execute build script (optimized production build)
$ npm run build:jupiter

# spin up the frontend server
$ serve -s build -l 3000

# spin up the backend server
$ rails s -p 3001 -d --binding=0.0.0.0
