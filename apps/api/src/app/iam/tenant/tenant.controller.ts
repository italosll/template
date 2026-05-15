import { CookieToken } from "@interfaces/cookie-tokens.contract";
import {
  Body,
  Controller,
  Get,
  Post
} from "@nestjs/common";
import { TenantService } from "./tenant.service";
import { SignUpDTO } from "../dto/sign-up.dto";
 

@Controller("tenants")
export class TenantController {
  constructor(private readonly _tenantService: TenantService) {}

  @Get()
  getAllTenants() {
    return this._tenantService.getAlltenants();
  }

  @Post("sign-up")
  signUp(@Body() signUpDTO: SignUpDTO) {
      console.log("signUpDTO", signUpDTO);

    return this._tenantService.signUp(signUpDTO); 
  }
}
