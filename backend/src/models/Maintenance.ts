import mongoose, {
  Document,
  Model,
  Schema,
  Types,
} from "mongoose";

export type MaintenanceType =
  | "SERVICE"
  | "REPAIR"
  | "INSPECTION"
  | "TYRE"
  | "OTHER";

export type MaintenanceStatus =
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface IMaintenance extends Document {
  vehicleId: Types.ObjectId;
  type: MaintenanceType;
  description: string;
  scheduledDate: Date;
  completedDate?: Date;
  cost: number;
  status: MaintenanceStatus;
  createdAt: Date;
  updatedAt: Date;
}

const maintenanceSchema =
  new Schema<IMaintenance>(
    {
      vehicleId: {
        type: Schema.Types.ObjectId,
        ref: "Vehicle",
        required: true,
        index: true,
      },

      type: {
        type: String,
        enum: [
          "SERVICE",
          "REPAIR",
          "INSPECTION",
          "TYRE",
          "OTHER",
        ],
        required: true,
      },

      description: {
        type: String,
        required: true,
        trim: true,
      },

      scheduledDate: {
        type: Date,
        required: true,
        index: true,
      },

      completedDate: {
        type: Date,
      },

      cost: {
        type: Number,
        min: 0,
        default: 0,
      },

      status: {
        type: String,
        enum: [
          "SCHEDULED",
          "IN_PROGRESS",
          "COMPLETED",
          "CANCELLED",
        ],
        default: "SCHEDULED",
        index: true,
      },
    },
    {
      timestamps: true,
    }
  );

maintenanceSchema.index({
  vehicleId: 1,
  scheduledDate: -1,
});

maintenanceSchema.index({
  status: 1,
  scheduledDate: 1,
});

const Maintenance: Model<IMaintenance> =
  mongoose.models.Maintenance ||
  mongoose.model<IMaintenance>(
    "Maintenance",
    maintenanceSchema
  );

export default Maintenance;
