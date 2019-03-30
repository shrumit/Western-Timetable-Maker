#include <iostream>
#include <string>
#include <unistd.h>

using namespace std;

int main(int argc, char** argv)
{
	if (argc != 2)
		return -1;
		
	unsigned long long n = stoull(argv[1]);

	usleep(2000000);	

	cout << n*n;
	return 0;
}
