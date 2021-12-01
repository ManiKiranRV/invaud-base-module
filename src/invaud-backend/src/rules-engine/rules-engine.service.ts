import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import { RulesEngineInputDto } from './dto/rules-engine-input.dto';
import { RulesEngineOutputDto } from './dto/rules-engine-output.dto';

@Injectable()
export class RulesEngineService {
  private logger = new Logger(this.constructor.name);

  callRulesEngine(input: RulesEngineInputDto): Promise<RulesEngineOutputDto> {
    try {
      const json = fs.readFileSync('./src/rules-engine/resources/rules.json');
      const rulesEngineOutput = JSON.parse(json.toString());
      this.logger.log('Mock Rules Engine invoked');
      return rulesEngineOutput;
    } catch (err) {
      this.logger.error(
        'An error occured while loading the data. Note that the relative path for reading the file is resolved against',
        err,
      );
      throw new Error();
    }
  }
}
