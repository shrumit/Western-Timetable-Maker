#pragma once

#include <stdint.h>

enum WeekIndex { 
    MON,
    TUE,
    WED,
    THU,
    FRI,
    WEEK_SIZE 
};

struct Week {
    uint_fast32_t day[WEEK_SIZE];

    Week()
    {
        for (int i = 0; i < WEEK_SIZE; i++)
            day[i] = 0;
    }
};
