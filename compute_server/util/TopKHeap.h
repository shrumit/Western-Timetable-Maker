/*
 *  This data structure stores the topmost K inserted pair entries <int, T>, ranked by the first component (int).
 *
 *  It is implemented using a modified array min-heap and offers O(logK) insertion time.
 *  Thus, getting the topmost K elements going through a list of N elements using this data 
 *  structure is of O(N*logK) time complexity.
 *
 */

#ifndef TOPKHEAP_H
#define TOPKHEAP_H

#include <utility>

template <class T>
class TopKHeap {

private:
    int capacity;
    int count = 0;

    int parentIdx(int i)
    {
        return (i - 1) / 2;
    }

    int minChildIdx(int i)
    {
        int left = 2 * i + 1;
        int right = left + 1;

        if (right < count) // implies (left < count)
            return (heap[left].first < heap[right].first) ? left : right;
        else if (left < count)
            return left;
        else
            return -1;
    }

    void swap(int i, int j)
    {
        std::pair<int, T> temp = heap[i];
        heap[i] = heap[j];
        heap[j] = temp;
    }

    void bubbleDown(int idx)
    {
        int minChild = minChildIdx(idx);
        if (minChild == -1) // no children exist
            return;

        if (heap[minChild].first < heap[idx].first) {
            swap(minChild, idx);
            idx = minChild;
            bubbleDown(idx);
        }
    }

    void bubbleUp(int idx)
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

public:
    std::pair<int, T>* heap; // Top of heap is the Kth largest element from stream.

    TopKHeap(int capacity = 7)
    {
        this->capacity = capacity;
        heap = new std::pair<int, T>[capacity];
    }

    ~TopKHeap()
    {
        delete[] heap;
    }

    bool insert(std::pair<int, T> element)
    {
        if (count < capacity) {
            heap[count] = element;
            bubbleUp(count++);
            return true;
        }
        else if (element.first > heap[0].first) {
            heap[0] = element;
            bubbleDown(0);
            return true;
        }
        else
            return false;
    }

    int getCapacity()
    {
        return capacity;
    }

    int getCount()
    {
        return count;
    }
};

#endif