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
  if ((table.mon & section.mon > 0) ||
      (table.tue & section.tue > 0) ||
      (table.wed & section.wed > 0) ||
      (table.thu & section.thu > 0) ||
      (table.fri & section.fri > 0))
    return true;
  else
    return false;
}

void addToTable(Week& table, const Week& section)
{
  table.mon |= section.mon;
  table.tue |= section.tue;
  table.wed |= section.wed;
  table.thu |= section.thu;
  table.fri |= section.fri;
}

void removeFromTable(Week& table, const Week& section)
{
  table.mon ^= section.mon;
  table.tue ^= section.tue;
  table.wed ^= section.wed;
  table.thu ^= section.thu;
  table.fri ^= section.fri;  
}

void recurse (Week& table, vector<int>& solution, const vector<vector<Week>>& components, int depth = 0)
{
  cout << "Level " << depth << endl;
  if (depth == components.size())
  {
    snapshot(table, solution);
    return;
  }
  
  cout << "components[depth].size():" << components[depth].size() << endl;
  for (int i = 0; i < components[depth].size(); i++)
  {
    if (isConflict(table, components[depth][i]))
      continue;
    
    solution[depth] = i;
    addToTable(table, components[depth][i]);
    recurse (table, solution, components, depth+1);
    removeFromTable(table, components[depth][i]);
  }
}


int main (int argc, char* argv[])
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
      cin >> section.mon;
      cin >> section.tue;
      cin >> section.wed;
      cin >> section.thu;
      cin >> section.fri;
      components[i].push_back(section);
    }
  }

  Week table;
  vector<int> solution(comp_size);
  recurse(table, solution, components);
}
