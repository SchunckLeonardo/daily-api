-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_meals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date_and_hour" TEXT NOT NULL,
    "inRegimen" BOOLEAN NOT NULL,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "meals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_meals" ("date_and_hour", "description", "id", "inRegimen", "name", "user_id") SELECT "date_and_hour", "description", "id", "inRegimen", "name", "user_id" FROM "meals";
DROP TABLE "meals";
ALTER TABLE "new_meals" RENAME TO "meals";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
