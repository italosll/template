import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UserContract } from '@interfaces/user.contract';
import { ActiveUserContract } from '@interfaces/active-user.contract';

import { SignUpDTO } from './dto/sign-up.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../users/entities/user.entity";
import { Repository } from "typeorm";
import { HashingService } from "../hashing/hashing.service";
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { SignInDTO } from './dto/sign-in.dto';
import { EncryptionService } from '../../common/encryption/encryption.service';
import { MYSQL_VIOLATION_ERROR_CODES } from '../../common/utils/mysql-violation-error-codes';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtConfigContract } from '../contracts/jwt.config.contract';
import { CookieToken } from '@interfaces/cookie-tokens.contract';

export class AuthenticationService{

  private _jwtConfig : JwtConfigContract;

  constructor(
    @InjectRepository(User) private readonly _usersRepository: Repository<User>,
    private readonly _hashingService: HashingService,
    private readonly _encryptionService: EncryptionService,
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService
  ){
    this._jwtConfig = this._configService.get<JwtConfigContract>("jwt");
  }

  async signUp( signUpDTO:SignUpDTO){

    try{
      const user = new User();
      user.email = signUpDTO.email;
      user.password = await this._hashingService.generate(signUpDTO.password);
      await this._usersRepository.save(user);
    }catch(err){
      const mysqlUniqueValidationErrorCode = MYSQL_VIOLATION_ERROR_CODES.unique;

      if(err.code === mysqlUniqueValidationErrorCode){
        throw new ConflictException();
      }
      throw err;
    }
  }

  async signIn(signInDTO:SignInDTO){
    const encryptedUsers = await this._usersRepository.find({select:["email", "password"]});
    const decryptedUsers = User.decrypt(encryptedUsers, this._encryptionService);

    const user = decryptedUsers?.find(({email})=> email === signInDTO.email);

    if(!user){
      throw new UnauthorizedException('User does not exists');
    }

    const isEqual = await this._hashingService.isMatch(
      signInDTO.password,
      user.password
    );

    if(!isEqual){
      throw new UnauthorizedException('Password does not match');
    }

    return this._generateTokens(user)

  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
  try{
    const { sub } = await this._jwtService.verifyAsync<
    Pick<ActiveUserContract, 'sub'>>( refreshTokenDto.refreshToken,{
      secret: this._jwtConfig.secret,
      audience: this._jwtConfig.audience,
      issuer: this._jwtConfig.issuer
    })

    const user = await this._usersRepository.findOneByOrFail({
        id: sub
      })

      return this._generateTokens(user)

    }catch(err){
      throw new UnauthorizedException();
    }
  }

  private async signToken<T>(userId:number, expiresIn: number, payload?:T) {

    return await this._jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this._jwtConfig.audience,
        issuer: this._jwtConfig.issuer,
        secret: this._jwtConfig.secret,
        expiresIn,
      }
    );
  }

  private async _generateTokens(user: UserContract){
    const accessTokenPromise = this.signToken<Partial<ActiveUserContract>>(
      user.id,
    this._jwtConfig.accessTokenTtl,
    {email: user.email}
    );

    const refreshTokenPromise = this.signToken<Partial<ActiveUserContract>>(
      user.id,
      this._jwtConfig.refreshTokenTtl
    );

    const [accessToken, refreshToken] = await Promise.all([accessTokenPromise, refreshTokenPromise]);

    const accessTokenExpInMilliseconds = this._jwtService.decode<ActiveUserContract>(accessToken)?.exp * 1000;
    const refreshTokenExpInMilliseconds = this._jwtService.decode<ActiveUserContract>(refreshToken)?.exp * 1000;

    const accessTokenExpDate = new Date(accessTokenExpInMilliseconds);
    const refreshTokenExpDate = new Date(refreshTokenExpInMilliseconds);

    return {
      [CookieToken.AccessToken]:accessToken,
      [CookieToken.RefreshToken]:refreshToken,
      refreshTokenExpDate,
      accessTokenExpDate
    }
  }


}
