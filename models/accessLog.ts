import { Schema, model } from 'mongoose';

export interface IAccessLog {
  method: string;
  path: string;
  ipAddress: string;
  timestamp: Date;
}

const AccessLogSchema = new Schema<IAccessLog>(
  {
    method: { type: String, required: true },
    path: { type: String, required: true },
    ipAddress: { type: String, required: true },
    timestamp: { type: Date, required: true },
  },
  { collection: 'access_logs' }
);

const AccessLogModel = model<IAccessLog>('AccessLog', AccessLogSchema);

export default AccessLogModel;
