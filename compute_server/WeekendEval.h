#pragma once

#include "Evaluator.h"

class WeekendEval : public Evaluator
{
public:
	WeekendEval() : Evaluator("weekend") {}
	void evaluate(const Week& table, const std::vector<int>& solution);
	double computeScore(const Week& table);
};
