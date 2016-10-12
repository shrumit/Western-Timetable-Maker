# Western Timetable Maker
*Generate conflict-free [UWO](http://www.uwo.ca/) course timetables automatically.*

### [Site](https://www.ttmaker.ca/)

## About
Creating a conflict-free course timetable is a tedious and time-consuming process. Western Timetable Maker sidesteps the tedium altogether by generating and sorting timetables automatically. Users can filter out course sections that are full or not available to them. WTM has two main use cases:

1. Determining whether a set of courses can be taken together
2. Generating an optimal course timetable based on constraints and preferences.

## Algorithm
The problem of timetable generation is similar to the [N-queens problem](https://en.wikipedia.org/wiki/Eight_queens_puzzle), differing in that all possible solutions have to be determined.  Western Timetable Maker uses a backtracking depth-first search algorithm to generate conflict-free solutions. The implementation is optimized enough to generate timetables in a reasonable amount of time for most course combinations.

## Implementation
Algorithm: JavaScript

Frontend: jQuery, Handlebars.js

Backend: Node.js, Nginx, DigitalOcean Ubuntu VPS

## Data
Data is scraped by [timetable-scraper-java](https://github.com/shrumit/timetable-scraper-java).

## Future
* Rewrite algorithm in C++
* Support more preferences
* Use LevelDB/Redis instead of serving from array
* Add authentication or client-side persistence