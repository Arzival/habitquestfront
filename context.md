# Contexto del proyecto

## **HabitQuest]**

Este proyecto ayudara a las personas a tener un sistema para traquear los habitos que tienen y que los ayuden a mejorar siendo un sistema gamificado

## Requerimientos de programación

Este proyecto está enfocado exclusivamente en desarrollar el frontend utilizando **React con TypeScript**. La API REST que consumirás está alojada en un **proyecto independiente usando LAravel 12**, por lo que este proyecto únicamente se encargará de hacer peticiones HTTP usando Axios y manejar la presentación de los datos recibidos.

Para implementar cada funcionalidad, asegúrate de:

- Crear componentes React funcionales (`.tsx`).
- Usar variables siempre en **inglés**, formato **camelCase**.
- **Incluye comentarios explicativos en español** sobre qué realiza cada función o componente para facilitar seguimiento y mantenimiento.
- Crear archivos para realizar peticiones HTTP al backend:
    - Estos archivos deben estar organizados en una carpeta independiente llamada `requests`.
    - Cada archivo de solicitud debe ser específico para un recurso o funcionalidad (ej. `userRequest.tsx`).
    - Utilizar Axios para todas las peticiones HTTP.
    - Generar un archivo global (`config/apiConfig.ts`) que contenga la URL base del backend para facilitar cambios futuros:
        
        ```
        // apiConfig.ts
        export const API_BASE_URL = 'https://api.tu-proyecto.com';
        ```
        
        Uso del archivo en peticiones:
        
        ```
        import axios from 'axios';
        import { API_BASE_URL } from '../config/apiConfig';
        
        export const getUserData = async (userId: string) => {
          const response = await axios.post(`${API_BASE_URL}/user/getData`, { userId });
          return response.data;
        };
        ```
        

## **Requerimientos de respuesta**

**IMPORTANTE:** Cada vez que implementes una funcionalidad solicitada, debes responder con la siguiente información:

- **Qué fue lo que realizaste** - Describe las funciones, modelos, migraciones, etc. que creaste
- **Por qué fue que lo realizaste de esa manera** - Explica las decisiones técnicas y el razonamiento

**Nota:** Esta información debe incluirse en tu respuesta inmediata después de implementar cada funcionalidad, no como documentación separada del proyecto.

## Estructura del proyecto

```
/ (raíz del proyecto)
├── src/
│   ├── components/      → Componentes React reutilizables
│   ├── pages/           → Páginas completas (rutas principales)
│   ├── requests/        → Archivos para peticiones HTTP usando Axios
│   ├── config/          → Configuración global (URLs, constantes, etc.)
│   ├── hooks/           → Hooks personalizados
│   ├── context/         → Context API (si aplica)
│   ├── utils/           → Funciones auxiliares o helpers
│   ├── styles/          → Estilos globales o por componente
│   └── App.tsx          → Componente principal
└── public/              → Archivos estáticos (imágenes, favicons, etc.)
```

## Requerimientos adicionales

- Manejar errores HTTP y mostrar mensajes claros al usuario.
- Validar correctamente los datos antes de enviarlos al backend.
- Crear componentes reutilizables cuando sea posible para mantener limpio y modular el código.

## Plan de Implementación Gradual

El desarrollo de este proyecto será incremental. Crea componentes y funcionalidades progresivamente, permitiendo ajustes rápidos y pruebas constantes antes de avanzar.