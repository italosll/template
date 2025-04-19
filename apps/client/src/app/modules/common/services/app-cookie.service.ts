import { Injectable } from "@angular/core";

@Injectable()
export class CookieService {

    get(name: string) {
        const value = document.cookie;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
    }

    delete(name: string) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    }
}