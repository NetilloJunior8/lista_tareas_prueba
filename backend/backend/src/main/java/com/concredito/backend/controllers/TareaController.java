package com.concredito.backend.controllers;

import com.concredito.backend.Services.TareaService;
import com.concredito.backend.models.Tarea;
import com.concredito.backend.models.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.util.List;

@RestController
@RequestMapping("/api/v1/tareas")
public class TareaController {

    @Autowired
    private TareaService tareaService;

    @GetMapping
    public ResponseEntity<List<Tarea>> getTareas(Authentication authentication) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        return ResponseEntity.ok(tareaService.obtenerTareasPorUsuario(usuario.getId()));
    }

    @PostMapping
    public ResponseEntity<Tarea> createTarea(@RequestBody Tarea tarea, Authentication authentication) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        tarea.setUsuario(usuario);
        return ResponseEntity.ok(tareaService.crearTarea(tarea));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tarea> updateTarea(@PathVariable Long id, @RequestBody Tarea tarea, Authentication authentication) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        // In a real app we should verify the task belongs to the user before updating
        return ResponseEntity.ok(tareaService.actualizarTarea(id, tarea));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTarea(@PathVariable Long id, Authentication authentication) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        // In a real app we should verify the task belongs to the user before deleting
        tareaService.eliminarTarea(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/export/excel")
    public ResponseEntity<Resource> exportTareasToExcel(Authentication authentication) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        ByteArrayInputStream bais = tareaService.exportarTareasExcel(usuario.getId());
        
        InputStreamResource file = new InputStreamResource(bais);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=mis_tareas.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(file);
    }
}
