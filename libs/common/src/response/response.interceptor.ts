import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { readPackageVersion } from "@app/common";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<never> {
    const version = readPackageVersion();
    // @ts-expect-error
    return next.handle().pipe(map((data) => ({data, version})));
  }
}
