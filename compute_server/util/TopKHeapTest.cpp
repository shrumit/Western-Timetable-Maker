#include "TopKHeap.h"
#include <iostream>

using namespace std;

int main()
{

    TopKHeap<int> test0;
    cout << "test0.getCapacity():" << test0.getCapacity() << endl;

    TopKHeap<int> test1(7);
    test1.insert(make_pair(1, 1));
    test1.insert(make_pair(1, 2));
    test1.insert(make_pair(1, 3));
    test1.insert(make_pair(1, 4));
    test1.insert(make_pair(1, 5));
    test1.insert(make_pair(1, 6));
    test1.insert(make_pair(2, 7));
    test1.insert(make_pair(2, 8));
    test1.insert(make_pair(1, 9));
    test1.insert(make_pair(2, 10));
    test1.insert(make_pair(2, 11));
    test1.insert(make_pair(3, 12));
    test1.insert(make_pair(2, 13));
    test1.insert(make_pair(1, 14));

    for (int i = 0; i < test1.getCapacity(); i++)
        cout << test1.heap[i].first << "," << test1.heap[i].second << " ; ";
    cout << endl;

    TopKHeap<int> test2(6);
    test2.insert(make_pair(1, 1));
    test2.insert(make_pair(14, 14));
    test2.insert(make_pair(2, 2));
    test2.insert(make_pair(7, 7));
    test2.insert(make_pair(3, 3));
    test2.insert(make_pair(4, 4));
    test2.insert(make_pair(9, 9));
    test2.insert(make_pair(10, 10));
    test2.insert(make_pair(5, 5));
    test2.insert(make_pair(8, 8));
    test2.insert(make_pair(13, 13));
    test2.insert(make_pair(11, 11));
    test2.insert(make_pair(12, 12));
    test2.insert(make_pair(6, 6));

    for (int i = 0; i < test2.getCapacity(); i++)
        cout << test2.heap[i].first << "," << test2.heap[i].second << " ; ";
    cout << endl;

    return 0;
}