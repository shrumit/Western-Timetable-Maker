#include "TopKHeap.h"

using namespace std;

template <class T>
TopKHeap<T>::TopKHeap(int capacity)
{
    heap = new pair<int, T>[capacity];
}

template <class T>
TopKHeap<T>::~TopKHeap()
{
    delete[] heap;
}

template <class T>
int TopKHeap<T>::parentIdx(int i)
{
    return (i - 1) / 2;
}

template <class T>
int TopKHeap<T>::minChildIdx(int i)
{
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    int min = -1;

    if (left < count && right < count)
        return (heap[left].first < heap[right].first) ? left : right;
    else {
        if (left < count)
            return left;
        else if (right < count)
            return right;
        else
            return -1; // no children exist
    }
}

template <class T>
void TopKHeap<T>::bubbleDown(int idx)
{
    int minChild = minChildIdx(idx);
    if (minChild == -1)
        return; // no children exist

    if (heap[minChild].first < heap[idx].first) {
        swap(minChild, idx);
        idx = minChild;
        bubbleDown(idx);
    }
}

template <class T>
void TopKHeap<T>::bubbleUp(int idx)
{
    if (idx == 0)	
        return;

    int parent = parentIdx(idx);
    if (heap[parent].first > heap[idx].first) {
        swap(parent, idx);
        idx = parent;
        bubbleUp(idx);
    }
}

template <class T>
bool TopKHeap<T>::attemptInsert(pair<int, T> element)
{
    if (count < capacity) // insert at end then bubble up
    {
        heap[count] = element;
        bubbleUp(count++);
        return true;
    }
    else // replace head if head is lesser then bubble down
    {
        if (element.first > heap[0].first) {
            heap[0] = element;
            bubbleDown(0);
            return true;
        }
    }
    return false;
}

template <class T>
int TopKHeap<T>::getCapacity()
{
    return capacity;
}