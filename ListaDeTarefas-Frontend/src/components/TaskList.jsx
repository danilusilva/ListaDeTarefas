import { List } from '@mui/material';
import TaskItem from './TaskItem';

export default function TaskList({ tasks, onEdit, onDelete, onToggle }) {
  return (
    <List>
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} />
      ))}
    </List>
  );
}