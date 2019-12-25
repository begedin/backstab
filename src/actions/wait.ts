import Entity from '@/Entity';
import { ActionOutcome } from './ActionOutcome';

const wait = (subject: Entity): ActionOutcome => ({ type: 'WAIT', outcome: { subject } });

export default wait;
