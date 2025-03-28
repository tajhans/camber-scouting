import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  emailVerified: boolean("email_verified").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const team = pgTable("team", {
  id: integer("id").primaryKey(),
  name: text("name"),
  matches: text("matches").array().default([]),
});

export const match = pgTable("match", {
  matchNumber: integer("match_number").notNull(),
  teamId: integer("team_id").references(() => team.id),
  alliance: text("alliance").notNull(),
  position: integer("position").notNull(),
  redAlliance: integer("red_alliance").array().notNull(),
  blueAlliance: integer("blue_alliance").array().notNull(),
  coralL1: integer("coral_l1").default(0),
  coralL2: integer("coral_l2").default(0),
  coralL3: integer("coral_l3").default(0),
  coralL4: integer("coral_l4").default(0),
  leftInAuton: boolean("left_in_auton").default(false),
  pointsScoredInAuton: boolean("points_scored_in_auton").default(false),
  algaeInProcessor: integer("algae_in_processor").default(0),
  algaeTakenOff: integer("algae_taken_off").default(0),
  algaeInNet: integer("algae_in_net").default(0),
  humanPlayer: boolean("human_player").default(false),
  groundIntake: boolean("ground_intake").default(false),
  droppedCoral: integer("dropped_coral").default(0),
  droppedAlgae: integer("dropped_algae").default(0),
  penaltyPoints: integer("penalty_points").default(0),
  yellowCards: integer("yellow_cards").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});
