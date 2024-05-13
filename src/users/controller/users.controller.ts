import { Controller, HttpCode, Get } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from 'src/@decorator/user.decorator';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // @Get('/me')
    // @HttpCode(200)
    // @ApiOperation({
    //     summary: '사용자 정보 조회',
    //     description: '사용자 정보를 조회합니다.',
    //     tags: ['Working'],
    // })
    // async getUser(@CurrentUser() user: User) {
    //     return {
    //         result: user.readonly
    //     }
    // }
}
