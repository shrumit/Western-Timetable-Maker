#include "WeekendEval.h"

using namespace std;

void WeekendEval::evaluate(const Week& table, const vector<int>& solution)
{
	double score = computeScore(table);
		
	if (score > maxScore)
		save(solution);

}

double WeekendEval::computeScore(const Week& table)
{
	double score = 0;
	if (table.day[MON] == 0)
		score++;
	if (table.day[FRI] == 0)
		score++;
		
	return score;
}
