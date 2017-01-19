CC = g++
CFLAGS = -std=gnu++11
OBJS = Computer.o Evaluator.o Evals.o

main: $(OBJS)
	$(CC) $(CFLAGS) $(OBJS) -o main

Computer.o: computer.cpp
	$(CC) $(CFLAGS) -c computer.cpp -o Computer.o

Evaluator.o: Evaluator.cpp Evaluator.h
	$(CC) $(CFLAGS) -c Evaluator.cpp -o Evaluator.o

Evals.o: WeekendEval.cpp WeekendEval.h
	$(CC) $(CFLAGS) -c WeekendEval.cpp -o Evals.o

clean:
	rm -f *.o *~ main
