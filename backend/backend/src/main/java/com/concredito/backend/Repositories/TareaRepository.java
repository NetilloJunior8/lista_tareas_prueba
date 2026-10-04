package com.concredito.backend.Repositories;

import com.concredito.backend.models.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TareaRepository extends JpaRepository<Tarea, Long> {
    List<Tarea> findByUsuarioId(Long usuarioId);
}
