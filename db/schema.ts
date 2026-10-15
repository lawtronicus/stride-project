import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const trainingStates=sqliteTable('training_states',{userId:text('user_id').primaryKey(),payload:text('payload').notNull(),version:integer('version').notNull().default(1),updatedAt:text('updated_at').notNull()});
