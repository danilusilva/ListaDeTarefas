import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

export default function TaskFormDialog({ open, task, onSave, onClose }) {
  const [titulo, setTitulo] = useState('');
  const [prazo,  setPrazo]  = useState('');

  // Preenche o form ao editar
  useEffect(() => {
    setTitulo(task?.titulo ?? '');
    setPrazo(task?.prazo?.substring(0, 10) ?? ''); // formata para yyyy-MM-dd
  }, [task, open]);

  function handleSubmit() {
    const concluido = task?.concluido ?? false;
    onSave({ titulo, prazo, concluido });
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{task ? 'Editar Tarefa' : 'Nova Tarefa'}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <TextField label="Título" value={titulo} onChange={e => setTitulo(e.target.value)} fullWidth />
        <TextField label="Prazo" type="date" value={prazo} onChange={e => setPrazo(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!titulo || !prazo}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}