# Western Timetable Maker
*Conflict-free and optimal undergraduate course timetable generator for [UWO](http://www.uwo.ca/).*

[https://western.ttmaker.ca](https://western.ttmaker.ca/)

## Getting started

    .
    ├── compute_server                   # backend Node/C++ npm project root
    ├── site/ttmaker                     # frontend npm project root
	│   └── src                          # Vue app
    ├── LICENSE
    └── README.md

### Problem basis

A student wishes to enroll in some set of courses (classes). Every course is offered in one or more sections (divisions) and the student must select one section for each course. A section occupies some intervals of time in the week. A valid weekly timetable is one where none of the selected sections overlap. A fitness function can be applied to a valid timetable to evaluate its desirability based on the student's preferences. The k most optimal valid timetables are to be produced.

This problem is a relatively simple instance in a broad category of combinatorial optimization problems known as "timetable scheduling". Most problems of this class do not have (known) polynomial-time exact solution. In practice, as in this case, there are natural limits to the input size due to which a highly-optimized implementation is still feasible.

In this application, the timetabling problem is solved using [backtracking](https://en.wikipedia.org/wiki/Backtracking) and only the k best solutions are stored in a heap. The efficiency of this implementation comes from using bits to represent timeslots, allowing the use of bitwise operations to detect conflicts and evaluate fitness. Naturally, this portion is implemented in C++.

### Project structure

* [timetable-scraper-java](https://github.com/shrumit/timetable-scraper-java) is used to produce `master.json` and `search.json` which are to be placed in `site/ttmaker/src/`

* The frontend is a Vue.js/Vuex single-page application.

* `compute_server/` contains a C++ program that computes and evaluates valid timetables. It is wrapped by a small Node.js script to create a RESTful API.

* Flow of data:

	1. User loads the site. Scraped course data is sent as a static asset.
	
	2. User searches for and selects courses. The user may deselect course sections.
	
	3. User presses "Compute". The relevant data is sent to the compute API.
	
	4. The compute API returns k-most optimal valid solutions for the various fitness functions.
	
	5. The user's course/section selections and last-computed solutions are persisted in the browser's localStorage.

### Running locally

Backend

1. Go to `compute_server/`

2. Run `make` to compile the C++ program

3. Run `npm install` to download dependencies

4. Run `node server.js` to start the backend server

Frontend

1. Go to `site/ttmaker/`

2. Run `npm install` to download dependencies

3. Run `npm serve` to serve site on localhost with hot-reload. Make sure `search.json` and `master.json` have been generated and placed in `site/ttmaker/src/`.

4. Run `npm build` to package everything for production. Files will be created in `dist/`.


## Contributing

Fork the repo > Push changes to the `develop` branch of your fork > Open a Pull Request to this repo

## License

[AGPLv3](https://github.com/shrumit/Western-Timetable-Maker/blob/master/LICENSE).
