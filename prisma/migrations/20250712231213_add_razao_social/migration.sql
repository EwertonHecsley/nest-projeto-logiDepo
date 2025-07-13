/*
  Warnings:

  - Added the required column `razaoSocial` to the `fornecedores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "fornecedores" ADD COLUMN     "razaoSocial" VARCHAR(255) NOT NULL;
