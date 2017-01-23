#pragma once

#include "Week.h"
#include <vector>
#include <string>

class Evaluator
{
public:
	virtual void evaluate(const Week&, const std::vector<int>&) = 0;
	virtual double computeScore(const Week&) = 0;
	void emit();

protected:
	Evaluator(std::string idName, double maxScore = -1) : idName(idName), maxScore(maxScore) {}
	void save(const std::vector<int>&);

	std::string idName;
	double maxScore;
	std::vector<int> savedSolution;
};
