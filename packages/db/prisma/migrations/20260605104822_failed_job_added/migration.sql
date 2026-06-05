-- CreateTable
CREATE TABLE "FailedJob" (
    "id" TEXT NOT NULL,
    "queueName" TEXT NOT NULL,
    "originalJobId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "error" TEXT NOT NULL,
    "failedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FailedJob_pkey" PRIMARY KEY ("id")
);
