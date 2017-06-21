#include "Evaluator.h"
#include <iostream>

using namespace std;

/* non-static */
Evaluator::Evaluator(string idName, int capacity) 
    : idName(idName)
    , store(capacity) 
{
}

Evaluator::~Evaluator()
{
    delete &store;
}

void Evaluator::evaluate(const Week& table, const vector<int>& solution)
{
    double score = computeScore(table);
    store.insert(make_pair(score, solution));
}

string Evaluator::toString()
{
    string ret;
    ret += idName + " " + to_string(store.getCount());
    for (int i = 0; i < store.getCapacity(); i++) {
        for (size_t j = 0; j < store.heap[i].second.size(); j++) {
            ret += "." + to_string(store.heap[i].second[j]);
        }
    }
    return ret;
}

/* EVALUATORS */

class LongWeekend : public Evaluator
{
    double computeScore(const Week& table) override
    {
        double score = 0;
        if (table.day[MON] == 0)
            score++;
        if (table.day[FRI] == 0)
            score++;

        return score;
    }

public:
    LongWeekend(string idName, int capacity) : Evaluator(idName, capacity) {}
};

/* static */

vector<Evaluator*> Evaluator::createEvaluators(int capacity)
{
    vector<Evaluator*> evals;
    evals.push_back(new LongWeekend("long_weekend", capacity));
    evals.push_back(new LongWeekend("long_weekend2", capacity));
    evals.push_back(new LongWeekend("long_weekend3", capacity));
    return evals;
}