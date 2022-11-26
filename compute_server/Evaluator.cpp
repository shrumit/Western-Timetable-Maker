#include "Evaluator.h"
#include <iostream>

using namespace std;

/* non-static */
Evaluator::Evaluator(string idName, int capacity) : idName(idName) , store(capacity)
{ }

Evaluator::~Evaluator()
{
    delete &store;
}

void Evaluator::evaluate(const Week& table, const vector<int>& solution)
{
    double score = computeScore(table);
    store.offer(score, solution);
}

string Evaluator::toString()
{
    string ret;
    ret += idName + " " + to_string(store.getCount());
    for (int i = 0; i < store.getCount(); i++) {
        ret += " " + to_string(store.heap[i].first);
        for (size_t j = 0; j < store.heap[i].second.size(); j++) {
            ret += " " + to_string(store.heap[i].second[j]);
        }
    }
    return ret;
}


/* EVALUATORS */

class LongWeekend : public Evaluator
{
    double computeScore(const Week& table) override
    {
        uint_fast32_t score = 0;
        if (table.day[MON] == 0) {
            score++;
            if (table.day[TUE] == 0) {
                score++;
                if (table.day[WED] == 0) {
                    score++;
                    if (table.day[THU] == 0) {
                        score++;
                    }
                }
            }
        }
        if (table.day[FRI] == 0) {
            score++;
            if (table.day[THU] == 0) {
                score++;
                if (table.day[WED] == 0) {
                    score++;
                    if (table.day[TUE] == 0) {
                        score++;
                    }
                }
            }
        }
        return (double) score;
    }

public:
    LongWeekend(string idName, int capacity) : Evaluator(idName, capacity) {}
};


class NumHolidays : public Evaluator
{
    double computeScore(const Week& table) override
    {
        uint_fast32_t score = 0;
        for (int i = 0; i < WEEK_SIZE; i++) {
            if (table.day[i] == 0)
                score++;
        }
        return (double) score;
    }

public:
    NumHolidays(string idName, int capacity) : Evaluator(idName, capacity) {}
};


class LateStart : public Evaluator
{
    double computeScore(const Week& table) override
    {
        uint_fast32_t score = 0;
        for (int i = 0; i < WEEK_SIZE; i++) {
            if (table.day[i] != 0) {
                score += table.day[i];
            }
        }
        return (double)score;
    }

public:
    LateStart(string idName, int capacity) : Evaluator(idName, capacity) {}
};


class EarlyStart : public Evaluator
{
    double computeScore(const Week& table) override
    {
        uint_fast32_t score = 0;
        for (int i = 0; i < WEEK_SIZE; i++) {
          if (table.day[i] != 0) {
            score += table.day[i];
          }
        }
        
        // lower day bit is better
        return -1*(double)score;
    }

public:
    EarlyStart(string idName, int capacity) : Evaluator(idName, capacity) {}
};


class LeastGaps : public Evaluator
{
    double computeScore(const Week& table) override
    {
        uint_fast32_t score = 0;
        for (int i = 0; i < WEEK_SIZE; i++) {
            if (table.day[i] != 0) {
                uint_fast32_t temp = table.day[i];
                if ((temp & 65535) == 0)
                  temp >>= 16;
                if ((temp & 255) == 0)
                  temp >>= 8;
                if ((temp & 15) == 0)
                  temp >>= 4;
                if ((temp & 3) == 0)
                  temp >>= 2;
                if ((temp & 1) == 0)
                  temp >>= 1;
                score += temp;
            }
        }
        return (double) -1*score;
    }

public:
    LeastGaps(string idName, int capacity) : Evaluator(idName, capacity) {}
};


/* FACTORY */
vector<Evaluator*> Evaluator::createEvaluators(int capacity)
{
    vector<Evaluator*> evals;
    evals.push_back(new EarlyStart("EarlyClasses", capacity));
    evals.push_back(new LateStart("LateClasses", capacity));
    evals.push_back(new NumHolidays("MostHolidays", capacity));
    evals.push_back(new LongWeekend("LongWeekend", capacity));
    evals.push_back(new LeastGaps("LeastGaps", capacity));
    return evals;
}
