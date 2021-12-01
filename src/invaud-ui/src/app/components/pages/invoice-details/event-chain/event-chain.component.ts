import { Component, Input } from '@angular/core';
import { ChainEventView } from 'core';

@Component({
  selector: 'app-event-chain',
  templateUrl: './event-chain.component.html',
})
export class EventChainComponent {
  @Input() chainEvents: ChainEventView[];
}
