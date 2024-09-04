-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_board_id_fkey";

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE CASCADE;
