#include "WeekendEval.h"

using namespace std;

void WeekendEval::evaluate(const Week& table, const vector<int>& solution)
{
	int score = 0;
	if (table.mon == 0)
		score++;
	if (table.fri == 0)
		score++;
	
	if (score > maxScore) {
		save(solution);
	}		
}
