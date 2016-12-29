#pragma once

#include <stdint.h>

struct Week 
{
  uint32_t mon;
  uint32_t tue;
  uint32_t wed;
  uint32_t thu;
  uint32_t fri;
  Week()
  {
	mon = 0;
	tue = 0;
	wed = 0;
	thu = 0;
	fri = 0;
  }
};

