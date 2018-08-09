    #include <linux/fs.h>
    #include <linux/init.h>
    #include <linux/kernel.h>
    #include <linux/sched.h>
    #include <linux/module.h>
    #include <linux/seq_file.h>
    #include <linux/proc_fs.h>

    static int meminfo_proc_show(struct seq_file *m, void *v){
	    int cont = 0;
        struct task_struct *task;
        unsigned long size;

        seq_printf(m,"{\"lista\":[\n");

        for_each_process(task){
		  struct list_head *list;
		  seq_printf(m,"{\"NAME\":\"%s\",\"USER\":\"%d\",\"PID\":\"%d\",\"CPU\":\"%d\",\"STATUS\":",
                  task->comm,
                  task->cred->uid.val,
		          task->pid,
                  task->utime);
		if(task->state == 0){
			seq_printf(m,"\"RUNNING\"");
		}
		if(task->state == 1){
			seq_printf(m,"\"INTERRUPTIBLE\"");
		}
		if(task->state == 2){
			seq_printf(m,"\"UNINTERRUPTIBLE\"");
		}
		if(task->state == 4){
			seq_printf(m,"\"ZOMBIE\"");
		}
		if(task->state == 8){
			seq_printf(m,"\"STOPPED\"");
		}
		if(task->state == 16){
			seq_printf(m,"\"SWAPPING\""); //o Muerto
		}
		if(task->state == 32){
			seq_printf(m,"\"Espera Exclusiva\"");
		}
		cont = cont + 1;

//        down_read(&task->mm->mmap_sem);       
        if(task->mm){
            size = (task->mm->mmap->vm_end - task->mm->mmap->vm_start);
            seq_printf(m,",\"MEM\":\"%lu\"}",size);            
        }else{
            seq_printf(m,",\"MEM\":\"0\"}");
        }
//        up_read(&task->mm->mmap_sem);
        
        seq_printf(m,",\n");
        }

        seq_printf(m,"{\"NAME\":\"ultimo\"}]\n}\n");
        return 0;
    }

    static void __exit final(void) //Salida de modulo
    {   
        printk(KERN_INFO "Cleaning Up.\n");
    }

    static int meminfo_proc_open(struct inode *inode, struct file *file)
    {
        return single_open(file, meminfo_proc_show, NULL);
    }

    static const struct file_operations meminfo_proc_fops = {
        .open       = meminfo_proc_open,
        .read       = seq_read,
        .llseek     = seq_lseek,
        .release    = single_release,
    };

    static int __init inicio(void) //Escribe archivo en /proc
    {
        proc_create("procesos_201503666", 0, NULL, &meminfo_proc_fops);
        return 0;
    }


    module_init(inicio);
    module_exit(final);

MODULE_LICENSE("GPL");
 
