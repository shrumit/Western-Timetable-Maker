#include <bitset>
#include <string>
#include <iostream>
#include <random>

using namespace std;

int main()
{
	int cc_n = 10; //coursecomps
	int sec_n = 20; //sections
	int ts_n = 15; // timeslot size

	string s = "./main";
	s+= " " + to_string(cc_n);
		
	random_device rd;
	mt19937 gen(rd());
	uniform_int_distribution<> dis(0, 27);
	uniform_int_distribution<> dis2(0, 2);
	int zero = 0;
	int one = 0;
	
	for (int i = 0; i < cc_n; i++) {
		s += " " + to_string(sec_n);
		
		for (int j = 0; j < sec_n; j++) {
			for (int k = 0; k < 5; k++) {

				int bs = 0;
				if (dis2(gen) != 0){
					bs = ts_n;
					bs <<= dis(gen);
					one++;
				} else
					zero++;
				
				s += " " + to_string(bs);
			}
		}
	}
				
	cout << s << endl << to_string(zero) << endl << to_string(one) << endl;
}
