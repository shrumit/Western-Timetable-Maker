#include "Evaluator.h"

#include <iostream>

using namespace std;

void Evaluator::save(const vector<int>& solution)
{
	savedSolution = solution;
}

void Evaluator::emit()
{
	cout << idName << ' ';
	for (auto i : savedSolution)
    	cout << i << ' ';
    cout << endl;
}


