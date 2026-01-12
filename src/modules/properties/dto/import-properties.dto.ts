import { ApiProperty } from '@nestjs/swagger';

export class ImportPropertiesResponseDto {
  @ApiProperty({ example: 15 })
  imported: number;

  @ApiProperty({ example: 5 })
  skipped: number;

  @ApiProperty({ example: 0 })
  errors: number;

  @ApiProperty({ type: [String], example: [] })
  errorMessages: string[];
}
