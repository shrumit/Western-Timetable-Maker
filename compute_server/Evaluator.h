#pragma once
#include <math.h>
#include <string>
#include <vector>

#include "Week.h"
#include "util/TopKHeap.h"

class Evaluator
{
public:
  static std::vector<Evaluator*> createEvaluators(int capacity = 7);
  void evaluate(const Week&, const std::vector<int>&);
  std::string toString();
  virtual double computeScore(const Week&) = 0;

protected:
  std::string idName;
  TopKHeap<std::vector<int>> store;
    
  Evaluator(std::string idName, int capacity);
  ~Evaluator();
};
