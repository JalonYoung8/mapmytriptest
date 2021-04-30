# MySQL Commands for Map My Trip

## Connect to your MySQL instance
gcloud sql connect INSTANCE-NAME --user=root --quiet

## Create a new database for Map My Trip
```
CREATE DATABASE MapMyTrip;​
USE MapMyTrip;
```

## Create a new Trips table
```
CREATE TABLE trips ( trip_id int NOT NULL AUTO_INCREMENT PRIMARY KEY, trip_name varchar(255), trip_year varchar(255), description varchar(255) );
```