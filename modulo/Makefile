obj-m+=modulo_procesos.o
obj-m+=modulo_stat_mem.o

all: 
	make -C /lib/modules/$(shell uname -r)/build/ M=$(PWD) modules
clean: 
	make -C /lib/modules/$(shell uname -r)/build/ M=$(PWD) clean
