#pragma once

#include <stdint.h>

enum WeekIndex {MON, TUE, WED, THU, FRI, WEEK_SIZE};

struct Week
{
  uint32_t day[5];
  
  Week () {
    for (int i = 0; i < WEEK_SIZE; i++)
      day[i] = 0;
  }
};
