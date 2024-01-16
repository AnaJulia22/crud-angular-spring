package com.crud.crudspring.exception;

public class RecordNotFoundException extends RuntimeException {
    public static final long serialVersionUID = 1L;

    public RecordNotFoundException(Long id) {
        super("Registro não encontrado com id: " + id);
    }
}
