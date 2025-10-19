-- CreateTable
CREATE TABLE "Board" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shortName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "posts" INTEGER NOT NULL DEFAULT 0,
    "pages" INTEGER NOT NULL DEFAULT 10,
    "threadsPerPage" INTEGER NOT NULL DEFAULT 10,
    "postLimite" INTEGER NOT NULL DEFAULT 50,
    "archive" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Thread" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "boardId" INTEGER NOT NULL,
    "sticky" BOOLEAN NOT NULL DEFAULT false,
    "lock" BOOLEAN NOT NULL DEFAULT false,
    "archive" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Thread_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "postNumber" INTEGER NOT NULL,
    "threadId" INTEGER NOT NULL,
    "boardId" INTEGER NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT NOT NULL,
    "comment" TEXT,
    "name" TEXT,
    "trip" TEXT,
    "fileName" TEXT,
    "filePath" TEXT,
    "filemd5" TEXT,
    "filesize" INTEGER,
    "filewidth" INTEGER,
    "filetype" INTEGER,
    "fileheight" INTEGER,
    "filespoiler" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Post_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Post_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Board_shortName_key" ON "Board"("shortName");

-- CreateIndex
CREATE UNIQUE INDEX "Board_name_key" ON "Board"("name");
