import { ListItem, ListItemText, Checkbox, IconButton, Chip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { format, parse, parseISO } from 'date-fns';

export default function TaskItem({ task, onEdit, onDelete, onToggle }) {
  const dataLocal = new Date(task.prazo + 'T00:00:00')
  return (
    <ListItem
      secondaryAction={
        <>
          <IconButton onClick={() => onEdit(task)}><Edit /></IconButton>
          <IconButton onClick={() => onDelete(task.id)}><Delete /></IconButton>
        </>
      }
    >
      <Checkbox checked={task.concluido} onChange={() => onToggle(task)} />
      <ListItemText
        primary={task.titulo}
        secondary={`Prazo: ${format(parseISO(task.prazo), 'dd/MM/yyyy')}`}
        sx={{ textDecoration: task.concluido ? 'line-through' : 'none' }}
      />
    </ListItem>
  );
}