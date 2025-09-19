# MecanixPro Backend

Backend Node.js + TypeScript + Sequelize compatible con MySQL, PostgreSQL, SQL Server y Oracle.

## Instalación

```bash
cd backend
npm install
```

## Variables de entorno

Copia `.env.example` a `.env` y ajusta los valores según tu motor de base de datos preferido. Selecciona el motor con la variable `DB_TYPE`:

```
DB_TYPE=mysql # o postgres, mssql, oracle
```

## Ejecución en desarrollo

```bash
npm run dev
```

## Endpoints disponibles

- `GET    /api/clients`         - Listar clientes
- `POST   /api/clients`         - Crear cliente
- `GET    /api/clients/:id`     - Obtener cliente por ID
- `PUT    /api/clients/:id`     - Actualizar cliente
- `DELETE /api/clients/:id`     - Eliminar cliente

## Motores soportados
- MySQL
- PostgreSQL
- SQL Server
- Oracle

## Notas
- Asegúrate de tener el motor de base de datos corriendo y accesible.
- Para Oracle, puede requerir dependencias nativas adicionales (`oracledb`).
- Para SQL Server, usa el driver `tedious`.

---

¡Listo para usar y extender!
