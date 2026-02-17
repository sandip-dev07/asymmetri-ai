import {
  pgTable,
  text,
  timestamp,
  primaryKey,
  uuid,
  integer,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

// Users
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: text("name"),
  email: text("email").unique().notNull(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

// Accounts
export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    pk: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

// Sessions
export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// Verification Tokens
export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    pk: primaryKey({
      columns: [vt.identifier, vt.token],
    }),
  }),
);

// Chat Sessions
export const chatSessions = pgTable(
  "chat_sessions",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("chat_sessions_user_idx").on(table.userId)],
);

// Messages
export const messages = pgTable(
  "messages",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    chatSessionId: uuid("chat_session_id")
      .notNull()
      .references(() => chatSessions.id, { onDelete: "cascade" }),
    role: text("role").notNull(), // user | assistant | tool
    content: text("content").notNull(),
    toolName: text("tool_name"),
    toolData: jsonb("tool_data"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (msg) => [
    index("messages_chat_session_idx").on(msg.chatSessionId),
  ],
);
