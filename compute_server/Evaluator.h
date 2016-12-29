#pragma once

#include "Week.h"
#include <vector>
#include <string>

class Evaluator
{
public:
	virtual void evaluate(const Week&, const std::vector<int>&) = 0;
	void emit();

protected:
	Evaluator(std::string idName, int maxScore = -1) : idName(idName), maxScore(maxScore) {}
	void save(const std::vector<int>&);

	std::string idName;
	int maxScore;
	std::vector<int> savedSolution;
};
