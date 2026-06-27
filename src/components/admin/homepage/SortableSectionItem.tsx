import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FiMenu, FiEdit2, FiTrash2, FiEye, FiEyeOff } from "react-icons/fi";
import { HomepageSection } from "@/types/homepage";

interface Props {
  section: HomepageSection;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: (enabled: boolean) => void;
}

export default function SortableSectionItem({ section, onEdit, onDelete, onToggle }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`flex items-center justify-between p-4 bg-white border rounded-xl shadow-sm ${!section.enabled ? 'opacity-60 bg-slate-50' : 'border-slate-200'} ${isDragging ? 'border-emerald-500 shadow-md' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div {...attributes} {...listeners} className="cursor-grab p-1 text-slate-400 hover:text-slate-600">
          <FiMenu size={20} />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 capitalize flex items-center gap-2">
            {section.type.replace("_", " ")}
            {!section.enabled && <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">Hidden</span>}
          </h3>
          <p className="text-xs text-slate-500">ID: {section.id}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button onClick={() => onToggle(!section.enabled)} className={`p-2 rounded-lg transition-colors ${section.enabled ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'}`} title={section.enabled ? "Hide" : "Show"}>
          {section.enabled ? <FiEye /> : <FiEyeOff />}
        </button>
        <button onClick={onEdit} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          <FiEdit2 />
        </button>
        <button onClick={onDelete} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
}
