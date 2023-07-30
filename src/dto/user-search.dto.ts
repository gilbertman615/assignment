import { ApiProperty, ApiPropertyOptional,  } from "@nestjs/swagger";

export enum MatchType {
    EXACT = 'EXACT',
    WILDCARD = 'WILDCARD',
}

export class UserSearchDto {

    @ApiProperty()
    @ApiPropertyOptional()
    name: string;

    @ApiProperty()
    @ApiPropertyOptional()
    email: string;

    @ApiProperty({enum: MatchType})
    @ApiPropertyOptional()
    matchType: string
}