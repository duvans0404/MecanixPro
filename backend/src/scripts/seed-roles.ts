import dotenv from 'dotenv';
import { getSequelize } from '../config/database';
import { Sequelize } from 'sequelize';
import User, { initUserModel } from '../models/user.model';
import Role, { initRoleModel } from '../models/role.model';
import UserRoleMap, { initUserRoleModel } from '../models/user-role.model';

async function main() {
  dotenv.config({ path: __dirname + '/../../.env' });

  const sequelize: Sequelize = getSequelize();

  // Inicializar solo los modelos necesarios
  initUserModel(sequelize);
  initRoleModel(sequelize);
  initUserRoleModel(sequelize);

  await sequelize.authenticate();
  await sequelize.sync();

  const defaultRoles = ['ADMIN', 'MANAGER', 'MECHANIC', 'RECEPTIONIST', 'CLIENT'];

  let created = 0;
  for (const name of defaultRoles) {
    const [r, isCreated] = await Role.findOrCreate({ where: { name }, defaults: { name } });
    if (isCreated) created++;
  }

  console.log(`Roles OK. Creados: ${created}, Total en tabla: ${await Role.count()}`);

  await sequelize.close();
}

main().catch(err => {
  console.error('Error seeding roles:', err);
  process.exit(1);
});
