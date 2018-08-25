# UhLalaTools

## Documentación API REST

| Tipo de request | Ruta | Descripción del servicio |
| ---- | --------------------------------- | ---------------------------------------------------------------------------- |
|GET   |/applications                      | Retorna todas las aplicaciones registradas en la bd                          |
|GET   |/applications/:id                  | Retorna un objeto aplicación dado su id                                      |
|POST  |/applications                      | Agrega una nueva aplicación en la bd                                         |
|DELETE|/applications/:id                  | Elimina una aplicación de la bd dado su id                                   |
|GET   |/tests                             | Retorna todos los tests registrados en la bd                                 |
|POST  |/tests/:applicationId              | Agrega un nuevo test a la bd                                                 |
|GET   |/tests/:id                         | Retorna un objeto test dado su id                                            |
|GET   |/applications/:applicationId/tests | Retorna todos los test asociados a una aplicacion dado el id de la aplicación|
|DELETE|/tests/:id                         | Elimina un test de la bd dado su id                                          |
