import mongoose from "mongoose";
import { connectDatabase, disconnectDatabase } from "../config/database";
import Driver from "../models/Driver";
import Vehicle from "../models/Vehicle";
import Trip from "../models/Trip";
import Location from "../models/Location";

const VEHICLE_COUNT = 10000;
const TRIPS_PER_VEHICLE = 3;
const LOCATIONS_PER_VEHICLE = 10;

const seed = async () => {
  try {
    await connectDatabase();

    console.log("Clearing existing data...");

    await Promise.all([
      Driver.deleteMany({}),
      Vehicle.deleteMany({}),
      Trip.deleteMany({}),
      Location.deleteMany({}),
    ]);

    console.log("Creating drivers...");

    const drivers = Array.from(
      { length: VEHICLE_COUNT },
      (_, index) => ({
        name: `Driver ${index + 1}`,
        phone: `9${String(index).padStart(9, "0")}`,
        licenseNumber: `DL-${String(index + 1).padStart(8, "0")}`,
        status: "ACTIVE" as const,
      })
    );

    const createdDrivers = await Driver.insertMany(drivers);

    console.log(`${createdDrivers.length} drivers created`);

    console.log("Creating vehicles...");

    const vehicles = createdDrivers.map((driver, index) => {
      const latitude =
        12.8 + Math.random() * 0.4;

      const longitude =
        77.4 + Math.random() * 0.4;

      return {
        vehicleNumber: `KA01${String(index + 1).padStart(5, "0")}`,
        driverId: driver._id,
        status: ["MOVING", "IDLE", "STOPPED", "OFFLINE"][
          index % 4
        ] as
          | "MOVING"
          | "IDLE"
          | "STOPPED"
          | "OFFLINE",
        latitude,
        longitude,
        speed: Math.floor(Math.random() * 80),
        heading: Math.floor(Math.random() * 360),
        lastUpdated: new Date(),
      };
    });

    const createdVehicles = await Vehicle.insertMany(vehicles);

    console.log(`${createdVehicles.length} vehicles created`);

    console.log("Creating trips...");

    const trips = [];

    for (const vehicle of createdVehicles) {
      for (let i = 0; i < TRIPS_PER_VEHICLE; i++) {
        const startTime = new Date(
          Date.now() -
            (i + 1) * 24 * 60 * 60 * 1000
        );

        const endTime = new Date(
          startTime.getTime() +
            45 * 60 * 1000
        );

        trips.push({
          vehicleId: vehicle._id,
          startTime,
          endTime,
          startLatitude: vehicle.latitude,
          startLongitude: vehicle.longitude,
          endLatitude:
            vehicle.latitude +
            (Math.random() - 0.5) * 0.1,
          endLongitude:
            vehicle.longitude +
            (Math.random() - 0.5) * 0.1,
          distance:
            Math.round(
              (5 + Math.random() * 45) * 100
            ) / 100,
          duration: 45 * 60,
          averageSpeed:
            Math.round(
              (20 + Math.random() * 40) * 100
            ) / 100,
          maxSpeed:
            Math.round(
              (40 + Math.random() * 50) * 100
            ) / 100,
          status: "COMPLETED" as const,
        });
      }
    }

    await Trip.insertMany(trips);

    console.log(`${trips.length} trips created`);

    console.log("Creating locations...");

    const locations = [];

    for (const vehicle of createdVehicles) {
      for (let i = 0; i < LOCATIONS_PER_VEHICLE; i++) {
        const timestamp = new Date(
          Date.now() -
            i * 5 * 60 * 1000
        );

        locations.push({
          vehicleId: vehicle._id,
          latitude:
            vehicle.latitude +
            (Math.random() - 0.5) * 0.05,
          longitude:
            vehicle.longitude +
            (Math.random() - 0.5) * 0.05,
          speed: Math.floor(Math.random() * 80),
          heading: Math.floor(Math.random() * 360),
          timestamp,
        });
      }
    }

    await Location.insertMany(locations);

    console.log(
      `${locations.length} locations created`
    );

    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Seed failed:", error);
  } finally {
    await disconnectDatabase();
  }
};

seed();