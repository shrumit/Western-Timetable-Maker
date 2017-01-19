#include "WeekendEval.h"

using namespace std;

void WeekendEval::evaluate(const Week& table, const vector<int>& solution)
{
	int score = 0;
	if (table.day[MON] == 0)
		score++;
	if (table.day[FRI] == 0)
		score++;
	
	if (score > maxScore) {
		save(solution);
	}
}
