# Western Timetable Maker
*Generate conflict-free [UWO](http://www.uwo.ca/) course timetables automatically.*

### [Site](https://www.ttmaker.ca/)

## About
Western Timetable Maker is a website that produces student course timetables automatically, and is a faster alternative to the manual process of doing so. WTM is the first and only known such application. It aims to serve two main use cases:

1. Instantly determining whether a set of courses can be taken together at all.
2. Generating an optimal course timetable based on section constraints and user preferences.

## Algorithm
The problem of timetable generation is similar to the NP [N-queens problem](https://en.wikipedia.org/wiki/Eight_queens_puzzle). Whereas solving the N-queens problem requires generating just one non-conflicting solution, WTM requires generating all possible solutions in order to determine the best (making it NP-Hard since, unlike N-Queens, verification cannot be done in polynomial time). Western Timetable Maker uses a backtracking depth-first-search algorithm to generate conflict-free solutions. Course section timeslots are stored as 5 bitfields (for each day of the week) and bitwise arithmetic is used to detect conflicts. The current implementation is optimized enough to work in a reasonable amount of time for most inputs.

## Implementation
Algorithm: JavaScript, (v2: C++)

Frontend: jQuery, Handlebars.js

Backend: Node.js, Nginx, DigitalOcean Ubuntu VPS

## Data
Data is scraped and preprocessed by [timetable-scraper-java](https://github.com/shrumit/timetable-scraper-java).

## Future
* Rewrite algorithm in C++ (see [branch v2](https://github.com/shrumit/Western-Timetable-Maker/tree/v2))
* Support more preferences (see [branch v2](https://github.com/shrumit/Western-Timetable-Maker/tree/v2))
* Use LevelDB/Redis instead of serving from array
* Add authentication or client-side persistence
