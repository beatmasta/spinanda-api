import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class GetDataDto {
    @ApiProperty({ description: 'City name', required: true })
    @IsString()
    city: string;

    @ApiProperty({ description: 'Currency code', required: true })
    @IsString()
    currency: string;

    @ApiProperty({ description: 'Refresh flag', required: false })
    @IsOptional()
    @IsString()
    refresh?: string;
}
