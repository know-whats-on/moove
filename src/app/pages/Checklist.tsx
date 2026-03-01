import { useState } from 'react';
import { useStore, ChecklistTask, TaskStatus } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { CheckSquare, Square, Plus, Trash2, Calendar } from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from 'sonner';
import { HeroBanner } from '../components/HeroBanner';
import { PageLayout } from '../components/PageLayout';
const CowKeys = '/banners/CowKeys.png';
export default function Checklist() {
  const { checklistTasks, updateChecklistTask, addChecklistTask, removeChecklistTask } = useStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleToggle = (id: string, status: TaskStatus) => {
    const newStatus = status === 'To do' ? 'Done' : 'To do';
    updateChecklistTask(id, { status: newStatus });
    if (newStatus === 'Done') toast.success('Task completed');
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addChecklistTask({
      title: newTaskTitle,
      status: 'To do',
      group: 'General'
    });
    setNewTaskTitle('');
    toast.success('Task added');
  };

  const todoTasks = checklistTasks.filter(t => t.status === 'To do');
  const doneTasks = checklistTasks.filter(t => t.status === 'Done');

  return (
    <PageLayout
      header={({ compact }) => (
        <HeroBanner 
          title="Checklist"
          subtitle="Tie up loose ends before you Moove."
          imageSrc={CowKeys}
          imageAlt="Checklist Mascot"
          compact={compact}
        />
      )}
    >
      <div className="p-4 space-y-6 pb-32">
        
        {/* To Do Section */}
        <div>
            <h2 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-3">To Do ({todoTasks.length})</h2>
            <div className="space-y-2">
                {todoTasks.length === 0 && (
                    <div className="text-zinc-500 text-sm italic">Nothing to do! Relax?</div>
                )}
                {todoTasks.map(task => (
                    <TaskItem 
                        key={task.id} 
                        task={task} 
                        onToggle={() => handleToggle(task.id, task.status)}
                        onDelete={() => removeChecklistTask(task.id)}
                    />
                ))}
            </div>

            {/* Add Task Input */}
            <form onSubmit={handleAdd} className="mt-4 flex gap-2">
                <input 
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Add new task..."
                    className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none"
                />
                <button 
                    type="submit"
                    disabled={!newTaskTitle.trim()}
                    className="bg-purple-600 text-white p-3 rounded-lg disabled:opacity-50 hover:bg-purple-500 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </form>
        </div>

        {/* Done Section */}
        {doneTasks.length > 0 && (
            <div className="opacity-60">
                <h2 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-3">Completed ({doneTasks.length})</h2>
                <div className="space-y-2">
                    {doneTasks.map(task => (
                        <TaskItem 
                            key={task.id} 
                            task={task} 
                            onToggle={() => handleToggle(task.id, task.status)}
                            onDelete={() => removeChecklistTask(task.id)}
                        />
                    ))}
                </div>
            </div>
        )}

      </div>
    </PageLayout>
  );
}

function TaskItem({ task, onToggle, onDelete }: { task: ChecklistTask, onToggle: () => void, onDelete: () => void }) {
    return (
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 p-4 rounded-xl group transition-colors hover:border-purple-500/30">
            <button onClick={onToggle} className={clsx("flex-shrink-0 transition-colors", task.status === 'Done' ? "text-purple-500" : "text-zinc-600 hover:text-purple-400")}>
                {task.status === 'Done' ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6" />}
            </button>
            <span className={clsx("flex-1 text-sm font-medium transition-all break-words", task.status === 'Done' ? "text-zinc-500 line-through" : "text-zinc-200")}>
                {task.title}
            </span>
            <button 
                onClick={onDelete} 
                className="p-2 text-zinc-600 hover:text-red-400 transition-opacity"
                aria-label="Delete task"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
}
