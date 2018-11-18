import { Schema, Model, model, Document } from 'mongoose';

export interface IVersion extends Document {
  version: string;
  previousVersion?: IVersion;
  nextVersion?: IVersion;
}

export const VersionSchema: Schema = new Schema({
  version: { type: String, default: '1.0' },
  previousVersion: { type: Schema.Types.ObjectId, ref: 'Version' },
  nextVersion: { type: Schema.Types.ObjectId, ref: 'Version' },
  application: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'applicationType'
  },
  applicationType: {
    type: String,
    required: true,
    enum: ['WebApplication', 'MobileApplication']
  }
});

export const Version: Model<IVersion> = model<IVersion>('Version', VersionSchema);
