exports.up = (pgm) => {
  pgm.createTable("users", {
    user_id: "id",
    name: { type: "varchar(100)", notNull: true },
    email: { type: "varchar(100)", notNull: true, unique: true },
    password: { type: "text", notNull: true },
    created_at: { type: "timestamp", default: pgm.func("current_timestamp") },
  });

  pgm.createTable("categories", {
    category_id: "id",
    category_name: { type: "varchar(50)", notNull: true },
    user_id: {
      type: "integer",
      references: "users",
      onDelete: "cascade",
    },
  });

  pgm.createTable("todos", {
    todo_id: "id",
    title: { type: "varchar(150)", notNull: true },
    description: { type: "text" },
    is_completed: { type: "boolean", default: false },
    priority: {
      type: "varchar(10)",
      check: "priority IN ('Low','Medium','High')",
    },
    due_date: { type: "date" },
    user_id: {
      type: "integer",
      references: "users",
      onDelete: "cascade",
    },
    category_id: {
      type: "integer",
      references: "categories",
      onDelete: "set null",
    },
    created_at: { type: "timestamp", default: pgm.func("current_timestamp") },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("todos");
  pgm.dropTable("categories");
  pgm.dropTable("users");
};
