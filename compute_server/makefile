CC = emcc
CFLAGS = -std=gnu++11 -Wall -Wextra -pedantic -O3 -DMEASURETIME
OBJS = Computer.o Evaluator.o

main: $(OBJS)
	$(CC) $(CFLAGS) $(OBJS) -o a.out.html

Computer.o: computer.cpp Week.h
	$(CC) $(CFLAGS) -c computer.cpp -o Computer.o

Evaluator.o: Evaluator.cpp Evaluator.h Week.h
	$(CC) $(CFLAGS) -c Evaluator.cpp -o Evaluator.o

clean:
	rm -f *.o *~ *.out a.out.* main
