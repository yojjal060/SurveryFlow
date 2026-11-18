import { z } from "zod";

export const responseSchema = z.record(z.string(), z.never());
