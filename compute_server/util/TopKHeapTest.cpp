#include "TopKHeap.h"
#include <iostream>

using namespace std;

int main()
{

    TopKHeap<int> test0;
    cout << "test0.getCapacity():" << test0.getCapacity() << endl;

    TopKHeap<int> test1(7);
    test1.insert(make_pair(1.0, 1));
    test1.insert(make_pair(1.0, 2));
    test1.insert(make_pair(1.0, 3));
    test1.insert(make_pair(1.0, 4));
    test1.insert(make_pair(1.0, 5));
    test1.insert(make_pair(1.0, 6));
    test1.insert(make_pair(2.0, 7));
    test1.insert(make_pair(2.0, 8));
    test1.insert(make_pair(1.0, 9));
    test1.insert(make_pair(2.0, 10));
    test1.insert(make_pair(2.0, 11));
    test1.insert(make_pair(3.0, 12));
    test1.insert(make_pair(2.0, 13));
    test1.insert(make_pair(1.0, 14));

    for (int i = 0; i < test1.getCapacity(); i++)
        cout << test1.heap[i].first << "," << test1.heap[i].second << " ; ";
    cout << endl;

    TopKHeap<int> test2(6);
    test2.insert(make_pair(1.0, 1));
    test2.insert(make_pair(14.0, 14));
    test2.insert(make_pair(2.0, 2));
    test2.insert(make_pair(7.0, 7));
    test2.insert(make_pair(3.0, 3));
    test2.insert(make_pair(4.0, 4));
    test2.insert(make_pair(9.0, 9));
    test2.insert(make_pair(10.0, 10));
    test2.insert(make_pair(5.0, 5));
    test2.insert(make_pair(8.0, 8));
    test2.insert(make_pair(13.0, 13));
    test2.insert(make_pair(11.0, 11));
    test2.insert(make_pair(12.0, 12));
    test2.insert(make_pair(6, 6));

    for (int i = 0; i < test2.getCapacity(); i++)
        cout << test2.heap[i].first << "," << test2.heap[i].second << " ; ";
    cout << endl;

    return 0;
}