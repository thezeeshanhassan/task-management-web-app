import TaskCard from "./TaskCard"

const TaskColumn = ({ title, tasks, onEditTask, color, borderColor }) => {
  return (
    <div className={`rounded-lg ${color} p-4 border-t-4 ${borderColor} shadow-md`}>
      <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-white flex items-center justify-between">
        {title}
        <span className="bg-white dark:bg-gray-700 text-sm py-1 px-2 rounded-full">{tasks.length}</span>
      </h3>

      <div className="space-y-3 min-h-[200px]">
        {tasks.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">No tasks</p>
        ) : (
          tasks.map((task) => <TaskCard key={task._id} task={task} onEdit={() => onEditTask(task)} />)
        )}
      </div>
    </div>
  )
}

export default TaskColumn
