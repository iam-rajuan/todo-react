import React from "react";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";

const TodoItem = ({ item, onToggle, onEdit, onDelete }) => {
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-white shadow-sm">
      <div className="flex items-center gap-3 min-w-0">
        <input
          id={`chk-${item.id}`}
          name={item.id}
          type="checkbox"
          checked={!!item.isCompleted}
          onChange={() => onToggle(item.id)}
          className="h-5 w-5 rounded focus:ring-2 focus:ring-indigo-300"
        />
        <label htmlFor={`chk-${item.id}`} className="truncate text-sm" title={item.todo}>
          <span className={item.isCompleted ? "line-through text-slate-400" : "text-slate-800"}>
            {item.todo}
          </span>
        </label>
      </div>

      <div className="flex gap-2">
        <button
          aria-label={`Edit ${item.todo}`}
          onClick={() => onEdit(item.id)}
          className="p-2 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          title="Edit"
        >
          <FaEdit />
        </button>

        <button
          aria-label={`Delete ${item.todo}`}
          onClick={() => onDelete(item.id)}
          className="p-2 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 text-red-600"
          title="Delete"
        >
          <AiFillDelete />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
