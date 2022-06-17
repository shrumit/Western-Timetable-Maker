# Western Timetable Maker
*Conflict-free and optimal undergraduate course timetable generator for [UWO](http://www.uwo.ca/).*

[https://western.ttmaker.ca](https://western.ttmaker.ca/)

## Overview

A web application to automatically produce valid undergrad course timetables for the University of Western Ontario. The frontend SPA is written with Vue.js. The backend is a Node.js server that invokes a C++ program that does the main computing.

Data comes from [timetable-scraper-java](https://github.com/shrumit/timetable-scraper-java).

## Getting started

### Project structure

    .
    ├── compute_server                   # backend Node/C++ processing server
	├── conf                             # misc infra files
    └── site/ttmaker
	    └── src                          # frontend Vue app


### Running locally

### Frontend

1. First run [timetable-scraper-java](https://github.com/shrumit/timetable-scraper-java) to produce  `master.json` and `search.json` and place them in `site/ttmaker/src/`.

2. Navigate to `site/ttmaker/`.

3. Run `npm ci` to download dependencies.

4. Run `npm run serve` to build and serve the site locally with hot reload.

5. Run `npm run build` to package everything for production. Production files will be created in `dist/`.

### Backend (compute API)

`compute_server/` contains a Node.js HTTP server to receive data and interface with a C++ executable that computes and evaluates valid timetables. For simplicity, this is a stateless pure function and relies on the frontend to send it all the data that it needs.

1. Navigate to `compute_server/`.

2. Run `make` to compile the C++ program.

3. Run `npm ci` to download dependencies.

4. Run `node server.js` to start the backend server.

## License

[AGPLv3](https://github.com/shrumit/Western-Timetable-Maker/blob/master/LICENSE).
