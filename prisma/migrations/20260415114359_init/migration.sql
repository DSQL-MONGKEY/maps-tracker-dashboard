-- CreateEnum
CREATE TYPE "public"."status" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "public"."device_type" AS ENUM ('base_station', 'client_device', 'extender_device');

-- CreateTable
CREATE TABLE "public"."base_stations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT,
    "location_name" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT (now() AT TIME ZONE 'asia/jakarta'::text),
    "latitude" DECIMAL,
    "longitude" DECIMAL,
    "description" TEXT,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT (now() AT TIME ZONE 'asia/jakarta'::text),
    "status" "public"."status" DEFAULT 'active',

    CONSTRAINT "base_stations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."climber_users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "address" TEXT DEFAULT 'Bumi',
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "climber_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."devices" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT (now() AT TIME ZONE 'asia/jakarta'::text),
    "type" "public"."device_type",
    "status" BOOLEAN DEFAULT true,
    "device_code" TEXT,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."logs" (
    "id" BIGSERIAL NOT NULL,
    "source" TEXT,
    "level" TEXT,
    "message" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."register_devices" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "climber_user_id" UUID,
    "device_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registered_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "unregistered_at" TIMESTAMPTZ,
    "is_active" BOOLEAN DEFAULT true,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "register_devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."trackings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "device_id" UUID NOT NULL,
    "climber_user_id" UUID,
    "rssi" BIGINT,
    "snr" DOUBLE PRECISION,
    "latitude" DECIMAL,
    "longitude" DECIMAL,
    "is_emergency" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trackings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'viewer',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "devices_id_key" ON "public"."devices"("id");

-- CreateIndex
CREATE UNIQUE INDEX "devices_name_key" ON "public"."devices"("name");

-- CreateIndex
CREATE UNIQUE INDEX "devices_device_code_key" ON "public"."devices"("device_code");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "public"."users"("id");

-- AddForeignKey
ALTER TABLE "public"."register_devices" ADD CONSTRAINT "register_devices_climber_user_id_fkey" FOREIGN KEY ("climber_user_id") REFERENCES "public"."climber_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."register_devices" ADD CONSTRAINT "register_devices_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "public"."devices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."trackings" ADD CONSTRAINT "trackings_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "public"."devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."trackings" ADD CONSTRAINT "trackings_climber_user_id_fkey" FOREIGN KEY ("climber_user_id") REFERENCES "public"."climber_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
