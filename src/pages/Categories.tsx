import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, FolderOpen } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useTaskStore } from '../stores/taskStore';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import TaskCard from '../components/tasks/TaskCard';
import TaskForm from '../components/tasks/TaskForm';

const ICON_OPTIONS = ['Briefcase', 'GraduationCap', 'Home', 'Heart', 'User', 'Code', 'Music', 'Dumbbell', 'BookOpen', 'Palette', 'Plane', 'ShoppingCart'];
const COLOR_OPTIONS = ['#1CB0F6', '#CE82FF', '#FF9600', '#FF4B4B', '#FF86D0', '#58CC02', '#FFD900', '#00C9A7'];

export default function Categories() {
  const { categories, addCategory, deleteCategory, tasks } = useTaskStore();
  const [showAdd, setShowAdd] = useState(false);
  const [showTasks, setShowTasks] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('Code');
  const [newColor, setNewColor] = useState('#1CB0F6');

  const handleAdd = () => {
    if (!newName.trim()) return;
    addCategory(newName.trim(), newIcon, newColor);
    setNewName('');
    setShowAdd(false);
  };

  const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName];
    return Icon ? <Icon size={22} /> : <FolderOpen size={22} />;
  };

  const selectedCatTasks = showTasks
    ? tasks.filter(t => t.categoryId === showTasks)
    : [];

  const selectedCat = showTasks ? categories.find(c => c.id === showTasks) : null;

  return (
    <div className="space-y-5 pb-24 lg:pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Categorías</h1>
        <Button onClick={() => setShowAdd(true)} size="sm" icon={<Plus size={16} />}>
          Nueva
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <AnimatePresence>
          {categories.map(cat => {
            const count = tasks.filter(t => t.categoryId === cat.id).length;
            const done = tasks.filter(t => t.categoryId === cat.id && t.completed).length;
            return (
              <motion.button
                key={cat.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowTasks(cat.id)}
                className="relative bg-bg-card border-2 border-border rounded-2xl p-5 text-left transition-all hover:border-text-muted/30 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: cat.color + '20', color: cat.color }}>
                  {getIcon(cat.icon)}
                </div>
                <p className="font-bold text-sm">{cat.name}</p>
                <p className="text-xs text-text-muted font-semibold mt-0.5">
                  {count} {count === 1 ? 'tarea' : 'tareas'} · {done} hechas
                </p>
                {count > 0 && (
                  <div className="w-full bg-bg rounded-full h-1.5 mt-3 overflow-hidden">
                    <div className="h-full rounded-full" style={{ backgroundColor: cat.color, width: `${count > 0 ? (done / count) * 100 : 0}%` }} />
                  </div>
                )}
                {cat.isCustom && (
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteCategory(cat.id); }}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-accent-red/20 text-text-muted hover:text-accent-red transition-all cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Add Category Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Nueva categoría">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-text-secondary mb-1.5">Nombre</label>
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Ej: Fitness"
              className="w-full bg-bg-elevated border-2 border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted font-medium focus:outline-none focus:border-primary transition-colors"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-text-secondary mb-1.5">Icono</label>
            <div className="flex flex-wrap gap-2">
              {ICON_OPTIONS.map(icon => (
                <button
                  key={icon}
                  onClick={() => setNewIcon(icon)}
                  className={`p-2.5 rounded-xl transition-all cursor-pointer ${newIcon === icon ? 'bg-primary/20 text-primary border-2 border-primary' : 'bg-bg-elevated text-text-muted border-2 border-transparent'}`}
                >
                  {getIcon(icon)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-text-secondary mb-1.5">Color</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map(color => (
                <button
                  key={color}
                  onClick={() => setNewColor(color)}
                  className={`w-9 h-9 rounded-xl transition-all cursor-pointer ${newColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-bg-card' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <Button onClick={handleAdd} size="lg" className="w-full" disabled={!newName.trim()}>
            Crear categoría
          </Button>
        </div>
      </Modal>

      {/* Category Tasks Modal */}
      <Modal open={!!showTasks} onClose={() => setShowTasks(null)} title={selectedCat?.name || 'Tareas'}>
        <div className="space-y-3">
          {selectedCatTasks.length === 0 ? (
            <p className="text-center text-text-muted py-6 font-medium">Sin tareas en esta categoría</p>
          ) : (
            selectedCatTasks.map(task => <TaskCard key={task.id} task={task} />)
          )}
          <div className="pt-2">
            <TaskForm onClose={() => setShowTasks(null)} defaultCategory={showTasks || undefined} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
