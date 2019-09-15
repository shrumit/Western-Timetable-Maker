#include "TopKHeap.h"
#include <iostream>
#include <vector>
#include <string>

using namespace std;

string vecToString(vector<int> vec) {
    string ret;
    for (int i = 0; i < vec.size(); i++)
        ret += to_string(vec[i]) + ".";
    return ret;
}

int main()
{

    TopKHeap<int> test0;
    cout << "test0.getCapacity():" << test0.getCapacity() << endl;

    TopKHeap<int> test1(7);
    test1.offer(1.0, 1);
    test1.offer(1.0, 2);
    test1.offer(1.0, 3);
    test1.offer(1.0, 4);
    test1.offer(1.0, 5);
    test1.offer(1.0, 6);
    test1.offer(2.0, 7);
    test1.offer(2.0, 8);
    test1.offer(1.0, 9);
    test1.offer(2.0, 10);
    test1.offer(2.0, 11);
    test1.offer(3.0, 12);
    test1.offer(2.0, 13);
    test1.offer(1.0, 14);

    for (int i = 0; i < test1.getCount(); i++)
        cout << test1.heap[i].first << "," << test1.heap[i].second << " ; ";
    cout << endl;

    TopKHeap<int> test2(6);
    test2.offer(1.0, 1);
    test2.offer(14.0, 14);
    test2.offer(2.0, 2);
    test2.offer(7.0, 7);
    test2.offer(3.0, 3);
    test2.offer(4.0, 4);
    test2.offer(9.0, 9);
    test2.offer(10.0, 10);
    test2.offer(5.0, 5);
    test2.offer(8.0, 8);
    test2.offer(13.0, 13);
    test2.offer(11.0, 11);
    test2.offer(12.0, 12);
    test2.offer(6, 6);


    for (int i = 0; i < test2.getCount(); i++)
        cout << test2.heap[i].first << "," << test2.heap[i].second << " ; ";
    cout << endl;



    TopKHeap<vector<int>> test3(2);
    vector<int> v;

    v.push_back(1);
    test3.offer(2,v);
    
    v.push_back(2);
    test3.offer(3,v);

    v.push_back(3);
    test3.offer(4,v);

    v.push_back(4);
    test3.offer(1,v);

    for (int i = 0; i < test3.getCount(); i++)
        cout << test3.heap[i].first << "," << vecToString(test3.heap[i].second) << " ; ";
    cout << endl;


    return 0;
}

