#include <stdlib.h>
#include <iostream>
#include <cstdint>
#include <vector>

#include "Week.h"
#include "WeekendEval.h"

using namespace std;

WeekendEval weekend;

void snapshot(const Week& table, const vector<int>& solution)
{
	weekend.evaluate(table, solution);
}

bool isConflict(const Week& table, const Week& section)
{
	for (int i = 0; i < WEEK_SIZE; i++) {
		if (table.day[i] & section.day[i])
			return true;
	}
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
  cout << "Level " << depth << endl;
  if (depth == components.size())
  {
    snapshot(table, solution);
    return;
  }
  
  cout << "components[depth].size():" << components[depth].size() << endl;
  for (size_t i = 0; i < components[depth].size(); i++)
  {
    if (isConflict(table, components[depth][i]))
      continue;
    
    solution[depth] = i;
    addToTable(table, components[depth][i]);
    recurse (table, solution, components, depth+1);
    removeFromTable(table, components[depth][i]);
  }
}


int main ()
{
  int comp_size;
  cin >> comp_size;
  
  vector<vector<Week>> components(comp_size);

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

  Week table;
  vector<int> solution(comp_size);
  recurse(table, solution, components);
}
