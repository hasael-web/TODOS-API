-- DropForeignKey
ALTER TABLE "board" DROP CONSTRAINT "board_user_id_fkey";

-- AddForeignKey
ALTER TABLE "board" ADD CONSTRAINT "board_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
