import {
  int,
  sqliteTable,
  text,
  AnySQLiteColumn,
  uniqueIndex,
  real,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const usersTable = sqliteTable(
  "users",
  {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    username: text().notNull().unique(),
    age: int().notNull(),
    email: text().notNull().unique(),
    password: text().notNull(),
  },
  (table) => [uniqueIndex("users_email_idx").on(table.email)]
);

export const shoppingListsTable = sqliteTable(
  "shopping_lists",
  {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    description: text(),
    userId: int("user_id").references((): AnySQLiteColumn => usersTable.id),
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => [uniqueIndex("shopping_lists_name_idx").on(table.name)]

  // (list) => ({
  //   user: relationship(list.user_id, users),
  // })
);

export const itemsTable = sqliteTable(
  "items",
  {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    description: text(),
    quantity: int().notNull(),
    unitPrice: real("unit_price").notNull(),
    shoppingListId: int("shopping_list_id").references(
      (): AnySQLiteColumn => shoppingListsTable.id
    ),
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => [uniqueIndex("items_name_idx").on(table.name)]
  // (item) => ({
  //   shoppingList: relationship(item.shopping_list_id, shoppingLists),
  // })
);

export const categoriesTable = sqliteTable("categories", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
});

export const itemCategoriesTable = sqliteTable(
  "item_categories",
  {
    itemId: int("item_id").references((): AnySQLiteColumn => itemsTable.id),
    categoryId: int("category_id").references(
      (): AnySQLiteColumn => categoriesTable.id
    ),
  },
  (table) => [
    uniqueIndex("item_category_idx").on(table.itemId, table.categoryId),
  ]
  // (itemCategory) => ({
  //   item: relationship(itemCategory.item_id, items),
  //   category: relationship(itemCategory.category_id, categories),
  // })
);
// export type User = typeof users.$inferSelect;
export type User = typeof usersTable.$inferSelect;
export type ShoppingList = typeof shoppingListsTable.$inferSelect;
export type Item = typeof itemsTable.$inferSelect;
export type Category = typeof categoriesTable.$inferSelect;
export type ItemCategory = typeof itemCategoriesTable.$inferSelect;

// Here's a proposed database design for a shopping list mobile app:
// Entities and Attributes
// User
//    id (primary key, unique identifier)
//    username
//    email
//    password (hashed for security)
// Shopping List
//    id (primary key, unique identifier)
//    name
//    description
//    user_id (foreign key referencing the User entity)
//    created_at
//    updated_at
// Item
//    id (primary key, unique identifier)
//    name
//    description
//    quantity
//    unit_price
//    shopping_list_id (foreign key referencing the Shopping List entity)
//    created_at
//    updated_at
// Category
//    id (primary key, unique identifier)
//    name
//    description
// Item Category
//    item_id (foreign key referencing the Item entity)
//    category_id (foreign key referencing the Category entity)
// Relationships
//    A user can have multiple shopping lists (one-to-many).
//    A shopping list belongs to one user (many-to-one).
//    A shopping list can have multiple items (one-to-many).
//    An item belongs to one shopping list (many-to-one).
//    An item can belong to multiple categories (many-to-many).
//    A category can have multiple items (many-to-many).
// Database Schema
// Here's a sample database schema using SQL:
// SQL
// CREATE TABLE Users (
//   id INT PRIMARY KEY,
//   username VARCHAR(255) NOT NULL,
//   email VARCHAR(255) NOT NULL,
//   password VARCHAR(255) NOT NULL
// );

// CREATE TABLE ShoppingLists (
//   id INT PRIMARY KEY,
//   name VARCHAR(255) NOT NULL,
//   description TEXT,
//   user_id INT NOT NULL,
//   created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//   FOREIGN KEY (user_id) REFERENCES Users (id)
// );

// CREATE TABLE Items (
//   id INT PRIMARY KEY,
//   name VARCHAR(255) NOT NULL,
//   description TEXT,
//   quantity INT NOT NULL,
//   unit_price DECIMAL(10, 2) NOT NULL,
//   shopping_list_id INT NOT NULL,
//   created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//   FOREIGN KEY (shopping_list_id) REFERENCES ShoppingLists (id)
// );

// CREATE TABLE Categories (
//   id INT PRIMARY KEY,
//   name VARCHAR(255) NOT NULL,
//   description TEXT
// );

// CREATE TABLE ItemCategories (
//   item_id INT NOT NULL,
//   category_id INT NOT NULL,
//   PRIMARY KEY (item_id, category_id),
//   FOREIGN KEY (item_id) REFERENCES Items (id),
//   FOREIGN KEY (category_id) REFERENCES Categories (id)
// );

// Here's a detailed explanation of each entity in the proposed database design:

// User Entity
//     Purpose: The User entity represents an individual who uses the shopping list mobile app.
//     Attributes:
//         id: A unique identifier for the user.
//         username: The username chosen by the user.
//         email: The email address associated with the user.
//         password: The password for the user's account (hashed for security).
//         Relationships: A user can have multiple shopping lists (one-to-many).

// Shopping List Entity
//     Purpose: The Shopping List entity represents a collection of items that a user wants to purchase.
//     Attributes:
//         id: A unique identifier for the shopping list.
//         name: The name of the shopping list (e.g., "Groceries" or "Holiday Gifts").
//         description: An optional description of the shopping list.
//         user_id: The foreign key referencing the User entity, indicating which user owns the shopping list.
//         created_at and updated_at: Timestamps for when the shopping list was created and last updated.
//         Relationships: A shopping list belongs to one user (many-to-one) and can have multiple items (one-to-many).

// Item Entity
//     Purpose: The Item entity represents a single product or item that a user wants to purchase.
//     Attributes:
//         id: A unique identifier for the item.
//         name: The name of the item (e.g., "Milk" or "Toilet Paper").
//         description: An optional description of the item.
//         quantity: The quantity of the item that the user wants to purchase.
//         unit_price: The price of a single unit of the item.
//         shopping_list_id: The foreign key referencing the Shopping List entity, indicating which shopping list the item belongs to.
//         created_at and updated_at: Timestamps for when the item was created and last updated.
//         Relationships: An item belongs to one shopping list (many-to-one) and can belong to multiple categories (many-to-many).

// Category Entity
//     Purpose: The Category entity represents a classification or grouping of items (e.g., "Dairy" or "Household Supplies").
//     Attributes:
//         id: A unique identifier for the category.
//         name: The name of the category.
//         description: An optional description of the category.
//         Relationships: A category can have multiple items (many-to-many).

// Item Category Entity ( Junction Table)
//     Purpose: The Item Category entity is a junction table that establishes the many-to-many relationship between items and categories.
//     Attributes:
//         item_id: The foreign key referencing the Item entity.
//         category_id: The foreign key referencing the Category entity.
//         Relationships: An item can belong to multiple categories, and a category can have multiple items.
