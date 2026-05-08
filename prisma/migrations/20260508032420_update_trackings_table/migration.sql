-- AlterTable
ALTER TABLE "public"."trackings" ADD COLUMN     "device_time" TIMESTAMPTZ,
ADD COLUMN     "heart_rate" INTEGER,
ADD COLUMN     "hop_count" INTEGER,
ADD COLUMN     "humidity" INTEGER,
ADD COLUMN     "is_fallen" BOOLEAN DEFAULT false,
ADD COLUMN     "pressure" DOUBLE PRECISION,
ADD COLUMN     "routing_path" INTEGER[],
ADD COLUMN     "spo2" INTEGER,
ADD COLUMN     "temperature" DOUBLE PRECISION;
