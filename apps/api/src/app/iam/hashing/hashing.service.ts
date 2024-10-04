export abstract class HashingService{
  abstract generate: (text:string) => Promise<string>;
  abstract isMatch: (text:string, hash:string) => Promise<boolean>
}
