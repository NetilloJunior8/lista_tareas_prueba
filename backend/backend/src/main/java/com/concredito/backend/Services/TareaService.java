package com.concredito.backend.Services;

import com.concredito.backend.models.Tarea;
import com.concredito.backend.Repositories.TareaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TareaService {

    @Autowired
    private TareaRepository tareaRepository;

    /**
     * Obtiene la lista de tareas de un usuario.
     *
     * @param usuarioId El ID del usuario.
     * @return La lista de tareas del usuario.
     */
    public List<Tarea> obtenerTareasPorUsuario(Long usuarioId) {
        return tareaRepository.findByUsuarioId(usuarioId);
    }

   
    public Tarea crearTarea(Tarea tarea) {
        return tareaRepository.save(tarea);
    }

    
    public Tarea actualizarTarea(Long id, Tarea detallesTarea) {
        Optional<Tarea> tareaExistente = tareaRepository.findById(id);
        
        if (tareaExistente.isPresent()) {
            Tarea tarea = tareaExistente.get();
            tarea.setTitulo(detallesTarea.getTitulo());
            tarea.setDescripcion(detallesTarea.getDescripcion());
            tarea.setCompletada(detallesTarea.isCompletada());
            return tareaRepository.save(tarea);
        }
        throw new RuntimeException("Error: La tarea con ID " + id + " no existe.");
    }

    public void eliminarTarea(Long id) {
        tareaRepository.deleteById(id);
    }

    public java.io.ByteArrayInputStream exportarTareasExcel(Long usuarioId) {
        List<Tarea> tareas = tareaRepository.findByUsuarioId(usuarioId);

        try (org.apache.poi.ss.usermodel.Workbook workbook = new org.apache.poi.xssf.usermodel.XSSFWorkbook();
             java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream()) {

            org.apache.poi.ss.usermodel.Sheet sheet = workbook.createSheet("Mis Tareas");

            
            org.apache.poi.ss.usermodel.Row headerRow = sheet.createRow(0);
            String[] headers = {"ID", "Título", "Descripción", "Estado", "Fecha de Creación"};
            for (int i = 0; i < headers.length; i++) {
                org.apache.poi.ss.usermodel.Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            
            int rowIdx = 1;
            for (Tarea tarea : tareas) {
                org.apache.poi.ss.usermodel.Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(tarea.getId());
                row.createCell(1).setCellValue(tarea.getTitulo());
                row.createCell(2).setCellValue(tarea.getDescripcion() != null ? tarea.getDescripcion() : "");
                row.createCell(3).setCellValue(tarea.isCompletada() ? "Completada" : "Pendiente");
                row.createCell(4).setCellValue(tarea.getFechaCreacion() != null ? tarea.getFechaCreacion().toString() : "");
            }

            workbook.write(out);
            return new java.io.ByteArrayInputStream(out.toByteArray());
        } catch (java.io.IOException e) {
            throw new RuntimeException("Error al exportar datos a Excel");
        }
    }
}
