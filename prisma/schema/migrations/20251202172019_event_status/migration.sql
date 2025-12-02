-- CreateEnum
CREATE TYPE "ParticipantStatus" AS ENUM ('CONFIRMED', 'LEFT', 'PENDING');

-- AlterTable
ALTER TABLE "event_participants" ADD COLUMN     "participantStatus" "ParticipantStatus" NOT NULL DEFAULT 'PENDING';
