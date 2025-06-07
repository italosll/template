import { registerAs } from "@nestjs/config";
import { HashConfigContract } from "../contracts/hash.config.contract";

export default registerAs("hash", () => {
  const hashRounds = process.env.HASH_ROUNDS;

  if (!hashRounds) {
    throw new Error(
      "HASH_ROUNDS environment variable is not set or is not a valid number"
    );
  }

  return {
    hashRounds: parseInt(hashRounds, 10),
  } as HashConfigContract;
});
