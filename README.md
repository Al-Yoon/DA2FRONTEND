# Health Grid — Portal del Paciente

Aplicación web del portal del paciente construida con **React**, **TypeScript**, **Vite** y **Tailwind CSS**.

## Requisitos

- **Node.js** 18 o superior (recomendado LTS)
- **pnpm** (el proyecto usa `pnpm-lock.yaml`)

Si no tenés pnpm:

```bash
npm install -g pnpm
```

## Instalación

En la raíz del proyecto:

```bash
npm install
```

> En Windows, si `npm` bloquea scripts de build (por ejemplo **esbuild**), el proyecto ya declara dependencias permitidas para compilar. Si ves errores al ejecutar `vite`, volvé a correr `npm install`.

## Iniciar en desarrollo

```bash
npm dev
```

Se abre el servidor de Vite (por defecto **http://localhost:5173**). Los cambios en el código se recargan solos.

## Otros comandos

| Comando        | Descripción                          |
|----------------|--------------------------------------|
| `npm build`   | Genera la versión de producción en `dist/` |
| `npm preview` | Sirve localmente el contenido de `dist/`   |
| `npm lint`    | Ejecuta ESLint (si está configurado)       |


## Estructura útil

- `src/main.tsx` — Entrada de la app
- `src/App.tsx` — Rutas (React Router)
- `src/pages/` — Pantallas
- `src/globals.css` — Tokens de color y Tailwind
- `components/` — Componentes UI compartidos
