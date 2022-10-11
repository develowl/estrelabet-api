import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { IS_PUBLIC_KEY } from '../../decorators/public.route.decorator'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    const jwtRefreshGuard = this.reflector.getAllAndOverride<boolean>('jwt-refresh', [
      context.getHandler(),
      context.getClass()
    ])

    if (isPublic || jwtRefreshGuard) {
      return true
    }
    return super.canActivate(context)
  }
}
