import { useState } from 'react';
import { useTaskStore } from '../../stores/taskStore';
import type { Priority } from '../../types';
import { PRIORITY_LABELS, PRIORITY_COLORS } from '../../utils/constants';
import { todayStr } from '../../utils/helpers';
import Button from '../ui/Button';
import { Plus } from 'lucide-react';

interface TaskFormProps {
  onClose?: () => void;
  defaultCategory?: string;
}

export default function TaskForm({ onClose, defaultCategory }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [categoryId, setCategoryId] = useState(defaultCategory || 'personal');
  const [dueTime, setDueTime] = useState('');

  const addTask = useTaskStore(s => s.addTask);
  const categories = useTaskStore(s => s.categories);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      description: description.trim() || undefined,
      categoryId,
      priority,
      dueDate: todayStr(),
      dueTime: dueTime || undefined,
    });

    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueTime('');
    onClose?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-bold text-text-secondary mb-1.5">Tarea *</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="¿Qué necesitas hacer?"
          className="w-full bg-bg-elevated border-2 border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted font-medium focus:outline-none focus:border-primary transition-colors"
          autoFocus
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-bold text-text-secondary mb-1.5">Descripción</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Detalles adicionales..."
          rows={2}
          className="w-full bg-bg-elevated border-2 border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted font-medium focus:outline-none focus:border-primary transition-colors resize-none"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-bold text-text-secondary mb-1.5">Categoría</label>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryId(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                categoryId === cat.id
                  ? 'border-current'
                  : 'border-transparent bg-bg-elevated'
              }`}
              style={{ color: cat.color, ...(categoryId === cat.id ? { backgroundColor: cat.color + '20' } : {}) }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm font-bold text-text-secondary mb-1.5">Prioridad</label>
        <div className="flex gap-2">
          {(Object.keys(PRIORITY_LABELS) as Priority[]).map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-all cursor-pointer ${
                priority === p
                  ? 'border-current'
                  : 'border-transparent bg-bg-elevated text-text-muted'
              }`}
              style={priority === p ? { color: PRIORITY_COLORS[p], backgroundColor: PRIORITY_COLORS[p] + '20' } : {}}
            >
              {PRIORITY_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Time */}
      <div>
        <label className="block text-sm font-bold text-text-secondary mb-1.5">Hora (opcional)</label>
        <input
          type="time"
          value={dueTime}
          onChange={e => setDueTime(e.target.value)}
          className="w-full bg-bg-elevated border-2 border-border rounded-xl px-4 py-3 text-text-primary font-medium focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <Button type="submit" size="lg" className="w-full" icon={<Plus size={20} />} disabled={!title.trim()}>
        Agregar tarea
      </Button>
    </form>
  );
}
