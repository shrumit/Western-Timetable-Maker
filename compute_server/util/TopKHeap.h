/*
Copyright (C) Shrumit Mehta 2024
This file is part of Western Timetable Maker.
Western Timetable Maker is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
Western Timetable Maker is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License
along with Western Timetable Maker.  If not, see <http://www.gnu.org/licenses/>.
*/

/*
 *  This data structure stores the topmost K inserted pair entries <double, T>, ranked by the first component (double).
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
        std::pair<double, T> temp = heap[i];
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
    std::pair<double, T>* heap; // Top of heap (index 0) is the Kth largest element from stream.

    TopKHeap(int capacity = 7) : capacity(capacity) , heap(new std::pair<double, T>[capacity])
    { }

    ~TopKHeap()
    {
        delete[] heap;
    }

    bool offer(double score, const T& payload)
    {
        if (count < capacity) {
            heap[count] = make_pair(score, payload);
            bubbleUp(count++);
            return true;
        }
        else if (score > heap[0].first) {
            heap[0] = make_pair(score, payload);
            bubbleDown(0);
            return true;
        }
        
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
