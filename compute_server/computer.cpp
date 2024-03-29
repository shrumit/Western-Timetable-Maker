#include <iostream>
#include <cstdint>
#include <vector>
#include <climits>

#include "Week.h"
#include "Evaluator.h"

using namespace std;

vector<Evaluator*> evals;
size_t validCount;

void snapshot(const Week& table, const vector<int>& solution)
{
  validCount++;
  for (size_t i = 0; i < evals.size(); i++) {
    evals[i]->evaluate(table, solution);
  }
}

bool isConflict(const Week& table, const Week& section)
{
  for (int i = 0; i < WEEK_SIZE; i++)
    if (table.day[i] & section.day[i])
      return true;
  
  return false;
}

void addToTable(Week& table, const Week& section)
{
  for (int i = 0; i < WEEK_SIZE; i++)
    table.day[i] |= section.day[i];
}

void removeFromTable(Week& table, const Week& section)
{
  for (int i = 0; i < WEEK_SIZE; i++)
    table.day[i] ^= section.day[i];
}

void recurse (Week& table, vector<int>& solution, const vector<vector<Week>>& components, size_t depth = 0)
{

  if (depth == components.size())
  {
    snapshot(table, solution);
    return;
  }

  // levelcount[depth]++;

  size_t n = components[depth].size();
  for (size_t i = 0; i < n; i++)
  {
    if (!isConflict(table, components[depth][i]))
    {
      solution[depth] = i;
      addToTable(table, components[depth][i]);
      recurse (table, solution, components, depth+1);
      removeFromTable(table, components[depth][i]);
    }
  }
}

/**
Input is of the form:
<num_components> <num_sections> 5x<day_bitmap>
**/

int main (int argc, char** argv)
{
  int comp_size;
  vector<vector<Week>> components;
  
  // cout << "argc:" << argc << endl;
  // return 0;
  /* get input from args */
  if (argc > 1) // input from arguments
  {
    int index = 0;
    comp_size = stoi(argv[++index]);
    components.resize(comp_size);
    
    // for every component
    for (int i = 0; i < comp_size; i++)
    {
      int sect_size = stoi(argv[++index]);
      
      // for every section
      for (int j = 0; j < sect_size; j++)
      {
        Week section;
        for (int k = 0; k < WEEK_SIZE; k++)
          section.day[k] = stoi(argv[++index]);
        components[i].push_back(section);
      }
    }
  }
  
  /* get input from stdin */
  else
  {
    cin >> comp_size;
    components.resize(comp_size);
    
    // for every component
    for (int i = 0; i < comp_size; i++)
    {
      int sect_size;
      cin >> sect_size;
      
      // for every section
      for (int j = 0; j < sect_size; j++)
      {
        Week section;
        for (int k = 0; k < WEEK_SIZE; k++)
          cin >> section.day[k];
        components[i].push_back(section);
      }
    }
  }
  
  evals = Evaluator::createEvaluators(5); // number signifies top k desired timetables to be stored, per Evaluator
  Week table;
  vector<int> solution(comp_size);
  recurse(table, solution, components);

  // Output is in the format <idname> <num_timetables> comp_size*<section-idx>...
  cout << "info " << to_string(validCount) << endl;
  for (size_t i = 0; i < evals.size(); i++) {
    cout << evals[i]->toString() << endl;
  }
  return 0;
}
