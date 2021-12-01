import { StationType, StationView } from 'core';

export class StationDto implements StationView {
  id: string;
  type: StationType;
  code: string;
  name: string;
  country: string;
  shipReferenceId: string;
}
